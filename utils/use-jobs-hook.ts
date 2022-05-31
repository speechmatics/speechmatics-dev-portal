import React, { useState, useEffect, useContext } from 'react'
import { callGetJobs, callDeleteJob } from './call-api';
import { useInterval } from './hooks';
import accountContext from '../utils/account-store-context';
import { languagesData } from '../utils/transcribe-elements'

export const useJobs = (limit, page) => {
  const [jobs, setJobs] = useState<JobElementProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noMoreJobs, setNoMoreJobs] = useState<boolean>(false);
  const [isWaitingOnMore, setIsWaitingOnMore] = useState<boolean>(false);
  const [errorOnInit, setErrorOnInit] = useState<boolean>(false);
  const [errorGettingMore, setErrorGettingMore] = useState<boolean>(false);
  const [createdBefore, setCreatedBefore] = useState<string>(null);
  const [isPolling, setIsPolling] = useState<boolean>(true);

  const maxlimit = 100;
  const { accountStore, tokenStore } = useContext(accountContext);
  const idToken = tokenStore.tokenPayload?.idToken;

  const getJobs = (loadingFunction, errorFunction) => {
    let isActive = true;
    if (idToken && !noMoreJobs) {
      errorFunction(false);
      loadingFunction(true);
      const queries: JobQuery = {
        limit: limit,
      };
      if (createdBefore != null) {
        queries.created_before = createdBefore;
      }
      callGetJobs(idToken, queries)
        .then((respJson) => {
          if (respJson?.jobs?.length === 0) {
            setNoMoreJobs(true)
            loadingFunction(false);
          } else if (isActive && !!respJson && 'jobs' in respJson) {
            const formatted: JobElementProps[] = formatJobs(respJson.jobs);
            if (formatted.some(item => item.status === 'running')) {
              setIsPolling(true)
            } else {
              setIsPolling(false)
            }
            const combinedArrays = Array.from(new Set([...jobs, ...formatted]));
            setCreatedBefore(respJson.jobs[respJson.jobs.length - 1].created_at)
            setJobs(combinedArrays);
            loadingFunction(false);
          }
        })
        .catch((err) => {
          errorFunction(true);
          loadingFunction(false);
        });
    }
    return () => {
      isActive = false;
    };
  };

  const pollJobStatuses = () => {
    let isActive = true;
    if (idToken && isPolling) {
      let newJobs = []
      const requests = []
      const requestNo = Math.ceil(jobs.length / maxlimit)
      if (requestNo !== 1) {
        for (let i = 0; i < requestNo; i++) {
          let createdBeforeTime = jobs[maxlimit * i]?.date?.toISOString();
          let query = { limit: maxlimit, created_before: createdBeforeTime }
          requests.push(callGetJobs(idToken, query))
        }
      } else {
        let createdBeforeTime = jobs[0]?.date?.toISOString();
        let query = { limit: jobs.length, created_before: createdBeforeTime }
        requests.push(callGetJobs(idToken, query))
      }
      Promise.all(requests).then(result => {
        for (const res of result) {
          if (isActive && !!res && 'jobs' in res) {
            newJobs = [...newJobs, ...res.jobs]
          }
        }
        if (isActive) {
          const formatted = formatJobs(newJobs)
          setJobs(formatted)
          if (newJobs.some(item => item.status === 'running')) {
            setIsPolling(true)
          } else {
            setIsPolling(false)
          }
        }
      })
    }
    return () => {
      isActive = false;
    };
  };
  
  useInterval(pollJobStatuses, 20000, isPolling)

  useEffect(() => {
    if (limit > maxlimit) {
      throw new Error("Limit cannot be more than " + maxlimit)
    }
    getJobs(setIsLoading, setErrorOnInit)
  }, [idToken, accountStore.account])
  
  useEffect(() => {
    if (!isLoading) {
      getJobs(setIsWaitingOnMore, setErrorGettingMore)
    }
  }, [page])

  const onDeleteJob = (id, force) => {
    if (idToken) {
      callDeleteJob(idToken, id, force)
        .then((response) => {
          if (!!response) {
            setJobs((oldJobs) => oldJobs.filter((item) => item.id !== id));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return {
    jobs,
    isLoading,
    isPolling,
    isWaitingOnMore,
    errorGettingMore,
    errorOnInit,
    noMoreJobs,
    onDeleteJob
  }
}

const formatJobs = (jobsResponse: JobsResponse[]) => {
  const formattedJobs: JobElementProps[] = jobsResponse.map((item) => {
    const newItem: JobElementProps = {
      id: item.id,
      status: item.status,
      date: new Date(item.created_at),
      duration: formatDuration(item.duration),
      fileName: item.data_name,
    };
    if (item?.config?.transcription_config != null) {
      newItem.language = mapLanguages(item?.config?.transcription_config?.language);
    }
    if (item?.config?.transcription_config?.operating_point != null) {
      newItem.accuracy = item.config.transcription_config.operating_point;
    } else {
      newItem.accuracy = 'standard';
    }
    return newItem;
  });
  return formattedJobs;
};

const formatDuration = (duration) => {
  const seconds = parseInt(duration);
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${Math.round(minutes)} minutes`;
  }
  const hours = (seconds / 60) * 60;
  if (hours < 24) {
    return `${Math.round(10 * hours) / 10} hours`;
  }
};

const mapLanguages = (lang) => {
  return languagesData.find((item) => item.value == lang).label;
};

export type JobElementProps = {
  status: 'running' | 'completed';
  fileName: string;
  date: Date;
  accuracy?: string;
  duration: string;
  language?: string;
  id: string;
};

type JobsResponse = {
  created_at: string;
  data_name: string;
  status: 'running' | 'completed';
  duration: string;
  id: string;
  config?: JobConfig;
};

type JobConfig = {
  type: 'transcription' | 'alignment';
  transcription_config: {
    language: string;
    operating_point?: 'standard' | 'enhanced';
  };
};

type JobQuery = {
  limit?: number;
  created_before?: string;
}
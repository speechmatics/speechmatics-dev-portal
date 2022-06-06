import React, { useState, useEffect, useContext, useCallback } from 'react';
import { callGetJobs, callDeleteJob } from './call-api';
import { useInterval } from './hooks';
import accountContext from '../utils/account-store-context';

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
  const { tokenStore } = useContext(accountContext);
  const idToken = tokenStore.tokenPayload?.idToken;

  const pollingCallback = useCallback(() => {
    pollJobStatuses(idToken, jobs, setJobs, isPolling, setIsPolling, maxlimit);
  }, [idToken, jobs, setJobs, isPolling, setIsPolling, maxlimit]);

  useInterval(pollingCallback, 20000, isPolling);

  useEffect(() => {
    // Check page size is lower than AP pagination max size
    if (limit > maxlimit) {
      throw new Error('Limit cannot be more than ' + maxlimit);
    }
    // return useEffect cleanup function from get Jobs
    return getJobs(
      idToken,
      jobs,
      setJobs,
      createdBefore,
      setCreatedBefore,
      limit,
      noMoreJobs,
      setNoMoreJobs,
      setIsPolling,
      setIsLoading,
      setErrorOnInit
    );
  }, [idToken]);

  useEffect(() => {
    // only use this hook after the initial load
    if (!isLoading && page > 0) {
      // return useEffect cleanup function from get Jobs
      return getJobs(
        idToken,
        jobs,
        setJobs,
        createdBefore,
        setCreatedBefore,
        limit,
        noMoreJobs,
        setNoMoreJobs,
        setIsPolling,
        setIsWaitingOnMore,
        setErrorGettingMore
      );
    }
  }, [page]);

  // could/should this be memoized? Not sure
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
    onDeleteJob,
  };
};

// This is mostly unchanged except it uses inputs rather than hooks
const getJobs = (
  idToken,
  jobs,
  setJobs,
  createdBefore,
  setCreatedBefore,
  limit,
  noMoreJobs,
  setNoMoreJobs,
  setIsPolling,
  loadingFunction,
  errorFunction
) => {
  let isActive = true;
  if (idToken && !noMoreJobs) {
    errorFunction(false);
    loadingFunction(true);
    const queries: JobQuery = {
      limit: limit,
    };
    if (createdBefore != null) {
      queries.created_before = addMillisecond(createdBefore);
    }
    callGetJobs(idToken, queries)
      .then((respJson) => {
        if (isActive && !!respJson && 'jobs' in respJson) {
          if (respJson?.jobs?.length < limit) {
            setNoMoreJobs(true);
            loadingFunction(false);
          }
          const formatted: JobElementProps[] = formatJobs(respJson.jobs);
          if (formatted.some((item) => item.status === 'running')) {
            setIsPolling(true);
          } else {
            setIsPolling(false);
          }
          const combinedArrays: JobElementProps[] = createSet(jobs, formatted, true);
          setCreatedBefore(respJson.jobs[respJson.jobs.length - 1].created_at);
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

// This is mostly unchanged except it uses inputs rather than hooks
// I added addMillisecond to get round the milli second precision in the polling endpoint. 
// Should be deprecated soon as the API fix will be coming
const pollJobStatuses = (idToken, jobs, setJobs, isPolling, setIsPolling, maxlimit) => {
  let isActive = true;
  if (idToken && isPolling) {
    let newJobs = [];
    const requests = [];
    const requestNo = Math.ceil(jobs.length / maxlimit);
    if (requestNo !== 1) {
      for (let i = 0; i < requestNo; i++) {
        let createdBeforeTime = jobs[maxlimit * i]?.date?.toISOString();
        let query = { limit: maxlimit, created_before: addMillisecond(createdBeforeTime) };
        requests.push(callGetJobs(idToken, query));
      }
    } else {
      let createdBeforeTime = jobs[0]?.date?.toISOString();
      let query = { limit: jobs.length, created_before: addMillisecond(createdBeforeTime) };
      requests.push(callGetJobs(idToken, query));
    }
    Promise.all(requests).then((result) => {
      for (const res of result) {
        if (isActive && !!res && 'jobs' in res) {
          newJobs = [...newJobs, ...res.jobs];
        }
      }
      if (isActive) {
        const formatted = formatJobs(newJobs);
        const combinedArrays: JobElementProps[] = createSet(jobs, formatted, false);
        setJobs(combinedArrays);
        if (newJobs.some((item) => item.status === 'running')) {
          setIsPolling(true);
        } else {
          setIsPolling(false);
        }
      }
    });
  }
  return () => {
    isActive = false;
  };
};

const formatJobs = (jobsResponse: JobsResponse[]) => {
  const formattedJobs: JobElementProps[] = jobsResponse.map((item) => {
    const newItem: JobElementProps = {
      id: item.id,
      status: item.status,
      date: new Date(item.created_at),
      duration: formatDuration(item.duration),
      fileName: item.data_name,
      language: item.config?.transcription_config?.language
    };
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

// JS inbuilt set only compares object references to doesn't exclude objects with identical values from being in the same set
// Therefore, I created a custom function to return a set of job objects
// The add arg allows us to combine arrays when getting jobs and only update current jobs for polling
const createSet = (first: JobElementProps[], second: JobElementProps[], add: boolean) => {
  for (const item of second) {
    const index = first.findIndex((el) => el.id === item.id);
    if (index === -1 && add) {
      first.push(item);
    } else if (index !== -1) {
      first[index] = item;
    }
  }
  return first;
};

// See above
const addMillisecond = (created) => {
  let tempTime = new Date(created).getTime();
  tempTime += 1;
  return new Date(tempTime).toISOString();
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
};

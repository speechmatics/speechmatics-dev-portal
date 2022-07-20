import React, { useState, useEffect, useCallback, Dispatch } from 'react';
import { callGetJobs, callDeleteJob } from './call-api';
import { useInterval } from './hooks';
import { errToast, infoToast } from '../components/common';
import { useIsAuthenticated } from '@azure/msal-react';
import { toast } from '@chakra-ui/react';

export const useJobs = (limit, page, includeDeleted) => {
  const [jobs, setJobs] = useState<JobElementProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noMoreJobs, setNoMoreJobs] = useState<boolean>(false);
  const [isWaitingOnMore, setIsWaitingOnMore] = useState<boolean>(false);
  const [errorOnInit, setErrorOnInit] = useState<boolean>(false);
  const [errorGettingMore, setErrorGettingMore] = useState<boolean>(false);
  const [errorGettingNewJob, setErrorGettingNewJob] = useState<boolean>(false);
  const [createdBefore, setCreatedBefore] = useState<string>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const authenticated = useIsAuthenticated();

  const maxlimit = 100;

  const pollingCallback = useCallback(() => {
    if (authenticated) pollJobStatuses(jobs, setJobs, isPolling, setIsPolling, maxlimit);
  }, [authenticated, jobs, setJobs, isPolling, setIsPolling, maxlimit]);

  useInterval(pollingCallback, 20000, isPolling);

  useEffect(() => {
    // Check page size is lower than API pagination max size
    if (limit > maxlimit) {
      throw new Error('Limit cannot be more than ' + maxlimit);
    }
    // return useEffect cleanup function from get Jobs
    if (authenticated) {
      return getJobs(
        jobs,
        setJobs,
        createdBefore,
        setCreatedBefore,
        limit,
        includeDeleted,
        setNoMoreJobs,
        setIsPolling,
        setIsLoading,
        setErrorOnInit
      );
    }
  }, [authenticated]);

  useEffect(() => {
    // only use this hook after the initial load
    if (!isLoading && page > 0 && authenticated) {
      // return useEffect cleanup function from get Jobs
      return getJobs(
        jobs,
        setJobs,
        createdBefore,
        setCreatedBefore,
        limit,
        includeDeleted,
        setNoMoreJobs,
        setIsPolling,
        setIsWaitingOnMore,
        setErrorGettingMore
      );
    }
  }, [authenticated, page]);

  // When removing a job, we want to avoid sudden jerky changes in box data/size, so we do:
  // 1. set invisible so it is hidden with an animation
  // 2. After timeout, reset its values to deleted and set it to visible again,
  //    so it reanimates into view if deleted jobs are shown
  // this allows a smooth transition for the user
  const onDeleteJob = useCallback(
    (id: string, force: boolean) => {
      if (authenticated) {
        callDeleteJob(id, force)
          .then((response) => {
            if (!!response) {
              setJobs((oldJobs) => {
                const index = oldJobs.findIndex((item) => item.id === id);
                oldJobs[index].visible = false;
                return [...oldJobs];
              });
              setTimeout(() => {
                setJobs((oldJobs) => {
                  const index = oldJobs.findIndex((item) => item.id === id);
                  oldJobs[index].visible = true;
                  oldJobs[index].status = 'deleted';
                  oldJobs[index].fileName = '';
                  return [...oldJobs];
                });
              }, 500);
            }
          })
          .catch((err) => {
            console.error(err);
            if (err.toastId) toast.close(err.toastId);
            infoToast(`Job already removed.`);
            forceGetJobs();
          });
      }
    },
    [authenticated, setJobs]
  );

  //for outside use
  const forceGetJobs = useCallback(() => {
    console.log('forceGetJobs', createdBefore, limit);
    getJobs(
      jobs,
      setJobs,
      null,
      (value) => {},
      limit,
      includeDeleted,
      setNoMoreJobs,
      setIsPolling,
      (value) => {},
      setErrorGettingNewJob
    );
  }, [authenticated, jobs]);

  return {
    jobs,
    isLoading,
    isPolling,
    isWaitingOnMore,
    errorGettingMore,
    errorOnInit,
    noMoreJobs,
    onDeleteJob,
    forceGetJobs,
    errorGettingNewJob
  };
};

const getJobs = (
  jobs: JobElementProps[],
  setJobs: Dispatch<JobElementProps[]>,
  createdBefore: string,
  setCreatedBefore: Dispatch<string>,
  limit: number,
  includeDeleted: boolean,
  setNoMoreJobs: Dispatch<boolean>,
  setIsPolling: Dispatch<boolean>,
  loadingFunction: Dispatch<boolean>,
  errorFunction: Dispatch<boolean>
) => {
  let isActive = true;
  errorFunction(false);
  loadingFunction(true);
  const queries: JobQuery = {
    limit: limit,
    include_deleted: includeDeleted
  };
  if (createdBefore != null) {
    queries.created_before = createdBefore;
  }
  callGetJobs(queries)
    .then((respJson) => {
      if (!respJson || !('jobs' in respJson) || respJson.jobs == null) {
        throw 'error geting jobs';
      }
      if (isActive) {
        if (respJson?.jobs?.length < limit) {
          setNoMoreJobs(true);
        }
        if (respJson.jobs.length !== 0) {
          const formatted: JobElementProps[] = formatJobs(respJson.jobs);
          const combinedArrays: JobElementProps[] = createSet(jobs, formatted, true);
          setCreatedBefore(respJson.jobs[respJson.jobs.length - 1].created_at);
          setJobs([...combinedArrays]);
          if (combinedArrays.some((item) => item.status === 'running')) {
            setIsPolling(true);
          } else {
            setIsPolling(false);
          }
        }
        loadingFunction(false);
      }
    })
    .catch((err) => {
      console.log(err);
      errorFunction(true);
      loadingFunction(false);
    });
  return () => {
    isActive = false;
  };
};

const pollJobStatuses = (
  jobs: JobElementProps[],
  setJobs: Dispatch<JobElementProps[]>,
  isPolling: boolean,
  setIsPolling: Dispatch<boolean>,
  maxlimit: number
) => {
  let isActive = true;
  if (isPolling) {
    let newJobs = [];
    const requests = [];
    const requestNo = Math.ceil(jobs.length / maxlimit);
    if (requestNo !== 1) {
      for (let i = 0; i < requestNo; i++) {
        let createdBeforeTime = jobs[maxlimit * i]?.date;
        let query = { limit: maxlimit, created_before: createdBeforeTime };
        requests.push(callGetJobs(query));
      }
    } else {
      let createdBeforeTime = jobs[0]?.date;
      let query = { limit: jobs.length, created_before: createdBeforeTime };
      requests.push(callGetJobs(query));
    }
    Promise.all(requests).then((result) => {
      if (isActive && isPolling) {
        for (const res of result) {
          if (!!res && 'jobs' in res) {
            newJobs = [...newJobs, ...res.jobs];
          }
        }
        const formatted: JobElementProps[] = formatJobs(newJobs);
        const combinedArrays: JobElementProps[] = createSet(jobs, formatted, false);
        setJobs([...combinedArrays]);
        if (!combinedArrays.some((item) => item.status === 'running')) {
          setIsPolling(false);
        }
      }
    });
  }
  return () => {
    isActive = false;
  };
};

const formatJobs = (jobsResponse: JobsResponse[]): JobElementProps[] => {
  const formattedJobs: JobElementProps[] = jobsResponse.map((item) => {
    const newItem: JobElementProps = {
      id: item.id,
      status: item.status,
      date: item.created_at,
      duration: item.duration ? formatDuration(item.duration) : null,
      fileName: item.data_name,
      language: item.config?.transcription_config?.language,
      key: item.id,
      visible: true
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

const formatDuration = (duration: string): string => {
  const seconds = parseInt(duration);
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  const minutes = seconds / 60;
  if (minutes < 60) {
    let roundedMinutes = Math.round(minutes);
    return `${roundedMinutes} minute${roundedMinutes !== 1 ? 's' : ''}`;
  }
  const hours = seconds / (60 * 60);
  if (hours < 24) {
    let roundedHours = Math.round(10 * hours) / 10;
    return `${roundedHours} hour${roundedHours !== 1 ? 's' : ''}`;
  }
  const days = seconds / (60 * 60 * 24);
  let roundedDays = Math.round(10 * days) / 10;
  return `${roundedDays} day${roundedDays !== 1 ? 's' : ''}`;
};

// JS inbuilt set only compares object references to doesn't exclude objects with identical values from being in the same set
// Therefore, I created a custom function to return a set of job objects
// The add arg allows us to combine arrays when getting jobs and only update current jobs for polling
const createSet = (
  first: JobElementProps[],
  second: JobElementProps[],
  add: boolean
): JobElementProps[] => {
  for (const item of second) {
    const index = first.findIndex((el) => el.id === item.id);
    if (index === -1 && add) {
      first.push(item);
    } else if (index !== -1) {
      first[index] = item;
    }
  }

  return first.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export type JobElementProps = {
  status: 'running' | 'completed' | 'done' | 'rejected' | 'deleted';
  fileName: string;
  date: string;
  accuracy?: string;
  duration: string;
  language?: string;
  id: string;
  key: string;
  visible: boolean;
};

type JobsResponse = {
  created_at: string;
  data_name: string;
  status: 'running' | 'completed' | 'done' | 'rejected' | 'deleted';
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
  include_deleted?: boolean;
};

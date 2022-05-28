import {
  Box,
  HStack,
  VStack,
  Button,
  SkeletonCircle,
  SkeletonText,
  Spinner,
  Tooltip,
  Menu,
  MenuButton,
  IconButton,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState, useContext, useCallback } from 'react';
import {
  ErrorBanner,
  ConfirmRemoveModal,
  HeaderLabel,
  UsageInfoBanner,
} from './common';
import { DownloadIcon, ViewEyeIcon, StopIcon, BinIcon } from './icons-library';
import { callGetJobs, callGetTranscript, callDeleteJob } from '../utils/call-api';
import { useInterval } from '../utils/hooks';
import accountContext from '../utils/account-store-context';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter } from '../utils/string-utils';
import { TranscriptDownloadMenu } from './transcript-download-menu';
import { TranscriptionViewerProps, TranscriptionViewer } from './transcription-viewer';

export const RecentJobs = observer(() => {
  const [jobs, setJobs] = useState<RecentJobElementProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noMoreJobs, setNoMoreJobs] = useState<boolean>(false);
  const [isWaitingOnMore, setIsWaitingOnMore] = useState<boolean>(false);
  const [activeJob, setActiveJob] = useState<TranscriptionViewerProps & { fileName: string }>(null);
  const [transcriptOpen, setTranscriptOpen] = useState<boolean>(false);
  const [errorOnInit, setErrorOnInit] = useState<boolean>(false);
  const [errorGettingMore, setErrorGettingMore] = useState<boolean>(false);
  const [createdBefore, setCreatedBefore] = useState<string>(null);
  const [deleteJobId, setDeleteJobId] = useState<string>(null);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const pageLimit = 20;
  const maxPageLimit = 100;
  const { accountStore, tokenStore } = useContext(accountContext);
  const idToken = tokenStore.tokenPayload?.idToken;
  const router = useRouter();
  const executeScroll = useCallback((node) => {
    node?.scrollIntoView({ behaviour: 'smooth', block: 'center' });
  }, []);


  //can that be declared as an external function of the component?
  //possible to make a custom hook of it, including the relevant states and returning them

  const getJobs = (loadingFunction, errorFunction) => {
    let isActive = true;
    if (idToken && accountStore.account && !noMoreJobs) {
      errorFunction(false);
      loadingFunction(true);
      const queries: JobQuery = {
        limit: pageLimit,
      };
      if (createdBefore != null) {
        queries.created_before = createdBefore;
      }
      callGetJobs(idToken, accountStore.getContractId(), accountStore.getProjectId(), queries)
        .then((respJson) => {
          if (respJson?.jobs?.length === 0) {
            setNoMoreJobs(true)
            loadingFunction(false);
          } else if (isActive && !!respJson && 'jobs' in respJson) {
            const formatted: RecentJobElementProps[] = formatJobs(respJson.jobs);
            if (formatted.some(item => item.status === 'running')) {
              setIsPolling(true)
            } else {
              setIsPolling(true)
            }
            const combinedArrays = Array.from(new Set([...jobs, ...formatted]));
            setCreatedBefore(respJson.jobs[respJson.jobs.length - 1].created_at)
            setJobs(combinedArrays);
            loadingFunction(false);
            isActive = false;
          }
        })
        .catch((err) => {
          errorFunction(true);
          loadingFunction(false);
          isActive = false;
        });

      //michal: it wont work as effect clean up
      return () => {
        isActive = false;
      };
    }
  };

  //same here, perhaps it's worth to create a custom hook instead of declaring a lenghty function here 
  // inside of component, remember component function is being rerun every time something change (state / props)
  // if it's too complex to create refactor it out of this scope, it's worth to use useCallback
  const pollJobStatuses = () => {
    let isActive = true;
    if (idToken && accountStore.account && !noMoreJobs) {
      let newJobs = []
      const requests = []
      const requestNo = Math.ceil(jobs.length / maxPageLimit)
      if (requestNo !== 1) {
        for (let i = 0; i < requestNo; i++) {
          console.log(i)
          let createdBeforeTime = jobs[maxPageLimit * i]?.date?.toISOString();
          let query = { limit: maxPageLimit, created_before: createdBeforeTime }
          requests.push(callGetJobs(idToken, accountStore.getContractId(), accountStore.getProjectId(), query))
        }
      } else {
        let createdBeforeTime = jobs[0]?.date?.toISOString();
        let query = { limit: jobs.length, created_before: createdBeforeTime }
        requests.push(callGetJobs(idToken, accountStore.getContractId(), accountStore.getProjectId(), query))
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
            setIsPolling(true)
          }
        }
      })
      //michal: it wont work as effect clean up, the function is being called inside of effect
      return () => {
        isActive = false;
      };
    }
  };

  //useCallback could be helpful here
  const onOpenTranscript = (job, format: string) => {
    if (idToken && accountStore.account) {

      //what if we'd have to wait for a longer time for the response? case not handled
      callGetTranscript(idToken, job.jobId, format)
        .then((response) => {
          if (!!response) {
            setActiveJob({
              date: job.date,
              jobId: job.jobId,
              accuracy: job.accuracy,
              language: job.language,
              transcriptionText: response,
              fileName: job.fileName,
            });
            setTranscriptOpen(true);
          }
        })
    }
  };

  //useCallback could be helpful here
  const onOpenDeleteDialogue = (id) => {
    setDeleteJobId(id)
    onOpen()
  }

  const onDeleteJob = (id, force) => {
    if (idToken && accountStore.account) {
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

  useEffect(() => {
    getJobs(setIsLoading, setErrorOnInit);
    //return, for unmounting, should be here to not affect the stage while gone
  }, [idToken, accountStore.account]);

  useInterval(pollJobStatuses, 20000, isPolling)

  return (
    <>
      <HeaderLabel>Recent Transcription Jobs</HeaderLabel>
      <UsageInfoBanner text="Transcripts are removed after 7 days." width='100%' bg='smBlue.100' centered />
      <VStack spacing={6} mt={6}>
        {isLoading && new Array(pageLimit).fill(LoadingJobsSkeleton())}
        {!errorOnInit &&
          !isLoading &&
          jobs?.map((el, i) => {
            return (
              <RecentJobElement
                active={el.id === router.query.job}
                onSetRef={el.id === router.query.job ? executeScroll : () => { }}
                key={el.id + i}
                {...el}
                onOpenTranscript={onOpenTranscript}
                onStartDelete={onOpenDeleteDialogue}
              />
            );
          })}
        {errorGettingMore && <ErrorBanner text="Error getting more jobs" />}
        {errorOnInit && <ErrorBanner text="We couldn't get your jobs" />
        }
        <Button
          hidden={errorOnInit}
          disabled={isLoading || isWaitingOnMore || errorGettingMore || noMoreJobs}
          variant="speechmatics"
          onClick={(e) => {
            e.preventDefault();
            getJobs(setIsWaitingOnMore, setErrorGettingMore);
          }}
          width="100%"
        >
          {!isLoading && !isWaitingOnMore && !noMoreJobs && 'Show More'}
          {isLoading || (isWaitingOnMore && <Spinner />)}
          {noMoreJobs && 'No More Jobs'}
        </Button>
      </VStack>
      <Modal
        size="4xl"
        motionPreset="slideInBottom"
        scrollBehavior="inside"
        isCentered={true}
        isOpen={transcriptOpen}
        onClose={() => setTranscriptOpen(false)}
      >
        <ModalOverlay rounded="none" />
        <ModalContent p={4} rounded="none" h="70vh">
          <ModalHeader fontSize="2em" textAlign="center">
            Transcription of "{activeJob?.fileName}"
          </ModalHeader>
          <ModalCloseButton
            _hover={{ bg: "smBlack.200" }}
            _focus={{}}
            _active={{ bg: "smBlack.300" }}
            position="absolute"
            rounded="full"
            bg="smWhite.500"
            border="2px solid"
            borderColor="smBlack.300"
            color="smBlack.300"
            top={-4}
            right={-4}
          />
          <ModalBody>
            <TranscriptionViewer {...activeJob} transcMaxHeight='38vh' />
          </ModalBody>
        </ModalContent>
      </Modal>
      <ConfirmRemoveModal
        isOpen={isOpen}
        onClose={onClose}
        mainTitle='Delete Job'
        subTitle='Are you sure you want to delete this job?'
        onRemoveConfirm={() => {
          onDeleteJob(deleteJobId, true)
          onClose()
        }}
        confirmLabel='Delete'
      />
    </>
  );
});

//I removed observer here a while ago, the component render relies only on props, 
// observer is only used when it relies also on the mobx store.
const RecentJobElement = ({
  status,
  fileName,
  date,
  accuracy,
  duration,
  language,
  id,
  onSetRef,
  active,
  onOpenTranscript,
  onStartDelete,
}: RecentJobElementProps & JobModalProps) => {
  return (
    <HStack
      id={id}
      ref={onSetRef}
      border="1px solid"
      borderColor={active ? 'smGreen.300' : 'smBlack.200'}
      bg={active ? 'smGreen.200' : null}
      borderLeft="3px solid"
      borderLeftColor={statusColour[status]}
      width="100%"
      _hover={{ bg: 'smBlack.100' }}
    >
      <VStack alignItems="flex-start" p={4} flex={2}>
        <Box fontFamily="RMNeue-bold" as="span" width="90%" paddingRight="4px" color="smNavy.400">
          {fileName}
        </Box>
        <HStack
          fontSize="0.8em"
          color="smNavy.350"
          width="90%"
          spacing={4}
          justifyContent="space-between"
        >
          <Box flex={2} fontFamily="RMNeue-bold" whiteSpace="nowrap">
            <Tooltip placement="bottom" hasArrow color="smWhite.500" label="Date Submitted">
              {formatDate(date)}
            </Tooltip>
          </Box>
          <Box flex={1}>
            <Tooltip flex={1} placement="bottom" hasArrow color="smWhite.500" label="Model Accuracy">
              {capitalizeFirstLetter(accuracy)}
            </Tooltip>
          </Box>
          <Box flex={1}>
            <Tooltip placement="bottom" hasArrow color="smWhite.500" label="Job Running Time">
              {duration}
            </Tooltip>
          </Box>
          <Box flex={1}>
            <Tooltip placement="bottom" hasArrow color="smWhite.500" label="Audio Language">
              {language}
            </Tooltip>
          </Box>
          <Box flex={1}>
            <Tooltip placement="bottom" hasArrow color="smWhite.500" label="Unique Job Identifier">
              {id}
            </Tooltip>
          </Box>
        </HStack>
      </VStack>
      <HStack flex={1} spacing={2} marginLeft={4} justifyContent="space-evenly">
        <HStack flex={2}>
          <Box w={2} h={2} rounded="full" bgColor={statusColour[status]} />
          <Box color={statusColour[status]}>{capitalizeFirstLetter(status)}</Box>
        </HStack>
        <Box flex={1}>
          <Menu isLazy>
            <MenuButton>
              <DownloadIcon fontSize={20} color="var(--chakra-colors-smNavy-350)" />
            </MenuButton>
            <TranscriptDownloadMenu jobId={id} status={status} />
          </Menu>
        </Box>
        {status === ('done' || 'completed') ? (
          <IconButton
            variant="unstyled"
            aria-label="stop-or-delete"
            onClick={(e) =>
              onOpenTranscript(
                {
                  jobId: id,
                  language,
                  accuracy,
                  date: formatDate(date),
                  fileName,
                },
                true
              )
            }
            _focus={{ boxShadow: 'none' }}
            flex={1}
            icon={<ViewEyeIcon fontSize="22" color="var(--chakra-colors-smNavy-350)" />}
          />
        ) : <Box flex={1} ><ViewEyeIcon fontSize="22" color="var(--chakra-colors-smNavy-200)" /> </Box>}
        <IconButton
          variant="unstyled"
          aria-label="stop-or-delete"
          onClick={(e) => onStartDelete(id)}
          flex={1}
          icon={status === 'running' ? <StopIcon fontSize="22" /> : <BinIcon fontSize="22" />}
        />
      </HStack>
    </HStack>
  );
};


const LoadingJobsSkeleton = () => {
  return (
    <HStack
      border="1px solid"
      borderColor="smBlack.200"
      borderLeft="3px solid"
      borderLeftColor="smBlack.200"
      width="100%"
    >
      <VStack alignItems="flex-start" p={4} flex={2}>
        <SkeletonText
          noOfLines={1}
          spacing={6}
          height="6"
          as="span"
          width="90%"
          paddingRight="4px"
          color="smNavy.400"
        />
        <HStack
          fontSize="0.8em"
          color="smNavy.350"
          width="100%"
          spacing={4}
          justifyContent="space-between"
        >
          <SkeletonText height="4" noOfLines={1} flex={2} whiteSpace="nowrap" />
          <SkeletonText height="4" noOfLines={1} flex={1} />
          <SkeletonText height="4" noOfLines={1} flex={1} />
          <SkeletonText height="4" noOfLines={1} flex={1} />
          <SkeletonText height="4" noOfLines={1} flex={1} />
        </HStack>
      </VStack>
      <HStack flex={1} justifyContent="space-evenly" spacing={4}>
        <SkeletonText noOfLines={1} flex={3} spacing={6} paddingRight={4} />
        <Box flex={1}>
          <SkeletonCircle />
        </Box>
        <Box flex={1}>
          <SkeletonCircle />
        </Box>
      </HStack>
    </HStack>
  );
};

const mapLanguages = (lang) => {
  const languages: any[] = [
    {
      code: 'en',
      language: 'English',
    },
  ];
  return languages.find((item) => item.code == lang).language;
};

const statusColour = {
  rejected: 'smRed.500',
  done: 'smGreen.500',
  completed: 'smGreen.500',
  running: 'smOrange.400',
};

const formatJobs = (jobsResponse: JobsResponse[]) => {
  const formattedJobs: RecentJobElementProps[] = jobsResponse.map((item) => {
    const newItem: RecentJobElementProps = {
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

const formatDate = (date) => {
  let string = `${date.getUTCDate()} ${date.toLocaleString('default', {
    month: 'short',
  })} ${date.getFullYear()}`;
  let hours = date.getUTCHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  string += ` ${hours}:`;
  let minutes = date.getUTCMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return (string += minutes);
};


type RecentJobElementProps = {
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

type JobModalProps = {
  active?: boolean;
  onSetRef?: any;
  onOpenTranscript?: Function;
  onStartDelete?: Function;
};

type JobQuery = {
  limit?: number;
  created_before?: string;
}
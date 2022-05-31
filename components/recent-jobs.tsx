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
import { callGetTranscript } from '../utils/call-api';
import accountContext from '../utils/account-store-context';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter } from '../utils/string-utils';
import { TranscriptDownloadMenu } from './transcript-download-menu';
import { TranscriptionViewerProps, TranscriptionViewer } from './transcription-viewer';
import { TranscriptFormat } from '../utils/transcribe-elements'
import { JobElementProps, useJobs } from '../utils/use-jobs-hook'
import { runtimeAuthFlow as authFlow } from '../utils/runtime-auth-flow';

export const RecentJobs = observer(() => {
  const [activeJob, setActiveJob] = useState<TranscriptionViewerProps & { fileName: string }>(null);
  const [transcriptOpen, setTranscriptOpen] = useState<boolean>(false);
  const [deleteJobId, setDeleteJobId] = useState<string>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState<number>(0)
  const pageLimit = 20;
  const { accountStore, tokenStore } = useContext(accountContext);
  const idToken = tokenStore.tokenPayload?.idToken;
  const router = useRouter();
  const executeScroll = useCallback((node) => {
    node?.scrollIntoView({ behaviour: 'smooth', block: 'center' });
  }, []);

  const {
    jobs,
    isLoading,
    isPolling,
    isWaitingOnMore,
    errorGettingMore,
    errorOnInit,
    noMoreJobs,
    onDeleteJob
  } = useJobs(pageLimit, page)

  const onOpenTranscript = (job, format: TranscriptFormat) => {
    let isActive = true
    if (idToken) {
      callGetTranscript(idToken, job.jobId, format)
        .then((response) => {
          if (!!response && isActive) {
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
    return () => {
      isActive = false
    }
  };

  const onOpenDeleteDialogueCallback = useCallback((id) => {
    setDeleteJobId(id)
    onOpen()
  }, [setDeleteJobId])

  useEffect(() => {
    authFlow.restoreToken()
  }, [idToken, accountStore.account]);

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
                onStartDelete={onOpenDeleteDialogueCallback}
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
            setPage(page + 1)
            // getJobs(setIsWaitingOnMore, setErrorGettingMore);
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
}: JobElementProps & JobModalProps) => {
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
                'txt'
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

const statusColour = {
  rejected: 'smRed.500',
  done: 'smGreen.500',
  completed: 'smGreen.500',
  running: 'smOrange.400',
};

const formatDate = (date) => {
  let string = `${date.getUTCDate()} ${date.toLocaleString('default', {
    month: 'short',
  })} ${date.getFullYear()}`;
  let hours = date.getHours();
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

type JobModalProps = {
  active?: boolean;
  onSetRef?: any;
  onOpenTranscript?: Function;
  onStartDelete?: Function;
};
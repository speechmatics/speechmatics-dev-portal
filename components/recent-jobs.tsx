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
  Link,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { ErrorBanner, ConfirmRemoveModal, WarningBanner, NoSomethingBanner } from './common';
import { DownloadIcon, ViewEyeIcon, StopIcon, BinIcon } from './icons-library';
import { callGetTranscript } from '../utils/call-api';
import accountContext from '../utils/account-store-context';
import { capitalizeFirstLetter } from '../utils/string-utils';
import { TranscriptDownloadMenu } from './transcript-download-menu';
import { TranscriptionViewerProps, TranscriptionViewer } from './transcription-viewer';
import { TranscriptFormat } from '../utils/transcribe-elements';
import { JobElementProps, useJobs } from '../utils/use-jobs-hook';
import { runtimeAuthFlow as authFlow } from '../utils/runtime-auth-flow';
import { languagesData } from '../utils/transcribe-elements';

export const RecentJobs = observer(() => {
  const [activeJob, setActiveJob] = useState<TranscriptionViewerProps & { fileName: string }>(null);
  const [transcriptOpen, setTranscriptOpen] = useState<boolean>(false);
  const [deleteJobId, setDeleteJobId] = useState<string>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState<number>(0);
  const pageLimit = 20;
  const { accountStore, tokenStore } = useContext(accountContext);
  const idToken = tokenStore.tokenPayload?.idToken;

  const {
    jobs,
    isLoading,
    isPolling,
    isWaitingOnMore,
    errorGettingMore,
    errorOnInit,
    noMoreJobs,
    onDeleteJob,
  } = useJobs(pageLimit, page);

  // converted to callback to avoid rerendering when useJobs hook state changes
  const onOpenTranscript = useCallback(
    (job, format: TranscriptFormat) => {
      if (idToken) {
        callGetTranscript(idToken, job.jobId, format).then((response) => {
          if (!!response) {
            setActiveJob({
              date: job.date,
              jobId: job.jobId,
              accuracy: job.accuracy,
              language: job.language,
              transcriptionText: response,
              fileName: job.fileName,
            });
            console.log(activeJob)
            setTranscriptOpen(true);
          }
        });
      }
    },
    [idToken, activeJob]
  );

  // converted to callback to avoid rerendering when useJobs hook state changes
  const onOpenDeleteDialogue = useCallback(
    (id) => {
      setDeleteJobId(id);
      onOpen();
    },
    [setDeleteJobId]
  );

  useEffect(() => {
    authFlow.restoreToken();
  }, [idToken, accountStore.account]);

  const skeletons = useMemo(() => Array.from({ length: 4 }).map((_, i) => LoadingJobsSkeleton(i)), [])

  return (
    <>
      {!isLoading && jobs?.length !== 0 && <WarningBanner
        text="Transcriptions and audio files are automatically deleted after 7 days."
        width="100%"
        centered
      />}
      <VStack spacing={6} pt={6} width='100%'>
        {isLoading && skeletons}
        {!errorOnInit &&
          !isLoading &&
          jobs?.map((el, i) => {
            return (
              <RecentJobElement
                key={el.id + i}
                {...el}
                onOpenTranscript={onOpenTranscript}
                onStartDelete={onOpenDeleteDialogue}
              />
            );
          })}
        {errorGettingMore && <ErrorBanner text="Error getting more jobs" />}
        {errorOnInit && <ErrorBanner text="We couldn't get your jobs" />}
        {jobs?.length !== 0 && <Button
          hidden={errorOnInit}
          disabled={isLoading || isWaitingOnMore || errorGettingMore || noMoreJobs}
          variant="speechmatics"
          onClick={(e) => {
            setPage(page + 1);
          }}
          width="100%"
        >
          {!isLoading && !isWaitingOnMore && !noMoreJobs && 'Show More'}
          {isLoading || (isWaitingOnMore && <Spinner />)}
          {noMoreJobs && 'No More Jobs'}
        </Button>
        }
        {jobs?.length === 0 && noMoreJobs && <VStack pb={6} spacing={6}>
          <NoSomethingBanner>No jobs found.</NoSomethingBanner>
          <Box>
            {/* Text inside button is underlined on hover, needs to be altered */}
            <Link href="/transcribe/">
              <Button variant="speechmatics" alignSelf="flex-start">
                Transcribe Now
              </Button>
            </Link>
          </Box>
        </VStack>}
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
            _hover={{ bg: 'smBlack.200' }}
            _focus={{}}
            _active={{ bg: 'smBlack.300' }}
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
            <TranscriptionViewer {...activeJob} transcMaxHeight="38vh" />
          </ModalBody>
        </ModalContent>
      </Modal>
      <ConfirmRemoveModal
        isOpen={isOpen}
        onClose={onClose}
        mainTitle="Delete Job"
        subTitle="Are you sure you want to delete this job?"
        onRemoveConfirm={() => {
          onDeleteJob(deleteJobId, true);
          onClose();
        }}
        confirmLabel="Delete"
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
  onOpenTranscript,
  onStartDelete,
}: JobElementProps & JobModalProps) => {
  return (
    <HStack
      id={id}
      border="1px solid"
      borderColor='smBlack.200'
      borderLeft="3px solid"
      borderLeftColor={statusColour[status]}
      width="100%"
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
            <Tooltip placement="bottom" hasArrow color="smWhite.500" label="Time Submitted">
              {date ? formatDate(date) : 'Unknown'}
            </Tooltip>
          </Box>
          <Box flex={1}>
            <Tooltip
              flex={1}
              placement="bottom"
              hasArrow
              color="smWhite.500"
              label="Accuracy"
            >
              {accuracy ? capitalizeFirstLetter(accuracy) : 'Unknown'}
            </Tooltip>
          </Box>
          <Box flex={1}>
            <Tooltip placement="bottom" hasArrow color="smWhite.500" label="Audio Duration">
              {duration || "Unknown"}
            </Tooltip>
          </Box>
          <Box flex={1}>
            <Tooltip placement="bottom" hasArrow color="smWhite.500" label="Audio Language">
              {language ? mapLanguages(language) : 'Unknown'}
            </Tooltip>
          </Box>
          <Box flex={1}>
            <Tooltip placement="bottom" hasArrow color="smWhite.500" label="Unique Job ID">
              {id ? id : 'Unknown'}
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
            <Tooltip placement="bottom" hasArrow color="smWhite.500" label="Download">
              <MenuButton as={IconButton} variant="ghost"
                aria-label="view" icon={<DownloadIcon fontSize={20} color="var(--chakra-colors-smNavy-350)" />}>
              </MenuButton>
            </Tooltip>
            <TranscriptDownloadMenu jobId={id} status={status} />
          </Menu>
        </Box>
        {status === ('done' || 'completed') ? (
          <Box flex={1}>
            <Tooltip placement="bottom" hasArrow color="smWhite.500" label="View">
              <IconButton
                variant="ghost"
                aria-label="view"
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
                icon={<ViewEyeIcon fontSize="22" color="var(--chakra-colors-smNavy-350)" />}
              />
            </Tooltip>
          </Box>

        ) : (
          <Flex flex={1} >
            <Box pl={2}>
              <ViewEyeIcon fontSize="22" color="var(--chakra-colors-smNavy-200)" />
            </Box>
          </Flex>
        )}
        <Box flex={1}>
          <Tooltip placement="bottom" hasArrow color="smWhite.500"
            label={status === 'running' ? 'Cancel' : 'Delete'}>
            <IconButton
              variant="ghost"
              aria-label="stop-or-delete"
              onClick={(e) => onStartDelete(id)}
              flex={1}
              icon={status === 'running' ? <StopIcon fontSize="22" /> : <BinIcon fontSize="22" />}
            />
          </Tooltip>
        </Box>
      </HStack>
    </HStack>
  );
};

const LoadingJobsSkeleton = (key: any) => {
  return (
    <HStack
      key={key}
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

const mapLanguages = (lang) => {
  return languagesData.find((item) => item.value == lang).label;
};

type JobModalProps = {
  onOpenTranscript?: Function;
  onStartDelete?: Function;
};

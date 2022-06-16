import {
  Box,
  HStack,
  VStack,
  Button,
  SkeletonCircle,
  SkeletonText,
  Text,
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
  Link,
  useBreakpointValue,
  Switch,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { List, WindowScroller } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import AutoSizer from 'react-virtualized-auto-sizer'
import { useEffect, useState, useContext, useCallback, useMemo, useRef } from 'react';
import {
  ErrorBanner,
  ConfirmRemoveModal,
  WarningBanner,
  NoSomethingBanner,
  UsageInfoBanner
} from './common';
import { BinIcon, ViewTranscriptionIcon, DownloadJobIcon } from './icons-library';
import { callGetTranscript } from '../utils/call-api';
import accountContext from '../utils/account-store-context';
import { capitalizeFirstLetter } from '../utils/string-utils';
import { TranscriptDownloadMenu } from './transcript-download-menu';
import { TranscriptionViewerProps, TranscriptionViewer } from './transcription-viewer';
import { TranscriptFormat } from '../utils/transcribe-elements';
import { JobElementProps, useJobs } from '../utils/use-jobs-hook';
import { runtimeAuthFlow as authFlow } from '../utils/runtime-auth-flow';
import { languagesData } from '../utils/transcribe-elements';
import { formatTimeDateFromString } from '../utils/date-utils';
import FilesBeingUploaded from './file-transcription/files-being-uploaded';

export const RecentJobs = observer(() => {
  const [activeJob, setActiveJob] = useState<TranscriptionViewerProps & { fileName: string }>(null);
  const [transcriptOpen, setTranscriptOpen] = useState<boolean>(false);
  const [deleteJobInfo, setDeleteJobInfo] = useState<{ id?: string; status?: string }>({});
  const [includeDeleted, setIncludeDeleted] = useState<boolean>(true)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState<number>(0);
  const pageLimit = 20;
  const { accountStore, tokenStore } = useContext(accountContext);
  const idToken = tokenStore.tokenPayload?.idToken;
  const breakVal = useBreakpointValue({
    base: false,
    xl: true
  });
  const listRef = useRef(null)

  const {
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
  } = useJobs(pageLimit, page, true);

  const onOpenTranscript = useCallback(
    (job, format: TranscriptFormat) => {
      if (idToken) {
        callGetTranscript(idToken, job.jobId, format).then((response) => {
          setActiveJob({
            date: job.date,
            jobId: job.jobId,
            accuracy: job.accuracy,
            language: job.language,
            transcriptionText: response,
            fileName: job.fileName
          });
          setTranscriptOpen(true);
        });
      }
    },
    [idToken, activeJob]
  );
  const filteredList = useMemo(() => {
    if (includeDeleted) return jobs
    return jobs.filter(item => item.status !== 'deleted')
  }, [jobs, includeDeleted])

  const renderItem = useCallback(({ index, key, style }) => {
    const job = filteredList[index];

    return (
      <Box
      key={key} style={style}>
        <RecentJobElement
          {...job}
          onOpenTranscript={onOpenTranscript}
          onStartDelete={onOpenDeleteDialogue}
        />
      </Box>
    );
  }, [filteredList])

  const onOpenDeleteDialogue = useCallback(
    (id, status) => {
      setDeleteJobInfo({ id, status });
      onOpen();
    },
    [setDeleteJobInfo]
  );

  useEffect(() => {
    authFlow.restoreToken();
  }, [idToken, accountStore.account]);

  const skeletons = useMemo(
    () => Array.from({ length: 4 }).map((_, i) => LoadingJobsSkeleton(i, breakVal)),
    [breakVal]
  );

  return (
    <>
      {!isLoading && jobs?.length !== 0 && (
        <WarningBanner
          text='Transcriptions and media files are automatically deleted after 7 days.'
          width='100%'
          centered
        />
      )}

      <FilesBeingUploaded forceGetJobs={forceGetJobs} />

      {errorGettingNewJob && <ErrorBanner text="We couldn't get your recently uploaded jobs." />}
      <VStack ref={listRef} spacing={6} pt={6} width='100%'>
        {isLoading && skeletons}

        {!errorOnInit &&
          !isLoading && jobs.length > 0 &&
          <HStack w="100%" justifyContent="end">
            <Text color='smBlack.300' fontFamily='RMNeue-Bold' fontSize='0.9em'>Show deleted jobs:</Text>
            <Switch colorScheme="teal" size="md" isChecked={includeDeleted} onChange={() => setIncludeDeleted(!includeDeleted)} />
          </HStack>
        }
        {!errorOnInit &&
          !isLoading &&
          jobs.length > 0 &&
            <WindowScroller scrollingResetTimeInterval={1200}>
              {({ height }) => (
              <List
                estimatedRowHeight={100}
                width={1}
                rowHeight={100}
                height={height}
                autoHeight
                overscanRowCount={10}
                containerStyle={{
                  width: "100%",
                  maxWidth: "100%"
                }}
                style={{
                  width: "100%"
                }}
                rowCount={filteredList.length}
                rowRenderer={renderItem}>
              </List>
            )}
            </WindowScroller>
        }
        {errorGettingMore && <ErrorBanner text='Error getting more jobs' />}
        {errorOnInit && <ErrorBanner text="We couldn't get your jobs" />}
        {jobs?.length !== 0 && !noMoreJobs && (
          <Button
            hidden={errorOnInit}
            disabled={isLoading || isWaitingOnMore || errorGettingMore || noMoreJobs}
            variant='speechmatics'
            onClick={(e) => {
              setPage(page + 1);
            }}
            width='100%'>
            {!isLoading && !isWaitingOnMore && !noMoreJobs && 'Show More'}
            {isLoading || (isWaitingOnMore && <Spinner />)}
          </Button>
        )}
        {noMoreJobs && jobs.length > pageLimit && (
          <Box width='100%' textAlign='center' fontSize='.8em' color='smBlack.250'>
            The page is showing the full list.
          </Box>
        )}
        {!errorOnInit && !isLoading && jobs?.length !== 0 && (
          <UsageInfoBanner text='All times are reported in UTC.' mt='2em' />
        )}
        {!isLoading && !errorOnInit && jobs?.length === 0 && noMoreJobs && (
          <VStack pb={6} spacing={6}>
            <NoSomethingBanner>No jobs found.</NoSomethingBanner>
            <Box>
              {/* Text inside button is underlined on hover, needs to be altered */}
              <Link href='/transcribe/'>
                <Button variant='speechmatics' alignSelf='flex-start'>
                  Transcribe Now
                </Button>
              </Link>
            </Box>
          </VStack>
        )}
      </VStack>
      <Modal
        size='4xl'
        motionPreset='slideInBottom'
        scrollBehavior='inside'
        isCentered={true}
        isOpen={transcriptOpen}
        onClose={() => setTranscriptOpen(false)}>
        <ModalOverlay rounded='none' />
        <ModalContent maxH='100%' py={4} rounded='none'>
          <ModalHeader fontSize='2em' textAlign='center'>
            <Text overflow='hidden' noOfLines={2}>
              Transcription of "{activeJob?.fileName}"
            </Text>
          </ModalHeader>
          <ModalCloseButton
            _hover={breakVal ? { bg: 'smBlack.200' } : null}
            _focus={{}}
            _active={breakVal ? { bg: 'smBlack.300' } : null}
            rounded={breakVal ? 'full' : null}
            bg={breakVal ? 'smWhite.500' : null}
            border={breakVal ? '2px solid' : null}
            borderColor='smBlack.300'
            color={breakVal ? 'smBlack.300' : null}
            top={breakVal ? -4 : null}
            right={breakVal ? -4 : null}
          />
          <ModalBody overflow='hidden'>
            <TranscriptionViewer {...activeJob} transcMaxHeight='25vh' />
          </ModalBody>
        </ModalContent>
      </Modal>
      <ConfirmRemoveModal
        isOpen={isOpen}
        onClose={onClose}
        mainTitle='Delete Job?'
        subTitle={'Deleted jobs count towards usage.'}
        onRemoveConfirm={() => {
          onDeleteJob(deleteJobInfo.id, true);
          onClose();
        }}
        confirmLabel='Delete Job'
        cancelLabel='Keep Job'
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
  onStartDelete
}: JobElementProps & JobModalProps) => {
  const breakVal = useBreakpointValue({
    base: false,
    xl: true
  });

  return (
    <VStack
      id={id}
      border='1px solid'
      borderColor='smBlack.200'
      borderLeft='3px solid'
      borderLeftColor={statusColour[status]}
      p={4}
      width='100%'>
      <HStack width='100%'>
        <VStack alignItems='flex-start' width='100%' flex={2}>
          <Box fontFamily='RMNeue-bold' as='span' width='90%' paddingRight='4px' color='smNavy.400'>
            <Text noOfLines={1}>
              {!fileName && status === 'deleted' ? "(Item deleted)" : fileName}
            </Text>
          </Box>
          <HStack
            fontSize='0.8em'
            color='smNavy.350'
            width='90%'
            spacing={4}
            justifyContent='space-between'>
            {breakVal && (
              <>
                <Box flex={2} fontFamily='RMNeue-bold' whiteSpace='nowrap'>
                  <Tooltip placement='bottom' hasArrow color='smWhite.500' label='Time Submitted'>
                    {date ? formatTimeDateFromString(date) : 'Unknown'}
                  </Tooltip>
                </Box>
                <Box flex={1}>
                  <Tooltip
                    flex={1}
                    placement='bottom'
                    hasArrow
                    color='smWhite.500'
                    label='Accuracy'>
                    {accuracy ? capitalizeFirstLetter(accuracy) : 'Unknown'}
                  </Tooltip>
                </Box>
                <Box flex={1}>
                  <Tooltip placement='bottom' hasArrow color='smWhite.500' label='Media Duration'>
                    {duration || 'Unknown'}
                  </Tooltip>
                </Box>
                <Box flex={1}>
                  <Tooltip placement='bottom' hasArrow color='smWhite.500' label='Media Language'>
                    {language ? mapLanguages(language) : 'Unknown'}
                  </Tooltip>
                </Box>
                <Box flex={1}>
                  <Tooltip placement='bottom' hasArrow color='smWhite.500' label='Unique Job ID'>
                    {id ? id : 'Unknown'}
                  </Tooltip>
                </Box>
              </>
            )}
          </HStack>
        </VStack>
        <HStack flex={breakVal ? 1 : 0} spacing={2} marginLeft={4} justifyContent={'space-evenly'}>
          <Tooltip
            label={status == 'running' ? 'The media is still being transcribed.' : null}
            hasArrow>
            <HStack flex={2}>
              {status == 'running' ? (
                <Spinner size='xs' height='9px' width='9px' color='smOrange.500' />
              ) : (
                <Box w={2} h={2} rounded='full' bgColor={statusColour[status]} />
              )}
              <Box color={statusColour[status]}>{status ? capitalizeFirstLetter(status) : 'Unknown'}</Box>
            </HStack>
          </Tooltip>
          {breakVal ? (
            <IconButtons
              onOpenTranscript={onOpenTranscript}
              fileName={fileName}
              language={language}
              id={id}
              accuracy={accuracy}
              date={date}
              status={status}
              onStartDelete={onStartDelete}
            />
          ) : null}
        </HStack>
      </HStack>
      {!breakVal && (
        <HStack color='smNavy.350' spacing={4} width='100%' justifyContent='space-between'>
          <Box maxW='150px' flex={1} fontFamily='RMNeue-bold' whiteSpace='nowrap' fontSize='0.8em'>
            <Tooltip placement='bottom' hasArrow color='smWhite.500' label='Time Submitted'>
              {date ? formatTimeDateFromString(date) : 'Unknown'}
            </Tooltip>
          </Box>
          <HStack width='140px'>
            <IconButtons
              onOpenTranscript={onOpenTranscript}
              fileName={fileName}
              language={language}
              id={id}
              accuracy={accuracy}
              date={date}
              status={status}
              onStartDelete={onStartDelete}
            />
          </HStack>
        </HStack>
      )}
    </VStack>
  );
};

const IconButtons = ({
  onOpenTranscript,
  fileName,
  language,
  id,
  accuracy,
  date,
  status,
  onStartDelete
}) => (
  <>
    <Box flex={1}>
      <Menu isLazy>
        <Tooltip placement='bottom' hasArrow color='smWhite.500' label='Download'>
          <MenuButton
            disabled={['running', 'rejected', 'deleted'].includes(status)}
            as={IconButton}
            variant='ghost'
            aria-label='view'
            icon={
              <DownloadJobIcon
                fontSize={20}
                color={
                  ['running', 'rejected', 'deleted'].includes(status)
                    ? 'var(--chakra-colors-smBlack-200)'
                    : 'var(--chakra-colors-smNavy-350)'
                }
              />
            }
          />
        </Tooltip>
        <TranscriptDownloadMenu fileName={fileName} jobId={id} status={status} />
      </Menu>
    </Box>
    <Box flex={1}>
      <Tooltip placement='bottom' hasArrow color='smWhite.500' label='View'>
        <IconButton
          disabled={['running', 'rejected', 'deleted'].includes(status)}
          variant='ghost'
          aria-label='view'
          onClick={(e) =>
            onOpenTranscript(
              {
                jobId: id,
                language,
                accuracy,
                date: date,
                fileName
              },
              'txt'
            )
          }
          _focus={{ boxShadow: 'none' }}
          icon={
            <ViewTranscriptionIcon
              fontSize='22'
              color={
                ['running', 'rejected', 'deleted'].includes(status)
                  ? 'var(--chakra-colors-smBlack-200)'
                  : 'var(--chakra-colors-smNavy-350)'
              }
            />
          }
        />
      </Tooltip>
    </Box>
    <Box flex={1}>
      <Tooltip placement='bottom' hasArrow color='smWhite.500' label='Delete'>
        <IconButton
          variant='ghost'
          disabled={['running', 'deleted'].includes(status)}
          aria-label='stop-or-delete'
          onClick={(e) => onStartDelete(id, status)}
          flex={1}
          icon={<BinIcon fontSize='22' />}
        />
      </Tooltip>
    </Box>
  </>
);

const LoadingJobsSkeleton = (key: any, breakVal: boolean) => {
  return (
    <VStack
      key={key}
      border='1px solid'
      borderColor='smBlack.200'
      borderLeft='3px solid'
      borderLeftColor='smBlack.200'
      width='100%'
      p={4}>
      <HStack width='100%'>
        <VStack alignItems='flex-start' flex={2}>
          <SkeletonText
            noOfLines={1}
            height='6'
            width='75%'
            paddingRight='4px'
            color='smNavy.400'
          />
          {breakVal && (
            <HStack
              fontSize='0.8em'
              color='smNavy.350'
              width='90%'
              spacing={4}
              justifyContent='space-between'>
              <SkeletonText height='4' noOfLines={1} flex={2} whiteSpace='nowrap' />
              <SkeletonText height='4' noOfLines={1} flex={1} />
              <SkeletonText height='4' noOfLines={1} flex={1} />
              <SkeletonText height='4' noOfLines={1} flex={1} />
              <SkeletonText height='4' noOfLines={1} flex={1} />
            </HStack>
          )}
        </VStack>
        {!breakVal && (
          <>
            <SkeletonText height='6' noOfLines={1} width='100px' />
          </>
        )}

        {breakVal && (
          <HStack flex={1} justifyContent='space-evenly' spacing={4}>
            <SkeletonCircle size='4' />
            <SkeletonText noOfLines={1} flex={3} spacing={6} paddingRight={4} />
            <SkeletonCircle size='7' />
            <SkeletonCircle size='7' />
            <SkeletonCircle size='7' />
          </HStack>
        )}
      </HStack>
      {!breakVal && (
        <HStack width='100%' justifyContent='space-between'>
          <SkeletonText width='100px' noOfLines={1} />
          <HStack justifyContent='space-evenly' width='140px'>
            <SkeletonCircle size='7' />
            <SkeletonCircle size='7' />
            <SkeletonCircle size='7' />
          </HStack>
        </HStack>
      )}
    </VStack>
  );
};

const statusColour = {
  rejected: 'smRed.500',
  deleted: 'smBlack.300',
  done: 'smGreen.500',
  completed: 'smGreen.500',
  running: 'smOrange.400'
};

const mapLanguages = (lang) => {
  return languagesData.find((item) => item.value == lang).label;
};

type JobModalProps = {
  onOpenTranscript?: Function;
  onStartDelete?: Function;
};

import { Box, HStack, Tooltip, Select, Flex, Text, Button, VStack, BoxProps, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { formatTimeDateFromString } from "../utils/date-utils";
import { capitalizeFirstLetter } from "../utils/string-utils";
import { getFullLanguageName, Stage } from "../utils/transcribe-store-flow";
import { CopyIcon, DownloadIcon, OkayIcon, QuestionmarkInCircle, RemoveFileIcon, UploadFileIcon } from "./icons-library";

type FileUploadComponentProps = {
  onFileSelect: (file: File) => void;
}

export const FileUploadComponent = ({ onFileSelect }: FileUploadComponentProps) => {

  const [filesDragged, setFilesDragged] = useState(false);
  const [file, setFile] = useState<File>(null)

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const callbacksRefs = onGridDragDropSetup(dropAreaRef.current, selectFiles, setFilesDragged);
    return () => {
      removeListenersOnDropZone(dropAreaRef.current, callbacksRefs);
    }
  }, [dropAreaRef.current])

  const onSelectFiles = (ev: React.ChangeEvent<HTMLInputElement>) => {
    selectFiles(ev.target?.files);
  }

  const selectFiles = (files: FileList | null | undefined) => {
    onFileSelect(files[0]);
    setFile(files[0]);
  }

  const dropClicked = useCallback(() => {
    fileInputRef.current.click();
  }, [])

  const removeFileClick = useCallback(() => {
    fileInputRef.current.value = '';
    onFileSelect(null);
    setFile(null);
  }, [])

  return <Flex alignSelf='stretch'
    bgColor={filesDragged ? 'smBlue.300' : 'smBlue.100'}
    _hover={!file ? { bgColor: 'smBlue.150' } : {}}
    border='2px dashed' borderColor='#386DFB66'
    justifyContent='center' alignItems='center' position='relative'
    py={6} px={8}
  >
    <input type='file' ref={fileInputRef}
      style={{ display: 'none' }} onChange={onSelectFiles}
      // multiple 
      accept='audio/*' />
    <Flex gap={4} alignItems='center' style={{ strokeOpacity: 0.75 }} width='100%' justifyContent='center'>
      {!file ? <>
        <UploadFileIcon color="var(--chakra-colors-smBlue-500)" height='3.5em' width='3.5em' />
        <VStack alignItems='flex-start' spacing={0}>
          <Box color='smNavy.500' fontFamily='RMNeue-SemiBold' fontSize='1.2em' lineHeight={1.2}>Click here and choose a file or drag the file here.</Box>
          <Box color='smBlack.250' fontSize='.85em' pt={1}>Maximum file size 1GB or 2 hours of audio.</Box>
        </VStack>
      </> :
        <Flex alignItems='center' justifyContent='space-between' width='100%'>
          <Box color='smNavy.500' fontSize='1.2em' lineHeight={1.2}>
            File "<Text as='span' fontFamily='RMNeue-SemiBold'>{file?.name}</Text>" has been added.
          </Box>
          <Box cursor='pointer' onClick={removeFileClick}>
            <RemoveFileIcon width='3em' height='3em' />
          </Box>
        </Flex>}

    </Flex>
    {<Box position='absolute' height='100%' width='100%' display={file ? 'none' : 'block'}
      ref={dropAreaRef} cursor={'pointer'} onClick={dropClicked} />}
  </Flex>
}


export type SelectFieldProps = {
  label: string,
  tooltip: string,
  data: { value: string, label: string, selected?: boolean }[],
  onSelect: (value: string) => void,
  'data-qa': string
}

export const SelectField = ({ label, tooltip, data, onSelect, 'data-qa': dataQa }: SelectFieldProps) => {

  const [selectedIndex, setSelectedIndex] = useState(0);

  const select = (value: number) => {
    setSelectedIndex(value);
    onSelect(data[value].value);
  }

  useEffect(() => {
    setSelectedIndex(data.findIndex(el => el.selected))
  }, [])

  return <Box flex='1 0 auto'>
    <HStack alignItems='center' pb={2}>
      <Box color='smBlack.400'>{label}</Box>
      <Box><Tooltip label={tooltip} hasArrow placement="right"><Box><QuestionmarkInCircle /></Box></Tooltip></Box>
    </HStack>
    <Select borderColor='smBlack.200' color='smBlack.300' data-qa={dataQa}
      borderRadius='2px' size='lg' onChange={(event) => select(event.target.selectedIndex)}>
      {data.map(({ value, label }, i) => <option key={i} value={value} selected={i == selectedIndex}>{label}</option>)}
    </Select>
  </Box>
}

export type ChoiceButtonsProps = {
  label: string,
  tooltip: string,
  data: { value: string, label: string, selected?: boolean }[],
  onSelect: (value: string) => void;
}

export const ChoiceButtons = ({ label, tooltip, data, onSelect }: ChoiceButtonsProps) => {

  const [selected, setSelected] = useState('');

  const select = (value) => {
    setSelected(value);
    onSelect(value);
  }

  useEffect(() => {
    setSelected(data.find(el => el.selected).value)
  }, [])

  return <Box flex='1 0 40%'>
    <HStack alignItems='center' pb={2}>
      <Box color='smBlack.400'>{label}</Box>
      <Box><Tooltip label={tooltip} hasArrow placement="right"><Box><QuestionmarkInCircle /></Box></Tooltip></Box>
    </HStack>
    <Flex width='100%'>
      {data.map(({ value, label }) => {
        if (selected == value) return <Button variant='speechmatics' height='3em' py='1.4em' fontFamily='RMNeue-Regular' flex='1'>{label}</Button>
        else return <Button variant='speechmaticsOutline' height='3em' border='1px solid' borderColor='smBlack.180'
          color='smBlack.250' fontFamily='RMNeue-Light' flex='1' onClick={() => select(value)}>{label}</Button>
      })}
    </Flex>
  </Box>
}



type ProgressPointProps = {
  status: 'done' | 'running' | 'pending' | 'failed';
  label: string;
  step: string;
  posX: string;
}

const statusColors = {
  done: { label: 'smBlue.500', pointBg: 'smBlue.500', step: 'smWhite.500' },
  running: { label: 'smGreen.500', pointBg: 'smGreen.500', step: 'smWhite.500' },
  pending: { label: 'smNavy.280', pointBg: 'smBlue.140', step: '#5E667366' },
  failed: { label: 'smRed.500', pointBg: 'smRed.500', step: 'smWhite.500' }
}

export const ProgressPoint = function ({ status, label, step, posX }: ProgressPointProps) {

  return <VStack top='50%' left={posX} style={{ transform: 'translate(-50%, -1em)' }}
    pos='absolute' spacing={1}>
    <Flex rounded='full' w={8} h={8} bgColor={statusColors[status].pointBg}
      border='3px solid white'
      justifyContent='center' alignItems='center' zIndex={2}
      fontFamily='RMNeue-SemiBold' color={statusColors[status].step} fontSize='.75em' >
      {status == 'done' ? <OkayIcon /> : step}
    </Flex>
    <Box fontSize='12' color={statusColors[status].label} textAlign='center'>{label}</Box>
  </VStack>
}


type FileProcessingProgressProps = { stage: Stage } & BoxProps;

const stageToProps = {
  'pendingFile': {
    barWidth: '15%',
    animDur: '15s',
    step1: 'running',
    step2: 'pending',
    step3: 'pending',
    gradEndColor: 'smGreen.500',
    animateStripes: true
  },
  'pendingTranscription': {
    barWidth: '50%',
    animDur: '30s',
    step1: 'done',
    step2: 'running',
    step3: 'pending',
    gradEndColor: 'smGreen.500',
    animateStripes: true
  },
  'failed': {
    barWidth: '50%',
    animDur: '30s',
    step1: 'done',
    step2: 'failed',
    step3: 'pending',
    gradEndColor: 'smRed.500',
    animateStripes: false
  },
  'complete': {
    barWidth: '100%',
    animDur: '50s',
    step1: 'done',
    step2: 'done',
    step3: 'done',
    gradEndColor: 'smGreen.500',
    animateStripes: false
  }
}

export const FileProcessingProgress = function ({ stage, ...boxProps }: FileProcessingProgressProps) {

  const stageProps = stageToProps[stage]

  return <Box {...boxProps} width='100%' pos='relative' height='4em'>

    <Box rounded='full' width='100%' height={2} bgColor='smBlue.140' pos='absolute'
      top='50%' zIndex={0} style={{ transform: 'translate(0, -50%)' }} />

    <Box rounded='full' width={stageProps.barWidth} transition='all 0.5s' height={2}
      bgGradient={`linear(to-r, smBlue.500 25%, ${stageProps.gradEndColor})`}
      pos='absolute' top='50%' zIndex={0} style={{ transform: 'translate(0, -50%)' }} />

    <Box rounded='full' width={stageProps.barWidth} transition='all 0.5s' height={2} pos='absolute' top='50%' zIndex={0}
      style={{ transform: 'translate(0, -50%)', animationDuration: stageProps.animDur }}
      className={`striped_background ${stageProps.animateStripes ? 'animate_background' : ''}`} />

    <ProgressPoint status={stageProps.step1} label='Audio Uploading' posX="15%" step='1' />
    <ProgressPoint status={stageProps.step2} label='Running Transcription' posX="50%" step='2' />
    <ProgressPoint status={stageProps.step3} label='Transcription Complete' posX="85%" step='3' />
  </Box>
}



type TranscriptionViewerProps = {
  transcriptionText: string;
  date: string;
  jobId: string;
  accuracy: string;
  language: string;
  downloadLink: string;
} & BoxProps

export const TranscriptionViewer = ({ transcriptionText, date, jobId, accuracy, language, downloadLink, ...boxProps }: TranscriptionViewerProps) => (
  <VStack border='1px' borderColor='smBlack.200' width='100%' {...boxProps}>
    <HStack justifyContent='space-between' width='100%' px={6} py={3} bgColor='smNavy.200'
      borderBottom='1px'
      borderColor='smBlack.200'>
      <Stat title='Submitted:' value={formatTimeDateFromString(date)} />
      <Stat title='Job ID:' value={jobId} />
      <Stat title='Accuracy:' value={capitalizeFirstLetter(accuracy)} />
      <Stat title='Language:' value={getFullLanguageName(language)} />
    </HStack>
    <Box flex='1' maxHeight={150} overflowY='auto' px={6} py={2} color='smBlack.300'>
      {transcriptionText}
    </Box>
    <HStack width='100%' spacing={4} p={4} borderTop='1px' borderColor='smBlack.200'>
      <Button variant='speechmatics' flex='1' leftIcon={<CopyIcon />} fontSize='1em'
        onClick={() => navigator?.clipboard?.writeText(transcriptionText)}>
        Copy Transcription
      </Button>
      <Menu>
        <MenuButton as={Button} flex='1' variant='speechmaticsGreen' leftIcon={<DownloadIcon />} fontSize='1em'>
          Download Transcription
        </MenuButton>
        <MenuList>
          <MenuItem py={1}>Download as text</MenuItem>
          <MenuDivider color='smNavy.270' />
          <MenuItem py={1}>Download as JSON</MenuItem>
          <MenuDivider color='smNavy.270' />
          <MenuItem py={1}>Download as srt</MenuItem>
          <MenuDivider color='smNavy.270' />
          <MenuItem py={1}>Download audio</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  </VStack>
)



const Stat = ({ title, value, ...boxProps }) => (
  <Box {...boxProps}>
    <Text as='span' color='smBlack.300' fontFamily='RMNeue-Bold' fontSize='0.85em'>{title} </Text>
    <Text as='span' color='smBlack.300' fontSize='0.85em'>{value}</Text>
  </Box>
)








const filesMap = (files: FileList | undefined | null): File[] => {
  const ret: File[] = [];
  if (files && files.length > 0)
    for (let i = 0; i < files.length; i++)
      if (files[i]) {
        ret.push(files[i]);
      }
  return ret;
}


export function onGridDragDropSetup(elem: HTMLElement | null,
  filesDropped: (files: FileList | undefined) => void,
  filesDraggedOver?: (v: boolean) => void,
) {
  if (!elem) return;
  let callbackRefs = []
  console.log('setting up drag drop', elem);
  elem.addEventListener('dragover', callbackRefs[0] = (ev: DragEvent) => {
    ev.preventDefault();
    filesDraggedOver?.(true);
  });
  elem.addEventListener('drop', callbackRefs[1] = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    filesDropped(ev.dataTransfer?.files);
    filesDraggedOver?.(false);
  });
  elem.addEventListener('dragleave', callbackRefs[2] = (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    filesDraggedOver?.(false);
  });

  return callbackRefs;
}

export function removeListenersOnDropZone(elem: HTMLElement, callbackRefs: Array<(ev: DragEvent) => void>) {
  if (!elem) return;
  const [dragOverCb, dropCb, dragLeaveCb] = callbackRefs;
  elem.removeEventListener('dragover', dragOverCb);
  elem.removeEventListener('drop', dropCb);
  elem.removeEventListener('dragleave', dragLeaveCb);
}

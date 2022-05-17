import { Box, HStack, Tooltip, Select, Flex, Button, VStack } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { QuestionmarkInCircle, UploadFileIcon } from "./icons-library";


export const FileUploadComponent = ({ }) => {

  const [filesDragged, setFilesDragged] = useState(false);

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

  }

  const dropClicked = () => {
    fileInputRef.current.click();
  }

  return <Flex alignSelf='stretch' height='100px'
    bgColor={filesDragged ? 'smBlue.200' : 'smBlue.100'}
    p='4em'
    _hover={{ bgColor: 'smBlue.150' }}
    border='2px dashed' borderColor='#386DFB66'
    justifyContent='center' alignItems='center' position='relative'>
    <input type='file' ref={fileInputRef}
      style={{ display: 'none' }} onChange={onSelectFiles}
      // multiple 
      accept='audio/*' />
    <Flex gap={4} alignItems='center' style={{ strokeOpacity: 0.75 }}>
      <UploadFileIcon color="var(--chakra-colors-smBlue-500)" height='3.5em' width='3.5em'
      />
      <VStack alignItems='flex-start' spacing={0}>
        <Box color='smNavy.500' fontFamily='RMNeue-SemiBold' fontSize='1.2em'>Click here and choose a file or drag the file here.</Box>
        <Box color='smBlack.250' fontSize='.85em'>Maximum file size 1GB or 2 hours of audio.</Box>
      </VStack>
    </Flex>
    <Box position='absolute' height='100%' width='100%' ref={dropAreaRef} cursor='pointer' onClick={dropClicked} />
  </Flex>
}


export type SelectFieldProps = {
  label: string,
  tooltip: string,
  data: { value: string, label: string, selected?: boolean }[],
  onSelect: (value: string) => void
}

export const SelectField = ({ label, tooltip, data, onSelect }: SelectFieldProps) => {

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
    <Select borderColor='smBlack.200' color='smBlack.300'
      borderRadius='2px' size='lg' onChange={(event) => select(event.target.selectedIndex)}>
      {data.map(({ value, label }, i) => <option value={value} selected={i == selectedIndex}>{label}</option>)}
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
  const [dragOverCb, dropCb, dragLeaveCb] = callbackRefs;

  elem.removeEventListener('dragover', dragOverCb);
  elem.removeEventListener('drop', dropCb);
  elem.removeEventListener('dragleave', dragLeaveCb);
}
import { Box, Button, Divider, Flex, HStack, Select, Spacer, Tooltip, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from "../components/common";
import Dashboard from "../components/dashboard";
import { QuestionmarkInCircle, UploadFileIcon } from "../components/icons-library";

const languagesData = [
  { label: 'English', value: 'en', selected: true },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
]

const separation = [
  { label: 'None', value: 'none', selected: true },
  { label: 'Speaker', value: 'speaker' },
]

const accuracyModels = [
  { label: 'Enhanced', value: 'enhanced', selected: true },
  { label: 'Standard', value: 'standard' },

]

export default observer(function Transcribe({ }) {
  return (
    <Dashboard>
      <PageHeader headerLabel="Transcribe" introduction="Use our online tool to transcribe your audio." />
      <SmPanel width='100%' maxWidth='900px'>
        <Box width='100%'>
          <HeaderLabel>Upload a File</HeaderLabel>
          <DescriptionLabel>The audio file can be wav, mp3 or any compatible format.</DescriptionLabel>
          <Box alignSelf='stretch' pt={5} pb={3}>
            <FileUploadComponent />

          </Box>
        </Box>
        <Divider />
        <Box py={5} width='100%'>
          <HeaderLabel>Configure Transcription Options</HeaderLabel>
          <DescriptionLabel>Choose the best features to suit your transcription requirements.</DescriptionLabel>

          <Flex width='100%' wrap='wrap' gap={6}>
            <SelectField label="Language" tooltip='Expected language of transcription' data={languagesData} onSelect={() => { }} />
            <SelectField label="Separation" tooltip='Separation of transcription' data={separation} onSelect={() => { }} />
            <ChoiceButtons label="Accuracy" tooltip="Accuracy model" data={accuracyModels} onSelect={() => { }} />
            <Box flex='1 0 40%'></Box>
          </Flex>
        </Box>
        <Divider />
        <Box pt={5} pb={3} width='100%'>
          <HeaderLabel>Get Transcript</HeaderLabel>
          <DescriptionLabel>A one hour file will return your transcript back in 30 minutes or less.</DescriptionLabel>
          <Flex width='100%' justifyContent='center'><Button variant='speechmatics' fontSize='18'>Get Your Transcription</Button></Flex>
        </Box>
      </SmPanel>
    </Dashboard>
  );
})


type SelectFieldProps = {
  label: string,
  tooltip: string,
  data: { value: string, label: string, selected?: boolean }[],
  onSelect: (value: string) => void
}

const SelectField = ({ label, tooltip, data, onSelect }: SelectFieldProps) => {

  const [selectedIndex, setSelectedIndex] = useState(0);

  const select = (value: number) => {
    setSelectedIndex(value);
    onSelect(data[value].value);
  }

  useEffect(() => {
    setSelectedIndex(data.findIndex(el => el.selected))
  }, [])

  return <Box flex='1 0 40%'>
    <HStack alignItems='center' pb={2}>
      <Box color='smBlack.400'>{label}</Box>
      <Box><Tooltip label={tooltip} hasArrow placement="right"><Box><QuestionmarkInCircle /></Box></Tooltip></Box>
    </HStack>
    <Select borderColor='smBlack.170' color='smBlack.300' borderRadius='2px' size='lg' onChange={(event) => select(event.target.selectedIndex)}>
      {data.map(({ value, label }, i) => <option value={value} selected={i == selectedIndex}>{label}</option>)}
    </Select>
  </Box>
}

type ChoiceButtonsProps = {
  label: string,
  tooltip: string,
  data: { value: string, label: string, selected?: boolean }[],
  onSelect: (value: string) => void;
}

const ChoiceButtons = ({ label, tooltip, data, onSelect }: ChoiceButtonsProps) => {

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


const FileUploadComponent = ({ }) => {

  const [filesDragged, setFilesDragged] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onGridDragDropSetup(dropAreaRef.current, selectFiles, setFilesDragged);
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
    bgColor={filesDragged ? 'smBlack.170' : 'smBlack.120'}
    p={4}
    _hover={{ bgColor: 'smBlack.130' }}
    style={{ border: '1px dashed #DDDDDD' }}
    justifyContent='center' alignItems='center' position='relative'>
    <input type='file' ref={fileInputRef}
      style={{ display: 'none' }} onChange={onSelectFiles}
      multiple accept='audio/*' />
    <Flex gap={4}>
      <UploadFileIcon />
      <VStack alignItems='flex-start' spacing={0}>
        <Box color='smBlack.420'>Click here and choose a file or drag the file here.</Box>
        <Box color='smBlack.250' fontSize='.75em'>Maximum file size 50MB</Box>
      </VStack>
    </Flex>
    <Box position='absolute' height='100%' width='100%' ref={dropAreaRef} cursor='pointer' onClick={dropClicked} />
  </Flex>
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


const onGridDragDropSetup = (elem: HTMLElement | null,
  filesDropped: (files: FileList | undefined) => void,
  filesDraggedOver?: (v: boolean) => void,
) => {
  if (!elem) return;
  console.log('setting up drag drop', elem);
  elem.addEventListener('dragover', (ev: DragEvent) => {
    ev.preventDefault();
    filesDraggedOver?.(true);
  });
  elem.addEventListener('drop', (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    filesDropped(ev.dataTransfer?.files);
    filesDraggedOver?.(false);
  });
  elem.addEventListener('dragleave', (ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    filesDraggedOver?.(false);
  });


}
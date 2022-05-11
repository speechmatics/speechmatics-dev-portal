import { Box, Button, Divider, Flex, HStack, Select, Spacer, Tooltip, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from "../components/common";
import Dashboard from "../components/dashboard";
import { QuestionmarkInCircle } from "../components/icons-library";

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
            {/* drop file component */}
            <Box alignSelf='stretch' height='100px' bgColor='smBlack.120' style={{ border: '1px dashed #DDDDDD' }}></Box>
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

  return <Box flex='1 0 40%' maxWidth='calc(50% - 0.85em)'>
    <HStack alignItems='center' pb={2}>
      <Box color='smBlack.400'>{label}</Box>
      <Box><Tooltip label={tooltip} hasArrow placement="right"><Box><QuestionmarkInCircle /></Box></Tooltip></Box>
    </HStack>
    <Flex width='100%'>
      {data.map(({ value, label }) => {
        if (selected) return <Button variant='speechmatics' height='3em' py='1.4em' fontFamily='RMNeue-Regular' flex='1'>{label}</Button>
        else return <Button variant='speechmaticsOutline' height='3em' border='1px solid' borderColor='smBlack.180'
          color='smBlack.250' fontFamily='RMNeue-Light' flex='1' onClick={() => select(value)}>{label}</Button>
      })}


    </Flex>
  </Box>
}
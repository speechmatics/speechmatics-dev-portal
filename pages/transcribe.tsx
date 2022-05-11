import { Box, Button, Divider, Flex, HStack, Select, Spacer, Tooltip, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from "../components/common";
import Dashboard from "../components/dashboard";
import { QuestionmarkInCircle } from "../components/icons-library";



export default observer(function Transcribe({ }) {
  return (
    <Dashboard>
      <PageHeader headerLabel="Transcribe" introduction="Use our online tool to transcribe your audio." />
      <SmPanel width='100%' maxWidth='900px'>
        <HeaderLabel>Upload a File</HeaderLabel>
        <DescriptionLabel>The audio file can be wav, mp3 or any compatible format.</DescriptionLabel>
        <Box alignSelf='stretch' pt={5} pb={3}>
          {/* drop file component */}
          <Box alignSelf='stretch' height='100px' bgColor='smBlack.120' style={{ border: '1px dashed #DDDDDD' }}></Box>
        </Box>
        <Divider />
        <Box py={5} width='100%'>
          <HeaderLabel>Configure Transcription Options</HeaderLabel>
          <DescriptionLabel>Choose the best features to suit your transcription requirements.</DescriptionLabel>

          <Flex width='100%' wrap='wrap' gap={6}>
            <Box flex='1 0 40%'>
              <HStack alignItems='center' pb={2}>
                <Box color='smBlack.400'>Language</Box>
                <Box><Tooltip label='Expected language of transcription' hasArrow placement="right"><Box><QuestionmarkInCircle /></Box></Tooltip></Box>
              </HStack>
              <Select borderColor='smBlack.170' color='smBlack.300' borderRadius='2px' size='lg'>
                <option value='en' selected>English</option>
                <option value='fr' >French</option>
                <option value='de' >German</option>
                <option value='pl' >Polish</option>
              </Select>
            </Box>
            <Box flex='1 0 40%'>
              <HStack alignItems='center' pb={2}>
                <Box color='smBlack.400'>Separation</Box>
                <Box><Tooltip label='Separation of transcription' hasArrow placement="right"><Box><QuestionmarkInCircle /></Box></Tooltip></Box>
              </HStack>
              <Select borderColor='smBlack.170' color='smBlack.300' borderRadius='2px' size='lg'>
                <option value='none' >None</option>
                <option value='speaker' selected>Speaker</option>
              </Select>
            </Box>
            <Box flex='1 0 40%' maxWidth='calc(50% - 0.85em)'>
              <HStack alignItems='center' pb={2}>
                <Box color='smBlack.400'>Accuracy</Box>
                <Box><Tooltip label='Expected accuracy of transcription' hasArrow placement="right"><Box><QuestionmarkInCircle /></Box></Tooltip></Box>
              </HStack>
              <Flex width='100%'>
                <Button variant='speechmatics' height='3em' py='1.4em' fontFamily='RMNeue-Regular' flex='1'>Enhanced</Button>
                <Button variant='speechmaticsOutline' height='3em' border='1px solid' borderColor='smBlack.180'
                  color='smBlack.250' fontFamily='RMNeue-Light' flex='1'>Standard</Button>
              </Flex>
            </Box>
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
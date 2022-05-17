import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { DescriptionLabel, HeaderLabel, PageHeader, SmPanel } from "../components/common";
import Dashboard from "../components/dashboard";
import { FileUploadComponent, ChoiceButtons, SelectField } from "../components/transcribe-form";

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
      <PageHeader
        headerLabel="Transcribe"
        introduction="Upload and Transcribe an Audio File." />

      <SmPanel width='100%' maxWidth='900px'>
        <Box width='100%'>
          <HeaderLabel>Upload a File</HeaderLabel>
          <DescriptionLabel>The audio file can be aac, amr, flac, m4a, mp3, mp4, mpeg, ogg, wav.</DescriptionLabel>
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
            <SelectField label="Accuracy" tooltip="Accuracy model" data={accuracyModels} onSelect={() => { }} />
          </Flex>
          <Flex width='100%' justifyContent='center' py={2}>
            <Button variant='speechmatics' fontSize='18' width='100%'>Get Your Transcription</Button>
          </Flex>
        </Box>
      </SmPanel>
    </Dashboard>
  );
})


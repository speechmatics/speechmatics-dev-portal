import Dashboard from '../components/dashboard';
import {
  Grid,
  VStack,
  Text,
  Box,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  ModalCloseButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  DescriptionLabel,
  HeaderLabel,
  InfoBarbox,
  PageHeader,
  SmPanel,
} from '../components/common';
import { SubmitAJobIcon } from '../components/icons-library';
import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { trackEvent } from '../utils/analytics';

export default function Learn({ }) {
  const [isYtModalOpen, setIsYtModalOpen] = useState(false);

  const onYtModalClose = () => {
    setIsYtModalOpen(false);
  };

  return (
    <Dashboard>
      <PageHeader headerLabel="Learn" introduction="Explore our API Documentation and Resources." />
      <YtEmbedPopup isModalOpen={isYtModalOpen} onModalClose={onYtModalClose} />
      <VStack spacing="1.5em" alignItems="flex-start" width="100%" maxWidth='900px'>
        <InfoBarbox
          bgColor="smNavy.500"
          icon={<SubmitAJobIcon width='4em' height='4em' />}
          title="How to Submit a Job"
          description="Watch our demo on how to submit a transcription job."
          buttonLabel="Watch Video"
          setStateUp={() => setIsYtModalOpen(true)}
          buttonOnClick={() => trackEvent('learn_click_see_video', 'Action', 'Opened the video')}
        />
        <Grid gridTemplateColumns="repeat(auto-fit, minmax(14em, 1fr))" gap="1.5em" width='100%'>
          {elems.map((el, i) => (
            <React.Fragment key={i}>
              <SmPanel justifyContent="space-between" p="1.5em" height="100%">
                <Box>
                  <HeaderLabel>{el.title}</HeaderLabel>
                  <DescriptionLabel>{el.descr}</DescriptionLabel>
                </Box>
                <Link href={el.link} target='_blank'>
                  <Box color="smBlue.500" onClick={() =>
                    trackEvent('learn_article_click', 'LinkOut', '', { title: el.title })}>
                    <a>Read Article &gt;</a>
                  </Box>
                </Link>
              </SmPanel>
            </React.Fragment>
          ))}
        </Grid>
      </VStack>
    </Dashboard>
  );
}

const YtEmbedPopup = ({ isModalOpen, onModalClose }) => {

  const vidWidth = useBreakpointValue({
    xs: "20em",
    sm: "25em",
    md: "40em",
    lg: "50em",
    xl: "60em",
    "2xl": "70em",
  });

  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent borderRadius="2px" maxWidth={`calc(${vidWidth} + 2em)`}>
        <ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: 'none' }}
            onClick={() => trackEvent('learn_close_video', 'Action', '')} />
        </ModalHeader>
        <ModalBody p="1em">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=vbK0u-aMuPQ"
            width={vidWidth}
            height={`calc(${vidWidth} * 0.6)`}
            controls={true}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const elems = [
  {
    title: 'Introduction',
    descr: 'How to use the RESTful API for the Speechmatics SaaS.',
    link: 'https://docs.speechmatics.com/en/cloud/introduction/'
  },
  {
    title: 'API How-To Guide',
    descr: 'Examples and guidance on using the Speechmatics SaaS.',
    link: 'https://docs.speechmatics.com/en/cloud/howto/'

  },
  {
    title: 'Entities', descr: 'What entities are, and how they are formatted.',
    link: 'https://docs.speechmatics.com/en/cloud/entities/'
  },
  {
    title: 'Configuring the Job Request',
    descr: 'How to configure your requests to take advantage of Speechmatics features.',
    link: 'https://docs.speechmatics.com/en/cloud/configuring-job-request/'
  },
  {
    title: 'Understanding SaaS Usage',
    descr: 'How to make requests and understand your usage of our service.',
    link: 'https://docs.speechmatics.com/en/cloud/understanding-saas-usage/'
  },
  {
    title: 'Troubleshooting', descr: 'Resolving errors with the SaaS.',
    link: 'https://docs.speechmatics.com/en/cloud/troubleshooting/'
  },
  {
    title: 'API Reference', descr: 'Reference guide for the ASR REST API.',
    link: 'https://docs.speechmatics.com/en/cloud/saasv2api/'
  },
  {
    title: 'Release Notes',
    descr: "What's new in our SaaS.",
    link: 'https://docs.speechmatics.com/en/cloud/release-notes/'
  },
];

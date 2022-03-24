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
} from '@chakra-ui/react';
import {
  DescriptionLabel,
  HeaderLabel,
  InfoBarbox,
  PageHeader,
  SmPanel,
} from '../components/common';
import { JobSubmitIcon } from '../components/icons-library';
import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';

export default function Learn({ }) {
  const [isYtModalOpen, setIsYtModalOpen] = useState(false);

  const onYtModalClose = () => {
    setIsYtModalOpen(false);
  };

  return (
    <Dashboard>
      <PageHeader headerLabel="Learn" introduction="Explore our comprehensive API documentation" />
      <YtEmbedPopup isModalOpen={isYtModalOpen} onModalClose={onYtModalClose} />
      <VStack spacing="1.5em" alignItems="flex-start" width="800px">
        <InfoBarbox
          bgColor="smNavy.500"
          icon={<JobSubmitIcon />}
          title="How to submit a job"
          description="Watch the Speechmatics how to submit a job demo"
          buttonLabel="Watch Video"
          setStateUp={() => setIsYtModalOpen(true)}
        />
        <Grid gridTemplateColumns="1fr 1fr 1fr" gap="1.5em">
          {elems.map((el, i) => (
            <React.Fragment key={i}>
              <Link href="http://docs.speechmatics.com">
                <SmPanel justifyContent="space-between" p="1.5em" height="100%">
                  <Box>
                    <HeaderLabel>{el.title}</HeaderLabel>
                    <DescriptionLabel>{el.descr}</DescriptionLabel>
                  </Box>
                  <Box fontFamily="RMNeue-Regular" color="smBlue.500">
                    <a>Read Article &gt;</a>
                  </Box>
                </SmPanel>
              </Link>
            </React.Fragment>
          ))}
        </Grid>
      </VStack>
    </Dashboard>
  );
}

const YtEmbedPopup = ({ isModalOpen, onModalClose }) => {
  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose} closeOnOverlayClick={true}>
      <ModalOverlay />
      <ModalContent borderRadius="2px" maxWidth="920px">
        <ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: 'none' }} />
        </ModalHeader>
        <ModalBody p="1em">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=yWEc5ukxaho"
            width="888px"
            height="500px"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const elems = [
  { title: 'Release Notes', descr: "What's new in our SaaS" },
  {
    title: 'Introduction',
    descr: 'How to use the RESTful API for the Speechmatics Cloud Offering.',
  },
  {
    title: 'API How-To Guide',
    descr: 'Examples and guidance on using the Speechmatics Cloud Offering.',
  },
  { title: 'Entities', descr: 'What entities are, and how they are formatted' },
  {
    title: 'Configuring the Job Request',
    descr: 'How to configure your requests to take advantage of Speechmatics features.',
  },
  {
    title: 'Understanding SaaS Usage',
    descr: 'How to configure your requests to take advantage of Speechmatics features.',
  },
  { title: 'Troubleshooting', descr: 'Resolving errors with the Cloud Offering.' },
  { title: 'API Reference', descr: 'Reference guide for the ASR REST API.' },
];

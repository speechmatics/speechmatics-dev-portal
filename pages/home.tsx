import { VStack, Text, HStack, Box, Button, Grid } from '@chakra-ui/react';
import Link from 'next/link';
import { InfoBarbox, PageHeader } from '../components/common';
import Dashboard from '../components/dashboard';
import { HomeBox } from '../components/home-elements';
import {
  MenuLearnIcon,
  MenuPadlockIcon,
  MenuTrackUsageIcon,
  TranscribeAudioIcon,
  TranscribeIcon
} from '../components/icons-library';

export default function Home({ }) {
  return (
    <Dashboard>
      <PageHeader headerLabel="Home" introduction="Welcome to the Speechmatics SaaS Portal." />
      <VStack spacing='2em' width='100%' maxWidth='900px'>
        <Grid gridTemplateColumns='repeat(auto-fit, minmax(16em, 1fr))' gridAutoFlow='dense' width='100%' gap='2em'>
          <HomeBox
            bgColor="smGreen.500"
            icon={<TranscribeIcon width='3em' height='3em' />}
            iconPadding="22px"
            text="Upload and Transcribe a Media File"
            buttonLabel="Transcribe Now"
            hrefUrl="/transcribe/"
          />
          <HomeBox
            bgColor="smBlue.500"
            icon={<TranscribeAudioIcon width='4em' height='2.5em' />}
            text="Start Using API"
            buttonLabel="Get Started"
            hrefUrl="/getting-started/"
            iconPadding='1.5em 0em 0em 0.8em'
          />
        </Grid>
        <Grid gridTemplateColumns='repeat(auto-fit, minmax(16em, 1fr))' gridAutoFlow='dense' width='100%' gap='1em'>
          <HomeWhiteBox
            icon={<MenuPadlockIcon width='6em' height='4em' />}
            title="Manage Access"
            description="You need to create an API key to make API requests."
            buttonLabel="Create API Key"
            hrefUrl="/manage-access/"
          />
          <HomeWhiteBox
            icon={<MenuTrackUsageIcon width='6em' height='4em' />}
            title="Track Your Usage"
            description="Usage is measured in hours of audio processed."
            buttonLabel="View Usage"
            hrefUrl="/usage/"
          />
          <HomeWhiteBox
            icon={<MenuLearnIcon width='6em' height='4em' />}
            title="Learning Resources"
            description="Explore our documentation and learning resources."
            buttonLabel="Learn"
            hrefUrl="/learn/"
          />
        </Grid>
      </VStack>
    </Dashboard>
  );
}

const HomeWhiteBox = ({ icon, title, description, buttonLabel, hrefUrl }) => {
  return (
    <VStack
      className="sm_panel"
      width="100%"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack>
        <Box>{icon}</Box>
        <Text as="div" fontFamily="RMNeue-Bold" fontSize="1.1em" textAlign="center">
          {title}
        </Text>
        <Text
          as="div"
          fontFamily="RMNeue-Regular"
          fontSize="0.8em"
          color="smBlack.400"
          textAlign="center"
        >
          {description}
        </Text>
      </VStack>
      <Link href={hrefUrl}>
        <Button variant="speechmaticsOutline" width="100%">
          {buttonLabel}
        </Button>
      </Link>
    </VStack>
  );
};




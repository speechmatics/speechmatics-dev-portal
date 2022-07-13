import { VStack, Text, HStack, Box, Button, Grid } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { PageHeader } from '../components/common';
import Dashboard from '../components/dashboard';
import { HomeBox, HomeWhiteBox } from '../components/home-elements';
import {
  MenuLearnIcon,
  MenuPadlockIcon,
  MenuTrackUsageIcon,
  TranscribeAudioIcon,
  TranscribeIcon
} from '../components/icons-library';
import { accountStore } from '../utils/account-store-context';

export default observer(function Home({ }) {
  return (
    <Dashboard>
      <PageHeader headerLabel='Home' introduction='Welcome to the Speechmatics SaaS Portal.' />
      <VStack spacing='2em' width='100%' maxWidth='900px'>
        <Grid
          gridTemplateColumns='repeat(auto-fit, minmax(16em, 1fr))'
          gridAutoFlow='dense'
          width='100%'
          gap='2em'>
          <HomeBox
            bgColor='smGreen.500'
            icon={<TranscribeIcon width='3em' height='3em' />}
            iconPadding='22px'
            text='Upload and Transcribe a Media File'
            buttonLabel='Transcribe Now'
            disabled={accountStore.isLoading}
            hrefUrl='/transcribe/'
          />
          <HomeBox
            bgColor='smBlue.500'
            icon={<TranscribeAudioIcon width='4em' height='2.5em' />}
            text='Start Using API'
            buttonLabel='Get Started'
            hrefUrl='/getting-started/'
            disabled={accountStore.isLoading}
            iconPadding='1.5em 0em 0em 0.8em'
          />
        </Grid>
        <Grid
          gridTemplateColumns='repeat(auto-fit, minmax(16em, 1fr))'
          gridAutoFlow='dense'
          width='100%'
          gap='2em'>
          <HomeWhiteBox
            icon={<MenuPadlockIcon width='6em' height='4em' />}
            title='Manage Access'
            description='You need to create an API key to make API requests.'
            buttonLabel='Create API Key'
            disabled={accountStore.isLoading}
            hrefUrl='/manage-access/'
          />
          <HomeWhiteBox
            icon={<MenuTrackUsageIcon width='6em' height='4em' />}
            title='Track Your Usage'
            description='Usage is measured in hours of audio processed.'
            buttonLabel='View Usage'
            disabled={accountStore.isLoading}
            hrefUrl='/usage/'
          />
          <HomeWhiteBox
            icon={<MenuLearnIcon width='6em' height='4em' />}
            title='Learning Resources'
            description='Explore our documentation and learning resources.'
            buttonLabel='Learn'
            disabled={accountStore.isLoading}
            hrefUrl='/learn/'
          />
        </Grid>
      </VStack>
    </Dashboard>
  );
})



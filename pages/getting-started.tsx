import { Text, Box } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useState } from 'react';
import {
  CodeExamples,
  DescriptionLabel,
  HeaderLabel,
  PageHeader,
  SmPanel,
} from '../components/common';
import Dashboard from '../components/dashboard';
import { GenerateTokenComponent, TokenGenStages as TokenGenStage } from './manage-access';

export default observer(function GettingStarted({ }) {

  const [showDefaultCodeExample, setShowDefaultCodeExample] = useState(true);

  const tokenGenerationStage = (stage: TokenGenStage) => {
    setShowDefaultCodeExample(stage != 'generated')
  }

  return (
    <Dashboard>
      <PageHeader
        headerLabel="Getting Started"
        introduction="Get started with using our platform in a few simple steps."
      />

      <SmPanel width="800px">
        <Box>
          <HeaderLabel>Download example audio file</HeaderLabel>
          <DescriptionLabel>
            Download our{' '}
            <Link href="/manage-access/">
              <a>
                <Text color="smBlue.500" as="span">
                  sample audio file
                </Text>
              </a>
            </Link>{' '}
            into the folder, or use your own. <br />
          </DescriptionLabel>
        </Box>
        <PanelDivider />
        <GenerateTokenComponent paddingTop="0.5em" raiseTokenStage={tokenGenerationStage} />

        {showDefaultCodeExample && <>
          <PanelDivider />
          <Box paddingTop="0.5em">
            <HeaderLabel>Make an API request</HeaderLabel>
            <DescriptionLabel>Run the command to generate a transcript.</DescriptionLabel>{' '}
            <CodeExamples />
          </Box>
        </>}
      </SmPanel>
    </Dashboard>
  );
});

const PanelDivider = () => (
  <Box
    bg="smBlack.200"
    height="1px"
    width="calc(100% + 3em)"
    style={{ marginLeft: '-1.5em', marginTop: '1em' }}
  />
);

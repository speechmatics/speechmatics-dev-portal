import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Tooltip,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import Dashboard from '../components/dashboard';
import { IoTrashBinOutline, IoCopyOutline } from 'react-icons/io5';

export default function GetAccessToken({}) {
  return (
    <Dashboard>
      <h1>API Token</h1>
      <div className="token_form">
        <div className="description_text">
          You need an API Key (also known as an Authorization Token) to make calls to our REST API.
          See our{' '}
          <a
            target="_blank"
            href="https://docs.speechmatics.com"
            style={{ textDecoration: 'underline' }}
          >
            documentation
          </a>{' '}
          to find out how to make API calls.
        </div>

        <GenerateTokenCompo />

        <PreviousTokens />
      </div>
    </Dashboard>
  );
}

const GenerateTokenCompo = () => {
  const [genTokenStage, setGenTokenStage] = useState<
    'init' | 'inputName' | 'waiting' | 'generated'
  >('init');

  const [chosenTokenName, setChosenTokenName] = useState('');

  const requestToken = useCallback(() => {
    setGenTokenStage('waiting');
    setTimeout(() => {
      setGenTokenStage('generated');
    }, 3000);
  }, []);

  return (
    <section>
      {genTokenStage == 'init' && (
        <HStack>
          <Button className="default_button" onClick={() => setGenTokenStage('inputName')}>
            Generate new token
          </Button>
        </HStack>
      )}
      {genTokenStage == 'inputName' && (
        <HStack>
          <input
            type="text"
            placeholder="your token's name here"
            onChange={(ev) => setChosenTokenName(ev.target.value)}
          ></input>
          <Button className="default_button" onClick={() => requestToken()}>
            Ok
          </Button>
        </HStack>
      )}
      {genTokenStage == 'waiting' && (
        <HStack>
          <Box>
            Sending request for Your "{chosenTokenName}" token. Please do hold on for a second or
            two...
          </Box>
          <Spinner height={20} />
        </HStack>
      )}
      {genTokenStage == 'generated' && (
        <VStack alignItems="flex-start">
          <Box>All good! Your new token is:</Box>
          <Box fontSize={22} padding="20px 0px">
            {generateToken()}
            <Tooltip label="copy" placement="right">
              <IconButton
                className="default_button"
                aria-label="copy"
                marginLeft={10}
                icon={<IoCopyOutline />}
                color="#bbb"
                backgroundColor="#fff"
                padding={5}
                _hover={{ color: '#fff', backgroundColor: 'var(--main-navy)' }}
              />
            </Tooltip>
          </Box>
          <Box>
            Please copy it.{' '}
            <Text as="span" color="#D72F3F">
              You will see this token only once.
            </Text>
          </Box>
          <HStack>
            <Box>Need another?</Box>
            <Button className="default_button" onClick={() => setGenTokenStage('inputName')}>
              Generate
            </Button>
          </HStack>
        </VStack>
      )}
    </section>
  );
};

const PreviousTokens = () => {
  const [tokens, setTokens] = useState([...testData.tokens]);

  const removeOne = useCallback(
    (index: number) => {
      testData.removeOne(index);
      setTokens([...testData.tokens]);
    },
    [tokens]
  );

  return (
    <section>
      <h2 style={{ marginTop: '70px' }}>Previous tokens:</h2>
      <VStack alignItems="stretch" marginRight="35%">
        {tokens.map((el, index) => (
          <HStack justifyContent="stretch" key={index}>
            <Box flex="1">
              <Tooltip label="(token's name)" placement="right">
                {el.name}
              </Tooltip>
            </Box>
            <Box flex="1">
              <Tooltip label="(date created)" placement="right">
                {el.dateCreated}
              </Tooltip>
            </Box>
            <Tooltip label="remove" placement="left">
              <IconButton
                className="default_button"
                aria-label="remove"
                style={{ padding: 10, backgroundColor: '' }}
                icon={<IoTrashBinOutline />}
                onClick={() => removeOne(index)}
              />
            </Tooltip>
          </HStack>
        ))}
      </VStack>
    </section>
  );
};

const generateToken = () => (Math.random() * 99999999999999999).toString(36).repeat(2);

const testData = {
  removeOne(index: number) {
    console.log('removeOne', index);
    this.tokens.splice(index, 1);
    console.log(this.tokens.length);
  },
  addOne(name: string) {
    if (this.tokens.length >= 5) {
      console.log("can't test add");
      return;
    }
    this.tokens.push({ dateCreated: 'today', dateLastUsed: 'not used yet', name });
  },
  tokens: [
    { dateCreated: 'Last Friday', dateLastUsed: 'Last Saturday', name: 'Alpha key' },
    { dateCreated: 'Last Monday', dateLastUsed: 'Yesterday', name: 'Beta key' },
    { dateCreated: '03/03/2021', dateLastUsed: 'Saturday', name: 'Gamma key' },
  ],
};

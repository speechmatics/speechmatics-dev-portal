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
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState, useMemo, useRef, useContext } from 'react';
import Dashboard from '../components/dashboard';
import { IoTrashBinOutline, IoCopyOutline } from 'react-icons/io5';
import accountContext, { ApiKey } from '../utils/account-store-context';
import { callPostApiKey, callRemoveApiKey } from '../utils/call-api';

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

const GenerateTokenCompo = observer(() => {
  const [genTokenStage, setGenTokenStage] = useState<
    'init' | 'inputName' | 'waiting' | 'generated' | 'error'
  >('init');

  const [chosenTokenName, setChosenTokenName] = useState('');
  const [generatedApikey, setGeneratedToken] = useState('');
  const [noNameError, setNoNameError] = useState(false);

  const { accountStore, tokenStore } = useContext(accountContext);
  const apiKeys = accountStore.getApiKeys();
  const idToken = tokenStore.tokenPayload?.idToken;

  const nameInputRef = useRef<HTMLInputElement>(null);
  const generatedApikeyinputRef = useRef<HTMLInputElement>(null);

  const requestToken = useCallback(() => {
    if (nameInputRef?.current?.value == '') {
      setNoNameError(true);
    } else {
      setNoNameError(false);

      setGenTokenStage('waiting');
      callPostApiKey(idToken, chosenTokenName, accountStore.getProjectId(), '')
        .then((resp) => {
          console.log('callPostApiKey resp', resp);
          setGeneratedToken(resp.key_value);
          setGenTokenStage('generated');
          accountStore.fetchServerState(idToken);
        })
        .catch((error) => {
          setGenTokenStage('error');
        });
    }
  }, [nameInputRef?.current?.value, idToken, chosenTokenName]);

  const generatedApikeyonClick = useCallback(() => {
    generatedApikeyinputRef.current.select();
  }, []);

  return (
    <section>
      {genTokenStage == 'init' && (
        <HStack>
          {apiKeys?.length >= 5 && (
            <Text>You already have 5 tokens, remove one before requesting new.</Text>
          )}
          <Button
            className="default_button"
            disabled={apiKeys?.length >= 5}
            onClick={() => setGenTokenStage('inputName')}
          >
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
            style={{ border: noNameError ? '1px solid red' : '' }}
            ref={nameInputRef}
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
          <Spinner size="md" />
        </HStack>
      )}
      {genTokenStage == 'generated' && (
        <VStack alignItems="flex-start">
          <Box>All good! Your new token is:</Box>
          <Box fontSize={22} padding="20px 0px">
            <input
              id="apikeyValue"
              type="text"
              value={generatedApikey}
              readOnly
              onClick={generatedApikeyonClick}
              ref={generatedApikeyinputRef}
            />
            <Tooltip label="copy" placement="right">
              <IconButton
                className="default_button"
                aria-label="copy"
                marginLeft={10}
                icon={<IoCopyOutline />}
                color="#bbb"
                backgroundColor="#fff"
                padding={5}
                onClick={() => {
                  navigator?.clipboard?.writeText(generatedApikey);
                }}
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
            <Button className="default_button" onClick={() => setGenTokenStage('init')}>
              Great!
            </Button>
          </HStack>
        </VStack>
      )}
      {genTokenStage == 'error' && (
        <>
          <Box pb={3}>
            <Text as="span" color="#D72F3F">
              Sorry, something has gone wrong. We're on it! Please try again in a moment.
            </Text>
          </Box>
          <Button className="default_button" onClick={() => setGenTokenStage('init')}>
            Start over!
          </Button>
        </>
      )}
    </section>
  );
});

const PreviousTokens = observer(() => {
  const [[apikeyIdToRemove, apikeyName], setApiKeyToRemove] = useState<[string, string]>(['', '']);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { accountStore, tokenStore } = useContext(accountContext);
  const apiKeys = accountStore.getApiKeys();
  const idToken = tokenStore.tokenPayload?.idToken;

  const aboutToRemoveOne = (el: ApiKey) => {
    console.log('aboutToRemoveOne', el, el.apikey_id);
    setApiKeyToRemove([el.apikey_id, el.name]);
    onOpen();
  };

  const onRemoveConfirm = () => {
    console.log('aboutToRemoveOne', apikeyIdToRemove);
    callRemoveApiKey(idToken, apikeyIdToRemove).then((res) =>
      accountStore.fetchServerState(idToken)
    );
    onClose();
  };

  return (
    <section>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>Remove the token "{apikeyName}"?</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onRemoveConfirm}>
              Yes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <h2 style={{ marginTop: '70px' }}>Previous tokens:</h2>
      <VStack alignItems="stretch" marginRight="25%">
        {apiKeys?.map((el: ApiKey, index) => (
          <HStack justifyContent="stretch" key={index}>
            <Box flex="1">
              <Tooltip label={`(token's id ${el.apikey_id})`} placement="right">
                <Text>{el.apikey_id.slice(0, 15)}</Text>
              </Tooltip>
            </Box>
            <Box flex="1">
              <Tooltip label="(token's name)" placement="right">
                <Text>{el.name}</Text>
              </Tooltip>
            </Box>
            <Box flex="1" noOfLines={1}>
              <Tooltip label={`date created: ${new Date(el.created_at)}`} placement="right">
                <Text>{new Date(el.created_at).toUTCString()}</Text>
              </Tooltip>
            </Box>
            <Tooltip label="remove" placement="left">
              <IconButton
                className="default_button"
                aria-label="remove"
                style={{ padding: 10, backgroundColor: '' }}
                icon={<IoTrashBinOutline />}
                onClick={() => aboutToRemoveOne(el)}
              />
            </Tooltip>
          </HStack>
        ))}
      </VStack>
    </section>
  );
});

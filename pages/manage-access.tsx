import {
  Box,
  Button,
  HStack,
  IconButton,
  Spinner,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Input,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useCallback, useState, useRef, useContext } from 'react';
import Dashboard from '../components/dashboard';
import { IoTrashBinOutline } from 'react-icons/io5';
import accountContext, { ApiKey } from '../utils/account-store-context';
import { callPostApiKey, callRemoveApiKey } from '../utils/call-api';
import React from 'react';
import {
  CodeExamples,
  CopyButton,
  DescriptionLabel,
  HeaderLabel,
  PageHeader,
  SmPanel,
} from '../components/common';
import { ExclamationIcon } from '../components/Icons';

//accountStore.getRuntimeURL()

export default function GetAccessToken({}) {
  return (
    <Dashboard>
      <PageHeader headerLabel="Manage Access" introduction="Manage API keys" />
      <SmPanel width="800px">
        <HeaderLabel>Generate an API Key</HeaderLabel>
        <DescriptionLabel>
          You need an API Key (also known as an Authorization Token) to make calls to our REST API.
        </DescriptionLabel>

        <GenerateTokenCompo />
      </SmPanel>

      <PreviousTokens />
    </Dashboard>
  );
}

const GenerateTokenCompo = observer(() => {
  const [genTokenStage, setGenTokenStage] = useState<'init' | 'waiting' | 'generated' | 'error'>(
    'init'
  );

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
    <Box width="100%">
      {(genTokenStage == 'init' || genTokenStage == 'waiting' || genTokenStage == 'generated') && (
        <HStack mt="1em" spacing="1em" width="100%">
          {apiKeys?.length >= 5 ? (
            <HStack width="100%" bg="smRed.100" p="1em" spacing="1em">
              <ExclamationIcon />
              <Text color="smRed.500" fontFamily="RMNeue-Regular" fontSize="0.95em">
                You already have 5 tokens, remove one before requesting new.
              </Text>
            </HStack>
          ) : (
            <>
              <Input
                variant="speechmatics"
                flex="1"
                type="text"
                placeholder="your token's name here"
                onChange={(ev) => setChosenTokenName(ev.target.value)}
                style={{ border: noNameError ? '1px solid red' : '' }}
                ref={nameInputRef}
                p="1.55em 1em"
                disabled={genTokenStage == 'waiting'}
              ></Input>
              <Button
                variant="speechmatics"
                disabled={genTokenStage == 'waiting'}
                onClick={() => requestToken()}
              >
                {genTokenStage == 'waiting' && <Spinner mr="1em" />}Generate API Key
              </Button>
            </>
          )}
        </HStack>
      )}

      {genTokenStage == 'generated' && (
        <VStack alignItems="flex-start" spacing="1.5em">
          <Box fontSize={22} position="relative" width="100%">
            <Input
              bg="smBlack.100"
              border="0"
              borderRadius="2px"
              p="1.5em"
              color="smBlack.400"
              width="100%"
              id="apikeyValue"
              type="text"
              value={generatedApikey}
              readOnly
              onClick={generatedApikeyonClick}
              ref={generatedApikeyinputRef}
            />
            <CopyButton copyContent={generatedApikey} position="absolute" top="8px" />
          </Box>
          <HStack width="100%" bg="smRed.100" p="1em" spacing="1em">
            <ExclamationIcon />
            <Text color="smRed.500" fontFamily="RMNeue-Regular" fontSize="0.95em">
              For security reasons, this key will not be displayed again. Please copy it now and
              keep it securely.
            </Text>
          </HStack>
          <Text>
            The following curl command contains your new API key which will become active after 1
            minute.
          </Text>
          <CodeExamples token={generatedApikey} />
          <HStack>
            <Button variant="speechmatics" onClick={() => setGenTokenStage('init')}>
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
    </Box>
  );
});

const PreviousTokens = observer(() => {
  const [[apikeyIdToRemove, apikeyName], setApiKeyToRemove] = useState<[string, string]>(['', '']);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { accountStore, tokenStore } = useContext(accountContext);
  const apiKeys = accountStore
    .getApiKeys()
    ?.slice()
    .sort((elA, elB) => new Date(elB.created_at).getTime() - new Date(elA.created_at).getTime());
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
    <section className="sm_panel" style={{ marginTop: '2em', width: '800px' }}>
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

      <HeaderLabel>Current API Keys</HeaderLabel>
      <DescriptionLabel>
        You have used {apiKeys?.length}/5 of your available API keys.
      </DescriptionLabel>

      <Grid gridTemplateColumns="repeat(3, 1fr)" className="sm_grid">
        <GridItem className="grid_header">API key name</GridItem>
        <GridItem className="grid_header">Created</GridItem>
        <GridItem className="grid_header"></GridItem>

        {apiKeys?.map((el, i) => (
          <React.Fragment key={`${el.name}${el.created_at}`}>
            <GridItem className="grid_row_divider">{i != 0 && <hr />}</GridItem>
            <GridItem>{el.name}</GridItem>
            <GridItem>{new Date(el.created_at).toDateString()}</GridItem>
            <GridItem display="flex" justifyContent="flex-end" style={{ padding: '0.4em' }}>
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="remove"
                icon={<IoTrashBinOutline />}
                onClick={() => aboutToRemoveOne(el)}
              />
            </GridItem>
          </React.Fragment>
        ))}
      </Grid>
    </section>
  );
});

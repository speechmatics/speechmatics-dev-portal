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
  ChakraComponent,
  Flex,
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
import { ExclamationIcon, ExclamationIconLarge } from '../components/icons-library';
import { formatDate } from '../utils/date-utils';

//accountStore.getRuntimeURL()

export default function GetAccessToken({ }) {
  return (
    <Dashboard>
      <PageHeader headerLabel="Manage Access" introduction="Manage API keys" />

      <SmPanel width="800px">
        <GenerateTokenComponent />
      </SmPanel>

      <SmPanel width="800px" mt="2em">
        <PreviousTokens />
      </SmPanel>
    </Dashboard>
  );
}

export const GenerateTokenComponent: ChakraComponent<'div', {}> = observer((props) => {
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
      callPostApiKey(idToken, nameInputRef?.current?.value, accountStore.getProjectId(), '')
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

  const inputOnKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((ev) => {
    if (ev.key == "Enter") {
      ev.preventDefault();
      requestToken();
    }
  }, [nameInputRef?.current?.value]);

  return (
    <Box width="100%" {...props}>
      <HeaderLabel>Generate an API Key</HeaderLabel>
      <DescriptionLabel>
        Create new keys to manage security or provide temporary access
      </DescriptionLabel>
      {(genTokenStage == 'init' || genTokenStage == 'waiting' || genTokenStage == 'generated') && (
        <HStack mt="1em" spacing="1em" width="100%">
          {apiKeys?.length >= 5 ? (
            <HStack width="100%" bg="smRed.100" p="1em" spacing="1em">
              <ExclamationIcon />
              <Text color="smRed.500" fontFamily="RMNeue-Regular" fontSize="0.95em">
                Before generating a new API key, you need to remove an existing key.
              </Text>
            </HStack>
          ) : (
            <>
              <Input
                variant="speechmatics"
                flex="1"
                type="text"
                placeholder="Enter a name for your API key"
                onChange={(ev) => setChosenTokenName(ev.target.value)}
                style={{ border: noNameError ? '1px solid red' : '' }}
                ref={nameInputRef}
                p="1.55em 1em"
                disabled={genTokenStage == 'waiting'}
                onKeyDown={inputOnKeyDown}
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
        <VStack alignItems="flex-start" spacing="1.5em" mt='1.5em'>
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
    <Box width="100%">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2px">
          <ModalCloseButton _focus={{ boxShadow: '' }} />
          <ModalBody>
            <Flex justifyContent="center" width="100%">
              <Box mt="1em">
                <ExclamationIconLarge />
              </Box>
            </Flex>
            <Box fontFamily="RMNeue-Bold" fontSize="1.5em" textAlign="center" px="1.5em" mt="0.5em">
              Are you sure want to delete "{apikeyName}" API key?
            </Box>
            <Box
              fontFamily="RMNeue-Light"
              fontSize="0.8em"
              textAlign="center"
              px="5em"
              color="smBlack.400"
              mt="1em"
            >
              This operation cannot be undone and will invalidate the API key
            </Box>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Flex alignItems="center">
              <Button
                variant="speechmatics"
                bg="smRed.500"
                _hover={{ bg: 'smRed.400' }}
                mr={3}
                py="1.1em"
                onClick={onRemoveConfirm}
              >
                Confirm deletion
              </Button>
              <Button
                variant="speechmatics"
                bg="smBlack.200"
                color="smBlack.400"
                py="1.1em"
                _hover={{ bg: 'smBlack.150' }}
                onClick={onClose}
              >
                Cancel
              </Button>
            </Flex>
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
            <GridItem>{formatDate(new Date(el.created_at))}</GridItem>
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
        {!accountStore.isLoading && (!apiKeys || apiKeys?.length == 0) && (
          <GridItem colSpan={3}>
            <Flex width="100%" justifyContent="center">
              <ExclamationIcon />
              <Text ml="1em">You don’t currently have any API keys</Text>
            </Flex>
          </GridItem>
        )}
        {accountStore.isLoading && (
          <GridItem colSpan={3}>
            <Flex width="100%" justifyContent="center">
              <Spinner size='sm' />
              <Text ml="1em">One moment please...</Text>
            </Flex>
          </GridItem>
        )}
      </Grid>
    </Box>
  );
});

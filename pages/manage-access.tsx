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
  BoxProps,
  useBreakpointValue,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useCallback, useState, useRef, useContext, useEffect } from 'react';
import Dashboard from '../components/dashboard';
import { IoTrashBinOutline } from 'react-icons/io5';
import accountContext, { ApiKey } from '../utils/account-store-context';
import { callPostApiKey, callRemoveApiKey } from '../utils/call-api';
import React from 'react';
import {
  AttentionBar,
  CodeExamples,
  ConfirmRemoveModal,
  CopyButton,
  DescriptionLabel,
  GridSpinner,
  HeaderLabel,
  PageHeader,
  positiveToast,
  SmPanel,
} from '../components/common';
import { ExclamationIcon, ExclamationIconLarge } from '../components/icons-library';
import { formatDate } from '../utils/date-utils';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

//accountStore.getRuntimeURL()

export default function GetAccessToken({ }) {
  return (
    <Dashboard>
      <PageHeader headerLabel="Manage Access" introduction="Manage API Keys." />

      <SmPanel width="100%" maxWidth='900px'>
        <GenerateTokenComponent />
      </SmPanel>

      <SmPanel width="100%" maxWidth='900px' mt="2em">
        <PreviousTokens />
      </SmPanel>
    </Dashboard>
  );
}

export type TokenGenStages = 'init' | 'waiting' | 'generated' | 'error';

type GTCprops = {
  codeExample?: boolean,
  boxProps?: BoxProps,
  raiseTokenStage?: (stage: TokenGenStages) => void,
  tokensFullDescr?: string | ReactJSXElement
}

export const GenerateTokenComponent: ChakraComponent<'div', GTCprops>
  = observer(({ codeExample = true, boxProps = null, raiseTokenStage = null, tokensFullDescr = null }) => {

    const breakVal = useBreakpointValue({
      base: 0, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6
    });



    const { accountStore, tokenStore } = useContext(accountContext);

    const [genTokenStage, setGenTokenStageOnState] = useState<TokenGenStages>('init');
    const [chosenTokenName, setChosenTokenName] = useState('');
    const [generatedToken, setGeneratedToken] = useState('');
    const [noNameError, setNoNameError] = useState(false);

    const apiKeys = accountStore.getApiKeys();
    const idToken = tokenStore.tokenPayload?.idToken;

    const nameInputRef = useRef<HTMLInputElement>(null);
    const generatedApikeyinputRef = useRef<HTMLInputElement>(null);

    const setGenTokenStage = useCallback((stage: TokenGenStages) => {
      raiseTokenStage?.(stage);
      setGenTokenStageOnState(stage);
    }, [genTokenStage]);

    useEffect(() => {
      if (accountStore.keyJustRemoved == true) {
        setGenTokenStage('init');
        accountStore.keyJustRemoved = false;
        if (nameInputRef.current) nameInputRef.current.value = '';
      }
    }, [accountStore.keyJustRemoved])

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
            if (nameInputRef.current) nameInputRef.current.value = '';
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
      <Box width="100%" {...boxProps}>
        <HeaderLabel>Generate an API Key</HeaderLabel>
        <DescriptionLabel>
          Create new keys to manage security or provide temporary access.
        </DescriptionLabel>
        {(genTokenStage == 'init' || genTokenStage == 'waiting' || genTokenStage == 'generated') && (
          <HStack mt="1em" spacing="1em" width="100%">
            {apiKeys?.length >= 5 ? (
              <AttentionBar description={tokensFullDescr || 'Before generating a new API key, you need to remove an existing key.'} />
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
                  data-qa="input-token-name"
                  maxLength={30}
                ></Input>
                <Button
                  variant="speechmatics"
                  disabled={genTokenStage == 'waiting'}
                  onClick={() => requestToken()}
                  data-qa="button-generate-key"
                  {...(breakVal < 3 && { paddingLeft: '1em', paddingRight: '1em' })}
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
                value={generatedToken}
                readOnly
                onClick={generatedApikeyonClick}
                ref={generatedApikeyinputRef}
              />
              <CopyButton copyContent={generatedToken} position="absolute" top="8px" />
            </Box>
            <AttentionBar data_qa="message-token-security" description={'For security reasons, this key will not be displayed again. Please copy it now and keep it securely.'} />

            {codeExample && <>
              <Text color='smBlack.300'>
                The following curl command contains your new API key which will become active after 1
                minute.
              </Text>
              <CodeExamples token={generatedToken} />
            </>}

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
    callRemoveApiKey(idToken, apikeyIdToRemove).then((res) => {
      accountStore.fetchServerState(idToken);
      positiveToast('API Key removed');
    });
    onClose();
    accountStore.keyJustRemoved = true;
  };

  return (
    <Box width="100%">
      <ConfirmRemoveModal isOpen={isOpen} onClose={onClose}
        mainTitle={`Are you sure want to delete "${apikeyName}" API key?`}
        subTitle='This operation cannot be undone and will invalidate the API key'
        onRemoveConfirm={onRemoveConfirm}
        confirmLabel='Confirm deletion'
      />

      <HeaderLabel>Current API Keys</HeaderLabel>
      <DescriptionLabel>
        You have used {apiKeys?.length}/5 of your available API keys.
      </DescriptionLabel>

      <Grid gridTemplateColumns="repeat(3, 1fr)" className="sm_grid">
        <GridItem className="grid_header">API Key Name</GridItem>
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
              <Text ml="1em">You don’t currently have any API keys.</Text>
            </Flex>
          </GridItem>
        )}
        {accountStore.isLoading && (
          <GridItem colSpan={3}>
            <Flex width="100%" justifyContent="center">
              <GridSpinner />
              <Text ml="1em">One moment please...</Text>
            </Flex>
          </GridItem>
        )}
      </Grid>
    </Box>
  );
});




import { BoxProps, ChakraComponent, useBreakpointValue, Box, VStack, HStack, Input, Button, Spinner, Text } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { observer } from "mobx-react-lite";
import { useContext, useState, useRef, useCallback, useEffect } from "react";
import { callPostApiKey } from "../utils/call-api";
import { CodeExamples } from "./code-examples";
import { HeaderLabel, DescriptionLabel, ErrorBanner, WarningBanner, CopyButton } from "./common";
import { CompleteIcon } from "./icons-library";
import accountContext from '../utils/account-store-context';


export type TokenGenStages = 'init' | 'waiting' | 'generated' | 'error';

type GTCprops = {
  codeExample?: boolean;
  boxProps?: BoxProps;
  raiseTokenStage?: (stage: TokenGenStages) => void;
  tokensFullDescr?: string | ReactJSXElement;
};

export const GenerateTokenComponent: ChakraComponent<'div', GTCprops> = observer(
  ({ codeExample = true, boxProps = null, raiseTokenStage = null, tokensFullDescr = null }) => {
    const breakVal = useBreakpointValue({
      base: 0,
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
      '2xl': 6
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

    const setGenTokenStage = useCallback(
      (stage: TokenGenStages) => {
        raiseTokenStage?.(stage);
        setGenTokenStageOnState(stage);
      },
      [genTokenStage]
    );

    useEffect(() => {
      if (accountStore.keyJustRemoved == true) {
        setGenTokenStage('init');
        accountStore.keyJustRemoved = false;
        if (nameInputRef.current) nameInputRef.current.value = '';
      }
    }, [accountStore.keyJustRemoved]);

    const requestToken = useCallback(() => {
      if (nameInputRef?.current?.value == '') {
        setNoNameError(true);
      } else {
        setNoNameError(false);
        setGenTokenStage('waiting');
        callPostApiKey(nameInputRef?.current?.value, accountStore.getProjectId())
          .then((resp) => {
            setGeneratedToken(resp.key_value);
            setChosenTokenName('')
            setGenTokenStage('generated');
            accountStore.fetchServerState();
            if (nameInputRef.current) nameInputRef.current.value = '';
          })
          .catch((error) => {
            setGenTokenStage('error');
          });
      }
    }, [nameInputRef?.current?.value, chosenTokenName]);

    const generatedApikeyonClick = useCallback(() => {
      generatedApikeyinputRef.current.select();
    }, []);

    const inputOnKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
      (ev) => {
        if (ev.key == 'Enter') {
          ev.preventDefault();
          requestToken();
        }
      },
      [nameInputRef?.current?.value]
    );

    return (
      <Box width='100%' {...boxProps}>
        <HeaderLabel>Generate an API Key</HeaderLabel>
        <DescriptionLabel>
          Create new keys to manage security or provide temporary access.
        </DescriptionLabel>
        {(genTokenStage == 'init' || genTokenStage == 'waiting' || genTokenStage === 'error') && (
          accountStore.responseError ?
            <ErrorBanner mt="0" content={`Unable to create api keys. Couldn't retreive account information.`} />
            :
            <VStack width='100%' spacing={4}>
              <HStack mt='1em' spacing='1em' width='100%'>
                <Input
                  variant='speechmatics'
                  flex='1'
                  type='text'
                  bg={genTokenStage == 'waiting' || apiKeys?.length >= 5 ? 'smBlack.100' : null}
                  placeholder='Enter a name for your API key'
                  onChange={(ev) => setChosenTokenName(ev.target.value)}
                  style={{ border: noNameError ? '1px solid red' : '' }}
                  ref={nameInputRef}
                  p='1.55em 1em'
                  disabled={genTokenStage == 'waiting' || apiKeys?.length >= 5}
                  onKeyDown={inputOnKeyDown}
                  data-qa='input-token-name'
                  maxLength={120}></Input>
                <Button
                  variant='speechmatics'
                  disabled={genTokenStage == 'waiting' || apiKeys?.length >= 5 || !chosenTokenName?.length}
                  onClick={() => requestToken()}
                  data-qa='button-generate-key'
                  {...(breakVal < 3 && { paddingLeft: '1em', paddingRight: '1em' })}>
                  {genTokenStage == 'waiting' && <Spinner mr='1em' />}Generate API Key
                </Button>
              </HStack>

              {apiKeys?.length >= 5 && (
                <WarningBanner
                  text={
                    tokensFullDescr ||
                    'You are using all of your available API keys. To generate a new API key, you need to delete an existing API key.'
                  }
                />
              )}

              {genTokenStage === 'error' && (
                <ErrorBanner
                  alignment='left'
                  text={
                    tokensFullDescr ||
                    'Something went wrong generating your API key. Please try again.'
                  }
                />
              )}
            </VStack>
        )}

        {genTokenStage == 'generated' && (
          <VStack alignItems='flex-start' spacing='1.5em' mt='1.5em'>
            <VStack py={8} px={breakVal < 4 ? 0 : 6} spacing={4} width='100%' borderY='1px' borderColor='smBlack.130'>
              <VStack mb={2} textAlign='center' spacing={4} width='100%' alignItems='center'>
                <CompleteIcon fontSize={64} />
                <Text fontSize='1.2em'>Successfully Generated Your API Key</Text>
              </VStack>
              <VStack spacing={4} pb={2} width='100%'>
                <Box fontSize={22} position='relative' width='100%'>
                  <Input
                    bg='smBlack.100'
                    border='0'
                    borderRadius='2px'
                    p='1.5em'
                    color='smBlack.400'
                    width='100%'
                    id='apikeyValue'
                    type='text'
                    value={generatedToken}
                    readOnly
                    onClick={generatedApikeyonClick}
                    ref={generatedApikeyinputRef}
                  />
                  <CopyButton copyContent={generatedToken} position='absolute' top='8px' />
                </Box>
                <WarningBanner
                  data_qa='message-token-security'
                  text={
                    'For security reasons, this key will not be displayed again. Please copy it now and keep it securely.'
                  }
                />
              </VStack>

              <Button
                variant='speechmaticsOutline'
                onClick={() => setGenTokenStage('init')}
                data-qa={`button-create-another-key`}>
                Generate Another Key
              </Button>
            </VStack>

            {codeExample && (
              <>
                <Text color='smBlack.300'>
                  The following curl commands contain your new API key.
                </Text>
                <CodeExamples token={generatedToken} />
              </>
            )}
          </VStack>
        )}
      </Box>
    );
  }
);

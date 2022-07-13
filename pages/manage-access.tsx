import Dashboard from '../components/dashboard';
import React from 'react';
import {
  PageHeader,
  SmPanel,
  ErrorBanner,
  
} from '../components/common';
import { ExclamationIcon, BinIcon, CompleteIcon } from '../components/icons-library';
import { formatDate } from '../utils/date-utils';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { CodeExamples } from '../components/code-examples';
import { useIsAuthenticated } from '@azure/msal-react';
import { PreviousTokens } from '../components/previous-tokens';
import { GenerateTokenComponent } from '../components/generate-token-component';

export default function GetAccessToken({ }) {
  return (
    <Dashboard>
      <PageHeader headerLabel='Manage Access' introduction='Manage API Keys.' />

      <SmPanel width='100%' maxWidth='900px'>
        <GenerateTokenComponent />
      </SmPanel>

      <SmPanel width='100%' maxWidth='900px' mt='2em'>
        <PreviousTokens />
      </SmPanel>
    </Dashboard>
  );
}

export type TokenGenStages = 'init' | 'waiting' | 'generated' | 'error';

type GTCprops = {
  codeExample?: boolean;
  boxProps?: BoxProps;
  raiseTokenStage?: (stage: TokenGenStages) => void;
  tokensFullDescr?: string | ReactJSXElement;
};

export const GenerateTokenComponent: ChakraComponent<'div', GTCprops> = observer(
  ({ codeExample = true, boxProps = null, raiseTokenStage = null, tokensFullDescr = null }) => {
    const authenticated = useIsAuthenticated();
    const breakVal = useBreakpointValue({
      base: 0,
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
      '2xl': 6
    });

    const { accountStore } = useContext(accountContext);

    const [genTokenStage, setGenTokenStageOnState] = useState<TokenGenStages>('init');
    const [chosenTokenName, setChosenTokenName] = useState('');
    const [generatedToken, setGeneratedToken] = useState('');
    const [noNameError, setNoNameError] = useState(false);

    const apiKeys = accountStore.getApiKeys();

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
    }, [nameInputRef?.current?.value, authenticated, chosenTokenName]);

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
                disabled={genTokenStage == 'waiting' || apiKeys?.length >= 5 || !chosenTokenName?.length }
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

const PreviousTokens = observer(() => {
  const [[apikeyIdToRemove, apikeyName], setApiKeyToRemove] = useState<[string, string]>(['', '']);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { accountStore } = useContext(accountContext);
  const apiKeys = accountStore
    .getApiKeys()
    ?.slice()
    .sort((elA, elB) => new Date(elB.created_at).getTime() - new Date(elA.created_at).getTime());

  const aboutToRemoveOne = (el: ApiKey) => {
    console.log('aboutToRemoveOne', el, el.apikey_id);
    setApiKeyToRemove([el.apikey_id, el.name]);
    onOpen();
  };

  const onRemoveConfirm = () => {
    console.log('aboutToRemoveOne', apikeyIdToRemove);
    callRemoveApiKey(apikeyIdToRemove).then((res) => {
      accountStore.fetchServerState();
      positiveToast('API Key removed');
    });
    onClose();
    accountStore.keyJustRemoved = true;
  };

  return (
    <Box width='100%'>
      <ConfirmRemoveModal
        isOpen={isOpen}
        onClose={onClose}
        mainTitle={`Are you sure want to delete "${apikeyName}" API key?`}
        subTitle='This operation cannot be undone and will invalidate the API key'
        onRemoveConfirm={onRemoveConfirm}
        confirmLabel='Confirm deletion'
      />

      <HeaderLabel>Current API Keys</HeaderLabel>
      <DescriptionLabel>
        You have used {apiKeys?.length}/5 of your available API keys.
      </DescriptionLabel>

      <Grid gridTemplateColumns='repeat(3, 1fr)' className='sm_grid'>
        <GridItem className='grid_header'>API Key Name</GridItem>
        <GridItem className='grid_header'>Created</GridItem>
        <GridItem className='grid_header'></GridItem>

        {apiKeys?.map((el, i) => (
          <React.Fragment key={`${el.name}${el.created_at}`}>
            <GridItem className='grid_row_divider'>{i != 0 && <hr />}</GridItem>
            <GridItem>{el.name}</GridItem>
            <GridItem>{formatDate(new Date(el.created_at))}</GridItem>
            <GridItem display='flex' justifyContent='flex-end' style={{ padding: '0.4em' }}>
              <IconButton
                size='sm'
                variant='ghost'
                aria-label='remove'
                icon={<BinIcon />}
                onClick={() => aboutToRemoveOne(el)}
              />
            </GridItem>
          </React.Fragment>
        ))}
        {!accountStore.isLoading && (!apiKeys || apiKeys?.length == 0) && (
          <GridItem colSpan={3}>
            <Flex width='100%' justifyContent='center'>
              <ExclamationIcon />
              <Text ml='1em'>You don’t currently have any API keys.</Text>
            </Flex>
          </GridItem>
        )}
        {accountStore.isLoading && (
          <GridItem colSpan={3}>
            <Flex width='100%' justifyContent='center'>
              <GridSpinner />
              <Text ml='1em'>One moment please...</Text>
            </Flex>
          </GridItem>
        )}
      </Grid>
    </Box>
  );
});

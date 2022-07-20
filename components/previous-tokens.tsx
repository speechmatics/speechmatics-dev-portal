import { useDisclosure, Box, Grid, GridItem, IconButton, Flex, Text, toast } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useState, useContext, useMemo } from "react";
import accountContext, { ApiKey } from '../utils/account-store-context';
import { callRemoveApiKey } from "../utils/call-api";
import { formatDate } from "../utils/date-utils";
import { positiveToast, ConfirmRemoveModal, HeaderLabel, DescriptionLabel, GridSpinner, errToast, infoToast } from "./common";
import { BinIcon, ExclamationIcon } from "./icons-library";


export const PreviousTokens = observer(() => {
  const [[apikeyIdToRemove, apikeyName], setApiKeyToRemove] = useState<[string, string]>(['', '']);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { accountStore } = useContext(accountContext);

  const apiKeys = useMemo(() => (
    accountStore.getApiKeys()?.slice()
      .sort((elA, elB) => new Date(elB.created_at).getTime() - new Date(elA.created_at).getTime())),
    [accountStore.getApiKeys()]);

  const aboutToRemoveOne = (el: ApiKey) => {
    console.log('aboutToRemoveOne', el, el.apikey_id);
    setApiKeyToRemove([el.apikey_id, el.name]);
    onOpen();
  };

  const onRemoveConfirm = () => {
    console.log('onRemoveConfirm', apikeyIdToRemove);
    callRemoveApiKey(apikeyIdToRemove).then((res) => {
      accountStore.fetchServerState();
      positiveToast('API Key removed');
    }).catch(error => {
      accountStore.fetchServerState();
      toast.close(error.toastId);
      infoToast('API Key already removed')
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
            <GridItem fontFamily='RMNeue-Light'>{formatDate(new Date(el.created_at))}</GridItem>
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
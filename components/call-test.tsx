import { Button, VStack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { call } from '../utils/call-api';
import { callGetAccounts, callPostAccounts } from '../utils/call-api';

export default ({ tokenPayload }) => {
  const [response, setResponse] = useState();

  const [mpAccount, setMpAccount] = useState();

  const callb = useCallback(() => {
    console.log('hello', tokenPayload);
    if (tokenPayload) {
      call(tokenPayload.accessToken, process.env.TEST_API_CALL_ENDPOINT, 'GET').then(
        (resp) => (setResponse(resp?.name), console.log(JSON.stringify(resp)))
      );
    }
  }, [tokenPayload]);

  const callb2 = useCallback(() => {
    if (tokenPayload) {
      call(tokenPayload.idToken, process.env.TEST_API_CALL_ENDPOINT, 'GET').then(
        (resp) => (setResponse(resp.name), console.log(JSON.stringify(resp)))
      );
    }
  }, [tokenPayload]);

  const callb3 = useCallback(() => {
    console.log('calling GET /accounts to check the accounts');
    let isActive = true;
    if (tokenPayload?.idToken) {
      callGetAccounts(tokenPayload.idToken)
        .then((jsonResp: any) => {
          console.log('response from GET /accounts is', jsonResp);

          if (
            jsonResp &&
            jsonResp.accounts &&
            Array.isArray(jsonResp.accounts) &&
            jsonResp.accounts.length == 0
          ) {
            console.log(
              'no account on management platform, sending a request to create with POST /accounts'
            );

            return callPostAccounts(tokenPayload.idToken).then((jsonPostResp) => {
              console.log('response from POST /accounts', jsonPostResp);
              if (isActive) setMpAccount(jsonPostResp);
            });
          } else if (jsonResp && Array.isArray && jsonResp.length > 0) {
            if (isActive) setMpAccount(jsonResp);
          }
        })
        .catch(console.error);
    }
  }, [tokenPayload?.idToken]);

  return (
    <VStack style={{ marginTop: 50 }}>
      <Button size="xs" variant="outline" onClick={callb}>
        test accesstoken on test endpoint
      </Button>
      <Button size="xs" variant="outline" onClick={callb3}>
        test /accounts with idtoken
      </Button>
      <div dangerouslySetInnerHTML={{ __html: response }} />
      <div>test env var:: {process.env.TEST_IF_WORKS_ENV_VAR}</div>
    </VStack>
  );
};

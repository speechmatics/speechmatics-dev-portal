import { Button, VStack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { accountsFlow, call } from '../utils/call-api';

export default ({ tokenPayload }) => {
  const [response, setResponse] = useState();

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
    if (tokenPayload?.idToken) {
      accountsFlow(tokenPayload.idToken);
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

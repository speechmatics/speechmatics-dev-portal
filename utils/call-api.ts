import { createStandaloneToast } from '@chakra-ui/react';

const toast = createStandaloneToast();

const ENDPOINT_API_URL = process.env.ENDPOINT_API_URL;

export const errToast = (descr: string) =>
  toast({
    title: 'An error occurred.',
    description: descr,
    status: 'error',
    duration: 9000,
    position: 'bottom-right',
    isClosable: true,
  });

export const positiveToast = (descr: string) =>
  toast({
    title: 'All fine.',
    description: descr,
    status: 'success',
    duration: 9000,
    position: 'bottom-right',
    isClosable: true,
  });

export const callPostAccounts = async (accessToken: string) => {
  return call(accessToken, `${ENDPOINT_API_URL}/accounts`, 'POST');
};

export const callGetAccounts = async (idToken: string) => {
  return call(idToken, `${ENDPOINT_API_URL}/accounts`, 'GET');
};

export const callGetUsage = async (idToken: string, contractId: number, projectId: number) => {
  return call(idToken, `${ENDPOINT_API_URL}/usage`, 'GET', {
    contract_id: contractId,
    project_id: projectId,
    grouping: 'day',
    sort_order: 'asc',
  });
};

export const callRemoveApiKey = async (idToken: string, apiKeyId: string) => {
  return call(idToken, `${ENDPOINT_API_URL}/api_keys/${apiKeyId}`, 'DELETE');
};

export const callGetSecrChargify = async (idToken: string, projectId: number) => {
  return call(idToken, `${ENDPOINT_API_URL}/contracts/${projectId}/payment_token`, 'GET');
};

export const callPostRequestTokenChargify = async (idToken: string, chargifyToken: string) => {
  return call(idToken, `${ENDPOINT_API_URL}/contracts`, 'PUT', {
    contract_request_token: chargifyToken,
  });
};

export const callPostApiKey = async (
  idToken: string,
  name: string,
  projectId: number,
  clientRef: string
) => {
  return call(idToken, `${ENDPOINT_API_URL}/api_keys`, 'POST', {
    project_id: projectId,
    name,
  });
};

export const call = async (
  authToken: string,
  apiEndpoint: string,
  method: string,
  body: any = null
) => {
  const headers = new Headers();
  const bearer = `Bearer ${authToken}`;

  headers.append('Authorization', bearer);
  headers.append('Content-Type', 'application/json');

  const options = {
    method: method,
    headers: headers,
    body: method.toLowerCase() == 'post' ? JSON.stringify(body) : undefined,
  };

  if (method.toLowerCase() == 'get' && !!body) {
    apiEndpoint = `${apiEndpoint}?${getParams(body)}`;
  }

  console.log('fetching', apiEndpoint, options);

  return fetch(apiEndpoint, options)
    .then((response) => {
      if (response.status != 200 && response.status != 201) {
        errToast(`response from ${method} ${apiEndpoint} has status ${response.status}`);
        throw new Error(`response from ${method} ${apiEndpoint} has status ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      errToast(`details: ${error}`);
      console.log(error);
    });
};

function getParams(paramsObj: { [key: string]: string | number }) {
  return Object.keys(paramsObj).reduce(
    (prev, curr, i) => `${prev}${i != 0 ? '&' : ''}${curr}=${paramsObj[curr]}`,
    ''
  );
}

export async function accountsFlow(
  accessToken: string,
  isSettingUpAccount: (val: boolean) => void
): Promise<any> {
  return callGetAccounts(accessToken)
    .then(async (jsonResp: any) => {
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
        isSettingUpAccount(true);
        return callPostAccounts(accessToken).then((jsonPostResp) => {
          console.log('response from POST /accounts', jsonPostResp);
          isSettingUpAccount(false);
          return jsonPostResp;
        });
      } else if (jsonResp && Array.isArray(jsonResp.accounts) && jsonResp.accounts.length > 0) {
        return jsonResp;
      }

      throw new Error(`unknown response from /accounts: ${jsonResp}`);
    })
    .catch((err) => {
      errToast(`unknown error while fetching account: ${err}`);
      console.error(err);
    });
}

import { errToast } from '../components/common';
import { msalLogout } from './msal-utils';

const ENDPOINT_API_URL = process.env.ENDPOINT_API_URL;
const RUNTIME_API_URL = process.env.RUNTIME_API_URL;

//callRemoveCard;

export const callPostAccounts = async (accessToken: string) => {
  return call(accessToken, `${ENDPOINT_API_URL}/accounts`, 'POST');
};

export const callGetAccounts = async (idToken: string) => {
  return call(idToken, `${ENDPOINT_API_URL}/accounts`, 'GET');
};

export const callGetUsage = async (idToken: string, contractId: number, projectId: number, dates: any) => {
  return call(idToken, `${ENDPOINT_API_URL}/usage`, 'GET', {
    contract_id: contractId,
    project_id: projectId,
    grouping: 'day',
    sort_order: 'asc',
    ...dates
  });
};

export const callGetJobs = async (idToken: string, contractId: number, projectId: number, optionalQueries: any) => {
  return call(idToken, `${RUNTIME_API_URL}/jobs`, 'GET', {
    contract_id: contractId,
    project_id: projectId,
    ...optionalQueries
  })
};

export const callDeleteJob = async (idToken: string, jobId: string, force: boolean) => {
  return call(idToken, `${RUNTIME_API_URL}/jobs/${jobId}`, 'DELETE', {
    force
  });
};

export const callGetTranscript = async (idToken: string, jobId: string, format: string) => {
  return call(idToken, `${RUNTIME_API_URL}/jobs/${jobId}/transcript`, 'GET', {
    format
  },
  format === 'json-v2' ? 'json' : 'text');
};

export const callRemoveApiKey = async (idToken: string, apiKeyId: string) => {
  return call(idToken, `${ENDPOINT_API_URL}/api_keys/${apiKeyId}`, 'DELETE');
};

export const callGetSecrChargify = async (idToken: string, contractId: number) => {
  return call(idToken, `${ENDPOINT_API_URL}/contracts/${contractId}/payment_token`, 'GET');
};

export const callPostRequestTokenChargify = async (
  idToken: string,
  contractId: number,
  chargifyToken: string
) => {
  return call(idToken, `${ENDPOINT_API_URL}/contracts/${contractId}/cards`, 'POST', {
    card_request_token: chargifyToken,
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

export const callGetPayments = async (idToken: string) => {
  return call(idToken, `${ENDPOINT_API_URL}/payments`, 'GET');
};

export const callRemoveCard = async (idToken: string, contractId: number) => {
  return call(idToken, `${ENDPOINT_API_URL}/contracts/${contractId}/cards`, 'DELETE');
};

export const call = async (
  authToken: string,
  apiEndpoint: string,
  method: string,
  body: any = null,
  format: string = 'json'
) => {
  const headers = new Headers();
  const bearer = `Bearer ${authToken}`;

  headers.append('Authorization', bearer);
  headers.append('Content-Type', 'application/json');

  const options = {
    method: method,
    headers: headers,
    body: method.toLowerCase() != 'get' && body ? JSON.stringify(body) : undefined,
  };

  if (method.toLowerCase() == 'get' && !!body) {
    apiEndpoint = `${apiEndpoint}?${getParams(body)}`;
  }

  console.log('fetching', apiEndpoint, options);

  return fetch(apiEndpoint, options)
    .then(async (response) => {
      console.log(
        `response from`,
        apiEndpoint,
        options,
        'is:',
        // await jsonCopy(response.clone()),
        response
      );
      if (response.status == 401) {
        msalLogout(true);
      }
      if (response.status != 200 && response.status != 201) {
        throw new Error(`response from ${method} ${apiEndpoint} has status ${response.status}`);
      }
      if (response.body == null) {
        return null
      }
      if ( format === 'json') {
        return response.json()
      }
      return response.text()
    })
    .catch((error) => {
      errToast(`details: ${error}`);
      throw error
    });
};

function getParams(paramsObj: { [key: string]: string | number }) {
  return Object.keys(paramsObj).reduce(
    (prev, curr, i) => `${prev}${i != 0 ? '&' : ''}${curr}=${paramsObj[curr]}`,
    ''
  );
}

async function jsonCopy(response: Response) {
  try {
    return response.json().catch(console.error);
  } catch (e) {
    return '';
  }
}

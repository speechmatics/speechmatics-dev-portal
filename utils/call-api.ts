import { errToast } from '../components/common';
import { msalLogout } from './msal-utils';
import { Accuracy, Separation } from './transcribe-store-flow';

const ENDPOINT_API_URL = process.env.ENDPOINT_API_URL;

//callRemoveCard;

export const callPostAccounts = async (accessToken: string) => {
  return call(accessToken, `${ENDPOINT_API_URL}/accounts`, 'POST');
};

export const callGetAccounts = async (idToken: string) => {
  return call(idToken, `${ENDPOINT_API_URL}/accounts`, 'GET');
};

export const callGetUsage = async (
  idToken: string,
  contractId: number,
  projectId: number,
  dates: any
) => {
  return call(idToken, `${ENDPOINT_API_URL}/usage`, 'GET', {
    contract_id: contractId,
    project_id: projectId,
    grouping: 'day',
    sort_order: 'asc',
    ...dates,
  });
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

export const callFileTranscriptionSecret = async (idToken: string) => {
  return call(idToken, `${ENDPOINT_API_URL}/jobs_key`, 'POST');
};

export const callRequestFileTranscription = async (
  secretKey: string,
  file: File,
  language: string,
  accuracy: Accuracy,
  separation: Separation
) => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('language', language);
  formData.append('accuracy', accuracy);
  formData.append('separation', separation);

  return call(secretKey, `${ENDPOINT_API_URL}/jobs`, 'POST', formData, 'multipart/form-data');
};

export const callRequestJobStatus = async (secretKey: string, jobId: string) => {
  return call(secretKey, `${ENDPOINT_API_URL}/jobs/${jobId}`, 'GET');
};

export const callRequestJobTranscription = async (
  secretKey: string,
  jobId: string,
  format: string = null
) => {
  return call(
    secretKey,
    `${ENDPOINT_API_URL}/jobs/${jobId}/transcript${format ? `?format=${format}` : ''}`,
    'GET',
    null,
    'text/plain'
  );
};

export const call = async (
  authToken: string,
  apiEndpoint: string,
  method: 'GET' | 'POST' | 'DELETE',
  body: any = null,
  contentType: string = null
) => {
  const headers = new Headers();
  const bearer = `Bearer ${authToken}`;

  const isGET = method.toLowerCase() != 'get';

  headers.append('Authorization', bearer);
  headers.append('Content-Type', contentType ? contentType : 'application/json');

  const options = {
    method: method,
    headers: headers,
    body: isGET && body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  };

  if (isGET && !!body) {
    apiEndpoint = `${apiEndpoint}?${getParams(body)}`;
  }

  console.log('fetching', apiEndpoint, options);

  return fetch(apiEndpoint, options)
    .then(async (response) => {
      console.log(`response from`, apiEndpoint, options, 'is:', await jsonCopy(response), response);
      if (response.status == 401) {
        msalLogout(true);
      }
      if (response.status != 200 && response.status != 201) {
        throw new Error(`response from ${method} ${apiEndpoint} has status ${response.status}`);
      }

      return contentType === 'text/plain' ? response.text() : response.json();
    })
    .catch((error) => {
      errToast(`details: ${error}`);
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
    return response.clone().json().catch(console.error);
  } catch (e) {
    return '';
  }
}

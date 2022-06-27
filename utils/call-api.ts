import { errToast } from '../components/common';
import { msalLogout } from './msal-utils';
import { Accuracy, Separation, TranscriptFormat } from './transcribe-elements';
import { runtimeAuthFlow as runtime } from './runtime-auth-flow';

const ENDPOINT_API_URL = process.env.ENDPOINT_API_URL;
const RUNTIME_API_URL = process.env.RUNTIME_API_URL;

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
  return call(
    idToken,
    `${ENDPOINT_API_URL}/usage`,
    'GET',
    {},
    {
      contract_id: contractId,
      project_id: projectId,
      grouping: 'day',
      sort_order: 'asc',
      ...dates
    }
  );
};

export const callGetJobs = async (idToken: string, optionalQueries: any) => {
  return callRuntime(
    idToken,
    `${RUNTIME_API_URL}/jobs`,
    'GET',
    {},
    {
      ...optionalQueries
    }
  );
};

export const callDeleteJob = async (idToken: string, jobId: string, force: boolean) => {
  return callRuntime(idToken, `${RUNTIME_API_URL}/jobs/${jobId}`, 'DELETE', null, {
    force
  });
};

export const callGetTranscript = async (
  idToken: string,
  jobId: string,
  format: TranscriptFormat
) => {
  return callRuntime(
    idToken,
    `${RUNTIME_API_URL}/jobs/${jobId}/transcript`,
    'GET',
    {},
    { format: format == 'text' ? 'txt' : format },
    format === 'json-v2' ? 'application/json' : 'text/plain'
  );
};

export const callGetDataFile = async (idToken: string, jobId: string) => {
  return callRuntime(
    idToken,
    `${RUNTIME_API_URL}/jobs/${jobId}/data`,
    'GET',
    null,
    null,
    'application/json',
    true
  );
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
    card_request_token: chargifyToken
  });
};

export const callPostApiKey = async (idToken: string, name: string, projectId: number) => {
  return call(idToken, `${ENDPOINT_API_URL}/api_keys`, 'POST', {
    project_id: projectId,
    name
  });
};

export const callGetPayments = async (idToken: string) => {
  return call(idToken, `${ENDPOINT_API_URL}/payments`, 'GET');
};

export const callRemoveCard = async (idToken: string, contractId: number) => {
  return call(idToken, `${ENDPOINT_API_URL}/contracts/${contractId}/cards`, 'DELETE');
};

export const callGetRuntimeSecret = async (idToken: string, ttl: number) => {
  return call(idToken, `${ENDPOINT_API_URL}/api_keys`, 'POST', {
    ttl
  });
};

export const callRequestFileTranscription = async (
  idToken: string,
  file: File,
  language: string,
  accuracy: Accuracy,
  separation: Separation
) => {
  const formData = new FormData();

  formData.append('data_file', file);
  const config = {
    type: 'transcription',
    transcription_config: {
      language,
      operating_point: accuracy,
      diarization: separation
    }
  };
  formData.append('config', JSON.stringify(config));

  return callRuntime(
    idToken,
    `${RUNTIME_API_URL}/jobs`,
    'POST',
    formData,
    null,
    'multipart/form-data'
  );
};

export const callRequestJobStatus = async (idToken: string, jobId: string) => {
  return callRuntime(idToken, `${RUNTIME_API_URL}/jobs/${jobId}`, 'GET');
};

// Used to check if the secretKey is still valid (i.e. hasn't timed out)
// If secret key has timed out, refresh the store
// Use the secret key from the store to make the request
// If something goes wrong updating the token, the store should update to tell the component something is wrong
export const callRuntime = async (
  authToken: string,
  apiEndpoint: string,
  method: 'GET' | 'POST' | 'DELETE',
  body: any = null,
  query: any = null,
  contentType: string = null,
  isBlob: boolean = false
) => {
  try {
    await runtime.refreshToken(authToken);
    return call(runtime.store.secretKey, apiEndpoint, method, body, query, contentType, isBlob);
  } catch (error) {
    throw error;
  }
};

export const call = async (
  authToken: string,
  apiEndpoint: string,
  method: 'GET' | 'POST' | 'DELETE',
  body: any = null,
  query: any = null,
  contentType: string = null,
  isBlob: boolean = false
) => {
  const headers = new Headers();
  const bearer = `Bearer ${authToken}`;

  const useBODY = method.toLowerCase() != 'get';
  const isPlain = contentType === 'text/plain';

  headers.append('Authorization', bearer);
  if (contentType != 'multipart/form-data') {
    headers.append('Content-Type', contentType ? contentType : 'application/json');
  }

  const options = {
    method: method,
    headers: headers,
    body: useBODY && body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
  };

  if (!!query) {
    apiEndpoint = `${apiEndpoint}?${getParams(query)}`;
  }

  return fetch(apiEndpoint, options).then(
    async (response) => {
      console.log('fetch then', response);
      if (response.status == 401) {
        if (apiEndpoint.includes(RUNTIME_API_URL)) {
          throw { status: 'error', error: { type: 'runtime-auth' } };
        } else {
          console.log('error status 401, will logout');
          setTimeout(() => msalLogout(true), 1000);
          errToast(`Session expired, redirecting to login page...`);
          return;
        }
      }
      if (response.status != 200 && response.status != 201) {
        let resp = null;
        try {
          resp = await response.json();
        } catch (e) {}
        const throwObj = {
          type: 'request-error',
          status: response.status,
          response: resp
        };
        console.error(
          `fetch error on ${apiEndpoint} occured, response ${JSON.stringify(throwObj.response)}`
        );
        errToast(`An error occurred at the request to ${apiEndpoint}. (Status ${response.status})`);
        throw throwObj;
      }

      if (response.body == null) {
        return null;
      }
      if (isBlob) {
        return response.blob();
      }
      return isPlain ? response.text() : response.json();
    },
    (error) => {
      console.log('fetch error', error);
      //only happens when something goes wrong with the function fetch not a specific response,
      // the responses should be cought in the following catch block on this promise
      setTimeout(() => msalLogout(true), 1000);
      errToast(`Redirecting to login page...`);
      throw { status: 'error', error: { type: error.type } };
    }
  );
};

function getParams(paramsObj: { [key: string]: string | number }) {
  return Object.keys(paramsObj).reduce(
    (prev, curr, i) => `${prev}${i != 0 ? '&' : ''}${curr}=${paramsObj[curr]}`,
    ''
  );
}

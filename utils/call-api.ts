export const callPostAccounts = async (accessToken: string) => {
  console.log('callPostAccounts', `${process.env.ENDPOINT_API_URL}/accounts`);
  return call(accessToken, `${process.env.ENDPOINT_API_URL}/accounts`, 'POST');
};

export const callGetAccounts = async (idToken: string) => {
  console.log('callGetAccounts', `${process.env.ENDPOINT_API_URL}/accounts`);
  return call(idToken, `${process.env.ENDPOINT_API_URL}/accounts`, 'GET');
};

export const callUsage = async (idToken: string) => {
  console.log('callUsage', `${process.env.ENDPOINT_API_URL}/usage`);
  return call(idToken, `${process.env.ENDPOINT_API_URL}/usage`, 'GET');
};

export const callRemoveApiKey = async (idToken: string, apiKeyId: string) => {
  console.log('callRemoveApiKey', `${process.env.ENDPOINT_API_URL}/apikey/${apiKeyId}`);
  return call(idToken, `${process.env.ENDPOINT_API_URL}/api_keys/${apiKeyId}`, 'DELETE');
};

export const callPostApiKey = async (idToken: string, name: string) => {
  console.log('callPostApiKey', `${process.env.ENDPOINT_API_URL}/apikey`);
  return call(idToken, `${process.env.ENDPOINT_API_URL}/api_keys`, 'POST', {
    project_id: 0,
    name,
    client_ref: 'clientref',
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

  const options = {
    method: method,
    headers: headers,
    body,
  };

  return fetch(apiEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

export async function accountsFlow(accessToken: string): Promise<any> {
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

        return callPostAccounts(accessToken).then((jsonPostResp) => {
          console.log('response from POST /accounts', jsonPostResp);
          return jsonPostResp;
        });
      } else if (jsonResp && Array.isArray(jsonResp.accounts) && jsonResp.accounts.length > 0) {
        return jsonResp;
      }
    })
    .catch(console.error);
}

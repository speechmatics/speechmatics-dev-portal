export const callPostAccounts = async (accessToken: string) => {
  return call(accessToken, `${process.env.ENDPOINT_API_URL}/accounts`, 'POST');
};

export const callGetAccounts = async (accessToken: string) => {
  return call(accessToken, `${process.env.ENDPOINT_API_URL}/accounts`, 'GET');
};

export const callUsage = async (accessToken: string) => {
  return call(accessToken, `${process.env.ENDPOINT_API_URL}/usage`, 'GET');
};

export const call = async (accessToken: string, apiEndpoint: string, method: string) => {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: method,
    headers: headers,
  };

  return fetch(apiEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
};

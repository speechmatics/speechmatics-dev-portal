import { Button } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { callApiWithToken } from '../utils/call-api'


export default ({tokenPayload}) => {

  const [response, setResponse] = useState();

  const callb = useCallback(() => {
    if (tokenPayload) {
      console.log({ tokenPayload });
      callApiWithToken(
        tokenPayload.accessToken,
        process.env.TEST_API_CALL_ENDPOINT
      ).then(
        (resp) => (setResponse(resp.name), console.log(JSON.stringify(resp)))
      );
    }
  }, [tokenPayload]);

  const callb2 = useCallback(() => {
    if (tokenPayload) {
      console.log({ tokenPayload });
      callApiWithToken(tokenPayload.idToken, process.env.TEST_API_CALL_ENDPOINT).then(
        (resp) => (setResponse(resp.name), console.log(JSON.stringify(resp)))
      );
    }
  }, [tokenPayload]);

  return <>
  <Button onClick={callb}>test accesstoken</Button>
        <Button onClick={callb2}>test idtoken</Button>
        <div dangerouslySetInnerHTML={{ __html: response }} />; test::{" "}
        {process.env.TEST_IF_WORKS_ENV_VAR}
    </>
}
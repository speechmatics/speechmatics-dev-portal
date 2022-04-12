import { SpeechmaticsLogo } from '../components/icons-library';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../utils/auth-config';
import { Box, Button, Spinner, Text } from '@chakra-ui/react';
import accountStoreContext from '../utils/account-store-context';
import { observer } from 'mobx-react-lite';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

export default observer(function SignUp() {
  const router = useRouter();

  const { instance, accounts, inProgress } = useMsal();

  const { accountStore, tokenStore } = useContext(accountStoreContext);

  const [b2cError, setb2cError] = useState<string | ReactJSXElement>('');

  useEffect(() => {
    let st: number;
    if (inProgress == 'none' && accounts.length > 0) {
      st = window.setTimeout(() => router.push('/home/'), 1000);
    }

    return () => window.clearTimeout(st);
  }, [inProgress, accounts, accounts?.length]);

  const authority = process.env.INVITATION_SIGNUP_POLICY;
  tokenStore.authorityToUse = authority;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userHint = urlParams.get('hint');
    if ((decodeURI(window.location.hash).includes('AADB2C90091'))) {
      setb2cError("Account creation cancelled");
      return;
    }
    if (!userHint) {
      setb2cError("");
      console.log("hint parameter expected")
      return;
    };

    accountStore.userHint = userHint;


    if (inProgress == 'none' && accounts.length > 0) return;

    const extraQueryParameters = {
      id_token_hint: userHint,
    };

    const tokenQueryParameters = { grant_type: 'authorization_code' };
    let st: number;
    st = window.setTimeout(
      () =>
        instance
          .loginRedirect({
            ...loginRequest,
            extraQueryParameters,
            tokenQueryParameters,
            authority,
            redirectUri: process.env.REDIRECT_URI_INVITATION
          })
          .catch((error) => {
            console.log(error);
          }),
      2000
    );

    return () => window.clearTimeout(st);
  }, []);

  useEffect(() => {
    if (tokenStore.loginFailureError) {
      setb2cError(tokenStore.loginFailureError ?
        <>This invitation link has expired. Please contact <a style={{ color: 'var(--chakra-colors-smBlue-500' }} target='_blank' href="https://www.speechmatics.com/about-us/contact">our support.</a></> : '');
    }
  }, [tokenStore.loginFailureError]);

  return (
    <div className="login_container">
      <Box px='3em' maxWidth='500px'><SpeechmaticsLogo width='100%' /></Box>
      <Text textAlign="center" mt='1em'>{b2cError || <Spinner />}</Text>
    </div>
  );
})

import { SpeechmaticsLogo } from '../components/Icons';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../utils/auth-config';
import { Button, Text } from '@chakra-ui/react';
import accountStoreContext from '../utils/account-store-context';

export default function SignUp() {
  const router = useRouter();

  const { instance, accounts, inProgress } = useMsal();

  const { accountStore, tokenStore } = useContext(accountStoreContext);

  console.log('accounts, inProgress', { accounts, inProgress });

  useEffect(() => {
    let st: number;
    if (inProgress == 'none' && accounts.length > 0) {
      st = window.setTimeout(() => router.push('/home/'), 1000);
    }

    return () => window.clearTimeout(st);
  }, [inProgress, accounts, accounts?.length]);

  //1
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userHint = urlParams.get('hint');
    if (!userHint || (decodeURI(window?.location.hash).includes('AADB2C90091'))) return;
    console.log(`urlParams ${urlParams}`);
    const extraQueryParameters = {
      id_token_hint: userHint,
    };
    accountStore.userHint = userHint;
    const authority = 'https://speechmaticsb2c.b2clogin.com/speechmaticsb2c.onmicrosoft.com/B2C_1A_SIGNUP_INVITATION';
    tokenStore.authorityToUse = authority;
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
          })
          .catch((error) => {
            console.log(error);
          }),
      5000
    );

    return () => window.clearTimeout(st);
  }, []);

  const [b2cError, setb2cError] = useState('');
  useEffect(() => {
    if (window?.location.hash && (decodeURI(window?.location.hash).includes('AADB2C90091'))) {
      setb2cError("Flow cancelled");
    }
  }, [typeof window !== 'undefined' && window?.location.hash]);

  return (
    <div className="login_container">
      <SpeechmaticsLogo />
      <Text textAlign="center">{b2cError}</Text>
      <Text textAlign="center">Just one more step and you're set! redirecting...</Text>
    </div>
  );
}

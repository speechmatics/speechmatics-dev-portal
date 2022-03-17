import { SpeechmaticsLogo } from '../components/Icons';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../utils/auth-config';
import { Button, Text } from '@chakra-ui/react';

export default function SignUp() {
  const router = useRouter();

  const { instance, accounts, inProgress } = useMsal();

  console.log('accounts, inProgress', { accounts, inProgress });

  useEffect(() => {
    let st: number;
    if (inProgress == 'none' && accounts.length > 0) {
      st = window.setTimeout(() => router.push('/home/'), 1000);
    }

    return () => window.clearTimeout(st);
  }, [inProgress, accounts, accounts?.length]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(`urlParams ${urlParams.get('hint')} ${window.location}`);
    const extraQueryParameters = { id_token_hint: urlParams.get('hint') };
    let st: number;
    st = window.setTimeout(
      () =>
        instance
          .loginPopup({
            ...loginRequest,
            extraQueryParameters,
            authority:
              'https://speechmaticsb2c.b2clogin.com/speechmaticsb2c.onmicrosoft.com/B2C_1A_SIGNUP_INVITATION',
          })
          .catch((error) => {
            console.log(error);
          }),
      2000
    );

    return () => window.clearTimeout(st);
  }, []);

  const [b2cError, setb2cError] = useState('');
  useEffect(() => {
    if (window?.location.hash) setb2cError(decodeURI(window?.location.hash));
  }, [typeof window !== 'undefined' && window?.location.hash]);

  return (
    <div className="login_container">
      <SpeechmaticsLogo />
      <Text textAlign="center">{b2cError}</Text>
      <Text textAlign="center">Just one more step and you're set! redirecting...</Text>
    </div>
  );
}

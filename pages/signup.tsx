import { SpeechmaticsLogo } from '../components/Icons';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../utils/auth-config';
import { Button, Text } from '@chakra-ui/react';

export default function Login() {
  const router = useRouter();

  const { instance, accounts, inProgress } = useMsal();

  useEffect(() => {
    let st: number;
    if (inProgress == 'none' && accounts.length > 0) {
      st = window.setTimeout(() => router.push('/home/'), 1000);
    }

    return () => window.clearTimeout(st);
  }, [inProgress, accounts, accounts?.length]);

  const urlParams = new URLSearchParams(window.location.search);
  console.log(`urlParams ${urlParams.get('hint')}`);

  const extraQueryParameters = { id_token_hint: urlParams.get('hint') };

  useEffect(() => {
    let st: number;
    st = window.setTimeout(
      () =>
        instance.loginRedirect({ ...loginRequest, extraQueryParameters }).catch((error) => {
          console.log(error);
        }),
      1000
    );

    return () => window.clearTimeout(st);
  }, []);

  return (
    <div className="login_container">
      <SpeechmaticsLogo />

      <Text textAlign="center">Just one more step and you're set! redirecting...</Text>
    </div>
  );
}

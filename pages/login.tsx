import { SpeechmaticsLogo } from '../components/Icons';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../utils/auth-config';
import { Button } from '@chakra-ui/react';

export default function Login() {
  const router = useRouter();

  const { instance, accounts, inProgress } = useMsal();

  const loginRequest = {
    scopes: [],
    authority:
      'https://speechmaticsb2c.b2clogin.com/speechmaticsb2c.onmicrosoft.com/B2C_1A_SIGNIN_ONLY',
  };

  useEffect(() => {
    let st: number;
    if (inProgress == 'none' && accounts.length > 0) {
      st = window.setTimeout(() => router.push('/home/'), 1000);
    }

    return () => window.clearTimeout(st);
  }, [inProgress, accounts, accounts?.length]);

  const loginHandler = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.log(error);
    });
  };

  const LoginSub = () => {
    if (accounts.length > 0) {
      return <div className="login_text">You're logged in, let me redirect you...</div>;
    } else if (inProgress === 'login') {
      return <div className="login_text">Login is currently in progress!</div>;
    } else if (inProgress === 'none' && accounts.length == 0) {
      return (
        <div className="login_form">
          <Button variant="speechmatics" onClick={loginHandler}>
            Log in / Sign up ➔
          </Button>
        </div>
      );
    } else return <></>;
  };

  return (
    <div className="login_container">
      <SpeechmaticsLogo />

      <LoginSub />
    </div>
  );
}

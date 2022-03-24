import { SpeechmaticsLogo } from '../components/icons-library';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../utils/auth-config';
import { Box, Button } from '@chakra-ui/react';

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

  const loginHandler = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.log(error);
    });
  };

  const x = new URLSearchParams(global.window?.location.search)
  const loggedOutInfo = x.get('inactive') == 'true' ? <div>You were logged out due to an expired session.</div> : null;


  const LoginSub = () => {
    if (inProgress == 'startup' || inProgress == 'handleRedirect' || (accounts.length > 0 && inProgress === 'none')) {
      return <div className="login_text">You're logged in, let me redirect you...</div>;
    } else if (inProgress == 'login') {
      return <div className="login_text">Login is currently in progress!</div>;
    } else if (inProgress == 'none' && accounts.length == 0) {
      return (
        <div className="login_form">
          {loggedOutInfo}
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

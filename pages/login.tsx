import { SpeechmaticsLogo } from '../components/icons-library';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { Box, Button, Spinner } from '@chakra-ui/react';
import accountStoreContext from '../utils/account-store-context';
import { RedirectRequest } from '@azure/msal-browser';
import { trackEvent } from '../utils/analytics';
import menuData from '../static_data/menu-data';

export default function Login() {
  const router = useRouter();

  const { instance, accounts, inProgress } = useMsal();
  const { tokenStore } = useContext(accountStoreContext);

  let authority = process.env.SIGNIN_POLICY;

  tokenStore.authorityToUse = authority;

  const loginRequest = {
    scopes: [process.env.DEFAULT_B2C_SCOPE],
    authority,
  } as RedirectRequest;

  const loginHandler = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.log(error);
    });
  };

  const passwordChangeFlow = useMemo(
    () => decodeURI(global.window?.location.hash).includes('AADB2C90118'),
    []
  );
  const hintExpiredError = useMemo(
    () => decodeURI(global.window?.location.hash).includes('AADB2C90208'),
    []
  );
  const postPassChange = useMemo(
    () => decodeURI(global.window?.location.hash).includes('postPasswordChange'),
    []
  );
  const loggedManualy = useMemo(
    () => decodeURI(global.window?.location.hash).includes('logout'),
    []
  );
  const loggedExpired = useMemo(
    () => decodeURI(global.window?.location.hash).includes('inactive'),
    []
  );
  const queries = useMemo(
    () => new URLSearchParams(global.window?.location.search),
    [inProgress]
  );

  if (postPassChange) {
    tokenStore.authorityToUse = process.env.RESET_PASSWORD_POLICY;
    trackEvent('post_password_change', 'B2C_Flow', 'User coming back from password change');
  }

  useEffect(() => {

    if (passwordChangeFlow && inProgress == 'none') {
      tokenStore.authorityToUse = loginRequest.authority = process.env.RESET_PASSWORD_POLICY;
      loginRequest.redirectUri = process.env.REDIRECT_URI;
      loginRequest.state = 'postPasswordChange';
      loginHandler();
    }

    if (
      !loggedManualy &&
      !loggedExpired &&
      !postPassChange &&
      !passwordChangeFlow &&
      inProgress == 'none' &&
      (!accounts || accounts.length == 0) &&
      authority == process.env.SIGNIN_POLICY
    ) {
      loginRequest.redirectStartPage = createRedirectStartPage(queries.get('returnUrl'));
      loginHandler();
      trackEvent('pre_regular_login', 'B2C_Flow', 'User logged in change');
    }

    let st: number;
    if (inProgress == 'none' && accounts.length > 0 && authority == process.env.SIGNIN_POLICY) {
      st = window.setTimeout(() => router.push(queries.get('returnUrl') || '/home/'), 1000);
      trackEvent('post_regular_login', 'B2C_Flow', 'User logged in change');
    }

    return () => window.clearTimeout(st);
  }, [inProgress, accounts, accounts?.length]);

  return (
    <div className='login_container'>
      <Box px='3em' maxWidth='500px'>
        <SpeechmaticsLogo width='100%' />
      </Box>
      <LoginSub
        {...{ inProgress, accounts, loggedExpired, loggedManualy, loginHandler, hintExpiredError }}
      />
    </div>
  );
}

const LoginSub = ({
  inProgress,
  accounts,
  loggedExpired,
  loggedManualy,
  loginHandler,
  hintExpiredError
}) => {
  if (
    inProgress == 'startup' ||
    inProgress == 'handleRedirect' ||
    (accounts.length > 0 && inProgress === 'none')
  ) {
    return (
      <div className='login_text'>
        <Spinner />
      </div>
    );
  } else if (inProgress == 'login') {
    return (
      <div className='login_text'>
        <Spinner />
      </div>
    );
  } else if (inProgress == 'none' && accounts.length == 0) {
    return (
      <div className='login_form'>
        <Box>
          {loggedExpired && 'You were logged out due to an expired session.'}
          {loggedManualy && 'You were logged out.'}
          {hintExpiredError && 'Your invitation token expired.'}
        </Box>
        <Button variant='speechmatics' onClick={loginHandler} data-qa='button-log-in'>
          Log in ➔
        </Button>
      </div>
    );
  } else return <></>;
};

const createRedirectStartPage = (query) => {
  if (menuData.some(item => item.path === query + '/')) {
    return process.env.REDIRECT_URI + `?returnUrl=${query}`;
  }
  return process.env.REDIRECT_URI;
}
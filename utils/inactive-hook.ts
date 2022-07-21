import React, { useCallback, useContext, useEffect } from 'react'
import {useMsal} from '@azure/msal-react'
import {InteractionStatus} from '@azure/msal-browser'
import { useInterval } from './hooks'
import { observer } from 'mobx-react-lite';
import accountContext from '../utils/account-store-context';
import { msalLogout } from './msal-utils';

export default function useInactiveLogout() {
  const { tokenStore } = useContext(accountContext);
  const activity_timeout: number = parseInt(process.env.INACTIVITY_TIMEOUT) || 15;
  const { inProgress } = useMsal();
  
  const logoutInactive = useCallback(() => {
    const currentTime = new Date();
    if (currentTime.getTime() - tokenStore?.lastActive?.getTime() > activity_timeout * 60 * 1000) {
      if (inProgress === InteractionStatus.None) {
        msalLogout(true);
      }
    }

  }, [tokenStore?.lastActive, inProgress])

  const handleActivity = () => {
    tokenStore.setLastActive(new Date());
  }

  useEffect(() => {
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);

    return () => {
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
    };
  }, [])

  useInterval(logoutInactive, 20000, true)
  
  return null
}
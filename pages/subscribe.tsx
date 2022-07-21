import React, { useState, useEffect, useRef, useContext } from 'react';
import Dashboard from '../components/dashboard';
import accountContext from '../utils/account-store-context';
import { callGetSecrChargify, callPostRequestTokenChargify } from '../utils/call-api';

import { Box, Button, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { errToast, HeaderLabel, PageHeader, positiveToast, SmPanel } from '../components/common';
import { useIsAuthenticated } from '@azure/msal-react';
import { trackEvent } from '../utils/analytics';

declare global {
  interface Window {
    Chargify: any;
  }
}

function Subscribe({ }) {
  const chargifyForm = useRef();

  let chargify = null;

  if (typeof window !== 'undefined' && 'Chargify' in window) {
    chargify = useRef(new window.Chargify());
  }

  const [token, setToken] = useState('');
  const [submitButtonReady, setSubmitButtonReady] = useState(true);
  const [chargifyLoaded, setChargifyLoaded] = useState(false);
  const [paymentToken, setPaymentToken] = useState('');
  const authenticated = useIsAuthenticated();

  const { accountStore } = useContext(accountContext);

  const router = useRouter();

  useEffect(() => {
    if (authenticated && (accountStore.getContractId() !== undefined)) {
      callGetSecrChargify(accountStore.getContractId())
        .then((tokenResp) => {
          setPaymentToken(tokenResp.payment_token);
        })
        .catch((err) => {
          errToast(`Unable to retreive the contract (id: ${accountStore.getContractId()}). Please contact support.`);
        });
    }
  }, [authenticated, accountStore.getContractId()]);

  useEffect(() => {
    if (paymentToken && !chargifyLoaded && chargify && chargify.current) {
      chargify.current.load({
        selector: '#chargify-form',
        publicKey: process.env.CHARGIFY_PUBLIC_KEY,
        securityToken: paymentToken,
        type: 'card',
        serverHost: process.env.CHARGIFY_SERVER_HOST,
        fields: chargifyFields('#ffffff', '#ffffff', '#333333', ''),
        addressDropdowns: true
      });
      setChargifyLoaded(true);
    }

    return () => {
      chargify?.current.unload();
    };
  }, [paymentToken, chargify, typeof window !== 'undefined' && 'Chargify' in window]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitButtonReady(false);
    trackEvent('billing_chargify_submit', 'Action');
    chargify?.current.token(
      chargifyForm.current,

      (charfigyToken: string) => {
        setToken(charfigyToken);

        callPostRequestTokenChargify(accountStore.getContractId(), charfigyToken)
          .then(async () => {
            positiveToast(
              !!accountStore.getPaymentMethod()
                ? 'Card updated successfully!'
                : 'Card added successfully!'
            );
            await accountStore.fetchServerState();
            window.setTimeout(() => router.push('/manage-billing/'), 1000);
            trackEvent('billing_chargify_successful', 'Event');
          })
          .catch((error) => {
            setSubmitButtonReady(true);
            trackEvent('billing_chargify_failed', 'Event', '', {
              error: error.status
            });
            errToast(`Something went wrong on our side. Please try again later or contact support. (${error.status})`);
          });
      },

      (error: any) => {
        setSubmitButtonReady(true);
        errToast(`Error while attempting to add a card: ${error.errors}. Please, try again later or contact support.`);
      }
    );
  };

  return (
    <Dashboard>
      <PageHeader
        headerLabel={
          !!accountStore.getPaymentMethod()
            ? 'Replace your existing payment card'
            : 'Add a payment card to your account'
        }
        introduction=''
      />

      <div>
        <Box width='100%' maxWidth='630px'>
          <form onSubmit={handleSubmit} ref={chargifyForm} id='chargify-form'>
            <SmPanel>
              <HeaderLabel>Your Name</HeaderLabel>
              <Box style={sectStyle}>
                <div id='chargify_firstName'></div>
                <div id='chargify_lastname'></div>
              </Box>
            </SmPanel>

            <SmPanel marginTop='2em'>
              <HeaderLabel>Your Card Information</HeaderLabel>
              <Box style={sectStyle}>
                <div id='chargify_ccnumber'></div>
                <div id='chargify_cvv'></div>
                <div id='chargify_ccmonth'></div>
                <div id='chargify_ccyear'></div>
              </Box>
            </SmPanel>

            <SmPanel marginTop='2em'>
              <HeaderLabel>Your Address</HeaderLabel>
              <Box style={sectStyle}>
                <div id='chargify_address'></div>
                <div id='chargify_address2'></div>
                <div id='chargify_city'></div>
                <div id='chargify_country'></div>
                <div id='chargify_zip'></div>
                <div id='chargify_state'></div>
              </Box>
            </SmPanel>

            <label>
              <input id='host-token' disabled value={token} type='hidden' />
              <input id='reference' disabled value={'client1'} type='hidden' />
              <input
                type='hidden'
                className='host-input'
                data-chargify='reference'
                value={'client1'}
              />
            </label>
            <p>
              <Button
                variant='speechmatics'
                type='submit'
                disabled={!submitButtonReady}
                marginTop='2em'
                data-qa='button-add-replace-payment'>
                {submitButtonReady ? (
                  !!accountStore.getPaymentMethod() ? (
                    'Update card'
                  ) : (
                    'Add card'
                  )
                ) : (
                  <Spinner />
                )}
              </Button>
            </p>
          </form>
        </Box>
        <style jsx>{`
          section {
            margin-top: 1em;
          }
        `}</style>
      </div>
    </Dashboard>
  );
}

export default observer(Subscribe);

const sectStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, 16.25em)',
  columnGap: '2em',
  alignSelf: 'center',
  width: '100%'
} as React.CSSProperties;

const chargifyFields = (color1, color2, color3, name) => {
  const labelStyle = {
    padding: '2px 5px 3px 5px',
    fontSize: '1.2em'
  };

  const defaultStyle = {
    field: {
      backgroundColor: color1,
      padding: '3px',
      borderRadius: '2px'
    },
    input: {
      backgroundColor: color2,
      paddingTop: '2px',
      paddingBottom: '1px',
      borderRadius: '2px',
      fontSize: '1.1em'
    },
    label: labelStyle,
    message: { paddingTop: '2px', paddingBottom: '1px' }
  };

  return {
    firstName: {
      selector: '#chargify_firstName',
      label: 'First name',
      placeholder: '',
      required: true,
      message: 'First name is not valid. Please update it.',
      maxlength: '30',
      style: defaultStyle
    },
    lastName: {
      selector: '#chargify_lastname',
      label: 'Last name',
      placeholder: '',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '30',
      style: defaultStyle
    },
    number: {
      selector: '#chargify_ccnumber',
      label: 'Credit card number',
      placeholder: 'xxxx xxxx xxxx xxxx',
      message: 'This field is not valid. Please update it.',
      style: defaultStyle
    },
    month: {
      selector: '#chargify_ccmonth',
      label: 'Expiry Month',
      placeholder: 'mm',
      message: 'This field is not valid. Please update it.',
      style: defaultStyle
    },
    year: {
      selector: '#chargify_ccyear',
      label: 'Expiry Year',
      placeholder: 'yyyy',
      message: 'This field is not valid. Please update it.',
      style: defaultStyle
    },
    cvv: {
      selector: '#chargify_cvv',
      label: 'CVV code',
      placeholder: 'XXX',
      required: true,
      message: 'This field is not valid. Please update it.',
      style: defaultStyle
    },
    address: {
      selector: '#chargify_address',
      label: 'Address',
      placeholder: '1234 Hill St',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle
    },
    address2: {
      selector: '#chargify_address2',
      label: 'Address line 2',
      placeholder: '',
      required: false,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle
    },
    city: {
      selector: '#chargify_city',
      label: 'City',
      placeholder: '',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle
    },
    state: {
      selector: '#chargify_state',
      label: 'State',
      placeholder: '(not selected)',
      required: false,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle
    },
    zip: {
      selector: '#chargify_zip',
      label: 'Post code / zip',
      placeholder: '',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle
    },
    country: {
      selector: '#chargify_country',
      label: 'Country',
      placeholder: '(not selected)',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle
    }
  };
};

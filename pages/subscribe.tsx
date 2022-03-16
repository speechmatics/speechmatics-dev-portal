import React, { useState, useEffect, useRef, useContext } from 'react';
import Dashboard from '../components/dashboard';
import accountContext from '../utils/account-store-context';
import {
  callGetSecrChargify,
  callPostRequestTokenChargify,
  errToast,
  positiveToast,
} from '../utils/call-api';

import { createStandaloneToast, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

const toast = createStandaloneToast();

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

  const { accountStore, tokenStore } = useContext(accountContext);
  const idToken = tokenStore.tokenPayload?.idToken;

  const router = useRouter();

  useEffect(() => {
    if (idToken && !!accountStore.getContractId()) {
      callGetSecrChargify(idToken, accountStore.getContractId())
        .then((tokenResp) => {
          setPaymentToken(tokenResp.payment_token);
        })
        .catch((err) => {
          errToast(`callGetSecrChargify error: ${JSON.stringify(err)}`);
        });
    }
  }, [idToken, accountStore.getContractId()]);

  useEffect(() => {
    if (paymentToken && !chargifyLoaded && chargify && chargify.current) {
      chargify.current.load({
        selector: '#chargify-form',
        publicKey: 'chjs_6nnmqcxmp4nrbnmf2spmwm63',
        securityToken: paymentToken,
        type: 'card',
        serverHost: 'https://speechmatics-dev.chargify.com',
        fields: chargifyFields('#ffffff', '#ffffff', '#333333', ''),
        addressDropdowns: true,
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

    chargify?.current.token(
      chargifyForm.current,

      (charfigyToken: string) => {
        console.log('{host} token SUCCESS - token: ', charfigyToken);
        setToken(charfigyToken);

        callPostRequestTokenChargify(idToken, accountStore.getContractId(), charfigyToken)
          .then(async () => {
            positiveToast('token SUCCESS redirecting...');
            await accountStore.fetchServerState(idToken);
            window.setTimeout(() => router.push('/subscriptions/'), 1000);
          })
          .catch((error) => {
            setSubmitButtonReady(true);
            console.log('{host} token ERROR - err: ', error);
            errToast(`callPostRequestTokenChargify: ${JSON.stringify(error)}`);
          });
      },

      (error: any) => {
        setSubmitButtonReady(true);
        console.log('{host} token ERROR - err: ', error);
        errToast(`chargify.token: ${JSON.stringify(error)}`);
      }
    );
  };

  return (
    <Dashboard>
      <h1>
        {!!accountStore.getPaymentMethod()
          ? 'Replace the existing payment method'
          : 'Set up new subscription'}
      </h1>

      <div>
        <div style={{ width: '700px' }}>
          <form onSubmit={handleSubmit} ref={chargifyForm} id="chargify-form">
            <Text fontSize={'1.5em'}>Your name</Text>
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div id="chargify_firstName"></div>
              <div id="chargify_lastname"></div>
            </section>

            <Text fontSize={'1.5em'} marginTop={'2em'}>
              Your card information
            </Text>
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div id="chargify_ccnumber"></div>
              <div id="chargify_cvv"></div>
              <div id="chargify_ccmonth"></div>
              <div id="chargify_ccyear"></div>
            </section>

            <Text fontSize={'1.5em'} marginTop={'2em'}>
              Your address
            </Text>
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div id="chargify_address"></div>
              <div id="chargify_address2"></div>
              <div id="chargify_city"></div>
              <div id="chargify_state"></div>
              <div id="chargify_zip"></div>
              <div id="chargify_country"></div>
            </section>

            <label>
              <input id="host-token" disabled value={token} type="hidden" />
              <input id="reference" disabled value={'client1'} type="hidden" />
              <input
                type="hidden"
                className="host-input"
                data-chargify="reference"
                value={'client1'}
              />
            </label>
            <p>
              <button type="submit" disabled={!submitButtonReady}>
                {submitButtonReady ? 'Submit Form' : <Spinner />}
              </button>
            </p>
          </form>
        </div>
        <style jsx>{`
          button[type='submit'] {
            border: 0;
            width: 10em;
            height: 2em;
            padding: 0 1em;
            margin: 1em 0;
            border-radius: 15px;
            background: var(--main-navy);
            font-family: "RM Neue";
            font-size: 1.5em;
            color: #fff;
            text-transform: uppercase;
            filter: drop-shadow(0px 9px 11px rgba(0, 0, 0, 0.12));
            cursor: pointer;
          }

          button:active {
            background: var(--main-blue);
          }

          section {
            margin-top: 1em;
          }
        `}</style>
      </div>
    </Dashboard>
  );
}

export default observer(Subscribe);

const chargifyFields = (color1, color2, color3, name) => {
  const labelStyle = {
    padding: '2px 5px 3px 5px',
    fontSize: '13px',
  };

  const defaultStyle = {
    field: {
      backgroundColor: color1,
      padding: '3px',
      borderRadius: '5px',
    },
    input: {
      backgroundColor: color2,
      paddingTop: '2px',
      paddingBottom: '1px',
    },
    label: labelStyle,
    message: { paddingTop: '2px', paddingBottom: '1px' },
  };

  return {
    firstName: {
      selector: '#chargify_firstName',
      label: 'First name',
      placeholder: name,
      required: true,
      message: 'First name is not valid. Please update it.',
      maxlength: '30',
      style: {
        field: {
          backgroundColor: color1,
          padding: '3px',
          borderRadius: '5px',
        },
        input: {
          backgroundColor: color2,
          paddingTop: '2px',
          paddingBottom: '1px',
          placeholder: { color: color3 },
        },
        label: labelStyle,
        message: { paddingTop: '2px', paddingBottom: '1px' },
      },
    },
    lastName: {
      selector: '#chargify_lastname',
      label: 'Last name',
      placeholder: '',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '30',
      style: defaultStyle,
    },
    number: {
      selector: '#chargify_ccnumber',
      label: 'Credit card number',
      placeholder: 'xxxx xxxx xxxx xxxx',
      message: 'This field is not valid. Please update it.',
      style: defaultStyle,
    },
    month: {
      selector: '#chargify_ccmonth',
      label: 'Expiry Month',
      placeholder: 'mm',
      message: 'This field is not valid. Please update it.',
      style: defaultStyle,
    },
    year: {
      selector: '#chargify_ccyear',
      label: 'Expiry Year',
      placeholder: 'yyyy',
      message: 'This field is not valid. Please update it.',
      style: defaultStyle,
    },
    cvv: {
      selector: '#chargify_cvv',
      label: 'CVV code',
      placeholder: 'XXX',
      required: true,
      message: 'This field is not valid. Please update it.',
      style: defaultStyle,
    },
    address: {
      selector: '#chargify_address',
      label: 'Address',
      placeholder: '1234 Hill St',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle,
    },
    address2: {
      selector: '#chargify_address2',
      label: 'Address line 2',
      placeholder: '',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle,
    },
    city: {
      selector: '#chargify_city',
      label: 'City',
      placeholder: '',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle,
    },
    state: {
      selector: '#chargify_state',
      label: 'State',
      placeholder: '',
      required: false,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle,
    },
    zip: {
      selector: '#chargify_zip',
      label: 'Post code / zip',
      placeholder: '',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle,
    },
    country: {
      selector: '#chargify_country',
      label: 'Country',
      placeholder: '',
      required: true,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle,
    },
  };
};

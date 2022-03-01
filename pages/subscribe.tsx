import Head from 'next/head';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Dashboard from '../components/dashboard';

declare global {
  interface Window {
    Chargify: any;
  }
}

function Subscribe({}) {
  const chargifyForm = useRef();

  let chargify = null;

  if (typeof window !== 'undefined' && 'Chargify' in window) {
    chargify = useRef(new window.Chargify());
  }

  const [token, setToken] = useState('');
  const [chargifyLoaded, setChargifyLoaded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    chargify?.current.token(
      chargifyForm.current,

      (token) => {
        console.log('{host} token SUCCESS - token: ', token);
        setToken(token);
      },

      (error) => {
        console.log('{host} token ERROR - err: ', error);
      }
    );
  };

  useEffect(() => {
    if (!chargifyLoaded && chargify && chargify.current) {
      chargify.current.load({
        selector: '#chargify-form',
        publicKey: 'chjs_6nnmqcxmp4nrbnmf2spmwm63',
        type: 'card',
        serverHost: 'https://speechmatics-dev.chargify.com',
        fields: chargifyFields('#F6F6F6', '#ffffff', '#333333', ''),
      });
      setChargifyLoaded(true);
    }

    return () => {
      chargify?.current.unload();
    };
  }, [chargify, typeof window !== 'undefined' && 'Chargify' in window]);

  return (
    <Dashboard>
      <h1>Set up new subscription</h1>

      <div>
        <div style={{ marginBottom: '1em' }}>Please fill up the form</div>
        <div style={{ width: '700px' }}>
          <form onSubmit={handleSubmit} ref={chargifyForm} id="chargify-form">
            <section style={{ display: 'flex' }}>
              <div id="chargify_firstName"></div>
              <div id="chargify_lastname"></div>
            </section>

            <section style={{}}>
              <div id="chargify_ccnumber"></div>
              <div style={{ display: 'flex', width: '250px' }}>
                <div id="chargify_ccmonth"></div>
                <div id="chargify_ccyear"></div>
                <div id="chargify_cvv"></div>
              </div>
            </section>

            <section style={{ display: 'flex', flexWrap: 'wrap' }}>
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
              <button type="submit">Submit Form</button>
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
            font-family: GibsonRegular;
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

export default Subscribe;

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
      label: 'FIRST NAME',
      placeholder: name,
      required: false,
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
      required: false,
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
      required: false,
      message: 'This field is not valid. Please update it.',
      style: defaultStyle,
    },
    address: {
      selector: '#chargify_address',
      label: 'Address',
      placeholder: '1234 Hill St',
      required: false,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle,
    },
    address2: {
      selector: '#chargify_address2',
      label: 'Address line 2',
      placeholder: '',
      required: false,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle,
    },
    city: {
      selector: '#chargify_city',
      label: 'City',
      placeholder: '',
      required: false,
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
      required: false,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle,
    },
    country: {
      selector: '#chargify_country',
      label: 'Country',
      placeholder: '',
      required: false,
      message: 'This field is not valid. Please update it.',
      maxlength: '70',
      style: defaultStyle,
    },
  };
};

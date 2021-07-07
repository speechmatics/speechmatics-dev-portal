import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import Dashboard from '../components/dashboard'

function Subscribe({ }) {
    const chargifyForm = useRef();

    let chargify = null;

    if (typeof window !== 'undefined' && 'Chargify' in window) {
        chargify = useRef(new window.Chargify());
    }

    const [token, setToken] = useState('');

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
    }

    useEffect(
        () => {

            chargify?.current.load({
                // selector where the iframe will be included in the host's HTML (i.e. '#chargify-form')
                // optional if you have a `selector` on each and every field
                selector: '#chargify-form',

                // (i.e. '1a2cdsdn3lkn54lnlkn')
                publicKey: 'chjs_ycbc7hctjthpy6qbxxxgjtfd',

                // form type (possible values: 'card' or 'bank')
                type: 'card',

                // points to your Chargify site
                serverHost: 'https://speechmatics-3.chargify.com'
            });

            return () => {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                chargify?.current.unload();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

    // useEffect(
    // () => {
    //     chargify?.current.load({type: paymentType});
    //     setToken('');


    // }, [chargify?.current]);

    return <Dashboard>
        <h1>Set up new subscription</h1>

        <div>
            <Head>
                <script src="https://js.chargify.com/latest/chargify.js"></script>
            </Head>
            <div style={{ marginBottom: '1em' }}>Please fill up the form</div>
            <form onSubmit={handleSubmit} ref={chargifyForm}>
                <div id="chargify-form"></div>

                <label>
                    <input id="host-token" disabled value={token} type='hidden' />
                    <input id="reference" disabled value={'client1'} type='hidden' />
                    <input type="hidden" class="host-input" data-chargify="reference" value={'client1'} />
                </label>
                <p>
                    <button type="submit">Submit Form</button>
                </p>
            </form>
            <style jsx>{`
button[type="submit"] {
    border: 0;
    width: 10em;
    height: 2em;
    padding: 0 1em;
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

                `}</style>
        </div>
    </Dashboard>
}


export default Subscribe;
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
                serverHost: 'https://speechmatics-3.chargify.com',

                fields: {
                    firstName: {
                        selector: '#chargify1',
                        label: 'FIRST NAME',
                        placeholder: 'John',
                        required: false,
                        message: 'First name is not valid. Please update it.',
                        maxlength: '30',
                        style: {
                            field: {
                                backgroundColor: '#ffdfdf',
                                padding: '3px',
                                borderRadius: '5px'
                            },
                            input: {
                                backgroundColor: '#fdfde1',
                                paddingTop: '2px',
                                paddingBottom: '1px',
                                placeholder: { color: 'green' }
                            },
                            label: {
                                paddingTop: '2px',
                                paddingBottom: '1px',
                                fontSize: '11px'
                            },
                            message: { paddingTop: '2px', paddingBottom: '1px' }
                        }
                    },
                    lastName: {
                        selector: '#chargify1',
                        label: 'LAST NAME',
                        placeholder: 'Doe',
                        required: false,
                        message: 'This field is not valid. Please update it.',
                        maxlength: '30',
                        style: {
                            field: {
                                backgroundColor: '#ffdfdf',
                                padding: '3px',
                                borderRadius: '5px'
                            },
                            input: {
                                backgroundColor: '#fdfde1',
                                paddingTop: '2px',
                                paddingBottom: '1px'
                            },
                            label: {
                                paddingTop: '2px',
                                paddingBottom: '1px',
                                fontSize: '11px'
                            },
                            message: { paddingTop: '2px', paddingBottom: '1px' }
                        }
                    },
                    number: {
                        selector: '#chargify2',
                        label: 'Number',
                        placeholder: 'xxxx xxxx xxxx xxxx',
                        message: 'This field is not valid. Please update it.',
                        style: {
                            field: {
                                backgroundColor: '#ffdfdf',
                                padding: '3px',
                                borderRadius: '5px'
                            },
                            input: {
                                backgroundColor: '#fdfde1',
                                paddingTop: '2px',
                                paddingBottom: '1px'
                            },
                            label: {
                                paddingTop: '2px',
                                paddingBottom: '1px',
                                fontSize: '11px'
                            },
                            message: { paddingTop: '2px', paddingBottom: '1px' }
                        }
                    },
                    month: {
                        selector: '#chargify2',
                        label: 'Mon',
                        placeholder: 'mm',
                        message: 'This field is not valid. Please update it.',
                        style: {
                            field: {
                                backgroundColor: '#ffdfdf',
                                padding: '3px',
                                borderRadius: '5px'
                            },
                            input: {
                                backgroundColor: '#fdfde1',
                                paddingTop: '2px',
                                paddingBottom: '1px'
                            },
                            label: {
                                paddingTop: '2px',
                                paddingBottom: '1px',
                                fontSize: '11px'
                            },
                            message: { paddingTop: '2px', paddingBottom: '1px' }
                        }
                    },
                    year: {
                        selector: '#chargify2',
                        label: 'Year',
                        placeholder: 'yyyy',
                        message: 'This field is not valid. Please update it.',
                        style: {
                            field: {
                                backgroundColor: '#ffdfdf',
                                padding: '3px',
                                borderRadius: '5px'
                            },
                            input: {
                                backgroundColor: '#fdfde1',
                                paddingTop: '2px',
                                paddingBottom: '1px'
                            },
                            label: {
                                paddingTop: '2px',
                                paddingBottom: '1px',
                                fontSize: '11px'
                            },
                            message: { paddingTop: '2px', paddingBottom: '1px' }
                        }
                    },
                    cvv: {
                        selector: '#chargify2',
                        label: 'CVV code',
                        placeholder: '123',
                        required: false,
                        message: 'This field is not valid. Please update it.',
                        style: {
                            field: {
                                backgroundColor: '#ffdfdf',
                                padding: '3px',
                                borderRadius: '5px'
                            },
                            input: {
                                backgroundColor: '#fdfde1',
                                paddingTop: '2px',
                                paddingBottom: '1px'
                            },
                            label: {
                                paddingTop: '2px',
                                paddingBottom: '1px',
                                fontSize: '11px'
                            },
                            message: { paddingTop: '2px', paddingBottom: '1px' }
                        }
                    },
                    address: {
                        selector: '#chargify3',
                        label: 'Address',
                        placeholder: '1234 Hill St',
                        required: false,
                        message: 'This field is not valid. Please update it.',
                        maxlength: '70',
                        style: {
                            field: {
                                backgroundColor: '#ffdfdf',
                                padding: '3px',
                                borderRadius: '5px'
                            },
                            input: {
                                backgroundColor: '#fdfde1',
                                paddingTop: '2px',
                                paddingBottom: '1px'
                            },
                            label: {
                                paddingTop: '2px',
                                paddingBottom: '1px',
                                fontSize: '11px'
                            },
                            message: { paddingTop: '2px', paddingBottom: '1px' }
                        }
                    }
                }
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
                <div id="chargify1"></div>
                <div id="chargify2"></div>
                <div id="chargify3"></div>
                <div id="chargify4"></div>
                <div id="chargify5"></div>
                <div id="chargify6"></div>
                <div id="chargify7"></div>
                <div id="chargify8"></div>
                <div id="chargify9"></div>
                <div id="chargify10"></div>
                <div id="chargify11"></div>
                <div id="chargify12"></div>
                <div id="chargify13"></div>
                <div id="chargify14"></div>
                <label>
                    <input id="host-token" disabled value={token} type='hidden' />
                    <input id="reference" disabled value={'client1'} type='hidden' />
                    <input type="hidden" className="host-input" data-chargify="reference" value={'client1'} />
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
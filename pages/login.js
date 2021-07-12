import { SpeechmaticsLogo } from '../components/Icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';
import { LoginContext } from '../utils/login-context';

import mockLogins from '../static_data/mock-logins'

export default function Login() {

    const router = useRouter();

    const loginContext = useContext(LoginContext);

    useEffect(() => {
        loginContext.clear();
    }, [])

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [wrong, setWrong] = useState(false);

    const attemptLogin = () => {
        const found = mockLogins.find(el => (`${el.email}@speechmatics.com` == login && el.pass == password));
        if (found) {
            router.push('/getting-started/');
            loginContext.update(found);
        } else {
            setWrong(true);
        }
    }

    return <div className="login_container">
        <SpeechmaticsLogo />


        <div className="login_text">
            Please use your credentials to log in
        </div>
        <div className="login_form">
            <input type="text" placeholder='email' className="input login"
                onChange={ev => (setWrong(false), setLogin(ev.target.value))}></input>
            <input type="password" placeholder='password' className="input password"
                onChange={ev => (setWrong(false), setPassword(ev.target.value))} ></input>

            {wrong && <div style={{ color: 'firebrick' }}>Used email and password pair does not match.</div>}

            <button className='next_button' onClick={attemptLogin}>
                Log in ➔
            </button>
        </div>
        <div className="login_text">
            or <Link href='/create-account/'>Create Account</Link>
        </div>
    </div>
};


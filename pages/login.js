import { SpeechmaticsLogo } from '../components/Icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect, useCallback } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../utils/auth-config";



export default function Login() {

    const router = useRouter();

    const { instance, accounts, inProgress } = useMsal();

    useEffect(()=> {
        if (accounts.length > 0) setTimeout(() => router.push('/getting-started/'), 1500);
    }, [accounts, accounts?.length])

    const loginHandler = () => instance.loginPopup(loginRequest).catch( error => {
        console.log(error)
    })

    const LoginSub = () => {
        if (accounts.length > 0) {
            return <div className="login_text">You're logged in, let me redirect you...</div> 
        } else if (inProgress === "login") {
            return <div className="login_text">Login is currently in progress!</div>
        } else {
            return (
                <div className="login_form">
                <button className='next_button' onClick={loginHandler}>
                    Log in / Sign up ➔
                </button>
            </div>
            );
        }
    }

    return <div className="login_container">
        <SpeechmaticsLogo />

        <LoginSub/>

    </div>
};


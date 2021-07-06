import { SpeechmaticsLogo } from '../components/Icons';
import Link from 'next/link';
import { useRouter } from 'next/router'


const Login = () => {

    const router = useRouter();



    return <div className="login_container">
        <SpeechmaticsLogo />


        <div className="login_text">
            Please use your credentials to log in
        </div>
        <div className="login_form">
            <input type="text" placeholder='email' className="input login"></input>
            <input type="password" placeholder='password' className="input password"></input>

            <button className='next_button' onClick={() => router.push('/getting-started/')}>
                Log in ➔
            </button>
        </div>
        <div className="login_text">
            or <Link href=''>Create Account</Link>
        </div>
    </div>
};

export default Login;

import Link from 'next/link';
import Dashboard from '../components/dashboard'

export default function Transcribe({ }) {

    return <Dashboard>
        <h1>Submit a file</h1>

        <div className="description_text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>

        <div className='rouded_shadow_box active_subscriptions_status'>
            Drop a file here
        </div>
        <Link href='/subscribe/'>
            <div className='default_button'>or choose from the disk</div>
        </Link>
    </Dashboard>
}
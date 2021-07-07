import Link from 'next/link';
import Dashboard from '../components/dashboard'


export default function Subscriptions({ }) {

    return <Dashboard>
        <h1>Active subscriptions</h1>
        <div className='rouded_shadow_box active_subscriptions_status'>
            You have no active subscriptions
        </div>
        <Link href='/subscribe/'>
            <div className='default_button'>+ add subsciption</div>
        </Link>
    </Dashboard>
}
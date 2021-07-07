import Image from 'next/image';
import Dashboard from '../components/dashboard'

export default function Usage({ }) {

    return <Dashboard>
        <h1>Usage</h1>
        <div>
            <Image src='/assets/mock_usage.png' width={600} height={600} />
        </div>
    </Dashboard>
}
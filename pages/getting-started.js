import Link from 'next/link';
import Dashboard from '../components/dashboard';

export default function GettingStarted({ }) {

    return <Dashboard>
        <h1>Getting Started!</h1>
        <div className='steps_container'>
            {stepsData.map((item, i) => (
                <StepItem item={item} key={i} />
            ))}
        </div>
    </Dashboard>
}

const StepItem = ({ item: { title, status, link } }) => (
    <Link href={link}>
        <div className='step_item'>
            <div>{title}</div>
            <div style={{ color: colorStatus[status] }}>{status}</div>
        </div>
    </Link>
)


const stepsData = [
    {
        title: 'Create and verify Your account',
        status: 'done',
        link: '/account/'
    },
    {
        title: 'Try transcription without code',
        status: 'done',
        link: '/transcribe/'
    },
    {
        title: 'Set up subscription or pay-as-you-go',
        status: 'waiting',
        link: '/subscribe/'
    },
    {
        title: 'Get Access Token',
        status: 'waiting',
        link: '/access-token/'
    },
    {
        title: 'Integrate with Speechmatics™',
        status: 'Need help?',
        link: 'https://docs.speechmatics.com'
    },
]

const colorStatus = {
    'done': '#5BB4AE',
    'waiting': '#B49B5B',
    'Need help?': '#5B8EB4'
}
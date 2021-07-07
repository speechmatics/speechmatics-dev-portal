import Link from 'next/link';
import Dashboard from '../components/dashboard'
import { DownloadIcon } from '../components/Icons';


export default function RecentJobs({ }) {

    return <Dashboard>
        <h1>Recent Jobs</h1>
        <div className='flex_column'>
            {recentJobs.map((item, i) => <Job item={item} key={i} />)}
        </div>
        <Link href='/transcribe/'>
            <div className='add_subscription_button default_button'>+ add new file</div>
        </Link>
    </Dashboard>
}

const Job = ({ item: { date, file, duration, language, status } }) => (
    <div className='job_item rouded_shadow_box'>
        <div>{date}</div>
        <div>{file}</div>
        <div>{duration}</div>
        <div>{language}</div>
        <div style={{ color: colorStatus[status] }}>
            {status}
            {status == 'done' ? <span style={{ marginLeft: '0.5em', cursor: 'pointer' }}><DownloadIcon color='#5BB4AE' /></span> : ''}
        </div>
    </div>
)

const recentJobs = [
    {
        date: '21/06/2021',
        file: 'Example11.wav',
        duration: '13 minutes',
        language: 'English',
        status: 'done'
    },
    {
        date: '21/06/2021',
        file: 'Example12.wav',
        duration: '3 minutes',
        language: 'Spanish',
        status: 'done'
    },
    {
        date: '22/06/2021',
        file: 'Example12a.wav',
        duration: '2 minutes',
        language: 'English',
        status: 'done'
    },
    {
        date: '23/06/2021',
        file: 'male.wav',
        duration: '9 minutes',
        language: 'French',
        status: 'processing'
    },
    {
        date: '07/07/2021',
        file: 'recording01.wav',
        duration: '123 minutes',
        language: 'English',
        status: 'queued'
    },
]


const colorStatus = {
    'done': '#5BB4AE',
    'queued': '#5B8EB4',
    'processing': '#B49B5B'
}
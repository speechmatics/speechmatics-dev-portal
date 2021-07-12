import {
    DocumentationIcon, GettingStartedIcon, SubscribeIcon, TranscribeIcon,
    RecentJobsIcon, UsageIcon, AccessTokenIcon
} from '../components/Icons';

const menuData = [
    {
        path: '/getting-started/',
        title: 'Getting Started',
        icon: GettingStartedIcon
    },
    {
        path: '/access-token/',
        title: 'Access Token',
        icon: AccessTokenIcon
    },
    {
        path: '/subscriptions/',
        title: 'Subscriptions',
        icon: SubscribeIcon
    },
    {
        path: 'https://docs.speechmatics.com',
        title: 'Documentation',
        icon: DocumentationIcon
    },
    {
        path: '/transcribe/',
        title: 'Submit a file',
        icon: TranscribeIcon
    },
    {
        path: '/recent-jobs/',
        title: 'Recent Jobs',
        icon: RecentJobsIcon
    },
    {
        path: '/usage/',
        title: 'Usage',
        icon: UsageIcon
    },
]

export default menuData;
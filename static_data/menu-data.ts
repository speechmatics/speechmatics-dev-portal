import {
  DocumentationIcon,
  GettingStartedIcon,
  SubscribeIcon,
  UsageIcon,
  AccessTokenIcon,
} from '../components/Icons';

const menuData = [
  {
    path: '/home/',
    title: 'Home',
    icon: GettingStartedIcon,
  },
  {
    path: '/api-token/',
    title: 'Manage Access',
    icon: AccessTokenIcon,
  },
  {
    path: '/subscriptions/',
    title: 'Billing',
    icon: SubscribeIcon,
  },
  {
    path: '/usage/',
    title: 'Track Usage',
    icon: UsageIcon,
  },
  {
    path: '/resources/',
    title: 'Learn',
    icon: DocumentationIcon,
  },
];

export default menuData;

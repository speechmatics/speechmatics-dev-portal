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
    title: 'API Token',
    icon: AccessTokenIcon,
  },
  {
    path: '/subscriptions/',
    title: 'Billing',
    icon: SubscribeIcon,
  },
  {
    path: '/usage/',
    title: 'Usage',
    icon: UsageIcon,
  },
  {
    path: '/resources/',
    title: 'Resources',
    icon: DocumentationIcon,
  },
];

export default menuData;

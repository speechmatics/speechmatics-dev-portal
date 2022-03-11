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
    path: '/usage/',
    title: 'Track Usage',
    icon: UsageIcon,
  },
  {
    path: '/manage-billing/',
    title: 'Manage Billing',
    icon: SubscribeIcon,
  },
  // {
  //   path: '/resources/',
  //   title: 'Resources',
  //   icon: DocumentationIcon,
  // },
];

export default menuData;

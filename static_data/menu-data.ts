import {
  DocumentationIcon,
  SubscribeIcon,
  UsageIcon,
  AccessTokenIcon,
  HomeIcon,
} from '../components/icons-library';

const menuData = [
  {
    path: '/home/',
    title: 'Home',
    icon: HomeIcon,
  },
  {
    path: '/manage-access/',
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
  {
    path: '/learn/',
    title: 'Learn',
    icon: DocumentationIcon,
  },
];

export default menuData;

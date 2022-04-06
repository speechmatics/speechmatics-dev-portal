import {
  MenuHomeIcon,
  MenuPadlockIcon,
  MenuTrackIcon,
  MenuBillingIcon,
  MenuLearnIcon,
  MenuRocketIcon,
} from '../components/icons-library';

const menuData = [
  {
    path: '/home/',
    title: 'Home',
    icon: MenuHomeIcon,
  },
  {
    path: '/getting-started/',
    title: 'Get Started',
    icon: MenuRocketIcon,
  },
  {
    path: '/manage-access/',
    title: 'Manage Access',
    icon: MenuPadlockIcon,
  },
  {
    path: '/usage/',
    title: 'Track Usage',
    icon: MenuTrackIcon,
  },
  {
    path: '/manage-billing/',
    title: 'Manage Billing',
    icon: MenuBillingIcon,
  },
  {
    path: '/learn/',
    title: 'Learn',
    icon: MenuLearnIcon,
  },
];

export default menuData;

import {
  DocumentationIcon,
  GettingStartedIcon,
  SubscribeIcon,
  TranscribeIcon,
  RecentJobsIcon,
  UsageIcon,
  AccessTokenIcon,
} from "../components/Icons";

const menuData = [
  {
    path: "/getting-started/",
    title: "Getting Started",
    icon: GettingStartedIcon,
  },
  {
    path: "/access-token/",
    title: "Access Token",
    icon: AccessTokenIcon,
  },
  {
    path: "/subscriptions/",
    title: "Billing",
    icon: SubscribeIcon,
  },
  {
    path: "/usage/",
    title: "Usage",
    icon: UsageIcon,
  },
  {
    path: "/faq/",
    title: "FAQ",
    icon: DocumentationIcon,
  },
];

export default menuData;

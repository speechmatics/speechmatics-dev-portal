import Link from 'next/link';
import Dashboard from '../components/dashboard';

export default function GettingStarted({}) {
  return (
    <Dashboard>
      <h1>Getting Started!</h1>
      <div className="steps_container">
        {stepsData.map((item, i) => (
          <StepItem item={item} key={i} />
        ))}
      </div>
    </Dashboard>
  );
}

const StepItem = ({ item: { title, status, link } }) => (
  <Link href={link}>
    <div className="rouded_shadow_box step_item">
      <div>{title}</div>
      <div style={{ color: colorStatus[status] }}>{status}</div>
    </div>
  </Link>
);

const stepsData = [
  {
    title: 'Create and verify your Account',
    status: 'done',
    link: '/account/',
  },
  {
    title: 'Set up payment method',
    status: 'waiting',
    link: '/subscribe/',
  },
  {
    title: 'Get Access Token',
    status: 'waiting',
    link: '/access-token/',
  },
  {
    title: 'Get started with code',
    status: 'Need help?',
    link: 'https://deploy-preview-28--speechmatics-docs.netlify.app/test-page/',
  },
];

const colorStatus = {
  done: '#5BB4AE',
  waiting: '#B49B5B',
  'Need help?': '#5B8EB4',
};

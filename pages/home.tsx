import Link from 'next/link';
import Dashboard from '../components/dashboard';

export default function Home({ }) {
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
    <div className="rounded_shadow_box step_item">
      <div>{title}</div>
      <div style={{ color: colorStatus[status] || "#aaa" }}>{status}</div>
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
    title: 'Create an API key',
    status: 'done',
    link: '/subscribe/',
  },
  {
    title: 'Make an API request',
    status: 'waiting',
    link: 'https://docs.speechmatics.com/en/cloud/howto/',
  },
  {
    title: 'Set up payment',
    status: 'waiting',
    link: '/usage/',
  },
  {
    title: 'Review your usage',
    status: '0.3h this month',
    link: '/usage/',
  },
];

const colorStatus = {
  'done': '#5BB4AE',
  'waiting': '#B49B5B',
  'Need help?': '#5B8EB4',
};

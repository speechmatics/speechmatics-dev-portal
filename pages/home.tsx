import Link from 'next/link';
import Dashboard from '../components/dashboard';
import Image from 'next/image';

export default function Home({ }) {
  return (
    <Dashboard>
      <h1>Getting Started!</h1>
      <h2>Here is an example of a Subtitle</h2>
      <div className='divide_line'></div>

      <div className='grid grid-cols-2  gap-10 mb-10'>

        <div className='bg-speech-blue  p-8 text-white w-50'>
          <div className='w-8 h-8 items-center justify-center mb-3'>
            <Image
              src="/assets/icon-test.svg"
              alt="Intro Icon"
              width={26}
              height={26}
            />
          </div>
          <h3>Introduction</h3>
          <p>How to use the RESTful API for the Speechmatics Cloud Offering.</p>
          <a href='#'>Learn More</a>
        </div>
        <div className='bg-speech-green  p-8 text-white w-50'>
          <div className='w-8 h-8 items-center justify-center mb-3'>
            <Image
              src="/assets/icon-test.svg"
              alt="Intro Icon"
              width={26}
              height={26}
            />
          </div>
          <h3>Introduction</h3>
          <p>How to use the RESTful API for the Speechmatics Cloud Offering.</p>
          <a href='#'>Learn More</a>
        </div>

      </div>

      <div className='learn_wrapper'>
        <div className='learn p-8'>
          <div className='w-8 h-8 items-center justify-center mb-3'>
            <Image
              src="/assets/icon-test.svg"
              alt="Intro Icon"
              width={26}
              height={26}
            />
          </div>
          <h3>Introduction</h3>
          <p>How to use the RESTful API for the Speechmatics Cloud Offering.</p>
          <a href='#'>Learn More</a>
        </div>
        <div className='learn'>
          <div className='w-8 h-8 items-center justify-center mb-3'>
            <Image
              src="/assets/icon-test.svg"
              alt="Intro Icon"
              width={26}
              height={26}
            />
          </div>
          <h3>Configuring the job request  with a longer title</h3>
          <p>How to use the RESTful API for the Speechmatics Cloud Offering.</p>
          <a href='#'>Learn More</a>
        </div>
        <div className='learn'>
          <div className='w-8 h-8 items-center justify-center mb-3'>
            <Image
              src="/assets/icon-test.svg"
              alt="Intro Icon"
              width={26}
              height={26}
            />
          </div>
          <h3>Configuring</h3>
          <p>Speechmatics Cloud Offering.</p>
          <a href='#'>Learn More</a>
        </div>
      </div>


      <div className="steps_container mt-48">
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
      <div style={{ color: colorStatus[status] || '#aaa' }}>{status}</div>
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
    link: '/api-token/',
  },
  {
    title: 'Make an API request',
    status: 'waiting',
    link: 'https://docs.speechmatics.com/en/cloud/howto/',
  },
  {
    title: 'Set up payment',
    status: 'waiting',
    link: '/subscriptions/',
  },
  {
    title: 'Review your usage',
    status: '0.3h this month',
    link: '/usage/',
  },
];

const colorStatus = {
  done: '#5BB4AE',
  waiting: '#B49B5B',
  'Need help?': '#5B8EB4',
};
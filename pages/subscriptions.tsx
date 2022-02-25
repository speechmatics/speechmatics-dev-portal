import Link from 'next/link';
import Dashboard from '../components/dashboard';

export default function Subscriptions({}) {
  return (
    <Dashboard>
      <h1>Active subscriptions</h1>
      <div
        className="rounded_shadow_box active_subscriptions_status"
        style={{ margin: '0px 0px 40px 0px' }}
      >
        You have no active subscriptions
      </div>
      <Link href="/subscribe/">
        <div className="default_button">+ add subscription</div>
      </Link>
    </Dashboard>
  );
}

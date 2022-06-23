import { PageHeader, SmPanel } from '../components/common';
import Dashboard from '../components/dashboard';
import { RecentJobs } from '../components/recent-jobs';

export default function ViewJobs() {

  return (
    <Dashboard>
      <PageHeader headerLabel="View Jobs" introduction="See Your Recent Jobs." />
      <SmPanel width='100%' maxWidth='900px'>
        <RecentJobs />
      </SmPanel>
    </Dashboard>
  );
}

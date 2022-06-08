import { PageHeader, SmPanel } from '../components/common';
import Dashboard from '../components/dashboard';
import { RecentJobs } from '../components/recent-jobs';

export default function ViewJobs() {
  return (
    <Dashboard>
      <PageHeader headerLabel="View Jobs" introduction="See Your Recent Jobs." />
      <SmPanel
        mx={{ base: 2, md: 0 }}
        width={{ base: '98vw', md: '100vw' }}
        maxWidth={{ base: '360px', sm: '400px', md: '420px', lg: '600px', xl: '900px' }}
      >
        <RecentJobs />
      </SmPanel>
    </Dashboard>
  );
}

import { PageHeader, SmPanel } from '../components/common';
import Dashboard from '../components/dashboard';
import { RecentJobs } from '../components/recent-jobs';

export default function ViewJobs() {

  return (
    <Dashboard>
      <PageHeader headerLabel="View Jobs" introduction="See Your Recent Jobs." />
      <SmPanel
        alignSelf="center"
        mx={{ base: '1vw', sm: 0, md: 0 }}
        width={{ base: '94vw', sm: '100%', md: '100%', lg: '100%' }}
        maxWidth={{ sm: '450px', md: '480px', lg: '700px', xl: '900px' }}
      >
        <RecentJobs />
      </SmPanel>
    </Dashboard>
  );
}

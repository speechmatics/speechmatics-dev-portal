import { useMsal } from '@azure/msal-react';
import { Button } from '@chakra-ui/react';
import { DescriptionLabel, PageHeader } from '../components/common';
import Dashboard from '../components/dashboard';
import { b2cPolicies } from '../utils/auth-config';

export default function Account({}) {
  const { instance, inProgress } = useMsal();

  const resetPassword = () => {
    instance
      .loginPopup({
        scopes: [],
        authority: b2cPolicies.authorities.forgotPassword.authority,
      })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  };

  return (
    <Dashboard>
      <PageHeader headerLabel="Account" introduction="" />

      <DescriptionLabel>Reset Your password:</DescriptionLabel>
      <Button variant="speechmatics" onClick={resetPassword}>
        Reset password
      </Button>
    </Dashboard>
  );
}

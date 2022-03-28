import { useMsal } from '@azure/msal-react';
import { Button } from '@chakra-ui/react';
import { DescriptionLabel, PageHeader } from '../components/common';
import Dashboard from '../components/dashboard';

export default function Account({ }) {
  const { instance, inProgress } = useMsal();

  const resetPassword = () => {
    instance
      .loginRedirect({
        scopes: [],
        authority: "https://speechmaticsb2c.b2clogin.com/speechmaticsb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1A_PASSWORDRESET",
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

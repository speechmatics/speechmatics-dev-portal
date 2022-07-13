import Dashboard from '../components/dashboard';
import React from 'react';
import {
  PageHeader,
  SmPanel,

} from '../components/common';
import { PreviousTokens } from '../components/previous-tokens';
import { GenerateTokenComponent } from '../components/generate-token-component';

export default function GetAccessToken({ }) {
  return (
    <Dashboard>
      <PageHeader headerLabel='Manage Access' introduction='Manage API Keys.' />

      <SmPanel width='100%' maxWidth='900px'>
        <GenerateTokenComponent />
      </SmPanel>

      <SmPanel width='100%' maxWidth='900px' mt='2em'>
        <PreviousTokens />
      </SmPanel>
    </Dashboard>
  );
}
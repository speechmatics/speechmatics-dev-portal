import { createContext } from 'react';
import { makeObservable, observable, computed, action, makeAutoObservable } from 'mobx';
import { callGetAccounts, callRemoveApiKey } from './call-api';
import { AuthenticationResult } from '@azure/msal-common';

interface GetAccountsResponse {
  accounts: Account[];
}

interface Account {
  account_id: number;
  contracts: Contract[];
}

interface Contract {
  contract_id: number;
  usage_limits: UsageLimit[];
  projects: Project[];
  runtime_url: string;
  payment_method: PaymentMethod | null;
}

interface UsageLimit {
  name: string;
  value: number;
}

interface Project {
  project_id: number;
  name: string;
  api_keys: ApiKey[];
}

export interface ApiKey {
  apikey_id: string;
  name: string;
  created_at: string;
  client_ref: string;
}

export interface PaymentMethod {
  card_type: string;
  masked_card_number: string;
  expiration_month: number;
  expiration_year: number;
}

class AccountContext {
  _account: Account = null;

  constructor() {
    makeObservable(this, {
      clear: action,
      _account: observable,
      assignServerState: action,
    });
  }

  set account(account: Account) {
    this._account = account;
  }

  get account(): Account {
    return this._account;
  }

  clear() {
    this.account = null;
  }

  getApiKeys(): ApiKey[] {
    return this._account?.contracts
      .filter((con) => !!con)?.[0]
      ?.projects.filter((proj) => !!proj)?.[0]?.api_keys;
  }

  getProjectId(): number {
    return this._account?.contracts
      .filter((con) => !!con)?.[0]
      ?.projects.filter((proj) => !!proj)?.[0].project_id;
  }

  getContractId(): number {
    return this._account?.contracts.filter((con) => !!con)?.[0]?.contract_id;
  }

  getRuntimeURL(): string {
    return this._account?.contracts.filter((con) => !!con)?.[0]?.runtime_url;
  }

  getPaymentMethod(): PaymentMethod | null {
    return this._account?.contracts.filter((con) => !!con)?.[0]?.payment_method;
  }

  getUsageLimit(type: 'standard' | 'enhanced'): number | undefined {
    return this._account?.contracts
      .filter((con) => !!con)?.[0]
      ?.usage_limits?.find((el) => el.name == type)?.value;
  }

  async fetchServerState(idToken: string) {
    return callGetAccounts(idToken)
      .then((jsonResp) => {
        if (checkIfAccountResponseLegit(jsonResp)) {
          this.assignServerState(jsonResp);
        } else {
          throw new Error(`callGetAccounts response malformed: ${jsonResp}`);
        }
      })
      .catch((err) => console.error('fetchServerState', err));
  }

  assignServerState(response: GetAccountsResponse) {
    if (!response) throw new Error('attempt assigning empty response');

    this._account = response.accounts?.filter((acc) => !!acc)?.[0];

    console.log('assignServerState', this._account);
  }
}

class TokenContext {
  tokenPayload: AuthenticationResult = null;

  constructor() {
    makeObservable(this, {
      tokenPayload: observable,
      setTokenPayload: action,
    });
  }

  setTokenPayload(tokenPayload: AuthenticationResult) {
    this.tokenPayload = tokenPayload;
  }
}

export function checkIfAccountResponseLegit(jsonResp: any) {
  return (
    jsonResp &&
    'accounts' in jsonResp &&
    Array.isArray(jsonResp.accounts) &&
    jsonResp.accounts.length > 0
  );
}

export const accountStore = new AccountContext();
export const tokenStore = new TokenContext();

export default createContext({ accountStore, tokenStore });

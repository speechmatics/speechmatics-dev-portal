import { createContext } from 'react';
import { makeObservable, observable, computed, action } from 'mobx';
import { callGetAccounts } from './call-api';

interface GetAccountsResponse {
  accounts: Account[];
}

interface Account {
  account_id: number;
  contracts: Contract[];
}

interface Contract {
  contract_id: number;
  usage_limit_hrs: number;
  projects: Project[];
}

interface Project {
  project_id: number;
  name: string;
  api_keys: ApiKey[];
}

interface ApiKey {
  apikey_id: string;
  name: string;
  created_at: string;
  client_ref: string;
}

class AccountContext {
  _account: Account = null;

  constructor() {
    makeObservable(this, {
      clear: action,
      _account: observable,
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

  getApiKeys(contractId = 0, projectId = 0): ApiKey[] {
    return this._account?.contracts
      .find((con) => con.contract_id == contractId)
      .projects.find((proj) => proj.project_id == projectId).api_keys;
  }

  fetchServerState(idToken: string) {
    callGetAccounts(idToken)
      .then((jsonResp) => {
        this.assignServerState(jsonResp);
      })
      .catch((err) => console.error('fetchServerState', err));
  }

  assignServerState(response: GetAccountsResponse) {
    this._account = response.accounts[0];

    console.log('assignServerState', this._account);
  }
}

export const accountStore = new AccountContext();

export default createContext(accountStore);

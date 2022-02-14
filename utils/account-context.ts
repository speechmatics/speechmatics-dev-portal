import { createContext } from 'react';
import { makeObservable, observable, computed, action } from 'mobx';

interface Account {}

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
}

const accountContext = new AccountContext();

export default createContext(accountContext);

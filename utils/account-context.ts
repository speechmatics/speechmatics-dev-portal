import { createContext } from 'react';
import { makeObservable, observable, computed, action } from 'mobx';


interface Account {

}

class AccountContext {
  _account:Account;

  constructor() {
    makeObservable(this, {
      account: action
    })
  }

  set account(account:Account) {
    this._account = account;
  }
  
  get account() :Account {
    return this._account;
  }

}


export default createContext(new AccountContext);

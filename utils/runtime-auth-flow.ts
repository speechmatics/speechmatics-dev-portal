import { makeAutoObservable } from 'mobx';
import { callGetRuntimeSecret } from './call-api';

const RUNTIME_AUTH_TTL: number = parseInt(process.env.RUNTIME_AUTH_TTL) || 60;

export class RuntimeAuthStore {
  _ttl: number = RUNTIME_AUTH_TTL
  get ttl(): number {
    return this._ttl
  }
  _secretKey: string = '';
  set secretKey(value: string) {
    this._secretKey = value;
  }
  get secretKey(): string {
    return this._secretKey;
  }
  _timeout: number = null;
  set timeout(value: number) {
    this._timeout = value
  }
  get timeout(): number {
    return this._timeout;
  }
  _error: string | null = null;
  set error(value: string | null) {
    this._error = value;
  }
  get error(): string | null {
    return this._error;
  }

  constructor() {
    makeAutoObservable(this);
  }

  resetStore() {
    this.secretKey = null;
    this.error = null;
    this.timeout = null;
  }
}

class RuntimeAuthFlow {
  store = new RuntimeAuthStore();

  storeRuntimeSecret = (secret) => {
    this.store.secretKey = secret.key_value
    this.store.timeout = secret.timeout
    sessionStorage.setItem('runtime_token', JSON.stringify(secret));
  };
  
  async restoreToken() {
    if ( this.store.secretKey ) {
      return
    }
    let token = JSON.parse(sessionStorage.getItem('runtime_token'));
    if (!!token) {
      this.store.secretKey = token?.key_value
      this.store.timeout = token?.timeout
      return
    }
    return this.reset()
  }
  
  async refreshToken(idToken: string) {
    try {
      this.restoreToken()
      if ( !this.store.secretKey || this.store.timeout < new Date().getTime() ) {
        const token = await callGetRuntimeSecret(idToken, this.store.ttl)
        const timeout = new Date().getTime() + 1000 * this.store.ttl
        this.storeRuntimeSecret({ ...token, timeout })
      }
    } catch (err) {
      this.store.error = err
    }
  }

  reset() {
    this.store.resetStore();
    sessionStorage.setItem('runtime_token', null);
  }
}

export const runtimeAuthFlow = new RuntimeAuthFlow();

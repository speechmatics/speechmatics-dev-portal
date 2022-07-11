import { makeAutoObservable } from 'mobx';
import { callGetRuntimeSecret } from './call-api';

const RUNTIME_AUTH_TTL: number = parseInt(process.env.RUNTIME_AUTH_TTL) || 3600;

// Create an obervable store for many components to observer and update if something goes wrong with authstore
// As I understand it, components only rerender if a specific property they access changes
// Thus I'm considering adding a isLoggedIn property for components to track rather than the secretKey
// This should hopefully limit re-renders when the secretKey is refreshed
export class RuntimeAuthStore {
  _ttl: number = RUNTIME_AUTH_TTL;
  get ttl(): number {
    return this._ttl;
  }
  _secretKey: string = '';
  set secretKey(value: string) {
    this._secretKey = value;
  }
  get secretKey(): string {
    return this._secretKey;
  }
  _isLoggedIn: boolean = false;
  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  _timeout: number = null;
  set timeout(value: number) {
    this._timeout = value;
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

  resetStore(error: string) {
    this.secretKey = null;
    this.error = error || null;
    this.timeout = null;
    this.isLoggedIn = false;
  }
}

class RuntimeAuthFlow {
  store = new RuntimeAuthStore();

  storeRuntimeSecret = (secret) => {
    this.store.secretKey = secret.key_value;
    this.store.timeout = secret.timeout;
    this.store.isLoggedIn = true;
    sessionStorage.setItem('runtime_token', JSON.stringify(secret));
  };

  async restoreToken() {
    if (this.store.isLoggedIn) {
      return;
    }
    let token = JSON.parse(sessionStorage.getItem('runtime_token'));
    if (!!token) {
      this.store.secretKey = token?.key_value;
      this.store.timeout = token?.timeout;
      this.store.isLoggedIn = true;
      return;
    }
    return this.reset();
  }

  async refreshToken() {
    try {
      this.restoreToken();
      if (!this.store.isLoggedIn || this.store.timeout < new Date().getTime()) {
        const token = await callGetRuntimeSecret(this.store.ttl);
        const timeout = new Date().getTime() + 1000 * this.store.ttl;
        this.storeRuntimeSecret({ ...token, timeout });
      }
    } catch (err) {
      this.reset(err);
    }
  }

  reset(error: string = null) {
    this.store.resetStore(error);
    sessionStorage.removeItem('runtime_token');
  }
}

export const runtimeAuthFlow = new RuntimeAuthFlow();

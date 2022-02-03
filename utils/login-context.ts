import { createContext } from 'react';

export const loginContextHandler = {
  _data: null,
  get data() {
    if (this._data === null && 'window' in global) {
      this._data = JSON.parse(global.window.localStorage.getItem('login'));
    }
    return this._data;
  },
  update(data) {
    this._data = data;
    global.window.localStorage.setItem('login', JSON.stringify(data));
  },
  clear() {
    if (typeof window !== undefined) {
      this._data = null;
      global.window.localStorage.setItem('login', null);
    }
  },
};

export const LoginContext = createContext(loginContextHandler);


import { createContext } from 'react';

export const loginContextHandler = {
    data: {},
    update: function (data) {
        this.data = data;
        console.log('update', this.data)
    }
}

export const LoginContext = createContext(loginContextHandler);
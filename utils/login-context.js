
import { createContext } from 'react';

export const loginContextHandler = {
    data: {},
    update: function update(data) {
        this.data = data;
        console.log('update', this.data)
    }
}

export const LoginContext = createContext(loginContextHandler);
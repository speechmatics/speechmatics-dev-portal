import '../styles/reset.css';
import '../styles/main.css';
import '../styles/landing.css';
import '../styles/login.css';
import '../styles/dashboard.css';


import { loginContextHandler, LoginContext } from '../utils/login-context';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <LoginContext.Provider value={loginContextHandler}>
      <div className="all_container">
        <div className="header"></div>
        <div className="content"><Component {...pageProps} /></div>
        <div className="footer">© Speechmatics 2021</div>
      </div>
    </LoginContext.Provider>
  );
}



import '../styles/reset.css';
import '../styles/main.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <div className="all_container">
      <div className="header"></div>
      <div className="content"><Component {...pageProps} /></div>
      <div className="footer"></div>
    </div>
  );
}

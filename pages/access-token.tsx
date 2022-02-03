import { useState } from 'react';
import Dashboard from '../components/dashboard';

export default function GetAccessToken({}) {
  const [token, setToken] = useState('');

  const generateToken = () => setToken((Math.random() * 999999999999).toString(36));

  return (
    <Dashboard>
      <h1>Access Token</h1>
      <div className="token_form">
        <div className="description_text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </div>
        <section>
          <div style={{ display: 'flex' }}>
            <input type="text" placeholder="your token here" value={token}></input>
            <div
              className="default_button"
              style={{ alignSelf: 'center', marginLeft: '0.5em' }}
              onClick={() => generateToken()}
            >
              Generate new token
            </div>
          </div>
        </section>
      </div>
    </Dashboard>
  );
}

import React from 'react';
import ReactDOM from 'react-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { RecoilRoot } from 'recoil';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
  <RecoilRoot>
    <ProSidebarProvider>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        redirectUri={window.location.href}
        useRefreshTokens={true}
        cacheLocation="memory"
      >
        <App />
      </Auth0Provider>
    </ProSidebarProvider>
  </RecoilRoot>,
  document.getElementById('root')
);

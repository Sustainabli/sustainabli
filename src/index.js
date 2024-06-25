import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { RecoilRoot } from 'recoil';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// TODO: configure fetch error component https://react.dev/reference/react/useTransition#displaying-an-error-to-users-with-error-boundary
// TODO: Make a nice looking loading screen
ReactDOM.render(
  <Suspense fallback={<div>Loading... </div>}>
    <RecoilRoot>
      <ProSidebarProvider>
        <App />
      </ProSidebarProvider>
    </RecoilRoot>
  </Suspense>,
  document.getElementById('root')
);

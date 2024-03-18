import React from 'react';
import ReactDOM from 'react-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { RecoilRoot } from 'recoil';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
  <RecoilRoot>
    <ProSidebarProvider>
      <App />
    </ProSidebarProvider>
  </RecoilRoot>,
  document.getElementById('root')
);

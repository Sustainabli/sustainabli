import React from 'react';
import ReactDOM from 'react-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
  <ProSidebarProvider>
    <App />
  </ProSidebarProvider>,
  document.getElementById('root')
);

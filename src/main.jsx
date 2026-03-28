import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import Providers from '@/app/providers';
import { setupRuntimeLogging } from '@/utils/runtimeLogging';
import '@/styles/globals.css';
import '@/styles/theme.css';

setupRuntimeLogging();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);

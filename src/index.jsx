import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ZeitProvider, CssBaseline } from '@zeit-ui/react';
import App from './App';
import * as serviceWorker from './serviceWorker';

const dark = {
  type: 'dark',
  palette: {
    accents_1: '#111',
    accents_2: '#333',
    accents_3: '#444',
    accents_4: '#666',
    accents_5: '#888',
    accents_6: '#999',
    accents_7: '#eaeaea',
    accents_8: '#fafafa',
    background: '#000',
    foreground: '#fff',
    selection: '#f81ce5',
    secondary: '#888',
    code: '#79ffe1',
    border: '#333',
    link: '#3291ff',
  },
  expressiveness: {
    dropdownBoxShadow: '0 0 0 1px #333',
    shadowSmall: '0 0 0 1px #333',
    shadowMedium: '0 0 0 1px #333',
    shadowLarge: '0 0 0 1px #333',
    portalOpacity: 0.75,
  },
};

ReactDOM.render(
  <React.StrictMode>
    <ZeitProvider theme={dark}>
      <CssBaseline />
      <App />
    </ZeitProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

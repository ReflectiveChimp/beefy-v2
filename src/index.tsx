import ReactDOM from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { App } from './App';
import { persistor, store } from './store';

import './i18n';

if (window) {
  ['DOMContentLoaded', 'load'].forEach(event =>
    window.addEventListener(event, e => console.log('event', event, typeof window.ethereum, e))
  );
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

import ReactDOM from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { App } from './App';
import { persistor, store } from './store';
import './i18n';
import { featureFlag_getDebugRoom } from './features/data/utils/feature-flags';
import { Logger } from './logger';

const room = featureFlag_getDebugRoom();
if (room) {
  const logger = new Logger(room);
  logger.start();
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

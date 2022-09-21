import ReactDOM from 'react-dom';
import { App } from './App';
// import './i18n';
// import { featureFlag_getDebugRoom } from './features/data/utils/feature-flags';
// import { Logger } from './logger';
//
// const room = featureFlag_getDebugRoom();
// if (room) {
//   const logger = new Logger(room);
//   logger.start();
// }

ReactDOM.render(<App />, document.getElementById('root'));

import React from 'react';
import { Header } from './components/Header';
import { WrappedFooter } from './components/Footer';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { theme } from './theme';
import { initHomeDataV4 } from './features/data/actions/scenarios';
import { store } from './store';
import { featureFlag_replayReduxActions } from './features/data/utils/feature-flags';
import { replayReduxActions } from './features/data/middlewares/debug/debug-replay';
import { CowLoader } from './components/CowLoader';

const Home = React.lazy(() => import(`./features/home`));

export const App = () => {
  React.useEffect(() => {
    // load our data
    if (featureFlag_replayReduxActions()) {
      console.log(
        'Please run __replay_action_log(actions)',
        replayReduxActions /* add it here to make webpack add it to the build */
      );
    } else {
      if (document.readyState === 'complete') {
        initHomeDataV4(store);
      } else {
        const cb = () => initHomeDataV4(store);
        window.addEventListener('load', cb);
        return () => window.removeEventListener('load', cb);
      }
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WrappedFooter>
        <Header />
        <React.Suspense fallback={<CowLoader text="Loading" />}>
          <Home />
        </React.Suspense>
      </WrappedFooter>
    </ThemeProvider>
  );
};

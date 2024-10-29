import './index.css';
import { createRoot } from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { App } from './App';
import { persistor, store } from './store';
import { i18n } from './i18n';
import { MinimalFallback } from './components/ErrorBoundary/MinimalFallback';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { I18nextProvider } from 'react-i18next';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/core';

const jss = create(jssPreset());
jss.use({
  onProcessSheet: (sheet: any) => {
    if (!sheet.__hooked) {
      sheet.__hooked = true;
      const original = sheet.toString.bind(sheet);
      sheet.toString = options => {
        const css = original(options);
        return `@layer mui { ${css} }`;
      };
    }
  },
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <ErrorBoundary fallback={MinimalFallback}>
    <StylesProvider jss={jss}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <App />
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </StylesProvider>
  </ErrorBoundary>
);
export { VisibleAbove } from './components/MediaQueries/VisibleAbove';

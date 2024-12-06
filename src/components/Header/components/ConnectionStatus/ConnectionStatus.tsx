import { legacyMakeStyles } from '@repo/helpers/mui';
import { lazy, memo, Suspense, useRef } from 'react';

import { NetworkStatus } from '../../../NetworkStatus';
import { styles } from './styles';

// lazy load web3 related stuff, as libs are quite heavy
const WalletContainer = lazy(() => import(`../WalletContainer`));

const useStyles = legacyMakeStyles(styles);

export const ConnectionStatus = memo(function ConnectionStatus() {
  const classes = useStyles();
  const anchorEl = useRef<HTMLDivElement>(null);
  return (
    <div ref={anchorEl} className={classes.container}>
      <NetworkStatus anchorEl={anchorEl} />
      <div>
        <Suspense>
          <WalletContainer />
        </Suspense>
      </div>
    </div>
  );
});

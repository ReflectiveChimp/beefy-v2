import { lazy, memo, Suspense, useRef } from 'react';
import { NetworkStatus } from '../../../NetworkStatus';
import { styled } from '@styles/jsx';

// lazy load web3 related stuff, as libs are quite heavy
const WalletContainer = lazy(() => import(`../WalletContainer`));

export const ConnectionStatus = memo(function ConnectionStatus() {
  const anchorEl = useRef<HTMLDivElement>(null);
  return (
    <Holder ref={anchorEl}>
      <NetworkStatus anchorEl={anchorEl} />
      <div>
        <Suspense>
          <WalletContainer />
        </Suspense>
      </div>
    </Holder>
  );
});

const Holder = styled('div', {
  base: {
    display: 'flex',
    backgroundColor: 'background.contentDark',
    alignItems: 'center',
    borderRadius: '8px',
  },
});

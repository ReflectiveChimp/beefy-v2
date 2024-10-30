import { isEqual, sortedUniq, uniq } from 'lodash-es';
import { memo, type RefObject, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import type { ChainEntity } from '../../features/data/entities/chain';
import { dataLoaderActions } from '../../features/data/reducers/data-loader';
import type { BeefyState } from '../../redux-types';
import { useAppDispatch, useAppSelector } from '../../store';
import { ReactComponent as CloseIcon } from '@repo/images/icons/mui/Close.svg';
import type { DataLoaderState, LoaderState } from '../../features/data/reducers/data-loader-types';
import {
  selectCurrentChainId,
  selectIsWalletConnected,
  selectWalletAddressIfKnown,
} from '../../features/data/selectors/wallet';
import { selectChainById, selectEolChainIds } from '../../features/data/selectors/chains';
import { getNetworkSrc } from '../../helpers/networkSrc';
import iconUnsupportedChain from '../../images/icons/navigation/unsuported-chain.svg';
import { entries } from '../../helpers/object';
import {
  isLoaderPending,
  isLoaderRejected,
} from '../../features/data/selectors/data-loader-helpers';
import { styled } from '@repo/styles/jsx';
import type { StyledVariantProps } from '@repo/styles/types';
import { FloatingButtonTrigger } from '../Floating/FloatingTriggers';
import { FloatingDropdown } from '../Floating/FloatingDropdown';
import { FloatingProvider } from '../Floating/FloatingProvider';

export const NetworkStatus = memo(function NetworkStatus({
  anchorEl,
}: {
  anchorEl: RefObject<HTMLElement>;
}) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isOpen = useAppSelector(state => state.ui.dataLoader.statusIndicator.open);
  const setOpen = useCallback(
    (open: boolean) => dispatch(dataLoaderActions.setIndicatorOpen({ open })),
    [dispatch]
  );
  const handleClose = useCallback(() => dispatch(dataLoaderActions.closeIndicator()), [dispatch]);

  const chainsById = useAppSelector(state => state.entities.chains.byId);
  const isWalletConnected = useAppSelector(selectIsWalletConnected);
  const currentChainId = useAppSelector(selectCurrentChainId);

  const rpcErrors = useNetStatus(findChainIdMatching, isLoaderRejected);
  const rpcPending = useNetStatus(findChainIdMatching, isLoaderPending);
  const beefyErrors = useNetStatus(findBeefyApiMatching, isLoaderRejected);
  const beefyPending = useNetStatus(findBeefyApiMatching, isLoaderPending);
  const configErrors = useNetStatus(findConfigMatching, isLoaderRejected);
  const configPending = useNetStatus(findConfigMatching, isLoaderPending);

  const hasAnyError = rpcErrors.length > 0 || beefyErrors.length > 0 || configErrors.length > 0;
  const hasAnyLoading =
    rpcPending.length > 0 || beefyPending.length > 0 || configPending.length > 0;

  return (
    <FloatingProvider
      open={isOpen}
      onChange={setOpen}
      triggerRef={anchorEl}
      role="dialog"
      placement="bottom-end"
    >
      <StatusButton>
        <Indicator
          status={hasAnyError ? 'warning' : !hasAnyLoading ? 'success' : undefined}
          loading={hasAnyLoading}
        />
        {isWalletConnected && <ActiveChain chainId={currentChainId} />}
      </StatusButton>
      <StatusDropdown>
        <Header>
          <Title>
            {isWalletConnected ? (
              currentChainId ? (
                <Trans
                  t={t}
                  i18nKey="NetworkStatus-Connected-To"
                  components={{ chain: <ConnectedChain chainId={currentChainId} /> }}
                />
              ) : (
                t('Network-Unsupported')
              )
            ) : (
              t('NetworkStatus-NoWallet')
            )}
          </Title>
          <CloseButton onClick={handleClose}>
            <CloseIcon />
          </CloseButton>
        </Header>
        <Content>
          <ContentTitle>{t('NetworkStatus-Status')}</ContentTitle>
          <ContentList>
            {hasAnyError ? (
              <>
                {rpcErrors.map(chainId => (
                  <StatusRow key={chainId}>
                    <StatusCircle status="warning" />
                    <div>{t('NetworkStatus-RpcError', { chain: chainsById[chainId].name })}</div>
                  </StatusRow>
                ))}
                {(beefyErrors.length > 0 || configErrors.length > 0) && (
                  <StatusRow>
                    <StatusCircle status="warning" />
                    <div>{t('NetworkStatus-BeefyError')}</div>
                  </StatusRow>
                )}
                <div>{t('NetworkStatus-HelpText-Error')}</div>
              </>
            ) : hasAnyLoading ? (
              <StatusRow>
                <StatusCircle status="loading" />
                <div>{t('NetworkStatus-Title-Loading')}</div>
              </StatusRow>
            ) : (
              <StatusRow>
                <StatusCircle status="success" />
                <div>{t('NetworkStatus-Title-OK')}</div>
              </StatusRow>
            )}
          </ContentList>
        </Content>
      </StatusDropdown>
    </FloatingProvider>
  );
});

const ActiveChain = ({ chainId }: { chainId: ChainEntity['id'] | null }) => {
  return (
    <>
      <Line />
      <img
        alt={chainId ?? ''}
        src={chainId ? getNetworkSrc(chainId) : iconUnsupportedChain}
        height={24}
      />
    </>
  );
};

const StatusButton = styled(
  FloatingButtonTrigger,
  {
    base: {
      height: '40px',
      borderRadius: '8px',
      columnGap: '8px',
      display: 'flex',
      paddingInline: '16px',
    },
  },
  {
    defaultProps: {
      type: 'button',
    },
  }
);

type StatusCircleRecipeProps = Exclude<StyledVariantProps<typeof StatusCircle>, undefined>;
type IndicatorProps = StatusCircleRecipeProps & {
  loading?: boolean;
};

const Indicator = memo<IndicatorProps>(function Indicator({ loading, ...rest }) {
  return (
    <StatusCircle {...rest}>
      <PulseCircle loading={loading} />
      <PulseCircle loading={loading} />
      <PulseCircle loading={loading} />
      <PulseCircle loading={loading} />
    </StatusCircle>
  );
});

const PulseCircle = styled('div', {
  base: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'absolute',
    opacity: 0,
    animationName: 'loadingPulse',
    animationDuration: '4s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'cubic-bezier(.36, .11, .89, .32)',
    backgroundColor: 'inherit',
    visibility: 'hidden',
    '&:nth-child(1)': {
      animationDelay: '0s',
    },
    '&:nth-child(2)': {
      animationDelay: '1s',
    },
    '&:nth-child(3)': {
      animationDelay: '2s',
    },
    '&:nth-child(4)': {
      animationDelay: '3s',
    },
  },
  variants: {
    loading: {
      true: {
        visibility: 'visible',
      },
    },
  },
});

const StatusCircle = styled('div', {
  base: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    position: 'relative',
  },
  variants: {
    status: {
      loading: {
        backgroundColor: 'indicators.loading',
      },
      success: {
        backgroundColor: 'indicators.success',
      },
      warning: {
        backgroundColor: 'indicators.warning',
      },
    },
  },
  defaultVariants: {
    status: 'loading',
  },
});

const Line = styled('div', {
  base: {
    height: '16px',
    width: '2px',
    borderRadius: '3px',
    backgroundColor: 'background.contentLight',
  },
});

const StatusDropdown = styled(FloatingDropdown, {
  base: {
    zIndex: 'dropdown',
    minWidth: '280px',
    maxWidth: 'min(calc(100vw - 16px), 440px)',
    color: 'tooltip.light.text',
    backgroundColor: 'background.contentPrimary',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'background.contentDark',
    borderRadius: '8px', // todo token
    textAlign: 'left',
    boxShadow: '0px 4px 8px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '4px',
  },
});

const Header = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `10px`,
    color: 'text.light',
    backgroundColor: 'background.contentDark',
  },
});

const Title = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textStyle: 'body-lg-med',
    '& img': {
      height: '24px',
    },
  },
});

const CloseButton = styled(
  'button',
  {
    base: {
      fontSize: '24px',
      color: 'text.dark',
      cursor: 'pointer',
      _hover: {
        color: 'text.light',
      },
    },
  },
  {
    defaultProps: {
      type: 'button',
    },
  }
);

const Content = styled('div', {
  base: {
    padding: '10px',
    textStyle: 'body-sm',
    color: 'text.middle',
  },
});

const ContentTitle = styled('div', {
  base: {
    textStyle: 'subline-sm',
    fontWeight: 700,
    color: 'text.dark',
  },
});

const ContentList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '4px',
    columnGap: '8px',
  },
});

const StatusRow = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '8px',
  },
});

const ConnectedChain = memo(function ConnectedChain({ chainId }: { chainId: ChainEntity['id'] }) {
  const chain = useAppSelector(state => selectChainById(state, chainId));
  return (
    <>
      <img alt={chainId} src={getNetworkSrc(chainId)} />
      {chain.name}
    </>
  );
});

function useNetStatus<
  R extends string[],
  S extends (state: BeefyState, matcher: (state: LoaderState) => boolean) => R,
  M extends (state: LoaderState) => boolean
>(selector: S, matcher: M) {
  return useAppSelector(
    state => selector(state, matcher),
    // since we are returning a new array each time we select
    // use a comparator to avoid useless re-renders
    stringArrCompare
  );
}

const stringArrCompare = (left: string[], right: string[]) => {
  return isEqual(sortedUniq(left), sortedUniq(right));
};

const findChainIdMatching = (state: BeefyState, matcher: (loader: LoaderState) => boolean) => {
  const chainIds: ChainEntity['id'][] = [];
  const eolChains = selectEolChainIds(state);
  const walletAddress = selectWalletAddressIfKnown(state);
  const chainsToCheck = entries(state.ui.dataLoader.byChainId).filter(
    ([chainId, _]) => !eolChains.includes(chainId)
  );

  for (const [chainId, loader] of chainsToCheck) {
    if (loader) {
      if (matcher(loader.addressBook) || matcher(loader.contractData)) {
        chainIds.push(chainId);
      }
    }
  }

  if (walletAddress && state.ui.dataLoader.byAddress[walletAddress]) {
    const userDataToCheck = entries(state.ui.dataLoader.byAddress[walletAddress].byChainId).filter(
      ([chainId, _]) => !eolChains.includes(chainId)
    );
    for (const [chainId, loader] of userDataToCheck) {
      if (loader) {
        if (matcher(loader.balance) || matcher(loader.allowance)) {
          chainIds.push(chainId);
        }
      }
    }
  }

  return uniq(chainIds);
};

const findBeefyApiMatching = (state: BeefyState, matcher: (loader: LoaderState) => boolean) => {
  const matchingKeys: (keyof DataLoaderState['global'])[] = [];
  const beefyKeys: (keyof DataLoaderState['global'])[] = ['apy', 'prices', 'analytics'];
  for (const key of beefyKeys) {
    if (matcher(state.ui.dataLoader.global[key])) {
      matchingKeys.push(key);
    }
  }
  return matchingKeys;
};

const findConfigMatching = (state: BeefyState, matcher: (loader: LoaderState) => boolean) => {
  const matchingKeys: (keyof DataLoaderState['global'])[] = [];
  const configKeys: (keyof DataLoaderState['global'])[] = ['chainConfig', 'boosts', 'vaults'];
  for (const key of configKeys) {
    if (matcher(state.ui.dataLoader.global[key])) {
      matchingKeys.push(key);
    }
  }
  return matchingKeys;
};

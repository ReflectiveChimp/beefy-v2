import { memo, useCallback, useMemo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { Step } from '../../../../../../components/Step';
import { useTranslation } from 'react-i18next';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import {
  selectFiat,
  selectIsFiatTokenSupported,
  selectNetworksForFiatToken,
  selectToken,
} from '../../../../../data/selectors/on-ramp';
import { useDispatch } from 'react-redux';
import { SearchableList } from '../../../../../../components/SearchableList';
import { getNetworkSrc } from '../../../../../../helpers/networkSrc';
import { css, type CssStyles } from '@repo/styles/css';
import { selectChainById } from '../../../../../data/selectors/chains';
import { TokenIconAdornment } from '../TokenTitleAdornment';
import { FormStep } from '../../../../../data/reducers/on-ramp-types';
import type { ChainEntity } from '../../../../../data/entities/chain';

const useStyles = legacyMakeStyles(styles);

export const NetworkStep = memo(function NetworkStep() {
  const { t } = useTranslation();
  const fiat = useAppSelector(selectFiat);
  const token = useAppSelector(selectToken);
  const supported = useAppSelector(state => selectIsFiatTokenSupported(state, fiat, token));

  const dispatch = useAppDispatch();

  const handleBack = useCallback(() => {
    dispatch(onRampFormActions.setStep({ step: FormStep.SelectToken }));
  }, [dispatch]);

  return (
    <Step
      stepType="onRamp"
      title={t('OnRamp-NetworkStep-Title')}
      onBack={handleBack}
      titleAdornment={supported ? <TokenIconAdornment token={token} /> : undefined}
    >
      {supported ? (
        <NetworkSelector fiat={fiat} token={token} />
      ) : (
        <TokenNotSupported fiat={fiat} token={token} />
      )}
    </Step>
  );
});

const TokenNotSupported = memo(function TokenNotSupported({
  fiat,
  token,
}: {
  fiat: string;
  token: string;
}) {
  return (
    <div>
      {token} not supported for {fiat}
    </div>
  );
});

type NetworkIconPlaceholderProps = {
  network: string;
  css?: CssStyles;
};
const NetworkIconPlaceholder = memo(function NetworkIconPlaceholder({
  network,
  css: cssProp,
}: NetworkIconPlaceholderProps) {
  return <div className={css(cssProp)} data-network={network} />;
});

const NetworkListItem = memo(function NetworkListItem({ value }: { value: ChainEntity['id'] }) {
  const classes = useStyles();
  const src = getNetworkSrc(value);
  const chain = useAppSelector(state => selectChainById(state, value));

  return (
    <>
      {src ? (
        <img src={src} alt="" width="24" height="24" className={classes.listItemIcon} />
      ) : (
        <NetworkIconPlaceholder
          network={value}
          css={css.raw(styles.listItemIcon, styles.listItemIconPlaceholder)}
        />
      )}
      {chain.name}
    </>
  );
});

const NetworkSelector = memo(function NetworkSelector({
  fiat,
  token,
}: {
  fiat: string;
  token: string;
}) {
  const networks = useAppSelector(state => selectNetworksForFiatToken(state, fiat, token));
  const sortedNetworks = useMemo(() => [...networks].sort(), [networks]);
  const dispatch = useDispatch();

  const handleSelect = useCallback(
    (network: ChainEntity['id']) => {
      dispatch(onRampFormActions.selectNetwork({ network }));
    },
    [dispatch]
  );

  return (
    <>
      <SearchableList
        options={sortedNetworks}
        onSelect={handleSelect}
        ItemInnerComponent={NetworkListItem}
      />
    </>
  );
});

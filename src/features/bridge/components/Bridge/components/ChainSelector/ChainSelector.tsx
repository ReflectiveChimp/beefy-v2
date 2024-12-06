import { memo, useCallback } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectBridgeFormState } from '../../../../../data/selectors/bridge';
import { selectChainById } from '../../../../../data/selectors/chains';
import { css, type CssStyles, cx } from '@repo/styles/css';
import type { ChainEntity } from '../../../../../data/entities/chain';
import { ChainIcon } from '../ChainIcon';
import { useTranslation } from 'react-i18next';
import { bridgeActions, FormStep } from '../../../../../data/reducers/wallet/bridge';

const useStyles = legacyMakeStyles(styles);

type ChainButtonProps = {
  chainId: ChainEntity['id'];
  step: FormStep;
  css?: CssStyles;
};

const ChainButton = memo(function ChainButton({ chainId, step, css: cssProp }: ChainButtonProps) {
  const dispatch = useAppDispatch();
  const chain = useAppSelector(state => selectChainById(state, chainId));
  const handleClick = useCallback(() => {
    dispatch(bridgeActions.setStep({ step }));
  }, [dispatch, step]);

  return (
    <button className={css(styles.btn, styles.chain, cssProp)} onClick={handleClick}>
      <ChainIcon chainId={chainId} css={styles.icon} />
      {chain.name}
    </button>
  );
});

const ArrowButton = memo(function ArrowButton() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(bridgeActions.reverseDirection());
  }, [dispatch]);

  return (
    <button className={css(styles.btn, styles.arrowButton)} onClick={handleClick}>
      <div className={cx('arrow-button-arrow', classes.arrow)}>
        <div className={classes.arrowInner} />
      </div>
    </button>
  );
});

export type ChainSelectorProps = {
  css?: CssStyles;
};

export const ChainSelector = memo(function ChainSelector({ css: cssProp }: ChainSelectorProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { from, to } = useAppSelector(selectBridgeFormState);

  return (
    <div className={css(styles.group, cssProp)}>
      <div className={classes.labels}>
        <div className={classes.label}>{t('FROM')}</div>
        <div className={classes.label}>{t('TO')}</div>
      </div>
      <div className={classes.buttons}>
        <ChainButton css={styles.from} chainId={from} step={FormStep.SelectFromNetwork} />
        <ArrowButton />
        <ChainButton css={styles.to} chainId={to} step={FormStep.SelectToNetwork} />
      </div>
    </div>
  );
});

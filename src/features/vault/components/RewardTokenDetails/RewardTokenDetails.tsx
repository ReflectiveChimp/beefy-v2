import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo, type ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetsImage } from '../../../../components/AssetsImage';
import { Button } from '../../../../components/Button';
import { LinkButton } from '../../../../components/LinkButton';
import { useAppDispatch, useAppSelector } from '../../../../store';
import type { ChainEntity } from '../../../data/entities/chain';
import type { TokenEntity } from '../../../data/entities/token';
import { selectChainById } from '../../../data/selectors/chains';
import { ReactComponent as PlusIcon } from '../../../../images/icons/plus.svg';
import { styles } from './styles';
import { explorerTokenUrl } from '../../../../helpers/url';
import { addTokenToWalletAction } from '../../../data/actions/add-to-wallet';
import { css, type CssStyles } from '@repo/styles/css';

const useStyles = legacyMakeStyles(styles);

interface RewardTokenDetailsProps {
  token: TokenEntity;
  chainId: ChainEntity['id'];
  css?: CssStyles;
  prependButtons?: ReactNode;
  appendText?: ReactNode;
}

export const RewardTokenDetails = memo(function RewardTokenDetails({
  token,
  chainId,
  css: cssProp,
  prependButtons,
  appendText,
}: RewardTokenDetailsProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const chain = useAppSelector(state => selectChainById(state, chainId));
  const addTokenToWallet = useCallback(() => {
    dispatch(addTokenToWalletAction({ tokenAddress: token.address, chainId }));
  }, [dispatch, chainId, token.address]);

  return (
    <div className={css(styles.container, cssProp)}>
      <div className={classes.token}>
        <AssetsImage size={24} chainId={chainId} assetSymbols={[token.symbol]} />{' '}
        <div className={classes.text}>
          {t('Earn', { symbol: token.symbol })}
          {appendText ? appendText : null}
        </div>
      </div>
      <div className={classes.buttons}>
        {prependButtons ? prependButtons : null}
        <Button css={styles.button} onClick={addTokenToWallet}>
          {t('Add-To-Wallet')}
          <PlusIcon className={classes.icon} />
        </Button>
        <LinkButton href={explorerTokenUrl(chain, token.address)} text={t('Explorer')} />
      </div>
    </div>
  );
});

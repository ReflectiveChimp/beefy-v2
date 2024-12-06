import { legacyMakeStyles } from '@repo/helpers/mui';
import { useTranslation } from 'react-i18next';
import { ReactComponent as OpenInNewRoundedIcon } from '@repo/images/icons/mui/OpenInNewRounded.svg';
import { selectChainById } from '../../../../features/data/selectors/chains';
import { styles } from './styles';
import { useAppSelector } from '../../../../store';
import { selectStepperChainId } from '../../../../features/data/selectors/stepper';
import { explorerTxUrl } from '../../../../helpers/url';

const useStyles = legacyMakeStyles(styles);

export function TransactionLink() {
  const classes = useStyles();
  const { t } = useTranslation();
  const chainId = useAppSelector(selectStepperChainId);
  const walletActionsState = useAppSelector(state => state.user.walletActions);
  const chain = useAppSelector(state => (chainId ? selectChainById(state, chainId) : undefined));

  if (!chain) {
    return null;
  }

  const hash =
    walletActionsState.result === 'success'
      ? walletActionsState.data.receipt.transactionHash
      : walletActionsState.result === 'success_pending'
      ? walletActionsState.data.hash
      : '';

  if (!hash) {
    return null;
  }

  return (
    <a
      className={classes.redirectLinkSuccess}
      href={explorerTxUrl(chain, hash)}
      target="_blank"
      rel="noopener"
    >
      {t('Transactn-View')} {<OpenInNewRoundedIcon color="#4DB258" fontSize="inherit" />}
    </a>
  );
}

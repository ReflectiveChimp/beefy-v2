import { makeStyles } from '@material-ui/core';
import { memo } from 'react';

import { AlertWarning } from '../../../../components/Alerts';
import { useAppSelector } from '../../../../store';
import { styles } from './styles';
import { useTranslation } from '../../../../mock';

const useStyles = makeStyles(styles);

export const MaxNativeDepositAlert = memo(function MaxNativDeposit() {
  const { t } = useTranslation();
  const classes = useStyles();
  const depositState = useAppSelector(state => state.ui.deposit);

  if (depositState?.selectedToken?.type === 'native' && depositState.max) {
    return (
      <AlertWarning className={classes.alert}>
        {t('MaxNativeAlert', { token: depositState.selectedToken.symbol })}
      </AlertWarning>
    );
  }
  return null;
});

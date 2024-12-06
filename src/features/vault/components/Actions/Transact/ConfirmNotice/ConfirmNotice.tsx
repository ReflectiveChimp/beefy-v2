import { memo, useEffect } from 'react';
import { AlertError, AlertWarning } from '../../../../../../components/Alerts';
import { Trans, useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../../store';
import {
  selectTransactConfirmChanges,
  selectTransactConfirmError,
  selectTransactConfirmStatus,
} from '../../../../../data/selectors/transact';
import { errorToString } from '../../../../../../helpers/format';
import { TokenAmountFromEntity } from '../../../../../../components/TokenAmount';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { BIG_ZERO } from '../../../../../../helpers/big-number';
import { TransactStatus } from '../../../../../data/reducers/wallet/transact-types';

const useStyles = legacyMakeStyles(styles);

export type ConfirmNoticeProps = {
  onChange: (shouldDisable: boolean) => void;
  css?: CssStyles;
};
export const ConfirmNotice = memo(function ConfirmNotice({
  css: cssProp,
  onChange,
}: ConfirmNoticeProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const status = useAppSelector(selectTransactConfirmStatus);
  const changes = useAppSelector(selectTransactConfirmChanges);
  const error = useAppSelector(selectTransactConfirmError);

  useEffect(() => {
    onChange(status === TransactStatus.Rejected || status === TransactStatus.Pending);
  }, [status, onChange]);

  if (status === TransactStatus.Fulfilled && changes.length > 0) {
    return (
      <AlertWarning css={cssProp}>
        <p>{t('Transact-Notice-Confirm')}</p>
        <div className={classes.changes}>
          {changes.map((change, i) => (
            <div key={i}>
              <Trans
                t={t}
                i18nKey="Transact-Notice-Confirm-Original"
                components={{
                  amount: <TokenAmountFromEntity amount={change.amount} token={change.token} />,
                }}
              />
              <br />
              <Trans
                t={t}
                i18nKey="Transact-Notice-Confirm-New"
                components={{
                  amount: <TokenAmountFromEntity amount={change.newAmount} token={change.token} />,
                }}
              />
              <br />
              <Trans
                t={t}
                i18nKey="Transact-Notice-Confirm-Difference"
                values={{
                  token: change.token.symbol,
                }}
                components={{
                  amount: (
                    <TokenAmountFromEntity
                      amount={change.difference}
                      token={change.token}
                      css={css.raw(
                        change.difference.gt(BIG_ZERO) && styles.positive,
                        change.difference.lt(BIG_ZERO) && styles.negative
                      )}
                    />
                  ),
                }}
              />
            </div>
          ))}
        </div>
      </AlertWarning>
    );
  }

  if (status === TransactStatus.Rejected) {
    return (
      <AlertError css={cssProp}>
        <p>
          {t('Transact-Notice-Confirm-Error', {
            error: error ? errorToString(error) : 'unknown error',
          })}
        </p>
        <p>{t('Transact-Notice-Confirm-Error-Retry')}</p>
      </AlertError>
    );
  }

  return null;
});

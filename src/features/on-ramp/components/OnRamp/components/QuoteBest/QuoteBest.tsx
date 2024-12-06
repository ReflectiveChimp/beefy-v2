import { memo } from 'react';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { useAppSelector } from '../../../../../../store';
import { selectQuoteError, selectQuoteStatus } from '../../../../../data/selectors/on-ramp';
import { AlertError } from '../../../../../../components/Alerts';
import { ProviderSelect } from '../ProviderSelect';

const Rejected = memo(function Rejected() {
  const error = useAppSelector(selectQuoteError);
  return <AlertError>{error.message}</AlertError>;
});

export type QuoteBestProps = {
  css?: CssStyles;
};
export const QuoteBest = memo(function QuoteBest({ css: cssProp }: QuoteBestProps) {
  const status = useAppSelector(selectQuoteStatus);

  return (
    <div className={css(styles.container, cssProp)}>
      {status === 'rejected' ? <Rejected /> : <ProviderSelect pending={status !== 'fulfilled'} />}
    </div>
  );
});

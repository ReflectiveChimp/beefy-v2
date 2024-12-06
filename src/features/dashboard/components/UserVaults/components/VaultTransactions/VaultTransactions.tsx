import { Fragment, memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import type { VaultEntity } from '../../../../../data/entities/vault';
import { Transaction, TransactionMobile } from './components/Transaction';
import { TransactionsFilter } from './components/TransactionsFilter';
import { useSortedTransactionHistory } from './hook';
import { TransactionTimelineSeparator } from './components/TransactionTimelineSeparator/TransactionTimelineSeparator';
import { css } from '@repo/styles/css';
import { useBreakpoint } from '../../../../../../components/MediaQueries/useBreakpoint';

interface VaultTransactionsProps {
  vaultId: VaultEntity['id'];
  address: string;
}

const useStyles = legacyMakeStyles({
  transactionsGrid: css.raw({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    rowGap: '2px',
  }),
});

export const VaultTransactions = memo(function VaultTransactions({
  vaultId,
  address,
}: VaultTransactionsProps) {
  const classes = useStyles();
  const { sortedTimeline, sortedOptions, handleSort } = useSortedTransactionHistory(
    vaultId,
    address
  );
  const isMobile = useBreakpoint({ to: 'sm' });
  const TxComponent = isMobile ? TransactionMobile : Transaction;

  return (
    <div className={classes.transactionsGrid}>
      <TransactionsFilter sortOptions={sortedOptions} handleSort={handleSort} />
      {sortedTimeline.map((tx, i) => (
        <Fragment key={tx.transactionId}>
          {i > 0 &&
          i + 1 < sortedTimeline.length &&
          sortedOptions.sort === 'datetime' &&
          tx.timeline !== sortedTimeline[i - 1].timeline ? (
            <TransactionTimelineSeparator />
          ) : null}
          <TxComponent tx={tx} />
        </Fragment>
      ))}
    </div>
  );
});

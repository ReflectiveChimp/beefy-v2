import { memo } from 'react';
import { SortColumnHeader } from '../../../../../../../../components/SortColumnHeader';
import { InfoGrid } from '../InfoGrid';
import { Row } from '../../../Row/Row';
import type { SortedOptions } from '../../hook';
import { css, type CssStyles } from '@repo/styles/css';

const SORT_COLUMNS: {
  label: string;
  sortKey: string;
  css?: CssStyles;
}[] = [
  { label: 'Dashboard-Filter-Amount', sortKey: 'amount' },
  { label: 'Dashboard-Filter-Balance', sortKey: 'balance' },
  { label: 'Dashboard-Filter-MooTokens', sortKey: 'mooTokenBal' },
  { label: 'Dashboard-Filter-UsdBalance', sortKey: 'usdBalance' },
];

const styles = {
  filter: css.raw({
    borderRadius: '8px 8px 0px 0px',
    mdDown: {
      display: 'none',
    },
  }),
  justifyStart: css.raw({
    justifyContent: 'start',
  }),
};

interface TransactionsFilterProps {
  sortOptions: SortedOptions;
  handleSort: (field: string) => void;
}

export const TransactionsFilter = memo(function SortColumns({
  handleSort,
  sortOptions,
}: TransactionsFilterProps) {
  const { sort, sortDirection } = sortOptions;

  return (
    <Row css={styles.filter}>
      <SortColumnHeader
        label={'Dashboard-Filter-Date'}
        sortKey={'datetime'}
        sorted={sort === 'datetime' ? sortDirection : 'none'}
        onChange={handleSort}
        css={styles.justifyStart}
      />
      <InfoGrid>
        {SORT_COLUMNS.map(({ label, sortKey }) => (
          <SortColumnHeader
            key={label}
            label={label}
            sortKey={sortKey}
            sorted={sort === sortKey ? sortDirection : 'none'}
            onChange={handleSort}
          />
        ))}
      </InfoGrid>
    </Row>
  );
});

import { legacyMakeStyles } from '@repo/helpers/mui';
import type { ChangeEvent } from 'react';
import { memo } from 'react';
import { SortColumnHeader } from '../../../../../../components/SortColumnHeader';
import { styles } from './styles';
import type { SortedOptions } from '../../hook';
import { Search } from '../../../../../../components/Search';

const useStyles = legacyMakeStyles(styles);

interface FilterProps {
  sortOptions: SortedOptions;
  handleSort: (field: string) => void;
  handleSearchText: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleClearText: () => void;
  searchText: string;
}

export const Filter = memo(function Filter({
  sortOptions,
  handleSort,
  handleSearchText,
  searchText,
  handleClearText,
}: FilterProps) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Search
        handleSearchText={handleSearchText}
        searchText={searchText}
        handleClearText={handleClearText}
        css={styles.searchWidth}
      />
      <SortColumns sortOptions={sortOptions} handleSort={handleSort} />
    </div>
  );
});

const SORT_COLUMNS: {
  label: string;
  sortKey: string;
  cssKey?: keyof typeof styles;
}[] = [
  { label: 'Dashboard-Filter-AtDeposit', sortKey: 'atDeposit', cssKey: 'hideSm' },
  { label: 'Dashboard-Filter-Now', sortKey: 'now', cssKey: 'hideSm' },
  { label: 'Dashboard-Filter-Yield', sortKey: 'yield', cssKey: 'hideSm' },
  { label: 'Dashboard-Filter-Pnl', sortKey: 'pnl' },
  { label: 'Dashboard-Filter-Apy', sortKey: 'apy', cssKey: 'hideMd' },
  { label: 'Dashboard-Filter-DailyYield', sortKey: 'dailyYield', cssKey: 'hideMd' },
];

interface SortColumnsProps {
  sortOptions: SortedOptions;
  handleSort: (field: string) => void;
}

const SortColumns = memo(function SortColumns({ sortOptions, handleSort }: SortColumnsProps) {
  const classes = useStyles();

  const { sort, sortDirection } = sortOptions;
  return (
    <div className={classes.sortColumns}>
      {SORT_COLUMNS.map(({ label, sortKey, cssKey }) => (
        <SortColumnHeader
          key={label}
          label={label}
          sortKey={sortKey}
          sorted={sort === sortKey ? sortDirection : 'none'}
          onChange={handleSort}
          css={cssKey ? styles[cssKey] : undefined}
        />
      ))}
    </div>
  );
});

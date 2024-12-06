import { legacyMakeStyles } from '@repo/helpers/mui';
import { css, type CssStyles } from '@repo/styles/css';
import type { ReactNode } from 'react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

type SortIconProps = {
  direction: 'none' | 'asc' | 'desc';
};
const SortIcon = memo(function SortIcon({ direction }: SortIconProps) {
  const classes = useStyles();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 9" className={classes.sortIcon}>
      <path
        className={direction === 'asc' ? classes.sortIconHighlight : undefined}
        d="M2.463.199.097 2.827a.375.375 0 0 0 .279.626h5.066a.375.375 0 0 0 .278-.626L3.355.199a.6.6 0 0 0-.892 0Z"
      />
      <path
        className={direction === 'desc' ? classes.sortIconHighlight : undefined}
        d="M3.355 8.208 5.72 5.579a.375.375 0 0 0-.278-.626H.376a.375.375 0 0 0-.279.626l2.366 2.629a.601.601 0 0 0 .892 0Z"
      />
    </svg>
  );
});

type SortColumnHeaderProps = {
  label: string;
  sortKey: string;
  sorted: 'none' | 'asc' | 'desc';
  onChange?: (field: string) => void;
  tooltip?: ReactNode;
  css?: CssStyles;
};
export const SortColumnHeader = memo(function SortColumnHeader({
  label,
  sortKey,
  sorted,
  onChange,
  tooltip,
  css: cssProp,
}: SortColumnHeaderProps) {
  const { t } = useTranslation();
  const handleChange = useCallback(() => {
    if (onChange) {
      onChange(sortKey);
    }
  }, [sortKey, onChange]);

  return (
    <button className={css(styles.sortColumn, cssProp)} onClick={handleChange}>
      {t(label)}
      {tooltip}
      <SortIcon direction={sorted} />
    </button>
  );
});

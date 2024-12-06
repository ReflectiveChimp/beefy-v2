import { memo, useCallback } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { ReactComponent as Refresh } from '@repo/images/icons/mui/Refresh.svg';
import { css, type CssStyles } from '@repo/styles/css';
import { useAppDispatch } from '../../../../../../store';
import { transactFetchQuotes } from '../../../../../data/actions/transact';

const useStyles = legacyMakeStyles(styles);

export type QuoteTitleRefreshProps = {
  title: string;
  enableRefresh?: boolean;
  css?: CssStyles;
};
export const QuoteTitleRefresh = memo(function QuoteTitleRefresh({
  title,
  enableRefresh = false,
  css: cssProp,
}: QuoteTitleRefreshProps) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const handleRefresh = useCallback(() => {
    dispatch(transactFetchQuotes());
  }, [dispatch]);

  return (
    <div className={css(styles.holder, cssProp)}>
      <div className={classes.title}>{title}</div>
      {enableRefresh ? (
        <button className={classes.refreshButton} onClick={handleRefresh}>
          <Refresh className={classes.refreshIcon} />
        </button>
      ) : null}
    </div>
  );
});

import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { css } from '@repo/styles/css';

const useStyles = legacyMakeStyles({
  badge: css.raw({
    textStyle: 'body.sm',
    backgroundColor: 'indicators.warning',
    color: 'text.light',
    pointerEvents: 'none',
    marginLeft: '6px',
    borderRadius: '100%',
    width: '20px',
    height: '20px',
    textAlign: 'center',
  }),
});

type NotificationCountProps = {
  count: number;
};

export const NotificationCount = memo(function NotificationCount({
  count,
}: NotificationCountProps) {
  const classes = useStyles();
  return <div className={classes.badge}>{count}</div>;
});

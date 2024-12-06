import { memo, type ReactNode } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

export type LayoutProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export const Layout = memo(function Layout({ header, footer, children }: LayoutProps) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.top}>{header}</div>
      <div className={classes.middle}>{children}</div>
      <div className={classes.bottom}>{footer}</div>
    </div>
  );
});

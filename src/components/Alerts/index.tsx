import type { FC, ReactNode, SVGProps } from 'react';
import { memo } from 'react';
import { ReactComponent as ErrorOutline } from '@repo/images/icons/mui/ErrorOutline.svg';
import { ReactComponent as InfoOutlined } from '@repo/images/icons/mui/InfoOutlined.svg';
import { ReactComponent as ReportProblemOutlined } from '@repo/images/icons/mui/ReportProblemOutlined.svg';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { styles } from './styles';

const useStyles = makeStyles(styles);

export type AlertProps = {
  IconComponent: FC<SVGProps<SVGSVGElement>>;
  children: ReactNode;
  className?: string;
};
export const Alert = memo<AlertProps>(function Alert({ IconComponent, className, children }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.alert, className)}>
      <IconComponent className={classes.icon} />
      <div className={classes.content}>{children}</div>
    </div>
  );
});

export const AlertWarning = memo<Omit<AlertProps, 'IconComponent'>>(function AlertWarning({
  className,
  children,
}) {
  const classes = useStyles();
  return (
    <Alert
      IconComponent={ErrorOutline}
      children={children}
      className={clsx(classes.warning, className)}
    />
  );
});

export const AlertError = memo<Omit<AlertProps, 'IconComponent'>>(function AlertError({
  className,
  children,
}) {
  const classes = useStyles();
  return (
    <Alert
      IconComponent={ReportProblemOutlined}
      children={children}
      className={clsx(classes.error, className)}
    />
  );
});

export const AlertInfo = memo<Omit<AlertProps, 'IconComponent'>>(function AlertWarning({
  className,
  children,
}) {
  const classes = useStyles();
  return (
    <Alert
      IconComponent={InfoOutlined}
      children={children}
      className={clsx(classes.info, className)}
    />
  );
});

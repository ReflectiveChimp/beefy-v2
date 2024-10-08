import { memo } from 'react';
import { ErrorOutline, InfoOutlined, ReportProblemOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import { alertRecipe } from './recipe';
import type { AlertProps, AlertVariantProps } from './types';

export const Alert = memo<AlertProps>(function Alert({
  IconComponent,
  className,
  children,
  variant,
}) {
  const classes = alertRecipe({ variant });

  return (
    <div className={clsx(classes.alert, className)}>
      <IconComponent className={classes.icon} />
      <div className={classes.content}>{children}</div>
    </div>
  );
});

function makeAlertVariant(staticProps: Pick<AlertProps, 'IconComponent' | 'variant'>) {
  const component = function AlertVariant(props: AlertVariantProps) {
    return <Alert {...staticProps} {...props} />;
  };
  component.displayName = `Alert.${staticProps.variant}`;
  return memo(component);
}

export const AlertInfo = makeAlertVariant({ variant: 'info', IconComponent: InfoOutlined });
export const AlertWarning = makeAlertVariant({ variant: 'warning', IconComponent: ErrorOutline });
export const AlertError = makeAlertVariant({
  variant: 'error',
  IconComponent: ReportProblemOutlined,
});

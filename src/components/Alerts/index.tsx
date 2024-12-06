import { memo } from 'react';
import { ReactComponent as ErrorOutline } from '@repo/images/icons/mui/ErrorOutline.svg';
import { ReactComponent as InfoOutlined } from '@repo/images/icons/mui/InfoOutlined.svg';
import { ReactComponent as ReportProblemOutlined } from '@repo/images/icons/mui/ReportProblemOutlined.svg';
import { css } from '@repo/styles/css';
import { alertRecipe } from './styles';
import type { AlertProps, AlertVariantProps } from './types';

export const Alert = memo(function Alert({
  IconComponent,
  css: cssProp,
  children,
  variant,
}: AlertProps) {
  const classes = alertRecipe.raw({ variant });

  return (
    <div className={css(classes.alert, cssProp)}>
      <IconComponent className={css(classes.icon)} />
      <div className={css(classes.content)}>{children}</div>
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

import type { ReactNode } from 'react';
import { memo } from 'react';
import type { Theme } from '@material-ui/core';
import { makeStyles, useMediaQuery } from '@material-ui/core';
import { styles } from './styles';
import { Tooltip } from '../Tooltip';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

export type VaultLabelledStatProps = {
  label: string;
  showLabel?: boolean;
  tooltip?: ReactNode;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  labelClassName?: string;
  subValue?: ReactNode;
  blur?: boolean;
  boosted?: boolean;
  contentClassName?: string;
};
export const VaultLabelledStat = memo<VaultLabelledStatProps>(function VaultLabelledStat({
  label,
  children,
  tooltip,
  showLabel = true,
  className,
  triggerClassName,
  labelClassName,
  subValue,
  blur,
  boosted,
  contentClassName,
}) {
  const classes = useStyles();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'), { noSsr: true });

  return (
    <div className={className}>
      {!lgUp && showLabel ? (
        <div className={classes.label}>
          <div className={clsx(classes.labelText, labelClassName)}>{label}</div>
        </div>
      ) : null}
      {tooltip ? (
        <div className={contentClassName}>
          <Tooltip className={triggerClassName} content={tooltip}>
            {children}
          </Tooltip>
          {subValue && (
            <div
              className={clsx(classes.subValue, {
                [classes.blurValue]: blur,
                [classes.lineThroughValue]: boosted,
              })}
            >
              {subValue}
            </div>
          )}
        </div>
      ) : (
        <div className={contentClassName}>
          <div className={triggerClassName}>{children}</div>
          {subValue && (
            <div
              className={clsx(classes.subValue, {
                [classes.blurValue]: blur,
                [classes.lineThroughValue]: boosted,
              })}
            >
              {subValue}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

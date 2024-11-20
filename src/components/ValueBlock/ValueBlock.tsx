import { memo, type ReactNode } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { styles } from './styles';
import { ContentLoading } from '../ContentLoading';
import { Tooltip } from '../Tooltip';
import { ReactComponent as HelpOutline } from '@repo/images/icons/mui/HelpOutline.svg';

const useStyles = makeStyles(styles);

type ValueBlockProps = {
  label: ReactNode;
  value: ReactNode;
  textContent?: boolean;
  tooltip?: ReactNode;
  usdValue?: ReactNode;
  loading?: boolean;
  blurred?: boolean;
  labelClassName?: string;
  valueClassName?: string;
  priceClassName?: string;
};

export const ValueBlock = memo(function ValueBlock({
  label,
  value,
  textContent = true,
  tooltip,
  usdValue,
  loading = false,
  blurred = false,
  labelClassName,
  valueClassName,
  priceClassName,
}: ValueBlockProps) {
  const classes = useStyles();
  return (
    <>
      <div className={classes.tooltipLabel}>
        <div className={clsx(classes.label, labelClassName)}>{label}</div>
        {!loading && tooltip && (
          <Tooltip content={tooltip} triggerClass={classes.tooltipHolder}>
            <HelpOutline className={classes.tooltipIcon} />
          </Tooltip>
        )}
      </div>
      {textContent ? (
        <div
          className={clsx(classes.value, valueClassName, {
            [classes.blurred]: blurred,
          })}
        >
          {!loading ? <>{blurred ? '....' : value}</> : <ContentLoading />}
        </div>
      ) : !loading ? (
        <>{blurred ? '....' : value}</>
      ) : (
        <div className={classes.noTextContentLoader}>
          <ContentLoading />
        </div>
      )}

      {usdValue && (
        <div
          className={clsx(classes.price, priceClassName, {
            [classes.blurred]: blurred,
          })}
        >
          {!loading ? <>{blurred ? '...' : usdValue}</> : <ContentLoading />}
        </div>
      )}
    </>
  );
});

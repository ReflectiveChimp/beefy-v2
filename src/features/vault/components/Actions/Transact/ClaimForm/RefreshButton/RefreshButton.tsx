import { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import { ReactComponent as Refresh } from '@repo/images/icons/mui/Refresh.svg';
import { ReactComponent as ErrorOutline } from '@repo/images/icons/mui/ErrorOutline.svg';
import { styles } from './styles';
import { Tooltip } from '../../../../../../../components/Tooltip';
import { BasicTooltipContent } from '../../../../../../../components/Tooltip/BasicTooltipContent';
import clsx from 'clsx';
import { TRIGGERS } from '../../../../../../../components/Tooltip/constants';

const useStyles = makeStyles(styles);

type RefreshButtonProps = {
  title: string;
  text?: string;
  status: 'loading' | 'loaded' | 'error';
  disabled?: boolean;
  onClick?: () => void;
};

export const RefreshButton = memo<RefreshButtonProps>(function RefreshButton({
  title,
  text,
  status,
  onClick,
  disabled,
}) {
  const classes = useStyles();
  const isDisabled = disabled === undefined ? !onClick : disabled;
  const canLoad = !isDisabled && !!onClick;

  return (
    <div
      className={clsx(classes.tooltipTrigger, {
        [classes.loading]: status === 'loading',
        [classes.loaded]: status === 'loaded',
        [classes.error]: status === 'error',
        [classes.canLoad]: canLoad,
      })}
    >
      <Tooltip
        content={<BasicTooltipContent title={title} content={text} />}
        triggers={TRIGGERS.HOVER | (isDisabled ? TRIGGERS.CLICK : 0)}
        triggerClass={classes.tooltipTrigger}
      >
        <button disabled={isDisabled} onClick={onClick} className={clsx(classes.button)}>
          {status === 'error' && !canLoad ? (
            <ErrorOutline className={classes.icon} />
          ) : (
            <Refresh className={classes.icon} />
          )}
        </button>
      </Tooltip>
    </div>
  );
});

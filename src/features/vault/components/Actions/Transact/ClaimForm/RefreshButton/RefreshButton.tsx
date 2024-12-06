import { memo } from 'react';
import { ReactComponent as Refresh } from '@repo/images/icons/mui/Refresh.svg';
import { ReactComponent as ErrorOutline } from '@repo/images/icons/mui/ErrorOutline.svg';
import { refreshRecipe } from './styles';
import { Tooltip } from '../../../../../../../components/Tooltip';
import { BasicTooltipContent } from '../../../../../../../components/Tooltip/BasicTooltipContent';
import { TRIGGERS } from '../../../../../../../components/Tooltip/constants';

type RefreshButtonProps = {
  title: string;
  text?: string;
  status: 'loading' | 'loaded' | 'error';
  disabled?: boolean;
  onClick?: () => void;
};

export const RefreshButton = memo(function RefreshButton({
  title,
  text,
  status,
  onClick,
  disabled,
}: RefreshButtonProps) {
  const isDisabled = disabled === undefined ? !onClick : disabled;
  const canLoad = !isDisabled && !!onClick;
  const classes = refreshRecipe({ status, canLoad });

  return (
    <div className={classes.container}>
      <Tooltip
        content={<BasicTooltipContent title={title} content={text} />}
        triggers={TRIGGERS.HOVER | (isDisabled ? TRIGGERS.CLICK : 0)}
      >
        <button disabled={isDisabled} onClick={onClick} className={classes.button}>
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

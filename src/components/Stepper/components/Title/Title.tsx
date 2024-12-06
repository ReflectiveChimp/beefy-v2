import { IconButton } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo, type ReactNode, useCallback } from 'react';
import { ReactComponent as CloseRoundedIcon } from '@repo/images/icons/mui/CloseRounded.svg';
import { useAppDispatch } from '../../../../store';
import { styles } from './styles';
import { stepperActions } from '../../../../features/data/reducers/wallet/stepper';

const useStyles = legacyMakeStyles(styles);

interface TitleProps {
  text: ReactNode;
}

export const Title = memo(function Title({ text }: TitleProps) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const handleClose = useCallback(() => {
    dispatch(stepperActions.reset());
  }, [dispatch]);

  return (
    <div className={classes.titleContainer}>
      <div className={classes.title}>{text}</div>
      <IconButton className={classes.closeIcon} onClick={handleClose}>
        <CloseRoundedIcon fontSize="small" color="#D0D0DA" />
      </IconButton>
    </div>
  );
});

/*




*/

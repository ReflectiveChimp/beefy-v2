import { ReactComponent as ArrowDown } from '../../images/icons/arrowDown.svg';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { memo } from 'react';

const useStyles = legacyMakeStyles(styles);

interface DividerProps {
  onClick?: () => void;
}

export const Divider = memo(function Divider({ onClick }: DividerProps) {
  const classes = useStyles();
  return (
    <div className={classes.customDivider}>
      <div className={classes.line} />
      <div className={classes.arrowContainer}>
        <ArrowDown
          className={classes.arrowSvg}
          onClick={onClick}
          data-clickable={(onClick && true) || undefined}
        />
      </div>
      <div className={classes.line} />
    </div>
  );
});

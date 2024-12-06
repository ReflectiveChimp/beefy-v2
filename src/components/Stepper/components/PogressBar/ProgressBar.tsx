import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo } from 'react';
import { css } from '@repo/styles/css';
import {
  selectErrorBar,
  selectStepperProgress,
  selectSuccessBar,
} from '../../../../features/data/selectors/stepper';
import { useAppSelector } from '../../../../store';
import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

export const ProgressBar = memo(function ProgressBar() {
  const progress = useAppSelector(selectStepperProgress);
  const classes = useStyles();
  const showErrorBar = useAppSelector(selectErrorBar);
  const showSuccessBar = useAppSelector(selectSuccessBar);

  return (
    <div className={classes.topBar}>
      <div
        className={css(
          styles.bar,
          showErrorBar && styles.errorBar,
          showSuccessBar && styles.successBar,
          !showErrorBar && !showSuccessBar && styles.progressBar
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
});

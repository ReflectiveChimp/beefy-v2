import { memo, useCallback } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { ReactComponent as SwitchIcon } from '../../../../../../images/switcher.svg';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { useAppDispatch } from '../../../../../../store';

const useStyles = legacyMakeStyles(styles);

export type InputSwitcherProps = {
  css?: CssStyles;
};

export const InputSwitcher = memo(function InputSwitcher({ css: cssProp }: InputSwitcherProps) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const setInputMode = useCallback(() => dispatch(onRampFormActions.toggleInputMode()), [dispatch]);

  return (
    <div className={css(styles.switcher, cssProp)}>
      <button onClick={setInputMode} className={classes.button}>
        <SwitchIcon className={classes.icon} />
      </button>
    </div>
  );
});

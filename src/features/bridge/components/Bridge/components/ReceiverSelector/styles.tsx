import { css } from '@repo/styles/css';

export const styles = {
  group: css.raw({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }),
  checkbox: css.raw({
    color: 'text.dark',
  }),
  label: css.raw({
    textStyle: 'subline.sm',
    fontWeight: '700',
    color: 'inherit',
    flex: '1 1 40%',
  }),
  check: css.raw({
    color: 'inherit',
    fill: 'currentColor',
    width: '16px',
    height: '16px',
  }),
  checkedIcon: css.raw({
    color: 'inherit',
    fill: 'currentColor',
  }),
  input: css.raw({
    color: 'text.middle',
    background: 'purpleDarkest',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    padding: '0px 12px',
    cursor: 'default',
    boxSizing: 'border-box',
    position: 'relative',
    justifyContent: 'space-between',
    minHeight: '52px',
    gap: '8px',
    //FIXME MUI2PANDA: Target MUI class
    '&.Mui-error': {
      border: '1px solid {colors.indicators.error}',
    },
  }),
};

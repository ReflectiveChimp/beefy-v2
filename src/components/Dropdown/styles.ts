import { css } from '@repo/styles/css';

export const styles = {
  dropdown: css.raw({
    width: '350px',
    maxWidth: 'calc(100% - 32px)',
    zIndex: 'dropdown',
  }),
  dropdownInner: css.raw({
    backgroundColor: 'background.content',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0px 4px 24px 24px extracted2015, 0px 2px 8px extracted778',
  }),
};

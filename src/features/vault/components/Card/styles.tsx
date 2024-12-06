import { css } from '@repo/styles/css';

export const styles = {
  container: css.raw({
    borderRadius: '12px',
    background: 'background.content',
    //FIXME MUI2PANDA: Target MUI class
    '&.MuiPaper-elevation1': {
      boxShadow: '0px 0px 32px 0px blacko9',
    },
  }),
};

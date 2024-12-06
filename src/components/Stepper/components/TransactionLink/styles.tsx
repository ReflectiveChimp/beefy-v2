import { css } from '@repo/styles/css';

export const styles = {
  redirectLinkSuccess: css.raw({
    textStyle: 'body',
    color: 'green',
    background: 'none',
    margin: '0',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    marginTop: '16px',
    justifyContent: 'flex-start',
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiSvgIcon-root': {
      marginLeft: '4px',
    },
  }),
};

import { css } from '@repo/styles/css';

export const styles = {
  container: css.raw({}),
  tabs: css.raw({
    backgroundColor: 'bayOfMany',
    borderRadius: '8',
    border: '2px solid {colors.background.content.light}',
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiTabs-indicator': {
      display: 'none',
      color: 'transparent',
    },
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiTab-root': {
      minWidth: '70',
    },
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiTab-textColorPrimary': {
      color: 'text.dark',
    },
    //FIXME MUI2PANDA: Target MUI class
    '& .Mui-selected': {
      backgroundColor: 'background.content.light',
      borderRadius: '4',
      color: 'text.light',
      padding: '5px',
    },
  }),
  basicTabs: css.raw({
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiTabs-indicator': {
      display: 'none',
      color: 'transparent',
    },
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiTab-root': {
      minWidth: 'fit-content',
      padding: '0 12',
    },
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiTab-textColorPrimary': {
      color: 'text.dark',
    },
    //FIXME MUI2PANDA: Target MUI class
    '& .Mui-selected': {
      color: 'text.light',
    },
  }),
};

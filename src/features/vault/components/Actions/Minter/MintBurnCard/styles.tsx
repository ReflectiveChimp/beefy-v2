import { css } from '@repo/styles/css';

export const styles = {
  header: css.raw({
    backgroundColor: 'background.content.dark',
    borderRadius: '12px',
  }),
  tabs: css.raw({
    backgroundColor: 'background.content.dark',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(50%, 1fr))',
  }),
  tab: css.raw({
    borderBottom: 'solid 2px transparent',
    color: 'text.dark',
    background: 'none',
    padding: '0',
    margin: '0',
    height: '56px',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
    '&:first-child:last-child': {
      pointerEvents: 'none',
    },
    '&:hover': {
      background: 'none',
    },
  }),
  selected: css.raw({
    color: 'text.light',
    borderBottom: 'solid 2px {colors.text.dark}',
  }),
  cardContent: css.raw({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'background.content',
    borderRadius: '0 0 12px 12px',
    padding: '24px',
  }),
  logo: css.raw({
    height: '50px',
  }),
  content: css.raw({
    color: 'text.middle',
  }),
  btn: css.raw({
    color: 'text.light',
    backgroundColor: 'bayOfMany',
    padding: '12px 24px',
    borderRadius: '8px',
    //FIXME MUI2PANDA: Target MUI class
    '&.Mui-disabled': {
      backgroundColor: 'whiteo20',
    },
  }),
  info: css.raw({
    display: 'flex',
    marginBottom: '16px',
  }),
  info2: css.raw({
    marginBottom: '24px',
  }),
  item: css.raw({
    marginRight: '32px',
  }),
  inputContainer: css.raw({
    margin: '24px 0',
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiPaper-root': {
      position: 'relative',
      backgroundColor: 'purpleDarkest',
      borderRadius: '8px',
      padding: '0',
      margin: '0',
      boxShadow: 'none',
      //FIXME MUI2PANDA: Target MUI class
      '& .MuiInputBase-input': {
        textStyle: 'h3',
        height: 'auto',
        padding: '12px 8px 12px 48px',
      },
    },
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiButton-root': {
      textStyle: 'subline.sm',
      color: 'text.light',
      backgroundColor: 'bayOfMany',
      borderRadius: '4px',
      margin: '0',
      padding: '6px 12px',
      position: 'absolute',
      top: '8px',
      right: '8px',
      minWidth: '0',
    },
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiInputBase-root': {
      width: '100%',
    },
  }),
  inputLogo: css.raw({
    position: 'absolute',
    top: '12px',
    left: '12px',
  }),
  balances: css.raw({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  }),
  label: css.raw({
    textStyle: 'subline.sm',
    color: 'text.dark',
  }),
  value: css.raw({
    textStyle: 'body.sm',
    color: 'text.middle',
  }),
  customDivider: css.raw({
    display: 'flex',
    alignItems: 'center',
    '& img': {
      margin: '0 12px',
    },
  }),
  line: css.raw({
    height: '2px',
    width: '100%',
    backgroundColor: 'background.content.light',
    borderRadius: '8px',
  }),
  boxReminder: css.raw({
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '16px',
    padding: '16px',
    borderRadius: '4px',
    backgroundColor: 'background.content.light',
  }),
  boxReserves: css.raw({
    textStyle: 'subline',
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '16px',
    padding: '16px',
    borderRadius: '4px',
    backgroundColor: 'background.content.light',
  }),
  reservesText: css.raw({
    color: 'text.dark',
    marginRight: '4px',
  }),
  amountReserves: css.raw({
    marginLeft: '4px',
    color: 'text.middle',
  }),
  noReserves: css.raw({
    marginTop: '16px',
  }),
};

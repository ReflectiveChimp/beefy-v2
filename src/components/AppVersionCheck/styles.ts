import { sva } from '@styles/css';

export const versionCheckRecipe = sva({
  slots: ['positioner', 'alert', 'message', 'action', 'button'],
  base: {
    positioner: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      padding: '0 16px 16px 16px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 'version',
      pointerEvents: 'none',
      md: {
        padding: '0 32px 32px 32px',
      },
    },
    alert: {
      pointerEvents: 'auto',
      flex: '0 1 auto',
      flexDirection: 'column',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'background.contentDark',
      md: {
        flexDirection: 'row',
      },
    },
    message: {
      flex: '1 1 auto',
    },
    action: {
      flex: '0 0 auto',
      width: '100%',
      md: {
        width: 'auto',
      },
    },
    button: {
      width: '100%',
      md: {
        width: 'auto',
      },
    },
  },
});

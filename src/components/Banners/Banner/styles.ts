import { sva } from '@styles/css';

export const bannerRecipe = sva({
  slots: ['banner', 'box', 'content', 'icon', 'text', 'cross'],
  base: {
    banner: {
      textStyle: 'body-lg-med',
    },
    box: {
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
    },
    content: {
      display: 'flex',
      alignItems: 'flex-start',
      flexGrow: 1,
      justifyContent: 'center',
      gap: '8px',
    },
    icon: {
      flex: 'auto 0 0',
      height: '24px',
      width: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      flexGrow: 1,
    },
    cross: {
      flex: 'auto 0 0',
      fill: 'text.middle',
      cursor: 'pointer',
    },
  },
  variants: {
    variant: {
      info: {
        box: {
          backgroundColor: 'alert.info/15',
        },
      },
      warning: {
        box: {
          backgroundColor: 'alert.warning/15',
        },
      },
      error: {
        box: {
          backgroundColor: 'alert.error/15',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});
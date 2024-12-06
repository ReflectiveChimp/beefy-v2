import { css } from '@repo/styles/css';

export const styles = {
  trigger: css.raw({
    display: 'inline-flex',
  }),
  tooltip: css.raw({
    minWidth: '36px',
    maxWidth: 'min(calc(100% - 16px), 440px)',
    zIndex: 'tooltip', // Modal is 1300
    '&[x-placement*="top"]': {
      marginBottom: '8px',
      '& .tooltipArrow': {
        bottom: '-8px',
        '&::before': {
          borderWidth: '8px 6px 0 6px',
          borderColor: 'currentColor transparent transparent transparent',
        },
      },
    },
    '&[x-placement*="bottom"]': {
      marginTop: '8px',
      '& .tooltipArrow': {
        top: '-8px',
        '&::before': {
          borderWidth: '0 6px 8px 6px',
          borderColor: 'transparent transparent currentColor transparent',
        },
      },
    },
    '&[x-placement*="left"]': {
      marginRight: '8px',
      '& .tooltipArrow': {
        right: '-8px',
        '&::before': {
          borderWidth: '6px 0 6px 8px',
          borderColor: ' transparent transparent transparent currentColor',
        },
      },
    },
    '&[x-placement*="right"]': {
      marginLeft: '8px',
      '& .tooltipArrow': {
        left: '-8px',
        '&::before': {
          borderWidth: '6px 8px 6px 0',
          borderColor: 'transparent currentColor transparent transparent',
        },
      },
    },
    '&[x-placement*="top"], &[x-placement*="bottom"]': {
      '&[x-placement*="-start"] .tooltipContent': {
        marginLeft: '-6px',
      },
      '&[x-placement*="-end"] .tooltipContent': {
        marginRight: '-6px',
      },
    },
    '&[x-placement*="left"], &[x-placement*="right"]': {
      '&[x-placement*="-start"] .tooltipContent': {
        marginTop: '-6px',
      },
      '&[x-placement*="-end"] .tooltipContent': {
        marginBottom: '-6px',
      },
    },
  }),
  arrow: css.raw({
    position: 'absolute',
    zIndex: 'tooltip',
    color: 'var(--tooltip-background-color, white)',
    '&::before': {
      content: '""',
      display: 'block',
      width: '0',
      height: '0',
      borderStyle: 'solid',
    },
  }),
  content: css.raw({
    textStyle: 'body',
    color: 'var(--tooltip-title-color, black)',
    background: 'var(--tooltip-background-color, white)',
    padding:
      'var(--tooltip-content-vertical-padding, 12px) var(--tooltip-content-horizontal-padding, 16px)',
    borderRadius: 'var(--tooltip-content-border-radius, 8px)',
    textAlign: 'left',
    boxShadow: '0px 4px 8px 8px blacko20',
    display: 'flex',
    flexDirection: 'column',
    rowGap: 'var(--tooltip-content-vertical-gap, 8px)',
  }),
  basicTitle: css.raw({
    textStyle: 'body.med',
    fontSize: 'var(--tooltip-body-font-size, {fontSizes.body})',
    color: 'var(--tooltip-title-color, black)',
  }),
  basicContent: css.raw({
    textStyle: 'body',
    fontSize: 'var(--tooltip-body-font-size, {fontSizes.body})',
    color: 'var(--tooltip-content-color, black)',
  }),
  icon: css.raw({
    color: 'var(--tooltip-icon-color, inherit)',
    fontSize: 'var(--tooltip-icon-size, 20px)',
    width: 'var(--tooltip-icon-size, 20px)',
    height: 'var(--tooltip-icon-size, 20px)',
    display: 'block',
  }),
  dark: css.raw({
    '--tooltip-background-color': 'tooltip.dark.background',
    '--tooltip-title-color': 'tooltip.dark.text.title',
    '--tooltip-content-color': 'tooltip.dark.text.content',
    '--tooltip-value-color': 'tooltip.dark.text.item',
    '--tooltip-label-color': 'tooltip.dark.text.label',
    '--tooltip-link-color': 'tooltip.dark.text.link',
  }),
  compact: css.raw({
    '--tooltip-content-vertical-padding': '8px',
    '--tooltip-content-horizontal-padding': '8px',
    '--tooltip-content-vertical-gap': '4px',
    '--tooltip-content-horizontal-gap': '12px',
    '--tooltip-content-border-radius': '4px',
    '--tooltip-body-font-size': 'body.sm',
    '--tooltip-subline-font-size': 'subline.sm',
  }),
};

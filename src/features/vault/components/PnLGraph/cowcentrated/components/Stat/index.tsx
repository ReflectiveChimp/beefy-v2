import { legacyMakeStyles } from '@repo/helpers/mui';
import { css, type CssStyles } from '@repo/styles/css';
import { memo, type ReactNode } from 'react';
import { Tooltip } from '../../../../../../../components/Tooltip';
import { ReactComponent as HelpOutline } from '@repo/images/icons/mui/HelpOutline.svg';

interface StatProps {
  tooltipText: string;
  label: string;
  value0: string;
  value1: string;
  value2?: ReactNode;
  subValue0?: string;
  subValue1?: string;
  subValue2?: ReactNode;
  value2Css?: CssStyles;
}

const styles = {
  container: css.raw({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '16px 24px',
    backgroundColor: 'background.content',
    smDown: {
      padding: '16px',
    },
  }),
  label: css.raw({
    textStyle: 'body.sm.med',
    fontWeight: '700',
    color: 'text.dark',
    textTransform: 'uppercase',
  }),
  value: css.raw({
    textStyle: 'body.med',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    color: 'text.white',
  }),
  subValue: css.raw({
    textStyle: 'body.sm.med',
    color: 'text.light',
  }),
  lastValue: css.raw({
    color: 'text.dark',
  }),
  center: css.raw({
    display: 'flex',
    alignItems: 'center',
  }),
  labelContainer: css.raw({
    display: 'flex',
    alignItems: 'center',
    columnGap: '4px',
    '& svg': {
      color: 'text.dark',
      height: '16px',
      width: '16px',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }),
};
const useStyles = legacyMakeStyles(styles);

export const Stat = memo(function Stat({
  tooltipText,
  label,
  value0,
  value1,
  subValue0,
  subValue1,
  value2,
  subValue2,
  value2Css,
}: StatProps) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.labelContainer}>
        <div className={classes.label}>{label}</div>
        <Tooltip triggerCss={styles.center} content={tooltipText}>
          <HelpOutline />
        </Tooltip>
      </div>
      <div className={classes.value}>
        {value0}
        {subValue0 && <div className={classes.subValue}>{subValue0}</div>}
      </div>
      <div className={classes.value}>
        {value1}
        {subValue1 && <div className={classes.subValue}>{subValue1}</div>}
      </div>
      {value2 && (
        <div className={css(styles.value, styles.lastValue, value2Css)}>
          {value2}
          {subValue2 && <div className={classes.subValue}>{subValue2}</div>}
        </div>
      )}
    </div>
  );
});

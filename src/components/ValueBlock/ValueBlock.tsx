import { memo, type ReactNode } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { css, type CssStyles } from '@repo/styles/css';
import { styles } from './styles';
import { ContentLoading } from '../ContentLoading';
import { Tooltip } from '../Tooltip';
import { ReactComponent as HelpOutline } from '@repo/images/icons/mui/HelpOutline.svg';

const useStyles = legacyMakeStyles(styles);

type ValueBlockProps = {
  label: ReactNode;
  value: ReactNode;
  textContent?: boolean;
  tooltip?: ReactNode;
  usdValue?: ReactNode;
  loading?: boolean;
  blurred?: boolean;
  labelCss?: CssStyles;
  valueCss?: CssStyles;
  priceCss?: CssStyles;
};

export const ValueBlock = memo(function ValueBlock({
  label,
  value,
  textContent = true,
  tooltip,
  usdValue,
  loading = false,
  blurred = false,
  labelCss,
  valueCss,
  priceCss,
}: ValueBlockProps) {
  const classes = useStyles();
  return (
    <>
      <div className={classes.tooltipLabel}>
        <div className={css(styles.label, labelCss)}>{label}</div>
        {!loading && tooltip && (
          <Tooltip content={tooltip} triggerCss={styles.tooltipHolder}>
            <HelpOutline className={classes.tooltipIcon} />
          </Tooltip>
        )}
      </div>
      {textContent ? (
        <div className={css(styles.value, valueCss, blurred && styles.blurred)}>
          {!loading ? <>{blurred ? '....' : value}</> : <ContentLoading />}
        </div>
      ) : !loading ? (
        <>{blurred ? '....' : value}</>
      ) : (
        <div className={classes.noTextContentLoader}>
          <ContentLoading />
        </div>
      )}

      {usdValue && (
        <div className={css(styles.price, priceCss, blurred && styles.blurred)}>
          {!loading ? <>{blurred ? '...' : usdValue}</> : <ContentLoading />}
        </div>
      )}
    </>
  );
});

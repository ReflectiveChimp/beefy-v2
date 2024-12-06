import type { ReactNode } from 'react';
import { memo, useCallback } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { Tooltip, type TooltipProps } from '../Tooltip';
import { css, type CssStyles } from '@repo/styles/css';
import { useBreakpoint } from '../MediaQueries/useBreakpoint';

const useStyles = legacyMakeStyles(styles);

export type VaultLabelledStatProps = {
  label: string;
  showLabel?: boolean;
  tooltip?: ReactNode;
  children: ReactNode;
  css?: CssStyles;
  triggerCss?: CssStyles;
  labelCss?: CssStyles;
  subValue?: ReactNode;
  blur?: boolean;
  boosted?: boolean;
  contentCss?: CssStyles;
};
export const VaultLabelledStat = memo(function VaultLabelledStat({
  label,
  children,
  tooltip,
  showLabel = true,
  css: cssProp,
  triggerCss,
  labelCss,
  subValue,
  blur,
  boosted,
  contentCss,
}: VaultLabelledStatProps) {
  const classes = useStyles();
  const lgUp = useBreakpoint({ from: 'lg' });
  const handleTooltipClick = useCallback<Exclude<TooltipProps['onTriggerClick'], undefined>>(e => {
    // don't bubble up to the link on whole row
    if (e) {
      e.preventDefault();
    }
  }, []);

  return (
    <div className={css(cssProp)}>
      {!lgUp && showLabel ? (
        <div className={classes.label}>
          <div className={css(styles.labelText, labelCss)}>{label}</div>
        </div>
      ) : null}
      {tooltip ? (
        <div className={css(contentCss)}>
          <Tooltip triggerCss={triggerCss} content={tooltip} onTriggerClick={handleTooltipClick}>
            {children}
          </Tooltip>
          {subValue && (
            <div
              className={css(
                styles.subValue,
                blur && styles.blurValue,
                boosted && styles.lineThroughValue
              )}
            >
              {subValue}
            </div>
          )}
        </div>
      ) : (
        <div className={css(contentCss)}>
          <div className={css(triggerCss)}>{children}</div>
          {subValue && (
            <div
              className={css(
                styles.subValue,
                blur && styles.blurValue,
                boosted && styles.lineThroughValue
              )}
            >
              {subValue}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

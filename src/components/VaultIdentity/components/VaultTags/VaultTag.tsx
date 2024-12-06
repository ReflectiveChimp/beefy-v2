import { styles } from './styles';
import { legacyMakeStyles } from '@repo/helpers/mui';
import type { ReactNode } from 'react';
import { forwardRef, memo } from 'react';
import { css, type CssStyles } from '@repo/styles/css';
import type { TooltipProps } from '../../../Tooltip';
import { Tooltip } from '../../../Tooltip';

const useStyles = legacyMakeStyles(styles);

export type VaultTagProps = {
  css?: CssStyles;
  icon?: ReactNode;
  text: ReactNode;
};
export const VaultTag = memo(
  forwardRef<HTMLDivElement, VaultTagProps>(function VaultTag({ icon, text, css: cssProp }, ref) {
    const classes = useStyles();
    return (
      <div className={css(styles.vaultTag, cssProp)} ref={ref}>
        {icon ? <div className={classes.vaultTagIcon}>{icon}</div> : null}
        {text ? <div className={classes.vaultTagText}>{text}</div> : null}
      </div>
    );
  })
);

export type VaultTagWithTooltipProps = VaultTagProps & Omit<TooltipProps, 'children'>;

export const VaultTagWithTooltip = memo(
  forwardRef<HTMLDivElement, VaultTagWithTooltipProps>(function VaultTagWithTooltip(
    { icon, text, css: cssProp, triggerCss, ...rest },
    ref
  ) {
    const classes = useStyles();
    return (
      <Tooltip triggerCss={css.raw(styles.vaultTag, cssProp, triggerCss)} ref={ref} {...rest}>
        {icon ? <div className={classes.vaultTagIcon}>{icon}</div> : null}
        {text ? <div className={classes.vaultTagText}>{text}</div> : null}
      </Tooltip>
    );
  })
);

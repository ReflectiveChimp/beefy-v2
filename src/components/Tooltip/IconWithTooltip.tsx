import { type CSSProperties, type FC, memo, type SVGProps, useMemo } from 'react';
import type { TooltipProps } from './Tooltip';
import { Tooltip } from './Tooltip';
import { ReactComponent as HelpOutline } from '@repo/images/icons/mui/HelpOutline.svg';
import { css, type CssStyles } from '@repo/styles/css';
import { styles } from './styles';

export type IconWithTooltipProps = {
  Icon?: FC<SVGProps<SVGSVGElement>>;
  iconCss?: CssStyles;
  iconSize?: number;
} & Omit<TooltipProps, 'children'>;

export const IconWithTooltip = memo(function IconWithTooltip({
  Icon = HelpOutline,
  iconCss,
  iconSize = 20,
  ...rest
}: IconWithTooltipProps) {
  const style = useMemo(
    () => ({ '--tooltip-icon-size': `${iconSize}px` } as CSSProperties),
    [iconSize]
  );

  return (
    <Tooltip {...rest}>
      <Icon className={css(styles.icon, iconCss)} style={style} />
    </Tooltip>
  );
});

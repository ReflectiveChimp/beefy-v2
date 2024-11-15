import { type ComponentProps, type FC, memo, useMemo } from 'react';
import { Tooltip, type TooltipProps } from './Tooltip';
import { ReactComponent as HelpOutline } from '@repo/images/icons/mui/HelpOutline.svg';
import { css } from '@repo/styles/css';
import { type ColorToken, token } from '@repo/styles/tokens';

export type IconWithTooltipProps = { Icon?: FC<ComponentProps<'svg'>> } & IconVariables &
  Omit<TooltipProps, 'children' | 'asChild' | 'style' | 'className'>;

export const IconWithTooltip = memo<IconWithTooltipProps>(function IconWithTooltip({
  Icon = HelpOutline,
  size = 20,
  color,
  ...rest
}) {
  const styles = useCssVariables({ size, color });
  return (
    <Tooltip {...rest} className={tooltipClasses} style={styles}>
      <Icon className={iconClasses} />
    </Tooltip>
  );
});

const tooltipClasses = css({
  width: 'var(--tooltip-icon-size, 20px)',
  height: 'var(--tooltip-icon-size, 20px)',
  verticalAlign: 'middle',
  display: 'inline-block',
});

type IconVariables = {
  size?: number;
  color?: ColorToken;
};

const iconClasses = css({
  color: 'var(--tooltip-icon-color, inherit)',
  fontSize: 'var(--tooltip-icon-size, 20px)',
  width: 'var(--tooltip-icon-size, 20px)',
  height: 'var(--tooltip-icon-size, 20px)',
});

function useCssVariables({ size = 20, color }: IconVariables) {
  return useMemo(() => {
    const parts: Record<string, string>[] = [];
    if (size !== 20) {
      parts.push({ '--tooltip-icon-size': `${size}px` });
    }
    if (color) {
      parts.push({ '--tooltip-icon-color': token(`colors.${color}`, 'inherit') });
    }
    return parts.length ? parts.reduce((acc, part) => ({ ...acc, ...part }), {}) : undefined;
  }, [size, color]);
}

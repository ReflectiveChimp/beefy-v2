import { type CSSProperties, type FC, memo, type ReactNode, type SVGProps, useMemo } from 'react';
import { ReactComponent as HelpOutline } from '@repo/images/icons/mui/HelpOutline.svg';
import { css, type CssStyles } from '@repo/styles/css';
import { styles } from './styles';
import { TooltipProvider } from './TooltipProvider';
import { TooltipContent } from './TooltipContent';
import { useTooltipContext } from './useTooltipContext';
import type { TooltipOptions } from './types';

export type IconWithTooltipProps = Partial<IconProps> &
  TooltipOptions & {
    content: ReactNode;
  };

export const IconWithTooltip = memo(function IconWithTooltip({
  Icon = HelpOutline,
  iconCss,
  iconSize = 20,
  content,
  ...rest
}: IconWithTooltipProps) {
  return (
    <TooltipProvider {...rest}>
      <TooltipIcon Icon={Icon} iconCss={iconCss} iconSize={iconSize} />
      <TooltipContent>{content}</TooltipContent>
    </TooltipProvider>
  );
});

type IconProps = {
  Icon: FC<SVGProps<SVGSVGElement>>;
  iconCss: CssStyles;
  iconSize: number;
};

const TooltipIcon = memo(function TooltipIcon({
  Icon = HelpOutline,
  iconCss,
  iconSize = 20,
}: IconProps) {
  const { getReferenceProps, refs } = useTooltipContext();
  const style = useMemo(
    () => ({ '--tooltip-icon-size': `${iconSize}px` } as CSSProperties),
    [iconSize]
  );
  return (
    <Icon
      {...getReferenceProps()}
      ref={refs.setReference}
      className={css(styles.icon, iconCss)}
      style={style}
    />
  );
});

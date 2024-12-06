import { memo } from 'react';
import type { BasicTooltipContentProps } from './BasicTooltipContent';
import { BasicTooltipContent } from './BasicTooltipContent';
import { IconWithTooltip, type IconWithTooltipProps } from './IconWithTooltip';

export type IconWithBasicTooltipProps = BasicTooltipContentProps &
  Omit<IconWithTooltipProps, 'title' | 'content'>;

export const IconWithBasicTooltip = memo(function IconWithBasicTooltip({
  title,
  content,
  ...rest
}: IconWithBasicTooltipProps) {
  return (
    <IconWithTooltip content={<BasicTooltipContent title={title} content={content} />} {...rest} />
  );
});

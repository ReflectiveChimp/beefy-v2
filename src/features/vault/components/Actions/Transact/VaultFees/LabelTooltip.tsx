import { memo } from 'react';
import type { BasicTooltipContentProps } from '../../../../../../components/Tooltip/BasicTooltipContent';
import { BasicTooltipContent } from '../../../../../../components/Tooltip/BasicTooltipContent';
import type { IconWithTooltipProps } from '../../../../../../components/Tooltip';
import { IconWithTooltip } from '../../../../../../components/Tooltip';

export type LabelTooltipProps = BasicTooltipContentProps;

export const LabelTooltip = memo<LabelTooltipProps>(function LabelTooltip({ title, content }) {
  return (
    <IconWithTooltip size={16} content={<BasicTooltipContent title={title} content={content} />} />
  );
});

export type LabelCustomTooltipProps = Omit<IconWithTooltipProps, 'triggerClass'>;

export const LabelCustomTooltip = memo<LabelCustomTooltipProps>(function LabelCustomTooltip(props) {
  return <IconWithTooltip size={16} {...props} />;
});

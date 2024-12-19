import { memo } from 'react';
import type { BasicTooltipContentProps } from '../../../../../../components/Tooltip/BasicTooltipContent';
import { BasicTooltipContent } from '../../../../../../components/Tooltip/BasicTooltipContent';
import type { IconWithTooltipProps } from '../../../../../../components/Tooltip';
import { IconWithTooltip } from '../../../../../../components/Tooltip';
import { css } from '@repo/styles/css';

const triggerCss = css.raw({
  width: '16px',
  height: '16px',
  margin: '0',
  verticalAlign: 'middle',
  display: 'inline-block',
  '& svg': {
    width: '16px',
    height: '16px',
  },
});

export type LabelTooltipProps = BasicTooltipContentProps;

export const LabelTooltip = memo(function LabelTooltip({ title, content }: LabelTooltipProps) {
  return (
    <IconWithTooltip
      iconCss={triggerCss}
      content={<BasicTooltipContent title={title} content={content} />}
    />
  );
});

export type LabelCustomTooltipProps = Omit<IconWithTooltipProps, 'triggerCss'>;

export const LabelCustomTooltip = memo(function LabelCustomTooltip(props: LabelCustomTooltipProps) {
  return <IconWithTooltip iconCss={triggerCss} {...props} />;
});

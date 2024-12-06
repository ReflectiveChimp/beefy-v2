import type { ReactNode } from 'react';
import { memo } from 'react';
import { styles } from './styles';
import { legacyMakeStyles } from '@repo/helpers/mui';

const useStyles = legacyMakeStyles(styles);

export type BasicTooltipContentProps = {
  title: string;
  content?: ReactNode;
};
export const BasicTooltipContent = memo(function BasicTooltipContent({
  title,
  content,
}: BasicTooltipContentProps) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.basicTitle}>{title}</div>
      {content ? <div className={classes.basicContent}>{content}</div> : null}
    </>
  );
});

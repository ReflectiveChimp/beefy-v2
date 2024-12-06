import type { PropsWithChildren } from 'react';
import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

export type CardSuperTitleProps = PropsWithChildren<{
  text: string;
}>;
export const CardSuperTitle = memo(function CardSuperTitle({ text }: CardSuperTitleProps) {
  const classes = useStyles();

  return <div className={classes.supertitle}>{text}</div>;
});

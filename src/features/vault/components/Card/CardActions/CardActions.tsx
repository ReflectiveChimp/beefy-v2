import type { ReactNode } from 'react';
import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { LinkButton } from '../../../../../components/LinkButton';

const useStyles = legacyMakeStyles(styles);

export type CardActionsProps = {
  children: ReactNode;
};

export const CardActions = memo(function CardActions({ children }: CardActionsProps) {
  const classes = useStyles();

  return <div className={classes.actions}>{children}</div>;
});

export type CardActionProps = {
  type: 'code' | 'link';
  href: string;
  text: string;
};
export const CardAction = memo(function CardAction({ type, href, text }: CardActionProps) {
  return <LinkButton type={type} href={href} text={text} />;
});

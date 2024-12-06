import type { FC } from 'react';
import { styles } from './styles';
import type { SimpleLinkButtonProps } from './SimpleLinkButtonProps';
import { legacyMakeStyles } from '@repo/helpers/mui';

const useStyles = legacyMakeStyles(styles);

export const SimpleLinkButton: FC<SimpleLinkButtonProps> = ({ href, text, IconComponent }) => {
  const classes = useStyles();
  return (
    <a className={classes.link} href={href} target="_blank" rel="noopener noreferrer">
      {IconComponent ? <IconComponent className={classes.icon} /> : null}
      {text}
    </a>
  );
};

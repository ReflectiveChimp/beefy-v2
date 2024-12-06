import { memo, type ReactNode } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { ReactComponent as OpenInNewRoundedIcon } from '@repo/images/icons/mui/OpenInNewRounded.svg';

const useStyles = legacyMakeStyles(styles);

export type ExternalLinkProps = {
  href: string;
  icon?: boolean;
  css?: CssStyles;
  children: ReactNode;
};

export const ExternalLink = memo(function ExternalLink({
  href,
  icon,
  css: cssProp,
  children,
}: ExternalLinkProps) {
  const classes = useStyles();
  return (
    <a className={css(styles.link, cssProp)} href={href} target="_blank" rel="noreferrer">
      {children}
      {icon ? <OpenInNewRoundedIcon width={16} height={16} className={classes.icon} /> : null}
    </a>
  );
});

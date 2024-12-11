import type { FC } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { ReactComponent as OpenInNewRoundedIcon } from '@repo/images/icons/mui/OpenInNewRounded.svg';
import { ReactComponent as CodeRoundedIcon } from '@repo/images/icons/mui/CodeRounded.svg';
import { ReactComponent as InsertIcon } from '@repo/images/icons/mui/InsertLink.svg';
import type { LinkButtonProps } from './LinkButtonProps';
import { css } from '@repo/styles/css';
import { useBreakpoint } from '../MediaQueries/useBreakpoint';

const useStyles = legacyMakeStyles(styles);

export const LinkButton: FC<LinkButtonProps> = ({
  href,
  text,
  type,
  hideIconOnMobile,
  css: cssProp,
}) => {
  const classes = useStyles();
  const mobileView = useBreakpoint({ to: 'sm' });

  const shouldHideIcon = hideIconOnMobile && mobileView;
  return (
    <a className={css(cssProp, styles.link)} href={href} target="_blank" rel="noopener">
      {type === 'code' && <CodeRoundedIcon fontSize="inherit" className={classes.icon} />}
      {type === 'link' && <InsertIcon fontSize="inherit" className={classes.icon} />}
      <span>{text}</span>
      {shouldHideIcon !== true && <OpenInNewRoundedIcon className={classes.icon} />}
    </a>
  );
};

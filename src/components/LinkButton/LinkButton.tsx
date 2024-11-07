import type { FC } from 'react';
import type { Theme } from '@material-ui/core';
import { makeStyles, useMediaQuery } from '@material-ui/core';
import { styles } from './styles';
import { ReactComponent as OpenInNewRoundedIcon } from '@repo/images/icons/mui/OpenInNewRounded.svg';
import { ReactComponent as CodeRoundedIcon } from '@repo/images/icons/mui/CodeRounded.svg';
import { ReactComponent as InsertIcon } from '@repo/images/icons/mui/InsertLink.svg';
import type { LinkButtonProps } from './LinkButtonProps';
import clsx from 'clsx';

const useStyles = makeStyles(styles);

export const LinkButton: FC<LinkButtonProps> = ({
  href,
  text,
  type,
  hideIconOnMobile,
  className,
}) => {
  const classes = useStyles();

  const mobileView = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'), { noSsr: true });

  const shouldHideIcon = hideIconOnMobile && mobileView;
  return (
    <a className={clsx(className, classes.link)} href={href} target="_blank" rel="noopener">
      {type === 'code' && <CodeRoundedIcon fontSize="inherit" className={classes.icon} />}
      {type === 'link' && <InsertIcon fontSize="inherit" className={classes.icon} />}
      <span>{text}</span>
      {shouldHideIcon !== true && (
        <OpenInNewRoundedIcon fontSize="inherit" className={classes.icon} />
      )}
    </a>
  );
};

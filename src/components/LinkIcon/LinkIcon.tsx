import type { FC, SVGProps } from 'react';
import { makeStyles } from '@material-ui/core';
import { styles } from './styles';

const useStyles = makeStyles(styles);

interface LinkIconProps {
  logo: string | FC<SVGProps<SVGSVGElement>>;
  alt: string;
  href: string;
}

export const LinkIcon: FC<LinkIconProps> = ({ href, logo, alt }) => {
  const classes = useStyles();
  const IconComponent = typeof logo === 'string' ? 'img' : logo;

  return (
    <a className={classes.link} href={href} target="_blank" rel="noopener noreferrer">
      {typeof logo === 'string' ? (
        <img alt={alt} className={classes.icon} src={logo} />
      ) : (
        <IconComponent className={classes.svgIcon} />
      )}
    </a>
  );
};

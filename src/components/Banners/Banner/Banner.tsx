import { memo } from 'react';
import { ReactComponent as Clear } from '@repo/images/icons/mui/Clear.svg';
import { bannerRecipe } from './styles';
import type { BannerProps } from './types';

export const Banner = memo(function Banner({
  icon,
  text,
  onClose,
  variant = 'info',
  children,
}: BannerProps) {
  const classes = bannerRecipe({ variant });

  return (
    <div className={classes.banner}>
      <div className={classes.box}>
        <div className={classes.content}>
          {icon ? <div className={classes.icon}>{icon}</div> : null}
          <div className={classes.text}>{text}</div>
        </div>
        {onClose ? <Clear onClick={onClose} className={classes.cross} /> : null}
      </div>
      {children}
    </div>
  );
});

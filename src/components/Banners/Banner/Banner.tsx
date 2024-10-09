import { memo } from 'react';
import { Clear } from '@material-ui/icons';
import clsx from 'clsx';
import { bannerRecipe } from './styles';
import type { BannerProps } from './types';

export const Banner = memo<BannerProps>(function Banner({
  icon,
  text,
  onClose,
  variant = 'info',
  className,
}) {
  const classes = bannerRecipe({ variant });

  return (
    <div className={clsx(classes.banner, className)}>
      <div className={classes.box}>
        <div className={classes.content}>
          {icon ? <div className={classes.icon}>{icon}</div> : null}
          <div className={classes.text}>{text}</div>
        </div>
        {onClose ? <Clear onClick={onClose} className={classes.cross} /> : null}
      </div>
    </div>
  );
});

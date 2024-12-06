import { memo } from 'react';
import { ReactComponent as Clear } from '@repo/images/icons/mui/Clear.svg';
import { bannerRecipe } from './styles';
import type { BannerProps } from './types';

export const Banner = memo<BannerProps>(function Banner({ icon, text, onClose, variant = 'info' }) {
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
    </div>
  );
});

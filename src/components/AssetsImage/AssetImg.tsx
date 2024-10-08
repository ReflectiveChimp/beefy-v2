import { css } from '@styles/css';
import { memo } from 'react';
import clsx from 'clsx';

const baseClass = css({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block',
});

type AssetImgProps = {
  src: string;
  className?: string;
};

export const AssetImg = memo<AssetImgProps>(function AssetImg({ src, className }) {
  return (
    <img
      src={src}
      alt=""
      role="presentation"
      className={clsx(baseClass, className)}
      width={48}
      height={48}
    />
  );
});

import { memo } from 'react';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { defaultSize } from '../AssetsImage/config';

export type IconLoaderProps = {
  size?: number;
  css?: CssStyles;
};

export const IconLoader = memo<IconLoaderProps>(function IconLoader({
  size = defaultSize,
  css: cssProp,
}) {
  return (
    <div
      className={css(styles.holder, cssProp)}
      style={size !== defaultSize ? { width: size, height: size } : undefined}
    />
  );
});

import { memo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { styles } from './styles';
import { defaultSize } from '../AssetsImage/config';

const useStyles = makeStyles(styles);

export type IconLoaderProps = {
  size?: number;
  className?: string;
};

export const IconLoader = memo<IconLoaderProps>(function IconLoader({
  size = defaultSize,
  className,
}) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.holder, className)}
      style={size !== defaultSize ? { width: size, height: size } : undefined}
    />
  );
});

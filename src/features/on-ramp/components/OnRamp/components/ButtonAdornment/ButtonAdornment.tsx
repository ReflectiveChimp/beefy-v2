import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import { styles } from './styles';
import clsx from 'clsx';
import { ReactComponent as ChevronRight } from '@repo/images/icons/mui/ChevronRight.svg';

const useStyles = makeStyles(styles);

export type ButtonAdornmentProps = {
  children: ReactNode;
  onClick?: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >['onClick'];
  className?: string;
};
export const ButtonAdornment = memo<ButtonAdornmentProps>(function ButtonAdornment({
  children,
  onClick,
  className,
}) {
  const classes = useStyles();

  return (
    <button className={clsx(classes.button, className)} onClick={onClick}>
      {children}
      <ChevronRight className={classes.arrow} />
    </button>
  );
});

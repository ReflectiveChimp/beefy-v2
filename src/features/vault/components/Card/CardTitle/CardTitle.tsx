import type { FC } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import type { CardTitleProps } from './CardTitleProps';
import { css } from '@repo/styles/css';
import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

export const CardTitle: FC<CardTitleProps> = ({ title, subtitle, titleCss }) => {
  const classes = useStyles();

  return (
    <>
      {typeof title === 'object' ? (
        <>{title}</>
      ) : (
        <h2 className={css(styles.title, titleCss)}>{title}</h2>
      )}
      {subtitle && <div className={classes.subtitle}>{subtitle}</div>}
    </>
  );
};

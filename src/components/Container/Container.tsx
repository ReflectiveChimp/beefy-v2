import { css, type CssStyles } from '@repo/styles/css';
import { memo, type ReactNode } from 'react';

const styles = {
  root: css.raw({
    width: '100%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingInline: '24px',
  }),
  'width-xl': css.raw({}),
  'width-lg': css.raw({
    lg: {
      maxWidth: '1296px',
    },
  }),
  'width-md': css.raw({
    md: {
      maxWidth: '960px',
    },
  }),
  'width-sm': css.raw({
    sm: {
      maxWidth: '600px',
    },
  }),
  'width-xs': css.raw({
    maxWidth: '444px',
  }),
};

interface ContainerProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  css?: CssStyles;
}

export const Container = memo(function Container({
  maxWidth = 'xl',
  children,
  css: cssProp,
}: ContainerProps) {
  return <div className={css(styles.root, cssProp, styles[`width-${maxWidth}`])}>{children}</div>;
});

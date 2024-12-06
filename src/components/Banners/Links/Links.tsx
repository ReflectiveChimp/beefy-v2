import { memo, type ReactNode } from 'react';
import { styles } from './styles';
import { Link } from 'react-router-dom';
import { css, type CssStyles } from '@repo/styles/css';

type CommonLinkProps = {
  children?: ReactNode;
  css?: CssStyles;
};

export type InternalLinkProps = {
  to: string;
} & CommonLinkProps;

export const InternalLink = memo(function InternalLink({
  to,
  children,
  css: cssProp,
}: InternalLinkProps) {
  return (
    <Link to={to} className={css(styles.link, cssProp)}>
      {children}
    </Link>
  );
});

export type ExternalLinkProps = {
  href: string;
} & CommonLinkProps;

export const ExternalLink = memo(function ExternalLink({
  href,
  children,
  css: cssProp,
}: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener" className={css(styles.link, cssProp)}>
      {children}
    </a>
  );
});

export type ButtonLinkProps = {
  onClick: () => void;
} & CommonLinkProps;

export const ButtonLink = memo(function ButtonLink({
  onClick,
  children,
  css: cssProp,
}: ButtonLinkProps) {
  return (
    <span onClick={onClick} className={css(styles.link, cssProp)}>
      {children}
    </span>
  );
});

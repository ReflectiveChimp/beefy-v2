import { type FunctionComponent, memo, type SVGProps } from 'react';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';

export type IconButtonLinkProps = {
  href: string;
  text: string;
  Icon: FunctionComponent<
    SVGProps<SVGSVGElement> & {
      title?: string;
    }
  >;
  css?: CssStyles;
  textCss?: CssStyles;
  iconCss?: CssStyles;
};

export const IconButtonLink = memo(function IconButtonLink({
  href,
  text,
  Icon,
  css: cssProp,
  textCss,
  iconCss,
}: IconButtonLinkProps) {
  return (
    <a
      className={css(styles.link, cssProp)}
      href={href}
      target="_blank"
      title={text}
      rel="noopener noreferrer"
    >
      <Icon className={css(styles.icon, iconCss)} />
      <span className={css(styles.text, textCss)}>{text}</span>
    </a>
  );
});

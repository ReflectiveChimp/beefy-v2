import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { ReactComponent as ArrowDown } from '../../../../../../images/icons/arrowDown.svg';
import { css, type CssStyles } from '@repo/styles/css';

const useStyles = legacyMakeStyles(styles);

export type QuoteDownArrowProps = {
  css?: CssStyles;
};
export const QuoteArrowDivider = memo(function QuoteArrowDivider({
  css: cssProp,
}: QuoteDownArrowProps) {
  const classes = useStyles();
  return (
    <div className={css(styles.holder, cssProp)}>
      <ArrowDown className={classes.arrow} />
    </div>
  );
});

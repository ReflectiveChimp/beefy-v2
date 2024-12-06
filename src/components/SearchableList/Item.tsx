import type { FC } from 'react';
import { memo, useCallback } from 'react';
import type { ItemInnerProps } from './ItemInner';
import { ItemInner } from './ItemInner';
import { css, type CssStyles, cx } from '@repo/styles/css';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { itemStyles } from './styles';
import { ReactComponent as ChevronRight } from '@repo/images/icons/mui/ChevronRight.svg';

const useStyles = legacyMakeStyles(itemStyles);

type ItemProps = {
  css?: CssStyles;
  value: string;
  onSelect: (value: string) => void;
  EndAdornmentComponent?: FC<ItemInnerProps> | null;
  ItemInnerComponent?: FC<ItemInnerProps>;
};
export const Item = memo(function Item({
  value,
  onSelect,
  ItemInnerComponent = ItemInner,
  EndAdornmentComponent,
  css: cssProp,
}: ItemProps) {
  const classes = useStyles();
  const handleClick = useCallback(() => {
    onSelect(value);
  }, [value, onSelect]);

  return (
    <button onClick={handleClick} className={css(itemStyles.item, cssProp)}>
      <ItemInnerComponent value={value} />
      <div className={classes.endAdornment}>
        {EndAdornmentComponent && <EndAdornmentComponent value={value} />}
        <ChevronRight className={cx('item-arrow', css(itemStyles.arrow))} />
      </div>
    </button>
  );
});

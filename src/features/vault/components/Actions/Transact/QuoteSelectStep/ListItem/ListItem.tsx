import { memo, useCallback, useMemo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { css, type CssStyles, cx } from '@repo/styles/css';
import { ReactComponent as ChevronRight } from '@repo/images/icons/mui/ChevronRight.svg';
import { ListJoin } from '../../../../../../../components/ListJoin';
import { useAppSelector } from '../../../../../../../store';
import { selectTransactQuoteById } from '../../../../../../data/selectors/transact';
import { QuoteTitle } from '../../QuoteTitle';
import { TokenAmountFromEntity } from '../../../../../../../components/TokenAmount';

const useStyles = legacyMakeStyles(styles);

export type ListItemProps = {
  quoteId: string;
  onSelect: (id: string) => void;
  css?: CssStyles;
};
export const ListItem = memo(function ListItem({ quoteId, css: cssProp, onSelect }: ListItemProps) {
  const classes = useStyles();
  const quote = useAppSelector(state => selectTransactQuoteById(state, quoteId));
  const handleClick = useCallback(() => onSelect(quoteId), [onSelect, quoteId]);
  const outputs = useMemo(
    () =>
      quote.outputs.map(output => (
        <TokenAmountFromEntity token={output.token} amount={output.amount} key={output.token.id} />
      )),
    [quote]
  );

  return (
    <button className={css(styles.item, cssProp)} onClick={handleClick}>
      <QuoteTitle quote={quote} css={styles.provider} />
      <div className={classes.output}>
        <ListJoin items={outputs} />
      </div>
      <ChevronRight className={cx('item-arrow', classes.arrow)} />
    </button>
  );
});

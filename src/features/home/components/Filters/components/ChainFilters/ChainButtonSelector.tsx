import type { FC, SVGProps } from 'react';
import { memo, useCallback } from 'react';
import type { ChainEntity } from '../../../../../data/entities/chain';
import { selectActiveChainIds, selectChainById } from '../../../../../data/selectors/chains';
import { Tooltip } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { css, type CssStyles, cx } from '@repo/styles/css';
import { useAppSelector } from '../../../../../../store';
import { NewBadge } from '../../../../../../components/Header/components/Badges/NewBadge';

const useStyles = legacyMakeStyles(styles);
const networkIcons = import.meta.glob<FC<SVGProps<SVGSVGElement>>>(
  '../../../../../../images/networks/*.svg',
  {
    eager: true,
    import: 'ReactComponent',
  }
);

type ChainButtonProps = {
  id: ChainEntity['id'];
  selected: boolean;
  onChange: (selected: boolean, id: ChainEntity['id']) => void;
};
const ChainButton = memo(function ChainButton({ id, selected, onChange }: ChainButtonProps) {
  const classes = useStyles();
  const chain = useAppSelector(state => selectChainById(state, id));
  const handleChange = useCallback(() => {
    onChange(!selected, id);
  }, [id, selected, onChange]);
  const Icon: FC<SVGProps<SVGSVGElement>> =
    networkIcons[`../../../../../../images/networks/${id}.svg`];

  return (
    <Tooltip
      disableFocusListener
      disableTouchListener
      title={chain.name}
      placement="top-start"
      classes={{ tooltip: classes.tooltip }}
    >
      <button onClick={handleChange} className={css(styles.button, selected && styles.selected)}>
        {chain.new ? <NewBadge css={styles.badge} /> : null}
        <Icon
          className={cx(classes.icon, !selected && classes.unselectedIcon)}
          width={24}
          height={24}
        />
      </button>
    </Tooltip>
  );
});

export type ChainButtonSelectorProps = {
  selected: ChainEntity['id'][];
  onChange: (selected: ChainEntity['id'][]) => void;
  css?: CssStyles;
};
export const ChainButtonSelector = memo(function ChainButtonSelector({
  selected,
  onChange,
  css: cssProp,
}: ChainButtonSelectorProps) {
  const chainIds = useAppSelector(selectActiveChainIds);
  const handleChange = useCallback(
    (isSelected, id) => {
      if (isSelected) {
        if (!selected.includes(id)) {
          const newSelected = [...selected, id];
          // if all selected, return empty array to represent not-filtered
          onChange(newSelected.length < chainIds.length ? newSelected : []);
        }
      } else if (!isSelected) {
        if (selected.length === 0) {
          // special handling:
          // first chain unselected should be treated as unselecting all other chains instead
          onChange([id]);
        } else if (selected.includes(id)) {
          onChange(selected.filter(selectedId => selectedId !== id));
        }
      }
    },
    [chainIds, selected, onChange]
  );

  return (
    <div className={css(styles.selector, cssProp)}>
      {chainIds.map(id => (
        <ChainButton
          key={id}
          id={id}
          selected={selected.length === 0 || selected.includes(id)}
          onChange={handleChange}
        />
      ))}
    </div>
  );
});

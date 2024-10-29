import type { FC, SVGProps } from 'react';
import { memo, useCallback } from 'react';
import type { ChainEntity } from '../../../../../data/entities/chain';
import { selectActiveChainIds, selectChainById } from '../../../../../data/selectors/chains';
import { makeStyles } from '@material-ui/core';
import { styles } from './styles';
import clsx from 'clsx';
import { useAppSelector } from '../../../../../../store';
import { ChainNewBadge } from './ChainNewBadge';
import { Tooltip } from '../../../../../../components/Tooltip';
import { styled } from '@repo/styles/jsx';
import { cva } from '@repo/styles/css';

const useStyles = makeStyles(styles);
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
const ChainButton = memo<ChainButtonProps>(function ChainButton({ id, selected, onChange }) {
  const chain = useAppSelector(state => selectChainById(state, id));
  const handleChange = useCallback(() => {
    onChange(!selected, id);
  }, [id, selected, onChange]);
  const Icon: FC<SVGProps<SVGSVGElement>> =
    networkIcons[`../../../../../../images/networks/${id}.svg`];

  return (
    <Tooltip content={chain.name} placement="top" dark={true} onClick={handleChange} asChild={true}>
      <StyledButton onClick={handleChange} selected={selected}>
        {chain.new ? <ChainNewBadge /> : null}
        <Icon className={iconRecipe({ selected })} width={24} height={24} />
      </StyledButton>
    </Tooltip>
  );
});

const iconRecipe = cva({
  base: {},
  variants: {
    selected: {
      true: {},
      false: {
        '& .bg': {
          fill: '#2E324C',
        },
        '& .fg': {
          fill: 'background.body',
        },
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
});

const StyledButton = styled('button', {
  base: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 0,
    paddingBlock: '6px',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute' as const,
      top: '50%',
      left: '-1px',
      marginTop: '-10px',
      height: '20px',
      width: '1px',
      backgroundColor: 'background.border',
    },
    '&:first-child::before': {
      display: 'none',
    },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: 'background.contentDark',
      },
    },
  },
});

export type ChainButtonSelectorProps = {
  selected: ChainEntity['id'][];
  onChange: (selected: ChainEntity['id'][]) => void;
  className?: string;
};
export const ChainButtonSelector = memo<ChainButtonSelectorProps>(function ChainButtonSelector({
  selected,
  onChange,
  className,
}) {
  const classes = useStyles();
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
    <div className={clsx(classes.selector, className)}>
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

import { cva } from '@repo/styles/css';
import type { ChainEntity } from '../../../../../data/entities/chain';
import { type FC, memo, type SVGProps, useCallback } from 'react';
import { useAppSelector } from '../../../../../../store';
import { selectChainById } from '../../../../../data/selectors/chains';
import { Tooltip } from '../../../../../../components/Tooltip';
import { ChainNewBadge } from './ChainNewBadge';
import { styled } from '@repo/styles/jsx';

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

export const ChainButton = memo<ChainButtonProps>(function ChainButton({ id, selected, onChange }) {
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

import { memo, type MouseEvent, useCallback } from 'react';
import { useAppSelector } from '../../../../store';
import { selectVaultExistsById } from '../../../../features/data/selectors/vaults';
import { Tokens } from './Tokens';
import { PricePerFullShare } from './PricePerFullShare';
import { styled } from '@repo/styles/jsx';

import { FloatingDropdown } from '../../../Floating/FloatingDropdown';

type PricesDropdownProps = {
  setOpen: (setter: boolean | ((open: boolean) => boolean)) => void;
};

export const PricesDropdown = memo(function PricesDropdown({ setOpen }: PricesDropdownProps) {
  const vaultLoaded = useAppSelector(state => selectVaultExistsById(state, 'bifi-vault'));
  const handleClick = useCallback<(e: MouseEvent<HTMLDivElement>) => void>(
    e => {
      // this is a hack to make the dropdown close when a button/link is clicked
      if (['a', 'button', 'path', 'svg', 'img'].includes(e.target?.['tagName']?.toLowerCase())) {
        setOpen(false);
      }
    },
    [setOpen]
  );

  return (
    <Dropdown dark onClick={handleClick}>
      <Tokens />
      {vaultLoaded ? <PricePerFullShare /> : null}
    </Dropdown>
  );
});

const Dropdown = styled(FloatingDropdown, {
  base: {
    zIndex: 'dropdown',
    maxWidth: 'min(calc(100vw - 16px), 440px)',
    color: 'tooltip.light.text',
    backgroundColor: 'tooltip.light.background',
    paddingInline: '16px', // todo token
    paddingBlock: '12px', // todo token
    borderRadius: '8px', // todo token
    textAlign: 'left',
    boxShadow: '0px 4px 8px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  variants: {
    dark: {
      true: {
        backgroundColor: 'tooltip.dark.background',
        color: 'tooltip.dark.text',
      },
    },
    compact: {
      true: {
        paddingInline: '8px', // todo token
        paddingBlock: '8px', // todo token
        borderRadius: '4px', // todo token
      },
    },
  },
});

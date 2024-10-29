import { memo, useState } from 'react';
import { PricesDropdown } from './PricesDropdown';
import { PricesButton } from './PricesButton';
import { css } from '@repo/styles/css';
import { FloatingProvider } from '../../../Floating/FloatingProvider';

export const Prices = memo(function Prices() {
  const [open, setOpen] = useState(false);

  return (
    <FloatingProvider
      open={open}
      onChange={setOpen}
      placement="bottom-end"
      role="dialog"
      arrow={css({ fill: 'tooltip.dark.background' })}
    >
      <PricesButton />
      {open && <PricesDropdown setOpen={setOpen} />}
    </FloatingProvider>
  );
});

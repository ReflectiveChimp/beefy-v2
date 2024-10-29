import { memo, useEffect, useState } from 'react';
import { tokens } from './Tokens';
import { TokenPrice } from './TokenPrice';
import { styled } from '@repo/styles/jsx';

import { FloatingButtonTrigger } from '../../../Floating/FloatingTriggers';

export const PricesButton = memo(function PricesButton() {
  const [current, setCurrent] = useState(0);
  const next = current < tokens.length - 1 ? current + 1 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(i => (i < tokens.length - 1 ? i + 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, [setCurrent]);

  return (
    <Trigger>
      {tokens.map((token, i) => (
        <TokenPrice
          key={i}
          token={token}
          mode={i === current ? 'current' : i === next ? 'next' : 'hidden'}
        />
      ))}
    </Trigger>
  );
});

const Trigger = styled(
  FloatingButtonTrigger,
  {
    base: {
      cursor: 'pointer',
      userSelect: 'none',
      position: 'relative',
      width: '68px',
      height: '24px',
    },
  },
  {
    defaultProps: {
      type: 'button',
    },
  }
);

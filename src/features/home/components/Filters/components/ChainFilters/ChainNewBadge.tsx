import { styled } from '@styles/jsx';
import { NewBadge } from '../../../../../../components/Badges/NewBadge';

export const ChainNewBadge = styled(NewBadge, {
  variants: {
    mobile: {
      false: {
        position: 'absolute',
        top: '-4px',
        right: '-8px',
        transform: 'translate(0, -50%)',
        zIndex: 1,
      },
      true: {
        marginLeft: '8px',
      },
    },
  },
  defaultVariants: {
    mobile: false,
  },
});

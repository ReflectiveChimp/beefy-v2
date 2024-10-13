import { styled } from '@styles/jsx';

export const NotificationDot = styled('div', {
  base: {
    backgroundColor: 'indicators.error',
    padding: '0',
    borderRadius: '100%',
    height: '8px',
    width: '8px',
    position: 'absolute',
    top: '4px',
    right: '0',
    transform: 'translate(50%, -50%)',
    pointerEvents: 'none',
  },
});

import { memo } from 'react';
import type { BadgeComponentProps } from './types';
import { css } from '@repo/styles/css';

const badgeCss = css.raw({
  textStyle: 'body.sm',
  backgroundColor: 'indicators.error',
  color: 'text.light',
  padding: '0',
  borderRadius: '100%',
  height: '8px',
  width: '8px',
  position: 'absolute',
  top: '4px',
  right: '0',
  transform: 'translate(50%, -50%)',
  pointerEvents: 'none',
});

export const NotificationDot = memo(function NewBadge({ css: cssProp }: BadgeComponentProps) {
  return <div className={css(badgeCss, cssProp)} />;
});

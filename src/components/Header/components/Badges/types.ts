import type { FC } from 'react';
import { type CssStyles } from '@repo/styles/css';

export type BadgeComponentProps = {
  css?: CssStyles;
  spacer?: boolean;
};

export type BadgeComponent = FC<BadgeComponentProps>;

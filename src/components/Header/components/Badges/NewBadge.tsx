import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { useTranslation } from 'react-i18next';
import type { BadgeComponentProps } from './types';
import { css } from '@repo/styles/css';

const styles = {
  badge: css.raw({
    textStyle: 'body.sm',
    backgroundColor: 'green',
    color: 'background.header',
    padding: '0px 6px',
    borderRadius: '10px',
    height: '20px',
    position: 'absolute',
    top: '-2px',
    right: '0',
    transform: 'translate(50%, -50%)',
    pointerEvents: 'none',
  }),
  spacer: css.raw({
    width: '12px',
    pointerEvents: 'none',
  }),
};
const useStyles = legacyMakeStyles(styles);

export const NewBadge = memo(function NewBadge({
  css: cssProp,
  spacer = true,
}: BadgeComponentProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <>
      {spacer === false ? null : <div className={classes.spacer} />}
      <div className={css(styles.badge, cssProp)}>{t('Header-Badge-New')}</div>
    </>
  );
});

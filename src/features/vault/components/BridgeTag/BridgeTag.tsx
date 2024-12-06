import { legacyMakeStyles } from '@repo/helpers/mui';
import type { MouseEventHandler, ReactNode } from 'react';
import { forwardRef, memo, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import type { BridgeEntity } from '../../../data/entities/bridge';
import { css, type CssStyles } from '@repo/styles/css';
import type { TooltipProps } from '../../../../components/Tooltip';
import { Tooltip } from '../../../../components/Tooltip';
import { getAssetBridgeIcon } from '../../../../helpers/assetBridgeSrc';
import type { ChainEntity } from '../../../data/entities/chain';
import { getNetworkSrc } from '../../../../helpers/networkSrc';
import { styles } from './styles';
import { TRIGGERS } from '../../../../components/Tooltip/constants';

const useStyles = legacyMakeStyles(styles);

export type NativeTagProps = {
  chain: ChainEntity;
  css?: CssStyles;
};

export const NativeTag = memo(function NativeTag({ chain, css: cssProp }: NativeTagProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const icon = getNetworkSrc(chain.id);

  return (
    <TagWithTooltip content={<NativeTooltip chain={chain} />} css={cssProp}>
      {icon ? <img src={icon} alt={chain.name} className={classes.icon} width={24} /> : null}
      {t('TokenBridge-native')}
    </TagWithTooltip>
  );
});

export type BridgeTagProps = {
  bridge: BridgeEntity;
  chain: ChainEntity;
  css?: CssStyles;
};
export const BridgeTag = memo(function BridgeTag({ bridge, chain, css: cssProp }: BridgeTagProps) {
  const classes = useStyles();
  const icon = bridge.id.includes('canonical')
    ? getNetworkSrc(chain.id)
    : getAssetBridgeIcon(bridge.id);

  return (
    <TagWithTooltip content={<BridgeTooltip bridge={bridge} chain={chain} />} css={cssProp}>
      {icon ? <img src={icon} alt={bridge.name} className={classes.icon} width={24} /> : null}
      {bridge.tagName}
    </TagWithTooltip>
  );
});

export type NativeTooltipProps = {
  chain: ChainEntity;
};
const NativeTooltip = memo(function NativeTooltip({ chain }: NativeTooltipProps) {
  const { t } = useTranslation();
  return <TagTooltip content={t('TokenBridge-Tooltip-native', { chain: chain.name })} />;
});

export type BridgeTooltipProps = {
  bridge: BridgeEntity;
  chain: ChainEntity;
};
const BridgeTooltip = memo(function BridgeTooltip({ bridge, chain }: BridgeTooltipProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const onClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(e => {
    e.stopPropagation(); // allow link to open (stop event being cancelled in tooltip)
  }, []);

  return (
    <TagTooltip
      content={
        <Trans
          t={t}
          i18nKey={'TokenBridge-Tooltip-bridge'}
          values={{ chain: chain.name, bridge: bridge.name }}
          components={{
            website: (
              <a
                href={bridge.website}
                className={classes.link}
                target={'_blank'}
                rel={'noopener'}
                onClick={onClick}
              />
            ),
          }}
        />
      }
    />
  );
});

export type TagTooltipProps = {
  content: ReactNode;
};
export const TagTooltip = memo(function BridgeTooltip({ content }: TagTooltipProps) {
  const classes = useStyles();
  return <div className={classes.tooltip}>{content}</div>;
});

type TagWithTooltipProps = {
  css?: CssStyles;
  children: ReactNode;
} & TooltipProps;

export const TagWithTooltip = memo(
  forwardRef<HTMLDivElement, TagWithTooltipProps>(function TagWithTooltip(
    { children, css: cssProp, triggerCss, ...rest },
    ref
  ) {
    return (
      <Tooltip
        placement="top"
        triggerCss={css.raw(styles.tag, cssProp, triggerCss)}
        triggers={TRIGGERS.CLICK}
        ref={ref}
        {...rest}
      >
        {children}
      </Tooltip>
    );
  })
);

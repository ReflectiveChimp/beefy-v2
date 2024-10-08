import { memo } from 'react';
import type { ChainEntity } from '../../features/data/entities/chain';
import missingAssetUrl from '../../images/single-assets/missing-asset.svg';
import { AssetArrangement } from './AssetArrangement';
import { AssetImg } from './AssetImg';
import { SymbolAssetImg } from './SymbolAssetImg';
import { defaultSize, maxSupportedAssets } from './config';

type CommonProps = {
  size?: number;
  className?: string;
};

export type AssetsImageProps = {
  chainId?: ChainEntity['id'] | undefined;
  assetSymbols: string[];
} & CommonProps;

export const AssetsImage = memo<AssetsImageProps>(
  function AssetsImage({ chainId, assetSymbols, className, size = defaultSize }) {
    if (!assetSymbols || assetSymbols.length === 0) {
      return <MissingAssetsImage size={size} className={className} />;
    }

    return (
      <AssetArrangement
        count={Math.min(assetSymbols.length, maxSupportedAssets)}
        size={size}
        className={className}
      >
        {assetSymbols.slice(0, maxSupportedAssets).map(symbol => (
          <SymbolAssetImg key={`${symbol}.${chainId}`} symbol={symbol} chainId={chainId} />
        ))}
      </AssetArrangement>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.chainId === nextProps.chainId &&
      prevProps.size === nextProps.size &&
      prevProps.className === nextProps.className &&
      prevProps.assetSymbols?.join() === nextProps.assetSymbols?.join()
    );
  }
);

export type MissingAssetsImageProps = CommonProps;

export const MissingAssetsImage = memo<MissingAssetsImageProps>(function MissingAssetsImage({
  size,
  className,
}) {
  return (
    <AssetArrangement className={className} size={size} count={1}>
      <AssetImg src={missingAssetUrl} />
    </AssetArrangement>
  );
});

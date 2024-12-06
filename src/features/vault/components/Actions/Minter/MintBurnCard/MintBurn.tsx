import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeaderTabs } from '../../../Card';
import { Mint } from './components/Mint';
import { Burn } from './components/Burn';
import type { MinterCardParams } from '../MinterCard';
import { selectMinterById } from '../../../../../data/selectors/minters';
import { useAppSelector } from '../../../../../../store';

export const MintBurn = memo(function MintBurn({ vaultId, minterId }: MinterCardParams) {
  const { t } = useTranslation();
  const minter = useAppSelector(state => selectMinterById(state, minterId));
  const canBurn = !!minter.canBurn;
  const canMint = !minter.disableMint;
  const [mintBurn, setMintBurn] = useState(canMint ? 'mint' : 'burn');
  const options = useMemo(() => {
    const opts: Array<{ value: string; label: string }> = [];
    if (canMint) {
      opts.push({
        value: 'mint',
        label: t('action', { action: t('mint'), token: minter.mintedToken.symbol }),
      });
    }
    if (canBurn) {
      opts.push({
        value: 'burn',
        label: t('action', { action: t('burn'), token: minter.mintedToken.symbol }),
      });
    }
    return opts;
  }, [t, canMint, canBurn, minter.mintedToken.symbol]);

  return (
    <Card>
      <CardHeaderTabs selected={mintBurn} options={options} onChange={setMintBurn} />
      {mintBurn === 'mint' ? (
        <Mint vaultId={vaultId} minterId={minterId} />
      ) : (
        <Burn vaultId={vaultId} minterId={minterId} />
      )}
    </Card>
  );
});

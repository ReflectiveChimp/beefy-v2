import { memo } from 'react';
import { tenderlyChains } from '../config';
import { Button } from '../../Button';
import type { ChainId } from '../../../features/data/entities/chain';
import { useAppSelector } from '../../../store';
import { selectTenderlyMode } from '../../../features/data/selectors/tenderly';
import logoUrl from '../logo.svg';
import { styles } from './styles';

export type TenderlyButtonProps = {
  chainId: ChainId;
  onClick: () => void;
  disabled?: boolean;
};

export const TenderlyButton = memo(function TenderlyButton({
  chainId,
  onClick,
  disabled,
}: TenderlyButtonProps) {
  const status = useAppSelector(selectTenderlyMode);

  if (tenderlyChains.has(chainId)) {
    return (
      <Button
        variant="default"
        fullWidth={true}
        onClick={onClick}
        disabled={status !== 'closed' || disabled}
        css={styles.button}
      >
        <img src={logoUrl} alt="" width={24} height={24} />
        Tenderly Simulation
      </Button>
    );
  }

  return null;
});

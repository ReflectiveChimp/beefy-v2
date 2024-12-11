import { memo, useCallback } from 'react';
import { ButtonAdornment } from '../ButtonAdornment';
import { useAppDispatch } from '../../../../../../store';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { AssetsImage } from '../../../../../../components/AssetsImage';
import { FormStep } from '../../../../../data/reducers/on-ramp-types';
import { styles } from './styles';

export type TokenAmountAdornmentProps = {
  token: string;
};
export const TokenAmountAdornment = memo(function TokenAmountAdornment({
  token,
}: TokenAmountAdornmentProps) {
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(onRampFormActions.setStep({ step: FormStep.SelectToken }));
  }, [dispatch]);

  return (
    <ButtonAdornment onClick={handleClick}>
      <AssetsImage chainId={undefined} assetSymbols={[token]} size={24} css={styles.icon} />
      {token}
    </ButtonAdornment>
  );
});

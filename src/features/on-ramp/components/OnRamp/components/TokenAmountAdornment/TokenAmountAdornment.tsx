import { memo, useCallback } from 'react';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { ButtonAdornment } from '../ButtonAdornment';
import { useAppDispatch } from '../../../../../../store';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { AssetsImage } from '../../../../../../components/AssetsImage';
import { FormStep } from '../../../../../data/reducers/on-ramp-types';

export type TokenAmountAdornmentProps = {
  token: string;
  css?: CssStyles;
};
export const TokenAmountAdornment = memo(function TokenAmountAdornment({
  token,
  css: cssProp,
}: TokenAmountAdornmentProps) {
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(onRampFormActions.setStep({ step: FormStep.SelectToken }));
  }, [dispatch]);

  return (
    <ButtonAdornment css={css.raw(styles.button, cssProp)} onClick={handleClick}>
      <AssetsImage chainId={undefined} assetSymbols={[token]} size={24} css={styles.icon} />
      {token}
    </ButtonAdornment>
  );
});

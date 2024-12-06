import { memo, useCallback } from 'react';
import { styles } from './styles';
import { AssetsImage } from '../../../../../../components/AssetsImage';
import { css, type CssStyles } from '@repo/styles/css';
import { useAppDispatch } from '../../../../../../store';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { FormStep } from '../../../../../data/reducers/on-ramp-types';

export type TokenIconAdornmentProps = {
  token: string;
  css?: CssStyles;
};
export const TokenIconAdornment = memo(function TokenIconAdornment({
  token,
  css: cssProp,
}: TokenIconAdornmentProps) {
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch(onRampFormActions.setStep({ step: FormStep.SelectToken }));
  }, [dispatch]);

  return (
    <button className={css(styles.tokenAdornment, cssProp)} onClick={handleClick}>
      <AssetsImage chainId={undefined} assetSymbols={[token]} size={24} css={styles.icon} />
      {token}
    </button>
  );
});

import { memo } from 'react';
import { AlertError } from '../../Alerts';
import { useAppSelector } from '../../../store';
import { selectTenderlyErrorOrUndefined } from '../../../features/data/selectors/tenderly';
import { type CssStyles } from '@repo/styles/css';

export type ErrorProps = {
  css?: CssStyles;
};

export const ErrorMessage = memo(function Error({ css: cssProp }: ErrorProps) {
  const error = useAppSelector(selectTenderlyErrorOrUndefined);

  return (
    <AlertError css={cssProp}>
      {error ? `${error.name}: ${error.message || 'unknown error'}` : 'unknown error'}
    </AlertError>
  );
});

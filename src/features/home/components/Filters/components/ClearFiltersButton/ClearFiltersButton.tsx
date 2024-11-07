import { memo, useCallback } from 'react';
import { Button } from '../../../../../../components/Button';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import {
  selectFilterPopinFilterCount,
  selectHasActiveFilter,
} from '../../../../../data/selectors/filtered-vaults';
import { filteredVaultsActions } from '../../../../../data/reducers/filtered-vaults';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Clear } from '@repo/images/icons/mui/Clear.svg';
import { styled } from '@repo/styles/jsx';

export type ClearFiltersButtonProps = {
  className?: string;
};
export const ClearFiltersButton = memo<ClearFiltersButtonProps>(function ClearFiltersButton() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const active = useAppSelector(selectHasActiveFilter);
  const count = useAppSelector(selectFilterPopinFilterCount);
  const handleReset = useCallback(() => {
    dispatch(filteredVaultsActions.reset());
  }, [dispatch]);

  return (
    <StyledButton disabled={!active} onClick={handleReset}>
      {count > 0 ? <CountBadge data-count={count} /> : <Clear />}
      {t('Filter-ClearAll')}
    </StyledButton>
  );
});

const StyledButton = styled(
  Button,
  {
    base: {
      columnGap: '8px',
    },
  },
  {
    defaultProps: {
      variant: 'filter',
      size: 'sm',
      fullWidth: true,
    },
  }
);

const CountBadge = styled('span', {
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: '0',
    flexGrow: '0',
    width: '24px',
    height: '24px',
    '&:before': {
      textStyle: 'body-sm-med',
      content: 'attr(data-count)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: '0',
      flexGrow: '0',
      backgroundColor: 'indicators.error',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      color: 'text.lightest',
    },
  },
});

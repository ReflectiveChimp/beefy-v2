import { memo, useCallback } from 'react';
import { selectUserUnstakedClms } from '../../../features/data/selectors/balance';
import { useAppDispatch, useAppSelector } from '../../../store';
import { Trans, useTranslation } from 'react-i18next';
import { filteredVaultsActions } from '../../../features/data/reducers/filtered-vaults';
import { useHistory } from 'react-router-dom';
import { ButtonLink } from '../Links/ButtonLink';
import { UnstakedClmBannerVault } from './UnstakedClmBannerVault';
import { ClmBanner } from './ClmBanner';

export const UnstakedClmBanner = memo(function UnstakedClmBanner() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { push } = useHistory();
  const unstakedIds = useAppSelector(selectUserUnstakedClms);
  const handleFilter = useCallback(() => {
    dispatch(filteredVaultsActions.reset());
    dispatch(filteredVaultsActions.setUserCategory('deposited'));
    dispatch(
      filteredVaultsActions.setBoolean({
        filter: 'onlyUnstakedClm',
        value: true,
      })
    );
    push('/');
  }, [dispatch, push]);

  if (!unstakedIds.length) {
    return null;
  }

  if (unstakedIds.length === 1) {
    return <UnstakedClmBannerVault vaultId={unstakedIds[0]} />;
  }

  return (
    <ClmBanner
      text={
        <Trans
          t={t}
          i18nKey={`Banner-UnstakedClm`}
          values={{ count: unstakedIds.length }}
          components={{
            Link: <ButtonLink onClick={handleFilter} />,
          }}
        />
      }
    />
  );
});

import { useTranslation } from 'react-i18next';
import { UserStats, VaultsStats } from './Stats';
import { ReactComponent as VisibilityOffOutlinedIcon } from '@repo/images/icons/mui/VisibilityOffOutlined.svg';
import { ReactComponent as VisibilityOutlinedIcon } from '@repo/images/icons/mui/VisibilityOutlined.svg';
import { selectIsBalanceHidden } from '../../../data/selectors/wallet';
import { setToggleHideBalance } from '../../../data/reducers/wallet/wallet';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { styled } from '@repo/styles/jsx';
import { memo, useCallback } from 'react';

export const Portfolio = memo(function Portfolio() {
  const { t } = useTranslation();

  return (
    <Stats>
      <Group side={'left'}>
        <Title>
          {t('Portfolio-Portfolio')} <VisibilityToggle />
        </Title>
        <UserStats />
      </Group>
      <Group side={'right'}>
        <Title>{t('Vault-platform')}</Title>
        <VaultsStats />
      </Group>
    </Stats>
  );
});

const VisibilityToggle = memo(function VisibilityToggle() {
  const dispatch = useAppDispatch();
  const hideBalance = useAppSelector(selectIsBalanceHidden);

  const updateHideBalance = useCallback(() => {
    dispatch(setToggleHideBalance());
  }, [dispatch]);

  return (
    <ToggleButton onClick={updateHideBalance}>
      {hideBalance ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
    </ToggleButton>
  );
});

const Stats = styled('div', {
  base: {
    paddingTop: '16px',
    paddingBottom: '40px',
    display: 'grid',
    gridTemplateColumns: '100%',
    gap: '32px',
    md: {
      gridTemplateColumns: '583fr 417fr',
    },
  },
});

const Group = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  variants: {
    side: {
      left: {},
      right: {
        md: {
          textAlign: 'right',
          justifyContent: 'flex-end',
        },
      },
    },
  },
  defaultVariants: {
    side: 'left',
  },
});

const Title = styled('div', {
  base: {
    textStyle: 'h3',
    color: 'text.middle',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'inherit',
    columnGap: '8px',
  },
});

const ToggleButton = styled('button', {
  base: {
    color: 'green',
  },
});

import { Button } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { useTranslation } from 'react-i18next';
import { UserStats } from './UserStats';
import { VaultsStats } from './VaultsStats';
import { styles } from './styles';
import { ReactComponent as VisibilityOffOutlinedIcon } from '@repo/images/icons/mui/VisibilityOffOutlined.svg';
import { ReactComponent as VisibilityOutlinedIcon } from '@repo/images/icons/mui/VisibilityOutlined.svg';
import { useTheme } from '@material-ui/core/styles';
import { selectIsBalanceHidden } from '../../../data/selectors/wallet';
import { setToggleHideBalance } from '../../../data/reducers/wallet/wallet';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { Container } from '../../../../components/Container/Container';
import { css } from '@repo/styles/css';

const useStyles = legacyMakeStyles(styles);

export const Portfolio = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const hideBalance = useAppSelector(selectIsBalanceHidden);

  const updateHideBalance = () => {
    dispatch(setToggleHideBalance());
  };

  const { t } = useTranslation();

  return (
    <div className={classes.portfolio}>
      <Container maxWidth="lg">
        <div className={classes.stats}>
          <div className={classes.userStats}>
            <div className={classes.title}>
              {t('Portfolio-Portfolio')}{' '}
              <Button size="small" className={classes.btnHide} onClick={updateHideBalance}>
                {hideBalance ? (
                  <VisibilityOutlinedIcon color={`${theme.palette.primary.main}`} />
                ) : (
                  <VisibilityOffOutlinedIcon color={`${theme.palette.primary.main}`} />
                )}
              </Button>
            </div>
            <UserStats />
          </div>
          <div className={classes.vaultStats}>
            <div className={css(styles.title, styles.vaultStatsTitle)}>{t('Vault-platform')}</div>
            <VaultsStats />
          </div>
        </div>
      </Container>
    </div>
  );
};

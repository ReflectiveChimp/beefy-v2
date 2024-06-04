import { memo, useCallback, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../store';
import { type BuildVersion, setUpdateAvailable } from '../../features/data/reducers/ui-version';
import { selectAppVersionInfo } from '../../features/data/selectors/version';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { featureFlag_simUpdate } from '../../features/data/utils/feature-flags';

const useStyles = makeStyles(styles);

declare global {
  interface Window {
    __beefyHandleNewVersion?: (
      currentVersion: BuildVersion,
      newVersion: BuildVersion,
      reloadFailed: boolean,
      newVersionMessage: string
    ) => Promise<boolean>;
  }
}

export const AppVersionCheck = memo(function AppVersionCheck() {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const app = useAppSelector(selectAppVersionInfo);
  const message = useMemo(() => {
    if (app.updateAvailable) {
      const key = app.reloadFailed ? 'Update-Available-Failed' : 'Update-Available';
      return t(key, {
        currentDate: new Date(app.currentVersion.timestamp).toLocaleString(),
        currentVersion: app.currentVersion.git || app.currentVersion.content,
        newDate: new Date(app.newVersion.timestamp).toLocaleString(),
        newVersion: app.newVersion.git || app.newVersion.content,
      });
    }
    return undefined;
  }, [t, app]);
  const handleReload = useCallback(() => {
    if (app.updateAvailable) {
      const url = new URL(window.location.href);
      url.searchParams.set('update', app.newVersion.timestamp.toString());
      window.location.href = url.toString();
    } else {
      window.location.reload();
    }
  }, [app]);

  useEffect(() => {
    if (window) {
      window.__beefyHandleNewVersion = async (
        currentVersion: BuildVersion,
        newVersion: BuildVersion,
        reloadFailed: boolean
      ) => {
        dispatch(setUpdateAvailable({ currentVersion, newVersion, reloadFailed }));
        return true;
      };

      if (featureFlag_simUpdate()) {
        const query = new URLSearchParams(window.location.search);
        dispatch(
          setUpdateAvailable({
            currentVersion: {
              content: '2b9ed1eb45c03272e67691eb5f69ef6d',
              timestamp: 1717012504,
              git: 'f55adb5319d150c07017f7480e8d388e530f92e2',
            },
            newVersion: {
              content: '2b9ed1eb45c03272e67691eb5f69ef6f',
              timestamp: 1717512504,
              git: 'f55adb5319d150c07017f7480e8d388e530f92e3',
            },
            reloadFailed: query.get('update') === '1717512504',
          })
        );
      }
    }
  }, [dispatch]);

  if (!app.updateAvailable) {
    return null;
  }

  return (
    <div className={classes.positioner}>
      <div className={classes.alert}>
        <div className={classes.message}>{message}</div>
        <div className={classes.action}>
          <Button onClick={handleReload} size={'sm'} variant={'success'} className={classes.button}>
            {t('Update-Reload')}
          </Button>
        </div>
      </div>
    </div>
  );
});

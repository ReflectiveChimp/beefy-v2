import { memo } from 'react';
import { LoadingIndicator } from '../../../../../../components/LoadingIndicator';
import { useTranslation } from 'react-i18next';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

export const LoadingStep = memo(function LoadingStep() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <LoadingIndicator text={t('Transact-Loading')} />
    </div>
  );
});

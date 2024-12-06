import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { useHistory } from 'react-router-dom';
import { legacyMakeStyles } from '@repo/helpers/mui';
import image from '../../images/404image.svg';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container/Container';

const useStyles = legacyMakeStyles(styles);

export const PageNotFound = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const handleOpen = useCallback(() => {
    history.push(`/`);
  }, [history]);

  return (
    <Container maxWidth="lg">
      <div className={classes.inner}>
        <img src={image} alt="404" className={classes.image} />
        <div className={classes.textContainer}>
          <div className={classes.text}>{t('Page-Not-Found')}</div>
          <Button variant="success" css={styles.button} onClick={handleOpen}>
            {t('View-All')}
          </Button>
        </div>
      </div>
    </Container>
  );
};

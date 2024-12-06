import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import Introduction from './components/Introduction';
import OnRamp from './components/OnRamp';
import { Container } from '../../components/Container/Container';

const useStyles = legacyMakeStyles(styles);

export const OnRampPage = memo(function OnRampPage() {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" css={styles.pageContainer}>
      <div className={classes.inner}>
        <Introduction />
        <OnRamp />
      </div>
    </Container>
  );
});

import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import Introduction from './components/Introduction';
import Bridge from './components/Bridge';
import PoweredBy from './components/PoweredBy';
import { Container } from '../../components/Container/Container';
import { Hidden } from '../../components/MediaQueries/Hidden';

const useStyles = legacyMakeStyles(styles);

export const BridgePage = memo(function BridgePage() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" css={styles.pageContainer}>
      <div className={classes.inner}>
        <div className={classes.intro}>
          <Introduction />
          <Hidden to="sm">
            <PoweredBy />
          </Hidden>
        </div>
        <Bridge />
        <Hidden from="md">
          <PoweredBy />
        </Hidden>
      </div>
    </Container>
  );
});

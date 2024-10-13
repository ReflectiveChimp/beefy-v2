import { memo, useEffect } from 'react';
import { ConnectionStatus } from './components/ConnectionStatus';
import { MobileMenu } from './components/MobileMenu';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  selectShouldInitArticles,
  selectShouldInitProposals,
} from '../../features/data/selectors/data-loader';
import { fetchActiveProposals } from '../../features/data/actions/proposal';
import { fetchLastArticle } from '../../features/data/actions/articles';
import { Container } from '../Container/Container';
import { LogoLink } from './components/LogoLink/LogoLink';
import { Hidden } from '../MediaQueries/Hidden';
import { styled } from '@styles/jsx';
import { Visible } from '../MediaQueries/Visible';
import { MainMenu } from './components/MainMenu/MainMenu';
import { RightMenu } from './components/RightMenu/RightMenu';

export const Header = memo(function Header() {
  const dispatch = useAppDispatch();
  const shouldLoadProposals = useAppSelector(selectShouldInitProposals);
  const shouldLoadArticles = useAppSelector(selectShouldInitArticles);

  useEffect(() => {
    if (shouldLoadProposals) {
      dispatch(fetchActiveProposals());
    }
  }, [dispatch, shouldLoadProposals]);

  useEffect(() => {
    if (shouldLoadArticles) {
      dispatch(fetchLastArticle());
    }
  }, [dispatch, shouldLoadArticles]);

  return (
    <HeaderContainer maxWidth="lg">
      <Side>
        <LogoLink />
        <Visible from="lg">
          <MainMenu />
        </Visible>
      </Side>
      <Side>
        <Visible from="lg">
          <RightMenu />
        </Visible>
        <ConnectionStatus />
        <Hidden from="lg">
          <MobileMenu />
        </Hidden>
      </Side>
    </HeaderContainer>
  );
});

const HeaderContainer = styled(Container, {
  base: {
    paddingBlock: '18px',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    columnGap: '16px',
    justifyContent: 'space-between',
    sm: {
      paddingBlock: '22px',
    },
  },
});

const Side = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    columnGap: '16px',
  },
});

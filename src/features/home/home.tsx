import { memo } from 'react';
import { Filters } from './components/Filters';
import { Portfolio } from './components/Portfolio';
import { Loading } from './components/Loading';
import { selectIsVaultListAvailable } from '../data/selectors/data-loader';
import { Vaults } from './components/Vaults';
import { useAppSelector } from '../../store';
import { Banners } from './components/Banners';
import { HomeMeta } from '../../components/Meta/HomeMeta';
import { Container } from '../../components/Container/Container';
import { styled } from '@repo/styles/jsx';

export const Home = memo(function Home() {
  const isVaultListAvailable = useAppSelector(selectIsVaultListAvailable);

  if (!isVaultListAvailable) {
    return (
      <>
        <HomeMeta />
        <Loading />
      </>
    );
  }

  return (
    <>
      <HomeMeta />
      <Header>
        <Container maxWidth="lg">
          <Banners />
          <Portfolio />
        </Container>
      </Header>
      <Content>
        <Container maxWidth="lg">
          <Filters />
          <Vaults />
        </Container>
      </Content>
    </>
  );
});

const Header = styled('div', {
  base: {
    backgroundColor: 'background.header',
  },
});

const Content = styled('div', {
  base: {
    paddingBlock: '32px',
  },
});

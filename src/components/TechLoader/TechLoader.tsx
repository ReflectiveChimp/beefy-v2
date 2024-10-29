import { memo } from 'react';
import loadingImage from '../../images/tech-loader.gif';
import { styled } from '@repo/styles/jsx';

export type TechLoaderProps = {
  text?: string;
};

export const TechLoader = memo<TechLoaderProps>(function TechLoader({ text }) {
  return (
    <Sizer>
      <img
        alt={text ? '' : 'Loading...'}
        aria-hidden={text ? true : undefined}
        src={loadingImage}
        width={718 / 2}
        height={718 / 2}
      />
      {text ? <Text>{text}</Text> : null}
    </Sizer>
  );
});

const Sizer = styled('div', {
  base: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 1 auto',
  },
});

const Text = styled('div', {
  base: {
    textStyle: 'body-lg-med',
    textAlign: 'center',
    paddingInline: '8px',
  },
});

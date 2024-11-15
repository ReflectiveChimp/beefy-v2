import type { ReactNode } from 'react';
import { memo } from 'react';
import { styled } from '@repo/styles/jsx';

export type BasicTooltipContentProps = {
  title: string;
  content?: ReactNode;
};
export const BasicTooltipContent = memo<BasicTooltipContentProps>(function BasicTooltipContent({
  title,
  content,
}) {
  return (
    <Layout>
      <BasicTitle>{title}</BasicTitle>
      {content && <BasicContent>{content}</BasicContent>}
    </Layout>
  );
});

const Layout = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 'var(--tooltip-content-vertical-gap, 8px)',
    columnGap: 'var(--tooltip-content-horizontal-gap, 16px)',
  },
});

const BasicTitle = styled('div', {
  base: {
    textStyle: 'body-lg-med',
    color: 'colorPalette.text.title',
  },
});

const BasicContent = styled('div', {
  base: {
    color: 'colorPalette.text.content',
  },
});

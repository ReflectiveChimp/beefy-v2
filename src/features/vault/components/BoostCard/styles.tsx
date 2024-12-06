import { css } from '@repo/styles/css';

export const styles = {
  text: css.raw({
    color: 'text.middle',
    marginBottom: '16px',
  }),
  boostedBy: css.raw({
    textStyle: 'h2',
    margin: '0',
    color: 'background.vaults.boost',
    flexGrow: '1',
    '& span': {
      color: 'text.light',
    },
  }),
  header: css.raw({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '24px',
    borderRadius: '12px 12px 0 0',
    backgroundColor: 'background.content.dark',
  }),
  socials: css.raw({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: '8px',
    columnGap: '8px',
    marginLeft: 'auto',
    mdDown: {
      marginLeft: '0',
    },
  }),
  campaignTitle: css.raw({
    textStyle: 'h3',
  }),
  campaignText: css.raw({
    color: 'text.middle',
  }),
  partners: css.raw({}),
  partnerSubCard: css.raw({
    borderRadius: '12px',
    backgroundColor: 'background.content.light',
  }),
  partnerHeader: css.raw({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '16px',
    borderRadius: '12px 12px 0 0',
    backgroundColor: 'background.content.dark',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  partnerContent: css.raw({
    padding: '16px',
  }),
  partnerTitle: css.raw({
    textStyle: 'h3',
    margin: '0',
  }),
  partnerText: css.raw({}),
  content: css.raw({
    rowGap: '16px',
  }),
};

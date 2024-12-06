import { css } from '@repo/styles/css';

export const styles = {
  container: css.raw({
    display: 'flex',
    flexDirection: 'column',
  }),
  title: css.raw({
    textStyle: 'h3',
    padding: '16px 24px',
    display: 'flex',
    columnGap: '12px',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'background.content.light',
    borderRadius: '8px 8px 0px 0px',

    lgDown: {
      padding: '16px',
    },
  }),
  marketMakerAnnotation: css.raw({
    position: 'relative',
    bottom: '0.5em',
    fontSize: '0.5em',
  }),
  icon: css.raw({
    height: '32px',
  }),
  mmNameContainer: css.raw({
    display: 'flex',
    alignItems: 'center',
  }),
  nameContainer: css.raw({
    display: 'flex',
    columnGap: '12px',
    alignItems: 'center',
  }),
  mmName: css.raw({
    color: 'text.light',
    paddingLeft: '12px',
  }),
  chainName: css.raw({
    color: 'text.light',
  }),
  usdValue: css.raw({
    color: 'text.light',
  }),
  'headerNetwork-bsc': css.raw({
    backgroundColor: 'extracted2911o20',
  }),
  'headerNetwork-heco': css.raw({
    backgroundColor: 'extracted4048o20',
  }),
  'headerNetwork-avax': css.raw({
    backgroundColor: 'extracted3560o20',
  }),
  'headerNetwork-polygon': css.raw({
    backgroundColor: 'extracted785o29',
  }),
  'headerNetwork-fantom': css.raw({
    backgroundColor: 'extracted3886o20',
  }),
  'headerNetwork-harmony': css.raw({
    backgroundColor: 'extracted1302',
  }),
  'headerNetwork-arbitrum': css.raw({
    backgroundColor: 'extracted656',
  }),
  'headerNetwork-celo': css.raw({
    backgroundColor: 'extracted895',
  }),
  'headerNetwork-moonriver': css.raw({
    backgroundColor: 'extracted1870o40',
  }),
  'headerNetwork-cronos': css.raw({
    backgroundColor: 'extracted1254',
  }),
  'headerNetwork-fuse': css.raw({
    backgroundColor: 'extracted3379o20',
  }),
  'headerNetwork-metis': css.raw({
    backgroundColor: 'extracted21o40',
  }),
  'headerNetwork-aurora': css.raw({
    backgroundColor: 'extracted2394o20',
  }),
  'headerNetwork-moonbeam': css.raw({
    backgroundColor: 'extracted4093o40',
  }),
  'headerNetwork-optimism': css.raw({
    backgroundColor: 'extracted1370o20',
  }),
  'headerNetwork-emerald': css.raw({
    backgroundColor: 'extracted308o20',
  }),
  'headerNetwork-kava': css.raw({
    backgroundColor: 'extracted3790o20',
  }),
  'headerNetwork-ethereum': css.raw({
    backgroundColor: 'extracted4068o20',
  }),
  'headerNetwork-canto': css.raw({
    backgroundColor: 'extracted1459o20',
  }),
  'headerNetwork-zksync': css.raw({
    backgroundColor: 'blacko29',
  }),
  'headerNetwork-zkevm': css.raw({
    backgroundColor: 'extracted1174o20',
  }),
  'headerNetwork-base': css.raw({
    backgroundColor: 'extracted2199',
  }),
  'headerNetwork-gnosis': css.raw({
    backgroundColor: 'extracted2923o40',
  }),
  'headerNetwork-linea': css.raw({
    backgroundColor: 'extracted1099o20',
  }),
  'headerNetwork-mantle': css.raw({
    backgroundColor: 'extracted1099o20',
  }),
  'headerNetwork-fraxtal': css.raw({
    backgroundColor: 'extracted1099o20',
  }),
  'headerNetwork-mode': css.raw({
    backgroundColor: 'extracted1099o20',
  }),
  'headerNetwork-manta': css.raw({
    backgroundColor: 'extracted1099o20',
  }),
  'headerNetwork-real': css.raw({
    backgroundColor: 'extracted1571',
  }),
  'headerNetwork-sei': css.raw({
    backgroundColor: 'extracted1571',
  }),
  'headerNetwork-rootstock': css.raw({
    backgroundColor: 'extracted1571',
  }),
  'headerNetwork-scroll': css.raw({
    backgroundColor: 'extracted2530',
  }),
  'headerMM-system9': css.raw({
    backgroundColor: 'extracted1306',
  }),
};

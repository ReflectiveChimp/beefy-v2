import { css } from '@repo/styles/css';

export const styles = {
  vaultIdentity: css.raw({
    display: 'flex',
    flexGrow: '0',
    flexShrink: '0',
    flexDirection: 'row',
    columnGap: '16px',
    minWidth: '0',
    textDecoration: 'none',
  }),
  vaultNameTags: css.raw({
    minWidth: '0',
  }),
  vaultName: css.raw({
    textStyle: 'h3',
    color: 'text.light',
    textDecoration: 'none',
  }),
  vaultNameBoosted: css.raw({
    color: 'background.vaults.boost',
  }),
  vaultNetwork: css.raw({
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    width: '28px',
    height: '28px',
    border: 'solid 2px {colors.background.content.dark}',
    borderBottomRightRadius: '16px',
    '& img': {
      width: '22px',
      height: '22px',
    },
  }),
  'vaultNetwork-bsc': css.raw({
    backgroundColor: 'extracted2911',
  }),
  'vaultNetwork-heco': css.raw({
    backgroundColor: 'extracted4048',
  }),
  'vaultNetwork-avax': css.raw({
    backgroundColor: 'extracted3560',
  }),
  'vaultNetwork-polygon': css.raw({
    backgroundColor: 'extracted785',
  }),
  'vaultNetwork-fantom': css.raw({
    backgroundColor: 'extracted3886',
  }),
  'vaultNetwork-harmony': css.raw({
    backgroundColor: 'extracted973',
  }),
  'vaultNetwork-arbitrum': css.raw({
    backgroundColor: 'extracted2698',
  }),
  'vaultNetwork-celo': css.raw({
    backgroundColor: 'extracted3748',
  }),
  'vaultNetwork-moonriver': css.raw({
    backgroundColor: 'extracted1870',
  }),
  'vaultNetwork-cronos': css.raw({
    backgroundColor: 'extracted1254',
  }),
  'vaultNetwork-fuse': css.raw({
    backgroundColor: 'extracted3379',
  }),
  'vaultNetwork-metis': css.raw({
    backgroundColor: 'extracted21',
  }),
  'vaultNetwork-aurora': css.raw({
    backgroundColor: 'extracted2394',
  }),
  'vaultNetwork-moonbeam': css.raw({
    backgroundColor: 'extracted4093',
  }),
  'vaultNetwork-emerald': css.raw({
    backgroundColor: 'extracted308',
  }),
  'vaultNetwork-optimism': css.raw({
    backgroundColor: 'extracted1370',
  }),
  'vaultNetwork-kava': css.raw({
    backgroundColor: 'extracted3790',
  }),
  'vaultNetwork-ethereum': css.raw({
    backgroundColor: 'extracted4068',
  }),
  'vaultNetwork-canto': css.raw({
    backgroundColor: 'extracted1459',
  }),
  'vaultNetwork-zksync': css.raw({
    backgroundColor: 'white',
  }),
  'vaultNetwork-zkevm': css.raw({
    backgroundColor: 'extracted1174',
  }),
  'vaultNetwork-base': css.raw({
    backgroundColor: 'white',
  }),
  'vaultNetwork-gnosis': css.raw({
    backgroundColor: 'extracted2923',
  }),
  'vaultNetwork-linea': css.raw({
    backgroundColor: 'extracted1099',
  }),
  'vaultNetwork-mantle': css.raw({
    backgroundColor: 'extracted1099',
  }),
  'vaultNetwork-fraxtal': css.raw({
    backgroundColor: 'black',
  }),
  'vaultNetwork-mode': css.raw({
    backgroundColor: 'black',
  }),
  'vaultNetwork-manta': css.raw({
    backgroundColor: 'black',
  }),
  'vaultNetwork-real': css.raw({
    backgroundColor: 'white',
  }),
  'vaultNetwork-sei': css.raw({
    backgroundColor: 'black',
  }),
  'vaultNetwork-rootstock': css.raw({
    backgroundColor: 'black',
  }),
  'vaultNetwork-scroll': css.raw({
    backgroundColor: 'extracted208',
  }),
};

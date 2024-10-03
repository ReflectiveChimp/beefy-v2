import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Enabled jsx/styled() support
  jsxFramework: 'react',
  // The output directory for your css system
  outdir: 'styled-system',
  // Tell panda we are importing generated code from @styles/* rather than {outdir}/*
  importMap: '@styles',
  // Base present only (excluding panda opinionated presets)
  presets: ['@pandacss/preset-base'],
  // Whether to use css reset
  preflight: true,
  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Files to exclude
  exclude: [],
  // Global css declarations
  globalCss: {
    html: {
      '&:has(dialog[open]:modal)': {
        overflow: 'hidden',
        '& body': {
          paddingLeft: 'calc(100vw - 100%)',
        },
      },
    },
  },
  // Theme variables
  theme: {
    tokens: {
      fonts: {
        body: {
          value: [
            '"DM Sans"',
            'system-ui',
            '-apple-system',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            '"Noto Sans"',
            '"Liberation Sans"',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"',
          ].join(','),
        },
      },
      colors: {
        red: { value: '#dc2c10', description: 'txsModal.error' },
        redOrange: { value: '#da5932', description: 'indicators.error' },
        orangeBoost: { value: '#db8332', description: 'boost button bg + vaults boost' },
        orangeWarning: { value: '#d19847', description: 'indicators.warning' },
        yellow: { value: '#d6d05d', description: 'indicators.loading' },
        orangeBoostLight: { value: '#e5a66b', description: 'boost button bg hover' },
        green: { value: '#4db258', description: 'primary main + indicators.success' },
        greenLight: { value: '#68be71', description: 'primary light' },
        greenDark: { value: '#004708', description: 'primary dark' },
        au: { value: '#775744', description: 'tag.boost' },
        av: { value: '#532f39', description: 'tag.retired' },
        aw: { value: '#564a46', description: 'tag.paused' },
        blackOff: { value: '#020203', description: 'footer header' },
        purpleDarkest: { value: '#121421', description: 'app bg + search input bg' },
        aa: {
          value: '#1c1e32',
          description:
            'light tooltip text title/content/label/link + contentDark + tooltip dark bg',
        },
        aq: { value: '#1e2a48', description: 'vaults clmVault' },
        ah: { value: '#232644', description: 'dashboard summary icon bg' },
        ar: { value: '#242032', description: 'vaults inactive' },
        ab: {
          value: '#242842',
          description: 'light tooltip text value + contentPrimary + vaults.default + txsModal.bg',
        },
        ap: { value: '#252c63', description: 'vaults clm + vaults clmPool' },
        ak: { value: '#2d3153', description: 'contentLight' },
        ao: { value: '#322460', description: 'vaults gov' },
        ai: { value: '#363b63', description: 'border + button bg' },
        ay: { value: '#38428f', description: 'tag.platformClm' },
        az: { value: '#4b388f', description: 'tag.platformGov' },
        al: { value: '#495086', description: 'button bg hover' },
        ax: { value: '#5c70d6', description: 'tag.clm + indicators.info' },
        grayDark: { value: '#999cb3', description: 'text dark' },
        gray: { value: '#d0d0da', description: 'text middle' },
        grayLight: { value: '#e5e5e5', description: 'txsModal.bgLine' },
        whiteOff: { value: '#f5f5f5', description: 'text light' },
        white: { value: '#ffffff', description: 'text lightest + txsModal.bg' },
      },
    },
    semanticTokens: {
      colors: {
        text: {
          lightest: { value: '{colors.white}' },
          light: { value: '{colors.whiteOff}' },
          middle: { value: '{colors.gray}' },
          dark: { value: '{colors.grayDark}' },
        },
        modal: {
          backdrop: { value: '{colors.white/20}' },
        },
        tooltip: {
          light: {
            background: { value: '{colors.white}' },
            text: {
              DEFAULT: { value: '{colors.aa}' },
              title: { value: '{colors.aa}' },
              content: { value: '{colors.aa}' },
              // value: { value: '{colors.ab}' },
              label: { value: '{colors.aa}' },
              link: { value: '{colors.aa}' },
            },
          },
          dark: {
            background: { value: '{colors.aa}' },
            text: {
              DEFAULT: { value: '{colors.whiteOff}' },
              title: { value: '{colors.white}' },
              content: { value: '{colors.whiteOff}' },
              // value: { value: '{colors.gray}' },
              label: { value: '{colors.whiteOff}' },
              link: { value: '{colors.white}' },
            },
          },
        },
      },
    },
  },
});

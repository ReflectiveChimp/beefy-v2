import { defineConfig } from '@pandacss/dev';
import { buildConfig } from './build-tools/styles/config-builder';
import { pluginStricterProperties } from './build-tools/styles/stricter-properties-plugin';

// @dev some changes require running `yarn panda codegen` after

const sansSerifFontStack = [
  'DM Sans',
  'ui-sans-serif',
  'system-ui',
  '-apple-system',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'Noto Sans',
  'Liberation Sans',
  'sans-serif',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji',
]
  .map(v => (v.includes(' ') ? `"${v}"` : v))
  .join(', ');

const config = buildConfig(
  // Base config
  {
    // Enabled jsx/styled() support
    jsxFramework: 'react',
    // jsx/styled() can only be used for recipes
    jsxStyleProps: 'minimal',

    // Typescript validation for some supported properties
    // @see https://panda-css.com/docs/concepts/writing-styles#strictpropertyvalues
    strictPropertyValues: true,
    // For any css property with a token set, only tokens can be used if this is enabled
    strictTokens: false,
    // error if this config is not valid
    validation: 'error',
    // The output directory for your css system
    outdir: 'build-tools/styles/generated',
    // Tell panda we are importing generated code from @styles/* rather than {outdir}/*
    importMap: '@repo/styles',
    // Base present only (excluding panda opinionated presets)
    presets: ['@pandacss/preset-base'],
    // Whether to use css reset
    preflight: true,
    // Where to look for your css declarations
    include: ['./src/**/*.{js,jsx,ts,tsx}'],
    // Files to exclude
    exclude: [],
    // Plugins
    plugins: [
      pluginStricterProperties({
        zIndex: {
          removeAny: true,
          removeReact: true,
          add: ['number', '"auto"'],
        },
      }),
    ],
    // Global css declarations
    globalCss: {
      html: {
        '--global-font-body': sansSerifFontStack,
        // '--global-font-mono': '',
        // '--global-color-border': '',
        // '--global-color-placeholder': '',
        '&:has(.disable-scroll)': {
          overflow: 'hidden',
          '& body': {
            paddingLeft: 'calc(100vw - 100%)',
          },
        },
      },
      h1: {
        fontSize: '32px',
        lineHeight: '40px',
        fontWeight: 500,
      },
      h2: {
        fontSize: '24px',
        lineHeight: '32px',
        fontWeight: 500,
      },
      h3: {
        fontSize: '21px',
        lineHeight: '24px',
        fontWeight: 500,
      },
      button: {
        color: 'inherit',
        background: 'none',
        border: 'none',
        borderRadius: 0,
        minWidth: 0,
        padding: 0,
        margin: 0,
        display: 'inline-flex',
        whiteSpace: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: 'none',
        textAlign: 'center',
        textDecoration: 'none',
        outline: 'none',
        '&:focus,&:focus-visible': {
          outline: 'none',
        },
        '&:disabled,&:hover:disabled,&:active:disabled,&:focus:disabled': {
          color: 'inherit',
          background: 'none',
          border: 'none',
          pointerEvents: 'none',
        },
      },
      'onboard-v2': {
        position: 'relative!',
        zIndex: 'layer1.modal!',
      },
      'wcm-modal, #cryptoconnect-extension': {
        position: 'relative!',
        zIndex: 'layer2.modal!',
      },
      '.mui-svg': {
        width: '1em',
        height: '1em',
        fill: 'currentColor',
        fontSize: '1.5rem',
        flexShrink: '0',
        userSelect: 'none',
      },
    },
    // Extend condition helpers
    conditions: {
      extend: {
        // React Router sets aria-current="page" on the active link
        // Floating UI sets aria-expanded="true" on the button when open
        active: '&:is(:active, [data-active], [aria-current="page"], [aria-expanded="true"])',
      },
    },
    // Theme variables
    theme: {
      breakpoints: {
        sm: '600px',
        md: '960px',
        lg: '1296px',
        xl: '1920px',
      },
      tokens: {
        fonts: {
          body: {
            value: sansSerifFontStack,
          },
        },
        colors: {
          // TODO rename these colors
          red: { value: '#dc2c10', description: 'txsModal.error' },
          redOrange: { value: '#da5932', description: 'indicators.error' },
          orangeBoost: { value: '#db8332', description: 'boost button bg + vaults boost' },
          orangeWarning: { value: '#d19847', description: 'indicators.warning' },
          yellow: { value: '#d6d05d', description: 'indicators.loading' },
          orangeBoostLight: { value: '#e5a66b', description: 'boost button bg hover' },
          green: { value: '#4db258', description: 'primary main + indicators.success' },
          greenLight: { value: '#68be71', description: 'primary light' },
          greenDark: { value: '#004708', description: 'primary dark' },
          wildBillBrown: { value: '#775744', description: 'tag.boost' },
          portRoyale: { value: '#532f39', description: 'tag.retired' },
          molasses: { value: '#564a46', description: 'tag.paused' },
          blackOff: { value: '#020203', description: 'footer header' },
          purpleDarkest: { value: '#121421', description: 'app bg + search input bg' },
          eclipseElixir: {
            value: '#1c1e32',
            description:
              'light tooltip text title/content/label/link + contentDark + tooltip dark bg',
          },
          faintingLight: { value: '#1e2a48', description: 'vaults clmVault' },
          blackMarket2: { value: '#232644', description: 'dashboard summary icon bg' },
          blackVelvet: { value: '#242032', description: 'vaults inactive' },
          blackMarket1: {
            value: '#242842',
            description: 'light tooltip text value + contentPrimary + vaults.default + txsModal.bg',
          },
          underwaterRealm: { value: '#252c63', description: 'vaults clm + vaults clmPool' },
          quillTip: { value: '#2d3153', description: 'contentLight' },
          parisM: { value: '#322460', description: 'vaults gov' },
          bayOfMany: { value: '#363b63', description: 'border + button bg' },
          clematisBlue: { value: '#38428f', description: 'tag.platformClm' },
          blueGem: { value: '#4b388f', description: 'tag.platformGov' },
          blueJewel: { value: '#495086', description: 'button bg hover' },
          cornflower: { value: '#5c70d6', description: 'tag.clm + indicators.info' },
          grayDark: { value: '#999cb3', description: 'text dark' },
          gray: { value: '#d0d0da', description: 'text middle' },
          grayLight: { value: '#e5e5e5', description: 'txsModal.bgLine' },
          whiteOff: { value: '#f5f5f5', description: 'text light' },
          white: { value: '#ffffff', description: 'text lightest + txsModal.bg' },
          black: { value: '#000000' },
          extracted1071: { value: '#6b7199' },
          extracted1099: { value: '#121212' },
          extracted1174: { value: '#8247e4' },
          extracted1254: { value: '#121926' },
          extracted1308: { value: '#e84525' },
          extracted1355: { value: '#edc389' },
          extracted1370: { value: '#ff0420' },
          extracted1444: { value: '#389d44' },
          extracted1459: { value: '#06fc99' },
          extracted1689: { value: '#3d5cf5' },
          extracted1757: { value: '#9873f0' },
          extracted1870: { value: '#06353d' },
          extracted1885: { value: '#71aefe' },
          extracted198: { value: '#313759' },
          extracted2029: { value: '#8585a6' },
          extracted2048: { value: '#484f7f' },
          extracted208: { value: '#ffe6c8' },
          extracted21: { value: '#00cfff' },
          extracted2201: { value: '#222222' },
          extracted2298: { value: '#d9d9d9' },
          extracted2394: { value: '#70d44b' },
          extracted2568: { value: '#9e8cfc' },
          extracted263: { value: '#232741' },
          extracted2698: { value: '#2d374b' },
          extracted271: { value: '#363a61' },
          extracted2805: { value: '#f02056' },
          extracted282: { value: '#23c197' },
          extracted2833: { value: '#30a46c' },
          extracted2911: { value: '#f0b90b' },
          extracted2916: { value: '#373b60' },
          extracted2922: { value: '#3f446e' },
          extracted2923: { value: '#133629' },
          extracted308: { value: '#0192f6' },
          extracted3194: { value: '#c2d65c' },
          extracted3248: { value: '#373c63' },
          extracted3379: { value: '#b4f9ba' },
          extracted3560: { value: '#e74142' },
          extracted3604: { value: '#606fcf' },
          extracted3636: { value: '#111111' },
          extracted3658: { value: '#3f466d' },
          extracted3748: { value: '#fcff52' },
          extracted3759: { value: '#cec0f0' },
          extracted3763: { value: '#509658' },
          extracted3772: { value: '#424866' },
          extracted3790: { value: '#ff564f' },
          extracted3886: { value: '#1969ff' },
          extracted4048: { value: '#02943f' },
          extracted4068: { value: '#627ee9' },
          extracted4093: { value: '#958fdc' },
          extracted516: { value: '#ed9889' },
          extracted556: { value: '#e5484d' },
          extracted668: { value: '#1b1d32' },
          extracted676: { value: '#9595b2' },
          extracted785: { value: '#f5f0fd' },
          extracted790: { value: '#2e324c' },
          extracted973: { value: '#01d8af' },
        },
        sizes: {
          defaultAssetsImageSize: { value: '48px' },
          container: {
            xs: { value: '444px' },
            sm: { value: '600px' },
            md: { value: '960px' },
            lg: { value: '1296px' },
          },
        },
        fontSizes: {
          h1: { value: '32px' },
          h2: { value: '24px' },
          h3: { value: '21px' },
          body: {
            DEFAULT: { value: '16px' },
            sm: { value: '12px' },
          },
          subline: {
            DEFAULT: { value: '15px' },
            sm: { value: '12px' },
          },
        },
        lineHeights: {
          h1: { value: '40px' },
          h2: { value: '32px' },
          h3: { value: '24px' },
          body: {
            DEFAULT: { value: '24px' },
            sm: { value: '20px' },
          },
          subline: {
            DEFAULT: { value: '24px' },
            sm: { value: '20px' },
          },
        },
        fontWeights: {
          normal: { value: 400 },
          medium: { value: 500 },
        },
        letterSpacings: {
          subline: { value: '0.5px' },
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
          background: {
            header: { value: '{colors.blackOff}' },
            body: { value: '{colors.purpleDarkest}' },
            footer: { value: '{colors.blackOff}' },
            contentDark: { value: '{colors.eclipseElixir}' },
            contentPrimary: { value: '{colors.blackMarket1}' },
            border: { value: '{colors.bayOfMany}' },
            button: { value: '{colors.bayOfMany}' },
            contentLight: { value: '{colors.quillTip}' },
          },
          tags: {
            clm: {
              background: { value: '{colors.cornflower}' },
              text: { value: '{colors.whiteOff}' },
            },
          },
          alert: {
            error: { value: '{colors.redOrange}' },
            warning: { value: '{colors.orangeWarning}' },
            info: { value: '{colors.cornflower}' },
          },
          indicators: {
            loading: { value: '{colors.yellow}' },
            warning: { value: '{colors.orangeWarning}' },
            success: { value: '{colors.green}' },
            error: { value: '{colors.redOrange}' },
          },
          modal: {
            backdrop: { value: '{colors.white/20}' },
          },
          tooltip: {
            light: {
              background: { value: '{colors.white}' },
              text: {
                DEFAULT: { value: '{colors.eclipseElixir}' },
                title: { value: '{colors.eclipseElixir}' },
                content: { value: '{colors.eclipseElixir}' },
                item: { value: '{colors.blackMarket1}' },
                label: { value: '{colors.eclipseElixir}' },
                link: { value: '{colors.eclipseElixir}' },
              },
            },
            dark: {
              background: { value: '{colors.eclipseElixir}' },
              text: {
                DEFAULT: { value: '{colors.whiteOff}' },
                title: { value: '{colors.white}' },
                content: { value: '{colors.whiteOff}' },
                item: { value: '{colors.gray}' },
                label: { value: '{colors.whiteOff}' },
                link: { value: '{colors.white}' },
              },
            },
          },
          searchInput: {
            background: { value: '{colors.purpleDarkest}' },
            text: { value: '{colors.gray}' },
          },
        },
        sizes: {
          containerInner: {
            xs: {
              value: {
                base: 'calc({sizes.container.xs} - 32px)',
                sm: 'calc({sizes.container.xs} - 48px)',
              },
            },
            sm: {
              value: {
                base: 'calc({sizes.container.sm} - 32px)',
                sm: 'calc({sizes.container.sm} - 48px)',
              },
            },
            md: {
              value: {
                base: 'calc({sizes.container.md} - 32px)',
                sm: 'calc({sizes.container.md} - 48px)',
              },
            },
            lg: {
              value: {
                base: 'calc({sizes.container.lg} - 32px)',
                sm: 'calc({sizes.container.lg} - 48px)',
              },
            },
          },
        },
      },
      keyframes: {
        loadingPulse: {
          from: { transform: 'scale(0.5, 0.5)', opacity: '0.7' },
          to: { transform: 'scale(3.0, 3.0)', opacity: '0' },
        },
      },
    },
  },
  // Custom config which gets merged with the base config
  {
    textStyles: {
      h1: {
        fontSize: '{fontSizes.h1}',
        lineHeight: '{fontSizes.}',
        fontWeight: '{fontWeights.medium}',
      },
      h2: {
        fontSize: '{fontSizes.h2}',
        lineHeight: '{lineHeights.h2}',
        fontWeight: '{fontWeights.medium}',
      },
      h3: {
        fontSize: '{fontSizes.h3}',
        lineHeight: '{lineHeights.h3}',
        fontWeight: '{fontWeights.medium}',
      },
      body: {
        fontSize: '{fontSizes.body}',
        lineHeight: '{lineHeights.body}',
        fontWeight: '{fontWeights.normal}',
      },
      'body.med': {
        fontSize: '{fontSizes.body}',
        lineHeight: '{lineHeights.body}',
        fontWeight: '{fontWeights.medium}',
      },
      'body.sm': {
        fontSize: '{fontSizes.body.sm}',
        lineHeight: '{lineHeights.body.sm}',
        fontWeight: '{fontWeights.normal}',
      },
      'body.sm.med': {
        fontSize: '{fontSizes.body.sm}',
        lineHeight: '{lineHeights.body.sm}',
        fontWeight: '{fontWeights.medium}',
      },
      subline: {
        fontSize: '{fontSizes.subline}',
        lineHeight: '{lineHeights.subline}',
        fontWeight: '{fontWeights.medium}',
        textTransform: 'uppercase',
        letterSpacing: '{letterSpacings.subline}',
      },
      'subline.sm': {
        fontSize: '{fontSizes.subline.sm}',
        lineHeight: '{lineHeights.subline.sm}',
        fontWeight: '{fontWeights.medium}',
        textTransform: 'uppercase',
        letterSpacing: '{letterSpacings.subline}',
      },
      inherit: {
        fontSize: 'inherit',
        lineHeight: 'inherit',
        fontWeight: 'inherit',
        textTransform: 'inherit',
        letterSpacing: 'inherit',
      },
    },
    buttons: {
      default: {
        base: {
          color: '{colors.text.light}',
          background: '{colors.bayOfMany}',
          border: '{colors.bayOfMany}',
        },
        hover: {
          background: '{colors.blueJewel}',
          border: '{colors.blueJewel}',
        },
      },
      light: {
        base: {
          color: '{colors.text.light}',
          background: '{colors.quillTip}',
          border: '{colors.quillTip}',
        },
      },
      success: {
        base: {
          color: '{colors.text.light}',
          background: '{colors.green}',
          border: '{colors.green}',
        },
        hover: {
          background: '{colors.greenLight}',
          border: '{colors.greenLight}',
        },
      },
      boost: {
        base: {
          color: '{colors.text.light}',
          background: '{colors.orangeBoost}',
          border: '{colors.orangeBoost}',
        },
        hover: {
          background: '{colors.orangeBoostLight}',
          border: '{colors.orangeBoostLight}',
        },
      },
      filter: {
        base: {
          color: '{colors.text.dark}',
          background: '{colors.background.contentDark}',
          border: '{colors.background.contentPrimary}',
        },
        hover: {
          color: '{colors.text.middle}',
        },
        active: {
          color: '{colors.text.light}',
          background: '{colors.background.button}',
          border: '{colors.background.contentLight}',
        },
        disabled: {
          color: '{colors.text.middle}',
          border: '{colors.background.contentPrimary}',
        },
      },
      range: {
        base: {
          color: '{colors.text.dark}',
          background: 'transparent',
          border: 'transparent',
        },
        hover: {
          color: '{colors.text.middle}',
        },
        active: {
          color: '{colors.text.light}',
        },
      },
    },
    zIndex: {
      dropdown: 600,
      tooltip: 700,
      version: 800,
      modal: 900,
    },
  }
);

export default defineConfig(config);

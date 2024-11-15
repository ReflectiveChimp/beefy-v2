import { defineConfig, defineTextStyles } from '@pandacss/dev';
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
    jsxStyleProps: 'none',
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
            lg: { value: '16px' },
            sm: { value: '12px' },
          },
          subline: {
            DEFAULT: { value: '15px' },
            lg: { value: '15px' },
            sm: { value: '12px' },
          },
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
            contentDark: { value: '{colors.aa}' },
            contentPrimary: { value: '{colors.ab}' },
            border: { value: '{colors.ai}' },
            button: { value: '{colors.ai}' },
            contentLight: { value: '{colors.ak}' },
          },
          tags: {
            clm: {
              background: { value: '{colors.ax}' },
              text: { value: '{colors.whiteOff}' },
            },
          },
          alert: {
            error: { value: '{colors.redOrange}' },
            warning: { value: '{colors.orangeWarning}' },
            info: { value: '{colors.ax}' },
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
                DEFAULT: { value: '{colors.aa}' },
                title: { value: '{colors.aa}' },
                content: { value: '{colors.aa}' },
                item: { value: '{colors.ab}' },
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
      textStyles: defineTextStyles({
        h1: {
          value: {
            fontSize: '32px',
            lineHeight: '40px',
            fontWeight: 500,
          },
        },
        h2: {
          value: {
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: 500,
          },
        },
        h3: {
          value: {
            fontSize: '21px',
            lineHeight: '24px',
            fontWeight: 500,
          },
        },
        'body-lg': {
          value: {
            fontSize: '16px',
            lineHeight: '24px',
            textTransform: 'none',
            fontWeight: 400,
          },
        },
        'body-lg-med': {
          value: {
            fontSize: '16px',
            lineHeight: '24px',
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        'body-sm': {
          value: {
            fontSize: '12px',
            lineHeight: '20px',
            textTransform: 'none',
            fontWeight: 400,
          },
        },
        'body-sm-med': {
          value: {
            fontSize: '12px',
            lineHeight: '20px',
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        'subline-lg': {
          value: {
            fontSize: '15px',
            lineHeight: '24px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        },
        'subline-sm': {
          value: {
            fontSize: '12px',
            lineHeight: '20px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        },
        inherit: {
          value: {
            fontSize: 'inherit',
            lineHeight: 'inherit',
            fontWeight: 'inherit',
            textTransform: 'inherit',
            letterSpacing: 'inherit',
          },
        },
      }),
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
    buttons: {
      default: {
        base: {
          color: '{colors.text.light}',
          background: '{colors.ai}',
          border: '{colors.ai}',
        },
        hover: {
          background: '{colors.al}',
          border: '{colors.al}',
        },
      },
      light: {
        base: {
          color: '{colors.text.light}',
          background: '{colors.ak}',
          border: '{colors.ak}',
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

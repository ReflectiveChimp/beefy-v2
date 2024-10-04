import { type Config, type CssRule, type SemanticTokens, type Tokens } from '@pandacss/types';
import { defaults, mapValues } from 'lodash';

export type ButtonColors = { color: string; background: string; border: string };
export type Button = {
  base: ButtonColors;
  hover?: Partial<ButtonColors>;
  active?: Partial<ButtonColors>;
  disabled?: Partial<ButtonColors>;
};

const zIndexStride = 1000;

function buildValue(value: string, description?: string): { value: string; description?: string } {
  return description ? { value, description } : { value };
}

function buildButtonState(variant: string, state: string, colors: ButtonColors) {
  return {
    color: buildValue(colors.color, `The color of the ${variant} button in the ${state} state`),
    background: buildValue(
      colors.background,
      `The background color of the ${variant} button in the ${state} state`
    ),
    border: buildValue(
      colors.border,
      `The border color of the ${variant} button in the ${state} state`
    ),
  };
}

function buildButtonsColors(buttons: Record<string, Button>): SemanticTokens['colors'] {
  return mapValues(buttons, (button, variant) => ({
    ...buildButtonState(variant, 'base', button.base),
    hover: buildButtonState(variant, 'hover', defaults(button.hover || {}, button.base)),
    active: buildButtonState(
      variant,
      'active',
      defaults(button.active || {}, button.hover || {}, button.base)
    ),
    disabled: buildButtonState(variant, 'disabled', defaults(button.disabled || {}, button.base)),
  }));
}

function buildButtonsStaticCss(buttons: Record<string, Button>): CssRule | undefined {
  const variants = Object.keys(buttons);
  if (variants.length === 0) {
    return undefined;
  }

  return {
    properties: {
      colorPalette: variants.map(variant => `buttons.${variant}`),
    },
  };
}

function addButtons(config: Config, buttons: Record<string, Button>): Config {
  config.theme ??= {};
  config.theme.semanticTokens ??= {};
  config.theme.semanticTokens.colors ??= {};
  config.theme.semanticTokens.colors.buttons = {
    ...(config.theme.semanticTokens.colors.buttons || {}),
    ...buildButtonsColors(buttons),
  };

  const cssRule = buildButtonsStaticCss(buttons);
  if (cssRule) {
    config.staticCss ??= {};
    config.staticCss.css ??= [];
    config.staticCss.css.push(cssRule);
  }

  return config;
}

function buildZIndex(
  zIndex: Record<string, number>,
  layer: number
): Exclude<Tokens['zIndex'], undefined> {
  const base = layer * zIndexStride;
  return Object.assign(
    { DEFAULT: { value: base, description: `The base z-index of layer ${layer}` } },
    mapValues(zIndex, (value, key) => ({
      value: base + value,
      description: `The z-index of ${key} on layer ${layer}`,
    }))
  );
}

function addZIndex(config: Config, zIndex: Record<string, number>): Config {
  config.theme ??= {};
  config.theme.tokens ??= {};
  config.theme.tokens.zIndex = {
    ...(config.theme.tokens.zIndex || {}),
    ...buildZIndex(zIndex, 0),
    layer1: buildZIndex(zIndex, 1),
    layer2: buildZIndex(zIndex, 2),
  };

  return config;
}

export type BuilderConfig = {
  buttons?: Record<string, Button>;
  zIndex?: Record<string, number>;
};

/** @dev mutates the config */
export function buildConfig(config: Config, builderConfig: BuilderConfig): Config {
  if (builderConfig.buttons) {
    addButtons(config, builderConfig.buttons);
  }
  if (builderConfig.zIndex) {
    addZIndex(config, builderConfig.zIndex);
  }
  return config;
}

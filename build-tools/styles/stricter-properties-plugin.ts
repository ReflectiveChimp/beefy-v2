import type {
  CodegenPrepareHookArgs,
  CssProperties,
  LoggerInterface,
  PandaPlugin,
} from '@pandacss/types';
import type { PandaContext } from '@pandacss/node';

export type StricterPropertiesOptions = {
  [K in keyof CssProperties]?: {
    removeReact?: boolean;
    removeAny?: boolean;
    add?: string[];
  };
};

export const pluginStricterProperties = (options: StricterPropertiesOptions): PandaPlugin => {
  let logger: LoggerInterface;
  let ctx: PandaContext;

  return {
    name: 'stricter-properties',
    hooks: {
      'context:created': context => {
        logger = context.logger;
        // @ts-expect-error
        ctx = context.ctx.processor.context;
      },
      'codegen:prepare': args => {
        return transformPropTypes(args, options, ctx, logger);
      },
    },
  };
};

export const transformPropTypes = (
  args: CodegenPrepareHookArgs,
  options: StricterPropertiesOptions,
  ctx: PandaContext,
  logger?: LoggerInterface
) => {
  const artifact = args.artifacts.find(x => x.id === 'types-styles');
  const content = artifact?.files.find(x => x.file.includes('style-props'));
  if (!content?.code) return args.artifacts;

  const regex = /(\w+)\?: ConditionalValue<(.+)>/g;

  content.code = content.code.replace(
    regex,
    (match: string, maybeShortProp: string, value: string) => {
      const prop = ctx.utility.shorthands.get(maybeShortProp) ?? maybeShortProp;
      const changes = options[prop];
      // Not modified
      if (!changes) return match;
      // Skip complicated types for now (WithEscapeHatch, OnlyKnown etc)
      if (value.includes('<')) return match;

      let types = value.split('|').map(t => t.trim());
      if (changes.removeReact) {
        types = types.filter(t => !t.includes('CssProperties['));
      }
      if (changes.removeAny) {
        types = types.filter(t => t !== 'AnyString');
      }
      if (changes.add) {
        types.push(...changes.add);
      }

      return `${prop}?: ConditionalValue<${types.join(' | ')}>`;
    }
  );

  return args.artifacts;
};

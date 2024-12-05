import type {
  CodegenPrepareHookArgs,
  CssProperties,
  LoggerInterface,
  PandaPlugin,
} from '@pandacss/types';
import type { PandaContext } from '@pandacss/node';

export const pluginMoreTypes = (): PandaPlugin => {
  let logger: LoggerInterface;
  let ctx: PandaContext;

  return {
    name: 'more-types',
    hooks: {
      'context:created': context => {
        logger = context.logger;
        // @ts-expect-error
        ctx = context.ctx.processor.context;
      },
      'codegen:prepare': args => {
        return transformPropTypes(args, ctx, logger);
      },
    },
  };
};

export const transformPropTypes = (
  args: CodegenPrepareHookArgs,
  ctx: PandaContext,
  logger?: LoggerInterface
) => {
  const artifact = args.artifacts.find(x => x.id === 'css-fn');
  const content = artifact?.files.find(x => x.file === 'css.d.ts');
  if (!content?.code) {
    return args.artifacts;
  }

  content.code += `\n\nexport type CssStyles = Styles | Styles[];`;

  for (const artifact of args.artifacts) {
    console.log(artifact.id);
    for (const file of artifact.files) {
      console.log('  ', file.file);
    }
  }

  return args.artifacts;
};

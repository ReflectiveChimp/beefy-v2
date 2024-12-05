import type { SystemStyleObject } from '@repo/styles/types';
import { css } from '@repo/styles/css';

type StylesRecord = Record<string, SystemStyleObject>;

export function legacyMakeStyles(stylesRecord: StylesRecord): () => Record<string, string> {
  const cached: Record<string | symbol, string | undefined> = {};

  return () =>
    new Proxy(stylesRecord, {
      get(target: StylesRecord, p: string | symbol): undefined | string {
        if (typeof p !== 'string') {
          return undefined;
        }

        if (p in cached) {
          return cached[p];
        }

        const styles = target[p];
        if (!styles) {
          return (cached[p] = undefined);
        }

        return (cached[p] = css(styles));
      },
    }) as unknown as Record<string, string>;
}

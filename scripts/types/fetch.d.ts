/**
 * There is no global fetch definition in @types/node@20.4.5 yet
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60924#issuecomment-1563621855
 */
import {
  type FormData as FormDataType,
  type Headers as HeadersType,
  type Request as RequestType,
  type Response as ResponseType,
} from 'undici';

declare global {
  // Re-export undici fetch function and various classes to global scope.
  // These are classes and functions expected to be at global scope according to Node.js v20 API documentation.
  // See: https://nodejs.org/dist/latest-v20.x/docs/api/globals.html#fetch
  export const { FormData, Headers, Request, Response, fetch }: typeof import('undici');

  type FormData = FormDataType;
  type Headers = HeadersType;
  type Request = RequestType;
  type Response = ResponseType;
}

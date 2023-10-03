export function isFulfilledResult<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

export function isRejectedResult<T>(
  result: PromiseSettledResult<T>
): result is PromiseRejectedResult {
  return result.status === 'rejected';
}

/**
 * Like [Promise.all] except it returns all fulfilled results even if some promises reject.
 */
export async function allFulfilled<T>(promises: Promise<T>[]): Promise<T[]> {
  const results = await Promise.allSettled(promises);
  return results.filter(isFulfilledResult).map(result => result.value);
}

export function asyncMap<T, U>(array: T[], mapper: (item: T) => Promise<U>): Promise<U[]> {
  return Promise.all(array.map(mapper));
}

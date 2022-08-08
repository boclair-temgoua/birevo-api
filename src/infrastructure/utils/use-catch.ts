import { ErrorHandler } from '@nestjs/common/interfaces';
export type Nullable<T> = T | null;

export async function useCatch<T>(
  fn: Promise<T>,
): Promise<[Nullable<ErrorHandler>, Nullable<T>]> {
  try {
    const res = await fn;
    return [null, res];
  } catch (error: any) {
    return [error, null];
  }
}

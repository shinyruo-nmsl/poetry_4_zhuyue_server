export type RemoveOptionalKeys<T> = {
  [K in keyof T as Required<T>[K] extends T[K] ? K : never]: T[K];
};

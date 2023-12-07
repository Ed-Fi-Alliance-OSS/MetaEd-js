// This is a generic "brand" type used to create branded types
export type BrandType<K, T> = K & { __brand: T };

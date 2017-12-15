// @flow
import { appendOverlapping } from '../../shared/Utility';

export type ColumnNamer = () => string;

export function defaultColumnNamer(parentContext: string, withContext: string, baseName: string): () => string {
  return () => appendOverlapping(parentContext, appendOverlapping(withContext, baseName));
}

export function withContextIgnoringColumnNamer(parentContext: string, baseName: string): () => string {
  return () => appendOverlapping(parentContext, baseName);
}

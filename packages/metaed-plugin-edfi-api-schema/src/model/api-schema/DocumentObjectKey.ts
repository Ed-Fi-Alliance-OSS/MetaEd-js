import { Brand } from '../BrandType';

/**
 * A string type branded as a DocumentObjectKey, which is standard JSON document object key
 */
export type DocumentObjectKey = Brand<string, 'DocumentObjectKey'>;

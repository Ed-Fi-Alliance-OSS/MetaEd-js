import { BrandType } from './BrandType';

/**
 *  A string type branded as a MetaEdPropertyPath, which is a dot-separated MetaEd property name list
 *  denoting a path from a starting entity through other entities. Role names on a property
 *  are expressed by prefix on the property name. Most commonly used as a merge directive path.
 */
export type MetaEdPropertyPath = BrandType<string, 'MetaEdPropertyPath'>;

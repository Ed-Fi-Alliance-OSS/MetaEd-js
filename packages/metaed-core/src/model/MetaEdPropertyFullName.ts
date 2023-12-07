import { BrandType } from './BrandType';

/**
 * A string type branded as a MetaEdPropertyFullName, which is the full property name of a MetaEd
 * property on a MetaEd entity. Role names on a property are expressed by prefix on the property name.
 */

export type MetaEdPropertyFullName = BrandType<string, 'MetaEdPropertyFullName'>;

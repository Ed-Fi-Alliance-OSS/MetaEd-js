import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as a MetaEdResourceName, which is the name of an API resource. Typically, this is the same
 * as the corresponding MetaEd entity name. However, there are exceptions, for example descriptors have a
 * "Descriptor" suffix on their resource name.
 */

export type MetaEdResourceName = BrandType<string, 'MetaEdResourceName'>;

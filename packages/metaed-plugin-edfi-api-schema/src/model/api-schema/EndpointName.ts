import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as an EndpointName, which is the name of an API resource endpoint. Typically, this is the same
 * as a decapitalized MetaEd entity name. However, there are exceptions, for example descriptors have a
 * "Descriptor" suffix on their endpoint name.
 */
export type EndpointName = BrandType<string, 'EndpointName'>;

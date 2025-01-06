import { MetaEdResourceName } from './api-schema/MetaEdResourceName';
import { Schemas, PathsObject, SchemaObject } from './OpenApiTypes';

export type Exts = { [key: MetaEdResourceName]: SchemaObject };

/**
 * Pieces of OpenApi spec for an extension, to be assembled by DMS
 */
export type ExtensionOpenApiFragments = {
  /**
   * Paths for new extension endpoints
   */
  paths: PathsObject;
  /**
   * Schemas for new extension endpoints
   */
  newSchemas: Schemas;
  /**
   * Exts for extensions to existing data standard entities
   */
  exts: Exts;
  /**
   * Schemas for extensions to existing data standard entities - might be duplicates of what is already in DS OpenApi
   */
  extSchemas: Schemas;
};

export function newExtensionOpenApiFragment(): ExtensionOpenApiFragments {
  return {
    paths: {},
    newSchemas: {},
    exts: {},
    extSchemas: {},
  };
}

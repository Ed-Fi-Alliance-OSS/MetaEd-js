import { MetaEdResourceName } from './api-schema/MetaEdResourceName';
import { Schemas, PathsObject, SchemaObject, TagObject } from './OpenApiTypes';

export type Exts = { [key: MetaEdResourceName]: SchemaObject };

/**
 * Pieces of OpenApi spec for an extension, to be assembled by DMS
 */
export type OpenApiExtensionFragments = {
  /**
   * Paths for new extension endpoints
   */
  newPaths: PathsObject;
  /**
   * Schemas for new extension endpoints
   */
  newSchemas: Schemas;
  /**
   * Exts for extensions to existing data standard entities
   */
  exts: Exts;
  /**
   * Tags for new extension endpoints
   */
  newTags: TagObject[];
};

import { Schemas, PathsObject, TagObject } from './OpenApiTypes';

/**
 * The three sections of an OpenAPI document that need to be filled in
 */
export type SchemasPathsTags = {
  schemas: Schemas;
  paths: PathsObject;
  tags: TagObject[];
};

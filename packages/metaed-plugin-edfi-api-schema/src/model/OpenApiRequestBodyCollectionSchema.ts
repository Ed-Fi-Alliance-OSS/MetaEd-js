import { OpenApiObject } from './OpenApi';

/**
 * The OpenApiProperty defines both a schema and its property name for request body collections
 */

export type OpenApiRequestBodyCollectionSchema = {
  schema: OpenApiObject;
  propertyName: string;
};

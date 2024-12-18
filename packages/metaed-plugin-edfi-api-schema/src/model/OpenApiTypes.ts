/*
The MIT License (MIT)

Copyright (c) 2018 Kogo Software LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// These types are a simplified version of the MIT-licensed https://www.npmjs.com/package/openapi-types
// with ODS/API-specific OpenAPI attributes added.

/* eslint-disable no-use-before-define */

export type Parameter = ReferenceObject | ParameterObject;
export interface Request {
  body?: any;
  headers?: object;
  params?: object;
  query?: object;
}

export interface Document<T extends {} = {}> {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObject<T>;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
}

export interface InfoObject {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;
  version: string;
}

export interface ContactObject {
  name?: string;
  url?: string;
  email?: string;
}

export interface LicenseObject {
  name: string;
  url?: string;
}

export interface ServerObject {
  url: string;
  description?: string;
  variables?: { [variable: string]: ServerVariableObject };
}

export interface ServerVariableObject {
  enum?: string[] | number[];
  default: string | number;
  description?: string;
}

export interface PathsObject<T extends {} = {}, P extends {} = {}> {
  [pattern: string]: (PathItemObject<T> & P) | undefined;
}

export interface ReferenceObject {
  $ref: string;
}

export type PathItemObject<T extends {} = {}> = {
  $ref?: string;
  summary?: string;
  description?: string;
  servers?: ServerObject[];
  parameters?: (ReferenceObject | ParameterObject)[];
  get?: Operation<T>;
  put?: Operation<T>;
  post?: Operation<T>;
  delete?: Operation<T>;
  options?: Operation<T>;
  head?: Operation<T>;
  patch?: Operation<T>;
  trace?: Operation<T>;
};

export type Operation<T extends {} = {}> = {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: (ReferenceObject | ParameterObject)[];
  requestBody?: ReferenceObject | RequestBodyObject;
  responses: ResponsesObject;
  callbacks?: { [callback: string]: ReferenceObject | CallbackObject };
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];
} & T;

export interface ExternalDocumentationObject {
  description?: string;
  url: string;
}

export interface ParameterObject extends ParameterBaseObject {
  name: string;
  in: string;
  'x-Ed-Fi-isIdentity'?: boolean;
}

export interface HeaderObject extends ParameterBaseObject {}

export interface ParameterBaseObject {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: ReferenceObject | SchemaObject;
  example?: any;
  examples?: { [media: string]: ReferenceObject | ExampleObject };
  content?: { [media: string]: MediaTypeObject };
}
export type NonArraySchemaObjectType = 'boolean' | 'object' | 'number' | 'string' | 'integer';
export type ArraySchemaObjectType = 'array';
export type SchemaObject = ArraySchemaObject | NonArraySchemaObject;

export interface ArraySchemaObject extends BaseSchemaObject {
  type: ArraySchemaObjectType;
  items: ReferenceObject | SchemaObject;
}

export interface NonArraySchemaObject extends BaseSchemaObject {
  type?: NonArraySchemaObjectType;
}

export interface BaseSchemaObject {
  // JSON schema allowed properties, adjusted for OpenAPI
  title?: string;
  description?: string;
  format?: string;
  default?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalProperties?: boolean | ReferenceObject | SchemaObject;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
  properties?: {
    [name: string]: ReferenceObject | SchemaObject;
  };
  allOf?: (ReferenceObject | SchemaObject)[];
  oneOf?: (ReferenceObject | SchemaObject)[];
  anyOf?: (ReferenceObject | SchemaObject)[];
  not?: ReferenceObject | SchemaObject;

  // OpenAPI-specific properties
  nullable?: boolean;
  discriminator?: DiscriminatorObject;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: XMLObject;
  externalDocs?: ExternalDocumentationObject;
  example?: any;
  deprecated?: boolean;
}

export interface DiscriminatorObject {
  propertyName: string;
  mapping?: { [value: string]: string };
}

export interface XMLObject {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

export interface ExampleObject {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

export interface MediaTypeObject {
  schema?: ReferenceObject | SchemaObject;
  example?: any;
  examples?: { [media: string]: ReferenceObject | ExampleObject };
  encoding?: { [media: string]: EncodingObject };
}

export interface EncodingObject {
  contentType?: string;
  headers?: { [header: string]: ReferenceObject | HeaderObject };
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

export interface RequestBodyObject {
  description?: string;
  content: { [media: string]: MediaTypeObject };
  required?: boolean;
  'x-bodyName'?: string;
}

export interface ResponsesObject {
  [code: string]: ReferenceObject | ResponseObject;
}

export interface ResponseObject {
  description: string;
  headers?: { [header: string]: ReferenceObject | HeaderObject };
  content?: { [media: string]: MediaTypeObject };
  links?: { [link: string]: ReferenceObject | LinkObject };
}

export interface LinkObject {
  operationRef?: string;
  operationId?: string;
  parameters?: { [parameter: string]: any };
  requestBody?: any;
  description?: string;
  server?: ServerObject;
}

export interface CallbackObject {
  [url: string]: PathItemObject;
}

export interface SecurityRequirementObject {
  [name: string]: string[];
}

export type Schemas = { [key: string]: ReferenceObject | SchemaObject };

export interface ComponentsObject {
  schemas?: Schemas;
  responses?: { [key: string]: ReferenceObject | ResponseObject };
  parameters?: { [key: string]: ReferenceObject | ParameterObject };
  examples?: { [key: string]: ReferenceObject | ExampleObject };
  requestBodies?: { [key: string]: ReferenceObject | RequestBodyObject };
  headers?: { [key: string]: ReferenceObject | HeaderObject };
  securitySchemes?: { [key: string]: ReferenceObject | SecuritySchemeObject };
  links?: { [key: string]: ReferenceObject | LinkObject };
  callbacks?: { [key: string]: ReferenceObject | CallbackObject };
}

export type SecuritySchemeObject = HttpSecurityScheme | ApiKeySecurityScheme | OAuth2SecurityScheme | OpenIdSecurityScheme;

export interface HttpSecurityScheme {
  type: 'http';
  description?: string;
  scheme: string;
  bearerFormat?: string;
}

export interface ApiKeySecurityScheme {
  type: 'apiKey';
  description?: string;
  name: string;
  in: string;
}

export interface OAuth2SecurityScheme {
  type: 'oauth2';
  description?: string;
  flows: {
    implicit?: {
      authorizationUrl: string;
      refreshUrl?: string;
      scopes: { [scope: string]: string };
    };
    password?: {
      tokenUrl: string;
      refreshUrl?: string;
      scopes: { [scope: string]: string };
    };
    clientCredentials?: {
      tokenUrl: string;
      refreshUrl?: string;
      scopes: { [scope: string]: string };
    };
    authorizationCode?: {
      authorizationUrl: string;
      tokenUrl: string;
      refreshUrl?: string;
      scopes: { [scope: string]: string };
    };
  };
}

export interface OpenIdSecurityScheme {
  type: 'openIdConnect';
  description?: string;
  openIdConnectUrl: string;
}

export interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
}

export interface IJsonSchema {
  id?: string;
  $schema?: string;
  title?: string;
  description?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: boolean | IJsonSchema;
  items?: IJsonSchema | IJsonSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | IJsonSchema;
  definitions?: {
    [name: string]: IJsonSchema;
  };
  properties?: {
    [name: string]: IJsonSchema;
  };
  patternProperties?: {
    [name: string]: IJsonSchema;
  };
  dependencies?: {
    [name: string]: IJsonSchema | string[];
  };
  enum?: any[];
  type?: string | string[];
  allOf?: IJsonSchema[];
  anyOf?: IJsonSchema[];
  oneOf?: IJsonSchema[];
  not?: IJsonSchema;
  $ref?: string;
}

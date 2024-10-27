import { MetaEdPropertyFullName, MetaEdProjectName } from '@edfi/metaed-core';
import { EqualityConstraint } from './EqualityConstraint';
import { DocumentPaths } from './DocumentPaths';
import { SchemaRoot } from './JsonSchema';
import { MetaEdResourceName } from './MetaEdResourceName';
import { JsonPath } from './JsonPath';
import { QueryFieldMapping } from './QueryFieldMapping';

/**
 * API resource schema information common between all resources
 */
export type BaseResourceSchema = {
  /**
   * The resource name. Typically, this is the entity metaEdName.
   */
  resourceName: MetaEdResourceName;

  /**
   * The API document JSON schema that corresponds to this resource on insert.
   */
  jsonSchemaForInsert: SchemaRoot;

  /**
   * A list of EqualityConstraints to be applied to a resource document. An EqualityConstraint
   * is a source/target JsonPath pair.
   */
  equalityConstraints: EqualityConstraint[];

  /**
   * A list of the JsonPaths that are of type boolean for use in type coercion.
   */
  booleanJsonPaths: JsonPath[];

  /**
   * A list of the JsonPaths that are numeric for use in type coercion.
   */
  numericJsonPaths: JsonPath[];

  /**
   * A collection of MetaEd property fullnames mapped to DocumentPaths objects,
   * which provide JsonPaths to the corresponding values in a resource document.
   */
  documentPathsMapping: { [key: MetaEdPropertyFullName]: DocumentPaths };
};

/**
 * API resource schema information common between regular and subclass resources for
 * non-extensions
 */
export type NonExtensionResourceSchema = BaseResourceSchema & {
  isResourceExtension: false;

  /**
   * Whether this resource is a descriptor. Descriptors are treated differently from other resources
   */
  isDescriptor: boolean;

  /**
   * Whether this resource is a schoolYearEnumeration. They are treated differently from other resources
   */
  isSchoolYearEnumeration: boolean;

  /**
   * Whether API clients are permitted to modify the identity of an existing resource document.
   */
  allowIdentityUpdates: boolean;

  /**
   * A list of the JsonPaths that are part of the identity for this resource, in lexical order.
   */
  identityJsonPaths: JsonPath[];

  /**
   * A mapping of API query term strings to the JsonPaths in the document that should be part of the query
   */
  queryFieldMapping: QueryFieldMapping;
};

/**
 * The additional ResourceSchema fields for an Association subclass
 */
export type AssociationSubclassResourceSchema = NonExtensionResourceSchema & {
  /**
   * The project name and resource name for the superclass
   */
  superclassProjectName: MetaEdProjectName;
  superclassResourceName: MetaEdResourceName;
};

/**
 * The additional ResourceSchema fields for a DomainEntity subclass
 */
export type DomainEntitySubclassResourceSchema = AssociationSubclassResourceSchema & {
  /**
   * The superclass identity JsonPath, which is the superclass variation of an
   * "identity rename". MetaEd allows a single common identity field rename for a super/subclass
   * relationship of Domain Entities.
   */
  superclassIdentityJsonPath: JsonPath;
};

/**
 * Extension ResourceSchemas are a smaller subset of non-extension ones
 */
export type ResourceExtensionSchema = BaseResourceSchema & {
  isResourceExtension: true;
};

/**
 * API resource schema information as a whole, with "isSubclass" as a differentiator between
 * regular and subclass resources.
 */
export type ResourceSchema =
  | ResourceExtensionSchema
  | (NonExtensionResourceSchema & {
      isSubclass: false;
    })
  | (AssociationSubclassResourceSchema & {
      isSubclass: true;
      subclassType: 'association';
    })
  | (DomainEntitySubclassResourceSchema & {
      isSubclass: true;
      subclassType: 'domainEntity';
    });

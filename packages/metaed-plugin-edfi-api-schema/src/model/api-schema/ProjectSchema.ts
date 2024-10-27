import { MetaEdProjectName } from '@edfi/metaed-core';
import { AbstractResourceMapping } from './AbstractResourceMapping';
import { ResourceNameMapping } from './ResourceNameMapping';
import { ResourceSchema } from './ResourceSchema';
import { ResourceSchemaMapping } from './ResourceSchemaMapping';
import { SemVer } from './SemVer';
import { CaseInsensitiveEndpointNameMapping } from './CaseInsensitiveEndpointNameMapping';

/**
 * API project information
 */
export type ProjectSchema = {
  /**
   * The MetaEd project name the referenced API resource is defined in e.g. "EdFi"
   * for the data standard.
   */
  projectName: MetaEdProjectName;

  /**
   * The MetaEd project version the referenced API resource is defined in. For
   * example, "5.2.0" for a data standard version.
   */
  projectVersion: SemVer;

  /**
   * Whether this is an extension project or a Data Standard project
   */
  isExtensionProject: boolean;

  /**
   * If this is an extension project, provides compatible Data Standards as a semver range.
   * ApiSchema consumers use this to validate extension compatibility.
   */
  compatibleDsRange: SemVer | null;

  /**
   * MetaEd Project description
   */
  description: string;

  /**
   * A collection of EndpointNames mapped to ResourceSchema objects.
   */
  resourceSchemas: ResourceSchemaMapping;

  /**
   * A collection of ResourceNames mapped to EndpointNames
   */
  resourceNameMapping: ResourceNameMapping;

  /**
   * A collection of lowercased EndpointNames mapped to correct-cased EndpointNames,
   * used to allow for case-insensitive endpoints.
   */
  caseInsensitiveEndpointNameMapping: CaseInsensitiveEndpointNameMapping;

  /**
   * SchoolYearEnumeration is not a resource but has a ResourceSchema
   */
  schoolYearEnumeration?: ResourceSchema;

  /**
   * A collection of ResourceNames of abstract resources (that don't materialize to endpoints) mapped to
   * AbstractResourceInfos
   */
  abstractResources: AbstractResourceMapping;
};

export const NoProjectSchema: ProjectSchema = {
  projectName: 'NoProjectName' as MetaEdProjectName,
  projectVersion: '0.0.0' as SemVer,
  isExtensionProject: false,
  compatibleDsRange: null,
  description: 'NoProjectSchema',
  resourceSchemas: {},
  resourceNameMapping: {},
  caseInsensitiveEndpointNameMapping: {},
  abstractResources: {},
};

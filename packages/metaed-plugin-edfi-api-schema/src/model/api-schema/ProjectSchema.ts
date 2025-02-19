import { MetaEdProjectName } from '@edfi/metaed-core';
import { AbstractResourceMapping } from './AbstractResourceMapping';
import { ResourceNameMapping } from './ResourceNameMapping';
import { ResourceSchema } from './ResourceSchema';
import { ResourceSchemaMapping } from './ResourceSchemaMapping';
import { SemVer } from './SemVer';
import { CaseInsensitiveEndpointNameMapping } from './CaseInsensitiveEndpointNameMapping';
import { noDocument, type Document } from '../OpenApiTypes';
import { ProjectEndpointName } from './ProjectEndpointName';
import { EducationOrganizationHierarchy } from '../EducationOrganizationHierarchy';

/**
 * API project information
 */
export type BaseProjectSchema = {
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
   * The URL path component for API endpoints of this project
   * e.g. "ed-fi" for an Ed-Fi data standard version, "tpdm" for a TPDM extension
   */
  projectEndpointName: ProjectEndpointName;

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

  /**
   * The EducationOrganization resource hierarchy
   */
  educationOrganizationHierarchy: EducationOrganizationHierarchy;
};

type CoreProjectSchema = BaseProjectSchema & {
  /**
   * Whether this is an extension project or a Data Standard project
   */
  isExtensionProject: false;

  /**
   * The core OpenApi specification DMS will use as a starting point
   */
  coreOpenApiSpecification: Document;
};

type ExtensionProjectSchema = BaseProjectSchema & {
  /**
   * Whether this is an extension project or a Data Standard project
   */
  isExtensionProject: true;

  /**
   * The extension OpenApi fragments DMS will incorporate into the final OpenApi spec
   */
  openApiExtensionFragments: any;
};

export type ProjectSchema = CoreProjectSchema | ExtensionProjectSchema;

export const NoProjectSchema: ProjectSchema = {
  projectName: 'NoProjectName' as MetaEdProjectName,
  projectVersion: '0.0.0' as SemVer,
  projectEndpointName: 'NoProjectEndpointName' as ProjectEndpointName,
  isExtensionProject: false,
  coreOpenApiSpecification: noDocument,
  compatibleDsRange: null,
  description: 'NoProjectSchema',
  resourceSchemas: {},
  resourceNameMapping: {},
  caseInsensitiveEndpointNameMapping: {},
  abstractResources: {},
  educationOrganizationHierarchy: {},
};

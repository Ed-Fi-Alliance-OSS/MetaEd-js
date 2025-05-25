// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdProjectName, MetaEdPropertyFullName } from '@edfi/metaed-core';
import type { ApiSchema } from '../src/api-schema/ApiSchema';
import type { DocumentPaths } from '../src/api-schema/DocumentPaths';
import type { JsonPath } from '../src/api-schema/JsonPath';
import type { MetaEdResourceName } from '../src/api-schema/MetaEdResourceName';
import type { SemVer } from '../src/api-schema/SemVer';
import type { EqualityConstraint } from '../src/api-schema/EqualityConstraint';
import type { QueryFieldPathInfo } from '../src/api-schema/QueryFieldPathInfo';
import type { ReferenceJsonPaths } from '../src/api-schema/ReferenceJsonPaths';
import type { SchemaRoot } from '../src/api-schema/JsonSchema';
import type { ProjectEndpointName } from '../src/api-schema/ProjectEndpointName';
import type { EducationOrganizationSecurableElement } from '../src/api-schema/EducationOrganizationSecurableElement';
import type { PathType } from '../src/api-schema/PathType';

export type JsonPathAndType = {
  jsonPathString: string;
  type: string;
};

/**
 * This class provides a fluent interface for building an ApiSchema suitable for unit testing,
 * allowing tests to focus on scenarios without getting bogged down in JSON authoring
 */
export class ApiSchemaBuilder {
  private currentProjectNode: any = null;

  private isCoreProject: boolean = false;

  private coreProjectNode: any = null;

  private extensionProjectNodes: any[] = [];

  private currentResourceNode: any = null;

  private currentDocumentPathsMappingNode: any = null;

  private currentQueryFieldMappingNode: any = null;

  /**
   * A static convenience method for getting a new ApiSchemaBuilder.
   */
  static build() {
    return new ApiSchemaBuilder();
  }

  /**
   * A naive decapitalize and pluralize function, which should be adequate for tests
   */
  private static toEndpointName(resourceName: string): string {
    let decapitalized: string;
    if (resourceName.length === 0) {
      decapitalized = resourceName;
    } else if (resourceName.length === 1) {
      decapitalized = resourceName.toLowerCase();
    } else {
      decapitalized = resourceName.charAt(0).toLowerCase() + resourceName.slice(1);
    }
    return `${decapitalized}s`;
  }

  /**
   * Returns a project wrapped with an ApiSchema root.
   */
  private static toApiSchemaRootNode(projectNode: any): any {
    return { apiSchemaVersion: '1.0.0', projectSchema: projectNode };
  }

  /**
   * Returns an array of ApiSchema for the current api schema state
   */
  toApiSchemas(): ApiSchema[] {
    const extensionApiSchemaRootNodes = this.extensionProjectNodes.map(ApiSchemaBuilder.toApiSchemaRootNode);
    return [ApiSchemaBuilder.toApiSchemaRootNode(this.coreProjectNode), ...extensionApiSchemaRootNodes];
  }

  /**
   * Returns the first project as an ApiSchema root node
   */
  asSingleApiSchemaRootNode(): ApiSchema {
    if (this.coreProjectNode != null) {
      return ApiSchemaBuilder.toApiSchemaRootNode(this.coreProjectNode);
    }

    return ApiSchemaBuilder.toApiSchemaRootNode(this.extensionProjectNodes[0]);
  }

  /**
   * Start a project definition. This is the starting point for any api schema,
   * as projects are at the top level and contain all resources.
   * Always end a project definition when finished.
   *
   * projectName should be the ProjectName for a project, e.g. Ed-Fi, TPDM, Michigan
   */
  withStartProject(
    projectName: string = 'Ed-Fi',
    projectVersion: string = '5.0.0',
    abstractResources: any = null,
  ): ApiSchemaBuilder {
    if (this.currentProjectNode != null) {
      throw new Error('Cannot start a new project while another is in progress');
    }

    this.isCoreProject = projectName.toLowerCase() === 'ed-fi';

    this.currentProjectNode = {
      abstractResources: abstractResources ?? {},
      caseInsensitiveEndpointNameMapping: {},
      description: `${projectName} description`,
      isExtensionProject: !this.isCoreProject,
      projectName: projectName as MetaEdProjectName,
      projectVersion: projectVersion as SemVer,
      projectEndpointName: projectName.toLowerCase() as ProjectEndpointName,
      resourceNameMapping: {},
      resourceSchemas: {},
    };

    return this;
  }

  /**
   * Start a resource definition. Can only be done inside a project definition.
   * Always end a resource definition when finished.
   *
   * resourceName should be the MetaEdName for a resource, e.g. School, Student, Course
   */
  withStartResource(
    resourceName: string,
    isSubclass: boolean = false,
    allowIdentityUpdates: boolean = false,
    isDescriptor: boolean = false,
    isSchoolYearEnumeration: boolean = false,
    isResourceExtension: boolean = false,
  ): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot start a resource without an active project');
    }
    if (this.currentResourceNode != null) {
      throw new Error('Cannot start a new resource while another is in progress');
    }

    this.currentResourceNode = {
      allowIdentityUpdates,
      booleanJsonPaths: [],
      dateTimeJsonPaths: [],
      documentPathsMapping: {},
      equalityConstraints: [],
      identityJsonPaths: [],
      isDescriptor,
      isResourceExtension,
      isSchoolYearEnumeration,
      isSubclass,
      jsonSchemaForInsert: {},
      numericJsonPaths: [],
      resourceName: resourceName as MetaEdResourceName,
      queryFieldMapping: {},
      securableElements: { Namespace: [] },
      authorizationPathways: [],
      arrayUniquenessConstraints: [],
    };

    const endpointName = ApiSchemaBuilder.toEndpointName(resourceName);
    this.currentProjectNode.resourceNameMapping[resourceName] = endpointName;
    this.currentProjectNode.resourceSchemas[endpointName] = this.currentResourceNode;
    this.currentProjectNode.caseInsensitiveEndpointNameMapping[endpointName.toLowerCase()] = endpointName;
    return this;
  }

  /**
   * Adds superclass information to a resource
   */
  withSuperclassInformation(
    subclassType: string,
    superclassIdentityJsonPath: string,
    superclassResourceName: string,
    superclassProjectName: string = 'Ed-Fi',
  ): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add superclass information without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add superclass information without an active resource');
    }

    this.currentResourceNode.isSubclass = true;
    this.currentResourceNode.superclassIdentityJsonPath = superclassIdentityJsonPath as JsonPath;
    this.currentResourceNode.subclassType = subclassType;
    this.currentResourceNode.superclassProjectName = superclassProjectName as MetaEdProjectName;
    this.currentResourceNode.superclassResourceName = superclassResourceName as MetaEdResourceName;

    return this;
  }

  /**
   * Adds an identityJsonPaths section to a resource
   */
  withIdentityJsonPaths(identityJsonPaths: string[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add identity paths without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add identity paths without an active resource');
    }

    this.currentResourceNode.identityJsonPaths = identityJsonPaths.map((x) => x as JsonPath);

    return this;
  }

  /**
   * Adds a booleanJsonPaths section to a resource
   */
  withBooleanJsonPaths(booleanJsonPaths: string[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add boolean paths without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add boolean paths without an active resource');
    }

    this.currentResourceNode.booleanJsonPaths = booleanJsonPaths.map((x) => x as JsonPath);

    return this;
  }

  /**
   * Adds a numericJsonPaths section to a resource
   */
  withNumericJsonPaths(numericJsonPaths: string[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add numeric paths without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add numeric paths without an active resource');
    }

    this.currentResourceNode.numericJsonPaths = numericJsonPaths.map((x) => x as JsonPath);

    return this;
  }

  /**
   * Adds a dateTimeJsonPaths section to a resource
   */
  withDateTimeJsonPaths(dateTimeJsonPaths: string[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add dateTime paths without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add dateTime paths without an active resource');
    }

    this.currentResourceNode.dateTimeJsonPaths = dateTimeJsonPaths.map((x) => x as JsonPath);

    return this;
  }

  /**
   * Adds a NamespaceSecurityElements section to a resource
   */
  withNamespaceSecurityElements(jsonPaths: string[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add namespace security elements without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add namespace security elements without an active resource');
    }

    this.currentResourceNode.securableElements.Namespace = jsonPaths.map((x) => x as JsonPath);

    return this;
  }

  /**
   * Adds a EducationOrganizationSecurityElements section to a resource
   */
  withEducationOrganizationSecurityElements(jsonPaths: [string, string][]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add education organization security elements without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add education organization security elements without an active resource');
    }

    this.currentResourceNode.securableElements.EducationOrganization = jsonPaths.map(
      (x) =>
        ({
          metaEdName: x[0] as MetaEdResourceName,
          jsonPath: x[1] as JsonPath,
        } as EducationOrganizationSecurableElement),
    );

    return this;
  }

  /**
   * Adds a StudentSecurityElements section to a resource
   */
  withStudentSecurityElements(jsonPaths: string[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add student security elements without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add student security elements without an active resource');
    }

    this.currentResourceNode.securableElements.Student = jsonPaths.map((x) => x as JsonPath);

    return this;
  }

  /**
   * Adds a ContactSecurityElements section to a resource
   */
  withContactSecurityElements(jsonPaths: string[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add contact security elements without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add contact security elements without an active resource');
    }

    this.currentResourceNode.securableElements.Contact = jsonPaths.map((x) => x as JsonPath);

    return this;
  }

  /**
   * Adds a StaffSecurityElements section to a resource
   */
  withStaffSecurityElements(jsonPaths: string[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add staff security elements without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add staff security elements without an active resource');
    }

    this.currentResourceNode.securableElements.Staff = jsonPaths.map((x) => x as JsonPath);

    return this;
  }

  /**
   * Adds an AuthorizationPathways section to a resource
   */
  withAuthorizationPathways(authorizationPathways: string[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add authorization pathways without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add authorization pathways without an active resource');
    }

    this.currentResourceNode.authorizationPathways = authorizationPathways;

    return this;
  }

  /**
   * Define resource schema. Can only be done inside a project definition.
   * Always end a resource definition when finished.
   *
   * resourceSchema should contain schema definition for insert.
   */
  withJsonSchemaForInsert(jsonSchema: SchemaRoot): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add JSON schema without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add JSON schema without an active resource');
    }
    this.currentResourceNode.jsonSchemaForInsert = jsonSchema;

    return this;
  }

  /**
   * Start a document paths mapping definition. Can only be done inside a resource definition.
   * Always end when finished.
   */
  withStartDocumentPathsMapping(): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot start document paths mapping without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot start document paths mapping without an active resource');
    }

    this.currentDocumentPathsMappingNode = this.currentResourceNode.documentPathsMapping;
    return this;
  }

  /**
   * Start a query field mapping definition. Can only be done inside a resource definition.
   * Always end when finished.
   */
  withStartQueryFieldMapping(): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot start query field mapping without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot start query field mapping without an active resource');
    }

    this.currentQueryFieldMappingNode = this.currentResourceNode.queryFieldMapping;
    return this;
  }

  /**
   * Adds a DocumentPath to a DocumentPathsMapping for a scalar path
   *
   * Example for parameters ("OfficialAttendancePeriod", "$.officialAttendancePeriod")
   *
   * "OfficialAttendancePeriod": {
   *   "isReference": false,
   *   "path": "$.officialAttendancePeriod"
   * },
   */
  withDocumentPathScalar(pathFullName: string, jsonPath: string): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add document path scalar without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add document path scalar without an active resource');
    }
    if (this.currentDocumentPathsMappingNode == null) {
      throw new Error('Cannot add document path scalar without an active document paths mapping');
    }

    this.currentDocumentPathsMappingNode[pathFullName as MetaEdPropertyFullName] = {
      isReference: false,
      path: jsonPath as JsonPath,
    } as DocumentPaths;

    return this;
  }

  /**
   * Adds a DocumentPath to a DocumentPathsMapping for a reference path. Makes some
   * simplifying assumptions.
   *
   * Example for parameters: (
   *   "CourseOffering",
   *   [
   *       ["$.localCourseCode", "$.courseOfferingReference.localCourseCode"],
   *       ["$.schoolReference.schoolId", "$.courseOfferingReference.schoolId"],
   *       ["$.sessionReference.schoolYear", "$.courseOfferingReference.schoolYear"],
   *       ["$.sessionReference.sessionName", "$.courseOfferingReference.sessionName"]
   *   ]
   * )
   */
  withDocumentPathReference(
    pathFullName: string,
    referenceJsonPaths: [string, string][],
    referenceProjectName: string = 'Ed-Fi',
    isRequired: boolean = false,
  ): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add document path reference without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add document path reference without an active resource');
    }
    if (this.currentDocumentPathsMappingNode == null) {
      throw new Error('Cannot add document path reference without an active document paths mapping');
    }

    this.currentDocumentPathsMappingNode[pathFullName as MetaEdPropertyFullName] = {
      isReference: true,
      isRequired,
      isDescriptor: false,
      projectName: referenceProjectName as MetaEdProjectName,
      resourceName: pathFullName as MetaEdResourceName,
      referenceJsonPaths: referenceJsonPaths.map(
        (x) =>
          ({
            identityJsonPath: x[0] as JsonPath,
            referenceJsonPath: x[1] as JsonPath,
          } as ReferenceJsonPaths),
      ),
    } as DocumentPaths;

    return this;
  }

  /**
   * Adds a DocumentPath to a DocumentPathsMapping for a descriptor path
   *
   * Example for parameters ("GradingPeriodDescriptor", "$.gradingPeriodDescriptor")
   *
   * "GradingPeriodDescriptor": {
   *   "isReference": false,
   *   "isDescriptor": true,
   *   "path": "$.officialAttendancePeriod",
   *   "projectName": "Ed-Fi",
   *   "resourceName": "CourseOffering"
   * },
   */
  withDocumentPathDescriptor(
    pathFullName: string,
    jsonPath: string,
    referenceProjectName: string = 'Ed-Fi',
  ): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add document path descriptor without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add document path descriptor without an active resource');
    }
    if (this.currentDocumentPathsMappingNode == null) {
      throw new Error('Cannot add document path descriptor without an active document paths mapping');
    }

    this.currentDocumentPathsMappingNode[pathFullName as MetaEdPropertyFullName] = {
      isReference: true,
      isRequired: false,
      isDescriptor: true,
      projectName: referenceProjectName as MetaEdProjectName,
      resourceName: pathFullName as MetaEdResourceName,
      path: jsonPath as JsonPath,
      type: 'string' as PathType,
    } as DocumentPaths;

    return this;
  }

  withEqualityConstraints(equalityConstraints: EqualityConstraint[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add equality constraints without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add equality constraints without an active resource');
    }

    this.currentResourceNode.equalityConstraints = equalityConstraints;

    return this;
  }

  /**
   * Adds a query field to a query field mapping with the given query field name
   * and array of JsonPaths and types
   *
   * Example for parameters "studentUniqueId", [{jsonPathString: "$.studentReference.studentUniqueId", type: "string"}]
   *
   * "studentUniqueId": [
   *   "path": "$.studentReference.studentUniqueId",
   *   "type": "string"
   * ],
   *
   */
  withQueryField(fieldName: string, jsonPathAndTypes: JsonPathAndType[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add query field without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot add query field without an active resource');
    }
    if (this.currentQueryFieldMappingNode == null) {
      throw new Error('Cannot add query field without an active query field mapping');
    }

    this.currentQueryFieldMappingNode[fieldName] = jsonPathAndTypes.map(
      (x) => ({ path: x.jsonPathString as JsonPath, type: x.type } as QueryFieldPathInfo),
    );

    return this;
  }

  /**
   * End a document paths mapping definition.
   */
  withEndDocumentPathsMapping(): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot end document paths mapping without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot end document paths mapping without an active resource');
    }
    if (this.currentDocumentPathsMappingNode == null) {
      throw new Error('Cannot end document paths mapping without an active mapping');
    }

    this.currentDocumentPathsMappingNode = null;
    return this;
  }

  /**
   * End a query field mapping definition.
   */
  withEndQueryFieldMapping(): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot end query field mapping without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot end query field mapping without an active resource');
    }
    if (this.currentQueryFieldMappingNode == null) {
      throw new Error('Cannot end query field mapping without an active mapping');
    }

    this.currentQueryFieldMappingNode = null;
    return this;
  }

  /**
   * End a resource definition.
   */
  withEndResource(): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot end resource without an active project');
    }
    if (this.currentResourceNode == null) {
      throw new Error('Cannot end resource without an active resource');
    }

    this.currentResourceNode = null;
    return this;
  }

  /**
   * End a project definition.
   */
  withEndProject(): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot end project without an active project');
    }

    if (this.isCoreProject) {
      this.coreProjectNode = this.currentProjectNode;
    } else {
      this.extensionProjectNodes.push(this.currentProjectNode);
    }

    this.currentProjectNode = null;
    return this;
  }

  /**
   * Adds a core OpenAPI CoreResources to a project definition.
   */
  withOpenApiCoreResources(schemas: any, paths: any, tags: any[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add OpenAPI core resources without an active project');
    }

    this.currentProjectNode.openApiCoreResources = {
      components: { schemas },
      paths,
      tags,
    };
    return this;
  }

  /**
   * Adds a core OpenAPI Descriptors to a project definition.
   */
  withOpenApiCoreDescriptors(schemas: any, paths: any, tags: any[]): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add OpenAPI core descriptors without an active project');
    }

    this.currentProjectNode.openApiCoreDescriptors = {
      components: { schemas },
      paths,
      tags,
    };
    return this;
  }

  /**
   * Adds OpenAPI extension Resource fragments to a project definition.
   */
  withOpenApiExtensionResourceFragments(exts: any, newPaths: any, newSchemas: any, newTags: any): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add OpenAPI extension resource fragments without an active project');
    }

    this.currentProjectNode.openApiExtensionResourceFragments = {
      exts,
      newPaths,
      newSchemas,
      newTags,
    };
    return this;
  }

  /**
   * Adds OpenAPI Extension Descriptor fragments to a project definition.
   */
  withOpenApiExtensionDescriptorFragments(exts: any, newPaths: any, newSchemas: any, newTags: any): ApiSchemaBuilder {
    if (this.currentProjectNode == null) {
      throw new Error('Cannot add OpenAPI extension descriptor fragments without an active project');
    }

    this.currentProjectNode.openApiExtensionDescriptorFragments = {
      exts,
      newPaths,
      newSchemas,
      newTags,
    };
    return this;
  }
}

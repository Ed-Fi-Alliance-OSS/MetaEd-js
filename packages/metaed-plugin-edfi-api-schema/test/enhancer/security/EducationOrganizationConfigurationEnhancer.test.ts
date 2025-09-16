// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  newMetaEdEnvironment,
  newPluginEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  DescriptorBuilder,
  DomainEntitySubclassBuilder,
  newDomainEntitySubclass,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, descriptorReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../../src/model/Namespace';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as resourceNameEnhancer } from '../../../src/enhancer/ResourceNameEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance } from '../../../src/enhancer/security/EducationOrganizationConfigurationEnhancer';

function runEnhancers(metaEd: MetaEdEnvironment) {
  namespaceSetupEnhancer(metaEd);
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  subclassPropertyNamingCollisionEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  subclassApiEntityMappingEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
  enhance(metaEd);
}

describe('when processing DisciplineAction configuration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '4.0.0-a';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Student')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withDescriptorIdentity('SchoolType', 'doc')
      .withEndDomainEntity()

      .withStartDescriptor('SchoolType')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDomainEntity('DisciplineAction')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', 'Responsibility')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    // Inject configuration as would be done by the configuration system
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('DisciplineAction');
    if (entity) {
      entity.config = {
        edfiApiSchema: {
          versionRange: '>=4.0.0-a',
          securableElements: [
            {
              propertyPath: 'ResponsibilitySchool',
              requiredIdentityProperty: 'SchoolId',
              description: 'Maps ResponsibilitySchool reference to SchoolId for security',
            },
          ],
        },
      };
    }

    runEnhancers(metaEd);
  });

  it('should have ResponsibilitySchool security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('DisciplineAction');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.responsibilitySchoolReference.schoolId",
          "metaEdName": "ResponsibilitySchool",
        },
      ]
    `);
  });
});

describe('when processing StudentAssessment configuration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '4.0.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withDescriptorIdentity('SchoolType', 'doc')
      .withEndDomainEntity()

      .withStartDescriptor('SchoolType')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDomainEntity('StudentAssessment')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', 'Reported')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    // Inject configuration
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentAssessment');
    if (entity) {
      entity.config = {
        edfiApiSchema: {
          versionRange: '>=4.0.0',
          securableElements: [
            {
              propertyPath: 'ReportedSchool',
              requiredIdentityProperty: 'SchoolId',
              description: 'Maps ReportedSchool reference to SchoolId for security',
            },
          ],
        },
      };
    }

    runEnhancers(metaEd);
  });

  it('should have ReportedSchool security elements', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentAssessment');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.reportedSchoolReference.schoolId",
          "metaEdName": "ReportedSchool",
        },
      ]
    `);
  });
});

describe('when processing OrganizationDepartment with replace mode', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '3.3.0-a';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('EducationOrganization')
      .withDocumentation('doc')
      .withStringIdentity('EducationOrganizationId', 'doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass('OrganizationDepartment', 'EducationOrganization')
      .withDocumentation('doc')
      .withDomainEntityIdentity('EducationOrganization', 'doc', 'Parent')
      .withEndDomainEntitySubclass()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    // Add some default security elements first
    const entity =
      metaEd.namespace.get(namespaceName)?.entity.domainEntitySubclass.get('OrganizationDepartment') ??
      newDomainEntitySubclass();

    // Initialize data structure
    namespaceSetupEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);

    // Add default elements that should be replaced
    (entity.data.edfiApiSchema as EntityApiSchemaData).educationOrganizationSecurableElements.push({
      metaEdName: 'DefaultElement',
      jsonPath: '$.defaultPath' as any,
    });

    // Inject configuration with replace mode
    entity.config = {
      edfiApiSchema: {
        versionRange: '>=3.3.0-a',
        mode: 'replace',
        securableElements: [
          {
            propertyPath: 'ParentEducationOrganization',
            requiredIdentityProperty: 'EducationOrganizationId',
            description: 'Replaces default security to use parent organization',
          },
        ],
      },
    };

    runEnhancers(metaEd);
  });

  it('should replace existing security elements with ParentEducationOrganization', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntitySubclass.get('OrganizationDepartment');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toMatchInlineSnapshot(`
      Array [
        Object {
          "jsonPath": "$.parentEducationOrganizationReference.educationOrganizationId",
          "metaEdName": "ParentEducationOrganization",
        },
      ]
    `);
  });
});

describe('when configuration has version constraint that does not match', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '3.0.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntity('DisciplineAction')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', 'Responsibility')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);

    // Inject configuration with version constraint that doesn't match
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('DisciplineAction');
    if (entity) {
      entity.config = {
        edfiApiSchema: {
          versionRange: '>=4.0.0-a',
          securableElements: [
            {
              propertyPath: 'ResponsibilitySchool',
              requiredIdentityProperty: 'SchoolId',
              description: 'Should not be applied due to version constraint',
            },
          ],
        },
      };
    }

    runEnhancers(metaEd);
  });

  it('should not add security elements due to version constraint', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('DisciplineAction');
    const { educationOrganizationSecurableElements } = entity?.data.edfiApiSchema as EntityApiSchemaData;
    expect(educationOrganizationSecurableElements).toHaveLength(0);
  });
});

describe('when configuration references missing property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '4.0.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntity('DisciplineAction')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', 'Responsibility')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);

    // Inject configuration with invalid property path
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('DisciplineAction');
    if (entity) {
      entity.config = {
        edfiApiSchema: {
          securableElements: [
            {
              propertyPath: 'NonExistentProperty',
              requiredIdentityProperty: 'SchoolId',
              description: 'Invalid property',
            },
          ],
        },
      };
    }
  });

  it('should throw error for missing property', () => {
    expect(() => runEnhancers(metaEd)).toThrow(
      `EducationOrganizationConfigurationEnhancer: Property 'NonExistentProperty' not found on entity 'DisciplineAction'`,
    );
  });
});

describe('when configuration references missing required identity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  metaEd.dataStandardVersion = '4.0.0';
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('ParentSchoolId', 'doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntity('DisciplineAction')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc', 'Responsibility')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);

    // Inject configuration with invalid required identity property
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('DisciplineAction');
    if (entity) {
      entity.config = {
        edfiApiSchema: {
          securableElements: [
            {
              propertyPath: 'ResponsibilitySchool',
              requiredIdentityProperty: 'SchoolId',
              description: 'Missing required identity property',
            },
          ],
        },
      };
    }
  });

  it('should throw error for missing required identity property', () => {
    expect(() => runEnhancers(metaEd)).toThrow(
      `EducationOrganizationConfigurationEnhancer: Required identity property 'SchoolId' not found in 'ResponsibilitySchool' on entity 'DisciplineAction'`,
    );
  });
});

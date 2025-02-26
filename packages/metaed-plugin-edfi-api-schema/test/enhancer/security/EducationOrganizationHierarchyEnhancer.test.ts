import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newPluginEnvironment,
  DomainEntitySubclassBuilder,
  DescriptorBuilder,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, domainEntitySubclassBaseClassEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../../src/model/Namespace';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance } from '../../../src/enhancer/security/EducationOrganizationHierarchyEnhancer';

function runEnhancers(metaEd: MetaEdEnvironment) {
  domainEntityReferenceEnhancer(metaEd);
  domainEntitySubclassBaseClassEnhancer(metaEd);

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
  enhance(metaEd);
}

describe('when building an EdOrg hierarchy with only EducationOrganization', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have EducationOrganizationTypes', () => {
    const educationOrganizationTypes = metaEd.namespace.get(namespaceName)?.data.educationOrganizationTypes;
    expect(educationOrganizationTypes).toMatchInlineSnapshot(`
      Array [
        "EducationOrganization",
      ]
    `);
  });

  it('should have EducationOrganizationHierarchy', () => {
    const educationOrganizationHierarchy = metaEd.namespace.get(namespaceName)?.data.educationOrganizationHierarchy;
    expect(educationOrganizationHierarchy).toMatchInlineSnapshot(`
      Object {
        "EducationOrganization": Array [],
      }
    `);
  });
});

describe('when building an EdOrg hierarchy with EducationOrganization subclasses', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have EducationOrganizationTypes', () => {
    const educationOrganizationTypes = metaEd.namespace.get(namespaceName)?.data.educationOrganizationTypes;
    expect(educationOrganizationTypes).toMatchInlineSnapshot(`
      Array [
        "School",
        "EducationOrganization",
      ]
    `);
  });

  it('should have EducationOrganizationHierarchy', () => {
    const educationOrganizationHierarchy = metaEd.namespace.get(namespaceName)?.data.educationOrganizationHierarchy;
    expect(educationOrganizationHierarchy).toMatchInlineSnapshot(`
      Object {
        "EducationOrganization": Array [],
        "School": Array [],
      }
    `);
  });
});

describe('when building an EdOrg hierarchy with EducationOrganization subclasses', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('LocalEducationAgency', 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('LocalEducationAgencyId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'doc')
      .withDomainEntityProperty('LocalEducationAgency', 'doc', false, false)
      .withEndDomainEntitySubclass()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runEnhancers(metaEd);
  });

  it('should have EducationOrganizationTypes', () => {
    const educationOrganizationTypes = metaEd.namespace.get(namespaceName)?.data.educationOrganizationTypes;
    expect(educationOrganizationTypes).toMatchInlineSnapshot(`
      Array [
        "LocalEducationAgency",
        "School",
        "EducationOrganization",
      ]
    `);
  });

  it('should have EducationOrganizationHierarchy', () => {
    const educationOrganizationHierarchy = metaEd.namespace.get(namespaceName)?.data.educationOrganizationHierarchy;
    expect(educationOrganizationHierarchy).toMatchInlineSnapshot(`
      Object {
        "EducationOrganization": Array [],
        "LocalEducationAgency": Array [],
        "School": Array [
          "LocalEducationAgency",
        ],
      }
    `);
  });
});

import {
  newMetaEdEnvironment,
  newDomainEntity,
  newInlineCommon,
  newInlineCommonProperty,
  newStringProperty,
  newNamespace,
  EntityProperty,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Common, DomainEntity, Namespace } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/AddInlineIdentityEnhancer';

describe('when enhancing domainEntity with inline string property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const inlineName = 'InlineName';
  const entityName = 'EntityName';
  const propertyName1 = 'PropertyName1';
  const propertyName2 = 'PropertyName2';

  beforeAll(() => {
    const properties = [
      { ...newStringProperty(), metaEdName: propertyName1, namespace, isPartOfIdentity: false },
      { ...newStringProperty(), metaEdName: propertyName2, namespace, isPartOfIdentity: true },
    ];

    const inlineCommon: Common = {
      ...newInlineCommon(),
      metaEdName: inlineName,
      namespace,
      inlineInOds: true,
      properties,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.common.set(inlineCommon.metaEdName, inlineCommon);

    const domainEntity: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: entityName,
      namespace,
      properties: [
        {
          ...newInlineCommonProperty(),
          metaEdName: inlineName,
          referencedNamespaceName: namespace.namespaceName,
          namespace,
          referencedEntity: inlineCommon,
        } as EntityProperty,
      ],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should add identity properties to domainEntity', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(entityName);
    expect(domainEntity.properties[0].type).toBe('inlineCommon');
    expect(domainEntity.data.edfiXsd.xsdIdentityProperties.length).toBe(1);
    expect(domainEntity.data.edfiXsd.xsdIdentityProperties[0].metaEdName).toBe(propertyName2);
  });
});

describe('when enhancing domainEntity with inline nested string property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const inline1Name = 'Inline1Name';
  const inline2Name = 'Inline2Name';
  const entityName = 'EntityName';
  const property1Name = 'Property1Name';
  const property2Name = 'Property2Name';

  beforeAll(() => {
    const inlineCommon2: Common = {
      ...newInlineCommon(),
      metaEdName: inline2Name,
      namespace,
      inlineInOds: true,
      properties: [{ ...newStringProperty(), metaEdName: property1Name, namespace, isPartOfIdentity: true }],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.common.set(inlineCommon2.metaEdName, inlineCommon2);

    const inlineCommon1: Common = {
      ...newInlineCommon(),
      metaEdName: inline1Name,
      namespace,
      inlineInOds: true,
      properties: [
        {
          ...newInlineCommonProperty(),
          metaEdName: inline2Name,
          referencedNamespaceName: namespace.namespaceName,
          namespace,
          referencedEntity: inlineCommon2,
        } as EntityProperty,
        { ...newStringProperty(), metaEdName: property2Name, namespace, isPartOfIdentity: true },
      ],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.common.set(inlineCommon1.metaEdName, inlineCommon1);

    const domainEntity: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: entityName,
      namespace,
      properties: [
        {
          ...newInlineCommonProperty(),
          metaEdName: inline1Name,
          referencedNamespaceName: namespace.namespaceName,
          namespace,
          referencedEntity: inlineCommon1,
        } as EntityProperty,
      ],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should add identity properties to domainEntity', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(entityName);
    expect(domainEntity.properties[0].type).toBe('inlineCommon');
    expect(domainEntity.data.edfiXsd.xsdIdentityProperties.length).toBe(2);
    expect(domainEntity.data.edfiXsd.xsdIdentityProperties[0].metaEdName).toBe(property2Name);
    expect(domainEntity.data.edfiXsd.xsdIdentityProperties[1].metaEdName).toBe(property1Name);
  });
});

import R from 'ramda';
import { DomainEntity, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newBooleanProperty, newDomainEntity, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { newComplexType, NoComplexType } from '../../src/model/schema/ComplexType';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { enhance } from '../../src/diminisher/AddLookupTypesDiminisher';

describe('when AddLookupTypesDiminisher diminishes entity included in lookupTypeNames list', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName1 = 'Assessment';
  const booleanPropertyName1 = 'BooleanPropertyName1';
  const booleanPropertyType = 'BooleanPropertyType';
  const booleanPropertyDocumentation = 'BooleanPropertyDocumentation';
  const typeGroup = 'Lookup';
  let entity: DomainEntity;

  beforeAll(() => {
    const domainEntity1: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntityName1,
      namespace,
      data: {
        edfiXsd: {
          xsdReferenceType: { ...newComplexType(), name: `${domainEntityName1}Reference` },
        },
      },
      queryableFields: [
        {
          ...newBooleanProperty(),
          documentation: booleanPropertyDocumentation,
          isRequiredCollection: true,
          data: {
            edfiXsd: {
              xsdName: booleanPropertyName1,
              xsdType: booleanPropertyType,
            },
          },
        },
      ],
    };
    namespace.entity.domainEntity.set(domainEntityName1, domainEntity1);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);

    entity = namespace.entity.domainEntity.get(domainEntityName1) as DomainEntity;
    expect(entity).toBeDefined();
  });

  it('should have lookup type', (): void => {
    expect(entity.data.edfiXsd.xsdLookupType).toBeTruthy();
    expect(entity.data.edfiXsd.xsdLookupType).not.toBe(NoComplexType);
  });

  it('should have lookup type name', (): void => {
    expect(entity.data.edfiXsd.xsdLookupType.name).toBe(`${domainEntityName1}${typeGroup}Type`);
  });

  it('should have lookup type annotation documentation', (): void => {
    expect(entity.data.edfiXsd.xsdLookupType.annotation.documentation).toBeTruthy();
    expect(entity.data.edfiXsd.xsdLookupType.annotation.documentation).toMatchSnapshot();
  });

  it('should have lookup type type group', (): void => {
    expect(entity.data.edfiXsd.xsdLookupType.annotation.typeGroup).toBe(typeGroup);
  });

  it('should have no lookup type base type', (): void => {
    expect(entity.data.edfiXsd.xsdLookupType.baseType).toBeFalsy();
  });

  it('should have lookup type item', (): void => {
    expect(entity.data.edfiXsd.xsdLookupType.items).toHaveLength(1);
    expect(R.head(entity.data.edfiXsd.xsdLookupType.items)).toBeTruthy();
  });

  it('should have lookup type item name', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdLookupType.items).name).toBe(booleanPropertyName1);
  });

  it('should have lookup type item type', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdLookupType.items).type).toBe(booleanPropertyType);
  });

  it('should have lookup type item annotation', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdLookupType.items).annotation).toBeTruthy();
  });

  it('should have lookup type item annotation documentation', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdLookupType.items).annotation.documentation).toBe(booleanPropertyDocumentation);
  });

  it('should have no lookup type item annotation descriptorName', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdLookupType.items).annotation.descriptorName).toBeFalsy();
  });

  it('should have lookup type item minOccurs', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdLookupType.items).minOccurs).toBe('0');
  });

  it('should have lookup type item maxOccursIsUnbounded', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdLookupType.items).maxOccursIsUnbounded).toBe(false);
  });

  it('should have reference type', (): void => {
    expect(entity.data.edfiXsd.xsdReferenceType).toBeTruthy();
    expect(entity.data.edfiXsd.xsdReferenceType).not.toBe(NoComplexType);
  });

  it('should have reference type item', (): void => {
    expect(entity.data.edfiXsd.xsdReferenceType.items).toHaveLength(1);
    expect(R.head(entity.data.edfiXsd.xsdReferenceType.items)).toBeTruthy();
  });

  it('should have reference type item name', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdReferenceType.items).name).toBe(`${domainEntityName1}${typeGroup}`);
  });

  it('should have reference type item type', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdReferenceType.items).type).toBe(`${domainEntityName1}${typeGroup}Type`);
  });

  it('should have reference type item annotation', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdReferenceType.items).annotation).toBeTruthy();
  });

  it('should have reference type item annotation documentation', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdReferenceType.items).annotation.documentation).toBe(
      entity.data.edfiXsd.xsdLookupType.annotation.documentation,
    );
  });

  it('should have no reference type item annotation descriptorName', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdReferenceType.items).annotation.descriptorName).toBeFalsy();
  });

  it('should have reference type item minOccurs', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdReferenceType.items).minOccurs).toBe('0');
  });

  it('should have reference type item maxOccursIsUnbounded', (): void => {
    expect(R.head(entity.data.edfiXsd.xsdReferenceType.items).maxOccursIsUnbounded).toBe(false);
  });
});

describe('when AddLookupTypesDiminisher diminishes entity not included in lookupTypeNames list', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = {
    ...newNamespace(),
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);
  const domainEntityName1 = 'DomainEntityName1';
  let entity: DomainEntity;

  beforeAll(() => {
    const domainEntity1: DomainEntity = {
      ...newDomainEntity(),
      namespace: extensionNamespace,
      metaEdName: domainEntityName1,
      data: {
        edfiXsd: {
          xsdReferenceType: { ...newComplexType(), name: `${domainEntityName1}Reference` },
        },
      },
      queryableFields: [
        {
          ...newBooleanProperty(),
          documentation: 'BooleanPropertyDocumentation',
          isRequiredCollection: true,
          data: {
            edfiXsd: {
              xsdName: 'BooleanPropertyName1',
              xsdType: 'BooleanPropertyType',
            },
          },
        },
      ],
    };
    extensionNamespace.entity.domainEntity.set(domainEntityName1, domainEntity1);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);

    entity = extensionNamespace.entity.domainEntity.get(domainEntityName1) as DomainEntity;
    expect(entity).toBeDefined();
  });

  it('should have no lookup type', (): void => {
    expect(entity.data.edfiXsd.xsdLookupType).toBeTruthy();
    expect(entity.data.edfiXsd.xsdLookupType).toBe(NoComplexType);
  });

  it('should have no lookup type item', (): void => {
    expect(entity.data.edfiXsd.xsdLookupType.items).toHaveLength(0);
  });

  it('should have no reference type', (): void => {
    expect(entity.data.edfiXsd.xsdReferenceType).toBeTruthy();
    expect(entity.data.edfiXsd.xsdReferenceType).toBe(NoComplexType);
  });

  it('should have no reference type item', (): void => {
    expect(entity.data.edfiXsd.xsdReferenceType.items).toHaveLength(0);
  });
});

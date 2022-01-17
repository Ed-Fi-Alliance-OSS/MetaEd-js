import {
  addEntityForNamespace,
  newDescriptor,
  newEnumerationItem,
  newMapTypeEnumeration,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import { Descriptor, EnumerationItem, MapTypeEnumeration, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { rowEntities } from '../../src/enhancer/EnhancerHelper';
import { enhance } from '../../src/enhancer/DescriptorMapTypeRowEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';

describe('when DescriptorMapTypeRowEnhancer enhances map type descriptor', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const entityName = 'EntityName';
  const itemDocumentation1 = 'ItemDocumentation1';
  const shortDescription1 = 'ShortDescription1';

  beforeAll(() => {
    const entity: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: entityName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsIsMapType: true,
          odsTableId: entityName,
        },
      },
    });
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: `${entityName}Map`,
      namespace,
    });
    const item1: EnumerationItem = Object.assign(newEnumerationItem(), {
      documentation: itemDocumentation1,
      shortDescription: shortDescription1,
      namespace,
    });
    mapTypeEnumeration.enumerationItems.push(item1);
    entity.mapTypeEnumeration = mapTypeEnumeration;

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    addEntityForNamespace(entity);
    enhance(metaEd);
  });

  it('should create row', (): void => {
    expect(rowEntities(metaEd, namespace).size).toBe(1);
    expect(rowEntities(metaEd, namespace).get(`${entityName}Type${shortDescription1}`)).toBeDefined();
  });

  it('should have correct enumeration row', (): void => {
    const row: any = rowEntities(metaEd, namespace).get(`${entityName}Type${shortDescription1}`);
    expect(row.type).toBe('enumerationRow');
    expect(row.name).toBe(`${entityName}Type`);
    expect(row.namespace).toBe('EdFi');
    expect(row.schemaName).toBe('edfi');
    expect(row.tableName).toBe(`${entityName}Type`);
    expect(row.documentation).toBe(itemDocumentation1);
    expect(row.codeValue).toBe('');
    expect(row.description).toBe(shortDescription1);
    expect(row.shortDescription).toBe(shortDescription1);
  });
});

describe("when DescriptorMapTypeRowEnhancer enhances map type descriptor with name that ends with 'Type'", () => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const entityName = 'EntityName';
  const itemDocumentation1 = 'ItemDocumentation1';
  const shortDescription1 = 'ShortDescription1';

  beforeAll(() => {
    const entity: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: `${entityName}Type`,
      namespace,
      data: {
        edfiOdsRelational: {
          odsIsMapType: true,
          odsTableId: `${entityName}Type`,
        },
      },
    });
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: `${entityName}TypeMap`,
      namespace,
    });
    const item1: EnumerationItem = Object.assign(newEnumerationItem(), {
      documentation: itemDocumentation1,
      shortDescription: shortDescription1,
      namespace,
    });
    mapTypeEnumeration.enumerationItems.push(item1);
    entity.mapTypeEnumeration = mapTypeEnumeration;

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    addEntityForNamespace(entity);
    enhance(metaEd);
  });

  it('should create row', (): void => {
    expect(rowEntities(metaEd, namespace).size).toBe(1);
    expect(rowEntities(metaEd, namespace).get(`${entityName}Type${shortDescription1}`)).toBeDefined();
  });

  it('should have correct enumeration row', (): void => {
    const row: any = rowEntities(metaEd, namespace).get(`${entityName}Type${shortDescription1}`);
    expect(row.type).toBe('enumerationRow');
    expect(row.name).toBe(`${entityName}Type`);
    expect(row.namespace).toBe('EdFi');
    expect(row.schemaName).toBe('edfi');
    expect(row.tableName).toBe(`${entityName}Type`);
    expect(row.documentation).toBe(itemDocumentation1);
    expect(row.codeValue).toBe('');
    expect(row.description).toBe(shortDescription1);
    expect(row.shortDescription).toBe(shortDescription1);
  });
});

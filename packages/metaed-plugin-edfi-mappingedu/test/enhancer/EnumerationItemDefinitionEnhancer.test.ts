import { Namespace, MetaEdEnvironment } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { newEnumerationSimpleType, newEnumerationToken } from '@edfi/metaed-plugin-edfi-xsd';
import {
  dataStandardElementGroupName,
  dataStandardNamespaceName,
  pluginEnumerationsForNamespace,
  pluginEnvironmentRepositoryForNamespace,
} from '../../src/enhancer/EnhancerHelper';
import { enhance } from '../../src/enhancer/EnumerationItemDefinitionEnhancer';
import { addEdFiMappingEduRepositoryTo } from '../../src/model/EdFiMappingEduRepository';
import { EnumerationItemDefinition } from '../../src/model/EnumerationItemDefinition';
import { EdFiMappingEduRepository } from '../../src/model/EdFiMappingEduRepository';

describe('when enhancing enumeration element', (): void => {
  let pluginNamespace: EdFiMappingEduRepository;
  const enumerationName = 'EnumerationName';
  const value1 = 'Value1';
  const value2 = 'Value2';
  const value3 = 'Value3';

  // Core | EnumerationName | Value1 | Value1 | Value1
  // Core | EnumerationName | Value2 | Value2 | Value2
  // Core | EnumerationName | Value3 | Value3 | Value3
  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: dataStandardNamespaceName,
    };
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiMappingEduRepositoryTo(metaEd);
    pluginEnumerationsForNamespace(metaEd, namespace).set(enumerationName, {
      ...newEnumerationSimpleType(),
      name: enumerationName,
      enumerationTokens: [
        { ...newEnumerationToken(), value: value1 },
        { ...newEnumerationToken(), value: value2 },
        { ...newEnumerationToken(), value: value3 },
      ],
    });

    enhance(metaEd);

    pluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, namespace) as any;
  });

  it('should create three enumeration definitions', (): void => {
    expect(pluginNamespace.enumerationItemDefinitions).toHaveLength(3);
  });

  it.each([
    [enumerationName, value1, 0],
    [enumerationName, value2, 1],
    [enumerationName, value3, 2],
  ])(
    `should create core enumeration item definition with name: '%s' and value: '%s'`,
    (enumeration, value: string, index: number) => {
      const enumerationItemDefinition: EnumerationItemDefinition = pluginNamespace.enumerationItemDefinitions[index];
      expect(enumerationItemDefinition).toBeDefined();
      expect(enumerationItemDefinition.elementGroup).toBe(dataStandardElementGroupName);
      expect(enumerationItemDefinition.enumeration).toEqual(enumeration);
      expect(enumerationItemDefinition.codeValue).toBe(value);
      expect(enumerationItemDefinition.shortDescription).toBe(value);
      expect(enumerationItemDefinition.description).toBe(value);
    },
  );
});

describe('when enhancing multiple enumeration elements', (): void => {
  let pluginNamespace: EdFiMappingEduRepository;
  const enumerationName1 = 'EnumerationName1';
  const enumerationName2 = 'EnumerationName2';
  const value1 = 'Value1';
  const value2 = 'Value2';
  const value3 = 'Value3';
  const value4 = 'Value4';
  const value5 = 'Value5';
  const value6 = 'Value6';

  // Core | EnumerationName1 | Value1 | Value1 | Value1
  // Core | EnumerationName1 | Value2 | Value2 | Value2
  // Core | EnumerationName1 | Value3 | Value3 | Value3
  // Core | EnumerationName2 | Value4 | Value4 | Value4
  // Core | EnumerationName2 | Value5 | Value5 | Value5
  // Core | EnumerationName2 | Value6 | Value6 | Value6
  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: dataStandardNamespaceName,
    };
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiMappingEduRepositoryTo(metaEd);
    pluginEnumerationsForNamespace(metaEd, namespace).set(enumerationName1, {
      ...newEnumerationSimpleType(),
      name: enumerationName1,
      enumerationTokens: [
        { ...newEnumerationToken(), value: value1 },
        { ...newEnumerationToken(), value: value2 },
        { ...newEnumerationToken(), value: value3 },
      ],
    });
    pluginEnumerationsForNamespace(metaEd, namespace).set(enumerationName2, {
      ...newEnumerationSimpleType(),
      name: enumerationName2,
      enumerationTokens: [
        { ...newEnumerationToken(), value: value4 },
        { ...newEnumerationToken(), value: value5 },
        { ...newEnumerationToken(), value: value6 },
      ],
    });

    enhance(metaEd);

    pluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, namespace) as any;
  });

  it('should create six enumeration definitions', (): void => {
    expect(pluginNamespace.enumerationItemDefinitions).toHaveLength(6);
  });

  it.each([
    [enumerationName1, value1, 0],
    [enumerationName1, value2, 1],
    [enumerationName1, value3, 2],
    [enumerationName2, value4, 3],
    [enumerationName2, value5, 4],
    [enumerationName2, value6, 5],
  ])(
    `should create core enumeration item definition with name: '%s' and value: '%s'`,
    (enumeration, value: string, index: number) => {
      const enumerationItemDefinition: EnumerationItemDefinition = pluginNamespace.enumerationItemDefinitions[index];
      expect(enumerationItemDefinition).toBeDefined();
      expect(enumerationItemDefinition.elementGroup).toBe(dataStandardElementGroupName);
      expect(enumerationItemDefinition.enumeration).toEqual(enumeration);
      expect(enumerationItemDefinition.codeValue).toBe(value);
      expect(enumerationItemDefinition.shortDescription).toBe(value);
      expect(enumerationItemDefinition.description).toBe(value);
    },
  );
});

import { Namespace, MetaEdEnvironment } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/ElementGroupDefinitionEnhancer';
import {
  dataStandardElementGroupName,
  dataStandardNamespaceName,
  pluginEnvironmentRepositoryForNamespace,
} from '../../src/enhancer/EnhancerHelper';
import { addEdFiMappingEduRepositoryTo } from '../../src/model/EdFiMappingEduRepository';
import { ElementGroupDefinition } from '../../src/model/ElementGroupDefinition';
import { EdFiMappingEduRepository } from '../../src/model/EdFiMappingEduRepository';

describe('when enhancing core', (): void => {
  const projectName = 'Ed-Fi';
  let pluginNamespace: EdFiMappingEduRepository;

  // Core | Ed-Fi Core
  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: dataStandardNamespaceName,
      projectName,
    };
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiMappingEduRepositoryTo(metaEd);

    enhance(metaEd);

    pluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, namespace) as any;
  });

  it('should create one element group definition', (): void => {
    expect(pluginNamespace.elementGroupDefinitions).toHaveLength(1);
  });

  it('should create core element group definition', (): void => {
    const elementGroupDefinition: ElementGroupDefinition = pluginNamespace.elementGroupDefinitions[0];
    expect(elementGroupDefinition).toBeDefined();
    expect(elementGroupDefinition.elementGroup).toBe(dataStandardElementGroupName);
    expect(elementGroupDefinition.definition).toBe(`${projectName} ${dataStandardElementGroupName}`);
  });
});

describe('when enhancing extension', (): void => {
  const namespaceName = 'NamespaceName';
  const projectName = 'ProjectName';
  const extensionEntitySuffix = 'ExtensionEntitySuffix';
  let pluginNamespace: EdFiMappingEduRepository;

  // NamespaceName | ProjectName ExtensionEntitySuffix
  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      projectName,
      extensionEntitySuffix,
    };
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiMappingEduRepositoryTo(metaEd);

    enhance(metaEd);

    pluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, namespace) as any;
  });

  it('should create one element group definition', (): void => {
    expect(pluginNamespace.elementGroupDefinitions).toHaveLength(1);
  });

  it('should create extension element group definition', (): void => {
    const elementGroupDefinition: ElementGroupDefinition = pluginNamespace.elementGroupDefinitions[0];
    expect(elementGroupDefinition).toBeDefined();
    expect(elementGroupDefinition.elementGroup).toBe(namespaceName);
    expect(elementGroupDefinition.definition).toBe(`${projectName} ${extensionEntitySuffix}`);
  });
});

describe('when enhancing core and extension', (): void => {
  const coreNamespaceName: string = dataStandardNamespaceName;
  const coreProjectName = 'Ed-Fi';
  const extensionNamespaceName = 'ExtensionNamespaceName';
  const extensionProjectName = 'ExtensionProjectName';
  const extensionEntitySuffix = 'ExtensionEntitySuffix';
  let corePluginNamespace: EdFiMappingEduRepository;
  let extensionPluginNamespace: EdFiMappingEduRepository;

  // Core          | Ed-Fi Core
  // NamespaceName | ProjectName ExtensionEntitySuffix
  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const coreNamespace: Namespace = {
      ...newNamespace(),
      namespaceName: coreNamespaceName,
      projectName: coreProjectName,
    };
    const extensionNamespace: Namespace = {
      ...newNamespace(),
      namespaceName: extensionNamespaceName,
      projectName: extensionProjectName,
      extensionEntitySuffix,
    };
    metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
    addEdFiMappingEduRepositoryTo(metaEd);

    enhance(metaEd);

    corePluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, coreNamespace) as any;
    extensionPluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, extensionNamespace) as any;
  });

  it('should create two element group definitions', (): void => {
    expect(corePluginNamespace.elementGroupDefinitions).toHaveLength(1);
    expect(extensionPluginNamespace.elementGroupDefinitions).toHaveLength(1);
  });

  it('should create core element group definition', (): void => {
    const elementGroupDefinition: ElementGroupDefinition = corePluginNamespace.elementGroupDefinitions[0];
    expect(elementGroupDefinition).toBeDefined();
    expect(elementGroupDefinition.elementGroup).toBe(dataStandardElementGroupName);
    expect(elementGroupDefinition.definition).toBe(`${coreProjectName} ${dataStandardElementGroupName}`);
  });

  it('should create extension element group definition', (): void => {
    const elementGroupDefinition: ElementGroupDefinition = extensionPluginNamespace.elementGroupDefinitions[0];
    expect(elementGroupDefinition).toBeDefined();
    expect(elementGroupDefinition.elementGroup).toBe(extensionNamespaceName);
    expect(elementGroupDefinition.definition).toBe(`${extensionProjectName} ${extensionEntitySuffix}`);
  });
});

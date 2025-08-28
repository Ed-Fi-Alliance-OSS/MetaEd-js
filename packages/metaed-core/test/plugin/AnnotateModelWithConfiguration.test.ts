import { annotateModelWithConfiguration } from '../../src/plugin/AnnotateModelWithConfiguration';
import { newNamespace } from '../../src/model/Namespace';
import { newDomainEntity } from '../../src/model/DomainEntity';
import { newAssociation } from '../../src/model/Association';
import { Namespace } from '../../src/model/Namespace';
import { DomainEntity } from '../../src/model/DomainEntity';
import { Association } from '../../src/model/Association';
import { addEntityForNamespace } from '../../src/model/EntityRepository';
import { PluginConfiguration } from '../../src/plugin/PluginConfiguration';
import { PluginEnvironment } from '../../src/plugin/PluginEnvironment';
import { newPluginEnvironment } from '../../src/plugin/PluginEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

function namespaceRepository(...namespaces: Namespace[]): Map<string, Namespace> {
  const stringNamespacePairs: [string, Namespace][] = namespaces.map(
    (namespace: Namespace) => [namespace.namespaceName, namespace] as [string, Namespace],
  );
  return new Map(stringNamespacePairs);
}

describe('when config rule is plugin-wide', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'abc' };
  const domainEntity: DomainEntity = { ...newDomainEntity(), namespace, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity);
  const association: Association = { ...newAssociation(), namespace, metaEdName: 'AssociationName' };
  addEntityForNamespace(association);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBe('info');
  });

  it('should not annotate entities', (): void => {
    expect(domainEntity.config.pluginName).toBeUndefined();
    expect(association.config.pluginName).toBeUndefined();
  });
});

describe('when multiple config rules are plugin-wide and the data does not overlap', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          data: {
            explainer: 'info',
          },
        },
        {
          rule: 'rule456',
          data: {
            special: 'sauce',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'abc' };
  const domainEntity: DomainEntity = { ...newDomainEntity(), namespace, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity);
  const association: Association = { ...newAssociation(), namespace, metaEdName: 'AssociationName' };
  addEntityForNamespace(association);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should annotate plugin environment with first rule', (): void => {
    expect(pluginEnvironment.config.explainer).toBe('info');
  });

  it('should annotate plugin environment with second rule', (): void => {
    expect(pluginEnvironment.config.special).toBe('sauce');
  });

  it('should not annotate entities', (): void => {
    expect(domainEntity.config.pluginName).toBeUndefined();
    expect(association.config.pluginName).toBeUndefined();
  });
});

describe('when multiple config rules are plugin-wide and the data does overlap', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          data: {
            explainer: ['info'],
          },
        },
        {
          rule: 'rule456',
          data: {
            explainer: ['sauce'],
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'abc' };
  const domainEntity: DomainEntity = { ...newDomainEntity(), namespace, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity);
  const association: Association = { ...newAssociation(), namespace, metaEdName: 'AssociationName' };
  addEntityForNamespace(association);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should annotate plugin environment with two elements', (): void => {
    expect(pluginEnvironment.config.explainer).toHaveLength(2);
  });

  it('should annotate plugin environment with first rule', (): void => {
    expect(pluginEnvironment.config.explainer).toContain('info');
  });

  it('should annotate plugin environment with second rule', (): void => {
    expect(pluginEnvironment.config.explainer).toContain('sauce');
  });

  it('should not annotate entities', (): void => {
    expect(domainEntity.config.pluginName).toBeUndefined();
    expect(association.config.pluginName).toBeUndefined();
  });
});

describe('when config rule is for a single entity type', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: 'domainEntity',
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'abc' };
  const domainEntity: DomainEntity = { ...newDomainEntity(), namespace, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity);
  const association: Association = { ...newAssociation(), namespace, metaEdName: 'AssociationName' };
  addEntityForNamespace(association);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should annotate domainEntity', (): void => {
    expect(domainEntity.config.pluginName.explainer).toBe('info');
  });

  it('should not annotate association', (): void => {
    expect(association.config.pluginName).toBeUndefined();
  });
});

describe('when config rule is for multiple entity type', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: ['domainEntity', 'association'],
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'abc' };
  const domainEntity: DomainEntity = { ...newDomainEntity(), namespace, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity);
  const association: Association = { ...newAssociation(), namespace, metaEdName: 'AssociationName' };
  addEntityForNamespace(association);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should annotate domainEntity', (): void => {
    expect(domainEntity.config.pluginName.explainer).toBe('info');
  });

  it('should annotate association', (): void => {
    expect(association.config.pluginName.explainer).toBe('info');
  });
});

describe('when config rule is for a single entity type in a core namespace', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: 'domainEntity',
            core: true,
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi', isExtension: false };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', isExtension: true };
  const domainEntity: DomainEntity = { ...newDomainEntity(), namespace, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity);
  const domainEntityInExtension: DomainEntity = {
    ...newDomainEntity(),
    namespace: extensionNamespace,
    metaEdName: 'DomainEntityInExtensionName',
  };
  addEntityForNamespace(domainEntityInExtension);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace, extensionNamespace),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should annotate domainEntity in core', (): void => {
    expect(domainEntity.config.pluginName.explainer).toBe('info');
  });

  it('should not annotate domainEntity in extension', (): void => {
    expect(domainEntityInExtension.config.pluginName).toBeUndefined();
  });
});

describe('when config rule is for a single entity type in an extension namespace', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: 'domainEntity',
            extensions: true,
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi', isExtension: false };
  const extensionNamespace1: Namespace = { ...newNamespace(), namespaceName: 'extension1', isExtension: true };
  const extensionNamespace2: Namespace = { ...newNamespace(), namespaceName: 'extension2', isExtension: true };

  const domainEntity: DomainEntity = { ...newDomainEntity(), namespace, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity);
  const domainEntityInExtension1: DomainEntity = {
    ...newDomainEntity(),
    namespace: extensionNamespace1,
    metaEdName: 'DomainEntityInExtension1Name',
  };
  addEntityForNamespace(domainEntityInExtension1);
  const domainEntityInExtension2: DomainEntity = {
    ...newDomainEntity(),
    namespace: extensionNamespace2,
    metaEdName: 'DomainEntityInExtension2Name',
  };
  addEntityForNamespace(domainEntityInExtension2);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace, extensionNamespace1, extensionNamespace2),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should not annotate domainEntity in core', (): void => {
    expect(domainEntity.config.pluginName).toBeUndefined();
  });

  it('should annotate domainEntity in extension1', (): void => {
    expect(domainEntityInExtension1.config.pluginName.explainer).toBe('info');
  });

  it('should annotate domainEntity in extension2', (): void => {
    expect(domainEntityInExtension2.config.pluginName.explainer).toBe('info');
  });
});

describe('when config rule is for a single entity type in a single named namespace', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: 'domainEntity',
            namespace: 'namespace2',
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace1: Namespace = { ...newNamespace(), namespaceName: 'namespace1' };
  const namespace2: Namespace = { ...newNamespace(), namespaceName: 'namespace2' };
  const domainEntity1: DomainEntity = { ...newDomainEntity(), namespace: namespace1, metaEdName: 'DomainEntity1Name' };
  addEntityForNamespace(domainEntity1);
  const domainEntity2: DomainEntity = {
    ...newDomainEntity(),
    namespace: namespace2,
    metaEdName: 'DomainEntity2Name',
  };
  addEntityForNamespace(domainEntity2);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace1, namespace2),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should not annotate domainEntity1 in namespace1', (): void => {
    expect(domainEntity1.config.pluginName).toBeUndefined();
  });

  it('should annotate domainEntity2 in namespace2', (): void => {
    expect(domainEntity2.config.pluginName.explainer).toBe('info');
  });
});

describe('when config rule is for a single entity type in multiple named namespaces', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: 'domainEntity',
            namespace: ['namespace1', 'namespace2'],
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace1: Namespace = { ...newNamespace(), namespaceName: 'namespace1' };
  const namespace2: Namespace = { ...newNamespace(), namespaceName: 'namespace2' };
  const domainEntity1: DomainEntity = { ...newDomainEntity(), namespace: namespace1, metaEdName: 'DomainEntity1Name' };
  addEntityForNamespace(domainEntity1);
  const domainEntity2: DomainEntity = {
    ...newDomainEntity(),
    namespace: namespace2,
    metaEdName: 'DomainEntity2Name',
  };
  addEntityForNamespace(domainEntity2);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace1, namespace2),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should annotate domainEntity1 in namespace1', (): void => {
    expect(domainEntity1.config.pluginName.explainer).toBe('info');
  });

  it('should annotate domainEntity2 in namespace2', (): void => {
    expect(domainEntity2.config.pluginName.explainer).toBe('info');
  });
});

describe('when config rule is for a single named namespace that does not exist', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: 'domainEntity',
            namespace: 'invalid',
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace1: Namespace = { ...newNamespace(), namespaceName: 'namespace1' };
  const domainEntity1: DomainEntity = { ...newDomainEntity(), namespace: namespace1, metaEdName: 'DomainEntity1Name' };
  addEntityForNamespace(domainEntity1);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace1),
  );

  it('should not be valid', (): void => {
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchSnapshot();
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should not annotate domainEntity1 in namespace1', (): void => {
    expect(domainEntity1.config.pluginName).toBeUndefined();
  });
});

describe('when config rule is for a single entity type in a single named namespace with a specific name', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: 'domainEntity',
            namespace: 'abc',
            entityName: 'DomainEntity1Name',
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'abc' };
  const domainEntity1: DomainEntity = { ...newDomainEntity(), namespace, metaEdName: 'DomainEntity1Name' };
  addEntityForNamespace(domainEntity1);
  const domainEntity2: DomainEntity = {
    ...newDomainEntity(),
    namespace,
    metaEdName: 'DomainEntity2Name',
  };
  addEntityForNamespace(domainEntity2);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should annotate domainEntity1', (): void => {
    expect(domainEntity1.config.pluginName.explainer).toBe('info');
  });

  it('should not annotate domainEntity2', (): void => {
    expect(domainEntity2.config.pluginName).toBeUndefined();
  });
});

describe('when config rule is for a single entity type in a single named namespace with a list of names', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: 'domainEntity',
            namespace: 'abc',
            entityName: ['DomainEntity1Name', 'DomainEntity2Name'],
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'abc' };
  const domainEntity1: DomainEntity = { ...newDomainEntity(), namespace, metaEdName: 'DomainEntity1Name' };
  addEntityForNamespace(domainEntity1);
  const domainEntity2: DomainEntity = {
    ...newDomainEntity(),
    namespace,
    metaEdName: 'DomainEntity2Name',
  };
  addEntityForNamespace(domainEntity2);
  const domainEntity3: DomainEntity = {
    ...newDomainEntity(),
    namespace,
    metaEdName: 'DomainEntity3Name',
  };
  addEntityForNamespace(domainEntity3);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should annotate domainEntity1', (): void => {
    expect(domainEntity1.config.pluginName.explainer).toBe('info');
  });

  it('should annotate domainEntity2', (): void => {
    expect(domainEntity2.config.pluginName.explainer).toBe('info');
  });

  it('should not annotate domainEntity3', (): void => {
    expect(domainEntity3.config.pluginName).toBeUndefined();
  });
});

describe('when config rule is for a single entity type in a single named namespace with a specific name with no match', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: 'domainEntity',
            namespace: 'abc',
            entityName: 'invalid',
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'abc' };
  const domainEntity1: DomainEntity = { ...newDomainEntity(), namespace, metaEdName: 'DomainEntity1Name' };
  addEntityForNamespace(domainEntity1);
  const domainEntity2: DomainEntity = {
    ...newDomainEntity(),
    namespace,
    metaEdName: 'DomainEntity2Name',
  };
  addEntityForNamespace(domainEntity2);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace),
  );

  it('should not be valid', (): void => {
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchSnapshot();
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should not annotate domainEntity1', (): void => {
    expect(domainEntity1.config.pluginName).toBeUndefined();
  });

  it('should not annotate domainEntity2', (): void => {
    expect(domainEntity2.config.pluginName).toBeUndefined();
  });
});

describe('when config rule is for a single entity type in multiple extension namespaces with duplicate names', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: {
            entity: 'domainEntity',
            extensions: true,
            entityName: ['DomainEntityName'],
          },
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace1: Namespace = { ...newNamespace(), namespaceName: 'abc', isExtension: true };
  const namespace2: Namespace = { ...newNamespace(), namespaceName: 'def', isExtension: true };
  const domainEntity1: DomainEntity = { ...newDomainEntity(), namespace: namespace1, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity1);
  const domainEntity2: DomainEntity = {
    ...newDomainEntity(),
    namespace: namespace2,
    metaEdName: 'DomainEntityName',
  };
  addEntityForNamespace(domainEntity2);
  const domainEntity3: DomainEntity = {
    ...newDomainEntity(),
    namespace: namespace2,
    metaEdName: 'DomainEntity3Name',
  };
  addEntityForNamespace(domainEntity3);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace1, namespace2),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should annotate domainEntity1', (): void => {
    expect(domainEntity1.config.pluginName.explainer).toBe('info');
  });

  it('should annotate domainEntity2', (): void => {
    expect(domainEntity2.config.pluginName.explainer).toBe('info');
  });

  it('should not annotate domainEntity3', (): void => {
    expect(domainEntity3.config.pluginName).toBeUndefined();
  });
});

describe('when config rule has multiple match definitions that do not overlap', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: [
            {
              entity: 'domainEntity',
              extensions: true,
            },
            {
              entity: 'domainEntity',
              core: true,
              entityName: 'DomainEntityName',
            },
          ],
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace1: Namespace = { ...newNamespace(), namespaceName: 'EdFi', isExtension: false };
  const namespace2: Namespace = { ...newNamespace(), namespaceName: 'def', isExtension: true };
  const domainEntity1: DomainEntity = { ...newDomainEntity(), namespace: namespace1, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity1);
  const domainEntity2: DomainEntity = {
    ...newDomainEntity(),
    namespace: namespace1,
    metaEdName: 'NotDomainEntityName',
  };
  addEntityForNamespace(domainEntity2);
  const domainEntity3: DomainEntity = {
    ...newDomainEntity(),
    namespace: namespace2,
    metaEdName: 'DomainEntity3Name',
  };
  addEntityForNamespace(domainEntity3);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace1, namespace2),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should annotate domainEntity1', (): void => {
    expect(domainEntity1.config.pluginName.explainer).toBe('info');
  });

  it('should not annotate domainEntity2', (): void => {
    expect(domainEntity2.config.pluginName).toBeUndefined();
  });

  it('should not annotate domainEntity3', (): void => {
    expect(domainEntity3.config.pluginName.explainer).toBe('info');
  });
});

describe('when config rule has multiple match definitions that overlap', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: [
            {
              entity: 'domainEntity',
              core: true,
            },
            {
              entity: 'domainEntity',
              core: true,
              entityName: 'DomainEntityName',
            },
          ],
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace1: Namespace = { ...newNamespace(), namespaceName: 'EdFi', isExtension: false };
  const namespace2: Namespace = { ...newNamespace(), namespaceName: 'def', isExtension: true };
  const domainEntity1: DomainEntity = { ...newDomainEntity(), namespace: namespace1, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity1);
  const domainEntity2: DomainEntity = {
    ...newDomainEntity(),
    namespace: namespace1,
    metaEdName: 'NotDomainEntityName',
  };
  addEntityForNamespace(domainEntity2);
  const domainEntity3: DomainEntity = {
    ...newDomainEntity(),
    namespace: namespace2,
    metaEdName: 'DomainEntity3Name',
  };
  addEntityForNamespace(domainEntity3);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace1, namespace2),
  );

  it('should be valid', (): void => {
    expect(result).toHaveLength(0);
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should annotate domainEntity1', (): void => {
    expect(domainEntity1.config.pluginName.explainer).toBe('info');
  });

  it('should not annotate domainEntity2', (): void => {
    expect(domainEntity2.config.pluginName.explainer).toBe('info');
  });

  it('should not annotate domainEntity3', (): void => {
    expect(domainEntity3.config.pluginName).toBeUndefined();
  });
});

describe('when config rule has multiple match definitions where one is invalid', (): void => {
  const pluginConfiguration: PluginConfiguration = {
    filepath: 'file/path',
    configObject: {
      config: [
        {
          rule: 'rule123',
          matches: [
            {
              entity: 'domainEntity',
              core: true,
            },
            {
              entity: 'domainEntity',
              core: true,
              entityName: 'invalid',
            },
          ],
          data: {
            explainer: 'info',
          },
        },
      ],
    },
  };
  const pluginEnvironment: PluginEnvironment = { ...newPluginEnvironment(), shortName: 'pluginName' };
  const namespace1: Namespace = { ...newNamespace(), namespaceName: 'EdFi', isExtension: false };
  const namespace2: Namespace = { ...newNamespace(), namespaceName: 'def', isExtension: true };
  const domainEntity1: DomainEntity = { ...newDomainEntity(), namespace: namespace1, metaEdName: 'DomainEntityName' };
  addEntityForNamespace(domainEntity1);
  const domainEntity2: DomainEntity = {
    ...newDomainEntity(),
    namespace: namespace1,
    metaEdName: 'NotDomainEntityName',
  };
  addEntityForNamespace(domainEntity2);
  const domainEntity3: DomainEntity = {
    ...newDomainEntity(),
    namespace: namespace2,
    metaEdName: 'DomainEntity3Name',
  };
  addEntityForNamespace(domainEntity3);

  const result: ValidationFailure[] = annotateModelWithConfiguration(
    pluginConfiguration,
    pluginEnvironment,
    namespaceRepository(namespace1, namespace2),
  );

  it('should not be valid', (): void => {
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchSnapshot();
  });

  it('should not annotate plugin environment', (): void => {
    expect(pluginEnvironment.config.explainer).toBeUndefined();
  });

  it('should annotate domainEntity1', (): void => {
    expect(domainEntity1.config.pluginName.explainer).toBe('info');
  });

  it('should not annotate domainEntity2', (): void => {
    expect(domainEntity2.config.pluginName.explainer).toBe('info');
  });

  it('should not annotate domainEntity3', (): void => {
    expect(domainEntity3.config.pluginName).toBeUndefined();
  });
});

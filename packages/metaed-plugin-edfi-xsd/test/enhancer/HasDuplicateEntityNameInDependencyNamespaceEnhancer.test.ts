import {
  newMetaEdEnvironment,
  newPluginEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  NamespaceBuilder,
  MetaEdEnvironment,
} from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/HasDuplicateEntityNameInDependencyNamespaceEnhancer';
import { edfiXsdRepositoryForNamespace } from '../../src/enhancer/EnhancerHelper';
import { EdFiXsdEntityRepository, addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';

describe('when DEs have different names across dependency-linked namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity('DomainEntity2')
      .withDocumentation('doc')
      .withBooleanProperty('Prop2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);
    addEdFiXsdEntityRepositoryTo(metaEd);

    metaEd.plugin.set('edfiOdsApi', { ...newPluginEnvironment(), targetTechnologyVersion: '3.0.0' });
    enhance(metaEd);
  });

  it('should build one core domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one extension domain entity', (): void => {
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should not flag duplicates', (): void => {
    const repository = edfiXsdRepositoryForNamespace(metaEd, extensionNamespace) as EdFiXsdEntityRepository;
    expect(repository.hasDuplicateEntityNameInDependencyNamespace).toBe(false);
  });
});

describe('when DEs have same names across dependency-linked namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity('DomainEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Prop2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);
    addEdFiXsdEntityRepositoryTo(metaEd);

    metaEd.plugin.set('edfiOdsApi', { ...newPluginEnvironment(), targetTechnologyVersion: '3.0.0' });
    enhance(metaEd);
  });

  it('should build one core domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one extension domain entity', (): void => {
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should flag duplicates', (): void => {
    const repository = edfiXsdRepositoryForNamespace(metaEd, extensionNamespace) as EdFiXsdEntityRepository;
    expect(repository.hasDuplicateEntityNameInDependencyNamespace).toBe(true);
  });
});

// not a name collision because they are completely separate namespaces
describe('when DE Extension has same name as DE Extension that is not across dependency-linked namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let extensionNamespacea: any = null;
  let extensionNamespaceb: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityXYZ')
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extensiona', 'Extensiona')
      .withStartDomainEntityExtension('DomainEntityXYZ')
      .withBooleanProperty('Prop2', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .withBeginNamespace('Extensionb', 'Extensionb')
      .withStartDomainEntityExtension('DomainEntityXYZ')
      .withBooleanProperty('Prop3', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespacea = metaEd.namespace.get('Extensiona');
    extensionNamespaceb = metaEd.namespace.get('Extensionb');
    extensionNamespacea.dependencies.push(coreNamespace);
    extensionNamespaceb.dependencies.push(coreNamespace);
    addEdFiXsdEntityRepositoryTo(metaEd);

    metaEd.plugin.set('edfiOdsApi', { ...newPluginEnvironment(), targetTechnologyVersion: '3.0.0' });
    enhance(metaEd);
  });

  it('should build one core domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one extension1 domain entity extension', (): void => {
    expect(extensionNamespacea.entity.domainEntityExtension.size).toBe(1);
  });

  it('should build one extension2 domain entity extension', (): void => {
    expect(extensionNamespaceb.entity.domainEntityExtension.size).toBe(1);
  });

  it('should not flag duplicates', (): void => {
    const repositorya = edfiXsdRepositoryForNamespace(metaEd, extensionNamespacea) as EdFiXsdEntityRepository;
    expect(repositorya.hasDuplicateEntityNameInDependencyNamespace).toBe(false);

    const repositoryb = edfiXsdRepositoryForNamespace(metaEd, extensionNamespaceb) as EdFiXsdEntityRepository;
    expect(repositoryb.hasDuplicateEntityNameInDependencyNamespace).toBe(false);
  });
});

// not a problem for this validator because they are different types
describe('when DE has same name as DE extension across dependency-linked namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntity')
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntityExtension('DomainEntity2')
      .withBooleanProperty('Prop2', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);
    addEdFiXsdEntityRepositoryTo(metaEd);

    metaEd.plugin.set('edfiOdsApi', { ...newPluginEnvironment(), targetTechnologyVersion: '3.0.0' });
    enhance(metaEd);
  });

  it('should build one core domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one extension domain entity extension', (): void => {
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should not flag duplicates', (): void => {
    const repository = edfiXsdRepositoryForNamespace(metaEd, extensionNamespace) as EdFiXsdEntityRepository;
    expect(repository.hasDuplicateEntityNameInDependencyNamespace).toBe(false);
  });
});

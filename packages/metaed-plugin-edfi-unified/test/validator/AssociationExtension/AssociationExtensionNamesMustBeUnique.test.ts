import { newMetaEdEnvironment, MetaEdTextBuilder, AssociationExtensionBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/AssociationExtension/AssociationExtensionNamesMustBeUnique';

describe('when entities in same namespace have different names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociationExtension('ValidName1')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociationExtension()

      .withStartAssociationExtension('ValidName2')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two associationExtension', (): void => {
    expect(coreNamespace.entity.associationExtension.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when entities in same namespace have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociationExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociationExtension()

      .withStartAssociationExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one associationExtension because TopLevelEntityBuilder will not let it get that far', (): void => {
    expect(coreNamespace.entity.associationExtension.size).toBe(1);
  });

  it('should have no validation failures because of TopLevelEntityBuilder', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when associationExtensions in separate dependency-linked namespaces have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociationExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartAssociationExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one associationExtension in core namespace', (): void => {
    expect(coreNamespace.entity.associationExtension.size).toBe(1);
  });

  it('should build one associationExtension in extension namespace', (): void => {
    expect(extensionNamespace.entity.associationExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when associationExtensions in non-dependency-linked namespaces have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespacea: any = null;
  let extensionNamespaceb: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociationExtension('NotADuplicate')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .withBeginNamespace('Extensiona', 'Extensiona')
      .withStartAssociationExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .withBeginNamespace('Extensionb', 'Extensionb')
      .withStartAssociationExtension(entityName)
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespacea = metaEd.namespace.get('Extensiona');
    extensionNamespaceb = metaEd.namespace.get('Extensionb');
    extensionNamespacea.dependencies.push(coreNamespace);
    extensionNamespaceb.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one core associationExtension', (): void => {
    expect(coreNamespace.entity.associationExtension.size).toBe(1);
  });

  it('should build one extension1 associationExtension', (): void => {
    expect(extensionNamespacea.entity.associationExtension.size).toBe(1);
  });

  it('should build one extension2 associationExtension', (): void => {
    expect(extensionNamespaceb.entity.associationExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

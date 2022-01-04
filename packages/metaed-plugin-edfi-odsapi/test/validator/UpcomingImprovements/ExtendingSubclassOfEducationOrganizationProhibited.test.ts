import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  DomainEntityExtensionBuilder,
  NamespaceBuilder,
  newPluginEnvironment,
} from 'metaed-core';
import { MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { validate } from '../../../src/validator/UpcomingImprovements/ExtendingSubclassOfEducationOrganizationProhibited';

describe('when a domain entity extension extends a non-education organization domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();

    const entity = coreNamespace.entity.domainEntity.get(entityName);
    const extension = coreNamespace.entity.domainEntityExtension.get(entityName);

    if (entity && extension) extension.baseEntity = entity;

    metaEd.plugin.set(
      'edfiOdsApi',
      Object.assign(newPluginEnvironment(), {
        targetTechnologyVersion: '2.0.0',
      }),
    );
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when a domain entity extension extends a non-education organization subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'NotEducationOrganization';
  const coreSubclassName = 'CoreSubclassName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(coreSubclassName, entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntityExtension(coreSubclassName)
      .withBooleanProperty('PropertyName3', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get('Extension');
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    const entity = coreNamespace.entity.domainEntity.get(entityName);
    const coreSubclass = coreNamespace.entity.domainEntitySubclass.get(coreSubclassName);
    const extension = extensionNamespace.entity.domainEntityExtension.get(coreSubclassName);

    if (entity && coreSubclass) coreSubclass.baseEntity = entity;
    if (coreSubclass && extension) extension.baseEntity = coreSubclass;

    metaEd.plugin.set(
      'edfiOdsApi',
      Object.assign(newPluginEnvironment(), {
        targetTechnologyVersion: '2.0.0',
      }),
    );
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when a domain entity extension extends a subclass of education organization', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EducationOrganization';
  const coreSubclassName = 'CoreSubclassName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(coreSubclassName, entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntityExtension(coreSubclassName)
      .withBooleanProperty('PropertyName3', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get('Extension');
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    const entity = coreNamespace.entity.domainEntity.get(entityName);
    const coreSubclass = coreNamespace.entity.domainEntitySubclass.get(coreSubclassName);
    const extension = extensionNamespace.entity.domainEntityExtension.get(coreSubclassName);

    if (entity && coreSubclass) coreSubclass.baseEntity = entity;
    if (coreSubclass && extension) extension.baseEntity = coreSubclass;

    metaEd.plugin.set(
      'edfiOdsApi',
      Object.assign(newPluginEnvironment(), {
        targetTechnologyVersion: '2.0.0',
      }),
    );
    failures = validate(metaEd);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('ExtendingSubclassOfEducationOrganizationProhibited');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when an extension domain entity subclass extends a core subclass of education organization should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when an extension domain entity subclass extends a core subclass of education organization should have validation failure -> sourceMap',
    );
  });
});

describe('when a domain entity extension extends a subclass of a subclass of education organization', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EducationOrganization';
  const coreSubclassName = 'CoreSubclassName';
  const extensionSubclassName = 'CoreSubclassName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(coreSubclassName, entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntitySubclass(extensionSubclassName, coreSubclassName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName3', 'doc', true, false)
      .withEndDomainEntitySubclass()

      .withStartDomainEntityExtension(extensionSubclassName)
      .withBooleanProperty('PropertyName4', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get('Extension');
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    const entity = coreNamespace.entity.domainEntity.get(entityName);
    const coreSubclass = coreNamespace.entity.domainEntitySubclass.get(coreSubclassName);
    const extensionSubclass = extensionNamespace.entity.domainEntitySubclass.get(extensionSubclassName);
    const extension = extensionNamespace.entity.domainEntityExtension.get(extensionSubclassName);

    if (entity && coreSubclass) coreSubclass.baseEntity = entity;
    if (coreSubclass && extensionSubclass) extensionSubclass.baseEntity = coreSubclass;
    if (extensionSubclass && extension) extension.baseEntity = extensionSubclass;

    metaEd.plugin.set(
      'edfiOdsApi',
      Object.assign(newPluginEnvironment(), {
        targetTechnologyVersion: '2.0.0',
      }),
    );
    failures = validate(metaEd);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('ExtendingSubclassOfEducationOrganizationProhibited');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when an extension domain entity subclass extends a core subclass of education organization should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when an extension domain entity subclass extends a core subclass of education organization should have validation failure -> sourceMap',
    );
  });
});

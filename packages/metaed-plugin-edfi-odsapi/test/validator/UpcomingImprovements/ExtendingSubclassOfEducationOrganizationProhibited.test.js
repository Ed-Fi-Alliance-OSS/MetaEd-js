// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  DomainEntityExtensionBuilder,
  NamespaceInfoBuilder,
} from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/UpcomingImprovements/ExtendingSubclassOfEducationOrganizationProhibited';

describe('when a domain entity extension extends a non-education organization domain entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    const entity = metaEd.entity.domainEntity.get(entityName);
    const extension = metaEd.entity.domainEntityExtension.get(entityName);

    if (entity && extension) extension.baseEntity = entity;

    failures = validate(metaEd);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when a domain entity extension extends a non-education organization subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'NotEducationOrganization';
  const coreSubclassName: string = 'CoreSubclassName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(coreSubclassName, entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntityExtension(coreSubclassName)
      .withBooleanProperty('PropertyName3', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    const entity = metaEd.entity.domainEntity.get(entityName);
    const coreSubclass = metaEd.entity.domainEntitySubclass.get(coreSubclassName);
    const extension = metaEd.entity.domainEntityExtension.get(coreSubclassName);

    if (entity && coreSubclass) coreSubclass.baseEntity = entity;
    if (coreSubclass && extension) extension.baseEntity = coreSubclass;

    failures = validate(metaEd);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when a domain entity extension extends a subclass of education organization', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EducationOrganization';
  const coreSubclassName: string = 'CoreSubclassName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(coreSubclassName, entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntityExtension(coreSubclassName)
      .withBooleanProperty('PropertyName3', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    const entity = metaEd.entity.domainEntity.get(entityName);
    const coreSubclass = metaEd.entity.domainEntitySubclass.get(coreSubclassName);
    const extension = metaEd.entity.domainEntityExtension.get(coreSubclassName);

    if (entity && coreSubclass) coreSubclass.baseEntity = entity;
    if (coreSubclass && extension) extension.baseEntity = coreSubclass;

    failures = validate(metaEd);
  });

  it('should have validation failures', () => {
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

describe('when a domain entity extension extends a subclass of a subclass of education organization', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EducationOrganization';
  const coreSubclassName: string = 'CoreSubclassName';
  const extensionSubclassName: string = 'CoreSubclassName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(coreSubclassName, entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntitySubclass(extensionSubclassName, coreSubclassName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName3', 'doc', true, false)
      .withEndDomainEntitySubclass()

      .withStartDomainEntityExtension(extensionSubclassName)
      .withBooleanProperty('PropertyName4', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    const entity = metaEd.entity.domainEntity.get(entityName);
    const coreSubclass = metaEd.entity.domainEntitySubclass.get(coreSubclassName);
    const extensionSubclass = metaEd.entity.domainEntitySubclass.get(extensionSubclassName);
    const extension = metaEd.entity.domainEntityExtension.get(extensionSubclassName);

    if (entity && coreSubclass) coreSubclass.baseEntity = entity;
    if (coreSubclass && extensionSubclass) extensionSubclass.baseEntity = coreSubclass;
    if (extensionSubclass && extension) extension.baseEntity = extensionSubclass;

    failures = validate(metaEd);
  });

  it('should have validation failures', () => {
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

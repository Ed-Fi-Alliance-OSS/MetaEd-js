// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, DomainEntitySubclassBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/UpcomingImprovements/SubclassingAnyDomainEntityExceptEducationOrganizationIsUnsupported';

describe('when a domain entity subclass subclasses EducationOrganization', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const baseEntityName: string = 'EducationOrganization';
  const subclassName: string = 'SubclassName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(baseEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntitySubclass(subclassName, baseEntityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    const entity = metaEd.entity.domainEntity.get(baseEntityName);
    const subclass = metaEd.entity.domainEntitySubclass.get(subclassName);

    if (entity && subclass) subclass.baseEntity = entity;
    failures = validate(metaEd);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when a domain entity subclass subclasses a non-EducationOrganization domain entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const baseEntityName: string = 'NotEducationOrganization';
  const subclassName: string = 'SubclassName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(baseEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName1', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntitySubclass(subclassName, baseEntityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    const entity = metaEd.entity.domainEntity.get(baseEntityName);
    const subclass = metaEd.entity.domainEntitySubclass.get(subclassName);

    if (entity && subclass) subclass.baseEntity = entity;

    failures = validate(metaEd);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SubclassingAnyDomainEntityExceptEducationOrganizationIsUnsupported');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot('when a domain entity subclass subclasses a non-EducationOrganization domain entity should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when a domain entity subclass subclasses a non-EducationOrganization domain entity should have validation failure -> sourceMap');
  });
});

// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/CommonProperty/CommonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension';

describe('when validating common property has extension override of common type extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const commonTypeName: string = 'CommonType';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(commonTypeName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartCommonExtension(commonTypeName)
      .withBooleanProperty('PropertyName3', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName2', 'PropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withCommonExtensionOverrideProperty(commonTypeName, 'PropertyDocumentation', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating common property has extension override of non common type extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const commonTypeName: string = 'CommonType';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(commonTypeName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName2', 'PropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withCommonExtensionOverrideProperty(commonTypeName, 'PropertyDocumentation', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have validation failure for property', () => {
    expect(failures[0].validatorName).toBe('CommonPropertyWIthExtensionOverrideMustReferenceCommonTypeExtension');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating common property has extension override of non common type extension should have validation failures -> message ');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common property has extension override of non common type extension should have validation failures -> sourceMap');
  });
});

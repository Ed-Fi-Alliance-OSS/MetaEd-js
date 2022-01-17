import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  EnumerationBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/SchoolYearEnumerationProperty/SchoolYearEnumerationPropertyMustMatchASchoolYearEnumeration';

describe('when school year enumeration property has valid identifier', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'SchoolYear';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartEnumeration(entityName)
      .withDocumentation('EntityDocumentation')
      .withEnumerationItem('ShortDescription1', 'EnumerationItemDocumentation1')
      .withEnumerationItem('ShortDescription2', 'EnumerationItemDocumentation2')
      .withEndEnumeration()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomainEntity('EntityName2')
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
      .withEnumerationProperty(`EdFi.${entityName}`, 'PropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one enumeration', (): void => {
    expect(coreNamespace.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should build one domain entity', (): void => {
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when enumeration property has invalid reference', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName1')
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
      .withEnumerationProperty('SchoolYear', 'PropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SchoolYearEnumerationPropertyMustMatchASchoolYearEnumeration');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Enumeration property 'SchoolYear' does not match any declared Enumeration in namespace EdFi."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 16,
        "line": 10,
        "tokenText": "SchoolYear",
      }
    `);
  });
});

describe('when school year enumeration property is missing namespace reference to core', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'SchoolYear';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartEnumeration(entityName)
      .withDocumentation('EntityDocumentation')
      .withEnumerationItem('ShortDescription1', 'EnumerationItemDocumentation1')
      .withEnumerationItem('ShortDescription2', 'EnumerationItemDocumentation2')
      .withEndEnumeration()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomainEntity('EntityName2')
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
      .withEnumerationProperty(entityName, 'PropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one enumeration', (): void => {
    expect(coreNamespace.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should build one domain entity', (): void => {
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SchoolYearEnumerationPropertyMustMatchASchoolYearEnumeration');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Enumeration property 'SchoolYear' does not match any declared Enumeration in namespace Extension."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 16,
        "line": 21,
        "tokenText": "SchoolYear",
      }
    `);
  });
});

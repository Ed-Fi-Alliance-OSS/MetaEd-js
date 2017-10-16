// @flow
import {
  AssociationBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  DomainEntityExtensionBuilder,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/MergePartOfReference/MergePropertyAndTargetPropertyMustMatch';

describe('when validating merge property name and types match', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const integerIdentityName: string = 'IntegerIdentityName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(integerIdentityName, 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(integerIdentityName, 'DomainEntityPropertyDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withMergePartOfReference(`${domainEntityName1}.${integerIdentityName}`, integerIdentityName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge property type mismatch', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const contextName1: string = 'ContextName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName3')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', contextName1)
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withMergePartOfReference(`${domainEntityName1}.${domainEntityName2}`, `${contextName1}${domainEntityName1}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MergePropertyAndTargetPropertyMustMatch');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating merge property type mismatch should have validation failure -> message ');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating merge property type mismatch should have validation failure -> sourceMap');
  });
});

describe('when validating merge of nested domain entity with domain entity properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';

    MetaEdTextBuilder.build()
    .withBeginNamespace('edfi')
    .withStartDomainEntity(domainEntityName1)
    .withDocumentation('DomainEntityDocumentation')
    .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
    .withEndDomainEntity()

    .withStartDomainEntity(domainEntityName2)
    .withDocumentation('DomainEntityDocumentation')
    .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation')
    .withEndDomainEntity()

    .withStartDomainEntity('DomainEntityName3')
    .withDocumentation('DomainEntityDocumentation')
    .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
    .withDomainEntityIdentity(domainEntityName2, 'DomainEntityPropertyDocumentation')
    .withMergePartOfReference(`${domainEntityName2}.${domainEntityName1}`, `${domainEntityName1}`)
    .withEndDomainEntity()
    .withEndNamespace()

    .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge of domain entity with nested domain entity properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';

    MetaEdTextBuilder.build()
    .withBeginNamespace('edfi')
    .withStartDomainEntity(domainEntityName1)
    .withDocumentation('DomainEntityDocumentation')
    .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
    .withEndDomainEntity()

    .withStartDomainEntity(domainEntityName2)
    .withDocumentation('DomainEntityDocumentation')
    .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation')
    .withEndDomainEntity()

    .withStartDomainEntity('DomainEntityName3')
    .withDocumentation('DomainEntityDocumentation')
    .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
    .withMergePartOfReference(`${domainEntityName1}`, `${domainEntityName2}.${domainEntityName1}`)
    .withDomainEntityIdentity(domainEntityName2, 'DomainEntityPropertyDocumentation')
    .withEndDomainEntity()
    .withEndNamespace()

    .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge of doubly nested domain entity with domain entity properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const domainEntityName3: string = 'DomainEntityName3';

    MetaEdTextBuilder.build()
    .withBeginNamespace('edfi')
    .withStartDomainEntity(domainEntityName1)
    .withDocumentation('DomainEntityDocumentation')
    .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
    .withEndDomainEntity()

    .withStartDomainEntity(domainEntityName2)
    .withDocumentation('DomainEntityDocumentation')
    .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation')
    .withEndDomainEntity()

    .withStartDomainEntity(domainEntityName3)
    .withDocumentation('DomainEntityDocumentation')
    .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation')
    .withEndDomainEntity()

    .withStartDomainEntity('DomainEntityName4')
    .withDocumentation('DomainEntityDocumentation')
    .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
    .withDomainEntityIdentity(domainEntityName3, 'DomainEntityPropertyDocumentation')
    .withMergePartOfReference(`${domainEntityName3}.${domainEntityName2}.${domainEntityName1}`, `${domainEntityName1}`)
    .withEndDomainEntity()
    .withEndNamespace()

    .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build four domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(4);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge of domain entity and domain entity subclass properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const domainEntityName: string = 'DomainEntityNameTest';
    const domainEntitySubclassName: string = 'DomainEntitySubclassName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity('DomainEntityIdentity', 'DomainEntityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, domainEntityName)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName, 'DomainEntityPropertyDocumentation')
      .withMergePartOfReference(domainEntityName, domainEntitySubclassName)
      .withDomainEntityIdentity(domainEntitySubclassName, 'DomainEntityPropertyDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge of domain entity and domain entity subclass properties of base entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const domainEntityName3: string = 'DomainEntityName3';
    const domainEntitySubclassName: string = 'DomainEntitySubclassName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName4')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntitySubclassName, 'DomainEntityPropertyDocumentation')
      .withDomainEntityIdentity(domainEntityName3, 'DomainEntityPropertyDocumentation')
      .withMergePartOfReference(`${domainEntityName3}.${domainEntityName1}`, `${domainEntitySubclassName}.${domainEntityName1}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build four domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(4);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge of domain entity, domain entity extension, and domain entity subclass properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntitySubclassName: string = 'DomainEntitySubclassName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntityExtension(domainEntityName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntityExtension()

      .withStartDomainEntitySubclass(domainEntitySubclassName, domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName3', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity('DomainEntityName3')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withDomainEntityIdentity(domainEntitySubclassName, 'DomainEntityPropertyDocumentation')
      .withMergePartOfReference(domainEntitySubclassName, domainEntityName1)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merging domain entity property of an association', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const domainEntityName3: string = 'DomainEntityName3';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartAssociation('AssociationName')
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName3, 'AssociationDomainEntityPropertyDocumentation')
      .withIntegerIdentity('IntegerIdentityName3', 'IntegerIdentityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withMergePartOfReference(domainEntityName1, `${domainEntityName2}.${domainEntityName1}`)
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

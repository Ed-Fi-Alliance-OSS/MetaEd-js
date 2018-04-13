// @flow
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import {
  ChoiceBuilder,
  CommonBuilder,
  DomainEntityBuilder,
  NamespaceInfoBuilder,
  MetaEdTextBuilder,
  newMetaEdEnvironment,
  newSourceMap,
} from 'metaed-core';
import { failReferencedPropertyDoesNotExist } from '../../../src/validator/ValidatorShared/FailReferencedPropertyDoesNotExist';

describe('when validating merge property path', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const integerIdentityName1: string = 'IntegerIdentityName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName1): any),
      [integerIdentityName1],
      'IntegerIdentityName2',
      newSourceMap(),
      failures,
    );
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with no matching merge property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName1): any),
      ['IntegerIdentityName2'],
      'DomainEntityName2',
      newSourceMap(),
      failures,
    );
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});
// Broke
describe('when validating path with merge property collection targeting non identity on current', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const contextName1: string = 'ContextName1';
    const contextName2: string = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityProperty(domainEntityName1, 'DomainEntityPropertyDocumentation', false, false, false, contextName1)
      .withDomainEntityProperty(domainEntityName1, 'DomainEntityPropertyDocumentation', false, true, false, contextName2)
      .withIntegerProperty('IntegerPropertyName', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [`${contextName1}${domainEntityName1}`],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
  });
});

describe('when validating path with merge property collection targeting identity on current', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const contextName1: string = 'ContextName1';
    const contextName2: string = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', contextName1)
      .withDomainEntityProperty(domainEntityName1, 'DomainEntityPropertyDocumentation', false, true, false, contextName2)
      .withIntegerProperty('IntegerPropertyName', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [`${contextName1}${domainEntityName1}`],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with merge property targeting non identity on current', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const contextName2: string = 'ContextName2';
    const integerPropertyName1: string = 'IntegerPropertyName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', 'ContextName1')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', contextName2)
      .withIntegerProperty(integerPropertyName1, 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [integerPropertyName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with merge property targeting identity on reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const contextName1: string = 'ContextName1';
    const contextName2: string = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation', contextName1)
      .withDomainEntityProperty(domainEntityName2, 'DomainEntityPropertyDocumentation', false, true, false, contextName2)
      .withIntegerProperty('IntegerPropertyName', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName3')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', contextName1)
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation', contextName2)
      .withIntegerProperty('IntegerPropertyName', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [`${contextName1}${domainEntityName1}`, `${contextName1}${domainEntityName2}`],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with merge property targeting non identity on reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const domainEntityName3: string = 'DomainEntityName3';
    const contextName1: string = 'ContextName1';
    const contextName2: string = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation', contextName1)
      .withDomainEntityProperty(domainEntityName2, 'DomainEntityPropertyDocumentation', true, false, false, contextName2)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', contextName1)
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation', contextName2)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName3): any),
      [`${contextName1}${domainEntityName1}`, `${contextName2}${domainEntityName2}`],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
  });
});

describe('when validating path with merge property targeting optional on common type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const CommonName1: string = 'CommonName1';
    const contextName1: string = 'ContextName1';
    const contextName2: string = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withIntegerProperty('IntegerPropertyName2', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartCommon(CommonName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withCommonProperty(CommonName1, 'CommonPropertyDocumentation', false, false, contextName1)
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', contextName2)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [`${contextName1}${CommonName1}`, domainEntityName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with merge property targeting non identity inline common type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const CommonName1: string = 'CommonName1';
    const contextName1: string = 'ContextName1';
    const contextName2: string = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
      .withIntegerProperty('IntegerPropertyName', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartInlineCommon(CommonName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityProperty(domainEntityName1, 'DomainEntityPropertyDocumentation', false, false)
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withInlineCommonProperty(CommonName1, 'InlineCommonPropertyDocumentation', false, false, contextName1)
      .withDomainEntityProperty(domainEntityName1, 'DomainEntityPropertyDocumentation', false, true, false, contextName2)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [`${contextName1}${CommonName1}`, domainEntityName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
  });
});

describe('when validating path with merge property targeting non identity choice type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const ChoiceName1: string = 'ChoiceName1';
    const contextName1: string = 'ContextName1';
    const contextName2: string = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withIntegerProperty('IntegerPropertyName2', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartChoice(ChoiceName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityProperty(domainEntityName1, 'DomainEntityPropertyDocumentation', false, false)
      .withEndChoice()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withChoiceProperty(ChoiceName1, 'InlineCommonPropertyDocumentation', false, false, contextName1)
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', contextName2)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [`${contextName1}${ChoiceName1}`, domainEntityName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one choice', () => {
    expect(metaEd.entity.choice.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with merge property collection targeting non identity choice type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const ChoiceName1: string = 'ChoiceName1';
    const contextName1: string = 'ContextName1';
    const contextName2: string = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
      .withIntegerProperty('IntegerPropertyName', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartChoice(ChoiceName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityProperty(domainEntityName1, 'DomainEntityPropertyDocumentation', false, false)
      .withEndChoice()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withChoiceProperty(ChoiceName1, 'InlineCommonPropertyDocumentation', false, false, contextName1)
      .withDomainEntityProperty(domainEntityName1, 'DomainEntityPropertyDocumentation', false, true, false, contextName2)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [`${contextName1}${ChoiceName1}`, domainEntityName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one choice', () => {
    expect(metaEd.entity.choice.size).toBe(1);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
  });
});

describe('when validating path with merge property collection targeting identity choice type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: Array<ValidationFailure> = [];

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntityName2: string = 'DomainEntityName2';
    const ChoiceName1: string = 'ChoiceName1';
    const contextName1: string = 'ContextName1';
    const contextName2: string = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
      .withIntegerProperty('IntegerPropertyName', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartChoice(ChoiceName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation')
      .withEndChoice()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withChoiceProperty(ChoiceName1, 'InlineCommonPropertyDocumentation', false, false, contextName1)
      .withDomainEntityProperty(domainEntityName1, 'DomainEntityPropertyDocumentation', false, true, false, contextName2)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [`${contextName1}${ChoiceName1}`, domainEntityName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one choice', () => {
    expect(metaEd.entity.choice.size).toBe(1);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
  });
});

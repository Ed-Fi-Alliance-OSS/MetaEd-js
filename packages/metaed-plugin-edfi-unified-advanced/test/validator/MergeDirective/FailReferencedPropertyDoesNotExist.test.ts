import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import {
  ChoiceBuilder,
  CommonBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
  MetaEdTextBuilder,
  newMetaEdEnvironment,
  newSourceMap,
} from '@edfi/metaed-core';
import { failReferencedPropertyDoesNotExist } from '../../../src/validator/MergeDirective/FailReferencedPropertyDoesNotExist';

describe('when validating merge property path', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const integerIdentityName1 = 'IntegerIdentityName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName1) as any,
      [integerIdentityName1],
      'IntegerIdentityName2',
      newSourceMap(),
      failures,
    );
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with no matching merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName1) as any,
      ['IntegerIdentityName2'],
      'DomainEntityName2',
      newSourceMap(),
      failures,
    );
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
// Broke
describe('when validating path with merge property collection targeting non identity on current', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const contextName1 = 'ContextName1';
    const contextName2 = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [`${contextName1}${domainEntityName1}`],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
  });
});

describe('when validating path with merge property collection targeting identity on current', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const contextName1 = 'ContextName1';
    const contextName2 = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [`${contextName1}${domainEntityName1}`],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with merge property targeting non identity on current', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const contextName2 = 'ContextName2';
    const integerPropertyName1 = 'IntegerPropertyName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [integerPropertyName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with merge property targeting identity on reference', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const contextName1 = 'ContextName1';
    const contextName2 = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [`${contextName1}${domainEntityName1}`, `${contextName1}${domainEntityName2}`],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with merge property targeting non identity on reference', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    const contextName1 = 'ContextName1';
    const contextName2 = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName3) as any,
      [`${contextName1}${domainEntityName1}`, `${contextName2}${domainEntityName2}`],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
  });
});

describe('when validating path with merge property targeting optional on common type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const CommonName1 = 'CommonName1';
    const contextName1 = 'ContextName1';
    const contextName2 = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [`${contextName1}${CommonName1}`, domainEntityName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one common', (): void => {
    expect(coreNamespace.entity.common.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with merge property targeting non identity inline common type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const CommonName1 = 'CommonName1';
    const contextName1 = 'ContextName1';
    const contextName2 = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [`${contextName1}${CommonName1}`, domainEntityName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one common', (): void => {
    expect(coreNamespace.entity.common.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
  });
});

describe('when validating path with merge property targeting non identity choice type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const ChoiceName1 = 'ChoiceName1';
    const contextName1 = 'ContextName1';
    const contextName2 = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [`${contextName1}${ChoiceName1}`, domainEntityName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one choice', (): void => {
    expect(coreNamespace.entity.choice.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating path with merge property collection targeting non identity choice type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const ChoiceName1 = 'ChoiceName1';
    const contextName1 = 'ContextName1';
    const contextName2 = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [`${contextName1}${ChoiceName1}`, domainEntityName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one choice', (): void => {
    expect(coreNamespace.entity.choice.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
  });
});

describe('when validating path with merge property collection targeting identity choice type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const failures: ValidationFailure[] = [];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const ChoiceName1 = 'ChoiceName1';
    const contextName1 = 'ContextName1';
    const contextName2 = 'ContextName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    failReferencedPropertyDoesNotExist(
      'failReferencedPropertyDoesNotExistTest',
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [`${contextName1}${ChoiceName1}`, domainEntityName1],
      `${contextName2}${domainEntityName1}`,
      newSourceMap(),
      failures,
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one choice', (): void => {
    expect(coreNamespace.entity.choice.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
  });
});

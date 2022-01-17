import {
  AssociationBuilder,
  CommonBuilder,
  DescriptorBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  EnumerationBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import { MetaEdEnvironment } from '@edfi/metaed-core';
import {
  column,
  enhanceGenerateAndExecuteSql,
  foreignKey,
  table,
  testTearDown,
  testSuiteAfterAll,
} from './DatabaseTestBase';
import { columnExists, columnIsNullable } from './DatabaseColumn';
import { foreignKeyDeleteCascades, foreignKeyExists } from './DatabaseForeignKey';
import { tableExists, tablePrimaryKeys } from './DatabaseTable';
import { DatabaseColumn } from './DatabaseColumn';
import { DatabaseForeignKey } from './DatabaseForeignKey';

jest.setTimeout(40000);

afterAll(async () => testSuiteAfterAll());

describe('when domain entity merges references', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName2, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation', contextName)
      .withMergeDirective(contextName + domainEntityName1, `${domainEntityName2}.${domainEntityName1}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should not have merge path column', async () => {
    const column1: DatabaseColumn = column(namespaceName, domainEntityName3, contextName + integerPropertyName3);
    expect(await columnExists(column1)).toBe(false);
  });

  it('should use target path in place of merge path', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName3, integerPropertyName1),
        column(namespaceName, domainEntityName3, integerPropertyName2),
        column(namespaceName, domainEntityName3, integerPropertyName3),
      ],
      [
        column(namespaceName, domainEntityName2, integerPropertyName1),
        column(namespaceName, domainEntityName2, integerPropertyName2),
        column(namespaceName, domainEntityName2, integerPropertyName3),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when domain entity merges abstract references', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const abstractEntityName = 'AbstractEntityName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyName4 = 'IntegerPropertyName4';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentityRename(integerPropertyName2, integerPropertyName1, 'Documentation')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withDomainEntityIdentity(abstractEntityName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName4, 'Documentation')
      .withDomainEntityIdentity(domainEntitySubclassName, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withMergeDirective(`${domainEntityName1}.${abstractEntityName}`, domainEntitySubclassName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should not have merge path column', async () => {
    const column1: DatabaseColumn = column(namespaceName, domainEntityName2, integerPropertyName1);
    expect(await columnExists(column1)).toBe(false);
  });

  it('should use target path in place of merge path', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName2, integerPropertyName2),
        column(namespaceName, domainEntityName2, integerPropertyName3),
      ],
      [
        column(namespaceName, domainEntityName1, integerPropertyName1),
        column(namespaceName, domainEntityName1, integerPropertyName3),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when domain entity merges collection references', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const abstractEntityName = 'AbstractEntityName';
  const commonName = 'CommonName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyName4 = 'IntegerPropertyName4';
  const integerPropertyName5 = 'IntegerPropertyName5';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentityRename(integerPropertyName2, integerPropertyName1, 'Documentation')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withDomainEntityIdentity(abstractEntityName, 'Documentation')
      .withEndDomainEntity()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName4, 'Documentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName5, 'Documentation')
      .withDomainEntityIdentity(domainEntitySubclassName, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withMergeDirective(`${domainEntityName1}.${abstractEntityName}`, domainEntitySubclassName)
      .withCommonProperty(commonName, 'Documentation', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName2 + commonName))).toBe(true);
  });

  it('should not have merge path column', async () => {
    const column1: DatabaseColumn = column(namespaceName, domainEntityName2 + commonName, integerPropertyName1);
    expect(await columnExists(column1)).toBe(false);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName2 + commonName, integerPropertyName2),
        column(namespaceName, domainEntityName2 + commonName, integerPropertyName3),
        column(namespaceName, domainEntityName2 + commonName, integerPropertyName5),
      ],
      [
        column(namespaceName, domainEntityName2, integerPropertyName2),
        column(namespaceName, domainEntityName2, integerPropertyName3),
        column(namespaceName, domainEntityName2, integerPropertyName5),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);
  });
});

describe('when association merges domain entity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const shortenTo = 'ShortenTo';
  const abstractEntityName = 'AbstractEntityName';
  const associationName1 = 'AssociationName1';
  const associationName2 = 'AssociationName2';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyName4 = 'IntegerPropertyName4';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndAbstractEntity()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName1)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(abstractEntityName, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName, 'Documentation')
      .withIntegerIdentity(shortenTo + integerPropertyName3, 'Documentation')
      .withEndAssociation()

      .withStartAssociation(associationName2)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(abstractEntityName, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName, 'Documentation')
      .withIntegerIdentity(integerPropertyName4, 'Documentation')
      .withAssociationProperty(associationName1, 'Documentation', false, false)
      .roleName(associationName1, shortenTo)
      .withMergeDirective(`${associationName1}.${domainEntityName}`, domainEntityName)
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should not have merge path column', async () => {
    const contextColumn1: DatabaseColumn = column(namespaceName, associationName2, shortenTo + integerPropertyName2);
    expect(await columnExists(contextColumn1)).toBe(false);
  });

  it('should hav reference columns', async () => {
    const referenceColumn1: DatabaseColumn = column(namespaceName, associationName2, shortenTo + integerPropertyName1);
    expect(await columnExists(referenceColumn1)).toBe(true);
    expect(await columnIsNullable(referenceColumn1)).toBe(true);

    const referenceColumn2: DatabaseColumn = column(namespaceName, associationName2, shortenTo + integerPropertyName3);
    expect(await columnExists(referenceColumn2)).toBe(true);
    expect(await columnIsNullable(referenceColumn2)).toBe(true);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, associationName2, shortenTo + integerPropertyName1),
        column(namespaceName, associationName2, integerPropertyName2),
        column(namespaceName, associationName2, shortenTo + integerPropertyName3),
      ],
      [
        column(namespaceName, associationName1, integerPropertyName1),
        column(namespaceName, associationName1, integerPropertyName2),
        column(namespaceName, associationName1, shortenTo + integerPropertyName3),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when domain entity merges deep path', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const abstractEntityName = 'AbstractEntityName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const domainEntityName4 = 'DomainEntityName4';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyName4 = 'IntegerPropertyName4';
  const integerPropertyName5 = 'IntegerPropertyName5';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentityRename(integerPropertyName2, integerPropertyName1, 'Documentation')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withDomainEntityIdentity(domainEntitySubclassName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName4, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName5, 'Documentation')
      .withDomainEntityIdentity(abstractEntityName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName4)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName2, 'Documentation')
      .withDomainEntityIdentity(domainEntityName3, 'Documentation')
      .withMergeDirective(
        `${domainEntityName3}.${abstractEntityName}`,
        `${domainEntityName2}.${domainEntityName1}.${domainEntitySubclassName}`,
      )
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should not have merge path column', async () => {
    const column1: DatabaseColumn = column(namespaceName, domainEntityName4, integerPropertyName1);
    expect(await columnExists(column1)).toBe(false);
  });

  it('should use target path in place of merge path', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName4, integerPropertyName2),
        column(namespaceName, domainEntityName4, integerPropertyName5),
      ],
      [
        column(namespaceName, domainEntityName3, integerPropertyName1),
        column(namespaceName, domainEntityName3, integerPropertyName5),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when domain entity merges collection property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withDomainEntityProperty(domainEntityName2, 'Documentation', false, true, false, domainEntityName2)
      .withMergeDirective(`${domainEntityName2}.${domainEntityName1}`, domainEntityName1)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName1))).toBe(true);
  });

  it('should have reference properties', async () => {
    const referenceColumn1: DatabaseColumn = column(namespaceName, domainEntityName3, integerPropertyName1);
    expect(await columnExists(referenceColumn1)).toBe(true);
    expect(await columnIsNullable(referenceColumn1)).toBe(false);

    const referenceColumn2: DatabaseColumn = column(namespaceName, domainEntityName3, integerPropertyName2);
    expect(await columnExists(referenceColumn2)).toBe(true);
    expect(await columnIsNullable(referenceColumn2)).toBe(false);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName3 + domainEntityName2))).toBe(true);
  });

  it('should have reference properties', async () => {
    const referenceColumn1: DatabaseColumn = column(
      namespaceName,
      domainEntityName3 + domainEntityName2,
      integerPropertyName1,
    );
    expect(await columnExists(referenceColumn1)).toBe(true);
    expect(await columnIsNullable(referenceColumn1)).toBe(false);

    const referenceColumn2: DatabaseColumn = column(
      namespaceName,
      domainEntityName3 + domainEntityName2,
      integerPropertyName2,
    );
    expect(await columnExists(referenceColumn2)).toBe(true);
    expect(await columnIsNullable(referenceColumn2)).toBe(false);
  });

  it('should not have merge path column', async () => {
    expect(
      await columnExists(
        column(namespaceName, domainEntityName3 + domainEntityName2, domainEntityName2 + integerPropertyName1),
      ),
    ).toBe(false);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName3 + domainEntityName2))).toEqual([
      domainEntityName2 + integerPropertyName2,
      integerPropertyName1,
      integerPropertyName2,
    ]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName3 + domainEntityName2, integerPropertyName1),
        column(namespaceName, domainEntityName3 + domainEntityName2, domainEntityName2 + integerPropertyName2),
      ],
      [
        column(namespaceName, domainEntityName2, integerPropertyName1),
        column(namespaceName, domainEntityName2, integerPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when domain entity merges self reference property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withDomainEntityProperty(domainEntityName2, 'Documentation', false, false, false, contextName)
      .withMergeDirective(`${contextName + domainEntityName2}.${domainEntityName1}`, domainEntityName1)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName2))).toBe(true);
  });

  it('should have reference property', async () => {
    const referenceColumn: DatabaseColumn = column(namespaceName, domainEntityName2, integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
  });

  it('should have self reference property', async () => {
    const referenceColumn: DatabaseColumn = column(namespaceName, domainEntityName2, contextName + integerPropertyName2);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(true);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName2, integerPropertyName1),
        column(namespaceName, domainEntityName2, contextName + integerPropertyName2),
      ],
      [
        column(namespaceName, domainEntityName2, integerPropertyName1),
        column(namespaceName, domainEntityName2, integerPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when domain entity merges descriptor property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const contextName = 'ContextName';
  const descriptorName = 'DescriptorName';
  const descriptorIdColumnName = `${descriptorName}DescriptorId`;
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('Documentation')
      .withEndDescriptor()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withDescriptorIdentity(descriptorName, 'Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDescriptorIdentity(descriptorName, 'Documentation')
      .withDomainEntityIdentity(domainEntityName2, 'Documentation', contextName)
      .withMergeDirective(`${contextName + domainEntityName2}.${domainEntityName1}.${descriptorName}`, descriptorName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName3))).toBe(true);
  });

  it('should have reference properties', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, domainEntityName3, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);

    const referenceColumn: DatabaseColumn = column(namespaceName, domainEntityName3, contextName + integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
  });

  it('should not have merge path column', async () => {
    expect(await columnExists(column(namespaceName, domainEntityName3, contextName + descriptorIdColumnName))).toBe(false);
  });

  it('should have referenced domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName2))).toBe(true);
  });

  it('should have reference properties', async () => {
    const descriptorIdColumn: DatabaseColumn = column(namespaceName, domainEntityName2, descriptorIdColumnName);
    expect(await columnExists(descriptorIdColumn)).toBe(true);
    expect(await columnIsNullable(descriptorIdColumn)).toBe(false);

    const referenceColumn: DatabaseColumn = column(namespaceName, domainEntityName2, integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName3, descriptorIdColumnName),
        column(namespaceName, domainEntityName3, contextName + integerPropertyName1),
        column(namespaceName, domainEntityName3, contextName + integerPropertyName2),
      ],
      [
        column(namespaceName, domainEntityName2, descriptorIdColumnName),
        column(namespaceName, domainEntityName2, integerPropertyName1),
        column(namespaceName, domainEntityName2, integerPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when domain entity merges enumeration property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const contextName = 'ContextName';
  const enumerationName = 'EnumerationName';
  const enumerationIdColumnName = `${enumerationName}TypeId`;
  const enumerationItemName = 'EnumerationItemName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withDocumentation('Documentation')
      .withEnumerationItem(enumerationItemName)
      .withEndEnumeration()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withEnumerationIdentity(enumerationName, 'Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withEnumerationIdentity(enumerationName, 'Documentation')
      .withDomainEntityIdentity(domainEntityName2, 'Documentation', contextName)
      .withMergeDirective(`${contextName + domainEntityName2}.${domainEntityName1}.${enumerationName}`, enumerationName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName3))).toBe(true);
  });

  it('should have reference properties', async () => {
    const enumerationIdColumn: DatabaseColumn = column(namespaceName, domainEntityName3, enumerationIdColumnName);
    expect(await columnExists(enumerationIdColumn)).toBe(true);
    expect(await columnIsNullable(enumerationIdColumn)).toBe(false);

    const referenceColumn: DatabaseColumn = column(namespaceName, domainEntityName3, contextName + integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
  });

  it('should not have merge path column', async () => {
    expect(await columnExists(column(namespaceName, domainEntityName3, contextName + enumerationIdColumnName))).toBe(false);
  });

  it('should have referenced domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName2))).toBe(true);
  });

  it('should have reference properties', async () => {
    const enumerationIdColumn: DatabaseColumn = column(namespaceName, domainEntityName2, enumerationIdColumnName);
    expect(await columnExists(enumerationIdColumn)).toBe(true);
    expect(await columnIsNullable(enumerationIdColumn)).toBe(false);

    const referenceColumn: DatabaseColumn = column(namespaceName, domainEntityName2, integerPropertyName1);
    expect(await columnExists(referenceColumn)).toBe(true);
    expect(await columnIsNullable(referenceColumn)).toBe(false);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [
        column(namespaceName, domainEntityName3, enumerationIdColumnName),
        column(namespaceName, domainEntityName3, contextName + integerPropertyName1),
        column(namespaceName, domainEntityName3, contextName + integerPropertyName2),
      ],
      [
        column(namespaceName, domainEntityName2, enumerationIdColumnName),
        column(namespaceName, domainEntityName2, integerPropertyName1),
        column(namespaceName, domainEntityName2, integerPropertyName2),
      ],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

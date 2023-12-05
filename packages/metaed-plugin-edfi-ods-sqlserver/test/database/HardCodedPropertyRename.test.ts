import {
  DomainEntityBuilder,
  EnumerationBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  column,
  columnDataTypes,
  enhanceGenerateAndExecuteSql,
  foreignKey,
  table,
  testTearDown,
  index,
  testSuiteAfterAll,
} from './DatabaseTestBase';
import {
  columnExists,
  columnIsNullable,
  columnDataType,
  columnDefaultConstraint,
  columnIsIdentity,
  columnLength,
  columnNthRowValue,
} from './DatabaseColumn';
import { foreignKeyDeleteCascades, foreignKeyExists } from './DatabaseForeignKey';
import { indexExists, indexIsUnique } from './DatabaseIndex';
import { tableExists, tablePrimaryKeys } from './DatabaseTable';
import { DatabaseColumn } from './DatabaseColumn';
import { DatabaseForeignKey } from './DatabaseForeignKey';
import { DatabaseIndex } from './DatabaseIndex';

jest.setTimeout(40000);

afterAll(async () => testSuiteAfterAll());

describe('when domain entity is student', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const student = 'Student';
  const uniqueId = 'UniqueId';
  const usiColumnName = `${student}USI`;
  const uniqueIdColumnName: string = student + uniqueId;
  const maxLength = 32;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(student)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', maxLength.toString(), '1', student)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, student))).toBe(true);
  });

  it('should have correct columns', async () => {
    const usiColumn: DatabaseColumn = column(namespaceName, student, usiColumnName);
    expect(await columnExists(usiColumn)).toBe(true);
    expect(await columnIsNullable(usiColumn)).toBe(false);
    expect(await columnIsIdentity(usiColumn)).toBe(true);
    expect(await columnDataType(usiColumn)).toBe(columnDataTypes.integer);

    const uniqueIdColumn: DatabaseColumn = column(namespaceName, student, uniqueIdColumnName);
    expect(await columnExists(uniqueIdColumn)).toBe(true);
    expect(await columnIsNullable(uniqueIdColumn)).toBe(false);
    expect(await columnDataType(uniqueIdColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(uniqueIdColumn)).toBe(maxLength);
  });

  it('should have unique index', async () => {
    const uniqueIdIndex: DatabaseIndex = index(column(namespaceName, student, uniqueIdColumnName));
    expect(await indexExists(uniqueIdIndex)).toBe(true);
    expect(await indexIsUnique(uniqueIdIndex)).toBe(true);
  });

  it('should have usi primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, student))).toEqual([usiColumnName]);
  });
});

describe('when referenced domain entity is student', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName = 'IntegerPropertyName';
  const student = 'Student';
  const uniqueId = 'UniqueId';
  const usiColumnName = `${student}USI`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(student)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', '32', '1', student)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withDomainEntityIdentity(student, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have student table', async () => {
    expect(await tableExists(table(namespaceName, student))).toBe(true);
  });

  it('should have correct columns', async () => {
    const usiColumn: DatabaseColumn = column(namespaceName, domainEntityName, usiColumnName);
    expect(await columnExists(usiColumn)).toBe(true);
    expect(await columnIsNullable(usiColumn)).toBe(false);
    expect(await columnIsIdentity(usiColumn)).toBe(false);
    expect(await columnDataType(usiColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([integerPropertyName, usiColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, usiColumnName)],
      [column(namespaceName, student, usiColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when referenced domain entity across namespaces is student', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const extension = 'Extension';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName = 'IntegerPropertyName';
  const student = 'Student';
  const uniqueId = 'UniqueId';
  const usiColumnName = `${student}USI`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(student)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', '32', '1', student)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withDomainEntityIdentity(`${namespaceName}.${student}`, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(extension, domainEntityName))).toBe(true);
  });

  it('should have student table', async () => {
    expect(await tableExists(table(namespaceName, student))).toBe(true);
  });

  it('should have correct columns', async () => {
    const usiColumn: DatabaseColumn = column(extension, domainEntityName, usiColumnName);
    expect(await columnExists(usiColumn)).toBe(true);
    expect(await columnIsNullable(usiColumn)).toBe(false);
    expect(await columnIsIdentity(usiColumn)).toBe(false);
    expect(await columnDataType(usiColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(extension, domainEntityName))).toEqual([integerPropertyName, usiColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(extension, domainEntityName, usiColumnName)],
      [column(namespaceName, student, usiColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when domain entity is staff', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const staff = 'Staff';
  const uniqueId = 'UniqueId';
  const usiColumnName = `${staff}USI`;
  const uniqueIdColumnName: string = staff + uniqueId;
  const maxLength = 32;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(staff)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', maxLength.toString(), '1', staff)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, staff))).toBe(true);
  });

  it('should have correct columns', async () => {
    const usiColumn: DatabaseColumn = column(namespaceName, staff, usiColumnName);
    expect(await columnExists(usiColumn)).toBe(true);
    expect(await columnIsNullable(usiColumn)).toBe(false);
    expect(await columnIsIdentity(usiColumn)).toBe(true);
    expect(await columnDataType(usiColumn)).toBe(columnDataTypes.integer);

    const uniqueIdColumn: DatabaseColumn = column(namespaceName, staff, uniqueIdColumnName);
    expect(await columnExists(uniqueIdColumn)).toBe(true);
    expect(await columnIsNullable(uniqueIdColumn)).toBe(false);
    expect(await columnDataType(uniqueIdColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(uniqueIdColumn)).toBe(maxLength);
  });

  it('should have unique index', async () => {
    const uniqueIdIndex: DatabaseIndex = index(column(namespaceName, staff, uniqueIdColumnName));
    expect(await indexExists(uniqueIdIndex)).toBe(true);
    expect(await indexIsUnique(uniqueIdIndex)).toBe(true);
  });

  it('should have usi primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, staff))).toEqual([usiColumnName]);
  });
});

describe('when referenced domain entity is staff', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName = 'IntegerPropertyName';
  const staff = 'Staff';
  const uniqueId = 'UniqueId';
  const usiColumnName = `${staff}USI`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(staff)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', '32', '1', staff)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withDomainEntityIdentity(staff, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have staff table', async () => {
    expect(await tableExists(table(namespaceName, staff))).toBe(true);
  });

  it('should have correct columns', async () => {
    const usiColumn: DatabaseColumn = column(namespaceName, domainEntityName, usiColumnName);
    expect(await columnExists(usiColumn)).toBe(true);
    expect(await columnIsNullable(usiColumn)).toBe(false);
    expect(await columnIsIdentity(usiColumn)).toBe(false);
    expect(await columnDataType(usiColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([integerPropertyName, usiColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, usiColumnName)],
      [column(namespaceName, staff, usiColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when domain entity is parent', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const parent = 'Parent';
  const uniqueId = 'UniqueId';
  const usiColumnName = `${parent}USI`;
  const uniqueIdColumnName: string = parent + uniqueId;
  const maxLength = 32;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(parent)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', maxLength.toString(), '1', parent)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, parent))).toBe(true);
  });

  it('should have correct columns', async () => {
    const usiColumn: DatabaseColumn = column(namespaceName, parent, usiColumnName);
    expect(await columnExists(usiColumn)).toBe(true);
    expect(await columnIsNullable(usiColumn)).toBe(false);
    expect(await columnIsIdentity(usiColumn)).toBe(true);
    expect(await columnDataType(usiColumn)).toBe(columnDataTypes.integer);

    const uniqueIdColumn: DatabaseColumn = column(namespaceName, parent, uniqueIdColumnName);
    expect(await columnExists(uniqueIdColumn)).toBe(true);
    expect(await columnIsNullable(uniqueIdColumn)).toBe(false);
    expect(await columnDataType(uniqueIdColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(uniqueIdColumn)).toBe(maxLength);
  });

  it('should have unique index', async () => {
    const uniqueIdIndex: DatabaseIndex = index(column(namespaceName, parent, uniqueIdColumnName));
    expect(await indexExists(uniqueIdIndex)).toBe(true);
    expect(await indexIsUnique(uniqueIdIndex)).toBe(true);
  });

  it('should have usi primary key', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, parent))).toEqual([usiColumnName]);
  });
});

describe('when referenced domain entity is parent', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName = 'IntegerPropertyName';
  const parent = 'Parent';
  const uniqueId = 'UniqueId';
  const usiColumnName = `${parent}USI`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(parent)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', '32', '1', parent)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withDomainEntityIdentity(parent, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have parent table', async () => {
    expect(await tableExists(table(namespaceName, parent))).toBe(true);
  });

  it('should have correct columns', async () => {
    const usiColumn: DatabaseColumn = column(namespaceName, domainEntityName, usiColumnName);
    expect(await columnExists(usiColumn)).toBe(true);
    expect(await columnIsNullable(usiColumn)).toBe(false);
    expect(await columnIsIdentity(usiColumn)).toBe(false);
    expect(await columnDataType(usiColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([integerPropertyName, usiColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, usiColumnName)],
      [column(namespaceName, parent, usiColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when referenced domain entity is required', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName = 'IntegerPropertyName';
  const parent = 'Parent';
  const uniqueId = 'UniqueId';
  const usiColumnName = `${parent}USI`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(parent)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', '32', '1', parent)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withDomainEntityProperty(parent, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have parent table', async () => {
    expect(await tableExists(table(namespaceName, parent))).toBe(true);
  });

  it('should have correct columns', async () => {
    const usiColumn: DatabaseColumn = column(namespaceName, domainEntityName, usiColumnName);
    expect(await columnExists(usiColumn)).toBe(true);
    expect(await columnIsNullable(usiColumn)).toBe(false);
    expect(await columnIsIdentity(usiColumn)).toBe(false);
    expect(await columnDataType(usiColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([integerPropertyName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, usiColumnName)],
      [column(namespaceName, parent, usiColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when referenced domain entity is optional', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName = 'IntegerPropertyName';
  const parent = 'Parent';
  const uniqueId = 'UniqueId';
  const usiColumnName = `${parent}USI`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(parent)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', '32', '1', parent)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withDomainEntityProperty(parent, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have parent table', async () => {
    expect(await tableExists(table(namespaceName, parent))).toBe(true);
  });

  it('should have correct columns', async () => {
    const usiColumn: DatabaseColumn = column(namespaceName, domainEntityName, usiColumnName);
    expect(await columnExists(usiColumn)).toBe(true);
    expect(await columnIsNullable(usiColumn)).toBe(true);
    expect(await columnIsIdentity(usiColumn)).toBe(false);
    expect(await columnDataType(usiColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([integerPropertyName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, usiColumnName)],
      [column(namespaceName, parent, usiColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when referenced two domain entities with one as collection', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  const student = 'Student';
  const staff = 'Staff';
  const uniqueId = 'UniqueId';
  const studentUsiColumnName = `${student}USI`;
  const staffUsiColumnName = `${staff}USI`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(student)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', '32', '1', student)
      .withEndDomainEntity()

      .withStartDomainEntity(staff)
      .withDocumentation('Documentation')
      .withStringIdentity(uniqueId, 'Documentation', '32', '1', staff)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(student, 'Documentation')
      .withDomainEntityProperty(staff, 'Documentation', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have parent table', async () => {
    expect(await tableExists(table(namespaceName, student))).toBe(true);
  });

  it('should have correct columns', async () => {
    const studentUsiColumn: DatabaseColumn = column(namespaceName, domainEntityName, studentUsiColumnName);
    expect(await columnExists(studentUsiColumn)).toBe(true);
    expect(await columnIsNullable(studentUsiColumn)).toBe(false);
    expect(await columnIsIdentity(studentUsiColumn)).toBe(false);
    expect(await columnDataType(studentUsiColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([studentUsiColumnName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, studentUsiColumnName)],
      [column(namespaceName, student, studentUsiColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });

  it('should have collection table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName + staff))).toBe(true);
  });

  it('should have correct columns', async () => {
    const studentUsiColumn: DatabaseColumn = column(namespaceName, domainEntityName + staff, studentUsiColumnName);
    expect(await columnExists(studentUsiColumn)).toBe(true);
    expect(await columnIsNullable(studentUsiColumn)).toBe(false);
    expect(await columnIsIdentity(studentUsiColumn)).toBe(false);
    expect(await columnDataType(studentUsiColumn)).toBe(columnDataTypes.integer);

    const staffUsiColumn: DatabaseColumn = column(namespaceName, domainEntityName + staff, staffUsiColumnName);
    expect(await columnExists(staffUsiColumn)).toBe(true);
    expect(await columnIsNullable(staffUsiColumn)).toBe(false);
    expect(await columnIsIdentity(staffUsiColumn)).toBe(false);
    expect(await columnDataType(staffUsiColumn)).toBe(columnDataTypes.integer);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + staff, studentUsiColumnName)],
      [column(namespaceName, domainEntityName, studentUsiColumnName)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(true);

    const foreignKey2: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName + staff, staffUsiColumnName)],
      [column(namespaceName, staff, staffUsiColumnName)],
    );
    expect(await foreignKeyExists(foreignKey2)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey2)).toBe(false);
  });
});

describe('when enumeration is school year', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const schoolYear = 'SchoolYear';
  const schoolYearTableName = `${schoolYear}Type`;
  const year1 = '1991';
  const year2 = '1992';
  const year3 = '1993';
  const year4 = '1994';
  const year5 = '1995';
  const year6 = '1996';
  const year7 = '1997';
  const year8 = '1998';
  const year9 = '1999';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(schoolYear)
      .withDocumentation('Documentation')
      .withEnumerationItem(`${year1}-${year2}`)
      .withEnumerationItem(`${year2}-${year3}`)
      .withEnumerationItem(`${year3}-${year4}`)
      .withEnumerationItem(`${year4}-${year5}`)
      .withEnumerationItem(`${year5}-${year6}`)
      .withEnumerationItem(`${year6}-${year7}`)
      .withEnumerationItem(`${year7}-${year8}`)
      .withEnumerationItem(`${year8}-${year9}`)
      .withEndEnumeration()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, schoolYearTableName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const schoolYearColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, schoolYear);
    expect(await columnExists(schoolYearColumn)).toBe(true);
    expect(await columnIsNullable(schoolYearColumn)).toBe(false);
    expect(await columnDataType(schoolYearColumn)).toBe(columnDataTypes.smallint);

    const schoolYearDescriptionColumn: DatabaseColumn = column(
      namespaceName,
      schoolYearTableName,
      `${schoolYear}Description`,
    );
    expect(await columnExists(schoolYearDescriptionColumn)).toBe(true);
    expect(await columnIsNullable(schoolYearDescriptionColumn)).toBe(false);
    expect(await columnDataType(schoolYearDescriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(schoolYearDescriptionColumn)).toBe(50);

    const currentSchoolYearColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, `Current${schoolYear}`);
    expect(await columnExists(currentSchoolYearColumn)).toBe(true);
    expect(await columnIsNullable(currentSchoolYearColumn)).toBe(false);
    expect(await columnDataType(currentSchoolYearColumn)).toBe(columnDataTypes.bit);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, schoolYearTableName))).toEqual([schoolYear]);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getdate())');
  });

  it('should have correct inserted values', async () => {
    const schoolYearColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, schoolYear);
    expect(await columnExists(schoolYearColumn)).toBe(true);
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '1')).toBe(parseInt(year2, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '2')).toBe(parseInt(year3, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '3')).toBe(parseInt(year4, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '4')).toBe(parseInt(year5, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '5')).toBe(parseInt(year6, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '6')).toBe(parseInt(year7, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '7')).toBe(parseInt(year8, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '8')).toBe(parseInt(year9, 10));

    const schoolYearDescriptionColumn: DatabaseColumn = column(
      namespaceName,
      schoolYearTableName,
      `${schoolYear}Description`,
    );
    expect(await columnExists(schoolYearDescriptionColumn)).toBe(true);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '1')).toBe(`${year1}-${year2}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '2')).toBe(`${year2}-${year3}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '3')).toBe(`${year3}-${year4}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '4')).toBe(`${year4}-${year5}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '5')).toBe(`${year5}-${year6}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '6')).toBe(`${year6}-${year7}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '7')).toBe(`${year7}-${year8}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '8')).toBe(`${year8}-${year9}`);
  });
});

describe('when enumeration is school year for ODS/API 7.2+', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '5.0.0' };
  metaEd.plugin.set('edfiOdsSqlServer', { ...newPluginEnvironment(), targetTechnologyVersion: '7.2.0' });
  const namespaceName = 'Namespace';
  const schoolYear = 'SchoolYear';
  const schoolYearTableName = `${schoolYear}Type`;
  const year1 = '1991';
  const year2 = '1992';
  const year3 = '1993';
  const year4 = '1994';
  const year5 = '1995';
  const year6 = '1996';
  const year7 = '1997';
  const year8 = '1998';
  const year9 = '1999';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(schoolYear)
      .withDocumentation('Documentation')
      .withEnumerationItem(`${year1}-${year2}`)
      .withEnumerationItem(`${year2}-${year3}`)
      .withEnumerationItem(`${year3}-${year4}`)
      .withEnumerationItem(`${year4}-${year5}`)
      .withEnumerationItem(`${year5}-${year6}`)
      .withEnumerationItem(`${year6}-${year7}`)
      .withEnumerationItem(`${year7}-${year8}`)
      .withEnumerationItem(`${year8}-${year9}`)
      .withEndEnumeration()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, schoolYearTableName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const schoolYearColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, schoolYear);
    expect(await columnExists(schoolYearColumn)).toBe(true);
    expect(await columnIsNullable(schoolYearColumn)).toBe(false);
    expect(await columnDataType(schoolYearColumn)).toBe(columnDataTypes.smallint);

    const schoolYearDescriptionColumn: DatabaseColumn = column(
      namespaceName,
      schoolYearTableName,
      `${schoolYear}Description`,
    );
    expect(await columnExists(schoolYearDescriptionColumn)).toBe(true);
    expect(await columnIsNullable(schoolYearDescriptionColumn)).toBe(false);
    expect(await columnDataType(schoolYearDescriptionColumn)).toBe(columnDataTypes.nvarchar);
    expect(await columnLength(schoolYearDescriptionColumn)).toBe(50);

    const currentSchoolYearColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, `Current${schoolYear}`);
    expect(await columnExists(currentSchoolYearColumn)).toBe(true);
    expect(await columnIsNullable(currentSchoolYearColumn)).toBe(false);
    expect(await columnDataType(currentSchoolYearColumn)).toBe(columnDataTypes.bit);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, schoolYearTableName))).toEqual([schoolYear]);
  });

  it('should have standard resource columns', async () => {
    const idColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, 'Id');
    expect(await columnExists(idColumn)).toBe(true);
    expect(await columnIsNullable(idColumn)).toBe(false);
    expect(await columnDataType(idColumn)).toBe(columnDataTypes.uniqueIdentifier);
    expect(await columnDefaultConstraint(idColumn)).toBe('(newid())');

    const lastModifiedDateColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, 'LastModifiedDate');
    expect(await columnExists(lastModifiedDateColumn)).toBe(true);
    expect(await columnIsNullable(lastModifiedDateColumn)).toBe(false);
    expect(await columnDataType(lastModifiedDateColumn)).toBe(columnDataTypes.datetime2);
    expect(await columnDefaultConstraint(lastModifiedDateColumn)).toBe('(getutcdate())');

    const createDateColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, 'CreateDate');
    expect(await columnExists(createDateColumn)).toBe(true);
    expect(await columnIsNullable(createDateColumn)).toBe(false);
    expect(await columnDataType(createDateColumn)).toBe(columnDataTypes.datetime2);
    expect(await columnDefaultConstraint(createDateColumn)).toBe('(getutcdate())');
  });

  it('should have correct inserted values', async () => {
    const schoolYearColumn: DatabaseColumn = column(namespaceName, schoolYearTableName, schoolYear);
    expect(await columnExists(schoolYearColumn)).toBe(true);
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '1')).toBe(parseInt(year2, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '2')).toBe(parseInt(year3, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '3')).toBe(parseInt(year4, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '4')).toBe(parseInt(year5, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '5')).toBe(parseInt(year6, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '6')).toBe(parseInt(year7, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '7')).toBe(parseInt(year8, 10));
    expect(await columnNthRowValue(schoolYearColumn, schoolYear, '8')).toBe(parseInt(year9, 10));

    const schoolYearDescriptionColumn: DatabaseColumn = column(
      namespaceName,
      schoolYearTableName,
      `${schoolYear}Description`,
    );
    expect(await columnExists(schoolYearDescriptionColumn)).toBe(true);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '1')).toBe(`${year1}-${year2}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '2')).toBe(`${year2}-${year3}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '3')).toBe(`${year3}-${year4}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '4')).toBe(`${year4}-${year5}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '5')).toBe(`${year5}-${year6}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '6')).toBe(`${year6}-${year7}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '7')).toBe(`${year7}-${year8}`);
    expect(await columnNthRowValue(schoolYearDescriptionColumn, schoolYear, '8')).toBe(`${year8}-${year9}`);
  });
});

describe('when enumeration property is school year', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName = 'IntegerPropertyName';
  const schoolYear = 'SchoolYear';
  const schoolYearTableName = `${schoolYear}Type`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(schoolYear)
      .withDocumentation('Documentation')
      .withEnumerationItem('1991-1992')
      .withEnumerationItem('1992-1993')
      .withEnumerationItem('1993-1994')
      .withEnumerationItem('1994-1995')
      .withEnumerationItem('1995-1996')
      .withEnumerationItem('1996-1997')
      .withEnumerationItem('1997-1998')
      .withEnumerationItem('1998-1999')
      .withEndEnumeration()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withEnumerationIdentity(schoolYear, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have school year table', async () => {
    expect(await tableExists(table(namespaceName, schoolYearTableName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const schoolYearColumn: DatabaseColumn = column(namespaceName, domainEntityName, schoolYear);
    expect(await columnExists(schoolYearColumn)).toBe(true);
    expect(await columnIsNullable(schoolYearColumn)).toBe(false);
    expect(await columnDataType(schoolYearColumn)).toBe(columnDataTypes.smallint);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([integerPropertyName, schoolYear]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, schoolYear)],
      [column(namespaceName, schoolYearTableName, schoolYear)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

describe('when enumeration property is school year role name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const contextName = 'ContextName';
  const domainEntityName = 'DomainEntityName';
  const integerPropertyName = 'IntegerPropertyName';
  const schoolYear = 'SchoolYear';
  const schoolYearTableName = `${schoolYear}Type`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(schoolYear)
      .withDocumentation('Documentation')
      .withEnumerationItem('1991-1992')
      .withEnumerationItem('1992-1993')
      .withEnumerationItem('1993-1994')
      .withEnumerationItem('1994-1995')
      .withEnumerationItem('1995-1996')
      .withEnumerationItem('1996-1997')
      .withEnumerationItem('1997-1998')
      .withEnumerationItem('1998-1999')
      .withEndEnumeration()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName, 'Documentation')
      .withEnumerationProperty(schoolYear, 'Documentation', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    return enhanceGenerateAndExecuteSql(metaEd);
  });

  afterAll(async () => testTearDown());

  it('should have domain entity table', async () => {
    expect(await tableExists(table(namespaceName, domainEntityName))).toBe(true);
  });

  it('should have school year table', async () => {
    expect(await tableExists(table(namespaceName, schoolYearTableName))).toBe(true);
  });

  it('should have correct columns', async () => {
    const schoolYearColumn: DatabaseColumn = column(namespaceName, domainEntityName, contextName + schoolYear);
    expect(await columnExists(schoolYearColumn)).toBe(true);
    expect(await columnIsNullable(schoolYearColumn)).toBe(true);
    expect(await columnDataType(schoolYearColumn)).toBe(columnDataTypes.smallint);
  });

  it('should have correct primary keys', async () => {
    expect(await tablePrimaryKeys(table(namespaceName, domainEntityName))).toEqual([integerPropertyName]);
  });

  it('should have correct foreign key relationship', async () => {
    const foreignKey1: DatabaseForeignKey = foreignKey(
      [column(namespaceName, domainEntityName, contextName + schoolYear)],
      [column(namespaceName, schoolYearTableName, schoolYear)],
    );
    expect(await foreignKeyExists(foreignKey1)).toBe(true);
    expect(await foreignKeyDeleteCascades(foreignKey1)).toBe(false);
  });
});

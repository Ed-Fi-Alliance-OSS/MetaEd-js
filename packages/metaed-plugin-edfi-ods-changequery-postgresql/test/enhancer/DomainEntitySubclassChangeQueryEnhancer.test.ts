import { newDomainEntitySubclass, PluginEnvironment } from 'metaed-core';
import { MetaEdEnvironment, DomainEntitySubclass, Namespace } from 'metaed-core';
import {
  newTable,
  newColumn,
  newForeignKey,
  newForeignKeySourceReference,
  TableNameGroup,
  newTableNameGroup,
  newTableNameComponent,
} from 'metaed-plugin-edfi-ods-relational';
import {
  addEdFiOdsChangeQueryEntityRepositoryTo,
  deleteTrackingTableEntities,
  deleteTrackingTriggerEntities,
  pluginEnvironment,
} from 'metaed-plugin-edfi-ods-changequery';
import { enhance } from '../../src/enhancer/DomainEntitySubclassChangeQueryEnhancer';
import { metaEdEnvironmentForApiVersion, newCoreNamespace, newExtensionNamespace } from './TestHelper';
import { PLUGIN_NAME } from '../../src/PluginHelper';

describe('when enhancing core domainEntitySubclass targeting 2.3 ODS/API', (): void => {
  const namespaceName = 'EdFi';
  const metaEdName = 'MetaEdName';
  const tableName = 'TableName';
  const pkColumnName = 'PkColumnName';

  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('2.3.0');
  const namespace: Namespace = newCoreNamespace();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  beforeAll(() => {
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsEntityTable: {
            ...newTable(),
            name: tableName,
            nameComponents: [tableName],
            data: { edfiOdsPostgresql: { tableName } },
            schema: namespaceName,
            columns: [
              { ...newColumn(), data: { edfiOdsPostgresql: { columnName: pkColumnName } }, isPartOfPrimaryKey: true },
            ],
            foreignKeys: [
              {
                ...newForeignKey(),
                sourceReference: { ...newForeignKeySourceReference(), isSubclassRelationship: true },
                data: { edfiOdsPostgresql: { parentTableColumnNames: [], foreignTableColumnNames: [] } },
              },
            ],
          },
        },
      },
    });
    namespace.entity.domainEntitySubclass.set(domainEntitySubclass.metaEdName, domainEntitySubclass);

    enhance(metaEd);
  });

  it('should not create delete tracking table', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTables = deleteTrackingTableEntities(plugin, namespace);
    expect(deleteTrackingTables).toHaveLength(0);
  });

  it('should not create delete tracking trigger', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTriggers = deleteTrackingTriggerEntities(plugin, namespace);
    expect(deleteTrackingTriggers).toHaveLength(0);
  });
});

describe('when enhancing core domainEntitySubclass targeting 2.5 ODS/API', (): void => {
  const namespaceName = 'EdFi';
  const metaEdName = 'MetaEdName';
  const tableName = 'TableName';
  const pkColumnName = 'PkColumnName';

  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('2.5.0');
  const namespace: Namespace = newCoreNamespace();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  beforeAll(() => {
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsEntityTable: {
            ...newTable(),
            name: tableName,
            nameComponents: [tableName],
            data: { edfiOdsPostgresql: { tableName } },
            schema: namespaceName,
            columns: [
              { ...newColumn(), data: { edfiOdsPostgresql: { columnName: pkColumnName } }, isPartOfPrimaryKey: true },
            ],
            foreignKeys: [
              {
                ...newForeignKey(),
                sourceReference: { ...newForeignKeySourceReference(), isSubclassRelationship: true },
                data: { edfiOdsPostgresql: { parentTableColumnNames: [], foreignTableColumnNames: [] } },
              },
            ],
          },
        },
      },
    });
    namespace.entity.domainEntitySubclass.set(domainEntitySubclass.metaEdName, domainEntitySubclass);

    enhance(metaEd);
  });

  it('should not create delete tracking table', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTables = deleteTrackingTableEntities(plugin, namespace);
    expect(deleteTrackingTables).toHaveLength(0);
  });

  it('should not create delete tracking trigger', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTriggers = deleteTrackingTriggerEntities(plugin, namespace);
    expect(deleteTrackingTriggers).toHaveLength(0);
  });
});

describe('when enhancing extension domainEntitySubclass targeting 2.5 ODS/API', (): void => {
  const namespaceName = 'Extension';
  const metaEdName = 'MetaEdName';
  const tableName = 'TableName';
  const pkColumnName = 'PkColumnName';

  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('2.5.0');
  const namespace: Namespace = newExtensionNamespace(namespaceName);
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  beforeAll(() => {
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsEntityTable: {
            ...newTable(),
            name: tableName,
            nameComponents: [tableName],
            data: { edfiOdsPostgresql: { tableName } },
            schema: namespaceName,
            columns: [
              { ...newColumn(), data: { edfiOdsPostgresql: { columnName: pkColumnName } }, isPartOfPrimaryKey: true },
            ],
            foreignKeys: [
              {
                ...newForeignKey(),
                sourceReference: { ...newForeignKeySourceReference(), isSubclassRelationship: true },
                data: { edfiOdsPostgresql: { parentTableColumnNames: [], foreignTableColumnNames: [] } },
              },
            ],
          },
        },
      },
    });
    namespace.entity.domainEntitySubclass.set(domainEntitySubclass.metaEdName, domainEntitySubclass);

    enhance(metaEd);
  });

  it('should not create delete tracking table', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTables = deleteTrackingTableEntities(plugin, namespace);
    expect(deleteTrackingTables).toHaveLength(0);
  });

  it('should not create delete tracking trigger', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTriggers = deleteTrackingTriggerEntities(plugin, namespace);
    expect(deleteTrackingTriggers).toHaveLength(0);
  });
});

describe('when enhancing core domainEntitySubclass targeting 3.1 ODS/API', (): void => {
  const namespaceName = 'EdFi';
  const metaEdName = 'MetaEdName';
  const tableName = 'TableName';
  const pkColumnName = 'PkColumnName';

  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('3.1.0');
  const namespace: Namespace = newCoreNamespace();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  beforeAll(() => {
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsEntityTable: {
            ...newTable(),
            name: tableName,
            nameComponents: [tableName],
            data: { edfiOdsPostgresql: { tableName } },
            schema: namespaceName,
            columns: [
              { ...newColumn(), data: { edfiOdsPostgresql: { columnName: pkColumnName } }, isPartOfPrimaryKey: true },
            ],
            foreignKeys: [
              {
                ...newForeignKey(),
                sourceReference: { ...newForeignKeySourceReference(), isSubclassRelationship: true },
                data: { edfiOdsPostgresql: { parentTableColumnNames: [], foreignTableColumnNames: [] } },
              },
            ],
          },
        },
      },
    });
    namespace.entity.domainEntitySubclass.set(domainEntitySubclass.metaEdName, domainEntitySubclass);

    enhance(metaEd);
  });

  it('should not create delete tracking table', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTables = deleteTrackingTableEntities(plugin, namespace);
    expect(deleteTrackingTables).toHaveLength(0);
  });

  it('should not create delete tracking trigger', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTriggers = deleteTrackingTriggerEntities(plugin, namespace);
    expect(deleteTrackingTriggers).toHaveLength(0);
  });
});

describe('when enhancing extension domainEntitySubclass targeting 3.1 ODS/API', (): void => {
  const namespaceName = 'Extension';
  const metaEdName = 'MetaEdName';
  const tableName = 'TableName';
  const pkColumnName = 'PkColumnName';

  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('3.1.0');
  const namespace: Namespace = newExtensionNamespace(namespaceName);
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  beforeAll(() => {
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsEntityTable: {
            ...newTable(),
            name: tableName,
            nameComponents: [tableName],
            data: { edfiOdsPostgresql: { tableName } },
            schema: namespaceName,
            columns: [
              { ...newColumn(), data: { edfiOdsPostgresql: { columnName: pkColumnName } }, isPartOfPrimaryKey: true },
            ],
            foreignKeys: [
              {
                ...newForeignKey(),
                sourceReference: { ...newForeignKeySourceReference(), isSubclassRelationship: true },
                data: { edfiOdsPostgresql: { parentTableColumnNames: [], foreignTableColumnNames: [] } },
              },
            ],
          },
        },
      },
    });
    namespace.entity.domainEntitySubclass.set(domainEntitySubclass.metaEdName, domainEntitySubclass);

    enhance(metaEd);
  });

  it('should not create delete tracking table', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTables = deleteTrackingTableEntities(plugin, namespace);
    expect(deleteTrackingTables).toHaveLength(0);
  });

  it('should not create delete tracking trigger', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTriggers = deleteTrackingTriggerEntities(plugin, namespace);
    expect(deleteTrackingTriggers).toHaveLength(0);
  });
});

describe('when enhancing core domainEntitySubclass targeting 3.3 ODS/API', (): void => {
  const namespaceName = 'EdFi';
  const metaEdName = 'MetaEdName';
  const tableName = 'TableName';
  const pkColumnName = 'PkColumnName';

  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('3.3.0');
  const namespace: Namespace = newCoreNamespace();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  beforeAll(() => {
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsEntityTable: {
            ...newTable(),
            name: tableName,
            nameComponents: [tableName],
            data: { edfiOdsPostgresql: { tableName } },
            schema: namespaceName,
            columns: [
              { ...newColumn(), data: { edfiOdsPostgresql: { columnName: pkColumnName } }, isPartOfPrimaryKey: true },
            ],
            foreignKeys: [
              {
                ...newForeignKey(),
                sourceReference: { ...newForeignKeySourceReference(), isSubclassRelationship: true },
                data: { edfiOdsPostgresql: { parentTableColumnNames: [], foreignTableColumnNames: [] } },
              },
            ],
          },
        },
      },
    });
    namespace.entity.domainEntitySubclass.set(domainEntitySubclass.metaEdName, domainEntitySubclass);

    enhance(metaEd);
  });

  it('should not create delete tracking table', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTables = deleteTrackingTableEntities(plugin, namespace);
    expect(deleteTrackingTables).toHaveLength(0);
  });

  it('should not create delete tracking trigger', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTriggers = deleteTrackingTriggerEntities(plugin, namespace);
    expect(deleteTrackingTriggers).toHaveLength(0);
  });
});

describe('when enhancing extension domainEntitySubclass targeting 3.3 ODS/API', (): void => {
  const namespaceName = 'Extension';
  const metaEdName = 'MetaEdName';
  const tableName = 'TableName';
  const pkColumnName = 'PkColumnName';

  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('3.3.0');
  const namespace: Namespace = newExtensionNamespace(namespaceName);
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  beforeAll(() => {
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsEntityTable: {
            ...newTable(),
            name: tableName,
            nameComponents: [tableName],
            data: { edfiOdsPostgresql: { tableName } },
            schema: namespaceName,
            columns: [
              { ...newColumn(), data: { edfiOdsPostgresql: { columnName: pkColumnName } }, isPartOfPrimaryKey: true },
            ],
            foreignKeys: [
              {
                ...newForeignKey(),
                sourceReference: { ...newForeignKeySourceReference(), isSubclassRelationship: true },
                data: { edfiOdsPostgresql: { parentTableColumnNames: [], foreignTableColumnNames: [] } },
              },
            ],
          },
        },
      },
    });
    namespace.entity.domainEntitySubclass.set(domainEntitySubclass.metaEdName, domainEntitySubclass);

    enhance(metaEd);
  });

  it('should not create delete tracking table', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTables = deleteTrackingTableEntities(plugin, namespace);
    expect(deleteTrackingTables).toHaveLength(0);
  });

  it('should not create delete tracking trigger', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTriggers = deleteTrackingTriggerEntities(plugin, namespace);
    expect(deleteTrackingTriggers).toHaveLength(0);
  });
});

describe('when enhancing core domainEntitySubclass targeting 3.4 ODS/API', (): void => {
  const namespaceName = 'EdFi';
  const metaEdName = 'MetaEdName';
  const tableName = 'TableName';
  const primaryKeyName = 'PrimaryKeyName';
  const pkColumnName = 'PkColumnName';

  const tableNameGroup: TableNameGroup = {
    ...newTableNameGroup(),
    nameElements: [{ ...newTableNameComponent(), name: tableName }],
  };

  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('3.4.0');
  const namespace: Namespace = newCoreNamespace();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  beforeAll(() => {
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsEntityTable: {
            ...newTable(),
            name: tableName,
            nameGroup: tableNameGroup,
            nameComponents: [tableName],
            data: { edfiOdsPostgresql: { tableName, primaryKeyName } },
            schema: namespaceName,
            columns: [
              { ...newColumn(), data: { edfiOdsPostgresql: { columnName: pkColumnName } }, isPartOfPrimaryKey: true },
            ],
            foreignKeys: [
              {
                ...newForeignKey(),
                sourceReference: { ...newForeignKeySourceReference(), isSubclassRelationship: true },
                data: { edfiOdsPostgresql: { parentTableColumnNames: [], foreignTableColumnNames: [] } },
              },
            ],
          },
        },
      },
    });
    namespace.entity.domainEntitySubclass.set(domainEntitySubclass.metaEdName, domainEntitySubclass);

    enhance(metaEd);
  });

  it('should create delete tracking table', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTables = deleteTrackingTableEntities(plugin, namespace);
    expect(deleteTrackingTables).toHaveLength(1);
    expect(deleteTrackingTables[0].schema).toBe(`Tracked_Deletes_${namespaceName}`);
    expect(deleteTrackingTables[0].tableName).toBe(tableName);
    expect(deleteTrackingTables[0].columns).toHaveLength(3);
    expect(deleteTrackingTables[0].columns[0].data.edfiOdsPostgresql.columnName).toBe(pkColumnName);
    expect(deleteTrackingTables[0].columns[1].data.edfiOdsPostgresql.columnName).toBe('Id');
    expect(deleteTrackingTables[0].columns[2].data.edfiOdsPostgresql.columnName).toBe('ChangeVersion');
    expect(deleteTrackingTables[0].primaryKeyName).toBe(primaryKeyName);
    expect(deleteTrackingTables[0].primaryKeyColumns).toHaveLength(1);
    expect(deleteTrackingTables[0].primaryKeyColumns[0].data.edfiOdsPostgresql.columnName).toBe('ChangeVersion');
  });

  it('should create delete tracking trigger', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTriggers = deleteTrackingTriggerEntities(plugin, namespace);
    expect(deleteTrackingTriggers).toHaveLength(1);
    expect(deleteTrackingTriggers[0].triggerSchema).toBe(`Tracked_Deletes_${namespaceName}`);
    expect(deleteTrackingTriggers[0].triggerName).toBe(`${tableName}_TR_DelTrkg`);
    expect(deleteTrackingTriggers[0].targetTableSchema).toBe(namespaceName);
    expect(deleteTrackingTriggers[0].targetTableName).toBe(tableName);
    expect(deleteTrackingTriggers[0].deleteTrackingTableSchema).toBe(`Tracked_Deletes_${namespaceName}`);
    expect(deleteTrackingTriggers[0].deleteTrackingTableName).toBe(tableName);
    expect(deleteTrackingTriggers[0].primaryKeyColumnNames).toHaveLength(1);
    expect(deleteTrackingTriggers[0].primaryKeyColumnNames[0]).toBe(pkColumnName);
    expect(deleteTrackingTriggers[0].targetTableIsSubclass).toBe(true);
    expect(deleteTrackingTriggers[0].foreignKeyToSuperclass).not.toBeNull();
  });
});

describe('when enhancing extension domainEntitySubclass targeting 3.4 ODS/API', (): void => {
  const namespaceName = 'Extension';
  const metaEdName = 'MetaEdName';
  const tableName = 'TableName';
  const primaryKeyName = 'PrimaryKeyName';
  const pkColumnName = 'PkColumnName';

  const tableNameGroup: TableNameGroup = {
    ...newTableNameGroup(),
    nameElements: [{ ...newTableNameComponent(), name: tableName }],
  };

  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('3.4.0');
  const namespace: Namespace = newExtensionNamespace(namespaceName);
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  beforeAll(() => {
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsEntityTable: {
            ...newTable(),
            name: tableName,
            nameGroup: tableNameGroup,
            nameComponents: [tableName],
            data: { edfiOdsPostgresql: { tableName, primaryKeyName } },
            schema: namespaceName,
            columns: [
              { ...newColumn(), data: { edfiOdsPostgresql: { columnName: pkColumnName } }, isPartOfPrimaryKey: true },
            ],
            foreignKeys: [
              {
                ...newForeignKey(),
                sourceReference: { ...newForeignKeySourceReference(), isSubclassRelationship: true },
                data: { edfiOdsPostgresql: { parentTableColumnNames: [], foreignTableColumnNames: [] } },
              },
            ],
          },
        },
      },
    });
    namespace.entity.domainEntitySubclass.set(domainEntitySubclass.metaEdName, domainEntitySubclass);

    enhance(metaEd);
  });

  it('should create delete tracking table', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTables = deleteTrackingTableEntities(plugin, namespace);
    expect(deleteTrackingTables).toHaveLength(1);
    expect(deleteTrackingTables[0].schema).toBe(`Tracked_Deletes_${namespaceName}`);
    expect(deleteTrackingTables[0].tableName).toBe(tableName);
    expect(deleteTrackingTables[0].columns).toHaveLength(3);
    expect(deleteTrackingTables[0].columns[0].data.edfiOdsPostgresql.columnName).toBe(pkColumnName);
    expect(deleteTrackingTables[0].columns[1].data.edfiOdsPostgresql.columnName).toBe('Id');
    expect(deleteTrackingTables[0].columns[2].data.edfiOdsPostgresql.columnName).toBe('ChangeVersion');
    expect(deleteTrackingTables[0].primaryKeyName).toBe(primaryKeyName);
    expect(deleteTrackingTables[0].primaryKeyColumns).toHaveLength(1);
    expect(deleteTrackingTables[0].primaryKeyColumns[0].data.edfiOdsPostgresql.columnName).toBe('ChangeVersion');
  });

  it('should create delete tracking trigger', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTriggers = deleteTrackingTriggerEntities(plugin, namespace);
    expect(deleteTrackingTriggers).toHaveLength(1);
    expect(deleteTrackingTriggers[0].triggerSchema).toBe(`Tracked_Deletes_${namespaceName}`);
    expect(deleteTrackingTriggers[0].triggerName).toBe(`${tableName}_TR_DelTrkg`);
    expect(deleteTrackingTriggers[0].targetTableSchema).toBe(namespaceName);
    expect(deleteTrackingTriggers[0].targetTableName).toBe(tableName);
    expect(deleteTrackingTriggers[0].deleteTrackingTableSchema).toBe(`Tracked_Deletes_${namespaceName}`);
    expect(deleteTrackingTriggers[0].deleteTrackingTableName).toBe(tableName);
    expect(deleteTrackingTriggers[0].primaryKeyColumnNames).toHaveLength(1);
    expect(deleteTrackingTriggers[0].primaryKeyColumnNames[0]).toBe(pkColumnName);
    expect(deleteTrackingTriggers[0].targetTableIsSubclass).toBe(true);
    expect(deleteTrackingTriggers[0].foreignKeyToSuperclass).not.toBeNull();
  });
});

import { MetaEdEnvironment, Namespace, PluginEnvironment } from '@edfi/metaed-core';
import {
  baseDescriptorTableCreatingEnhancer,
  addEdFiOdsRelationalEntityRepositoryTo,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  postgreSqlTableSetupEnhancer,
  postgreSqlTableNamingEnhancer,
  postgreSqlColumnNamingEnhancer,
} from '@edfi/metaed-plugin-edfi-ods-postgresql';
import {
  addEdFiOdsChangeQueryEntityRepositoryTo,
  deleteTrackingTableEntities,
  deleteTrackingTriggerEntities,
  pluginEnvironment,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { enhance } from '../../src/enhancer/BaseDescriptorChangeQueryEnhancer';
import { metaEdEnvironmentForApiVersion, newCoreNamespace } from './TestHelper';
import { PLUGIN_NAME } from '../../src/PluginHelper';

describe('when enhancing base descriptor targeting 2.3 ODS/API', (): void => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('2.3.0');
  const namespace: Namespace = newCoreNamespace();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);
  addEdFiOdsRelationalEntityRepositoryTo(metaEd);

  beforeAll(() => {
    baseDescriptorTableCreatingEnhancer(metaEd);
    postgreSqlTableSetupEnhancer(metaEd);
    postgreSqlTableNamingEnhancer(metaEd);
    postgreSqlColumnNamingEnhancer(metaEd);
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

describe('when enhancing base descriptor targeting 2.5 ODS/API', (): void => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('2.5.0');
  const namespace: Namespace = newCoreNamespace();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);
  addEdFiOdsRelationalEntityRepositoryTo(metaEd);

  beforeAll(() => {
    baseDescriptorTableCreatingEnhancer(metaEd);
    postgreSqlTableSetupEnhancer(metaEd);
    postgreSqlTableNamingEnhancer(metaEd);
    postgreSqlColumnNamingEnhancer(metaEd);
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

describe('when enhancing base descriptor targeting 3.1 ODS/API', (): void => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('3.1.0');
  const namespace: Namespace = newCoreNamespace();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);
  addEdFiOdsRelationalEntityRepositoryTo(metaEd);

  beforeAll(() => {
    baseDescriptorTableCreatingEnhancer(metaEd);
    postgreSqlTableSetupEnhancer(metaEd);
    postgreSqlTableNamingEnhancer(metaEd);
    postgreSqlColumnNamingEnhancer(metaEd);
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

describe('when enhancing base descriptor targeting 3.3 ODS/API', (): void => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('3.3.0');
  const namespace: Namespace = newCoreNamespace();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);
  addEdFiOdsRelationalEntityRepositoryTo(metaEd);

  beforeAll(() => {
    baseDescriptorTableCreatingEnhancer(metaEd);
    postgreSqlTableSetupEnhancer(metaEd);
    postgreSqlTableNamingEnhancer(metaEd);
    postgreSqlColumnNamingEnhancer(metaEd);
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

describe('when enhancing base descriptor targeting 3.4 ODS/API', (): void => {
  const schema = 'edfi';
  const tableName = 'Descriptor';
  const pkColumnName = 'DescriptorId';
  const primaryKeyName = 'Descriptor_PK';

  const metaEd: MetaEdEnvironment = metaEdEnvironmentForApiVersion('3.4.0');
  const namespace: Namespace = newCoreNamespace();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);
  addEdFiOdsRelationalEntityRepositoryTo(metaEd);

  beforeAll(() => {
    baseDescriptorTableCreatingEnhancer(metaEd);
    postgreSqlTableSetupEnhancer(metaEd);
    postgreSqlTableNamingEnhancer(metaEd);
    postgreSqlColumnNamingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create delete tracking table', (): void => {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, PLUGIN_NAME);
    const deleteTrackingTables = deleteTrackingTableEntities(plugin, namespace);
    expect(deleteTrackingTables).toHaveLength(1);
    expect(deleteTrackingTables[0].schema).toBe(`tracked_deletes_${schema}`);
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
    expect(deleteTrackingTriggers[0].triggerSchema).toBe(`tracked_deletes_${schema}`);
    expect(deleteTrackingTriggers[0].triggerName).toBe(`${tableName}_TR_DelTrkg`);
    expect(deleteTrackingTriggers[0].targetTableSchema).toBe(schema);
    expect(deleteTrackingTriggers[0].targetTableName).toBe(tableName);
    expect(deleteTrackingTriggers[0].deleteTrackingTableSchema).toBe(`tracked_deletes_${schema}`);
    expect(deleteTrackingTriggers[0].deleteTrackingTableName).toBe(tableName);
    expect(deleteTrackingTriggers[0].primaryKeyColumnNames).toHaveLength(1);
    expect(deleteTrackingTriggers[0].primaryKeyColumnNames[0]).toBe(pkColumnName);
    expect(deleteTrackingTriggers[0].targetTableIsSubclass).toBe(false);
    expect(deleteTrackingTriggers[0].foreignKeyToSuperclass).toBeNull();
  });
});

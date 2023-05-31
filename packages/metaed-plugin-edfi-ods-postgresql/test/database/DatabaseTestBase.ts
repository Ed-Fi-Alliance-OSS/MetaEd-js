import { Client } from 'pg';
import pgStructure, { Db } from 'pg-structure';

import { Logger, MetaEdEnvironment, PluginEnvironment, newPluginEnvironment } from '@edfi/metaed-core';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as initializeOdsRelationalPlugin } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as initializeOdsPostgresqlPlugin } from '../../index';
import { generate as odsGenerate } from '../../src/generator/OdsGenerator';
import { generate as schemaGenerate } from '../../src/generator/SchemaGenerator';

export const testDatabaseName = 'metaed_integration_tests';

let client: Client | null = null;

export const testDbDefinition = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || testDatabaseName,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'docker!',
};

async function executeGeneratedSql(generatedSql: string): Promise<Db | null> {
  Logger.verbose(`[${testDatabaseName}] executeGeneratedSql`);
  try {
    client = new Client(testDbDefinition);
    await client.connect();
    await client.query(
      `DROP SCHEMA IF EXISTS auth CASCADE;
      DROP SCHEMA IF EXISTS edfi CASCADE;
      DROP SCHEMA IF EXISTS util CASCADE;
      `,
    );

    await client.query('BEGIN');
    await client.query(generatedSql);
    return await pgStructure(client);
  } catch (error) {
    Logger.verbose(`[${testDatabaseName}] executeGeneratedSql: ${error.message} ${error.stack}`);
    return null;
  }
}

export async function testSuiteAfterAll() {
  try {
    if (client != null) await client.end();
  } catch (error) {
    Logger.verbose(`[${testDatabaseName}] testSuiteAfterAll: ${error.message} ${error.stack}`);
  }
}

export async function testAfterEach() {
  try {
    if (client != null) await client.query('ROLLBACK');
  } catch (error) {
    Logger.verbose(`[${testDatabaseName}] testSuiteAfterAll: ${error.message} ${error.stack}`);
  }
}

// hopefully temporary solution to run individual tests
export async function rollbackAndEnd() {
  await testAfterEach();
  await testSuiteAfterAll();
}

export async function enhanceGenerateAndExecuteSql(metaEd: MetaEdEnvironment): Promise<Db | null> {
  metaEd.dataStandardVersion = metaEd.dataStandardVersion === '0.0.0' ? '3.0.0' : metaEd.dataStandardVersion;
  const metaEdPlugin: PluginEnvironment | undefined = metaEd?.plugin?.get('edfiOdsRelational') as PluginEnvironment;
  metaEd.plugin.set('edfiOdsRelational', {
    ...newPluginEnvironment(),
    targetTechnologyVersion: metaEdPlugin?.targetTechnologyVersion ?? '3.0.0',
  });
  initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
  initializeOdsRelationalPlugin().enhancer.forEach((enhance) => enhance(metaEd));
  initializeOdsPostgresqlPlugin().enhancer.forEach((enhance) => enhance(metaEd));

  const sql: string[] = [];
  (await schemaGenerate(metaEd)).generatedOutput.forEach((result) => sql.push(result.resultString));
  (await odsGenerate(metaEd)).generatedOutput.forEach((result) => sql.push(result.resultString));
  return executeGeneratedSql(sql.join(''));
}

// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { highlight } from 'cli-highlight';
import sql from 'mssql';
import { Logger } from '@edfi/metaed-core';

export const testDatabaseName = 'MetaEd_Ods_Integration_Tests';

const highlightSql = (statement: string) => highlight(statement, { language: 'sql', ignoreIllegals: true });

export interface Pool {
  transaction?: sql.Transaction;
  connection?: sql.ConnectionPool;
}

export const pools: Map<string, Pool> = new Map();
export const retryCount = 5;

export const newConfig: sql.config = {
  database: process.env.METAED_DATABASE || 'MetaEd_Ods_Integration_Tests',
  server: process.env.MSSQL_SERVER || 'localhost',
  port: process.env.MSSQL_PORT || 1433,
  connectionTimeout: 15000,
  requestTimeout: 15000,
  driver: 'tedious',
  // Note: TEDIOUS does not support integrated security, therefore *MUST* use username & password.
  user: process.env.MSSQL_USERNAME || 'metaed',
  password: process.env.MSSQL_PASSWORD || 'metaed-test',
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === 'true' || false,
    trustServerCertificate: process.env.MSSQL_TRUST_CERTIFICATE === 'true' || false,
    abortTransactionOnError: true,
  },
};

export async function disconnect(databaseName: string): Promise<void> {
  if (pools.has(databaseName)) {
    const pool: Pool | undefined = pools.get(databaseName);
    try {
      if (pool != null) {
        if (pool.transaction != null) {
          await pool.transaction.rollback();
          Logger.verbose(`[${databaseName}] DatabaseConnection.disconnect: rolling back transaction`);
        }
        if (pool.connection != null) {
          await pool.connection.close();
          Logger.verbose(`[${databaseName}] DatabaseConnection.disconnect: pool disconnected.`);
        }
        pools.delete(databaseName);
      }
    } catch (error) {
      Logger.verbose(`[${databaseName}] DatabaseConnection.disconnect: ${error.message} ${error.stack}`);
    }
  }
}

export async function disconnectAll() {
  // eslint-disable-next-line no-restricted-syntax
  for (const databaseName of pools.keys()) {
    await disconnect(databaseName);
  }
  pools.clear();
}

export async function connect(databaseName: string, retry: number = retryCount): Promise<sql.ConnectionPool> {
  if (pools.has(databaseName)) {
    return pools.get(databaseName);
  }

  let pool: Pool = {};
  try {
    pool.connection = await new sql.ConnectionPool({ ...newConfig, database: databaseName });
    Logger.verbose(`[${databaseName}] created connection pool`);
    if (!pool.connection.connected && !pool.connection.connecting) {
      await pool.connection.connect();
    }

    pool.transaction = await new sql.Transaction(pool.connection);
    await pool.transaction.begin();
    Logger.verbose(`[${databaseName}] ---------- begin transaction ----------`);
  } catch (error) {
    // NOTE: This is a work around for the following error. This seems to occur most often when a fresh database has been
    // created and a connection attempt is made while it is in transition.
    // Error: [Microsoft][SQL Server Native Client 11.0]TCP Provider: An existing connection was forcibly closed by the remote host.
    if (retry > 0 && /TCP Provider: An existing connection was forcibly closed by the remote host./.test(error.message)) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      pool = await connect(databaseName, retry - 1);
    } else {
      throw error;
    }
  }

  pools.set(databaseName, pool);
  return pool;
}

export async function database(databaseName: string, fn: Function, transaction: boolean = true): Promise<void> {
  try {
    const pool: Pool = await connect(databaseName);
    if (pool.connection != null && pool.transaction != null) {
      await fn(transaction ? pool.transaction : pool.connection);
    } else {
      throw new Error('DatabaseConnection: Pool had no connection or transaction');
    }
  } catch (error) {
    Logger.error(`[${databaseName}] ${error.message} ${error.stack}`);
  }
}

export async function beginTransaction(databaseName: string): Promise<void> {
  if (pools.has(databaseName)) {
    const pool = pools.get(databaseName);
    if (pool != null && pool.transaction != null) {
      Logger.verbose(`[${databaseName}] DatabaseConnection.beginTransaction: beginning transaction`);
      await pool.transaction.begin();
    }
  }
}

export async function rollbackTransaction(databaseName: string): Promise<void> {
  if (pools.has(databaseName)) {
    const pool = pools.get(databaseName);
    if (pool != null && pool.transaction != null) {
      Logger.verbose(`[${databaseName}] DatabaseConnection.rollbackTransaction: rolling back transaction`);
      await pool.transaction.rollback();
    }
  }
}

export async function query(connection: sql.Connection | sql.Transaction, action: string, statement: string): Promise<any> {
  const databaseName: string = connection.config ? connection.config.database : connection.parent.config.database;
  Logger.verbose(`[${databaseName}] ${action}`);
  Logger.verbose(`\n${highlightSql(statement)}`);
  const result = await new sql.Request(connection).query(statement);
  Logger.verbose(`=> ${result.recordset}`);
  return result.recordset;
}

export async function scalar(connection: sql.Connection | sql.Transaction, action: string, statement: string): Promise<any> {
  const result = await query(connection, action, statement);
  return result.length > 0 ? result[0] : null;
}

export function firstKeyValueOf(object: any): any {
  return object[Object.keys(object)[0]];
}

export async function queryWithBoolResult(
  connection: sql.Connection | sql.Transaction,
  action: string,
  statement: string,
): Promise<boolean> {
  const result = await scalar(connection, action, statement);
  return firstKeyValueOf(result) === 1;
}

export async function executeGeneratedSql(generatedSql: string, databaseName: string) {
  const sqlStatements: string[] = generatedSql.split('\nGO\n');
  await database(
    databaseName,
    async (db) => {
      Logger.verbose(`[${databaseName}] executeGeneratedSql`);
      // eslint-disable-next-line no-restricted-syntax
      for (const statement of sqlStatements) {
        Logger.debug('\n', highlightSql(statement));
        if (statement != null || statement !== '') await new sql.Request(db).query(statement);
      }
    },
    true,
  );
}

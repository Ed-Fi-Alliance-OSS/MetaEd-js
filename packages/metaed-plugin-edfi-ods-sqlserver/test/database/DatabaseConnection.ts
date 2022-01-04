import winston from 'winston';
import { Connection, ConnectionPool, Request, Transaction } from 'mssql/msnodesqlv8';
import { highlight } from 'cli-highlight';

export const testDatabaseName = 'MetaEd_Ods_Integration_Tests';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });
winston.level = 'info';
// if (process.env.TEAMCITY_VERSION != null) {
//   winston.level = 'debug';
// } else {
//   winston.level = 'info';
// }
const highlightSql = (sql: string) => highlight(sql, { language: 'sql', ignoreIllegals: true });

export interface Pool {
  transaction?: Transaction;
  connection?: ConnectionPool;
}
export const pools: Map<string, Pool> = new Map();
export const retryCount = 5;

export const newConfig = () => ({
  database: '',
  appName: 'MetaEd',
  server: 'localhost',
  connectionTimeout: 15000,
  requestTimeout: 15000,
  options: {
    trustedConnection: true,
    abortTransactionOnError: true,
  },
});

export async function disconnect(databaseName: string): Promise<void> {
  if (pools.has(databaseName)) {
    const pool: Pool | undefined = pools.get(databaseName);
    try {
      if (pool != null) {
        if (pool.transaction != null) {
          await pool.transaction.rollback();
          winston.verbose(`[${databaseName}] DatabaseConnection.disconnect: rolling back transaction`);
        }
        if (pool.connection != null) {
          await pool.connection.close();
          winston.verbose(`[${databaseName}] DatabaseConnection.disconnect: pool disconnected.`);
        }
        pools.delete(databaseName);
      }
    } catch (error) {
      winston.verbose(`[${databaseName}] DatabaseConnection.disconnect: ${error.message} ${error.stack}`);
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

export async function connect(databaseName: string, retry: number = retryCount): Promise<ConnectionPool> {
  if (pools.has(databaseName)) {
    return pools.get(databaseName);
  }

  let pool: Pool = {};
  try {
    pool.connection = await new ConnectionPool({ ...newConfig(), database: databaseName });
    winston.verbose(`[${databaseName}] created connection pool`);
    if (!pool.connection.connected && !pool.connection.connecting) {
      await pool.connection.connect();
    }

    pool.transaction = await new Transaction(pool.connection);
    await pool.transaction.begin();
    winston.verbose(`[${databaseName}] ---------- begin transaction ----------`);
  } catch (error) {
    pool.connection.close();

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
    winston.error(`[${databaseName}] ${error.message} ${error.stack}`);
  }
}

export async function beginTransaction(databaseName: string): Promise<void> {
  if (pools.has(databaseName)) {
    const pool = pools.get(databaseName);
    if (pool != null && pool.transaction != null) {
      winston.verbose(`[${databaseName}] DatabaseConnection.beginTransaction: beginning transaction`);
      await pool.transaction.begin();
    }
  }
}

export async function rollbackTransaction(databaseName: string): Promise<void> {
  if (pools.has(databaseName)) {
    const pool = pools.get(databaseName);
    if (pool != null && pool.transaction != null) {
      winston.verbose(`[${databaseName}] DatabaseConnection.rollbackTransaction: rolling back transaction`);
      await pool.transaction.rollback();
    }
  }
}

export async function query(connection: Connection | Transaction, action: string, sql: string): Promise<any> {
  const databaseName: string = connection.config ? connection.config.database : connection.parent.config.database;
  winston.verbose(`[${databaseName}] ${action}`);
  winston.verbose('\n', highlightSql(sql));
  const result = await new Request(connection).query(sql);
  winston.verbose(`=> `, result.recordset);
  return result.recordset;
}

export async function scalar(connection: Connection | Transaction, action: string, sql: string): Promise<any> {
  const result = await query(connection, action, sql);
  return result.length > 0 ? result[0] : null;
}

export function firstKeyValueOf(object: any): any {
  return object[Object.keys(object)[0]];
}

export async function queryWithBoolResult(
  connection: Connection | Transaction,
  action: string,
  sql: string,
): Promise<boolean> {
  const result = await scalar(connection, action, sql);
  return firstKeyValueOf(result) === 1;
}

export async function executeGeneratedSql(generatedSql: string, databaseName: string) {
  const sqlStatements: string[] = generatedSql.split('\nGO\n');
  await database(
    databaseName,
    async (db) => {
      winston.verbose(`[${databaseName}] executeGeneratedSql`);
      // eslint-disable-next-line no-restricted-syntax
      for (const sql of sqlStatements) {
        winston.debug('\n', highlightSql(sql));
        if (sql != null || sql !== '') await new Request(db).query(sql);
      }
    },
    true,
  );
}

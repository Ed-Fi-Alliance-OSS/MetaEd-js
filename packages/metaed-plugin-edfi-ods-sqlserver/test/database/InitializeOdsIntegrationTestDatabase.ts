import winston from 'winston';
import { database, query, disconnect, testDatabaseName } from './DatabaseConnection';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });

async function dropDatabaseIfExists(databaseName: string): Promise<void> {
  const sql = `
IF EXISTS (
  SELECT *
  FROM sys.databases
  WHERE name = '${databaseName}'
)
BEGIN
  ALTER DATABASE [${databaseName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
  DROP DATABASE [${databaseName}]
END
`;

  await database(
    'master',
    async (db) => {
      await query(db, `InitializeTestDatabase.dropDatabaseIfExists ${databaseName}`, sql);
    },
    false,
  );
}

async function createDatabaseIfNotExists(databaseName: string): Promise<void> {
  const sql = `
IF NOT EXISTS (
  SELECT *
  FROM sys.databases
  WHERE name = '${databaseName}'
)
CREATE DATABASE [${databaseName}]
`;

  await database(
    'master',
    async (db) => {
      await query(db, `InitializeTestDatabase.createDatabase ${databaseName}`, sql);
    },
    false,
  );
}

(async () => {
  await dropDatabaseIfExists(testDatabaseName);
  await createDatabaseIfNotExists(testDatabaseName);
  await disconnect('master');
})().catch((e) => {
  winston.error(`InitializeTestDatabase: ${e.message} ${e.stack}`);
});

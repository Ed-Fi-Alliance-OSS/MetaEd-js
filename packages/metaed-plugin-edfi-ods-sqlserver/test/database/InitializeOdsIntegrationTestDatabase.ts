// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Logger } from '@edfi/metaed-core';
import { database, query, disconnect, testDatabaseName } from './DatabaseConnection';

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
  Logger.error(`InitializeTestDatabase: ${e.message} ${e.stack}`);
});

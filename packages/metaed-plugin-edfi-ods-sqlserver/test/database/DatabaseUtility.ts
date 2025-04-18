// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import path from 'path';
import { database, query } from './DatabaseConnection';

export async function restoreDatabaseFromBackup(
  databaseName: string,
  backupPath: string,
  backupName: string,
): Promise<void> {
  const resolvedPath = path.resolve(__dirname, backupPath);
  const sql = `
RESTORE DATABASE [${databaseName}]
FROM DISK = N'${resolvedPath}/${backupName}.bak'
WITH FILE = 1,
MOVE N'${databaseName}'
  TO N'${resolvedPath}/${databaseName}.mdf',
MOVE N'${databaseName}_log'
  TO N'${resolvedPath}/${databaseName}_log.ldf',
NOUNLOAD, REPLACE, STATS = 5
`;

  await database(
    'master',
    async (db) => {
      await query(db, `DatabaseTestUtility.restoreDatabaseFromBackup  ${databaseName}`, sql);
    },
    false,
  );
}

export async function setCompatibilityLevel(databaseName: string, level: number): Promise<void> {
  const sql = `
ALTER DATABASE [${databaseName}]
SET COMPATIBILITY_LEVEL = ${level}
`;

  await database(
    'master',
    async (db) => {
      await query(db, `DatabaseTestUtility.setCompatibilityLevel  ${databaseName}`, sql);
    },
    false,
  );
}

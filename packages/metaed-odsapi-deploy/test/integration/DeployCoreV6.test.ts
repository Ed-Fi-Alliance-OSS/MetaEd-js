// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdConfiguration } from '@edfi/metaed-core';
import { MetaEdConfiguration } from '@edfi/metaed-core';
import klawSync from 'klaw-sync';
import fs from 'fs-extra';
import path from 'path';
import { execute as deployCoreV6 } from '../../src/task/DeployCoreV6';
import { DeployResult } from '../../src/task/DeployResult';

describe('when deploying 6.1 core artifacts', (): void => {
  let result: string[];
  let deployResult: DeployResult = {
    success: false,
    failureMessage: 'Error',
  };

  beforeAll(async () => {
    const deployDirectory: string = path.resolve(__dirname, './output/v6Core');
    const additionalMssqlScriptsDirectory: string = path.resolve(__dirname, './artifact/AdditionalScripts/MsSql');
    const additionalPostgresScriptsDirectory: string = path.resolve(__dirname, './artifact/AdditionalScripts/Postgres');

    fs.removeSync(deployDirectory);

    const metaEdConfiguration: MetaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: path.resolve(__dirname, './artifact'),
      deployDirectory,
      defaultPluginTechVersion: '6.1.0',
    };

    deployResult = await deployCoreV6(
      metaEdConfiguration,
      '4.0.0',
      true,
      false,
      additionalMssqlScriptsDirectory,
      additionalPostgresScriptsDirectory,
    );

    const normalizePath = (x: string) => path.relative(deployDirectory, x).split(path.sep).join('/');

    result = klawSync(deployDirectory, { nodir: true })
      .map((x) => normalizePath(x.path))
      .sort();
  });

  it('should have successful deploy result', (): void => {
    expect(deployResult).toMatchObject({ success: true });
  });

  it('should have correct directory paths', (): void => {
    expect(result).toMatchInlineSnapshot(`
      Array [
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/Metadata/ApiModel.json",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/Metadata/InterchangeOrderMetadata.xml",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/MsSql/Data/Ods/0020-SchoolYears.sql",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/MsSql/Data/Ods/999-additional-mssql.sql",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/MsSql/Structure/Ods/0010-Schemas.sql",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/PgSql/Data/Ods/0020-Pg-SchoolYears.sql",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/PgSql/Data/Ods/999-additional-postgres.sql",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/PgSql/Structure/Ods/0010-Pg-Schemas.sql",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/Schemas/Ed-Fi-Core.xsd",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/Schemas/Interchange-AssessmentMetadata.xsd",
      ]
    `);
  });
});

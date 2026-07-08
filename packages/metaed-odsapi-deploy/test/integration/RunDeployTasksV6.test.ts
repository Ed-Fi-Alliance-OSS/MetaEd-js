// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdConfiguration, newMetaEdProject } from '@edfi/metaed-core';
import { MetaEdConfiguration } from '@edfi/metaed-core';
import klawSync from 'klaw-sync';
import fs from 'fs-extra';
import path from 'path';
import { runDeployTasks } from '../../src/RunDeployTasks';
import { DeployResult } from '../../src/task/DeployResult';

// Runs the full deploy task pipeline against an ODS/API 6.x target with a pre-existing extension
// Artifacts folder from a previous deploy, proving the delete-then-copy sequence: RemoveExtensionArtifacts
// removes the stale folder, then DeployExtensionV6 recreates and populates it.
//
// The shared ./artifact fixture is not used directly because pipeline tasks (ExtensionProjectsExists,
// RemoveExtensionArtifacts, RefreshProject) treat every artifact-root folder outside directoryExcludeList
// as an extension project, so its AdditionalScripts folder would be interpreted as a project. Instead a
// clean artifact directory with only EdFi and Sample is built from the shared fixture, and the additional
// scripts directories are passed from outside the artifact root.

describe('when running all deploy tasks for ODS/API 6.x with a pre-existing extension Artifacts folder', (): void => {
  const staleArtifactPath: string =
    'Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/MsSql/Data/Ods/0001-stale-from-previous-deploy.sql';
  let placeholderCsprojPath: string;
  let result: string[];
  let deployResult: DeployResult = {
    success: false,
    failureMessage: 'Error',
  };

  beforeAll(async () => {
    const testRoot: string = path.resolve(__dirname, './output/v6Pipeline');
    const artifactDirectory: string = path.resolve(testRoot, 'artifact');
    const deployDirectory: string = path.resolve(testRoot, 'deploy');
    const additionalMssqlScriptsDirectory: string = path.resolve(__dirname, './artifact/AdditionalScripts/MsSql');
    const additionalPostgresScriptsDirectory: string = path.resolve(__dirname, './artifact/AdditionalScripts/Postgres');

    fs.removeSync(testRoot);

    // clean artifact directory: only the EdFi core and Sample extension projects
    fs.copySync(path.resolve(__dirname, './artifact/EdFi'), path.resolve(artifactDirectory, 'EdFi'));
    fs.copySync(path.resolve(__dirname, './artifact/Sample'), path.resolve(artifactDirectory, 'Sample'));

    // deploy directory skeleton: the C# extension project ExtensionProjectsExists requires,
    // with leftover artifacts from a previous deploy that RemoveExtensionArtifacts must delete
    const extensionProjectDirectory: string = path.resolve(
      deployDirectory,
      'Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample',
    );
    fs.ensureDirSync(path.resolve(deployDirectory, 'Ed-Fi-ODS'));
    placeholderCsprojPath = path.resolve(extensionProjectDirectory, 'EdFi.Ods.Extensions.Sample.csproj');
    fs.outputFileSync(placeholderCsprojPath, '<Project />');
    fs.outputFileSync(path.resolve(deployDirectory, staleArtifactPath), '-- from a previous deploy');

    const metaEdConfiguration: MetaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory,
      deployDirectory,
      defaultPluginTechVersion: '6.1.0',
      projects: [
        { ...newMetaEdProject(), projectName: 'Ed-Fi', namespaceName: 'EdFi', projectVersion: '4.0.0' },
        { ...newMetaEdProject(), projectName: 'Sample', namespaceName: 'Sample', projectVersion: '1.0.0' },
      ],
    };

    deployResult = await runDeployTasks(
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

  // the placeholder csproj is not a valid SDK-style project, and IDE C# tooling attempts to load
  // any csproj left in the workspace — remove it once the directory listing has been captured
  afterAll(() => {
    fs.removeSync(placeholderCsprojPath);
  });

  it('should have successful deploy result', (): void => {
    expect(deployResult).toMatchObject({ success: true });
  });

  it('should have removed the artifacts left over from the previous deploy', (): void => {
    expect(result).not.toContain(staleArtifactPath);
  });

  it('should have correct directory paths', (): void => {
    expect(result).toMatchInlineSnapshot(`
      Array [
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/Metadata/ApiModel-EXTENSION.json",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/Metadata/InterchangeOrderMetadata-EXTENSION.xml",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/MsSql/Data/Ods/0010-SampleExtensionsData.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/MsSql/Data/Ods/999-additional-mssql.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/MsSql/Structure/Ods/0010-EXTENSION-Sample-Schemas.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/PgSql/Data/Ods/0010-SampleExtensionsData.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/PgSql/Data/Ods/999-additional-postgres.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/PgSql/Structure/Ods/0010-EXTENSION-Sample-Schemas.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/Schemas/EXTENSION-Ed-Fi-Extended-Core.xsd",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/Schemas/EXTENSION-Interchange-Descriptors-Extension.xsd",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/EdFi.Ods.Extensions.Sample.csproj",
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

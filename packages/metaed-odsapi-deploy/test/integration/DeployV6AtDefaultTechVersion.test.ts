// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdConfiguration, newMetaEdProject } from '@edfi/metaed-core';
import { MetaEdConfiguration } from '@edfi/metaed-core';
import klawSync from 'klaw-sync';
import fs from 'fs-extra';
import path from 'path';
import { execute as deployCoreV6 } from '../../src/task/DeployCoreV6';
import { execute as deployExtensionV6 } from '../../src/task/DeployExtensionV6';
import { DeployResult } from '../../src/task/DeployResult';

// The V6 deploy tasks are gated on '>=5.4.0 <7.0.0'. A configuration that never sets a tech version
// gets the metaed-core default, which must deploy rather than silently no-op. These tests fail if the
// gate is ever narrowed (e.g. to '>=6.1.0') or the metaed-core default moves outside the gate.

describe('when the metaed-core default plugin tech version is used', (): void => {
  it('should be 6.0.0, inside the V6 deploy gate', (): void => {
    expect(newMetaEdConfiguration().defaultPluginTechVersion).toBe('6.0.0');
  });
});

describe('when deploying core artifacts at the default plugin tech version', (): void => {
  let result: string[];
  let deployResult: DeployResult = {
    success: false,
    failureMessage: 'Error',
  };

  beforeAll(async () => {
    const deployDirectory: string = path.resolve(__dirname, './output/v6CoreDefault');

    fs.removeSync(deployDirectory);

    const metaEdConfiguration: MetaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: path.resolve(__dirname, './artifact'),
      deployDirectory,
    };

    deployResult = await deployCoreV6(metaEdConfiguration, '4.0.0', true, false);

    const normalizePath = (x: string) => path.relative(deployDirectory, x).split(path.sep).join('/');

    result = klawSync(deployDirectory, { nodir: true })
      .map((x) => normalizePath(x.path))
      .sort();
  });

  it('should have successful deploy result', (): void => {
    expect(deployResult).toMatchObject({ success: true });
  });

  it('should deploy core artifacts rather than no-op', (): void => {
    expect(result).toMatchInlineSnapshot(`
      Array [
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/Metadata/ApiModel.json",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/Metadata/InterchangeOrderMetadata.xml",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/MsSql/Data/Ods/0020-SchoolYears.sql",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/MsSql/Structure/Ods/0010-Schemas.sql",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/PgSql/Data/Ods/0020-Pg-SchoolYears.sql",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/PgSql/Structure/Ods/0010-Pg-Schemas.sql",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/Schemas/Ed-Fi-Core.xsd",
        "Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/Schemas/Interchange-AssessmentMetadata.xsd",
      ]
    `);
  });
});

describe('when deploying extension artifacts at the default plugin tech version', (): void => {
  let result: string[];
  let deployResult: DeployResult = {
    success: false,
    failureMessage: 'Error',
  };

  beforeAll(async () => {
    const deployDirectory: string = path.resolve(__dirname, './output/v6ExtensionDefault');

    fs.removeSync(deployDirectory);

    const metaEdConfiguration: MetaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: path.resolve(__dirname, './artifact'),
      deployDirectory,
      projects: [{ ...newMetaEdProject(), projectName: 'Sample', namespaceName: 'Sample', projectVersion: '1.0.0' }],
    };

    deployResult = await deployExtensionV6(metaEdConfiguration, '4.0.0', true, false);

    const normalizePath = (x: string) => path.relative(deployDirectory, x).split(path.sep).join('/');

    result = klawSync(deployDirectory, { nodir: true })
      .map((x) => normalizePath(x.path))
      .sort();
  });

  it('should have successful deploy result', (): void => {
    expect(deployResult).toMatchObject({ success: true });
  });

  it('should deploy extension artifacts rather than no-op', (): void => {
    expect(result).toMatchInlineSnapshot(`
      Array [
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/Metadata/ApiModel-EXTENSION.json",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/Metadata/InterchangeOrderMetadata-EXTENSION.xml",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/MsSql/Data/Ods/0010-SampleExtensionsData.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/MsSql/Structure/Ods/0010-EXTENSION-Sample-Schemas.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/PgSql/Data/Ods/0010-SampleExtensionsData.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/PgSql/Structure/Ods/0010-EXTENSION-Sample-Schemas.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/Schemas/EXTENSION-Ed-Fi-Extended-Core.xsd",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/Schemas/EXTENSION-Interchange-Descriptors-Extension.xsd",
      ]
    `);
  });
});

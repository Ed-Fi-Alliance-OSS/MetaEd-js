import { newMetaEdConfiguration, newMetaEdProject } from '@edfi/metaed-core';
import { MetaEdConfiguration } from '@edfi/metaed-core';
import klawSync from 'klaw-sync';
import fs from 'fs-extra';
import path from 'path';
import { execute as deployExtension } from '../../src/task/DeployExtension';
import { DeployResult } from '../../src/task/DeployResult';

describe('when deploying 7.0 extension artifacts', (): void => {
  let result: string[];
  let deployResult: DeployResult = {
    success: false,
    failureMessage: 'Error',
  };

  beforeAll(async () => {
    const deployDirectory: string = path.resolve(__dirname, './output/Extension');
    const additionalMssqlScriptsDirectory: string = path.resolve(__dirname, './artifact/AdditionalScripts/MsSql');
    const additionalPostgresScriptsDirectory: string = path.resolve(__dirname, './artifact/AdditionalScripts/Postgres');

    fs.removeSync(deployDirectory);

    const metaEdConfiguration: MetaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: path.resolve(__dirname, './artifact'),
      deployDirectory,
      defaultPluginTechVersion: '7.1.0',
      projects: [{ ...newMetaEdProject(), projectName: 'Sample', projectVersion: '1.0.0' }],
    };

    deployResult = await deployExtension(
      metaEdConfiguration,
      '5.0.0',
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
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Versions/1.0.0/Standard/5.0.0/Artifacts/Metadata/ApiModel-EXTENSION.json",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Versions/1.0.0/Standard/5.0.0/Artifacts/Metadata/InterchangeOrderMetadata-EXTENSION.xml",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Versions/1.0.0/Standard/5.0.0/Artifacts/MsSql/Data/Ods/0010-SampleExtensionsData.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Versions/1.0.0/Standard/5.0.0/Artifacts/MsSql/Data/Ods/999-additional-mssql.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Versions/1.0.0/Standard/5.0.0/Artifacts/MsSql/Structure/Ods/0010-EXTENSION-Sample-Schemas.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Versions/1.0.0/Standard/5.0.0/Artifacts/PgSql/Data/Ods/0010-SampleExtensionsData.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Versions/1.0.0/Standard/5.0.0/Artifacts/PgSql/Data/Ods/999-additional-postgres.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Versions/1.0.0/Standard/5.0.0/Artifacts/PgSql/Structure/Ods/0010-EXTENSION-Sample-Schemas.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Versions/1.0.0/Standard/5.0.0/Artifacts/Schemas/EXTENSION-Ed-Fi-Extended-Core.xsd",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Versions/1.0.0/Standard/5.0.0/Artifacts/Schemas/EXTENSION-Interchange-Descriptors-Extension.xsd",
      ]
    `);
  });
});

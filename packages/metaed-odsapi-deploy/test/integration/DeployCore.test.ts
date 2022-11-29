import { newMetaEdConfiguration } from '@edfi/metaed-core';
import { MetaEdConfiguration } from '@edfi/metaed-core';
import klawSync from 'klaw-sync';
import fs from 'fs-extra';
import path from 'path';
import { execute as DeployCore } from '../../src/task/DeployCore';

describe('when deploying 3.3 core artifacts', (): void => {
  let result: string[];

  beforeAll(async () => {
    const deployDirectory: string = path.resolve(__dirname, './output/Core');
    fs.removeSync(deployDirectory);

    const metaEdConfiguration: MetaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: path.resolve(__dirname, './artifact'),
      deployDirectory,
      defaultPluginTechVersion: '3.3.0',
    };

    await DeployCore(metaEdConfiguration, true, false);

    const normalizePath = (x: string) => path.relative(deployDirectory, x).split(path.sep).join('/');

    result = klawSync(deployDirectory, { nodir: true })
      .map((x) => normalizePath(x.path))
      .sort();
  });

  it('should have correct directory paths', (): void => {
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

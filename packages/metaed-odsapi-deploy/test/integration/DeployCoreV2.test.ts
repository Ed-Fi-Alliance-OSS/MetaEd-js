import { newMetaEdConfiguration } from '@edfi/metaed-core';
import { MetaEdConfiguration } from '@edfi/metaed-core';
import klawSync from 'klaw-sync';
import fs from 'fs-extra';
import path from 'path';
import { execute as DeployCoreV2 } from '../../src/task/DeployCoreV2';

describe('when deploying 2.0 core artifacts', (): void => {
  let result: string[];

  beforeAll(async () => {
    const deployDirectory: string = path.resolve(__dirname, './output/v2Core');
    fs.removeSync(deployDirectory);

    const metaEdConfiguration: MetaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: path.resolve(__dirname, './artifact'),
      deployDirectory,
      defaultPluginTechVersion: '2.0.0',
    };

    await DeployCoreV2(metaEdConfiguration, true, false);

    const normalizePath = (x: string) => path.relative(deployDirectory, x).split(path.sep).join('/');

    result = klawSync(deployDirectory, { nodir: true })
      .map((x) => normalizePath(x.path))
      .sort();
  });

  it('should have correct directory paths', (): void => {
    expect(result).toMatchInlineSnapshot(`
      Array [
        "Ed-Fi-ODS/Database/Data/EdFi/0020-SchoolYears.sql",
        "Ed-Fi-ODS/Database/Structure/EdFi/0010-Schemas.sql",
        "Ed-Fi-ODS/Standard/Metadata/ApiModel.json",
        "Ed-Fi-ODS/Standard/Metadata/InterchangeOrderMetadata.xml",
        "Ed-Fi-ODS/Standard/Schemas/Ed-Fi-Core.xsd",
        "Ed-Fi-ODS/Standard/Schemas/Interchange-AssessmentMetadata.xsd",
      ]
    `);
  });
});

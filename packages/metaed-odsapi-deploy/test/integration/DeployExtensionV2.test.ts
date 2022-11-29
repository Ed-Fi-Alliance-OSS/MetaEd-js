import { newMetaEdConfiguration } from '@edfi/metaed-core';
import { MetaEdConfiguration } from '@edfi/metaed-core';
import klawSync from 'klaw-sync';
import fs from 'fs-extra';
import path from 'path';
import { execute as DeployExtensionV2 } from '../../src/task/DeployExtensionV2';

describe('when deploying 2.0 extension artifacts', (): void => {
  let result: string[];

  beforeAll(async () => {
    const deployDirectory: string = path.resolve(__dirname, './output/v2Extension');
    fs.removeSync(deployDirectory);

    const metaEdConfiguration: MetaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: path.resolve(__dirname, './artifact'),
      deployDirectory,
      defaultPluginTechVersion: '2.0.0',
    };

    await DeployExtensionV2(metaEdConfiguration, true, false);

    const normalizePath = (x: string) => path.relative(deployDirectory, x).split(path.sep).join('/');

    result = klawSync(deployDirectory, { nodir: true })
      .map((x) => normalizePath(x.path))
      .sort();
  });

  it('should have correct directory paths', (): void => {
    expect(result).toMatchInlineSnapshot(`
      Array [
        "Ed-Fi-ODS-Implementation/Database/Data/EdFi/0010-SampleExtensionsData.sql",
        "Ed-Fi-ODS-Implementation/Database/Structure/EdFi/0010-EXTENSION-Sample-Schemas.sql",
        "Ed-Fi-ODS-Implementation/Extensions/Metadata/ApiModel-EXTENSION.json",
        "Ed-Fi-ODS-Implementation/Extensions/Metadata/InterchangeOrderMetadata-EXTENSION.xml",
        "Ed-Fi-ODS-Implementation/Extensions/Schemas/EXTENSION-Ed-Fi-Extended-Core.xsd",
        "Ed-Fi-ODS-Implementation/Extensions/Schemas/EXTENSION-Interchange-Descriptors-Extension.xsd",
      ]
    `);
  });
});

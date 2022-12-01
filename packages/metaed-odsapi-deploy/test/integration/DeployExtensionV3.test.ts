import { newMetaEdConfiguration } from '@edfi/metaed-core';
import { MetaEdConfiguration } from '@edfi/metaed-core';
import klawSync from 'klaw-sync';
import fs from 'fs-extra';
import path from 'path';
import { execute as DeployExtensionV3 } from '../../src/task/DeployExtensionV3';

describe('when deploying 3.0 extension artifacts', (): void => {
  let result: string[];

  beforeAll(async () => {
    const deployDirectory: string = path.resolve(__dirname, './output/v3Extension');
    fs.removeSync(deployDirectory);

    const metaEdConfiguration: MetaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: path.resolve(__dirname, './artifact'),
      deployDirectory,
      defaultPluginTechVersion: '3.0.0',
    };

    await DeployExtensionV3(metaEdConfiguration, true, false);

    const normalizePath = (x: string) => path.relative(deployDirectory, x).split(path.sep).join('/');

    result = klawSync(deployDirectory, { nodir: true })
      .map((x) => normalizePath(x.path))
      .sort();
  });

  it('should have correct directory paths', (): void => {
    expect(result).toMatchInlineSnapshot(`
      Array [
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/SupportingArtifacts/Database/Data/EdFi/0010-SampleExtensionsData.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/SupportingArtifacts/Database/Structure/EdFi/0010-EXTENSION-Sample-Schemas.sql",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/SupportingArtifacts/Metadata/ApiModel-EXTENSION.json",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/SupportingArtifacts/Metadata/InterchangeOrderMetadata-EXTENSION.xml",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/SupportingArtifacts/Schemas/EXTENSION-Ed-Fi-Extended-Core.xsd",
        "Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/SupportingArtifacts/Schemas/EXTENSION-Interchange-Descriptors-Extension.xsd",
      ]
    `);
  });
});

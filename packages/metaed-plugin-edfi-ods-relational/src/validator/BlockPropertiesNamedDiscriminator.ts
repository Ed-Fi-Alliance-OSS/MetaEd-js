import { MetaEdEnvironment, ValidationFailure, SemVer, PluginEnvironment } from 'metaed-core';
import { getAllProperties, versionSatisfies } from 'metaed-core';

const targetTechnologyVersion: SemVer = '>=3.1';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  if (
    !versionSatisfies(
      (metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment).targetTechnologyVersion,
      targetTechnologyVersion,
    )
  )
    return failures;

  getAllProperties(metaEd.propertyIndex).forEach((property) => {
    if (property.metaEdName === 'Discriminator') {
      failures.push({
        validatorName: 'BlockPropertiesNamedDiscriminator',
        category: 'warning',
        message: `The ODS does not allow properties named 'Discriminator'.  ODS generation will likely fail.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}

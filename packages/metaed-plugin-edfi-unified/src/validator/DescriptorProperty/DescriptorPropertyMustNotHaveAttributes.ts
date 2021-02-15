import { MetaEdEnvironment, PluginEnvironment, SemVer, ValidationFailure, versionSatisfies } from 'metaed-core';

const targetTechnologyVersion: SemVer = '=<5.2';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  if (
    !versionSatisfies(
      (metaEd.plugin.get('edfiUnified') as PluginEnvironment).targetTechnologyVersion,
      targetTechnologyVersion,
    )
  ) {
    return [];
  }

  const failures: ValidationFailure[] = [];

  // metaEd.propertyIndex.descriptor.forEach(descriptorProperty => {
  //   failures.push({
  //     validatorName: 'DescriptorPropertyMustNotHaveAttributes',
  //     category: 'error',
  //     message: `Descriptor property ${descriptorProperty.metaEdName} name is invalid.  Descriptor names cannot be suffixed with 'Descriptor'.`,
  //     sourceMap: descriptorProperty.sourceMap.metaEdName,
  //     fileMap: null,
  //   });
  // });
  return failures;
}

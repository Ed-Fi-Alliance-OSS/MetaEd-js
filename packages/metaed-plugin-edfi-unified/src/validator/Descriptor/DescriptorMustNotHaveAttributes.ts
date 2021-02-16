import {
  DescriptorSourceMap,
  MetaEdEnvironment,
  Namespace,
  PluginEnvironment,
  SemVer,
  ValidationFailure,
  versionSatisfies,
} from 'metaed-core';

const targetTechnologyVersion: SemVer = '>=5.2';

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

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.entity.descriptor.forEach(descriptor => {
      if (descriptor.properties.length > 0) {
        failures.push({
          validatorName: 'DescriptorMustNotHaveAttributes',
          category: 'error',
          message: `Disallowed as of ODS/API v5.2. The recommended pattern for descriptors that require additional attributes is to model as common entities.`,
          sourceMap: (descriptor.sourceMap as DescriptorSourceMap).metaEdName,
          fileMap: null,
        });
      }
    });
  });

  return failures;
}

import {
  MetaEdEnvironment,
  ValidationFailure,
  SharedStringProperty,
  StringPropertySourceMap,
  versionSatisfies,
  PluginEnvironment,
} from '@edfi/metaed-core';
import { asSharedStringProperty } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.propertyIndex.sharedString.forEach((property) => {
    const sharedStringProperty: SharedStringProperty = asSharedStringProperty(property);
    const minLength: number = Number.parseInt(sharedStringProperty.minLength || '0', 10);
    if (minLength === 1 && sharedStringProperty.isOptional) {
      const { targetTechnologyVersion } = metaEd.plugin.get('edfiUnifiedAdvanced') as PluginEnvironment;
      failures.push({
        validatorName: 'SharedStringPropertyMustNotHaveMinLengthOneOnOptionalFields',
        category: versionSatisfies(targetTechnologyVersion, '>=7.0.0') ? 'error' : 'warning',
        message: versionSatisfies(targetTechnologyVersion, '>=7.0.0')
          ? `Shared String Property ${property.metaEdName} has min length 1 on optional field.`
          : `Shared String Property ${property.metaEdName} has min length 1 on optional field. This warning will be treated as an error in API version 7.x`,
        sourceMap: (property.sourceMap as StringPropertySourceMap).minLength,
        fileMap: null,
      });
    }
  });

  return failures;
}

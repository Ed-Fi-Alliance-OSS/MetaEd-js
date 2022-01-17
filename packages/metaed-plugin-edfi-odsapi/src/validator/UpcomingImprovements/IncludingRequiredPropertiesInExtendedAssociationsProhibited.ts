// 2.2.X.2 - METAED-701
import { MetaEdEnvironment, ValidationFailure, AssociationExtension, SemVer, PluginEnvironment } from '@edfi/metaed-core';
import { getAllEntitiesOfType, versionSatisfies } from '@edfi/metaed-core';

const targetTechnologyVersion: SemVer = '<3.1';

function isTargetTechnologyVersion(metaEd: MetaEdEnvironment): boolean {
  return versionSatisfies(
    (metaEd.plugin.get('edfiOdsApi') as PluginEnvironment).targetTechnologyVersion,
    targetTechnologyVersion,
  );
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!isTargetTechnologyVersion(metaEd)) return failures;

  (getAllEntitiesOfType(metaEd, 'associationExtension') as AssociationExtension[]).forEach(
    (associationExtension: AssociationExtension) => {
      associationExtension.properties.forEach((property) => {
        if (property.isRequired) {
          failures.push({
            validatorName: 'IncludingRequiredPropertiesInExtendedAssociationsProhibited',
            category: 'warning',
            message: `${associationExtension.typeHumanizedName} ${associationExtension.metaEdName} is an extension with required property ${property.metaEdName}.  The ODS/API does not currently support this pattern.`,
            sourceMap: property.sourceMap.metaEdName,
            fileMap: null,
          });
        }
      });
    },
  );

  return failures;
}

// 2.1.X.1 - METAED-701 - ODS-827
import { versionSatisfies, V2Only, getAllEntitiesOfType } from '@edfi/metaed-core';
import {
  MetaEdEnvironment,
  ValidationFailure,
  TopLevelEntity,
  PluginEnvironment,
  SemVer,
  DomainEntityExtension,
} from '@edfi/metaed-core';

function isEducationOrganizationSubclass(topLevelEntity: TopLevelEntity): boolean {
  if (topLevelEntity.type !== 'domainEntitySubclass') return false;
  if (topLevelEntity.baseEntityName === 'EducationOrganization') return true;
  if (topLevelEntity.baseEntity) return isEducationOrganizationSubclass(topLevelEntity.baseEntity);
  return false;
}

const validatorName = 'ExtendingSubclassOfEducationOrganizationProhibited';
const targetTechnologyVersion: SemVer = V2Only;

function isTargetTechnologyVersion(metaEd: MetaEdEnvironment): boolean {
  return versionSatisfies(
    (metaEd.plugin.get('edfiOdsApi') as PluginEnvironment).targetTechnologyVersion,
    targetTechnologyVersion,
  );
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!isTargetTechnologyVersion(metaEd)) return failures;

  (getAllEntitiesOfType(metaEd, 'domainEntityExtension') as DomainEntityExtension[]).forEach(
    (domainEntityExtension: DomainEntityExtension) => {
      if (!domainEntityExtension.baseEntity) return;
      if (isEducationOrganizationSubclass(domainEntityExtension.baseEntity)) {
        failures.push({
          validatorName,
          category: 'warning',
          message: `[ODS-827] ${domainEntityExtension.typeHumanizedName} ${domainEntityExtension.metaEdName} is an extension of an EducationOrganization subclass.  The ODS/API does not currently support this pattern and will fail to build.`,
          sourceMap: domainEntityExtension.sourceMap.metaEdName,
          fileMap: null,
        });
      }
    },
  );

  return failures;
}

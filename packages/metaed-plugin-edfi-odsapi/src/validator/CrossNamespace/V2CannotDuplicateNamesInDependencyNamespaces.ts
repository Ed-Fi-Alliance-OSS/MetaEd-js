import {
  MetaEdEnvironment,
  Namespace,
  ValidationFailure,
  PluginEnvironment,
  TopLevelEntity,
  SemVer,
  V2Only,
  versionSatisfies,
} from '@edfi/metaed-core';
import { duplicateNameFinder } from './DuplicateNameFinder';

const targetTechnologyVersion: SemVer = V2Only;

function isTargetTechnologyVersion(metaEd: MetaEdEnvironment): boolean {
  return versionSatisfies(
    (metaEd.plugin.get('edfiOdsApi') as PluginEnvironment).targetTechnologyVersion,
    targetTechnologyVersion,
  );
}

function failureCollector(
  failures: ValidationFailure[],
  entityWithDuplicateName: TopLevelEntity,
  dependencyNamespace: Namespace,
) {
  failures.push({
    validatorName: 'V2CannotDuplicateNamesInDependencyNamespaces',
    category: 'error',
    message: `${entityWithDuplicateName.typeHumanizedName} named ${entityWithDuplicateName.metaEdName} is a duplicate declaration of that name. Name already exists in project ${dependencyNamespace.projectName}. ODS/API 2.x does not support duplicate names.`,
    sourceMap: entityWithDuplicateName.sourceMap.metaEdName,
    fileMap: null,
  });
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!isTargetTechnologyVersion(metaEd)) return failures;
  duplicateNameFinder(metaEd, failures, failureCollector);
  return failures;
}

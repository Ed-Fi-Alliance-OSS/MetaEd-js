import R from 'ramda';
import deepmerge from 'deepmerge';
import { getEntitiesOfTypeForNamespaces } from '../model/EntityRepository';
import { ModelBase } from '../model/ModelBase';
import { ModelType } from '../model/ModelType';
import { Namespace } from '../model/Namespace';
import { ValidationFailure } from '../validator/ValidationFailure';
import { ConfigurationRule, ConfigurationMatches } from './ConfigurationSchema';
import { PluginConfiguration } from './PluginConfiguration';
import { PluginEnvironment } from './PluginEnvironment';

function extensionNamespaces(namespaceRepository: Map<string, Namespace>): Namespace[] {
  return [...namespaceRepository.values()].filter((n) => n.isExtension);
}

function coreNamespaces(namespaceRepository: Map<string, Namespace>): Namespace[] {
  return [...namespaceRepository.values()].filter((n) => !n.isExtension);
}

function findMatchingNamespaces(
  namespaceRepository: Map<string, Namespace>,
  matches: ConfigurationMatches,
  validationFailures: ValidationFailure[],
  filepathForErrors: string,
): Namespace[] {
  if (matches.core === true) return coreNamespaces(namespaceRepository);
  if (matches.extensions === true) return extensionNamespaces(namespaceRepository);
  if (matches.namespace) {
    const namespaceNamesInMatches: string[] = [].concat(matches.namespace as any);
    const foundNamespaces: Namespace[] = [];

    namespaceNamesInMatches.forEach((namespaceNameInMatches: string) => {
      const namespaceMatch: Namespace | undefined = namespaceRepository.get(namespaceNameInMatches);
      if (namespaceMatch == null) {
        validationFailures.push({
          validatorName: 'AnnotateModelWithConfiguration',
          category: 'error',
          message: `Namespace '${namespaceNameInMatches}' in configuration file does not match a MetaEd project namespace. Either include a project with that namespace or remove the configuration entry.`,
          sourceMap: null,
          fileMap: {
            fullPath: filepathForErrors,
            lineNumber: 0,
          },
        });
      } else {
        foundNamespaces.push(namespaceMatch);
      }
    });
    return foundNamespaces;
  }
  return [...namespaceRepository.values()];
}

function findMatchingEntities(
  namespaceRepository: Map<string, Namespace>,
  matches: ConfigurationMatches,
  validationFailures: ValidationFailure[],
  filepathForErrors: string,
): ModelBase[] {
  const namespaces: Namespace[] = findMatchingNamespaces(
    namespaceRepository,
    matches,
    validationFailures,
    filepathForErrors,
  );
  const entityTypes: ModelType[] = [].concat(matches.entity as any);
  // assumes entityTypes strings were validated previously
  const entitiesOfTypeAndNamespace: ModelBase[] = getEntitiesOfTypeForNamespaces(namespaces, ...entityTypes);

  if (matches.entityName == null) return entitiesOfTypeAndNamespace;

  const entityNamesInMatches: string[] = [].concat(matches.entityName as any);
  const foundEntities: ModelBase[] = [];

  entityNamesInMatches.forEach((entityNameInMatches: string) => {
    const entityMatch: ModelBase[] = entitiesOfTypeAndNamespace.filter(
      (entity: ModelBase) => entity.metaEdName === entityNameInMatches,
    );

    if (entityMatch.length === 0) {
      validationFailures.push({
        validatorName: 'AnnotateModelWithConfiguration',
        category: 'error',
        message: `Entity name '${entityNameInMatches}' in configuration file does not match any entities of the given type and namespace criteria.`,
        sourceMap: null,
        fileMap: {
          fullPath: filepathForErrors,
          lineNumber: 0,
        },
      });
    } else {
      foundEntities.push(...entityMatch);
    }
  });
  return foundEntities;
}

export function annotateModelWithConfiguration(
  pluginConfiguration: PluginConfiguration,
  pluginEnvironment: PluginEnvironment,
  namespaceRepository: Map<string, Namespace>,
): ValidationFailure[] {
  const validationFailures: ValidationFailure[] = [];

  const configRuleArray: ConfigurationRule[] = [].concat(pluginConfiguration.configObject.config as any);
  configRuleArray.forEach((configRule: ConfigurationRule) => {
    if (configRule.matches == null) {
      // this is plugin-wide configuration data
      pluginEnvironment.config = deepmerge(configRule.data, pluginEnvironment.config || {});
    } else {
      const matchesForRule: ConfigurationMatches[] = [].concat(configRule.matches as any);
      const matchingEntities: ModelBase[] = [];

      matchesForRule.forEach((configurationMatches: ConfigurationMatches) => {
        matchingEntities.push(
          ...findMatchingEntities(
            namespaceRepository,
            configurationMatches,
            validationFailures,
            pluginConfiguration.filepath,
          ),
        );
      });

      R.uniq(matchingEntities).forEach((entity: ModelBase) => {
        entity.config = deepmerge({ [pluginEnvironment.shortName]: configRule.data }, entity.config || {});
      });
    }
  });
  return validationFailures;
}

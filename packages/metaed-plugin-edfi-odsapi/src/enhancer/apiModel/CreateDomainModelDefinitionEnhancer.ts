import * as R from 'ramda';
import { MetaEdEnvironment, EnhancerResult, Namespace, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { parse } from 'semver';
import { NoSchemaDefinition } from '../../model/apiModel/SchemaDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { AggregateDefinition } from '../../model/apiModel/AggregateDefinition';
import { AggregateExtensionDefinition } from '../../model/apiModel/AggregateExtensionDefinition';
import { DomainModelDefinition, newDomainModelDefinition } from '../../model/apiModel/DomainModelDefinition';
import { Aggregate } from '../../model/domainMetadata/Aggregate';
import { EntityTable } from '../../model/domainMetadata/EntityTable';
import { ApiFullName } from '../../model/apiModel/ApiFullName';

const enhancerName = 'CreateDomainModelDefinitionEnhancer';

export function buildAggregateDefinitions(namespace: Namespace): AggregateDefinition[] {
  const result: AggregateDefinition[] = [];
  (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates
    .filter((a: Aggregate) => !a.isExtension)
    .forEach((aggregate: Aggregate) => {
      const aggregateDefinition: AggregateDefinition = {
        aggregateRootEntityName: {
          schema: aggregate.schema,
          name: aggregate.root,
        },
        aggregateEntityNames: [],
      };
      const aggregateEntityNames: ApiFullName[] = [];
      aggregate.entityTables.forEach((entityTable: EntityTable) => {
        aggregateEntityNames.push({
          schema: entityTable.schema,
          name: entityTable.table,
        });
      });
      aggregateDefinition.aggregateEntityNames = R.sortBy(R.compose(R.toLower, R.prop('name')), aggregateEntityNames);
      result.push(aggregateDefinition);
    });

  return R.sortBy(R.compose(R.toLower, R.path(['aggregateRootEntityName', 'name'])), result);
}

export function buildAggregateExtensionDefinitions(namespace: Namespace): AggregateExtensionDefinition[] {
  const result: AggregateExtensionDefinition[] = [];
  (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates
    .filter((a: Aggregate) => a.isExtension)
    .forEach((aggregate: Aggregate) => {
      const aggregateExtensionDefinition: AggregateExtensionDefinition = {
        aggregateRootEntityName: {
          schema: 'edfi', // assuming here that extensions are always extending from core
          name: aggregate.root,
        },
        extensionEntityNames: [],
      };
      const extensionEntityNames: ApiFullName[] = [];
      aggregate.entityTables.forEach((entityTable: EntityTable) => {
        extensionEntityNames.push({
          schema: entityTable.schema,
          name: entityTable.table,
        });
      });
      aggregateExtensionDefinition.extensionEntityNames = R.sortBy(
        R.compose(R.toLower, R.prop('name')),
        extensionEntityNames,
      );
      result.push(aggregateExtensionDefinition);
    });

  return R.sortBy(R.compose(R.toLower, R.path(['aggregateRootEntityName', 'name'])), result);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsApi') as PluginEnvironment;

  const defaultVersion: string = '3.0.0';
  const semverParsedVersion = parse(targetTechnologyVersion);
  let odsApiVersion: string = defaultVersion;

  if (versionSatisfies(targetTechnologyVersion, '>=5.2')) {
    odsApiVersion = semverParsedVersion ? `${semverParsedVersion.major}.${semverParsedVersion.minor}` : defaultVersion;
  } else {
    odsApiVersion = targetTechnologyVersion || defaultVersion;
  }

  metaEd.namespace.forEach((namespace: Namespace) => {
    const domainModelDefinition: DomainModelDefinition = {
      ...newDomainModelDefinition(),
      odsApiVersion,
      schemaDefinition: NoSchemaDefinition,
      aggregateDefinitions: buildAggregateDefinitions(namespace),
      aggregateExtensionDefinitions: buildAggregateExtensionDefinitions(namespace),
    };

    // With ODS/API 7+, extension ApiModel gets data standard version
    if (versionSatisfies(targetTechnologyVersion, '>=7.0.0') && namespace.namespaceName !== 'EdFi') {
      domainModelDefinition.edFiVersion = metaEd.dataStandardVersion;
    }

    (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition = domainModelDefinition;
  });

  return {
    enhancerName,
    success: true,
  };
}

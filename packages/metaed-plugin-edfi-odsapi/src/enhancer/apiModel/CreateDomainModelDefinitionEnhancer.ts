import R from 'ramda';
import { MetaEdEnvironment, EnhancerResult, Namespace, PluginEnvironment, SemVer, versionSatisfies } from 'metaed-core';
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
      aggregateDefinition.aggregateEntityNames = R.sortBy(
        R.compose(
          R.toLower,
          R.prop('name'),
        ),
        aggregateEntityNames,
      );
      result.push(aggregateDefinition);
    });

  return R.sortBy(
    R.compose(
      R.toLower,
      R.path(['aggregateRootEntityName', 'name']),
    ),
    result,
  );
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
        R.compose(
          R.toLower,
          R.prop('name'),
        ),
        extensionEntityNames,
      );
      result.push(aggregateExtensionDefinition);
    });

  return R.sortBy(
    R.compose(
      R.toLower,
      R.path(['aggregateRootEntityName', 'name']),
    ),
    result,
  );
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const vFiveTwo: SemVer = '=5.2.x';
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsApi') as PluginEnvironment;
  const odsApiVersion: string = versionSatisfies(targetTechnologyVersion, vFiveTwo)
    ? '5.2'
    : (metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment).targetTechnologyVersion || '3.0.0';

  metaEd.namespace.forEach((namespace: Namespace) => {
    const domainModelDefinition: DomainModelDefinition = {
      ...newDomainModelDefinition(),
      odsApiVersion,
      schemaDefinition: NoSchemaDefinition,
      aggregateDefinitions: buildAggregateDefinitions(namespace),
      aggregateExtensionDefinitions: buildAggregateExtensionDefinitions(namespace),
    };

    (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition = domainModelDefinition;
  });

  return {
    enhancerName,
    success: true,
  };
}

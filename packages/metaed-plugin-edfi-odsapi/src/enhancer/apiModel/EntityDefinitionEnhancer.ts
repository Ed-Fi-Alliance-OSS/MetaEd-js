import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from 'metaed-core';
import { versionSatisfies } from 'metaed-core';
import { Table } from 'metaed-plugin-edfi-ods-relational';
import { tableEntities } from 'metaed-plugin-edfi-ods-relational';
import R from 'ramda';
import { EntityDefinition } from '../../model/apiModel/EntityDefinition';
import { newEntityDefinition } from '../../model/apiModel/EntityDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';

const enhancerName = 'EntityDefinitionEnhancer';
const targetVersions: SemVer = '>=3.3.0';

const sortByName = R.sortBy(R.pipe(R.prop('name'), R.toLower));

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    const result: EntityDefinition[] = [];

    tableEntities(metaEd, namespace).forEach((table: Table) => {
      result.push({
        ...newEntityDefinition(),
        schema: table.schema,
        name: table.data.edfiOdsSqlServer.tableName,
        tableNames: {
          sqlServer: table.data.edfiOdsSqlServer.tableName,
          postgreSql: table.data.edfiOdsPostgresql.tableName,
        },
        description: table.description,
        isDeprecated: table.isDeprecated ? true : undefined,
        deprecationReasons: table.deprecationReasons.length > 0 ? table.deprecationReasons : undefined,
      });
    });

    const { domainModelDefinition } = namespace.data.edfiOdsApi as NamespaceEdfiOdsApi;
    domainModelDefinition.entityDefinitions = sortByName(result);
  });

  return {
    enhancerName,
    success: true,
  };
}

import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from 'metaed-core';
import { versionSatisfies } from 'metaed-core';
import { ForeignKey, Table } from 'metaed-plugin-edfi-ods-relational';
import { tableEntities } from 'metaed-plugin-edfi-ods-relational';
import R from 'ramda';
import { AssociationDefinition } from '../../model/apiModel/AssociationDefinition';
import { newAssociationDefinition } from '../../model/apiModel/AssociationDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';

const enhancerName = 'AssociationDefinitionEnhancer';
const targetVersions: SemVer = '>=5.2.0';

const sortByName = R.sortBy(
  R.pipe(
    R.path(['fullName', 'name']),
    R.toLower,
  ),
);

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    const result: AssociationDefinition[] = [];

    tableEntities(metaEd, namespace).forEach((table: Table) => {
      table.foreignKeys.forEach((foreignKey: ForeignKey) => {
        result.push({
          ...newAssociationDefinition(),
          fullName: {
            schema: table.schema,
            name: foreignKey.data.edfiOdsSqlServer.foreignKeyName,
          },
          constraintNames: {
            sqlServer: foreignKey.data.edfiOdsSqlServer.foreignKeyName,
            postgreSql: foreignKey.data.edfiOdsPostgresql.foreignKeyName,
          },
          primaryEntityFullName: {
            schema: foreignKey.foreignTableSchema,
            name: foreignKey.foreignTable.data.edfiOdsSqlServer.tableName,
          },
          secondaryEntityFullName: {
            schema: foreignKey.parentTable.schema,
            name: foreignKey.parentTable.data.edfiOdsSqlServer.tableName,
          },
          potentiallyLogical: foreignKey.sourceReference.isPotentiallyLogical,
        });
      });
    });

    const { domainModelDefinition } = namespace.data.edfiOdsApi as NamespaceEdfiOdsApi;
    domainModelDefinition.associationDefinitions = sortByName(result);
  });

  return {
    enhancerName,
    success: true,
  };
}

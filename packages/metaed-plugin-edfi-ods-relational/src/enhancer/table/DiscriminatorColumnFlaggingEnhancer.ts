import { EnhancerResult, MetaEdEnvironment, Namespace, SemVer, PluginEnvironment } from '@edfi/metaed-core';
import { defaultPluginTechVersion, versionSatisfies, NoTopLevelEntity } from '@edfi/metaed-core';
import { tableEntities } from '../EnhancerHelper';
import { Table } from '../../model/database/Table';

const enhancerName = 'DiscriminatorColumnFlaggingEnhancer';
const targetTechnologyVersion: SemVer = `>=${defaultPluginTechVersion}`;

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (
    !versionSatisfies(
      (metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment).targetTechnologyVersion,
      targetTechnologyVersion,
    )
  )
    return { enhancerName, success: true };
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      if (table.parentEntity === NoTopLevelEntity || !table.isAggregateRootTable) return;
      if (table.parentEntity.type === 'association' || table.parentEntity.type === 'domainEntity') {
        table.hasDiscriminatorColumn = true;
      }
    });
  });

  return {
    enhancerName,
    success: true,
  };
}

import hash from 'hash.js';
import { Table, flattenNameComponentsFromGroup } from 'metaed-plugin-edfi-ods-relational';
import { MetaEdEnvironment, PluginEnvironment, versionSatisfies } from 'metaed-core';

export const TARGET_DATABASE_PLUGIN_NAME = 'edfiOdsPostgresql';

function createHashLength6(text: string): string {
  return hash.sha256().update(text).digest('hex').substr(0, 6);
}

export function postgresqlTriggerName(table: Table, triggerSuffix: string): string {
  const overallMaxLength = 63;
  const separator = '_';

  const tableName = flattenNameComponentsFromGroup(table.nameGroup)
    .map((nameComponent) => nameComponent.name)
    .join('');

  const proposedTriggerName = `${tableName}${separator}${triggerSuffix}`;

  if (proposedTriggerName.length <= overallMaxLength) return proposedTriggerName;

  const triggerHash: string = createHashLength6(tableName);

  const allowedLengthBeforeHash =
    overallMaxLength - separator.length - triggerHash.length - separator.length - triggerSuffix.length;

  return `${tableName.substr(0, allowedLengthBeforeHash)}${separator}${triggerHash}${separator}${triggerSuffix}`;
}

export function versionSatisfiesForPostgresChangeQuerySupport(metaEd: MetaEdEnvironment): boolean {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;

  return versionSatisfies(targetTechnologyVersion, '>=3.4.0');
}

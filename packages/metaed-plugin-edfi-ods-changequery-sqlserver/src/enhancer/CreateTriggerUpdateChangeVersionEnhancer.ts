import { MetaEdEnvironment, EnhancerResult, versionSatisfies, SemVer, EntityProperty } from '@edfi/metaed-core';
import { Column, ColumnNameComponent, newColumnNameComponent, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { constructColumnNameFrom } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import {
  ChangeDataColumn,
  newChangeDataColumn,
  CreateTriggerUpdateChangeVersion,
  performCreateTriggerUpdateChangeVersionEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'CreateTriggerUpdateChangeVersionEnhancer';

function isDescriptorIdColumn(column: Column) {
  if (!column.sourceEntityProperties.some((property: EntityProperty) => property.type === 'descriptor')) return false;
  const [lastNameComponent] = column.nameComponents.slice(-1);
  return lastNameComponent.name === 'Id';
}

function isUsiColumn(column: Column) {
  const [lastNameComponent] = column.nameComponents.slice(-1);
  return lastNameComponent.name === 'USI';
}

function usiName(usiColumn: Column): string {
  const [usiNameComponent] = usiColumn.nameComponents.slice(-2);
  return usiNameComponent.name;
}

function createTriggerModel(table: Table, targetTechnologyVersion: SemVer): CreateTriggerUpdateChangeVersion {
  let tableAliasSuffix: number = 0;
  const changeDataColumns: ChangeDataColumn[] = [];
  table.primaryKeys.forEach((pkColumn: Column) => {
    // If there is a DescriptorId column, add additional "namespace" and "codeValue" descriptor columns
    if (isDescriptorIdColumn(pkColumn)) {
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: pkColumn.data.edfiOdsSqlServer.columnName,
        isDescriptorId: true,
        tableAliasSuffix: String(tableAliasSuffix),
        isRegularSelectColumn: true,
      });

      // Column nameComponents end in "Id" for these columns. Make new ones with Namespace/CodeValue substituted
      const namespaceColumnNaming: ColumnNameComponent[] = [
        ...pkColumn.nameComponents.slice(0, -1),
        { ...newColumnNameComponent(), name: 'Namespace', isSynthetic: true },
      ];
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: constructColumnNameFrom(namespaceColumnNaming),
        tableAliasSuffix: String(tableAliasSuffix),
        isDescriptorNamespace: true,
      });

      const codeValueColumnNaming: ColumnNameComponent[] = [
        ...pkColumn.nameComponents.slice(0, -1),
        { ...newColumnNameComponent(), name: 'CodeValue', isSynthetic: true },
      ];
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: constructColumnNameFrom(codeValueColumnNaming),
        tableAliasSuffix: String(tableAliasSuffix),
        isDescriptorCodeValue: true,
      });

      tableAliasSuffix += 1;
    } else if (isUsiColumn(pkColumn)) {
      // If there is an USI column, make up a corresponding regular UniqueId column
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: pkColumn.data.edfiOdsSqlServer.columnName,
        tableAliasSuffix: String(tableAliasSuffix),
        isUsi: true,
        usiName: usiName(pkColumn),
        isRegularSelectColumn: true,
      });

      const uniqueIdColumnNaming: ColumnNameComponent[] = [
        ...pkColumn.nameComponents.slice(0, -1),
        { ...newColumnNameComponent(), name: 'UniqueId', isSynthetic: true },
      ];
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: constructColumnNameFrom(uniqueIdColumnNaming),
        tableAliasSuffix: String(tableAliasSuffix),
        isUniqueId: true,
      });
      tableAliasSuffix += 1;
    } else {
      // A regular column
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: pkColumn.data.edfiOdsSqlServer.columnName,
        isRegularSelectColumn: true,
      });
    }
  });

  return {
    schema: table.schema,
    tableName: table.data.edfiOdsSqlServer.tableName,
    triggerName: `${table.schema}_${table.data.edfiOdsSqlServer.tableName}_TR_UpdateChangeVersion`,
    primaryKeyColumnNames: table.primaryKeys.map((pkColumn: Column) => pkColumn.data.edfiOdsSqlServer.columnName),
    changeDataColumns,
    includeKeyChanges: versionSatisfies(targetTechnologyVersion, '>=5.4.0') && table.hasUpdateCascadingForeignKey,
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  performCreateTriggerUpdateChangeVersionEnhancement(metaEd, PLUGIN_NAME, createTriggerModel);
  return {
    enhancerName,
    success: true,
  };
}

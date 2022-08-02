import { EntityProperty } from '@edfi/metaed-core';
import { Column, ColumnNameComponent, newColumnNameComponent, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ColumnDataTypes, constructColumnNameFrom } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import {
  ChangeDataColumn,
  disciplineActionWithResponsibilitySchoolColumn,
  newChangeDataColumn,
} from '@edfi/metaed-plugin-edfi-ods-changequery';

export const TARGET_DATABASE_PLUGIN_NAME = 'edfiOdsSqlServer';

function isBaseDescriptorTableIdColumn(table: Table, column: Column) {
  return table.tableId === 'Descriptor' && table.schema === 'edfi' && column.columnId === 'DescriptorId';
}

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

export function changeDataColumnsFor(table: Table): ChangeDataColumn[] {
  let tableAliasSuffix: number = 0;
  const changeDataColumns: ChangeDataColumn[] = [];

  table.primaryKeys.forEach((pkColumn: Column) => {
    // If this is the DescriptorId column on the base "Descriptor" table, add "Namespace" and "CodeValue" columns
    if (isBaseDescriptorTableIdColumn(table, pkColumn)) {
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: pkColumn.data.edfiOdsSqlServer.columnName,
        columnDataType: pkColumn.data.edfiOdsSqlServer.dataType,
        isDescriptorId: true,
        tableAliasSuffix: String(tableAliasSuffix),
        isRegularSelectColumn: true,
      });
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: 'Namespace',
        columnDataType: ColumnDataTypes.string('255'),
        tableAliasSuffix: String(tableAliasSuffix),
        isDescriptorNamespace: true,
      });
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: 'CodeValue',
        columnDataType: ColumnDataTypes.string('50'),
        tableAliasSuffix: String(tableAliasSuffix),
        isDescriptorCodeValue: true,
      });
    }

    // If there is a DescriptorId column, add additional "namespace" and "codeValue" descriptor columns
    else if (isDescriptorIdColumn(pkColumn)) {
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: pkColumn.data.edfiOdsSqlServer.columnName,
        columnDataType: pkColumn.data.edfiOdsSqlServer.dataType,
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
        columnDataType: ColumnDataTypes.string('255'),
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
        columnDataType: ColumnDataTypes.string('50'),
        tableAliasSuffix: String(tableAliasSuffix),
        isDescriptorCodeValue: true,
      });

      tableAliasSuffix += 1;
    }

    // If there is an USI column, make up a corresponding regular UniqueId column
    else if (isUsiColumn(pkColumn)) {
      // flag if this is e.g. StudentUSI on the Student table itself
      const usiNamePrefixComponents = pkColumn.nameComponents.slice(0, -1);
      const isUsiOnOwnTable = table.data.edfiOdsSqlServer.tableName === constructColumnNameFrom(usiNamePrefixComponents);

      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: pkColumn.data.edfiOdsSqlServer.columnName,
        columnDataType: pkColumn.data.edfiOdsSqlServer.dataType,
        tableAliasSuffix: String(tableAliasSuffix),
        isUsi: !isUsiOnOwnTable,
        usiName: usiName(pkColumn),
        isRegularSelectColumn: true,
      });

      const uniqueIdColumnNaming: ColumnNameComponent[] = [
        ...usiNamePrefixComponents,
        { ...newColumnNameComponent(), name: 'UniqueId', isSynthetic: true },
      ];
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: constructColumnNameFrom(uniqueIdColumnNaming),
        columnDataType: ColumnDataTypes.string('32'),
        tableAliasSuffix: String(tableAliasSuffix),
        isUniqueId: !isUsiOnOwnTable,
        isRegularSelectColumn: isUsiOnOwnTable,
      });

      tableAliasSuffix += 1;
    } else {
      // A regular column
      changeDataColumns.push({
        ...newChangeDataColumn(),
        columnName: pkColumn.data.edfiOdsSqlServer.columnName,
        columnDataType: pkColumn.data.edfiOdsSqlServer.dataType,
        isRegularSelectColumn: true,
      });
    }
  });

  return changeDataColumns;
}

// This is a hardcode for core DisciplineAction with a ResponsibilitySchoolId column
// Added for authorization reasons. See METAED-1293
export function hardcodedOldColumnFor(table: Table): ChangeDataColumn | null {
  const responsibilitySchoolColumn: Column | undefined = disciplineActionWithResponsibilitySchoolColumn(table);
  if (responsibilitySchoolColumn == null) return null;
  return {
    ...newChangeDataColumn(),
    columnName: responsibilitySchoolColumn.data.edfiOdsSqlServer.columnName,
    columnDataType: responsibilitySchoolColumn.data.edfiOdsSqlServer.dataType,
    isRegularSelectColumn: true,
  };
}

export function changeDataColumnsWithHardcodesFor(table: Table): ChangeDataColumn[] {
  const changeDataColumns: ChangeDataColumn[] = changeDataColumnsFor(table);
  const hardcodedOldColumn: ChangeDataColumn | null = hardcodedOldColumnFor(table);
  if (hardcodedOldColumn != null) changeDataColumns.push(hardcodedOldColumn);
  return changeDataColumns;
}

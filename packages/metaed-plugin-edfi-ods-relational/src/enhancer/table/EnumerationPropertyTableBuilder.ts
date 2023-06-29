import * as R from 'ramda';
import { EntityProperty, ReferentialProperty, SemVer, asReferentialProperty } from '@edfi/metaed-core';
import { addColumnsWithoutSort, addForeignKey, newTable, newTableExistenceReason } from '../../model/database/Table';
import { joinTableNamer } from './TableNaming';
import { ColumnTransform, ColumnTransformPrimaryKey, ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { ForeignKeyStrategy } from '../../model/database/ForeignKeyStrategy';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { ColumnCreator } from './ColumnCreator';
import { ColumnCreatorFactory } from './ColumnCreatorFactory';
import { ForeignKey, createForeignKey } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';
import { TableStrategy } from '../../model/database/TableStrategy';

const foreignKeyStrategyFor = (property: EntityProperty): ForeignKeyStrategy => {
  if (property.type === 'enumeration')
    return ForeignKeyStrategy.foreignColumnIdChange(`${property.data.edfiOdsRelational.odsTypeifiedBaseName}Id`);
  if (property.type === 'schoolYearEnumeration') return ForeignKeyStrategy.foreignColumnIdChange('SchoolYear');
  throw new Error('EnumerationPropertyTableBuilder received non-enumeration property');
};

export function enumerationPropertyTableBuilder(factory: ColumnCreatorFactory): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Column[],
      buildStrategy: BuildStrategy,
      tables: Table[],
      targetTechnologyVersion: SemVer,
      parentIsRequired: boolean | null,
    ): void {
      const enumeration: ReferentialProperty = asReferentialProperty(property);
      const columnCreator: ColumnCreator = factory.columnCreatorFor(enumeration, targetTechnologyVersion);

      if (!enumeration.data.edfiOdsRelational.odsIsCollection) {
        const enumerationColumn: Column = R.head(columnCreator.createColumns(enumeration, buildStrategy));
        const foreignKey: ForeignKey = createForeignKey(
          property,
          [enumerationColumn],
          enumeration.referencedEntity.namespace.namespaceName.toLowerCase(),
          enumeration.referencedEntity.namespace,
          enumeration.referencedEntity.data.edfiOdsRelational.odsTableId,
          foreignKeyStrategyFor(enumeration),
        );
        addForeignKey(parentTableStrategy.table, foreignKey);
        addColumnsWithoutSort(
          parentTableStrategy.table,
          [enumerationColumn],
          buildStrategy.leafColumns(ColumnTransformUnchanged),
          targetTechnologyVersion,
        );
      } else {
        const { tableId, nameGroup } = joinTableNamer(enumeration, parentTableStrategy, buildStrategy);
        const joinTable: Table = {
          ...newTable(),
          namespace: parentTableStrategy.schemaNamespace,
          schema: parentTableStrategy.schema,
          tableId,
          nameGroup,
          existenceReason: {
            ...newTableExistenceReason(),
            isImplementingCollection: true,
            sourceProperty: enumeration,
          },
          description: enumeration.documentation,
          isRequiredCollectionTable: enumeration.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
          includeCreateDateColumn: true,
          parentEntity: enumeration.parentEntity,
        };
        tables.push(joinTable);

        const parentForeignKey: ForeignKey = createForeignKey(
          property,
          parentPrimaryKeys,
          parentTableStrategy.schema,
          parentTableStrategy.schemaNamespace,
          parentTableStrategy.tableId,
          ForeignKeyStrategy.foreignColumnCascade(
            true,
            enumeration.parentEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates,
          ),
        );
        addForeignKey(joinTable, parentForeignKey);
        addColumnsWithoutSort(
          joinTable,
          parentPrimaryKeys,
          ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.tableId),
          targetTechnologyVersion,
        );

        const columns: Column[] = columnCreator.createColumns(enumeration, buildStrategy.columnNamerIgnoresRoleName());
        const foreignKey: ForeignKey = createForeignKey(
          property,
          columns,
          enumeration.referencedEntity.namespace.namespaceName.toLowerCase(),
          enumeration.referencedEntity.namespace,
          enumeration.referencedEntity.data.edfiOdsRelational.odsTableId,
          foreignKeyStrategyFor(enumeration),
        );
        addForeignKey(joinTable, foreignKey);
        addColumnsWithoutSort(joinTable, columns, ColumnTransformPrimaryKey, targetTechnologyVersion);
      }
    },
  };
}

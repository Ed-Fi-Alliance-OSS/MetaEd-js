import { getEntitiesOfTypeForNamespaces, SchoolYearEnumeration } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { addTables } from './TableCreatingEntityEnhancerBase';
import {
  Table,
  newTable,
  newTableNameGroup,
  newTableNameComponent,
  newTableExistenceReason,
  addColumnsWithoutSort,
} from '../../model/database/Table';
import { newColumn, StringColumn, newColumnNameComponent } from '../../model/database/Column';
import { ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { ColumnType } from '../../model/database/ColumnType';

const enhancerName = 'SchoolYearEnumerationTableEnhancer';

function build(_metaEd: MetaEdEnvironment, entity: SchoolYearEnumeration): Table {
  const { namespace, documentation } = entity;
  const table: Table = {
    ...newTable(),
    tableId: 'SchoolYearType',
    nameGroup: {
      ...newTableNameGroup(),
      nameElements: [
        {
          ...newTableNameComponent(),
          name: 'SchoolYearType',
          isDerivedFromEntityMetaEdName: true,
          sourceEntity: entity,
        },
      ],
      sourceEntity: entity,
    },

    existenceReason: {
      ...newTableExistenceReason(),
      isEntityMainTable: true,
      parentEntity: entity,
    },
    namespace,
    schema: namespace.namespaceName.toLowerCase(),
    description: documentation,
    includeCreateDateColumn: true,
    includeLastModifiedDateAndIdColumn: true,
    isAggregateRootTable: true,
  };

  addColumnsWithoutSort(
    table,
    [
      {
        ...newColumn(),
        type: 'short' as ColumnType,
        columnId: 'SchoolYear',
        nameComponents: [{ ...newColumnNameComponent(), name: 'SchoolYear', isSynthetic: true }],
        isPartOfPrimaryKey: true,
        isNullable: false,
        description: 'Key for School Year',
      },
      {
        ...newColumn(),
        type: 'string' as ColumnType,
        maxLength: '50',
        columnId: 'SchoolYearDescription',
        nameComponents: [{ ...newColumnNameComponent(), name: 'SchoolYearDescription', isSynthetic: true }],
        isPartOfPrimaryKey: false,
        isNullable: false,
        description: 'The description for the SchoolYear type.',
      } as StringColumn,
      {
        ...newColumn(),
        type: 'boolean' as ColumnType,
        columnId: 'CurrentSchoolYear',
        nameComponents: [{ ...newColumnNameComponent(), name: 'CurrentSchoolYear', isSynthetic: true }],
        isPartOfPrimaryKey: false,
        isNullable: false,
        description: 'The code for the current school year.',
      },
    ],
    ColumnTransformUnchanged,
  );
  return table;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), 'schoolYearEnumeration').forEach(
    (entity: ModelBase) => {
      const table: Table = build(metaEd, entity as SchoolYearEnumeration);
      entity.data.edfiOdsRelational.odsTables = [table];
      entity.data.edfiOdsRelational.odsEntityTable = table;
      addTables(metaEd, [table]);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}

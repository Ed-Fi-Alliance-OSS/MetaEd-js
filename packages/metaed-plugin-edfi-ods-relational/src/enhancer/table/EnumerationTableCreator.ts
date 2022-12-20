import * as R from 'ramda';
import { MetaEdEnvironment, Enumeration, Descriptor, normalizeEnumerationSuffix } from '@edfi/metaed-core';
import {
  addColumns,
  newTable,
  newTableNameComponent,
  newTableExistenceReason,
  newTableNameGroup,
  Table,
} from '../../model/database/Table';
import { ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { newColumn, newColumnNameComponent, StringColumn } from '../../model/database/Column';
import { ColumnType } from '../../model/database/ColumnType';

const removeTypeSuffix = R.when(R.endsWith('Type'), R.dropLast(4));

export const enumerationTableCreator: {
  build(metaEd: MetaEdEnvironment, entity: Enumeration | Descriptor, documentation: string): Table;
} = {
  // @ts-ignore "metaEd" unused here
  build(metaEd: MetaEdEnvironment, entity: Enumeration | Descriptor, documentation: string): Table {
    const { metaEdName, namespace } = entity;
    const normalizedName = normalizeEnumerationSuffix(metaEdName);
    const table: Table = {
      ...newTable(),
      tableId: normalizedName,
      nameGroup: {
        ...newTableNameGroup(),
        nameElements: [
          {
            ...newTableNameComponent(),
            name: normalizedName,
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
    addColumns(
      table,
      [
        {
          ...newColumn(),
          type: 'integer' as ColumnType,
          columnId: `${normalizedName}Id`,
          nameComponents: [
            { ...newColumnNameComponent(), name: normalizedName, isDerivedFromMetaEdName: true, sourceEntity: entity },
            { ...newColumnNameComponent(), name: 'Id', isSynthetic: true },
          ],
          isIdentityDatabaseType: true,
          isPartOfPrimaryKey: true,
          isNullable: false,
          description: `Key for ${removeTypeSuffix(metaEdName)}`,
        },
        {
          ...newColumn(),
          type: 'string' as ColumnType,
          length: '50',
          columnId: 'CodeValue',
          nameComponents: [{ ...newColumnNameComponent(), name: 'CodeValue', isSynthetic: true }],
          isPartOfPrimaryKey: false,
          isNullable: false,
          description: 'This column is deprecated.',
        } as StringColumn,
        {
          ...newColumn(),
          type: 'string' as ColumnType,
          length: '1024',
          columnId: 'Description',
          nameComponents: [{ ...newColumnNameComponent(), name: 'Description', isSynthetic: true }],
          isPartOfPrimaryKey: false,
          isNullable: false,
          description: `The description for the ${removeTypeSuffix(metaEdName)} type.`,
        } as StringColumn,
        {
          ...newColumn(),
          type: 'string' as ColumnType,
          length: '450',
          columnId: 'ShortDescription',
          nameComponents: [{ ...newColumnNameComponent(), name: 'ShortDescription', isSynthetic: true }],
          isPartOfPrimaryKey: false,
          isNullable: false,
          description: `The value for the ${removeTypeSuffix(metaEdName)} type.`,
        } as StringColumn,
      ],
      ColumnTransformUnchanged,
    );
    return table;
  },
};

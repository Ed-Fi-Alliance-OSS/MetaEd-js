import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  addColumns,
  newTable,
  newTableNameComponent,
  newTableExistenceReason,
  newTableNameGroup,
} from '../../model/database/Table';
import { ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { tableEntities } from '../EnhancerHelper';
import { Table } from '../../model/database/Table';
import { newColumn, StringColumn, newColumnNameComponent } from '../../model/database/Column';
import { ColumnType } from '../../model/database/ColumnType';

// Generate hard coded base descriptor table
const enhancerName = 'BaseDescriptorTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edfiNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (edfiNamespace == null) return { enhancerName, success: false };

  const descriptorTable: Table = {
    ...newTable(),
    tableId: 'Descriptor',
    nameGroup: {
      ...newTableNameGroup(),
      nameElements: [
        {
          ...newTableNameComponent(),
          name: 'Descriptor',
          isSynthetic: true,
        },
      ],
      isSynthetic: true,
    },

    existenceReason: {
      ...newTableExistenceReason(),
      isSynthetic: true,
      isBaseDescriptor: true,
    },
    namespace: edfiNamespace,
    schema: edfiNamespace.namespaceName.toLowerCase(),
    description: 'This is the base entity for the descriptor pattern.',
    includeCreateDateColumn: true,
    includeLastModifiedDateAndIdColumn: true,
    isAggregateRootTable: true,
  };

  addColumns(
    descriptorTable,
    [
      {
        ...newColumn(),
        type: 'integer' as ColumnType,
        isNullable: false,
        isPartOfPrimaryKey: true,
        columnId: 'DescriptorId',
        nameComponents: [{ ...newColumnNameComponent(), name: 'DescriptorId', isSynthetic: true }],
        isIdentityDatabaseType: true,
        description:
          'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
      },
      {
        ...newColumn(),
        type: 'string' as ColumnType,
        length: '255',
        isNullable: false,
        isPartOfPrimaryKey: false,
        isPartOfAlternateKey: true,
        columnId: 'Namespace',
        nameComponents: [{ ...newColumnNameComponent(), name: 'Namespace', isSynthetic: true }],
        description:
          'A globally unique namespace that identifies this descriptor set. Author is strongly encouraged to use the Universal Resource Identifier (http, ftp, file, etc.) for the source of the descriptor definition. Best practice is for this source to be the descriptor file itself, so that it can be machine-readable and be fetched in real-time, if necessary.',
      } as StringColumn,
      {
        ...newColumn(),
        type: 'string' as ColumnType,
        length: '50',
        isNullable: false,
        isPartOfPrimaryKey: false,
        isPartOfAlternateKey: true,
        columnId: 'CodeValue',
        nameComponents: [{ ...newColumnNameComponent(), name: 'CodeValue', isSynthetic: true }],
        description: 'A code or abbreviation that is used to refer to the descriptor.',
      } as StringColumn,
      {
        ...newColumn(),
        type: 'string' as ColumnType,
        length: '75',
        isNullable: false,
        isPartOfPrimaryKey: false,
        columnId: 'ShortDescription',
        nameComponents: [{ ...newColumnNameComponent(), name: 'ShortDescription', isSynthetic: true }],
        description: 'A shortened description for the descriptor.',
      } as StringColumn,
      {
        ...newColumn(),
        type: 'string' as ColumnType,
        length: '1024',
        isNullable: true,
        isPartOfPrimaryKey: false,
        columnId: 'Description',
        nameComponents: [{ ...newColumnNameComponent(), name: 'Description', isSynthetic: true }],
        description: 'The description of the descriptor.',
      } as StringColumn,
      {
        ...newColumn(),
        type: 'integer' as ColumnType,
        isNullable: true,
        isPartOfPrimaryKey: false,
        columnId: 'PriorDescriptorId',
        nameComponents: [{ ...newColumnNameComponent(), name: 'PriorDescriptorId', isSynthetic: true }],
        description:
          'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
      },
      {
        ...newColumn(),
        type: 'date' as ColumnType,
        isNullable: true,
        isPartOfPrimaryKey: false,
        columnId: 'EffectiveBeginDate',
        nameComponents: [{ ...newColumnNameComponent(), name: 'EffectiveBeginDate', isSynthetic: true }],
        description:
          'The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.',
      },
      {
        ...newColumn(),
        type: 'date' as ColumnType,
        isNullable: true,
        isPartOfPrimaryKey: false,
        columnId: 'EffectiveEndDate',
        nameComponents: [{ ...newColumnNameComponent(), name: 'EffectiveEndDate', isSynthetic: true }],
        description: 'The end date of the period when the descriptor is in effect.',
      },
    ],
    ColumnTransformUnchanged,
  );

  tableEntities(metaEd, edfiNamespace).set(descriptorTable.tableId, descriptorTable);

  return {
    enhancerName,
    success: true,
  };
}

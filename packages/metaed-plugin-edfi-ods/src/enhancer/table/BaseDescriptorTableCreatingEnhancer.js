// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { addColumns, newTable } from '../../model/database/Table';
import { ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { newDateColumn, newIntegerColumn, newStringColumn } from '../../model/database/Column';
import { pluginEnvironment } from '../EnhancerHelper';
import type { EdFiOdsEntityRepository } from '../../model/EdFiOdsEntityRepository';
import type { Table } from '../../model/database/Table';

 // Generate hard coded base descriptor table
const enhancerName: string = 'BaseDescriptorTableCreatingEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edFiOdsEntityRepository: EdFiOdsEntityRepository = pluginEnvironment(metaEd).entity;

  const descriptorTable: Table = Object.assign(newTable(), {
    name: 'Descriptor',
    schema: 'edfi',
    description: 'This is the base entity for the descriptor pattern.',
    includeCreateDateColumn: true,
    includeLastModifiedDateAndIdColumn: true,
  });

  addColumns(descriptorTable, [
    Object.assign(newIntegerColumn(), {
      isNullable: false,
      isPartOfPrimaryKey: true,
      name: 'DescriptorId',
      isIdentityDatabaseType: true,
      description: 'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    }),
    Object.assign(newStringColumn('255'), {
      isNullable: false,
      isPartOfPrimaryKey: false,
      isPartOfAlternateKey: true,
      name: 'Namespace',
      description: 'A globally unique namespace that identifies this descriptor set. Author is strongly encouraged to use the Universal Resource Identifier (http, ftp, file, etc.) for the source of the descriptor definition. Best practice is for this source to be the descriptor file itself, so that it can be machine-readable and be fetched in real-time, if necessary.',
    }),
    Object.assign(newStringColumn('50'), {
      isNullable: false,
      isPartOfPrimaryKey: false,
      isPartOfAlternateKey: true,
      name: 'CodeValue',
      description: 'A code or abbreviation that is used to refer to the descriptor.',
    }),
    Object.assign(newStringColumn('75'), {
      isNullable: false,
      isPartOfPrimaryKey: false,
      name: 'ShortDescription',
      description: 'A shortened description for the descriptor.',
    }),
    Object.assign(newStringColumn('1024'), {
      isNullable: true,
      isPartOfPrimaryKey: false,
      name: 'Description',
      description: 'The description of the descriptor.',
    }),
    Object.assign(newIntegerColumn(), {
      isNullable: true,
      isPartOfPrimaryKey: false,
      name: 'PriorDescriptorId',
      description: 'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    }),
    Object.assign(newDateColumn(), {
      isNullable: true,
      isPartOfPrimaryKey: false,
      name: 'EffectiveBeginDate',
      description: 'The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.',
    }),
    Object.assign(newDateColumn(), {
      isNullable: true,
      isPartOfPrimaryKey: false,
      name: 'EffectiveEndDate',
      description: 'The end date of the period when the descriptor is in effect.',
    }),
  ], ColumnTransformUnchanged);

  edFiOdsEntityRepository.table.set(descriptorTable.name, descriptorTable);

  return {
    enhancerName,
    success: true,
  };
}

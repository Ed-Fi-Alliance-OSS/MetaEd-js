// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPlugin } from '@edfi/metaed-core';
import { enhancerList } from './enhancer/EnhancerList';
import { validate as blockPropertiesNamedDiscriminator } from './validator/BlockPropertiesNamedDiscriminator';

// Entities
export {
  Column,
  DecimalColumn,
  StringColumn,
  NoColumn,
  ColumnNameComponent,
  newColumn,
  newColumnNameComponent,
} from './model/database/Column';
export { ColumnPair, newColumnPair } from './model/database/ColumnPair';
export { ColumnType } from './model/database/ColumnType';
export { EnumerationRow } from './model/database/EnumerationRow';
export { EnumerationRowBase } from './model/database/EnumerationRowBase';
export {
  ForeignKey,
  ForeignKeySourceReference,
  newForeignKey,
  newForeignKeySourceReference,
  getForeignTableColumns,
  getForeignTableColumnIds,
  getParentTableColumnIds,
  getParentTableColumns,
} from './model/database/ForeignKey';
export { SchoolYearEnumerationRow } from './model/database/SchoolYearEnumerationRow';
export { ColumnConflictPair } from './model/database/ColumnConflictPair';
export {
  Table,
  NoTable,
  TableExistenceReason,
  TableNameComponent,
  TableNameElement,
  TableNameGroup,
  getPrimaryKeys,
  getNonPrimaryKeys,
  isTableNameGroup,
  isTableNameComponent,
  newTableNameComponent,
  newTableNameGroup,
  newTableExistenceReason,
  newTable,
  NoTableExistenceReason,
  NoTableNameGroup,
} from './model/database/Table';
export { flattenNameComponentsFromGroup, simpleTableNameGroupConcat } from './model/database/TableNameGroupHelper';
export { TopLevelEntityEdfiOds } from './model/TopLevelEntity';
export { DescriptorEdfiOds } from './model/Descriptor';
export { ReferencePropertyEdfiOds } from './model/property/ReferenceProperty';

export {
  EdFiOdsRelationalEntityRepository,
  newEdFiOdsRelationalEntityRepository,
  addEdFiOdsRelationalEntityRepositoryTo,
  enhance as initializeEdFiOdsRelationalEntityRepository,
} from './model/EdFiOdsRelationalEntityRepository';

export { edfiOdsRepositoryForNamespace, tableEntities, tableEntity, rowEntities } from './enhancer/EnhancerHelper';

export {
  prependRoleNameToMetaEdName,
  escapeSqlSingleQuote,
  appendOverlapCollapsing,
  simpleTableNameGroupCollapse,
  constructCollapsedNameFrom,
  shouldApplyLicenseHeader,
} from './shared/Utility';

// Enhancer for testing
export { enhance as baseDescriptorTableCreatingEnhancer } from './enhancer/table/BaseDescriptorTableEnhancer';

export function initialize(): MetaEdPlugin {
  return {
    validator: [blockPropertiesNamedDiscriminator],
    enhancer: enhancerList(),
    generator: [],
    shortName: 'edfiOdsRelational',
  };
}

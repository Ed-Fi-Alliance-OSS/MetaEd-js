// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  asReferentialProperty,
  asTopLevelEntity,
  getEntitiesOfTypeForNamespaces,
  versionSatisfies,
  NoNamespace,
  V3OrGreater,
  targetTechnologyVersionFor,
  SemVer,
  MetaEdPropertyPath,
} from '@edfi/metaed-core';
import { EnhancerResult, EntityProperty, MetaEdEnvironment, ModelBase, TopLevelEntity } from '@edfi/metaed-core';
import { addTables } from './TableCreatingEntityEnhancerBase';
import { BuildStrategyDefault } from './BuildStrategy';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import {
  newTable,
  newTableNameComponent,
  newTableExistenceReason,
  newTableNameGroup,
  NoTableNameGroup,
} from '../../model/database/Table';
import { TableStrategy } from '../../model/database/TableStrategy';
import { isOdsReferenceProperty } from '../../model/property/ReferenceProperty';
import { Column, columnSortV7 } from '../../model/database/Column';
import { Table } from '../../model/database/Table';
import { buildTableFor } from './TableBuilder';

const enhancerName = 'DomainEntityExtensionTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, V3OrGreater)) return { enhancerName, success: true };
  const targetTechnologyVersion: SemVer = targetTechnologyVersionFor('edfiOdsRelational', metaEd);

  getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), 'domainEntityExtension')
    .map((x: ModelBase) => asTopLevelEntity(x))
    .forEach((entity: TopLevelEntity) => {
      const tables: Table[] = [];
      const mainTable: Table = {
        ...newTable(),
        namespace: entity.namespace,
        schema: entity.namespace.namespaceName.toLowerCase(),
        tableId: entity.metaEdName + entity.namespace.extensionEntitySuffix,
        nameGroup: {
          ...newTableNameGroup(),
          nameElements: [
            {
              ...newTableNameComponent(),
              name: entity.metaEdName,
              isEntityMetaEdName: true,
              sourceEntity: entity,
            },
            {
              ...newTableNameComponent(),
              name: entity.namespace.extensionEntitySuffix,
              isExtensionSuffix: true,
            },
          ],
          sourceEntity: entity,
        },

        existenceReason: {
          ...newTableExistenceReason(),
          isExtensionTable: true,
          parentEntity: entity,
        },
        description: entity.documentation,
        parentEntity: entity,
        // METAED-764: API requires extension tables to have CreateDate column
        includeCreateDateColumn: true,
        hideFromApiMetadata: true,
      };

      // don't add table unless the extension table will have columns that are not just the fk to the base table
      if (
        entity.data.edfiOdsRelational.odsProperties.some(
          (property: EntityProperty) =>
            !property.data.edfiOdsRelational.odsIsCollection &&
            property.type !== 'common' &&
            (!isOdsReferenceProperty(property) || asReferentialProperty(property).referencedEntity !== entity.baseEntity),
        )
      ) {
        tables.push(mainTable);
      }

      const primaryKeys: Column[] = collectPrimaryKeys(
        entity,
        entity,
        BuildStrategyDefault,
        '' as MetaEdPropertyPath,
        targetTechnologyVersion,
      );

      entity.data.edfiOdsRelational.odsProperties.forEach((property: EntityProperty) => {
        const tableStrategy: TableStrategy = TableStrategy.extension(
          mainTable,
          entity.baseEntity != null ? entity.baseEntity.namespace.namespaceName.toLowerCase() : '',
          entity.baseEntity != null ? entity.baseEntity.namespace : NoNamespace,
          entity.baseEntity != null ? entity.baseEntity.data.edfiOdsRelational.odsTableId : '',
          entity.baseEntity != null
            ? {
                ...newTableNameGroup(),
                nameElements: [
                  {
                    ...newTableNameComponent(),
                    name: entity.baseEntity.data.edfiOdsRelational.odsTableId,
                    isParentTableName: true,
                    sourceEntity: entity.baseEntity,
                  },
                ],
                sourceProperty: property,
              }
            : NoTableNameGroup,
        );

        buildTableFor({
          originalEntity: entity,
          property,
          parentTableStrategy: tableStrategy,
          parentPrimaryKeys: primaryKeys,
          buildStrategy: BuildStrategyDefault,
          tables,
          targetTechnologyVersion,
          parentIsRequired: null,
          currentPropertyPath: property.fullPropertyName as MetaEdPropertyPath,
        });
      });

      // For ODS/API 7.0+, we need to correct column sort order after iterating over odsProperties in MetaEd model order
      if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
        columnSortV7(mainTable, []);
      }

      entity.data.edfiOdsRelational.odsTables = tables;
      addTables(metaEd, tables);
    });

  return {
    enhancerName,
    success: true,
  };
}

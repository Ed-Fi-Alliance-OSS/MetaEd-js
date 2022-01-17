import {
  asReferentialProperty,
  asTopLevelEntity,
  getEntitiesOfTypeForNamespaces,
  versionSatisfies,
  NoNamespace,
} from '@edfi/metaed-core';
import { EnhancerResult, EntityProperty, MetaEdEnvironment, ModelBase, TopLevelEntity } from '@edfi/metaed-core';
import { addTables } from './TableCreatingEntityEnhancerBase';
import { BuildStrategyDefault } from './BuildStrategy';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { columnCreatorFactory } from './ColumnCreatorFactory';
import {
  newTable,
  newTableNameComponent,
  newTableExistenceReason,
  newTableNameGroup,
  NoTableNameGroup,
} from '../../model/database/Table';
import { tableBuilderFactory } from './TableBuilderFactory';
import { TableStrategy } from '../../model/database/TableStrategy';
import { isOdsReferenceProperty } from '../../model/property/ReferenceProperty';
import { Column } from '../../model/database/Column';
import { Table } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';

const enhancerName = 'DomainEntityExtensionTableEnhancerV2';
const targetVersions = '2.x';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

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
        },

        existenceReason: {
          ...newTableExistenceReason(),
          isExtensionTable: true,
          parentEntity: entity,
        },
        description: entity.documentation,
        parentEntity: entity,
        hideFromApiMetadata: true,
      };

      // don't add table unless the extension table will have columns that are not just the fk to the base table
      if (
        entity.data.edfiOdsRelational.odsProperties.some(
          (property: EntityProperty) =>
            !property.data.edfiOdsRelational.odsIsCollection &&
            (!isOdsReferenceProperty(property) || asReferentialProperty(property).referencedEntity !== entity.baseEntity),
        )
      ) {
        tables.push(mainTable);
      }

      const primaryKeys: Column[] = collectPrimaryKeys(entity, BuildStrategyDefault, columnCreatorFactory);

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
        const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(property);
        tableBuilder.buildTables(property, tableStrategy, primaryKeys, BuildStrategyDefault, tables, null);
      });

      entity.data.edfiOdsRelational.odsTables = tables;
      addTables(metaEd, tables);
    });

  return {
    enhancerName,
    success: true,
  };
}

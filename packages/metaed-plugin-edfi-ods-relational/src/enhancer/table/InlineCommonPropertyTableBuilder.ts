import { EntityProperty, ReferentialProperty } from '@edfi/metaed-core';
import { asReferentialProperty } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { Table } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';
import { TableBuilderFactory } from './TableBuilderFactory';
import { TableStrategy } from '../../model/database/TableStrategy';

export function inlineCommonPropertyTableBuilder(factory: TableBuilderFactory): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Column[],
      buildStrategy: BuildStrategy,
      tables: Table[],
      // @ts-ignore
      parentIsRequired: boolean | null,
    ): void {
      const inlineCommonProperty: ReferentialProperty = asReferentialProperty(property);

      let strategy: BuildStrategy = buildStrategy.appendParentContextProperty(inlineCommonProperty);
      if (inlineCommonProperty.isOptional) {
        strategy = strategy.makeLeafColumnsNullable();
      }

      inlineCommonProperty.referencedEntity.data.edfiOdsRelational.odsProperties.forEach((odsProperty: EntityProperty) => {
        const tableBuilder: TableBuilder = factory.tableBuilderFor(odsProperty);
        tableBuilder.buildTables(
          odsProperty,
          parentTableStrategy,
          parentPrimaryKeys,
          strategy,
          tables,
          inlineCommonProperty.isRequired,
        );
      });
    },
  };
}

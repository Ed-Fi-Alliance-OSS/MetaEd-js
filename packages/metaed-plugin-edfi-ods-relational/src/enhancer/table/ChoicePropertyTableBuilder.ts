import { EntityProperty, MergeDirective, ReferentialProperty } from '@edfi/metaed-core';
import { asReferentialProperty } from '@edfi/metaed-core';
import { cloneColumn } from '../../model/database/Column';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { Table } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';
import { TableBuilderFactory } from './TableBuilderFactory';
import { TableStrategy } from '../../model/database/TableStrategy';

export function choicePropertyTableBuilder(factory: TableBuilderFactory): TableBuilder {
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
      const choice: ReferentialProperty = asReferentialProperty(property);
      let strategy: BuildStrategy = buildStrategy;

      if (choice.mergeDirectives.length > 0) {
        strategy = strategy.skipPath(
          choice.mergeDirectives.map((x: MergeDirective) => x.sourcePropertyPathStrings.slice(1)),
        );
      }

      choice.referencedEntity.data.edfiOdsRelational.odsProperties.forEach((odsProperty: EntityProperty) => {
        const tableBuilder: TableBuilder = factory.tableBuilderFor(odsProperty);

        tableBuilder.buildTables(
          odsProperty,
          parentTableStrategy,
          parentPrimaryKeys.map((pk) => cloneColumn(pk)),
          strategy.makeLeafColumnsNullable(),
          tables,
          choice.isRequired,
        );
      });
    },
  };
}

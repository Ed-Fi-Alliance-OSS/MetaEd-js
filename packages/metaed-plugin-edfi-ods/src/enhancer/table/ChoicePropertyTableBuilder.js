// @flow
import type { EntityProperty, MergedProperty, ReferentialProperty } from 'metaed-core';
import { asReferentialProperty } from 'metaed-core';
import { cloneColumn } from '../../model/database/Column';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { Table } from '../../model/database/Table';
import type { TableBuilder } from './TableBuilder';
import type { TableBuilderFactory } from './TableBuilderFactory';
import type { TableStrategy } from '../../model/database/TableStrategy';

export function choicePropertyTableBuilder(factory: TableBuilderFactory): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Array<Column>,
      buildStrategy: BuildStrategy,
      tables: Array<Table>,
      // eslint-disable-next-line no-unused-vars
      parentIsRequired: ?boolean,
    ): void {
      const choice: ReferentialProperty = asReferentialProperty(property);
      let strategy: BuildStrategy = buildStrategy;

      if (choice.mergedProperties.length > 0) {
        strategy = buildStrategy.skipPath(choice.mergedProperties.map((x: MergedProperty) => x.mergePropertyPath.slice(1)));
      }

      choice.referencedEntity.data.edfiOds.ods_Properties.forEach((odsProperty: EntityProperty) => {
        const tableBuilder: TableBuilder = factory.tableBuilderFor(odsProperty);

        tableBuilder.buildTables(
          odsProperty,
          parentTableStrategy,
          parentPrimaryKeys.map(pk => cloneColumn(pk)),
          strategy.makeLeafColumnsNullable(),
          tables,
          choice.isRequired,
        );
      });
    },
  };
}

// @flow
import type { EntityProperty, ReferentialProperty } from 'metaed-core';
import { asReferentialProperty } from 'metaed-core';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { Table } from '../../model/database/Table';
import type { TableBuilder } from './TableBuilder';
import type { TableBuilderFactory } from './TableBuilderFactory';
import type { TableStrategy } from '../../model/database/TableStrategy';

export function inlineCommonPropertyTableBuilder(factory: TableBuilderFactory): TableBuilder {
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
      const inlineCommonProperty: ReferentialProperty = asReferentialProperty(property);

      let strategy: BuildStrategy = buildStrategy.appendInlineContext(inlineCommonProperty.data.edfiOds.ods_ContextPrefix);
      if (inlineCommonProperty.isOptional) { strategy = strategy.makeLeafColumnsNullable(); }

      inlineCommonProperty.referencedEntity.data.edfiOds.ods_Properties.forEach((odsProperty: EntityProperty) => {
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

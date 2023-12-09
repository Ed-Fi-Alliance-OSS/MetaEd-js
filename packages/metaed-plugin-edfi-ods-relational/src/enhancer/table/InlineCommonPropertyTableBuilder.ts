import { EntityProperty, ReferentialProperty, SemVer } from '@edfi/metaed-core';
import { asReferentialProperty } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { Table } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';
import { TableStrategy } from '../../model/database/TableStrategy';
import { tableBuilderFor } from './TableBuilderFactory';

export function inlineCommonPropertyTableBuilder(): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Column[],
      buildStrategy: BuildStrategy,
      tables: Table[],
      targetTechnologyVersion: SemVer,
      _parentIsRequired: boolean | null,
    ): void {
      const inlineCommonProperty: ReferentialProperty = asReferentialProperty(property);

      let strategy: BuildStrategy = buildStrategy.appendParentContextProperty(inlineCommonProperty);
      if (inlineCommonProperty.isOptional) {
        strategy = strategy.makeLeafColumnsNullable();
      }

      inlineCommonProperty.referencedEntity.data.edfiOdsRelational.odsProperties.forEach((odsProperty: EntityProperty) => {
        tableBuilderFor(odsProperty).buildTables(
          odsProperty,
          parentTableStrategy,
          parentPrimaryKeys,
          strategy,
          tables,
          targetTechnologyVersion,
          inlineCommonProperty.isRequired,
        );
      });
    },
  };
}

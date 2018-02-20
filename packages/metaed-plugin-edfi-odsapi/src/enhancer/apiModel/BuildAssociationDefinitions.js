// @flow
import R from 'ramda';
import type { Table, Column, ForeignKey, ColumnNamePair } from 'metaed-plugin-edfi-ods';
import type { Aggregate } from '../../model/domainMetadata/Aggregate';
import type { EntityTable } from '../../model/domainMetadata/EntityTable';
import type { AssociationDefinition, AssociationDefinitionCardinality } from '../../model/apiModel/AssociationDefinition';
import type { ApiProperty } from '../../model/apiModel/ApiProperty';
import { buildApiProperty } from './BuildApiProperty';

function findAggregateWithEntity(
  aggregates: Array<Aggregate>,
  entityTableSchema: string,
  entityTableName: string,
): ?Aggregate {
  const aggregatesWithEntityTable: Array<Aggregate> = aggregates.reduce(
    (result: Array<Aggregate>, currentAggregate: Aggregate) => {
      const inThisAggregate: boolean = currentAggregate.entityTables.some(
        (e: EntityTable) => e.schema === entityTableSchema && e.table === entityTableName,
      );
      return inThisAggregate ? result.concat(currentAggregate) : result;
    },
    [],
  );
  return aggregatesWithEntityTable.length === 1 ? aggregatesWithEntityTable[0] : null;
}

function cardinalityFrom(
  isIdentifying: boolean,
  foreignKey: ForeignKey,
  tables: Map<string, Table>,
  domainMetadataAggregatesForNamespace: Array<Aggregate>,
): AssociationDefinitionCardinality {
  if (foreignKey.sourceReference.isSubclassRelationship) return 'OneToOneInheritance';
  if (foreignKey.sourceReference.isExtensionRelationship) return 'OneToOneExtension';

  const parentTable = tables.get(foreignKey.parentTableName);
  if (parentTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.parentTableName}'.`);
  const foreignTable = tables.get(foreignKey.foreignTableName);
  if (foreignTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.foreignTableName}'.`);

  // this is what the if statement in the C# code had: count of PK columns on both sides are
  // equal -- this feels like too weak a constraint
  if (isIdentifying && parentTable.primaryKeys.length === foreignTable.primaryKeys.length) return 'OneToOne';

  // OneToOneOrMore is based on the "isRequiredCollection" flag in DomainMetadata, when the foreign key is the
  // back reference from an aggregate dependent table to either the root table or an intermediate dependent table
  const rootAggregate: ?Aggregate = findAggregateWithEntity(
    domainMetadataAggregatesForNamespace,
    foreignKey.foreignTableSchema,
    foreignKey.foreignTableName,
  );
  if (rootAggregate == null) return 'OneToZeroOrMore';

  const childEntitySearch: Array<EntityTable> = rootAggregate.entityTables.filter(
    (et: EntityTable) => et.table === foreignKey.parentTableName && et.schema === foreignKey.parentTableSchema,
  );
  if (childEntitySearch.length !== 1) return 'OneToZeroOrMore';
  if (childEntitySearch[0].isRequiredCollection) return 'OneToOneOrMore';
  return 'OneToZeroOrMore';
}

// "primary" entity is actually the foreign table, "properties" are columns
function getPrimaryEntityProperties(
  foreignKey: ForeignKey,
  tables: Map<string, Table>,
  isIdentifying: boolean,
): Array<ApiProperty> {
  const table = tables.get(foreignKey.foreignTableName);
  if (table == null) throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.foreignTableName}'.`);

  const properties: Array<ApiProperty> = table.columns
    .filter(c => foreignKey.foreignTableColumnNames.includes(c.name))
    .map(c => ({ ...buildApiProperty(c), isIdentifying }));

  return R.sortBy(R.compose(R.toLower, R.prop('propertyName')), properties);
}

// Override the typical isServerAssigned - it's true iff it's from a 1-1 or 1-1 inheritance relation and the matching
// column on the other side of the FK is server assigned.
function buildApiPropertyWithServerAssignedOverride(
  column: Column,
  foreignKey: ForeignKey,
  tables: Map<string, Table>,
  isIdentifying: boolean,
  domainMetadataAggregatesForNamespace: Array<Aggregate>,
): ApiProperty {
  const result: ApiProperty = { ...buildApiProperty(column), isIdentifying };
  const associationDefinitionCardinality: AssociationDefinitionCardinality = cardinalityFrom(
    isIdentifying,
    foreignKey,
    tables,
    domainMetadataAggregatesForNamespace,
  );
  if (
    associationDefinitionCardinality === 'OneToOne' ||
    associationDefinitionCardinality === 'OneToOneInheritance' ||
    associationDefinitionCardinality === 'OneToOneExtension'
  ) {
    const otherTable = tables.get(foreignKey.foreignTableName);
    if (otherTable == null)
      throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.foreignTableName}'.`);
    const columnNamePair: ColumnNamePair = foreignKey.columnNames.filter(
      (cnp: ColumnNamePair) => cnp.parentTableColumnName === column.name,
    )[0];
    const otherColumn: Column = otherTable.columns.filter(
      (c: Column) => c.name === columnNamePair.foreignTableColumnName,
    )[0];
    return { ...result, isServerAssigned: otherColumn.isIdentityDatabaseType };
  }
  return result;
}

// "secondary" entity is actually the parent table, "properties" are columns
function getSecondaryEntityProperties(
  foreignKey: ForeignKey,
  tables: Map<string, Table>,
  isIdentifying: boolean,
  domainMetadataAggregatesForNamespace: Array<Aggregate>,
): Array<ApiProperty> {
  const table = tables.get(foreignKey.parentTableName);
  if (table == null) throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.parentTableName}'.`);

  const properties: Array<ApiProperty> = table.columns
    .filter((c: Column) => foreignKey.parentTableColumnNames.includes(c.name))
    .map((c: Column) =>
      buildApiPropertyWithServerAssignedOverride(c, foreignKey, tables, isIdentifying, domainMetadataAggregatesForNamespace),
    );

  return R.sortBy(R.compose(R.toLower, R.prop('propertyName')), properties);
}

// For some reason, this is where all of the source columns in the foreign key are part of the PK
function isIdentifyingForeignKey(foreignKey: ForeignKey, tables: Map<string, Table>): boolean {
  const parentTable = tables.get(foreignKey.parentTableName);
  if (parentTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.parentTableName}'.`);
  const primaryKeyColumnNames: Array<string> = parentTable.primaryKeys.map((c: Column) => c.name);

  return foreignKey.parentTableColumnNames.every(foreignKeyColumnName =>
    primaryKeyColumnNames.includes(foreignKeyColumnName),
  );
}

function isRequiredFrom(
  cardinality: AssociationDefinitionCardinality,
  foreignKey: ForeignKey,
  tables: Map<string, Table>,
): boolean {
  if (cardinality === 'OneToOneInheritance' || cardinality === 'OneToOneExtension' || cardinality === 'OneToOne')
    return true;

  const parentTable = tables.get(foreignKey.parentTableName);
  if (parentTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.parentTableName}'.`);
  const parentTableForeignKeyColumns: Array<Column> = parentTable.columns.filter((c: Column) =>
    foreignKey.parentTableColumnNames.includes(c.name),
  );
  return parentTableForeignKeyColumns.every((c: Column) => !c.isNullable);
}

// Association definitions are the ODS foreign key definitions for a namespace
export function buildAssociationDefinitions(
  tables: Map<string, Table>,
  domainMetadataAggregatesForNamespace: Array<Aggregate>,
): Array<AssociationDefinition> {
  const result: Array<AssociationDefinition> = [];
  Array.from(tables.values()).forEach((table: Table) => {
    table.foreignKeys.forEach((foreignKey: ForeignKey) => {
      const isIdentifying: boolean = isIdentifyingForeignKey(foreignKey, tables);
      const cardinality: AssociationDefinitionCardinality = cardinalityFrom(
        isIdentifying,
        foreignKey,
        tables,
        domainMetadataAggregatesForNamespace,
      );
      const isRequired: boolean = isRequiredFrom(cardinality, foreignKey, tables);
      result.push({
        fullName: {
          schema: table.schema,
          name: foreignKey.name,
        },
        cardinality,
        primaryEntityFullName: {
          schema: foreignKey.foreignTableSchema,
          name: foreignKey.foreignTableName,
        },
        primaryEntityProperties: getPrimaryEntityProperties(foreignKey, tables, isIdentifying),
        secondaryEntityFullName: {
          schema: foreignKey.parentTableSchema,
          name: foreignKey.parentTableName,
        },
        secondaryEntityProperties: getSecondaryEntityProperties(
          foreignKey,
          tables,
          isIdentifying,
          domainMetadataAggregatesForNamespace,
        ),
        isIdentifying,
        isRequired,
      });
    });
  });

  return R.sortBy(R.compose(R.toLower, R.path(['fullName', 'name'])), result);
}

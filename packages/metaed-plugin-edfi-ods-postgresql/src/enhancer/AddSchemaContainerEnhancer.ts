import R from 'ramda';
import { orderByPath, orderByProp, MetaEdEnvironment, EnhancerResult, Namespace } from 'metaed-core';
import { tableEntities, rowEntities, EnumerationRowBase, ForeignKey, Table } from 'metaed-plugin-edfi-ods-relational';

const enhancerName = 'AddSchemaContainerEnhancer';

export const orderRows = R.sortBy(
  R.compose(
    R.toLower,
    R.join(''),
    R.props(['name', 'description']),
  ),
);

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const rows: EnumerationRowBase[] = Array.from(rowEntities(metaEd, namespace).values()).filter(
      (row: EnumerationRowBase) => row.namespace === namespace.namespaceName,
    );
    const tables: Table[] = orderByPath(['data', 'edfiOdsPostgresql', 'collapsedNameForOrderingOnly'])(
      Array.from(tableEntities(metaEd, namespace).values()).filter(
        (table: Table) => table.schema === namespace.namespaceName.toLowerCase(),
      ),
    );
    const foreignKeys: ForeignKey[] = R.chain(table => table.foreignKeys)(tables);
    const enumerationRows: EnumerationRowBase[] = orderRows(
      rows.filter((row: EnumerationRowBase) => row.type === 'enumerationRow'),
    );
    const schoolYearEnumerationRows: EnumerationRowBase[] = orderByProp('name')(
      rows.filter((row: EnumerationRowBase) => row.type === 'schoolYearEnumerationRow'),
    );

    Object.assign(namespace.data.edfiOdsPostgresql.odsSchema, {
      tables,
      foreignKeys,
      enumerationRows,
      schoolYearEnumerationRows,
    });
  });

  return {
    enhancerName,
    success: true,
  };
}

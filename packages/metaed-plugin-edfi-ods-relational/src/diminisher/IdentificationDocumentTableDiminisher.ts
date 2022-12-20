import * as R from 'ramda';
import { getEntitiesOfTypeForNamespaces, versionSatisfies } from '@edfi/metaed-core';
import { ModelBase, EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Table, newTableNameGroup, newTableNameComponent } from '../model/database/Table';

// METAED-118
// Adjusting name for any tables with an IdentificationDocument suffix
// to remove anything between the domain entity name and the IdentificationDocument fragment
const enhancerName = 'IdentificationDocumentTableDiminisher';
const targetVersions = '2.x';

const identificationDocument = 'IdentificationDocument';

function renameIdentificationDocumentTables(coreNamespace: Namespace, tablesForCoreNamespace: Map<string, Table>): void {
  getEntitiesOfTypeForNamespaces([coreNamespace], 'domainEntity').forEach((entity: ModelBase) => {
    const identificationDocumentTableNames: string[] = entity.data.edfiOdsRelational.odsTables.reduce(
      (names: string[], table: Table) => {
        if (
          table.tableId.startsWith(entity.metaEdName) &&
          table.tableId.endsWith(identificationDocument) &&
          table.tableId !== entity.metaEdName + identificationDocument
        )
          return names.concat(table.tableId);
        return names;
      },
      [],
    );
    if (identificationDocumentTableNames.length === 0) return;

    // only the first table survives, with a shortened name
    // note: this may not be stable as it relies on ordering when there are multiple identification document tables
    const table: Table | undefined = tablesForCoreNamespace.get(R.head(identificationDocumentTableNames));
    if (table == null) return;
    const adjustedTableName = entity.metaEdName + identificationDocument;
    table.tableId = adjustedTableName;
    tablesForCoreNamespace.set(table.tableId, table);
    table.nameGroup = {
      ...newTableNameGroup(),
      nameElements: [
        {
          ...newTableNameComponent(),
          name: adjustedTableName,
          isSynthetic: true,
        },
      ],
      sourceEntity: table.parentEntity,
    };

    // remove from domain entity table list and repository
    identificationDocumentTableNames.forEach((identificationDocumentTableName: string) => {
      entity.data.edfiOdsRelational.odsTables = R.reject((x: Table) => x.tableId === identificationDocumentTableName)(
        entity.data.edfiOdsRelational.odsTables,
      );

      tablesForCoreNamespace.delete(identificationDocumentTableName);
    });
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  renameIdentificationDocumentTables(coreNamespace, tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}

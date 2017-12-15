// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getForeignKeys } from '../model/database/Table';
import { getTable } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Table } from '../model/database/Table';

// METAED-258
// MetaEd declares cascading updates at the entity level
// MetaEd uses a deterministic graph algorithm to break circular references from cascading declarations
// Existing core follows no pattern on breaking references, so this diminisher matches it
const enhancerName: string = 'ModifyCascadingUpdatesDefinitionsDiminisher';
const targetVersions: string = '2.0.x';

const modifyCascadingUpdates = (repository: EdFiOdsEntityRepository) =>
  (parentTableName: string, foreignTableName: string, withUpdateCascade: boolean = false): void => {
    const table: ?Table = getTable(repository, parentTableName);
    if (table == null) return;

    const foreignKey: ?ForeignKey = getForeignKeys(table).find((x: ForeignKey) => x.foreignTableName === foreignTableName);
    if (foreignKey == null) return;
    foreignKey.withUpdateCascade = withUpdateCascade;
  };

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  const modifyCascadingUpdatesFor = modifyCascadingUpdates(pluginEnvironment(metaEd).entity);
  modifyCascadingUpdatesFor('CourseOfferingCurriculumUsed', 'CourseOffering');
  modifyCascadingUpdatesFor('Section', 'CourseOffering');
  modifyCascadingUpdatesFor('StudentSectionAssociation', 'Section');
  modifyCascadingUpdatesFor('StudentGradebookEntry', 'StudentSectionAssociation', true);
  modifyCascadingUpdatesFor('TermDescriptor', 'TermType', true);

  return {
    enhancerName,
    success: true,
  };
}

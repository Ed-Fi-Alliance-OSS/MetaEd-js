// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getTable } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { Table } from '../model/database/Table';

// METAED-249
// EdFi ODS 2.0 missing StartTime from primary key of InterventionMeetingTime
const enhancerName: string = 'RemoveStartTimeFromPkOfInterventionMeetingTimeDiminisher';
const targetVersions: string = '2.0.x';

const interventionMeetingTime: string = 'InterventionMeetingTime';
const startTime: string = 'StartTime';

function modifyStartTimeColumnOnInterventionMeetingTimeTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, interventionMeetingTime);
  if (table == null) return;

  const column: ?Column = table.columns.find((x: Column) => x.name === startTime);
  if (column == null) return;

  column.isPartOfPrimaryKey = false;
  column.isNullable = false;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  modifyStartTimeColumnOnInterventionMeetingTimeTable(pluginEnvironment(metaEd).entity);

  return {
    enhancerName,
    success: true,
  };
}

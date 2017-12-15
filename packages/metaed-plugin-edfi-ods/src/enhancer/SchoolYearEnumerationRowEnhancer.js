// @flow
import R from 'ramda';
import { getEntitiesOfType } from 'metaed-core';
import type { EnhancerResult, EnumerationItem, MetaEdEnvironment, ModelBase } from 'metaed-core';
import { escapeSqlSingleQuote } from '../shared/Utility';
import { newSchoolYearEnumerationRow } from '../model/database/SchoolYearEnumerationRow';
import { pluginEnvironment } from './EnhancerHelper';
import type { SchoolYearEnumerationRow } from '../model/database/SchoolYearEnumerationRow';

// Build special objects to support generating data inserts for School Year
const enhancerName: string = 'SchoolYearEnumerationRowEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'schoolYearEnumeration').forEach((entity: ModelBase) => {
    R.prop('enumerationItems')(entity).forEach((item: EnumerationItem) => {
      const name: string = R.take(4)(item.shortDescription);

      const row: SchoolYearEnumerationRow = Object.assign(newSchoolYearEnumerationRow(), {
        name,
        namespace: entity.namespaceInfo.namespace,
        schemaName: entity.namespaceInfo.namespace,
        tableName: 'SchoolYearType',
        documentation: item.documentation,
        schoolYear: parseInt(name, 10),
        schoolYearDescription: escapeSqlSingleQuote(item.shortDescription),
      });

      pluginEnvironment(metaEd).entity.row.set(row.name + row.schoolYearDescription, row);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}

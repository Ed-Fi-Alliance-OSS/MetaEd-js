import R from 'ramda';
import { orderByProp } from '@edfi/metaed-core';
import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace } from '@edfi/metaed-core';

import { edfiHandbookRepositoryForNamespace } from '../enhancer/EnhancerHelper';
import { createRow, newRow, setRow } from '../model/Row';
import { exportWorkbook, newWorkbook } from '../model/Workbook';
import { newWorksheet } from '../model/Worksheet';
import { HandbookEntry } from '../model/HandbookEntry';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { Workbook } from '../model/Workbook';
import { Row } from '../model/Row';
import { Worksheet } from '../model/Worksheet';

const EOL = '\n';

function handbookEntriesForNamespace(metaEd: MetaEdEnvironment, namespace: Namespace): HandbookEntry[] {
  const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
  if (handbookRepository == null) return [];
  return handbookRepository.handbookEntries;
}

function asNewLineSeparatedList(list: string[]): string {
  if (list == null || list.length === 0) return '';
  return list.join(EOL);
}

function getModelReferencesListFor(handbookEntry: HandbookEntry): string {
  const result: string[] = [];
  const modelReferencesContainsExists =
    handbookEntry.modelReferencesContains != null && handbookEntry.modelReferencesContains.length !== 0;

  if (modelReferencesContainsExists) {
    result.push('Contains:');
    result.push(asNewLineSeparatedList(handbookEntry.modelReferencesContains));
  }

  if (handbookEntry.modelReferencesUsedBy != null && handbookEntry.modelReferencesUsedBy.length !== 0) {
    if (modelReferencesContainsExists) result.push(EOL);
    result.push('Used By:');
    result.push(asNewLineSeparatedList(handbookEntry.modelReferencesUsedBy));
  }

  return result.join(EOL);
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const handbookEntries: HandbookEntry[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    handbookEntries.push(...handbookEntriesForNamespace(metaEd, namespace));
  });

  const orderedHandbookEntries: HandbookEntry[] = R.sortWith([orderByProp('umlType'), orderByProp('name')])(handbookEntries);

  const workbook: Workbook = newWorkbook();
  const handbookSheet: Worksheet = newWorksheet('Ed-Fi Handbook');
  workbook.sheets.push(handbookSheet);

  orderedHandbookEntries.forEach((handbookEntry: HandbookEntry) => {
    const handbookRow: Row = newRow();
    setRow(handbookRow, 'Ed-Fi ID', handbookEntry.metaEdId);
    setRow(
      handbookRow,
      'Name',
      handbookEntry.name + (handbookEntry.deprecationText ? ` - ${handbookEntry.deprecationText}` : ''),
    );
    setRow(handbookRow, 'Definition', handbookEntry.definition);
    setRow(handbookRow, 'UML Type', handbookEntry.umlType);
    setRow(handbookRow, 'Type Characteristics', asNewLineSeparatedList(handbookEntry.typeCharacteristics));
    setRow(handbookRow, 'Option List', asNewLineSeparatedList(handbookEntry.optionList));
    setRow(handbookRow, 'References', getModelReferencesListFor(handbookEntry));
    setRow(handbookRow, 'ODS', asNewLineSeparatedList(handbookEntry.odsFragment));

    handbookSheet.rows.push(createRow(handbookRow));
    handbookSheet['!cols'] = [
      { wpx: 100 },
      { wpx: 300 },
      { wpx: 300 },
      { wpx: 300 },
      { wpx: 300 },
      { wpx: 300 },
      { wpx: 300 },
    ];
  });

  const generatedOutput: GeneratedOutput[] = [
    {
      name: 'Ed-Fi Handbook Excel',
      namespace: 'Documentation',
      folderName: 'Ed-Fi-Handbook',
      fileName: 'Ed-Fi-Handbook.xlsx',
      resultString: '',
      resultStream: exportWorkbook(workbook, 'buffer'),
    },
  ];

  return {
    generatorName: 'edfiHandbook.MetaEdHandbookExcelGenerator',
    generatedOutput,
  };
}

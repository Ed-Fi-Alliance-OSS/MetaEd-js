import * as R from 'ramda';
import { orderByProp } from '@edfi/metaed-core';
import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace } from '@edfi/metaed-core';
import writeXlsxFile from 'write-excel-file';
import { edfiHandbookRepositoryForNamespace } from '../enhancer/EnhancerHelper';
import { HandbookEntry } from '../model/HandbookEntry';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';
import { HandbookRow, handbookSchema, handbookWorksheetName } from '../model/HandbookRow';

const EOL = '\n';

function handbookEntriesForNamespace(metaEd: MetaEdEnvironment, namespace: Namespace): HandbookEntry[] {
  const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
  if (handbookRepository == null) return [];
  return handbookRepository.handbookEntries;
}

function asNewLineSeparatedList(list: string[]): string | null {
  if (list == null || list.length === 0) return null;
  return list.join(EOL);
}

function getModelReferencesListFor(handbookEntry: HandbookEntry): string | null {
  const result: (string | null)[] = [];
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

  if (result.length === 0) return null;

  return result.join(EOL);
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const handbookEntries: HandbookEntry[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    handbookEntries.push(...handbookEntriesForNamespace(metaEd, namespace));
  });

  const orderedHandbookEntries: HandbookEntry[] = R.sortWith([orderByProp('umlType'), orderByProp('name')])(handbookEntries);

  const handbookRows: HandbookRow[] = [];

  orderedHandbookEntries.forEach((handbookEntry: HandbookEntry) => {
    handbookRows.push({
      name: handbookEntry.name + (handbookEntry.deprecationText ? ` - ${handbookEntry.deprecationText}` : ''),
      definition: handbookEntry.definition,
      umlType: handbookEntry.umlType,
      typeCharacteristics: asNewLineSeparatedList(handbookEntry.typeCharacteristics),
      optionList: asNewLineSeparatedList(handbookEntry.optionList),
      references: getModelReferencesListFor(handbookEntry),
      ods: asNewLineSeparatedList(handbookEntry.odsFragment),
    });
  });

  // @ts-ignore - TypeScript typings here don't recognize Blob return type
  const fileAsBlob: Blob = await writeXlsxFile([handbookRows], {
    buffer: true,
    schema: [handbookSchema],
    sheets: [handbookWorksheetName],
  });
  const fileAsArrayBuffer = await fileAsBlob.arrayBuffer();

  const generatedOutput: GeneratedOutput[] = [
    {
      name: 'Ed-Fi Handbook Excel',
      namespace: 'Documentation',
      folderName: 'Ed-Fi-Handbook',
      fileName: 'Ed-Fi-Handbook.xlsx',
      resultString: '',
      resultStream: Buffer.from(fileAsArrayBuffer),
    },
  ];

  return {
    generatorName: 'edfiHandbook.MetaEdHandbookExcelGenerator',
    generatedOutput,
  };
}

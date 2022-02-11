import path from 'path';
import fs from 'fs';
import { MetaEdEnvironment, GeneratorResult, GeneratedOutput, Namespace } from '@edfi/metaed-core';
import { edfiHandbookRepositoryForNamespace } from '../enhancer/EnhancerHelper';
import { HandbookEntry } from '../model/HandbookEntry';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

function handbookEntriesForNamespace(metaEd: MetaEdEnvironment, namespace: Namespace): HandbookEntry[] {
  const handbookRepository: EdfiHandbookRepository | null = edfiHandbookRepositoryForNamespace(metaEd, namespace);
  if (handbookRepository == null) return [];
  return handbookRepository.handbookEntries;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const allHandbookEntries: HandbookEntry[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    allHandbookEntries.push(...handbookEntriesForNamespace(metaEd, namespace));
  });

  // Move Student to the front so it is displayed in the handbook on page load
  allHandbookEntries.sort((a, b) => {
    if (a.name === 'Student') return -1;
    return b.name === 'Student' ? 1 : 0;
  });

  let detail: string = fs.readFileSync(path.join(__dirname, './template/EdFiDataHandbookAsHtmlSPADetail.html'), 'utf8');
  detail = detail.replace(/\n/g, ' ');
  detail = detail.replace(/>\s+</g, '><');
  detail = detail.replace(/\s{2,}/g, ' ');
  detail = detail.replace(/"/g, "'");
  const index: string = fs
    .readFileSync(path.join(__dirname, './template/EdFiDataHandbookAsHtmlSPAIndex.html'), 'utf8')
    .replace(/\{JSONData\}/g, JSON.stringify(allHandbookEntries))
    .replace(/\{detailTemplate\}/g, detail);

  const results: GeneratedOutput[] = [];
  results.push({
    name: 'Ed-Fi Data Handbook',
    namespace: 'Documentation',
    folderName: 'Ed-Fi-Handbook',
    fileName: 'Ed-Fi-Data-Handbook-Index.html',
    resultString: index,
    resultStream: null,
  });

  return {
    generatorName: 'MetaEdHandbookAsHtmlIndexGenerator',
    generatedOutput: results,
  };
}

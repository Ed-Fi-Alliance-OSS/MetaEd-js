// @flow
import fs from 'fs';
import type { MetaEdEnvironment, GeneratorResult, GeneratedOutput, PluginEnvironment } from 'metaed-core';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';


export function generate(metaEd: MetaEdEnvironment): GeneratorResult {
  const handbookEntries: Array<HandbookEntry> = (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries;
  const detail: string = fs.readFileSync('./template/MetaEdHandbookAsHtmlSPADetail.html', 'utf8');
  const index: string = fs.readFileSync('./template/MetaEdHandbookAsHtmlSPAIndex.html', 'utf8').replace('{ JSONData }', handbookEntries.toString()).replace('{ detailTemplate }', detail);

  const results: Array<GeneratedOutput> = [];
  results.push({
    name: 'MetaEd Ed-Fi Handbook',
    folderName: 'Ed-Fi-Handbook',
    fileName: 'MetaEd-Handbook-Index.html',
    resultString: index,
    resultStream: null,
  });

  return {
    generatorName: 'MetaEdHandbookGenerator',
    generatedOutput: results,
  };
}

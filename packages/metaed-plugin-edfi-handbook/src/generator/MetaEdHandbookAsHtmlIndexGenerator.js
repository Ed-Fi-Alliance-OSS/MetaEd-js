// @flow
import path from 'path';
import fs from 'fs';
import type { MetaEdEnvironment, GeneratorResult, GeneratedOutput, PluginEnvironment } from 'metaed-core';
import type { HandbookEntry } from '../model/HandbookEntry';
import type { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';


export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const handbookEntries: Array<HandbookEntry> = (((metaEd.plugin.get('edfiHandbook'): any): PluginEnvironment).entity: EdfiHandbookRepository).handbookEntries;
  let detail: string = fs.readFileSync(path.join(__dirname, './template/MetaEdHandbookAsHtmlSPADetail.html'), 'utf8');
  detail = detail.replace(/\n/g, ' ');
  detail = detail.replace(/>\s+</g, '><');
  detail = detail.replace(/\s{2,}/g, ' ');
  detail = detail.replace(/"/g, '\'');
  const index: string = fs.readFileSync(path.join(__dirname, './template/MetaEdHandbookAsHtmlSPAIndex.html'), 'utf8').replace(/\{ JSONData \}/g, JSON.stringify(handbookEntries)).replace(/\{ detailTemplate \}/g, detail);

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

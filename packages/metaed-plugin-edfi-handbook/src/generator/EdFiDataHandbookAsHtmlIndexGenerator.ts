// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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

/**
 * Minimizes HTML content by removing unnecessary whitespace.
 * Script blocks are left structurally intact (newlines preserved) because
 * removing newlines from JavaScript breaks single-line // comments.
 */
function minimizeHtml(html: string): string {
  // Split on <script>...</script> blocks so we only aggressively minimize HTML markup.
  // Odd-indexed parts are script blocks; even-indexed parts are plain HTML.
  const parts = html.split(/(<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>)/gi);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) {
        // Script block: collapse runs of blank lines but keep newlines so // comments stay safe
        return part.replace(/\n{2,}/g, '\n');
      }
      // HTML markup: strip newlines and collapse whitespace between tags
      return part
        .replace(/\n/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ');
    })
    .join('');
}

/** Remove fields unused by the HTML template */
function stripUnusedFields(entry: HandbookEntry): object {
  const { entityUuid, repositoryId, projectName, modelReferencesContains, modelReferencesUsedBy, ...rest } = entry;
  return {
    ...rest,
    modelReferencesContainsProperties: rest.modelReferencesContainsProperties.map(
      ({ propertyUuid, targetPropertyId, extensionParentName, ...prop }) => prop,
    ),
  };
}

/** Recursively remove empty strings and empty arrays */
function stripEmpty(value: unknown): unknown {
  if (Array.isArray(value)) {
    const mapped = value.map(stripEmpty).filter((v) => v !== undefined);
    return mapped.length > 0 ? mapped : undefined;
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as object).reduce<Record<string, unknown>>((acc, [k, v]) => {
      const stripped = stripEmpty(v);
      if (stripped !== undefined) acc[k] = stripped;
      return acc;
    }, {});
  }
  if (value === '') return undefined;
  return value;
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

  const jsonData = allHandbookEntries.map((e) => stripEmpty(stripUnusedFields(e)));

  const index: string = minimizeHtml(
    fs
      .readFileSync(path.join(__dirname, './template/EdFiDataHandbookAsHtmlSPAIndex.html'), 'utf8')
      .replace(/\{JSONData\}/g, JSON.stringify(jsonData)),
  );

  const results: GeneratedOutput[] = [];
  results.push({
    name: 'Ed-Fi Unified Data Model Handbook',
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

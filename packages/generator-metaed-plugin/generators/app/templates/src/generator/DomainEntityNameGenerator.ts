import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';

import { MetaEdEnvironment, GeneratorResult, GeneratedOutput, ModelBase, getAllEntitiesOfType } from '@edfi/metaed-core';

// node 8.0+ wrapper to enable async/await on file read
const readFile = promisify(fs.readFile);

// Handlebars instance scoped for this plugin
export const domainEntityNameHandlebars = handlebars.create();

// standard generator function signature
export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];

  // Get all Domain Entities in all namespaces, as ModelBase type so there is no need to cast
  const domainEntities: Array<ModelBase> = getAllEntitiesOfType(metaEd, 'domainEntity');

  // Compile the Handlebars template file, return custom handlebars function to apply data to our template
  const templateBuffer = await readFile(path.join(__dirname, 'templates', 'DomainEntityNames.hbs'));
  const templateFunction: (Object) => string = domainEntityNameHandlebars.compile(templateBuffer.toString());

  // Feed Domain Entities to DomainEntityNames.hbs template
  const resultString: string = templateFunction({ domainEntities });

  // Provide result with file metadata
  // Often MetaEd generates one file per namespace, but here we are putting information from all namespaces in one file
  // It will be named domainEntityNames.txt and placed in the Documentation/Names folder
  results.push({
    name: 'domainEntityNames.txt',
    namespace: 'Documentation',
    folderName: 'Names',
    fileName: 'domainEntityNames.txt',
    resultString,
    resultStream: null,
  });

  return {
    generatorName: 'DomainEntityNameGenerator',
    generatedOutput: results,
  };
}

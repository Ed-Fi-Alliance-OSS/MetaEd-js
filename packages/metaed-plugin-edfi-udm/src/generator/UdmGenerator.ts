import path from 'path';
import marked from 'marked';
import R from 'ramda';
import fs from 'fs';
import handlebars from 'handlebars';

import { MetaEdEnvironment, GeneratorResult, GeneratedOutput, ModelBase } from 'metaed-core';
import { getAllEntitiesOfType } from 'metaed-core';

// Handlebars instance scoped for this plugin
export const markdownHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function templateNamed(templateName: string) {
  return markdownHandlebars.compile(templateString(templateName));
}

export const template = R.memoizeWith(R.identity, () => ({
  interchangeBrief: templateNamed('UdmAsMarkdown'),
}));

export const registerPartials = R.once(() => {
  markdownHandlebars.registerPartial({
    interchangeBrief: templateString('UdmAsMarkdown'),
  } as any);
});

export interface DomainMarkdown {
  domainName: string;
  markdown: string;
}

export async function generateMarkdownForDomains(metaEd: MetaEdEnvironment): Promise<DomainMarkdown[]> {
  const result: DomainMarkdown[] = [];
  const domains: ModelBase[] = getAllEntitiesOfType(metaEd, 'domain');

  domains.forEach((domain) => {
    const markdown: string = template().interchangeBrief({ domain });
    result.push({
      domainName: domain.metaEdName,
      markdown,
    });
  });

  return result;
}

export function convertMarkdownToHtml(markdown: string): string {
  const html: string = marked(markdown, {
    gfm: true,
    tables: true,
    breaks: true,
  });
  return `<!DOCTYPE html><html><head><title>MetaEd Generated Interchange Brief</title><link rel="stylesheet" href="confluence-like.css"></head><body>${html}</body><html>`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const domainMarkdowns: DomainMarkdown[] = await generateMarkdownForDomains(metaEd);

  domainMarkdowns.forEach((domainMarkdown) => {
    results.push({
      name: 'UDM Markdown',
      namespace: 'Documentation',
      folderName: 'UDM',
      fileName: `Udm-${domainMarkdown.domainName}.html`,
      resultString: convertMarkdownToHtml(domainMarkdown.markdown),
      resultStream: null,
    });
  });

  results.push({
    name: 'confluence-like.css',
    namespace: 'Documentation',
    folderName: 'UDM',
    fileName: 'confluence-like.css',
    resultString: fs.readFileSync(path.resolve(__dirname, './confluence-like.css'), 'utf8') as string,
    resultStream: null,
  });

  return {
    generatorName: 'UdmGenerator',
    generatedOutput: results,
  };
}

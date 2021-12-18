import marked from 'marked';
import R from 'ramda';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace } from 'metaed-core';
import { EdFiXsdEntityRepository, MergedInterchange } from 'metaed-plugin-edfi-xsd';
import { edfiXsdRepositoryForNamespace } from 'metaed-plugin-edfi-xsd';

const generatorName = 'Interchange Brief Markdown Generator';
const header =
  '<head><title>MetaEd Generated Interchange Brief</title><link rel="stylesheet" href="confluence-like.css"></head>';

// Handlebars instance scoped for this plugin
export const markdownHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function templateNamed(templateName: string) {
  return markdownHandlebars.compile(templateString(templateName));
}

export const template = R.memoizeWith(R.identity, () => ({
  interchangeBrief: templateNamed('InterchangeBriefAsMarkdown'),
}));

export const registerPartials = R.once(() => {
  markdownHandlebars.registerPartial({
    interchangeBrief: templateString('InterchangeBriefAsMarkdown'),
  } as any);
});

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  registerPartials();
  const generatedOutput: GeneratedOutput[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    const xsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (xsdRepository == null) return;

    xsdRepository.mergedInterchange.forEach((interchange: MergedInterchange) => {
      const markdown: string = template().interchangeBrief(interchange);
      generatedOutput.push({
        name: 'Interchange Brief Html',
        namespace: 'Documentation',
        folderName: 'InterchangeBrief',
        fileName: `${interchange.metaEdName}-InterchangeBrief.html`,
        resultString: `${header}${marked(markdown)}`,
        resultStream: null,
      });
    });

    generatedOutput.push({
      name: 'confluence-like.css',
      namespace: 'Documentation',
      folderName: 'InterchangeBrief',
      fileName: 'confluence-like.css',
      resultString: fs.readFileSync(path.resolve(__dirname, './confluence-like.css'), 'utf8') as string,
      resultStream: null,
    });
  });

  return {
    generatorName,
    generatedOutput,
  };
}

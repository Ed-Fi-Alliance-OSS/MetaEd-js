import fs from 'fs';
import R from 'ramda';
import path from 'path';
import handlebars from 'handlebars';
import {
  MetaEdEnvironment,
  GeneratedOutput,
  GeneratorResult,
  Namespace,
  SemVer,
  versionSatisfies,
  PluginEnvironment,
} from 'metaed-core';
import { EdFiXsdEntityRepository, MergedInterchange, edfiXsdRepositoryForNamespace } from 'metaed-plugin-edfi-xsd';

const generatorName = 'edfiOdsApi.InterchangeOrderMetadataGeneratorV2';
const outputName = 'Interchange Order Metadata';

export const interchangeOrderMetadataHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function templateNamed(templateName: string) {
  return interchangeOrderMetadataHandlebars.compile(templateString(templateName));
}

export const template = R.memoizeWith(R.identity, () => templateNamed('interchangeOrderMetadata'))();

function generateFile(input: any, namespace: Namespace): GeneratedOutput {
  return {
    name: outputName,
    namespace: namespace.namespaceName,
    folderName: 'ApiMetadata',
    fileName: `InterchangeOrderMetadata${namespace.projectExtension ? `-${namespace.projectExtension}` : ''}.xml`,
    resultString: template(input),
    resultStream: null,
  };
}

interface ElementMetadata {
  name: string;
  order: number;
}

interface InterchangeMetadata {
  name: string;
  order: number;
  elements: ElementMetadata[];
}

const targetTechnologyVersion: SemVer = '<5.0.0';

function getInterchangeMetadataFor(interchange: MergedInterchange): InterchangeMetadata {
  const elements: ElementMetadata[] = interchange.data.edfiOdsApi.apiOrderedElements.map(
    (element: { name: string; globalDependencyOrder: number }) => ({
      name: element.name,
    }),
  );
  return { name: interchange.metaEdName, order: interchange.data.edfiOdsApi.apiOrder, elements };
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];

  if (
    !versionSatisfies(
      (metaEd.plugin.get('edfiOdsApi') as PluginEnvironment).targetTechnologyVersion,
      targetTechnologyVersion,
    )
  ) {
    return { generatorName, generatedOutput: results };
  }

  if (metaEd.namespace.size > 0) {
    const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) return { generatorName, generatedOutput: [] };

    const coreEdfiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, coreNamespace);
    if (coreEdfiXsdEntityRepository == null) return { generatorName, generatedOutput: [] };

    const coreInterchangeMetadata: InterchangeMetadata[] = [];
    coreEdfiXsdEntityRepository.mergedInterchange.forEach((interchange: MergedInterchange) => {
      if (interchange.namespace.namespaceName !== 'EdFi') return;

      coreInterchangeMetadata.push(getInterchangeMetadataFor(interchange));
    });

    metaEd.namespace.forEach((namespace: Namespace) => {
      const edfiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
      if (edfiXsdEntityRepository == null) return;

      // METAED-997
      if (edfiXsdEntityRepository.hasDuplicateEntityNameInDependencyNamespace) return;

      const interchangeMetadata: InterchangeMetadata[] = [];
      edfiXsdEntityRepository.mergedInterchange.forEach((interchange: MergedInterchange) => {
        if (interchange.namespace.namespaceName !== namespace.namespaceName) return;

        interchangeMetadata.push(getInterchangeMetadataFor(interchange));
      });

      if (interchangeMetadata.length === 0) return;

      if (namespace.isExtension && coreInterchangeMetadata != null) {
        coreInterchangeMetadata.forEach((coreInterchange: InterchangeMetadata) => {
          if (interchangeMetadata.every((interchange) => interchange.name !== coreInterchange.name))
            interchangeMetadata.push(coreInterchange);
        });
      }

      const interchanges = R.sortBy(R.prop('order'))(interchangeMetadata);

      results.push(generateFile({ interchanges }, namespace));
    });
  }

  return {
    generatorName,
    generatedOutput: results,
  };
}

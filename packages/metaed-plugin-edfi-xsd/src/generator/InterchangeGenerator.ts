import { MetaEdEnvironment, GeneratorResult, GeneratedOutput, Namespace } from 'metaed-core';
import { formatAndPrependHeader, template, formatVersionForSchema } from './XsdGeneratorBase';
import { edfiXsdRepositoryForNamespace } from '../enhancer/EnhancerHelper';
import { MergedInterchange } from '../model/MergedInterchange';
import { EdFiXsdEntityRepository } from '../model/EdFiXsdEntityRepository';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const outputName = 'Core XSD Interchanges';
  const generatorName = 'XSD Interchanges';
  const generatedOutput: GeneratedOutput[] = [];

  const orderedInterchange: MergedInterchange[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) return;

    // METAED-997
    if (edFiXsdEntityRepository.hasDuplicateEntityNameInDependencyNamespace) return;

    orderedInterchange.push(...edFiXsdEntityRepository.mergedInterchange.values());
  });

  orderedInterchange
    .filter((interchange: MergedInterchange) => !interchange.namespace.isExtension)
    .forEach((interchange) => {
      const templateData = {
        schemaVersion: formatVersionForSchema(metaEd),
        interchange,
      };
      const formattedGeneratedResult = formatAndPrependHeader(template().interchange(templateData));
      generatedOutput.push({
        name: outputName,
        namespace: interchange.namespace.namespaceName,
        folderName: 'Interchange',
        fileName: interchange.namespace.isExtension
          ? `${interchange.namespace.projectExtension}-Interchange-${interchange.metaEdName}-Extension.xsd`
          : `Interchange-${interchange.metaEdName}.xsd`,
        resultString: formattedGeneratedResult,
        resultStream: null,
      });
    });
  orderedInterchange
    .filter((interchange: MergedInterchange) => interchange.namespace.isExtension)
    .forEach((interchange: MergedInterchange) => {
      const templateData = {
        schemaVersion: formatVersionForSchema(metaEd),
        interchange,
      };
      const formattedGeneratedResult = formatAndPrependHeader(template().interchange(templateData));

      generatedOutput.push({
        name: outputName,
        namespace: interchange.namespace.namespaceName,
        folderName: 'Interchange',
        fileName: interchange.namespace.isExtension
          ? `${interchange.namespace.projectExtension}-Interchange-${interchange.metaEdName}-Extension.xsd`
          : `Interchange-${interchange.metaEdName}.xsd`,
        resultString: formattedGeneratedResult,
        resultStream: null,
      });
    });

  return {
    generatorName,
    generatedOutput,
  };
}

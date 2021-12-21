import Horseman from 'node-horseman';
import { path as phantomPath } from 'phantomjs-prebuilt';
import path from 'path';
import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace } from 'metaed-core';
import { edfiXsdRepositoryForNamespace, EdFiXsdEntityRepository } from 'metaed-plugin-edfi-xsd';

interface SvgElement {
  name: string;
  children?: SvgElement[];
}

const generatorName = 'InterchangeBriefImageGenerator';

function getModel(metaEd: MetaEdEnvironment): SvgElement[] {
  const result: SvgElement[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    const xsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (xsdRepository == null) return;

    xsdRepository.mergedInterchange.forEach((interchange) => {
      const svgElement: SvgElement = {
        name: interchange.interchangeName,
        children: [{ name: '<xs:choice>', children: [] }],
      };
      interchange.identityTemplates.forEach((identityTemplate) => {
        const identityTemplateEntity = { name: identityTemplate.data.edfiXsd.xsd_Name };
        // @ts-ignore: thinks svgElement.children[0] could be undefined, but it was defined above.
        if (svgElement.children[0].children) svgElement.children[0].children.push(identityTemplateEntity);
      });
      interchange.elements.forEach((element) => {
        const elementEntity = { name: element.data.edfiXsd.xsd_Name };
        // @ts-ignore: thinks svgElement.children[0] could be undefined, but it was defined above.
        if (svgElement.children[0].children) svgElement.children[0].children.push(elementEntity);
      });
      result.push(svgElement);
    });
  });
  return result;
}

// This generator returns a Promise<GeneratorResult>
// instead of the expected GeneratorResult because it's waiting on phantom to finish.
export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const generatedOutput: GeneratedOutput[] = [];
  const allInterchangeModels: SvgElement[] = getModel(metaEd);
  await Promise.all(
    allInterchangeModels.map(async (interchange) =>
      new Horseman({ phantomPath })
        .viewport(1000, 1000)
        .open(`file:///${path.join(__dirname, './svg/InterchangeBriefSvg.html')}`)
        .injectJs(path.join(__dirname, './svg/treeLayout.js'))
        .evaluate((model) => {
          // @ts-ignore: draw() will be called within phantom, where it will be defined.
          draw(model); // eslint-disable-line no-undef
        }, interchange)
        .cropBase64('g', 'PNG')
        .then((imageBase64) =>
          generatedOutput.push({
            name: `${interchange.name}-InterchangeBrief`,
            namespace: 'Documentation',
            folderName: 'InterchangeBrief/img',
            fileName: `${interchange.name}-InterchangeBrief.png`,
            resultString: '',
            resultStream: Buffer.from(imageBase64, 'base64'),
          }),
        )
        .close(),
    ),
  );

  return {
    generatorName,
    generatedOutput,
  };
}

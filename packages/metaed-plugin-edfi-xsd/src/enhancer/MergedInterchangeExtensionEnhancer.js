// @flow
import R from 'ramda';
import { getEntitiesOfType, newInterchangeItem } from '../../../metaed-core/index';
import { newMergedInterchange, addMergedInterchangeToRepository } from '../model/MergedInterchange';
import { addInterchangeItemEdfiXsdTo } from '../model/InterchangeItem';
import type { EdFiXsdEntityRepository } from '../model/EdFiXsdEntityRepository';
import type { MergedInterchange } from '../model/MergedInterchange';
import type { MetaEdEnvironment, EnhancerResult, ModelBase } from '../../../metaed-core/index';

const enhancerName: string = 'MergedInterchangeExtensionEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edFiXsdEntityRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;
  const coreInterchanges: Array<MergedInterchange> = Array.from(edFiXsdEntityRepository.mergedInterchange.values());

  metaEd.entity.namespaceInfo.filter(ni => ni.isExtension).forEach(extensionNamespaceInfo => {
    const isInThisNamespace = x => x.namespaceInfo.namespace === extensionNamespaceInfo.namespace;
    const extensionEntities: Array<ModelBase> = getEntitiesOfType(metaEd.entity, 'associationExtension', 'domainEntityExtension')
      .filter(isInThisNamespace);
    const extensionInterchanges: Array<MergedInterchange> = Array.from(edFiXsdEntityRepository.mergedInterchange.values())
      .filter(isInThisNamespace);

    // Need to extend any interchange that contains an entity that has an extension in the current namespace
    const interchangesToExtend = coreInterchanges
      .filter(i => i.elements.some(e => extensionEntities.some(ee => ee.metaEdName === e.metaEdName)));

    interchangesToExtend.forEach(interchangeToExtend => {
      // Check to see if the interchange has already been extended
      let extensionInterchange: MergedInterchange = R.find(ei => ei.metaEdName === interchangeToExtend.metaEdName, extensionInterchanges);
      if (!extensionInterchange) {
        extensionInterchange = Object.assign(newMergedInterchange(), {
          metaEdName: interchangeToExtend.metaEdName,
          repositoryId: `${extensionNamespaceInfo.projectExtension}-${interchangeToExtend.metaEdName}`,
          interchangeName: interchangeToExtend.metaEdName,
          documentation: interchangeToExtend.documentation,
          extendedDocumentation: interchangeToExtend.extendedDocumentation,
          useCaseDocumentation: interchangeToExtend.useCaseDocumentation,
          namespaceInfo: extensionNamespaceInfo,
        });

        interchangeToExtend.elements.forEach(element => {
          const interchangeItem = Object.assign(newInterchangeItem(), {
            metaEdName: element.metaEdName,
            namespaceInfo: element.namespaceInfo,
            referencedEntity: element.referencedEntity,
            documentation: element.documentation,
          });
          addInterchangeItemEdfiXsdTo(interchangeItem);
          extensionInterchange.elements.push(interchangeItem);
        });

        addMergedInterchangeToRepository(metaEd, extensionInterchange);
      }

      const elementsToExtend = interchangeToExtend.elements.map(e =>
        ({
          element: e,
          extensionElement: R.find(ee => ee.metaEdName === e.metaEdName, extensionEntities),
        }),
      ).filter(elementPair => elementPair.extensionElement);

      elementsToExtend.forEach(elementToExtend => {
        extensionInterchange.elements = extensionInterchange.elements.filter(e => e.metaEdName !== elementToExtend.element.metaEdName);
        const interchangeItem = Object.assign(newInterchangeItem(), {
          metaEdName: elementToExtend.element.metaEdName,
          namespaceInfo: extensionNamespaceInfo,
          referencedEntity: elementToExtend.extensionElement,
          documentation: elementToExtend.element.documentation,
        });
        addInterchangeItemEdfiXsdTo(interchangeItem);
        extensionInterchange.elements.push(interchangeItem);
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}

import { MetaEdEnvironment, EnhancerResult, Namespace, Descriptor, InterchangeItem } from '@edfi/metaed-core';
import { getAllEntitiesOfType, newInterchangeItem } from '@edfi/metaed-core';
import { addInterchangeItemEdfiXsdTo } from '../model/InterchangeItem';
import { newMergedInterchange, addMergedInterchangeToRepository } from '../model/MergedInterchange';
import { MergedInterchange } from '../model/MergedInterchange';

const enhancerName = 'AddDescriptorInterchangeEnhancer';

export const descriptorInterchangeName = 'Descriptors';
const descriptorInterchangeDocumentation = `Descriptors provide states, districts, vendors, and other users of the Ed-Fi solution with the flexibility to use their own enumerations and code sets without modifying the Ed-Fi core schema.
The Descriptor interchange is used to describe metadata about the descriptors and their structure. It is used to define enumeration vocabularies that are not "fixed" within the XML schema, but are loaded in XML files and linked to their source.`;

const descriptorUseCaseDocumentation = `1. Exchange state, district, or vendor code sets in a way that Ed-Fi technology implementations can understand the semantics
2. Exchange code or enumeration values that change over time, but where longitudinal analysis is still important`;

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const allDescriptors: Descriptor[] = getAllEntitiesOfType(metaEd, 'descriptor') as Descriptor[];
  metaEd.namespace.forEach((namespace: Namespace) => {
    // Skip this namespace if no new descriptors defined
    if (allDescriptors.every((descriptor: Descriptor) => descriptor.namespace.namespaceName !== namespace.namespaceName))
      return;

    const descriptorInterchange: MergedInterchange = {
      ...newMergedInterchange(),
      namespace,
      metaEdName: descriptorInterchangeName,
      documentation: descriptorInterchangeDocumentation,
      useCaseDocumentation: descriptorUseCaseDocumentation,
    };

    // Include all core descriptors and all descriptors for the current namespace
    allDescriptors
      .filter((ad) => !ad.namespace.isExtension || ad.namespace.namespaceName === namespace.namespaceName)
      .forEach((descriptor: Descriptor) => {
        const element: InterchangeItem = {
          ...newInterchangeItem(),
          metaEdName: descriptor.data.edfiXsd.xsdDescriptorName,
          namespace,
          referencedEntity: descriptor,
        };
        addInterchangeItemEdfiXsdTo(element);
        descriptorInterchange.elements.push(element);
      });

    if (descriptorInterchange.elements.length > 0) addMergedInterchangeToRepository(metaEd, descriptorInterchange);
  });

  return {
    enhancerName,
    success: true,
  };
}

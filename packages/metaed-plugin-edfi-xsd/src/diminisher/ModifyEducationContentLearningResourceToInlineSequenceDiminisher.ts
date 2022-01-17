import R from 'ramda';
import { getEntityFromNamespace, versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase, ModelType, Namespace } from '@edfi/metaed-core';
import { newElementGroup } from '../model/schema/ElementGroup';
import { ComplexType } from '../model/schema/ComplexType';
import { ComplexTypeItem } from '../model/schema/ComplexTypeItem';
import { Element } from '../model/schema/Element';
import { ElementGroup } from '../model/schema/ElementGroup';

// Force generation of LearningStandard common type under EducationContent to output what the ods sql is expecting from an xsd perspective
// Temporary work around until ODS-904 is resolved
const enhancerName = 'ModifyEducationContentLearningResourceToInlineSequenceDiminisher';
const targetVersions = '2.x';

const entityName = 'EducationContent';
const entityType: ModelType = 'domainEntity';
const elementName = 'LearningResource';
const elementType: ModelType = 'common';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  const entity: ModelBase | null = getEntityFromNamespace(entityName, coreNamespace, entityType);

  if (entity != null && entity.data.edfiXsd.xsdComplexTypes.length === 1) {
    const entityComplexType: ComplexType = R.head(entity.data.edfiXsd.xsdComplexTypes);
    const entityElementGroup: ElementGroup | undefined = entityComplexType.items.find(
      (x) => (x as unknown as ElementGroup).isChoice === true,
    ) as ElementGroup | undefined;

    if (entityElementGroup != null) {
      const learningResourceElement: Element | undefined = entityElementGroup.items.find(
        (x) => (x as unknown as Element).name === elementName,
      ) as Element | undefined;
      const inlineCommon: ModelBase | null = getEntityFromNamespace(elementName, coreNamespace, elementType);

      if (
        learningResourceElement != null &&
        inlineCommon != null &&
        inlineCommon.data.edfiXsd.xsdComplexTypes.length === 1
      ) {
        const propertyComplexTypeItems: ComplexTypeItem[] = R.head(inlineCommon.data.edfiXsd.xsdComplexTypes).items;

        // Clear out generation of the common type
        inlineCommon.data.edfiXsd.xsdComplexTypes = [];

        // Build new element group to replace element
        const elementIndex: number = entityElementGroup.items.indexOf(learningResourceElement as unknown as ComplexTypeItem);
        entityElementGroup.items[elementIndex] = {
          ...newElementGroup(),
          items: [...propertyComplexTypeItems],
        } as ComplexTypeItem;
      }
    }
  }

  return {
    enhancerName,
    success: true,
  };
}

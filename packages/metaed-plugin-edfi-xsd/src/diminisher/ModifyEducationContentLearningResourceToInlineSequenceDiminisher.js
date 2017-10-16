// @flow
import R from 'ramda';
import type {
  EnhancerResult,
  MetaEdEnvironment,
  ModelBase,
  ModelType,
} from '../../../metaed-core/index';
import type { ComplexType } from '../model/schema/ComplexType';
import type { ComplexTypeItem } from '../model/schema/ComplexTypeItem';
import type { Element } from '../../src/model/schema/Element';
import type { ElementGroup } from '../../src/model/schema/ElementGroup';
import { asElement } from '../../src/model/schema/Element';
import { asElementGroup, newElementGroup } from '../../src/model/schema/ElementGroup';
import { getEntity } from '../../../metaed-core/index';

// Force generation of LearningStandard common type under EducationContent to output what the ods sql is expecting from an xsd perspective
// Temporary work around until ODS-904 is resolved
const enhancerName: string = 'ModifyEducationContentLearningResourceToInlineSequenceDiminisher';
const targetVersions: string = '2.0.0';

const entityName: string = 'EducationContent';
const entityType: ModelType = 'domainEntity';
const elementName: string = 'LearningResource';
const elementType: ModelType = 'common';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  const entity: ?ModelBase = getEntity(metaEd.entity, entityName, entityType);

  if (entity != null && entity.data.edfiXsd.xsd_ComplexTypes.length === 1) {
    const entityComplexType: ComplexType = R.head(entity.data.edfiXsd.xsd_ComplexTypes);
    const entityElementGroup: ?ElementGroup =
      asElementGroup(entityComplexType.items.find(x => asElementGroup(x).isChoice === true));

    if (entityElementGroup != null) {
      const learningResourceElement: ?Element = asElement(entityElementGroup.items.find(x => asElement(x).name === elementName));
      const inlineCommon: ?ModelBase = getEntity(metaEd.entity, elementName, elementType);

      if (learningResourceElement != null
        && inlineCommon != null
        && inlineCommon.data.edfiXsd.xsd_ComplexTypes.length === 1) {
        const propertyComplexTypeItems: Array<ComplexTypeItem> =
          R.head(inlineCommon.data.edfiXsd.xsd_ComplexTypes).items;

        // Clear out generation of the common type
        inlineCommon.data.edfiXsd.xsd_ComplexTypes = [];

        // Build new element group to replace element
        const elementIndex: number = entityElementGroup.items.indexOf(learningResourceElement);
        entityElementGroup.items[elementIndex] = Object.assign(newElementGroup(), {
          items: [...propertyComplexTypeItems],
        });
      }
    }
  }

  return {
    enhancerName,
    success: true,
  };
}

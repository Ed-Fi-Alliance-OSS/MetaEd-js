// @flow
import R from 'ramda';
import type {
  DomainEntity,
  InlineCommonProperty,
  MetaEdEnvironment,
} from '../../../../packages/metaed-core/index';
import {
  newDomainEntity,
  newInlineCommonProperty,
  newMetaEdEnvironment,
  newNamespaceInfo,
} from '../../../../packages/metaed-core/index';
import type { ComplexType } from '../../src/model/schema/ComplexType';
import type { ElementGroup } from '../../src/model/schema/ElementGroup';
import { enhance } from '../../src/diminisher/ModifyEducationContentLearningResourceToInlineSequenceDiminisher';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { newElement } from '../../src/model/schema/Element';
import { newElementGroup } from '../../src/model/schema/ElementGroup';

describe('when ModifyEducationContentLearningResourceToInlineSequenceDiminisher diminishes education content', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const educationContentName: string = 'EducationContent';
  const learningResourceName: string = 'LearningResource';
  let elementGroup: Array<ComplexType>;

  beforeAll(() => {
    const namespace: string = 'edfi';

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: educationContentName,
      namespaceInfo: Object.assign(newNamespaceInfo(), { namespace }),
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: educationContentName,
              items: [
                Object.assign(newElementGroup(), {
                  isChoice: true,
                  items: [
                    Object.assign(newElement(), { name: 'LearningResourceMetadataURI' }),
                    Object.assign(newElement(), { name: learningResourceName }),
                  ],
                }),
              ],
            }),
          ],
        },
      },
    });
    metaEd.entity.domainEntity.set(educationContentName, domainEntity1);

    elementGroup = [
      Object.assign(newComplexType(), {
        name: educationContentName,
        items: [
          Object.assign(newElement(), { name: 'Item1' }),
          Object.assign(newElementGroup(), {
            isChoice: true,
            items: [
              Object.assign(newElement(), { name: 'Item2' }),
            ],
          }),
        ],
      }),
    ];
    const inlineCommon1: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      metaEdName: learningResourceName,
      namespaceInfo: Object.assign(newNamespaceInfo(), { namespace }),
      data: {
        edfiXsd: {
          xsd_ComplexTypes: elementGroup,
        },
      },
    });

    metaEd.propertyIndex.inlineCommon.push(inlineCommon1);
    metaEd.dataStandardVersion = '2.0.0';

    enhance(metaEd);
  });

  it('should clear complex types for LearningResource property', () => {
    // $FlowIgnore - property could be undefined
    const propertyComplexTypes: Array<ComplexType> = metaEd.propertyIndex.inlineCommon
      .find(x => x.metaEdName === learningResourceName).data.edfiXsd.xsd_ComplexTypes;
    expect(propertyComplexTypes).toBeDefined();
    expect(propertyComplexTypes).toHaveLength(0);
    expect(propertyComplexTypes).toEqual([]);
  });

  it('should not have learning standard element', () => {
    // $FlowIgnore - entity could be undefined
    const entityComplexTypes = metaEd.entity.domainEntity.get(educationContentName).data.edfiXsd.xsd_ComplexTypes;
    expect(entityComplexTypes).toBeDefined();
    expect(R.head(R.head(entityComplexTypes).items).items.some(x => x.name === learningResourceName)).toBe(false);
  });

  it('should copy items from property and place them in the domain entity under EducationContent choice', () => {
    // $FlowIgnore - entity could be undefined
    const entityComplexTypes = metaEd.entity.domainEntity.get(educationContentName).data.edfiXsd.xsd_ComplexTypes;
    expect(entityComplexTypes).toBeDefined();
    const newItemGroup: ElementGroup = R.head(entityComplexTypes).items.find(x => x.isChoice != null);
    expect(newItemGroup).toBeTruthy();
    expect(newItemGroup.items.length).toBeGreaterThan(0);

    expect(R.head(elementGroup).items).toEqual(R.last(newItemGroup.items).items);
  });
});

import R from 'ramda';
import { DomainEntity, Common, MetaEdEnvironment, Namespace } from 'metaed-core';
import { newDomainEntity, newCommon, getEntityFromNamespace, newMetaEdEnvironment, newNamespace } from 'metaed-core';
import { ComplexType } from '../../src/model/schema/ComplexType';
import { ElementGroup } from '../../src/model/schema/ElementGroup';
import { enhance } from '../../src/diminisher/ModifyEducationContentLearningResourceToInlineSequenceDiminisher';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { newElement } from '../../src/model/schema/Element';
import { newElementGroup } from '../../src/model/schema/ElementGroup';
import { ComplexTypeItem } from '../../src/model/schema/ComplexTypeItem';

describe('when ModifyEducationContentLearningResourceToInlineSequenceDiminisher diminishes education content', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const educationContentName = 'EducationContent';
  const learningResourceName = 'LearningResource';
  let elementGroup: ComplexType[];

  beforeAll(() => {
    const domainEntity1: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: educationContentName,
      namespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [
            {
              ...newComplexType(),
              name: educationContentName,
              items: [
                {
                  ...newElementGroup(),
                  isChoice: true,
                  items: [
                    { ...newElement(), name: 'LearningResourceMetadataURI' },
                    { ...newElement(), name: learningResourceName },
                  ],
                },
              ],
            },
          ],
        },
      },
    };
    namespace.entity.domainEntity.set(educationContentName, domainEntity1);

    elementGroup = [
      {
        ...newComplexType(),
        name: educationContentName,
        items: [
          { ...newElement(), name: 'Item1' } as ComplexTypeItem,
          { ...newElementGroup(), isChoice: true, items: [{ ...newElement(), name: 'Item2' }] } as ComplexTypeItem,
        ],
      },
    ];
    const inlineCommon1: Common = {
      ...newCommon(),
      metaEdName: learningResourceName,
      namespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: elementGroup,
        },
      },
    };

    namespace.entity.common.set(inlineCommon1.metaEdName, inlineCommon1);
    metaEd.dataStandardVersion = '2.0.0';

    enhance(metaEd);
  });

  it('should clear complex types for LearningResource entity', (): void => {
    const entityComplexTypes: ComplexType[] = (getEntityFromNamespace(learningResourceName, namespace, 'common') as any).data
      .edfiXsd.xsdComplexTypes;
    expect(entityComplexTypes).toBeDefined();
    expect(entityComplexTypes).toHaveLength(0);
    expect(entityComplexTypes).toEqual([]);
  });

  it('should not have learning standard element', (): void => {
    const entityComplexTypes = (getEntityFromNamespace(educationContentName, namespace, 'domainEntity') as any).data.edfiXsd
      .xsdComplexTypes;
    expect(entityComplexTypes).toBeDefined();
    expect(R.head(R.head(entityComplexTypes).items).items.some((x) => x.name === learningResourceName)).toBe(false);
  });

  it('should copy items from property and place them in the domain entity under EducationContent choice', (): void => {
    const entityComplexTypes = (getEntityFromNamespace(educationContentName, namespace, 'domainEntity') as any).data.edfiXsd
      .xsdComplexTypes;
    expect(entityComplexTypes).toBeDefined();
    const newItemGroup: ElementGroup = R.head(entityComplexTypes).items.find((x) => x.isChoice != null);
    expect(newItemGroup).toBeTruthy();
    expect(newItemGroup.items.length).toBeGreaterThan(0);

    expect(R.head(elementGroup).items).toEqual(R.last(newItemGroup.items).items);
  });
});

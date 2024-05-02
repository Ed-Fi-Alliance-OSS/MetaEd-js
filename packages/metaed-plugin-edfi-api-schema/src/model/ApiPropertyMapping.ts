import deepFreeze from 'deep-freeze';
import { ModelType, PropertyType } from '@edfi/metaed-core';

/**
 * API shape metadata for a MetaEd property.
 */
export type ApiPropertyMapping = {
  /**
   * The metaEdName for this property.
   */
  metaEdName: string;
  /**
   * If this is a referential property, the type of the entity it references. Otherwise, the type of this simple property
   */
  metaEdType: PropertyType | ModelType;
  /**
   * The naming for this property when it is at the top level of the request body.
   */
  topLevelName: string;
  /**
   * The naming for this property when it is at the top level of the request body, and the naming pattern needs
   * collision resolution.
   */
  decollisionedTopLevelName: string;
  /**
   * The basic name of a property in the API.
   */
  fullName: string;
  /**
   * The pluralized version of the fullName
   */
  pluralizedFullName: string;
  /**
   * Whether the property is a reference collection.
   */
  isReferenceCollection: boolean;
  /**
   * The reference collection name, or empty string if not a reference collection
   */
  referenceCollectionName: string;
  /**
   * Whether the property is a descriptor collection.
   */
  isDescriptorCollection: boolean;
  /**
   * The descriptor collection name, or empty string if not a descriptor collection
   */
  descriptorCollectionName: string;
  /**
   * Whether the property is a common collection.
   */
  isCommonCollection: boolean;

  /**
   * Whether the property is a scalar common.
   */
  isScalarCommon: boolean;

  /**
   * Whether the property is an inline common.
   */
  isInlineCommon: boolean;

  /**
   * Whether the property is a choice.
   */
  isChoice: boolean;

  /**
   * Whether the property is a scalar reference.
   */
  isScalarReference: boolean;
};

export function newApiPropertyMapping(): ApiPropertyMapping {
  return {
    metaEdName: '',
    metaEdType: 'unknown',
    topLevelName: '',
    decollisionedTopLevelName: '',
    fullName: '',
    pluralizedFullName: '',
    isReferenceCollection: false,
    referenceCollectionName: '',
    isDescriptorCollection: false,
    descriptorCollectionName: '',
    isCommonCollection: false,
    isScalarCommon: false,
    isInlineCommon: false,
    isChoice: false,
    isScalarReference: false,
  };
}

export const NoApiPropertyMapping: ApiPropertyMapping = deepFreeze({
  ...newApiPropertyMapping(),
  metaEdName: 'NoApiPropertyMapping',
});

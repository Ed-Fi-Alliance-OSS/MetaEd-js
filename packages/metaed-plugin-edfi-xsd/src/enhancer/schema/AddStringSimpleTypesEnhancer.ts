import { MetaEdEnvironment, EnhancerResult, StringType } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { SimpleTypeBaseEdfiXsd } from '../../model/SimpleTypeBase';
import { ModelBaseEdfiXsd } from '../../model/ModelBase';
import { NoSimpleType } from '../../model/schema/SimpleType';
import { SimpleType } from '../../model/schema/SimpleType';
import { newStringSimpleType } from '../../model/schema/StringSimpleType';
import { newAnnotation } from '../../model/schema/Annotation';
import { typeGroupSimple } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddStringSimpleTypesEnhancer';

function createSchemaSimpleType(stringType: StringType): SimpleType {
  if (stringType.generatedSimpleType && stringType.minLength === '' && stringType.maxLength === '') {
    return NoSimpleType;
  }

  return {
    ...newStringSimpleType(),
    name: (stringType.data.edfiXsd as ModelBaseEdfiXsd).xsdMetaEdNameWithExtension(),
    annotation: { ...newAnnotation(), documentation: stringType.documentation, typeGroup: typeGroupSimple },
    baseType: 'xs:string',
    minLength: stringType.minLength,
    maxLength: stringType.maxLength,
  } as SimpleType;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'stringType') as StringType[]).forEach((stringType: StringType) => {
    (stringType.data.edfiXsd as SimpleTypeBaseEdfiXsd).xsdSimpleType = createSchemaSimpleType(stringType);
  });

  return {
    enhancerName,
    success: true,
  };
}

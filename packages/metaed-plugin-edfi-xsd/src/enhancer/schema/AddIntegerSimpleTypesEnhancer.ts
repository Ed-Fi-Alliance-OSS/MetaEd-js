import { MetaEdEnvironment, EnhancerResult, IntegerType } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { SimpleTypeBaseEdfiXsd } from '../../model/SimpleTypeBase';
import { ModelBaseEdfiXsd } from '../../model/ModelBase';
import { NoSimpleType } from '../../model/schema/SimpleType';
import { SimpleType } from '../../model/schema/SimpleType';
import { newIntegerSimpleType } from '../../model/schema/IntegerSimpleType';
import { newAnnotation } from '../../model/schema/Annotation';
import { typeGroupSimple } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddIntegerSimpleTypesEnhancer';

function createSchemaSimpleType(integerType: IntegerType): SimpleType {
  if (integerType.generatedSimpleType && integerType.minValue === '' && integerType.maxValue === '') {
    return NoSimpleType;
  }

  return {
    ...newIntegerSimpleType(),
    name: (integerType.data.edfiXsd as ModelBaseEdfiXsd).xsdMetaEdNameWithExtension(),
    annotation: { ...newAnnotation(), documentation: integerType.documentation, typeGroup: typeGroupSimple },
    baseType: integerType.isShort ? 'xs:short' : 'xs:int',
    minValue: integerType.minValue,
    maxValue: integerType.maxValue,
  } as SimpleType;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'integerType') as IntegerType[]).forEach((integerType: IntegerType) => {
    (integerType.data.edfiXsd as SimpleTypeBaseEdfiXsd).xsdSimpleType = createSchemaSimpleType(integerType);
  });

  return {
    enhancerName,
    success: true,
  };
}

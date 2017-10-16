// @flow
import type { MetaEdEnvironment, EnhancerResult, IntegerType } from '../../../../metaed-core/index';
import type { SimpleTypeBaseEdfiXsd } from '../../model/SimpleTypeBase';
import type { ModelBaseEdfiXsd } from '../../model/ModelBase';
import { NoSimpleType } from '../../model/schema/SimpleType';
import type { SimpleType } from '../../model/schema/SimpleType';
import { newIntegerSimpleType } from '../../model/schema/IntegerSimpleType';
import { newAnnotation } from '../../model/schema/Annotation';

const enhancerName: string = 'AddIntegerSimpleTypesEnhancer';

function createSchemaSimpleType(integerType: IntegerType): SimpleType {
  if (integerType.generatedSimpleType && integerType.minValue === '' && integerType.maxValue === '') {
    return NoSimpleType;
  }

  return Object.assign(newIntegerSimpleType(), {
    name: ((integerType.data.edfiXsd: any): ModelBaseEdfiXsd).xsd_MetaEdNameWithExtension(),
    annotation: Object.assign(newAnnotation(), {
      documentation: integerType.documentation,
      typeGroup: 'Simple',
    }),
    baseType: integerType.isShort ? 'xs:short' : 'xs:int',
    minValue: integerType.minValue,
    maxValue: integerType.maxValue,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.entity.integerType.forEach(integerType => {
    ((integerType.data.edfiXsd: any): SimpleTypeBaseEdfiXsd).xsd_SimpleType = createSchemaSimpleType(integerType);
  });

  return {
    enhancerName,
    success: true,
  };
}

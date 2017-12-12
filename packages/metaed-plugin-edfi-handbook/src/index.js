// @flow
import type { MetaEdPlugin } from 'metaed-core';
import { enhance as edfiHandbookRepositorySetup } from './model/EdfiHandbookRepository';
import { enhance as AssociationEnhancer } from './enhancer/AssociationMetaEdHandbookEnhancer';
import { enhance as AssociationSubclassEnhancer } from './enhancer/AssociationSubclassMetaEdHandbookEnhancer';
import { enhance as BooleanEnhancer } from './enhancer/BooleanMetaEdHandbookEnhancer';
import { enhance as ChoiceCommonEnhancer } from './enhancer/ChoiceCommonTypeMetaEdHandbookEnhancer';
import { enhance as CommonTypeEnhancer } from './enhancer/CommonTypeMetaEdHandbookEnhancer';
import { enhance as CurrencySimpleTypeEnhancer } from './enhancer/CurrencySimpleTypeMetaEdHandbookEnhancer';
import { enhance as DateEnhancer } from './enhancer/DateMetaEdHandbookEnhancer';
import { enhance as DecimalEnhancer } from './enhancer/DecimalMetaEdHandbookEnhancer';
import { enhance as DescriptorEnhancer } from './enhancer/DescriptorMetaEdHandbookEnhancer';
import { enhance as DomainEntityEnhancer } from './enhancer/DomainEntityMetaEdHandbookEnhancer';
import { enhance as DomainEntitySubclassEnhancer } from './enhancer/DomainEntitySubclassMetaEdHandbookEnhancer';
import { enhance as EnumerationEnhancer } from './enhancer/EnumerationMetaEdHandbookEnhancer';
import { enhance as InlineCommonEnhancer } from './enhancer/InlineCommonTypeMetaEdHandbookEnhancer';
import { enhance as IntegerEnhancer } from './enhancer/IntegerMetaEdHandbookEnhancer';
import { enhance as PercentSimpleEnhancer } from './enhancer/PercentSimpleTypeMetaEdHandbookEnhancer';
import { enhance as StringEnhancer } from './enhancer/StringMetaEdHandbookEnhancer';
import { enhance as TimeIntervalEnhancer } from './enhancer/TimeIntervalSimpleTypeMetaEdHandbookEnhancer';
import { enhance as TimeEnhancer } from './enhancer/TimeMetaEdHandbookEnhancer';
import { enhance as YearEnhancer } from './enhancer/YearMetaEdHandbookEnhancer';
import { generate as htmlGenerator } from './generator/MetaEdHandbookAsHtmlIndexGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [edfiHandbookRepositorySetup, AssociationEnhancer, AssociationSubclassEnhancer,
      BooleanEnhancer, ChoiceCommonEnhancer, CommonTypeEnhancer, CurrencySimpleTypeEnhancer,
      DateEnhancer, DecimalEnhancer, DescriptorEnhancer, DomainEntityEnhancer, DomainEntitySubclassEnhancer,
      EnumerationEnhancer, InlineCommonEnhancer, IntegerEnhancer, PercentSimpleEnhancer, StringEnhancer,
      TimeIntervalEnhancer, TimeEnhancer, YearEnhancer],
    generator: [htmlGenerator],
  };
}

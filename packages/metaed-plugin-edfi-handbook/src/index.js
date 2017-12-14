// @flow
import type { MetaEdPlugin } from 'metaed-core';
import { enhance as edfiHandbookRepositorySetup } from './model/EdfiHandbookRepository';
import { enhance as AssociationEnhancer } from './enhancer/AssociationMetaEdHandbookEnhancer';
import { enhance as AssociationSubclassEnhancer } from './enhancer/AssociationSubclassMetaEdHandbookEnhancer';
import { enhance as BooleanEnhancer } from './enhancer/BooleanMetaEdHandbookEnhancer';
import { enhance as ChoiceEnhancer } from './enhancer/ChoiceMetaEdHandbookEnhancer';
import { enhance as CommonEnhancer } from './enhancer/CommonMetaEdHandbookEnhancer';
import { enhance as CurrencyEnhancer } from './enhancer/CurrencyMetaEdHandbookEnhancer';
import { enhance as DateEnhancer } from './enhancer/DateMetaEdHandbookEnhancer';
import { enhance as DecimalEnhancer } from './enhancer/DecimalMetaEdHandbookEnhancer';
import { enhance as DescriptorEnhancer } from './enhancer/DescriptorMetaEdHandbookEnhancer';
import { enhance as DomainEntityEnhancer } from './enhancer/DomainEntityMetaEdHandbookEnhancer';
import { enhance as DomainEntitySubclassEnhancer } from './enhancer/DomainEntitySubclassMetaEdHandbookEnhancer';
import { enhance as EnumerationEnhancer } from './enhancer/EnumerationMetaEdHandbookEnhancer';
import { enhance as InlineCommonEnhancer } from './enhancer/InlineCommonMetaEdHandbookEnhancer';
import { enhance as IntegerEnhancer } from './enhancer/IntegerMetaEdHandbookEnhancer';
import { enhance as PercentEnhancer } from './enhancer/PercentMetaEdHandbookEnhancer';
import { enhance as StringEnhancer } from './enhancer/StringMetaEdHandbookEnhancer';
import { enhance as TimeIntervalEnhancer } from './enhancer/TimeIntervalMetaEdHandbookEnhancer';
import { enhance as TimeEnhancer } from './enhancer/TimeMetaEdHandbookEnhancer';
import { enhance as YearEnhancer } from './enhancer/YearMetaEdHandbookEnhancer';
import { generate as htmlGenerator } from './generator/MetaEdHandbookAsHtmlIndexGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [edfiHandbookRepositorySetup, AssociationEnhancer, AssociationSubclassEnhancer,
      BooleanEnhancer, ChoiceEnhancer, CommonEnhancer, CurrencyEnhancer,
      DateEnhancer, DecimalEnhancer, DescriptorEnhancer, DomainEntityEnhancer, DomainEntitySubclassEnhancer,
      EnumerationEnhancer, InlineCommonEnhancer, IntegerEnhancer, PercentEnhancer, StringEnhancer,
      TimeIntervalEnhancer, TimeEnhancer, YearEnhancer],
    generator: [htmlGenerator],
  };
}

import { MetaEdPlugin } from '@edfi/metaed-core';
import { newMetaEdPlugin } from '@edfi/metaed-core';

import { validate as noDomainEntityNamesThatStartWithExample } from './validator/NoDomainEntityNamesThatStartWithExample';

import { enhance as topLevelEntitySetupEnhancer } from './model/TopLevelEntity';
import { enhance as domainEntityExampleNameEnhancer } from './enhancer/DomainEntityExampleNameEnhancer';

import { generate as domainEntityNameGenerator } from './generator/DomainEntityNameGenerator';

export function initialize(): MetaEdPlugin {
  return {
    ...newMetaEdPlugin(),
    validator: [noDomainEntityNamesThatStartWithExample],
    enhancer: [topLevelEntitySetupEnhancer, domainEntityExampleNameEnhancer],
    generator: [domainEntityNameGenerator],
  };
}

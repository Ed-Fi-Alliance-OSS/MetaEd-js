import { MetaEdPlugin } from 'metaed-core';
import { newMetaEdPlugin } from 'metaed-core';

import { validate as noDomainEntityNamesThatStartWithExample } from './validator/NoDomainEntityNamesThatStartWithExample';

import { enhance as topLevelEntitySetupEnhancer } from './model/TopLevelEntity';
import { enhance as domainEntityExampleNameEnhancer } from './enhancer/DomainEntityExampleNameEnhancer';

import { generate as domainEntityNameGenerator } from './generator/DomainEntityNameGenerator';

export function initialize(): MetaEdPlugin {
  return Object.assign(newMetaEdPlugin(), {
    validator: [noDomainEntityNamesThatStartWithExample],
    enhancer: [topLevelEntitySetupEnhancer, domainEntityExampleNameEnhancer],
    generator: [domainEntityNameGenerator],
  });
}

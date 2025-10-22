// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPlugin } from '@edfi/metaed-core';
import { validatorList } from './validator/ValidatorList';
import { enhancerList } from './enhancer/EnhancerList';
import { generate as ApiModelGenerator } from './generator/apiModel/ApiModelGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: validatorList(),
    enhancer: enhancerList(),
    generator: [ApiModelGenerator],
    shortName: 'edfiOdsApi',
    configurationSchemas: new Map(),
  };
}

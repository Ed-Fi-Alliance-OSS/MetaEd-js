// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { Validator } from '../validator/Validator';
import { Enhancer } from '../enhancer/Enhancer';
import { Generator } from '../generator/Generator';
import { ConfigurationSchema } from './ConfigurationSchema';

/**
 *
 */
export type MetaEdPlugin = {
  validator: Validator[];
  enhancer: Enhancer[];
  generator: Generator[];
  shortName: string;
  configurationSchemas?: ConfigurationSchema;
};

/**
 *
 */
export function newMetaEdPlugin(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [],
    generator: [],
    shortName: '',
    configurationSchemas: new Map(),
  };
}

/**
 *
 */
export const NoMetaEdPlugin = deepFreeze(newMetaEdPlugin());

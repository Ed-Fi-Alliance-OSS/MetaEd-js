// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import Joi from 'joi';
import { allTopLevelEntityModelTypes } from '../model/ModelType';
import { ModelType } from '../model/ModelType';
import { JoiSchema } from './JoiTypes';

/**
 * Key is configuration rule name, value is a schema for validation of the rule
 */
export type ConfigurationSchema = Map<string, JoiSchema>;

/**
 * Defines criteria for matching entities in configuration rules.
 * Used to specify which entities a configuration rule should apply to.
 */
export interface ConfigurationMatches {
  entity: ModelType[] | ModelType;
  namespace?: string[] | string;
  core?: boolean;
  extensions?: boolean;
  entityName?: string[] | string;
}

/**
 * Represents a single configuration rule with matching criteria and associated data.
 * Can be applied globally or to specific entities based on matches.
 */
export interface ConfigurationRule {
  rule: string;
  matches?: ConfigurationMatches[] | ConfigurationMatches;
  data: any;
}

/**
 * Top-level structure for configuration files containing configuration rules.
 */
export interface ConfigurationStructure {
  config: ConfigurationRule[] | ConfigurationRule;
}

/**
 * Joi validation schema for configuration structure.
 * Validates configuration rules including entity types, namespaces, and matching criteria.
 */
export const configurationStructureSchema: JoiSchema = Joi.object().keys({
  config: Joi.array()
    .items(
      Joi.object().keys({
        rule: Joi.string().required(),
        matches: Joi.array()
          .items(
            Joi.object()
              .keys({
                entity: Joi.array()
                  .items(
                    Joi.string()
                      .valid(...allTopLevelEntityModelTypes)
                      .disallow('unknown'),
                  )
                  .single()
                  .required(),
                namespace: Joi.array().items(Joi.string()).single(),
                core: Joi.boolean(),
                extensions: Joi.boolean(),
                entityName: Joi.array().items(Joi.string()).single(),
              })
              .without('namespace', ['core', 'extensions'])
              .with('entityName', ['entity']),
          )
          .single()
          .optional(),
        data: Joi.any().required(),
      }),
    )
    .single()
    .required(),
});

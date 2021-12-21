import Joi from 'joi';
import { allTopLevelEntityModelTypes } from '../model/ModelType';
import { ModelType } from '../model/ModelType';
import { JoiSchema } from './JoiTypes';

/**
 * Key is configuration rule name, value is a schema for validation of the rule
 */
export type ConfigurationSchema = Map<string, JoiSchema>;

/**
 *
 */
export interface ConfigurationMatches {
  entity: ModelType[] | ModelType;
  namespace?: string[] | string;
  core?: boolean;
  extensions?: boolean;
  entityName?: string[] | string;
}

/**
 *
 */
export interface ConfigurationRule {
  rule: string;
  matches?: ConfigurationMatches[] | ConfigurationMatches;
  data: any;
}

export interface ConfigurationStructure {
  config: ConfigurationRule[] | ConfigurationRule;
}

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
                  .items(Joi.string().only(allTopLevelEntityModelTypes).disallow('unknown'))
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

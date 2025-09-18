// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import Joi from 'joi';

/**
 * Configuration for identity-based security elements that searches through
 * all identity properties to discover security elements based on role names.
 */
export type EducationOrganizationIdentitySecurableElementsConfig = {
  versionRange?: string;
  roleName: string;
  description?: string;
};

/**
 * Configuration for a single securable element with direct property mapping.
 */
type SecurableElement = {
  propertyPath: string;
  requiredIdentityProperty: string;
  description?: string;
};

/**
 * Configuration for direct property mapping security elements.
 */
export type EducationOrganizationSecurableElementsConfig = {
  versionRange?: string;
  mode?: 'append' | 'replace';
  securableElements: SecurableElement[];
};

/**
 * Creates a Joi validation schema for education organization securable elements configuration.
 * This schema validates the direct property mapping security configuration that specifies
 * which properties should be treated as securable elements.
 */
export function educationOrganizationSecurableElementsSchema(): Joi.ObjectSchema {
  return Joi.object().keys({
    versionRange: Joi.string(),
    mode: Joi.string().valid('append', 'replace').default('append'),
    securableElements: Joi.array()
      .items(
        Joi.object().keys({
          propertyPath: Joi.string().required(),
          requiredIdentityProperty: Joi.string().required(),
          description: Joi.string(),
        }),
      )
      .min(1)
      .required(),
  });
}

/**
 * Creates a Joi validation schema for education organization identity securable elements configuration.
 * This schema validates the identity-based security configuration that searches through
 * all identity properties to discover security elements based on role names.
 */
export function educationOrganizationIdentitySecurableElementsSchema(): Joi.ObjectSchema {
  return Joi.object().keys({
    versionRange: Joi.string(),
    roleName: Joi.string().required(),
    description: Joi.string(),
  });
}

// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ValidationFailure } from '../validator/ValidationFailure';

/**
 * EnhancerResult is the object returned by an Enhancer.
 *
 * **enhancerName** is the name of the Enhancer and should be the same as the Enhancer filename.
 *
 * **success** is true if the enhancer ran to completion successfully.
 *
 * **validationFailure** is an optional ValidationFailure, if the Enhancer can communicate as a validation
 * failure what would otherwise be a failure of the Enhancer.  Enhancers can be successful yet have a ValidationFailure.
 */
export interface EnhancerResult {
  enhancerName: string;
  success: boolean;
  validationFailure?: ValidationFailure;
}

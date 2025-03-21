// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult } from './EnhancerResult';
import { MetaEdEnvironment } from '../MetaEdEnvironment';

/**
 * Enhancer is a function that makes a discrete addition or modification to entities or properties.  They are named
 * after the behavior they perform.  They must never modify data that is outside the plugin they belong to.
 * They take a MetaEdEnvironment and return an EnhancerResult.
 */
export type Enhancer = (metaEd: MetaEdEnvironment) => EnhancerResult;

// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { GeneratorResult } from './GeneratorResult';

/**
 * Generator is an async function that creates artifacts.  They should not contain much logic, but instead take
 * objects shaped by Enhancers and provide them to logic-less text templates or libraries that create binary streams.
 * They take a MetaEdEnvironment and return a Promise of a GeneratorResult.
 */
export type Generator = (metaEd: MetaEdEnvironment) => Promise<GeneratorResult>;

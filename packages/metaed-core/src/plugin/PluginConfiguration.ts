// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ConfigurationStructure } from './ConfigurationSchema';

/**
 * Represents a loaded plugin configuration with its source file information.
 * Contains both the parsed configuration structure and the file path it was loaded from.
 */
export interface PluginConfiguration {
  filepath: string;
  configObject: ConfigurationStructure;
}

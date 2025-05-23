// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EntityProperty,
  ReferentialProperty,
  PluginEnvironment,
  Namespace,
  PropertyType,
  getAllProperties,
} from '@edfi/metaed-core';
import { EdfiHandbookRepository } from '../model/EdfiHandbookRepository';

const referenceProperty: PropertyType[] = ['choice', 'common', 'descriptor', 'association', 'domainEntity'];
const isReferenceProperty = (property: EntityProperty): boolean => referenceProperty.includes(property.type);

export function getAllReferentialProperties(metaEd: MetaEdEnvironment): ReferentialProperty[] {
  const allProperties: EntityProperty[] = getAllProperties(metaEd.propertyIndex);
  return allProperties.filter(isReferenceProperty) as ReferentialProperty[];
}

export function pluginEnvironment(metaEd: MetaEdEnvironment): PluginEnvironment | undefined {
  return metaEd.plugin.get('edfiHandbook') as PluginEnvironment | undefined;
}

export function edfiHandbookRepositoryForNamespace(
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
): EdfiHandbookRepository | null {
  const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd);
  // if plugin not there, something's very wrong
  if (plugin == null) return null;
  const handbookRepository: EdfiHandbookRepository | undefined = plugin.namespace.get(namespace);
  // if repository for namespace not there, something's very wrong
  return handbookRepository == null ? null : handbookRepository;
}

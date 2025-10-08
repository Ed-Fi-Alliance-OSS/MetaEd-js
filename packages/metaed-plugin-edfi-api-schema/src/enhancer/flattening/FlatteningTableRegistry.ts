// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, MetaEdPropertyPath, TopLevelEntity } from '@edfi/metaed-core';
import { adjustedFullPropertyName } from '../../Utility';
import { buildFlatteningPropertyChains } from './FlatteningPropertyChainBuilder';
import { FlatteningPropertyChain } from '../../model/flattening/FlatteningPropertyChain';

/**
 * Identifiers for flattening tables, using property paths (or empty string for the root table).
 */
export type TablePath = '' | MetaEdPropertyPath;

export const ROOT_TABLE_PATH: TablePath = '' as TablePath;

/**
 * Represents the table metadata derived for a collection/common property, capturing its MetaEd path and ancestry.
 */
export type FlatteningTableNode = {
  tablePath: MetaEdPropertyPath;
  property: EntityProperty;
  parentPath: TablePath;
  propertyChain: EntityProperty[];
};

/**
 * Determines whether the supplied property introduces a flattening table.
 */
function isTableProperty(property: EntityProperty): boolean {
  if (property.type === 'inlineCommon' || property.type === 'choice') return false;
  if (property.isCollection || property.isOptionalCollection || property.isRequiredCollection) return true;
  return property.type === 'common';
}

function propertyChainPath(chain: EntityProperty[]): MetaEdPropertyPath {
  return chain.map((property) => property.fullPropertyName).join('.') as MetaEdPropertyPath;
}

/**
 * Collects table nodes for the entity, recording property paths and parent relationships.
 */
export function collectTableNodes(entity: TopLevelEntity): Map<MetaEdPropertyPath, FlatteningTableNode> {
  const nodes: Map<MetaEdPropertyPath, FlatteningTableNode> = new Map();
  const propertyChains: FlatteningPropertyChain[] = buildFlatteningPropertyChains(entity);

  propertyChains.forEach((chain) => {
    const pathProperties: EntityProperty[] = [];
    const tableStack: TablePath[] = [ROOT_TABLE_PATH];

    chain.propertyChain.forEach((property) => {
      pathProperties.push(property);
      if (!isTableProperty(property)) return;

      const propertyPath: MetaEdPropertyPath = propertyChainPath(pathProperties);
      const parentPath: TablePath = tableStack[tableStack.length - 1];
      if (!nodes.has(propertyPath)) {
        nodes.set(propertyPath, {
          tablePath: propertyPath,
          property,
          parentPath,
          propertyChain: [...pathProperties],
        });
      }

      if (tableStack[tableStack.length - 1] !== propertyPath) {
        tableStack.push(propertyPath);
      }
    });
  });

  return nodes;
}

function tableDepth(node: FlatteningTableNode): number {
  if (node.propertyChain.length === 0) return 0;
  return node.propertyChain.slice(0, -1).filter((candidate) => isTableProperty(candidate)).length;
}

/**
 * Sorts table nodes from shallowest to deepest to facilitate table traversal.
 */
export function sortTableNodes(nodes: Map<MetaEdPropertyPath, FlatteningTableNode>): FlatteningTableNode[] {
  return Array.from(nodes.values()).sort((left, right) => {
    const leftDepth = tableDepth(left);
    const rightDepth = tableDepth(right);
    return leftDepth - rightDepth;
  });
}

function inlinePrefix(property: EntityProperty): string {
  const candidate = property.shortenTo !== '' ? property.shortenTo : property.roleName;
  if (candidate === property.metaEdName) return '';
  return candidate;
}

/**
 * Derives the suffix for a table base name by analysing the property chain that introduces it.
 */
export function deriveTableSuffix(node: FlatteningTableNode): string {
  const { property, propertyChain } = node;
  let suffix = adjustedFullPropertyName(property);

  const parentIndex: number =
    propertyChain
      .slice(0, -1)
      .map((candidate, index) => ({ candidate, index }))
      .reverse()
      .find(({ candidate }) => isTableProperty(candidate))?.index ?? -1;

  if (parentIndex !== -1) {
    const parentProperty = propertyChain[parentIndex];
    const parentSuffix = adjustedFullPropertyName(parentProperty);
    if (suffix.startsWith(parentSuffix)) {
      const trimmed = suffix.slice(parentSuffix.length);
      if (trimmed !== '') {
        suffix = trimmed;
      }
    }
  }

  for (let index = propertyChain.length - 2; index > parentIndex; index -= 1) {
    const ancestor = propertyChain[index];

    if (ancestor.type === 'inlineCommon' || ancestor.type === 'choice') {
      const prefix = inlinePrefix(ancestor);
      if (prefix !== '' && !suffix.startsWith(prefix)) {
        suffix = `${prefix}${suffix}`;
      }
    } else if (
      ancestor.type === 'common' ||
      ancestor.isCollection ||
      ancestor.isOptionalCollection ||
      ancestor.isRequiredCollection
    ) {
      const ancestorSuffix = adjustedFullPropertyName(ancestor);
      if (!suffix.startsWith(ancestorSuffix)) {
        suffix = `${ancestorSuffix}${suffix}`;
      }
    }
  }

  return suffix;
}

// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, MetaEdPropertyPath, TopLevelEntity } from '@edfi/metaed-core';
import { adjustedFullPropertyName, canonicalRoleNamePrefix } from '../../Utility';
import { buildFlatteningPropertyChains } from './FlatteningPropertyChainBuilder';
import { FlatteningPropertyChain } from '../../model/flattening/FlatteningPropertyChain';
import { FlatteningTableNode, TablePath } from '../../model/flattening/FlatteningTableNode';

export const ROOT_TABLE_PATH: TablePath = '' as TablePath;

/**
 * Determines whether the supplied property introduces its own flattening table.
 */
function isTableProperty(property: EntityProperty): boolean {
  if (property.type === 'inlineCommon' || property.type === 'choice') return false;
  if (property.isOptionalCollection || property.isRequiredCollection) return true;
  return property.type === 'common';
}

/**
 * Builds a dotted MetaEd path for the provided property chain.
 */
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
      // Record the table the first time we encounter the property path; subsequent visits share the same node.
      if (!nodes.has(propertyPath)) {
        nodes.set(propertyPath, {
          tablePath: propertyPath,
          property,
          parentPath,
          propertyChain: [...pathProperties],
        });
      }

      // Maintain the stack of ancestor tables so deeper collections correctly identify their parents.
      if (tableStack[tableStack.length - 1] !== propertyPath) {
        tableStack.push(propertyPath);
      }
    });
  });

  return nodes;
}

/**
 * Counts the number of ancestor table-defining properties for the node.
 */
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

/**
 * Produces a prefix for inline properties while ignoring redundant MetaEd name matches.
 */
function inlinePrefix(property: EntityProperty): string {
  const candidate = canonicalRoleNamePrefix(property);
  if (candidate === property.metaEdName) return '';
  return candidate;
}

/**
 * Derives the suffix for a table base name by analyzing the property chain that introduces it.
 */
export function deriveTableSuffix(node: FlatteningTableNode): string {
  const { property, propertyChain } = node;
  let suffix = adjustedFullPropertyName(property);

  // Locate the nearest ancestor that materializes a table so we can trim repeated prefixes.
  const parentIndex: number =
    propertyChain
      .slice(0, -1)
      .map((candidate, index) => ({ candidate, index }))
      .reverse()
      .find(({ candidate }) => isTableProperty(candidate))?.index ?? -1;

  if (parentIndex !== -1) {
    const parentProperty = propertyChain[parentIndex];
    const parentSuffix = adjustedFullPropertyName(parentProperty);
    // Drop the parent's suffix when the child repeats it to avoid doubled names.
    if (suffix.startsWith(parentSuffix)) {
      const trimmed = suffix.slice(parentSuffix.length);
      if (trimmed !== '') {
        suffix = trimmed;
      }
    }
  }

  // Walk intermediate ancestors, adding prefixes from inline containers and table-defining properties
  // that did not already contribute to the suffix. This ensures inline commons/choices retain naming context
  // while preserving unique table names for nested collections.
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

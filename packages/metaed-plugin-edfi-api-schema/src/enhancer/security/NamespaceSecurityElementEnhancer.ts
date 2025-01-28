import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  SharedString,
  SharedStringProperty,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { JsonPath } from '../../model/api-schema/JsonPath';
import { JsonPathPropertyPair, JsonPathsInfo } from '../../model/JsonPathsMapping';

/**
 * Finds the Namespace SharedStrings on an entity that can be Namespace security elements for the document.
 *
 * Namespace properties in the Data Standard are URI SharedString properties named Namespace.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Hardcoded find of the URI SharedString
  const uriSharedString: SharedString | undefined = metaEd.namespace.get('EdFi')?.entity.sharedString.get('URI');
  if (uriSharedString == null) {
    throw new Error(
      'NamespaceSecurityAttributeEnhancer: Fatal Error: SharedString URI not found in EdFi Data Standard project',
    );
  }

  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      // Using Set to remove duplicates
      const result: Set<JsonPath> = new Set();

      const { allJsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

      Object.values(allJsonPathsMapping).forEach((jsonPathsInfo: JsonPathsInfo) => {
        jsonPathsInfo.jsonPathPropertyPairs.forEach((jsonPathPropertyPair: JsonPathPropertyPair) => {
          // Needs to be a SharedString property
          if (jsonPathPropertyPair.sourceProperty.type !== 'sharedString') return;

          // Needs to be referencing URI SharedString
          const sourceProperty: SharedStringProperty = jsonPathPropertyPair.sourceProperty as SharedStringProperty;
          if (sourceProperty.referencedEntity !== uriSharedString) return;

          // Needs to be an identity
          if (!sourceProperty.isPartOfIdentity) return;

          // Needs to not be role named
          if (sourceProperty.roleName !== '') return;

          // Finally, needs to be named Namespace
          if (sourceProperty.metaEdName === 'Namespace') {
            result.add(jsonPathPropertyPair.jsonPath);
          }
        });
      });

      (entity.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurityElements = [...result].sort();
    },
  );

  // Descriptors all have Namespace security elements
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((descriptor) => {
    (descriptor.data.edfiApiSchema as EntityApiSchemaData).namespaceSecurityElements = ['$.namespace' as JsonPath];
  });

  return {
    enhancerName: 'NamespaceSecurityElementEnhancer',
    success: true,
  };
}

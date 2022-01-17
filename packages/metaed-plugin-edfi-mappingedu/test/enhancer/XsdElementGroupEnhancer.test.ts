import { Namespace, MetaEdEnvironment } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import {
  newComplexType,
  newSchemaContainer,
  newSchemaSection,
  newSimpleType,
  typeGroupAssociation,
  typeGroupBase,
  typeGroupCommon,
  typeGroupDescriptor,
  typeGroupDescriptorExtendedReference,
  typeGroupDomainEntity,
  typeGroupEnumeration,
  typeGroupExtendedReference,
  typeGroupIdentity,
  typeGroupLookup,
  typeGroupSimple,
} from '@edfi/metaed-plugin-edfi-xsd';
import { ComplexType, SimpleType } from '@edfi/metaed-plugin-edfi-xsd';
import { dataStandardNamespaceName, pluginEnvironmentRepositoryForNamespace } from '../../src/enhancer/EnhancerHelper';
import { enhance } from '../../src/enhancer/XsdElementGroupEnhancer';
import { addEdFiMappingEduRepositoryTo } from '../../src/model/EdFiMappingEduRepository';
import { EdFiMappingEduRepository } from '../../src/model/EdFiMappingEduRepository';

describe('when enhancing entity definitions', (): void => {
  let pluginNamespace: EdFiMappingEduRepository;
  const associationName = 'AssociationName';
  const commonName = 'CommonName';
  const baseName = 'BaseName;';
  const descriptorName = 'DescriptorName';
  const descriptorExtendedReferenceName = 'DescriptorExtendedReferenceName';
  const domainEntityName = 'DomainEntityName';
  const enumerationName = 'EnumerationName';
  const extendedReferenceName = 'ExtendedReferenceName';
  const identityName = 'IdentityName';
  const lookupName = 'LookupName';
  const simpleName = 'SimpleName';

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: dataStandardNamespaceName,
      data: { edfiXsd: { xsdSchema: newSchemaContainer() } },
    };

    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [{ ...newComplexType(), annotation: { typeGroup: typeGroupAssociation }, name: associationName }],
    });
    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [{ ...newComplexType(), annotation: { typeGroup: typeGroupBase }, name: baseName }],
    });
    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [{ ...newComplexType(), annotation: { typeGroup: typeGroupCommon }, name: commonName }],
    });
    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [{ ...newComplexType(), annotation: { typeGroup: typeGroupDescriptor }, name: descriptorName }],
    });
    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [
        {
          ...newComplexType(),
          annotation: { typeGroup: typeGroupDescriptorExtendedReference },
          name: descriptorExtendedReferenceName,
        },
      ],
    });
    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [{ ...newComplexType(), annotation: { typeGroup: typeGroupDomainEntity }, name: domainEntityName }],
    });
    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [{ ...newSimpleType(), annotation: { typeGroup: typeGroupEnumeration }, name: enumerationName }],
    });
    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [
        { ...newComplexType(), annotation: { typeGroup: typeGroupExtendedReference }, name: extendedReferenceName },
      ],
    });
    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [{ ...newComplexType(), annotation: { typeGroup: typeGroupIdentity }, name: identityName }],
    });
    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [{ ...newComplexType(), annotation: { typeGroup: typeGroupLookup }, name: lookupName }],
    });
    namespace.data.edfiXsd.xsdSchema.sections.push({
      ...newSchemaSection(),
      complexTypes: [{ ...newSimpleType(), annotation: { typeGroup: typeGroupSimple }, name: simpleName }],
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiMappingEduRepositoryTo(metaEd);
    enhance(metaEd);

    pluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, namespace) as any;
  });

  it('should create plugin repository', (): void => {
    expect(pluginNamespace).toBeDefined();
    expect(pluginNamespace.xsdElement).toBeDefined();
    expect(pluginNamespace.xsdElement.association).toBeDefined();
    expect(pluginNamespace.xsdElement.base).toBeDefined();
    expect(pluginNamespace.xsdElement.common).toBeDefined();
    expect(pluginNamespace.xsdElement.descriptor).toBeDefined();
    expect(pluginNamespace.xsdElement.descriptorExtendedReference).toBeDefined();
    expect(pluginNamespace.xsdElement.domainEntity).toBeDefined();
    expect(pluginNamespace.xsdElement.enumeration).toBeDefined();
    expect(pluginNamespace.xsdElement.extendedReference).toBeDefined();
    expect(pluginNamespace.xsdElement.identity).toBeDefined();
    expect(pluginNamespace.xsdElement.lookup).toBeDefined();
    expect(pluginNamespace.xsdElement.simple).toBeDefined();
  });

  it.each([
    ['association', typeGroupAssociation, associationName],
    ['base', typeGroupBase, baseName],
    ['common', typeGroupCommon, commonName],
    ['descriptor', typeGroupDescriptor, descriptorName],
    ['descriptorExtendedReference', typeGroupDescriptorExtendedReference, descriptorExtendedReferenceName],
    ['domainEntity', typeGroupDomainEntity, domainEntityName],
    ['enumeration', typeGroupEnumeration, enumerationName],
    ['extendedReference', typeGroupExtendedReference, extendedReferenceName],
    ['identity', typeGroupIdentity, identityName],
    ['lookup', typeGroupLookup, lookupName],
    ['simple', typeGroupSimple, simpleName],
  ])("should place %s in the '%s' element group repository", (typeName: string, typeGroup: string, elementName: string) => {
    const xsdElement: ComplexType | SimpleType = pluginNamespace.xsdElement[typeName].get(elementName) as any;
    expect(xsdElement).toBeDefined();
    expect(xsdElement.name).toBe(elementName);
    expect(xsdElement.annotation.typeGroup).toBe(typeGroup);
  });
});

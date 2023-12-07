import { Enhancer } from '@edfi/metaed-core';

import { enhance as descriptor } from '../model/Descriptor';
import { enhance as edFiOdsEntityRepository } from '../model/EdFiOdsRelationalEntityRepository';
import { enhance as topLevelEntity } from '../model/TopLevelEntity';

import { enhance as descriptorProperty } from '../model/property/DescriptorProperty';
import { enhance as entityProperty } from '../model/property/EntityProperty';
import { enhance as enumerationProperty } from '../model/property/EnumerationProperty';
import { enhance as referenceProperty } from '../model/property/ReferenceProperty';

import { enhance as associationExtensionTableEnhancer } from './table/AssociationExtensionTableEnhancer';
import { enhance as associationSubclassTableEnhancer } from './table/AssociationSubclassTableEnhancer';
import { enhance as associationTableEnhancer } from './table/AssociationTableEnhancer';
import { enhance as baseDescriptorTableCreatingEnhancer } from './table/BaseDescriptorTableEnhancer';
import { enhance as descriptorTableEnhancer } from './table/DescriptorTableEnhancer';
import { enhance as discriminatorColumnFlaggingEnhancer } from './table/DiscriminatorColumnFlaggingEnhancer';
import { enhance as domainEntityExtensionTableEnhancer } from './table/DomainEntityExtensionTableEnhancer';
import { enhance as domainEntitySubclassTableEnhancer } from './table/DomainEntitySubclassTableEnhancer';
import { enhance as domainEntityTableEnhancer } from './table/DomainEntityTableEnhancer';
import { enhance as enumerationTableEnhancer } from './table/EnumerationTableEnhancer';
import { enhance as schoolYearEnumerationTableEnhancer } from './table/SchoolYearEnumerationTableEnhancer';

import { enhance as createUsisFromUniqueIdsEnhancer } from './CreateUsisFromUniqueIdsEnhancer';
import { enhance as descriptorMapTypeRowEnhancer } from './DescriptorMapTypeRowEnhancer';
import { enhance as enumerationRowEnhancer } from './EnumerationRowEnhancer';
import { enhance as foreignKeyCreatingTableEnhancer } from './ForeignKeyCreatingTableEnhancer';
import { enhance as foreignKeyReverseIndexEnhancerV6dot1 } from './ForeignKeyReverseIndexEnhancerV6dot1';
import { enhance as foreignKeyReverseIndexEnhancerV7 } from './ForeignKeyReverseIndexEnhancerV7';
import { enhance as foreignKeyReverseIndexEnhancer } from './ForeignKeyReverseIndexEnhancer';
import { enhance as odsTableIdEnhancer } from './OdsTableIdEnhancer';
import { enhance as schoolYearEnumerationRowEnhancer } from './SchoolYearEnumerationRowEnhancer';
import { enhance as topLevelEntityBaseReferenceEnhancer } from './TopLevelEntityBaseReferenceEnhancer';
import { enhance as commonSubclassBaseReferenceEnhancer } from './CommonSubclassBaseReferenceEnhancer';
import { enhance as updateCascadeTopLevelEntityEnhancer } from './UpdateCascadeTopLevelEntityEnhancer';
import { enhance as foreignKeyForeignTableReferenceEnhancer } from './ForeignKeyForeignTableReferenceEnhancer';

import { enhance as columnDeprecationEnhancer } from './ColumnDeprecationEnhancer';
import { enhance as tableDeprecationEnhancer } from './TableDeprecationEnhancer';

import { enhance as foreignKeyIsIdentifyingEnhancer } from './ForeignKeyIsIdentifyingEnhancer';
import { enhance as educationOrganizationIdColumnEnhancer } from './EducationOrganizationIdColumnEnhancer';

export function preTableCreationEnhancerList(): Enhancer[] {
  return [
    // Property Collection Cloning Phase
    edFiOdsEntityRepository,
    topLevelEntity,

    // Builder Post Processing Phase
    topLevelEntityBaseReferenceEnhancer,
    commonSubclassBaseReferenceEnhancer,
    descriptor,

    // Builder Post Processing Phase 2
    entityProperty,
    descriptorProperty,
    enumerationProperty,
    referenceProperty,
    odsTableIdEnhancer,
    createUsisFromUniqueIdsEnhancer,

    // Static Database Item Creation Phase
    baseDescriptorTableCreatingEnhancer,

    updateCascadeTopLevelEntityEnhancer,
  ];
}

function tableCreationEnhancerList(): Enhancer[] {
  return [
    // Table Creation Phase
    associationSubclassTableEnhancer,
    associationTableEnhancer,
    descriptorTableEnhancer,
    domainEntitySubclassTableEnhancer,
    domainEntityTableEnhancer,
    enumerationTableEnhancer,
    schoolYearEnumerationTableEnhancer,

    associationExtensionTableEnhancer,
    domainEntityExtensionTableEnhancer,
  ];
}

export function enhancerList(): Enhancer[] {
  return [
    ...preTableCreationEnhancerList(),

    ...tableCreationEnhancerList(),
    // Foreign Key Creation Phase
    foreignKeyCreatingTableEnhancer,

    // Row Population Phase
    enumerationRowEnhancer,
    schoolYearEnumerationRowEnhancer,
    descriptorMapTypeRowEnhancer,

    // Post Ods Creation Phase
    foreignKeyForeignTableReferenceEnhancer,
    foreignKeyIsIdentifyingEnhancer,
    educationOrganizationIdColumnEnhancer,

    foreignKeyReverseIndexEnhancerV6dot1,
    foreignKeyReverseIndexEnhancerV7,
    foreignKeyReverseIndexEnhancer,

    discriminatorColumnFlaggingEnhancer,
    columnDeprecationEnhancer,
    tableDeprecationEnhancer,
  ];
}

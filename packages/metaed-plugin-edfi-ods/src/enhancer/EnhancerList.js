// @flow
import type { Enhancer } from 'metaed-core';

import { enhance as associationExtension } from '../model/AssociationExtension';
import { enhance as commonExtension } from '../model/CommonExtension';
import { enhance as descriptor } from '../model/Descriptor';
import { enhance as domainEntityExtension } from '../model/DomainEntityExtension';
import { enhance as edFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import { enhance as topLevelEntity } from '../model/TopLevelEntity';

import { enhance as descriptorProperty } from '../model/property/DescriptorProperty';
import { enhance as entityProperty } from '../model/property/EntityProperty';
import { enhance as enumerationProperty } from '../model/property/EnumerationProperty';
import { enhance as referenceProperty } from '../model/property/ReferenceProperty';

import { enhance as associationExtensionTableEnhancer } from '../enhancer/table/AssociationExtensionTableEnhancer';
import { enhance as associationSubclassTableEnhancer } from '../enhancer/table/AssociationSubclassTableEnhancer';
import { enhance as associationTableEnhancer } from '../enhancer/table/AssociationTableEnhancer';
import { enhance as baseDescriptorTableCreatingEnhancer } from '../enhancer/table/BaseDescriptorTableCreatingEnhancer';
import { enhance as descriptorTableEnhancer } from '../enhancer/table/DescriptorTableEnhancer';
import { enhance as domainEntityExtensionTableEnhancer } from '../enhancer/table/DomainEntityExtensionTableEnhancer';
import { enhance as domainEntitySubclassTableEnhancer } from '../enhancer/table/DomainEntitySubclassTableEnhancer';
import { enhance as domainEntityTableEnhancer } from '../enhancer/table/DomainEntityTableEnhancer';
import { enhance as enumerationTableEnhancer } from '../enhancer/table/EnumerationTableEnhancer';
import { enhance as schoolYearEnumerationTableEnhancer } from '../enhancer/table/SchoolYearEnumerationTableEnhancer';

import { enhance as createUsisFromUniqueIdsEnhancer } from '../enhancer/CreateUsisFromUniqueIdsEnhancer';
import { enhance as deleteTriggerEnhancer } from '../enhancer/DeleteTriggerEnhancer';
import { enhance as descriptorMapTypeRowEnhancer } from '../enhancer/DescriptorMapTypeRowEnhancer';
import { enhance as enumerationRowEnhancer } from '../enhancer/EnumerationRowEnhancer';
import { enhance as foreignKeyCreatingTableEnhancer } from '../enhancer/ForeignKeyCreatingTableEnhancer';
import { enhance as foreignKeyReverseIndexEnhancer } from '../enhancer/ForeignKeyReverseIndexEnhancer';
import { enhance as odsTableNameEnhancer } from '../enhancer/OdsTableNameEnhancer';
import { enhance as schoolYearEnumerationRowEnhancer } from '../enhancer/SchoolYearEnumerationRowEnhancer';
import { enhance as templateSpecificTablePropertyEnhancer } from '../enhancer/TemplateSpecificTablePropertyEnhancer';
import { enhance as topLevelEntityBaseReferenceEnhancer } from '../enhancer/TopLevelEntityBaseReferenceEnhancer';
import { enhance as updateCascadeTopLevelEntityEnhancer } from '../enhancer/UpdateCascadeTopLevelEntityEnhancer';

import { enhance as addApiTopLevelResourceColumnsFromLeaAndStateFederalFundsDiminisher } from '../diminisher/AddApiTopLevelResourceColumnsFromLeaAndStateFederalFundsDiminisher';
import { enhance as addExtraBeginDateColumnToStudentLearningObjectiveDiminisher } from '../diminisher/AddExtraBeginDateColumnToStudentLearningObjectiveDiminisher';
import { enhance as addExtraPeriodSequenceColumnToGradingPeriodTypeDiminisher } from '../diminisher/AddExtraPeriodSequenceColumnToGradingPeriodTypeDiminisher';
import { enhance as addFksFromAcademicWeekToCalendarDateDiminisher } from '../diminisher/AddFksFromAcademicWeekToCalendarDateDiminisher';
import { enhance as addReportCardRoleNameFromEducationOrganizationIdOnReportCardScoAndReportCardSloDiminisher } from '../diminisher/AddReportCardRoleNameFromEducationOrganizationIdOnReportCardScoAndReportCardSloDiminisher';
import { enhance as addRoleNameFromEducationContentDSLRMUriDiminisher } from '../diminisher/AddRoleNameFromEducationContentDSLRMUriDiminisher';
import { enhance as assessmentContentStandardTableDiminisher } from '../diminisher/AssessmentContentStandardTableDiminisher';
import { enhance as changeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher } from '../diminisher/ChangeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher';
import { enhance as foreignKeyOrderDiminisher } from '../diminisher/ForeignKeyOrderDiminisher';
import { enhance as graduationPlanRequiredAssessmentPerformanceLevelDiminisher } from '../diminisher/GraduationPlanRequiredAssessmentPerformanceLevelDiminisher';
import { enhance as identificationDocumentTableDiminisher } from '../diminisher/IdentificationDocumentTableDiminisher';
import { enhance as modifyCascadingDeletesDefinitionsDiminisher } from '../diminisher/ModifyCascadingDeletesDefinitionsDiminisher';
import { enhance as modifyCascadingUpdatesDefinitionsDiminisher } from '../diminisher/ModifyCascadingUpdatesDefinitionsDiminisher';
import { enhance as modifyColumnDataTypesDiminisher } from '../diminisher/ModifyColumnDataTypesDiminisher';
import { enhance as modifyIdentityForEducationOrganizationAndSubTypesDiminisher } from '../diminisher/ModifyIdentityForEducationOrganizationAndSubTypesDiminisher';
import { enhance as modifyReverseForeignKeyIndexesDiminisher } from '../diminisher/ModifyReverseForeignKeyIndexesDiminisher';
import { enhance as primaryKeyOrderDiminisher } from '../diminisher/PrimaryKeyOrderDiminisher';
// eslint-disable-next-line camelcase
import { enhance as removeGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x } from '../diminisher/RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x';
// eslint-disable-next-line camelcase
import { enhance as removeGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x } from '../diminisher/RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x';
import { enhance as removeGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase } from '../diminisher/RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase';
import { enhance as removeStartTimeFromPkOfInterventionMeetingTimeDiminisher } from '../diminisher/RemoveStartTimeFromPkOfInterventionMeetingTimeDiminisher';

export function enhancerList(): Array<Enhancer> {
  return [

    // Property Collection Cloning Phase
    edFiOdsEntityRepository,
    topLevelEntity,
    modifyIdentityForEducationOrganizationAndSubTypesDiminisher,

    // Builder Post Processing Phase
    associationExtension,
    commonExtension,
    domainEntityExtension,
    topLevelEntityBaseReferenceEnhancer,
    descriptor,

    // Builder Post Processing Phase 2
    entityProperty,
    descriptorProperty,
    enumerationProperty,
    referenceProperty,
    odsTableNameEnhancer,
    createUsisFromUniqueIdsEnhancer,
    // tablePropertyEnhancer no longer needed?

    // Static Database Item Creation Phase
    baseDescriptorTableCreatingEnhancer,

    // Table Creation Phase
    updateCascadeTopLevelEntityEnhancer,

    associationExtensionTableEnhancer,
    associationSubclassTableEnhancer,
    associationTableEnhancer,
    descriptorTableEnhancer,
    domainEntityExtensionTableEnhancer,
    domainEntitySubclassTableEnhancer,
    domainEntityTableEnhancer,
    enumerationTableEnhancer,
    schoolYearEnumerationTableEnhancer,

    assessmentContentStandardTableDiminisher,
    graduationPlanRequiredAssessmentPerformanceLevelDiminisher,
    identificationDocumentTableDiminisher,

    // Foreign Key Creation Phase
    foreignKeyCreatingTableEnhancer,
    addApiTopLevelResourceColumnsFromLeaAndStateFederalFundsDiminisher,
    addExtraBeginDateColumnToStudentLearningObjectiveDiminisher,
    addExtraPeriodSequenceColumnToGradingPeriodTypeDiminisher,
    addFksFromAcademicWeekToCalendarDateDiminisher,
    addReportCardRoleNameFromEducationOrganizationIdOnReportCardScoAndReportCardSloDiminisher,
    addRoleNameFromEducationContentDSLRMUriDiminisher,
    changeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher,
    modifyCascadingDeletesDefinitionsDiminisher,
    modifyCascadingUpdatesDefinitionsDiminisher,
    modifyColumnDataTypesDiminisher,
    // eslint-disable-next-line camelcase
    removeGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x,
    // eslint-disable-next-line camelcase
    removeGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x,
    removeGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase,
    removeStartTimeFromPkOfInterventionMeetingTimeDiminisher,

    // Trigger Creation Phase
    deleteTriggerEnhancer,

    // Row Population Phase
    enumerationRowEnhancer,
    schoolYearEnumerationRowEnhancer,
    descriptorMapTypeRowEnhancer,

    // Post Ods Creation Phase
    foreignKeyReverseIndexEnhancer,
    modifyReverseForeignKeyIndexesDiminisher,
    templateSpecificTablePropertyEnhancer,

    primaryKeyOrderDiminisher,
    foreignKeyOrderDiminisher,
  ];
}

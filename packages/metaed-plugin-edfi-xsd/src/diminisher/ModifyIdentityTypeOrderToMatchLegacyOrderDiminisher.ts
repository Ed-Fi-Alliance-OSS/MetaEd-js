import * as R from 'ramda';
import { getEntityFromNamespace, versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, Namespace, MetaEdEnvironment, ModelBase, ModelType } from '@edfi/metaed-core';
import { ComplexType } from '../model/schema/ComplexType';
import { Element } from '../model/schema/Element';

// Workaround for METAED-451: Force Data Type to Positive Integer in Xsd for Order of Priority
// This problem is resolved for the 2.1 Data Standard through ticket DATASTD-866
// However, the problem is back for the 2.2 Data Standard
const enhancerName = 'ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher';
const targetVersions = '2.0.x || >=2.2.0 <3.0.0';

function reorderIdentityType(
  namespace: Namespace,
  modelType: ModelType,
  metaEdName: string,
  newElementOrder: string[],
): void {
  const entity: ModelBase | null = getEntityFromNamespace(metaEdName, namespace, modelType);
  const identityType: ComplexType | null = entity != null ? entity.data.edfiXsd.xsdIdentityType : null;

  if (
    identityType == null ||
    !identityType.hasItems() ||
    identityType.items.some((x) => !newElementOrder.includes((x as unknown as Element).name))
  )
    return;

  identityType.items = R.sortBy((x) => newElementOrder.indexOf((x as unknown as Element).name))(identityType.items);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const namespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (namespace == null) return { enhancerName, success: false };

  const domainEntity: ModelType = 'domainEntity';
  const association: ModelType = 'association';

  reorderIdentityType(namespace, association, 'StaffEducationOrganizationEmploymentAssociation', [
    'EducationOrganizationReference',
    'StaffReference',
    'EmploymentStatus',
    'HireDate',
  ]);
  reorderIdentityType(namespace, association, 'StudentProgramAssociation', [
    'StudentReference',
    'EducationOrganizationReference',
    'ProgramReference',
    'BeginDate',
  ]);
  reorderIdentityType(namespace, domainEntity, 'AssessmentItem', ['AssessmentReference', 'IdentificationCode']);
  reorderIdentityType(namespace, domainEntity, 'ClassPeriod', ['ClassPeriodName', 'SchoolReference']);
  reorderIdentityType(namespace, domainEntity, 'CourseOffering', ['LocalCourseCode', 'SessionReference', 'SchoolReference']);
  reorderIdentityType(namespace, domainEntity, 'Grade', [
    'StudentSectionAssociationReference',
    'GradingPeriodReference',
    'GradeType',
  ]);
  reorderIdentityType(namespace, domainEntity, 'GradebookEntry', [
    'SectionReference',
    'GradebookEntryTitle',
    'DateAssigned',
  ]);
  reorderIdentityType(namespace, domainEntity, 'GradingPeriod', ['GradingPeriod', 'BeginDate', 'SchoolReference']);
  reorderIdentityType(namespace, domainEntity, 'Intervention', [
    'InterventionIdentificationCode',
    'EducationOrganizationReference',
  ]);
  reorderIdentityType(namespace, domainEntity, 'InterventionPrescription', [
    'InterventionPrescriptionIdentificationCode',
    'EducationOrganizationReference',
  ]);
  reorderIdentityType(namespace, domainEntity, 'Location', ['ClassroomIdentificationCode', 'SchoolReference']);
  reorderIdentityType(namespace, domainEntity, 'ObjectiveAssessment', ['AssessmentReference', 'IdentificationCode']);
  reorderIdentityType(namespace, domainEntity, 'Program', ['ProgramType', 'ProgramName', 'EducationOrganizationReference']);
  reorderIdentityType(namespace, domainEntity, 'Section', [
    'LocationReference',
    'ClassPeriodReference',
    'CourseOfferingReference',
    'UniqueSectionCode',
    'SequenceOfCourse',
  ]);
  reorderIdentityType(namespace, domainEntity, 'Session', ['SchoolReference', 'SchoolYear', 'Term']);
  reorderIdentityType(namespace, domainEntity, 'StudentAssessment', [
    'StudentReference',
    'AssessmentReference',
    'AdministrationDate',
  ]);
  reorderIdentityType(namespace, domainEntity, 'StudentCompetencyObjective', [
    'StudentReference',
    'CompetencyObjectiveReference',
    'GradingPeriodReference',
  ]);
  reorderIdentityType(namespace, domainEntity, 'StudentLearningObjective', [
    'StudentReference',
    'LearningObjectiveReference',
    'GradingPeriodReference',
  ]);

  return {
    enhancerName,
    success: true,
  };
}

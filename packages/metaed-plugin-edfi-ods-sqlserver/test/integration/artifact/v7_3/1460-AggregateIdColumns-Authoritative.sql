CREATE SEQUENCE [edfi].[AcademicWeek_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[AcademicWeek] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[AcademicWeek_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_AcademicWeek_AggregateId] ON [edfi].[AcademicWeek] (AggregateId);

CREATE SEQUENCE [edfi].[AccountabilityRating_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[AccountabilityRating] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[AccountabilityRating_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_AccountabilityRating_AggregateId] ON [edfi].[AccountabilityRating] (AggregateId);

CREATE SEQUENCE [edfi].[Assessment_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Assessment] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Assessment_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Assessment_AggregateId] ON [edfi].[Assessment] (AggregateId);

CREATE SEQUENCE [edfi].[AssessmentAdministration_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[AssessmentAdministration] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[AssessmentAdministration_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_AssessmentAdministration_AggregateId] ON [edfi].[AssessmentAdministration] (AggregateId);

CREATE SEQUENCE [edfi].[AssessmentAdministrationParticipation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[AssessmentAdministrationParticipation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[AssessmentAdministrationParticipation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_AssessmentAdministrationParticipation_AggregateId] ON [edfi].[AssessmentAdministrationParticipation] (AggregateId);

CREATE SEQUENCE [edfi].[AssessmentBatteryPart_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[AssessmentBatteryPart] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[AssessmentBatteryPart_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_AssessmentBatteryPart_AggregateId] ON [edfi].[AssessmentBatteryPart] (AggregateId);

CREATE SEQUENCE [edfi].[AssessmentItem_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[AssessmentItem] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[AssessmentItem_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_AssessmentItem_AggregateId] ON [edfi].[AssessmentItem] (AggregateId);

CREATE SEQUENCE [edfi].[AssessmentScoreRangeLearningStandard_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[AssessmentScoreRangeLearningStandard] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[AssessmentScoreRangeLearningStandard_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_AssessmentScoreRangeLearningStandard_AggregateId] ON [edfi].[AssessmentScoreRangeLearningStandard] (AggregateId);

CREATE SEQUENCE [edfi].[BalanceSheetDimension_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[BalanceSheetDimension] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[BalanceSheetDimension_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_BalanceSheetDimension_AggregateId] ON [edfi].[BalanceSheetDimension] (AggregateId);

CREATE SEQUENCE [edfi].[BellSchedule_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[BellSchedule] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[BellSchedule_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_BellSchedule_AggregateId] ON [edfi].[BellSchedule] (AggregateId);

CREATE SEQUENCE [edfi].[Calendar_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Calendar] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Calendar_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Calendar_AggregateId] ON [edfi].[Calendar] (AggregateId);

CREATE SEQUENCE [edfi].[CalendarDate_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[CalendarDate] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[CalendarDate_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_CalendarDate_AggregateId] ON [edfi].[CalendarDate] (AggregateId);

CREATE SEQUENCE [edfi].[ChartOfAccount_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[ChartOfAccount] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[ChartOfAccount_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_ChartOfAccount_AggregateId] ON [edfi].[ChartOfAccount] (AggregateId);

CREATE SEQUENCE [edfi].[ClassPeriod_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[ClassPeriod] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[ClassPeriod_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_ClassPeriod_AggregateId] ON [edfi].[ClassPeriod] (AggregateId);

CREATE SEQUENCE [edfi].[Cohort_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Cohort] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Cohort_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Cohort_AggregateId] ON [edfi].[Cohort] (AggregateId);

CREATE SEQUENCE [edfi].[CommunityProviderLicense_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[CommunityProviderLicense] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[CommunityProviderLicense_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_CommunityProviderLicense_AggregateId] ON [edfi].[CommunityProviderLicense] (AggregateId);

CREATE SEQUENCE [edfi].[CompetencyObjective_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[CompetencyObjective] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[CompetencyObjective_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_CompetencyObjective_AggregateId] ON [edfi].[CompetencyObjective] (AggregateId);

CREATE SEQUENCE [edfi].[Contact_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Contact] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Contact_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Contact_AggregateId] ON [edfi].[Contact] (AggregateId);

CREATE SEQUENCE [edfi].[Course_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Course] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Course_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Course_AggregateId] ON [edfi].[Course] (AggregateId);

CREATE SEQUENCE [edfi].[CourseOffering_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[CourseOffering] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[CourseOffering_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_CourseOffering_AggregateId] ON [edfi].[CourseOffering] (AggregateId);

CREATE SEQUENCE [edfi].[CourseTranscript_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[CourseTranscript] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[CourseTranscript_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_CourseTranscript_AggregateId] ON [edfi].[CourseTranscript] (AggregateId);

CREATE SEQUENCE [edfi].[Credential_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Credential] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Credential_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Credential_AggregateId] ON [edfi].[Credential] (AggregateId);

CREATE SEQUENCE [edfi].[CrisisEvent_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[CrisisEvent] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[CrisisEvent_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_CrisisEvent_AggregateId] ON [edfi].[CrisisEvent] (AggregateId);

CREATE SEQUENCE [edfi].[Descriptor_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Descriptor] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Descriptor_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Descriptor_AggregateId] ON [edfi].[Descriptor] (AggregateId);

CREATE SEQUENCE [edfi].[DescriptorMapping_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[DescriptorMapping] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[DescriptorMapping_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_DescriptorMapping_AggregateId] ON [edfi].[DescriptorMapping] (AggregateId);

CREATE SEQUENCE [edfi].[DisciplineAction_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[DisciplineAction] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[DisciplineAction_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_DisciplineAction_AggregateId] ON [edfi].[DisciplineAction] (AggregateId);

CREATE SEQUENCE [edfi].[DisciplineIncident_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[DisciplineIncident] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[DisciplineIncident_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_DisciplineIncident_AggregateId] ON [edfi].[DisciplineIncident] (AggregateId);

CREATE SEQUENCE [edfi].[EducationContent_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[EducationContent] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[EducationContent_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_EducationContent_AggregateId] ON [edfi].[EducationContent] (AggregateId);

CREATE SEQUENCE [edfi].[EducationOrganization_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[EducationOrganization] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[EducationOrganization_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_EducationOrganization_AggregateId] ON [edfi].[EducationOrganization] (AggregateId);

CREATE SEQUENCE [edfi].[EducationOrganizationInterventionPrescriptionAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[EducationOrganizationInterventionPrescriptionAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[EducationOrganizationInterventionPrescriptionAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_EducationOrganizationInterventionPrescriptionAssociation_AggregateId] ON [edfi].[EducationOrganizationInterventionPrescriptionAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[EducationOrganizationNetworkAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[EducationOrganizationNetworkAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[EducationOrganizationNetworkAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_EducationOrganizationNetworkAssociation_AggregateId] ON [edfi].[EducationOrganizationNetworkAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[EducationOrganizationPeerAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[EducationOrganizationPeerAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[EducationOrganizationPeerAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_EducationOrganizationPeerAssociation_AggregateId] ON [edfi].[EducationOrganizationPeerAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[EvaluationRubricDimension_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[EvaluationRubricDimension] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[EvaluationRubricDimension_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_EvaluationRubricDimension_AggregateId] ON [edfi].[EvaluationRubricDimension] (AggregateId);

CREATE SEQUENCE [edfi].[FeederSchoolAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[FeederSchoolAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[FeederSchoolAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_FeederSchoolAssociation_AggregateId] ON [edfi].[FeederSchoolAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[FunctionDimension_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[FunctionDimension] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[FunctionDimension_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_FunctionDimension_AggregateId] ON [edfi].[FunctionDimension] (AggregateId);

CREATE SEQUENCE [edfi].[FundDimension_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[FundDimension] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[FundDimension_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_FundDimension_AggregateId] ON [edfi].[FundDimension] (AggregateId);

CREATE SEQUENCE [edfi].[GeneralStudentProgramAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[GeneralStudentProgramAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[GeneralStudentProgramAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_GeneralStudentProgramAssociation_AggregateId] ON [edfi].[GeneralStudentProgramAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[Grade_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Grade] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Grade_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Grade_AggregateId] ON [edfi].[Grade] (AggregateId);

CREATE SEQUENCE [edfi].[GradebookEntry_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[GradebookEntry] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[GradebookEntry_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_GradebookEntry_AggregateId] ON [edfi].[GradebookEntry] (AggregateId);

CREATE SEQUENCE [edfi].[GradingPeriod_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[GradingPeriod] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[GradingPeriod_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_GradingPeriod_AggregateId] ON [edfi].[GradingPeriod] (AggregateId);

CREATE SEQUENCE [edfi].[GraduationPlan_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[GraduationPlan] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[GraduationPlan_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_GraduationPlan_AggregateId] ON [edfi].[GraduationPlan] (AggregateId);

CREATE SEQUENCE [edfi].[Intervention_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Intervention] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Intervention_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Intervention_AggregateId] ON [edfi].[Intervention] (AggregateId);

CREATE SEQUENCE [edfi].[InterventionPrescription_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[InterventionPrescription] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[InterventionPrescription_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_InterventionPrescription_AggregateId] ON [edfi].[InterventionPrescription] (AggregateId);

CREATE SEQUENCE [edfi].[InterventionStudy_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[InterventionStudy] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[InterventionStudy_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_InterventionStudy_AggregateId] ON [edfi].[InterventionStudy] (AggregateId);

CREATE SEQUENCE [edfi].[LearningStandard_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[LearningStandard] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[LearningStandard_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_LearningStandard_AggregateId] ON [edfi].[LearningStandard] (AggregateId);

CREATE SEQUENCE [edfi].[LearningStandardEquivalenceAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[LearningStandardEquivalenceAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[LearningStandardEquivalenceAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_LearningStandardEquivalenceAssociation_AggregateId] ON [edfi].[LearningStandardEquivalenceAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[LocalAccount_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[LocalAccount] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[LocalAccount_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_LocalAccount_AggregateId] ON [edfi].[LocalAccount] (AggregateId);

CREATE SEQUENCE [edfi].[LocalActual_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[LocalActual] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[LocalActual_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_LocalActual_AggregateId] ON [edfi].[LocalActual] (AggregateId);

CREATE SEQUENCE [edfi].[LocalBudget_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[LocalBudget] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[LocalBudget_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_LocalBudget_AggregateId] ON [edfi].[LocalBudget] (AggregateId);

CREATE SEQUENCE [edfi].[LocalContractedStaff_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[LocalContractedStaff] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[LocalContractedStaff_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_LocalContractedStaff_AggregateId] ON [edfi].[LocalContractedStaff] (AggregateId);

CREATE SEQUENCE [edfi].[LocalEncumbrance_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[LocalEncumbrance] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[LocalEncumbrance_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_LocalEncumbrance_AggregateId] ON [edfi].[LocalEncumbrance] (AggregateId);

CREATE SEQUENCE [edfi].[LocalPayroll_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[LocalPayroll] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[LocalPayroll_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_LocalPayroll_AggregateId] ON [edfi].[LocalPayroll] (AggregateId);

CREATE SEQUENCE [edfi].[Location_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Location] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Location_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Location_AggregateId] ON [edfi].[Location] (AggregateId);

CREATE SEQUENCE [edfi].[ObjectDimension_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[ObjectDimension] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[ObjectDimension_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_ObjectDimension_AggregateId] ON [edfi].[ObjectDimension] (AggregateId);

CREATE SEQUENCE [edfi].[ObjectiveAssessment_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[ObjectiveAssessment] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[ObjectiveAssessment_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_ObjectiveAssessment_AggregateId] ON [edfi].[ObjectiveAssessment] (AggregateId);

CREATE SEQUENCE [edfi].[OpenStaffPosition_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[OpenStaffPosition] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[OpenStaffPosition_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_OpenStaffPosition_AggregateId] ON [edfi].[OpenStaffPosition] (AggregateId);

CREATE SEQUENCE [edfi].[OperationalUnitDimension_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[OperationalUnitDimension] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[OperationalUnitDimension_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_OperationalUnitDimension_AggregateId] ON [edfi].[OperationalUnitDimension] (AggregateId);

CREATE SEQUENCE [edfi].[Person_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Person] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Person_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Person_AggregateId] ON [edfi].[Person] (AggregateId);

CREATE SEQUENCE [edfi].[PostSecondaryEvent_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[PostSecondaryEvent] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[PostSecondaryEvent_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_PostSecondaryEvent_AggregateId] ON [edfi].[PostSecondaryEvent] (AggregateId);

CREATE SEQUENCE [edfi].[Program_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Program] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Program_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Program_AggregateId] ON [edfi].[Program] (AggregateId);

CREATE SEQUENCE [edfi].[ProgramDimension_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[ProgramDimension] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[ProgramDimension_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_ProgramDimension_AggregateId] ON [edfi].[ProgramDimension] (AggregateId);

CREATE SEQUENCE [edfi].[ProgramEvaluation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[ProgramEvaluation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[ProgramEvaluation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_ProgramEvaluation_AggregateId] ON [edfi].[ProgramEvaluation] (AggregateId);

CREATE SEQUENCE [edfi].[ProgramEvaluationElement_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[ProgramEvaluationElement] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[ProgramEvaluationElement_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_ProgramEvaluationElement_AggregateId] ON [edfi].[ProgramEvaluationElement] (AggregateId);

CREATE SEQUENCE [edfi].[ProgramEvaluationObjective_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[ProgramEvaluationObjective] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[ProgramEvaluationObjective_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_ProgramEvaluationObjective_AggregateId] ON [edfi].[ProgramEvaluationObjective] (AggregateId);

CREATE SEQUENCE [edfi].[ProjectDimension_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[ProjectDimension] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[ProjectDimension_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_ProjectDimension_AggregateId] ON [edfi].[ProjectDimension] (AggregateId);

CREATE SEQUENCE [edfi].[ReportCard_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[ReportCard] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[ReportCard_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_ReportCard_AggregateId] ON [edfi].[ReportCard] (AggregateId);

CREATE SEQUENCE [edfi].[RestraintEvent_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[RestraintEvent] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[RestraintEvent_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_RestraintEvent_AggregateId] ON [edfi].[RestraintEvent] (AggregateId);

CREATE SEQUENCE [edfi].[SchoolYearType_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SchoolYearType] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SchoolYearType_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SchoolYearType_AggregateId] ON [edfi].[SchoolYearType] (AggregateId);

CREATE SEQUENCE [edfi].[Section_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Section] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Section_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Section_AggregateId] ON [edfi].[Section] (AggregateId);

CREATE SEQUENCE [edfi].[SectionAttendanceTakenEvent_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SectionAttendanceTakenEvent] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SectionAttendanceTakenEvent_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SectionAttendanceTakenEvent_AggregateId] ON [edfi].[SectionAttendanceTakenEvent] (AggregateId);

CREATE SEQUENCE [edfi].[Session_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Session] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Session_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Session_AggregateId] ON [edfi].[Session] (AggregateId);

CREATE SEQUENCE [edfi].[SourceDimension_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SourceDimension] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SourceDimension_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SourceDimension_AggregateId] ON [edfi].[SourceDimension] (AggregateId);

CREATE SEQUENCE [edfi].[Staff_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Staff] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Staff_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Staff_AggregateId] ON [edfi].[Staff] (AggregateId);

CREATE SEQUENCE [edfi].[StaffAbsenceEvent_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StaffAbsenceEvent] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StaffAbsenceEvent_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StaffAbsenceEvent_AggregateId] ON [edfi].[StaffAbsenceEvent] (AggregateId);

CREATE SEQUENCE [edfi].[StaffCohortAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StaffCohortAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StaffCohortAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StaffCohortAssociation_AggregateId] ON [edfi].[StaffCohortAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StaffDisciplineIncidentAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StaffDisciplineIncidentAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StaffDisciplineIncidentAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StaffDisciplineIncidentAssociation_AggregateId] ON [edfi].[StaffDisciplineIncidentAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StaffEducationOrganizationAssignmentAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StaffEducationOrganizationAssignmentAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StaffEducationOrganizationAssignmentAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StaffEducationOrganizationAssignmentAssociation_AggregateId] ON [edfi].[StaffEducationOrganizationAssignmentAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StaffEducationOrganizationContactAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StaffEducationOrganizationContactAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StaffEducationOrganizationContactAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StaffEducationOrganizationContactAssociation_AggregateId] ON [edfi].[StaffEducationOrganizationContactAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StaffEducationOrganizationEmploymentAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StaffEducationOrganizationEmploymentAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StaffEducationOrganizationEmploymentAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StaffEducationOrganizationEmploymentAssociation_AggregateId] ON [edfi].[StaffEducationOrganizationEmploymentAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StaffLeave_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StaffLeave] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StaffLeave_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StaffLeave_AggregateId] ON [edfi].[StaffLeave] (AggregateId);

CREATE SEQUENCE [edfi].[StaffProgramAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StaffProgramAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StaffProgramAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StaffProgramAssociation_AggregateId] ON [edfi].[StaffProgramAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StaffSchoolAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StaffSchoolAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StaffSchoolAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StaffSchoolAssociation_AggregateId] ON [edfi].[StaffSchoolAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StaffSectionAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StaffSectionAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StaffSectionAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StaffSectionAssociation_AggregateId] ON [edfi].[StaffSectionAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[Student_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Student] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Student_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Student_AggregateId] ON [edfi].[Student] (AggregateId);

CREATE SEQUENCE [edfi].[StudentAcademicRecord_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentAcademicRecord] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentAcademicRecord_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentAcademicRecord_AggregateId] ON [edfi].[StudentAcademicRecord] (AggregateId);

CREATE SEQUENCE [edfi].[StudentAssessment_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentAssessment] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentAssessment_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentAssessment_AggregateId] ON [edfi].[StudentAssessment] (AggregateId);

CREATE SEQUENCE [edfi].[StudentAssessmentEducationOrganizationAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentAssessmentEducationOrganizationAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentAssessmentEducationOrganizationAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentAssessmentEducationOrganizationAssociation_AggregateId] ON [edfi].[StudentAssessmentEducationOrganizationAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentAssessmentRegistration_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentAssessmentRegistration] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentAssessmentRegistration_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentAssessmentRegistration_AggregateId] ON [edfi].[StudentAssessmentRegistration] (AggregateId);

CREATE SEQUENCE [edfi].[StudentAssessmentRegistrationBatteryPartAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentAssessmentRegistrationBatteryPartAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentAssessmentRegistrationBatteryPartAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentAssessmentRegistrationBatteryPartAssociation_AggregateId] ON [edfi].[StudentAssessmentRegistrationBatteryPartAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentCohortAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentCohortAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentCohortAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentCohortAssociation_AggregateId] ON [edfi].[StudentCohortAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentCompetencyObjective_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentCompetencyObjective] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentCompetencyObjective_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentCompetencyObjective_AggregateId] ON [edfi].[StudentCompetencyObjective] (AggregateId);

CREATE SEQUENCE [edfi].[StudentContactAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentContactAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentContactAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentContactAssociation_AggregateId] ON [edfi].[StudentContactAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentDisciplineIncidentBehaviorAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentDisciplineIncidentBehaviorAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentDisciplineIncidentBehaviorAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentDisciplineIncidentBehaviorAssociation_AggregateId] ON [edfi].[StudentDisciplineIncidentBehaviorAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentDisciplineIncidentNonOffenderAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentDisciplineIncidentNonOffenderAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentDisciplineIncidentNonOffenderAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentDisciplineIncidentNonOffenderAssociation_AggregateId] ON [edfi].[StudentDisciplineIncidentNonOffenderAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentEducationOrganizationAssessmentAccommodation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentEducationOrganizationAssessmentAccommodation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentEducationOrganizationAssessmentAccommodation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentEducationOrganizationAssessmentAccommodation_AggregateId] ON [edfi].[StudentEducationOrganizationAssessmentAccommodation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentEducationOrganizationAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentEducationOrganizationAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentEducationOrganizationAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentEducationOrganizationAssociation_AggregateId] ON [edfi].[StudentEducationOrganizationAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentEducationOrganizationResponsibilityAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentEducationOrganizationResponsibilityAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentEducationOrganizationResponsibilityAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentEducationOrganizationResponsibilityAssociation_AggregateId] ON [edfi].[StudentEducationOrganizationResponsibilityAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentGradebookEntry_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentGradebookEntry] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentGradebookEntry_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentGradebookEntry_AggregateId] ON [edfi].[StudentGradebookEntry] (AggregateId);

CREATE SEQUENCE [edfi].[StudentHealth_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentHealth] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentHealth_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentHealth_AggregateId] ON [edfi].[StudentHealth] (AggregateId);

CREATE SEQUENCE [edfi].[StudentInterventionAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentInterventionAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentInterventionAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentInterventionAssociation_AggregateId] ON [edfi].[StudentInterventionAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentInterventionAttendanceEvent_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentInterventionAttendanceEvent] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentInterventionAttendanceEvent_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentInterventionAttendanceEvent_AggregateId] ON [edfi].[StudentInterventionAttendanceEvent] (AggregateId);

CREATE SEQUENCE [edfi].[StudentProgramAttendanceEvent_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentProgramAttendanceEvent] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentProgramAttendanceEvent_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentProgramAttendanceEvent_AggregateId] ON [edfi].[StudentProgramAttendanceEvent] (AggregateId);

CREATE SEQUENCE [edfi].[StudentProgramEvaluation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentProgramEvaluation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentProgramEvaluation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentProgramEvaluation_AggregateId] ON [edfi].[StudentProgramEvaluation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentSchoolAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentSchoolAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentSchoolAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentSchoolAssociation_AggregateId] ON [edfi].[StudentSchoolAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentSchoolAttendanceEvent_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentSchoolAttendanceEvent] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentSchoolAttendanceEvent_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentSchoolAttendanceEvent_AggregateId] ON [edfi].[StudentSchoolAttendanceEvent] (AggregateId);

CREATE SEQUENCE [edfi].[StudentSectionAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentSectionAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentSectionAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentSectionAssociation_AggregateId] ON [edfi].[StudentSectionAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentSectionAttendanceEvent_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentSectionAttendanceEvent] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentSectionAttendanceEvent_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentSectionAttendanceEvent_AggregateId] ON [edfi].[StudentSectionAttendanceEvent] (AggregateId);

CREATE SEQUENCE [edfi].[StudentSpecialEducationProgramEligibilityAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentSpecialEducationProgramEligibilityAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentSpecialEducationProgramEligibilityAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentSpecialEducationProgramEligibilityAssociation_AggregateId] ON [edfi].[StudentSpecialEducationProgramEligibilityAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[StudentTransportation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[StudentTransportation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[StudentTransportation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_StudentTransportation_AggregateId] ON [edfi].[StudentTransportation] (AggregateId);

CREATE SEQUENCE [edfi].[Survey_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[Survey] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[Survey_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_Survey_AggregateId] ON [edfi].[Survey] (AggregateId);

CREATE SEQUENCE [edfi].[SurveyCourseAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveyCourseAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveyCourseAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveyCourseAssociation_AggregateId] ON [edfi].[SurveyCourseAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[SurveyProgramAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveyProgramAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveyProgramAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveyProgramAssociation_AggregateId] ON [edfi].[SurveyProgramAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[SurveyQuestion_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveyQuestion] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveyQuestion_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveyQuestion_AggregateId] ON [edfi].[SurveyQuestion] (AggregateId);

CREATE SEQUENCE [edfi].[SurveyQuestionResponse_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveyQuestionResponse] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveyQuestionResponse_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveyQuestionResponse_AggregateId] ON [edfi].[SurveyQuestionResponse] (AggregateId);

CREATE SEQUENCE [edfi].[SurveyResponse_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveyResponse] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveyResponse_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveyResponse_AggregateId] ON [edfi].[SurveyResponse] (AggregateId);

CREATE SEQUENCE [edfi].[SurveyResponseEducationOrganizationTargetAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveyResponseEducationOrganizationTargetAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveyResponseEducationOrganizationTargetAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveyResponseEducationOrganizationTargetAssociation_AggregateId] ON [edfi].[SurveyResponseEducationOrganizationTargetAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[SurveyResponseStaffTargetAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveyResponseStaffTargetAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveyResponseStaffTargetAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveyResponseStaffTargetAssociation_AggregateId] ON [edfi].[SurveyResponseStaffTargetAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[SurveySection_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveySection] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveySection_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveySection_AggregateId] ON [edfi].[SurveySection] (AggregateId);

CREATE SEQUENCE [edfi].[SurveySectionAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveySectionAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveySectionAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveySectionAssociation_AggregateId] ON [edfi].[SurveySectionAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[SurveySectionResponse_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveySectionResponse] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveySectionResponse_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveySectionResponse_AggregateId] ON [edfi].[SurveySectionResponse] (AggregateId);

CREATE SEQUENCE [edfi].[SurveySectionResponseEducationOrganizationTargetAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveySectionResponseEducationOrganizationTargetAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveySectionResponseEducationOrganizationTargetAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveySectionResponseEducationOrganizationTargetAssociation_AggregateId] ON [edfi].[SurveySectionResponseEducationOrganizationTargetAssociation] (AggregateId);

CREATE SEQUENCE [edfi].[SurveySectionResponseStaffTargetAssociation_AggSeq] START WITH -2147483648 INCREMENT BY 1;
ALTER TABLE [edfi].[SurveySectionResponseStaffTargetAssociation] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[SurveySectionResponseStaffTargetAssociation_AggSeq], AggregateData varbinary(8000);
CREATE INDEX [IX_SurveySectionResponseStaffTargetAssociation_AggregateId] ON [edfi].[SurveySectionResponseStaffTargetAssociation] (AggregateId);


CREATE TABLE [changes].[sample_InstitutionControlDescriptor_TrackedDelete]
(
       InstitutionControlDescriptorId [INT] NOT NULL,
       Id uniqueidentifier NOT NULL,
       ChangeVersion bigint NOT NULL,
       CONSTRAINT PK_sample_InstitutionControlDescriptor_TrackedDelete PRIMARY KEY CLUSTERED (ChangeVersion)
)
CREATE TABLE [changes].[sample_InstitutionLevelDescriptor_TrackedDelete]
(
       InstitutionLevelDescriptorId [INT] NOT NULL,
       Id uniqueidentifier NOT NULL,
       ChangeVersion bigint NOT NULL,
       CONSTRAINT PK_sample_InstitutionLevelDescriptor_TrackedDelete PRIMARY KEY CLUSTERED (ChangeVersion)
)
CREATE TABLE [changes].[sample_PostSecondaryOrganization_TrackedDelete]
(
       NameOfInstitution [NVARCHAR](75) NOT NULL,
       Id uniqueidentifier NOT NULL,
       ChangeVersion bigint NOT NULL,
       CONSTRAINT PK_sample_PostSecondaryOrganization_TrackedDelete PRIMARY KEY CLUSTERED (ChangeVersion)
)
CREATE TABLE [changes].[sample_SpecialEducationGraduationStatusDescriptor_TrackedDelete]
(
       SpecialEducationGraduationStatusDescriptorId [INT] NOT NULL,
       Id uniqueidentifier NOT NULL,
       ChangeVersion bigint NOT NULL,
       CONSTRAINT PK_sample_SpecialEducationGraduationStatusDescriptor_TrackedDelete PRIMARY KEY CLUSTERED (ChangeVersion)
)
CREATE TABLE [changes].[sample_SubmissionCertificationDescriptor_TrackedDelete]
(
       SubmissionCertificationDescriptorId [INT] NOT NULL,
       Id uniqueidentifier NOT NULL,
       ChangeVersion bigint NOT NULL,
       CONSTRAINT PK_sample_SubmissionCertificationDescriptor_TrackedDelete PRIMARY KEY CLUSTERED (ChangeVersion)
)

-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

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


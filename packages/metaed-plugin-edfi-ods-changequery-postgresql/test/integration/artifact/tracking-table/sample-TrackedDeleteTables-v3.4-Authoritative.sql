CREATE TABLE tracked_deletes_sample.InstitutionControlDescriptor
(
       InstitutionControlDescriptorId INT NOT NULL,
       Id UUID NOT NULL,
       ChangeVersion BIGINT NOT NULL,
       CONSTRAINT InstitutionControlDescriptor_PK PRIMARY KEY (ChangeVersion)
);

CREATE TABLE tracked_deletes_sample.InstitutionLevelDescriptor
(
       InstitutionLevelDescriptorId INT NOT NULL,
       Id UUID NOT NULL,
       ChangeVersion BIGINT NOT NULL,
       CONSTRAINT InstitutionLevelDescriptor_PK PRIMARY KEY (ChangeVersion)
);

CREATE TABLE tracked_deletes_sample.PostSecondaryOrganization
(
       NameOfInstitution VARCHAR(75) NOT NULL,
       Id UUID NOT NULL,
       ChangeVersion BIGINT NOT NULL,
       CONSTRAINT PostSecondaryOrganization_PK PRIMARY KEY (ChangeVersion)
);

CREATE TABLE tracked_deletes_sample.SpecialEducationGraduationStatusDescriptor
(
       SpecialEducationGraduationStatusDescriptorId INT NOT NULL,
       Id UUID NOT NULL,
       ChangeVersion BIGINT NOT NULL,
       CONSTRAINT SpecialEducationGraduationStatusDescriptor_PK PRIMARY KEY (ChangeVersion)
);

CREATE TABLE tracked_deletes_sample.SubmissionCertificationDescriptor
(
       SubmissionCertificationDescriptorId INT NOT NULL,
       Id UUID NOT NULL,
       ChangeVersion BIGINT NOT NULL,
       CONSTRAINT SubmissionCertificationDescriptor_PK PRIMARY KEY (ChangeVersion)
); 


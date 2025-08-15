-- Table extension.InstitutionControlDescriptor --
CREATE TABLE extension.InstitutionControlDescriptor (
    InstitutionControlDescriptorId INT NOT NULL,
    CONSTRAINT InstitutionControlDescriptor_PK PRIMARY KEY (InstitutionControlDescriptorId)
);

-- Table extension.InstitutionLevelDescriptor --
CREATE TABLE extension.InstitutionLevelDescriptor (
    InstitutionLevelDescriptorId INT NOT NULL,
    CONSTRAINT InstitutionLevelDescriptor_PK PRIMARY KEY (InstitutionLevelDescriptorId)
);

-- Table extension.PostSecondaryOrganization --
CREATE TABLE extension.PostSecondaryOrganization (
    NameOfInstitution VARCHAR(75) NOT NULL,
    InstitutionLevelDescriptorId INT NOT NULL,
    InstitutionControlDescriptorId INT NOT NULL,
    AcceptanceIndicator BOOLEAN NOT NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT PostSecondaryOrganization_PK PRIMARY KEY (NameOfInstitution)
);
ALTER TABLE extension.PostSecondaryOrganization ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.PostSecondaryOrganization ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.PostSecondaryOrganization ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.SpecialEducationGraduationStatusDescriptor --
CREATE TABLE extension.SpecialEducationGraduationStatusDescriptor (
    SpecialEducationGraduationStatusDescriptorId INT NOT NULL,
    CONSTRAINT SpecialEducationGraduationStatusDescriptor_PK PRIMARY KEY (SpecialEducationGraduationStatusDescriptorId)
);

-- Table extension.StudentAcademicRecordClassRankingExtension --
CREATE TABLE extension.StudentAcademicRecordClassRankingExtension (
    EducationOrganizationId INT NOT NULL,
    SchoolYear SMALLINT NOT NULL,
    StudentUSI INT NOT NULL,
    TermDescriptorId INT NOT NULL,
    SpecialEducationGraduationStatusDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT StudentAcademicRecordClassRankingExtension_PK PRIMARY KEY (EducationOrganizationId, SchoolYear, StudentUSI, TermDescriptorId)
);
ALTER TABLE extension.StudentAcademicRecordClassRankingExtension ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.StudentAcademicRecordExtension --
CREATE TABLE extension.StudentAcademicRecordExtension (
    EducationOrganizationId INT NOT NULL,
    SchoolYear SMALLINT NOT NULL,
    StudentUSI INT NOT NULL,
    TermDescriptorId INT NOT NULL,
    NameOfInstitution VARCHAR(75) NULL,
    SubmissionCertificationDescriptorId INT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT StudentAcademicRecordExtension_PK PRIMARY KEY (EducationOrganizationId, SchoolYear, StudentUSI, TermDescriptorId)
);
ALTER TABLE extension.StudentAcademicRecordExtension ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.SubmissionCertificationDescriptor --
CREATE TABLE extension.SubmissionCertificationDescriptor (
    SubmissionCertificationDescriptorId INT NOT NULL,
    CONSTRAINT SubmissionCertificationDescriptor_PK PRIMARY KEY (SubmissionCertificationDescriptorId)
);


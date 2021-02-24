-- Table [extension].[InstitutionControlDescriptor] --
CREATE TABLE [extension].[InstitutionControlDescriptor] (
    [InstitutionControlDescriptorId] [INT] NOT NULL,
    CONSTRAINT [InstitutionControlDescriptor_PK] PRIMARY KEY CLUSTERED (
        [InstitutionControlDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Table [extension].[InstitutionLevelDescriptor] --
CREATE TABLE [extension].[InstitutionLevelDescriptor] (
    [InstitutionLevelDescriptorId] [INT] NOT NULL,
    CONSTRAINT [InstitutionLevelDescriptor_PK] PRIMARY KEY CLUSTERED (
        [InstitutionLevelDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Table [extension].[PostSecondaryOrganization] --
CREATE TABLE [extension].[PostSecondaryOrganization] (
    [NameOfInstitution] [NVARCHAR](75) NOT NULL,
    [InstitutionLevelDescriptorId] [INT] NOT NULL,
    [InstitutionControlDescriptorId] [INT] NOT NULL,
    [AcceptanceIndicator] [BIT] NOT NULL,
    [CreateDate] [DATETIME] NOT NULL,
    [LastModifiedDate] [DATETIME] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [PostSecondaryOrganization_PK] PRIMARY KEY CLUSTERED (
        [NameOfInstitution] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[PostSecondaryOrganization] ADD CONSTRAINT [PostSecondaryOrganization_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[PostSecondaryOrganization] ADD CONSTRAINT [PostSecondaryOrganization_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[PostSecondaryOrganization] ADD CONSTRAINT [PostSecondaryOrganization_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[SpecialEducationGraduationStatusDescriptor] --
CREATE TABLE [extension].[SpecialEducationGraduationStatusDescriptor] (
    [SpecialEducationGraduationStatusDescriptorId] [INT] NOT NULL,
    CONSTRAINT [SpecialEducationGraduationStatusDescriptor_PK] PRIMARY KEY CLUSTERED (
        [SpecialEducationGraduationStatusDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Table [extension].[StudentAcademicRecordClassRankingExtension] --
CREATE TABLE [extension].[StudentAcademicRecordClassRankingExtension] (
    [EducationOrganizationId] [INT] NOT NULL,
    [SchoolYear] [SMALLINT] NOT NULL,
    [StudentUSI] [INT] NOT NULL,
    [TermDescriptorId] [INT] NOT NULL,
    [SpecialEducationGraduationStatusDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME] NOT NULL,
    CONSTRAINT [StudentAcademicRecordClassRankingExtension_PK] PRIMARY KEY CLUSTERED (
        [EducationOrganizationId] ASC,
        [SchoolYear] ASC,
        [StudentUSI] ASC,
        [TermDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StudentAcademicRecordClassRankingExtension] ADD CONSTRAINT [StudentAcademicRecordClassRankingExtension_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[StudentAcademicRecordExtension] --
CREATE TABLE [extension].[StudentAcademicRecordExtension] (
    [EducationOrganizationId] [INT] NOT NULL,
    [SchoolYear] [SMALLINT] NOT NULL,
    [StudentUSI] [INT] NOT NULL,
    [TermDescriptorId] [INT] NOT NULL,
    [NameOfInstitution] [NVARCHAR](75) NULL,
    [SubmissionCertificationDescriptorId] [INT] NULL,
    CONSTRAINT [StudentAcademicRecordExtension_PK] PRIMARY KEY CLUSTERED (
        [EducationOrganizationId] ASC,
        [SchoolYear] ASC,
        [StudentUSI] ASC,
        [TermDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Table [extension].[SubmissionCertificationDescriptor] --
CREATE TABLE [extension].[SubmissionCertificationDescriptor] (
    [SubmissionCertificationDescriptorId] [INT] NOT NULL,
    CONSTRAINT [SubmissionCertificationDescriptor_PK] PRIMARY KEY CLUSTERED (
        [SubmissionCertificationDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [extension].[InstitutionControlDescriptor] WITH CHECK ADD CONSTRAINT [FK_InstitutionControlDescriptor_Descriptor] FOREIGN KEY ([InstitutionControlDescriptorId])
REFERENCES [edfi].[Descriptor] ([DescriptorId])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[InstitutionLevelDescriptor] WITH CHECK ADD CONSTRAINT [FK_InstitutionLevelDescriptor_Descriptor] FOREIGN KEY ([InstitutionLevelDescriptorId])
REFERENCES [edfi].[Descriptor] ([DescriptorId])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[PostSecondaryOrganization] WITH CHECK ADD CONSTRAINT [FK_PostSecondaryOrganization_InstitutionControlDescriptor] FOREIGN KEY ([InstitutionControlDescriptorId])
REFERENCES [extension].[InstitutionControlDescriptor] ([InstitutionControlDescriptorId])
GO

CREATE NONCLUSTERED INDEX [FK_PostSecondaryOrganization_InstitutionControlDescriptor]
ON [extension].[PostSecondaryOrganization] ([InstitutionControlDescriptorId] ASC)
GO

ALTER TABLE [extension].[PostSecondaryOrganization] WITH CHECK ADD CONSTRAINT [FK_PostSecondaryOrganization_InstitutionLevelDescriptor] FOREIGN KEY ([InstitutionLevelDescriptorId])
REFERENCES [extension].[InstitutionLevelDescriptor] ([InstitutionLevelDescriptorId])
GO

CREATE NONCLUSTERED INDEX [FK_PostSecondaryOrganization_InstitutionLevelDescriptor]
ON [extension].[PostSecondaryOrganization] ([InstitutionLevelDescriptorId] ASC)
GO

ALTER TABLE [extension].[SpecialEducationGraduationStatusDescriptor] WITH CHECK ADD CONSTRAINT [FK_SpecialEducationGraduationStatusDescriptor_Descriptor] FOREIGN KEY ([SpecialEducationGraduationStatusDescriptorId])
REFERENCES [edfi].[Descriptor] ([DescriptorId])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[StudentAcademicRecordClassRankingExtension] WITH CHECK ADD CONSTRAINT [FK_StudentAcademicRecordClassRankingExtension_SpecialEducationGraduationStatusDescriptor] FOREIGN KEY ([SpecialEducationGraduationStatusDescriptorId])
REFERENCES [extension].[SpecialEducationGraduationStatusDescriptor] ([SpecialEducationGraduationStatusDescriptorId])
GO

CREATE NONCLUSTERED INDEX [FK_StudentAcademicRecordClassRankingExtension_SpecialEducationGraduationStatusDescriptor]
ON [extension].[StudentAcademicRecordClassRankingExtension] ([SpecialEducationGraduationStatusDescriptorId] ASC)
GO

ALTER TABLE [extension].[StudentAcademicRecordClassRankingExtension] WITH CHECK ADD CONSTRAINT [FK_StudentAcademicRecordClassRankingExtension_StudentAcademicRecordClassRanking] FOREIGN KEY ([StudentUSI], [SchoolYear], [TermDescriptorId], [EducationOrganizationId])
REFERENCES [edfi].[StudentAcademicRecordClassRanking] ([StudentUSI], [SchoolYear], [TermDescriptorId], [EducationOrganizationId])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[StudentAcademicRecordExtension] WITH CHECK ADD CONSTRAINT [FK_StudentAcademicRecordExtension_PostSecondaryOrganization] FOREIGN KEY ([NameOfInstitution])
REFERENCES [extension].[PostSecondaryOrganization] ([NameOfInstitution])
GO

CREATE NONCLUSTERED INDEX [FK_StudentAcademicRecordExtension_PostSecondaryOrganization]
ON [extension].[StudentAcademicRecordExtension] ([NameOfInstitution] ASC)
GO

ALTER TABLE [extension].[StudentAcademicRecordExtension] WITH CHECK ADD CONSTRAINT [FK_StudentAcademicRecordExtension_StudentAcademicRecord] FOREIGN KEY ([StudentUSI], [EducationOrganizationId], [SchoolYear], [TermDescriptorId])
REFERENCES [edfi].[StudentAcademicRecord] ([StudentUSI], [EducationOrganizationId], [SchoolYear], [TermDescriptorId])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[StudentAcademicRecordExtension] WITH CHECK ADD CONSTRAINT [FK_StudentAcademicRecordExtension_SubmissionCertificationDescriptor] FOREIGN KEY ([SubmissionCertificationDescriptorId])
REFERENCES [extension].[SubmissionCertificationDescriptor] ([SubmissionCertificationDescriptorId])
GO

CREATE NONCLUSTERED INDEX [FK_StudentAcademicRecordExtension_SubmissionCertificationDescriptor]
ON [extension].[StudentAcademicRecordExtension] ([SubmissionCertificationDescriptorId] ASC)
GO

ALTER TABLE [extension].[SubmissionCertificationDescriptor] WITH CHECK ADD CONSTRAINT [FK_SubmissionCertificationDescriptor_Descriptor] FOREIGN KEY ([SubmissionCertificationDescriptorId])
REFERENCES [edfi].[Descriptor] ([DescriptorId])
ON DELETE CASCADE
GO

-- Extended Properties [extension].[InstitutionControlDescriptor] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The type of control for an institution (e.g., public or private).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'InstitutionControlDescriptor'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'InstitutionControlDescriptor', @level2type=N'COLUMN', @level2name=N'InstitutionControlDescriptorId'
GO

-- Extended Properties [extension].[InstitutionLevelDescriptor] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The typical level of postsecondary degree offered by the institute.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'InstitutionLevelDescriptor'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'InstitutionLevelDescriptor', @level2type=N'COLUMN', @level2name=N'InstitutionLevelDescriptorId'
GO

-- Extended Properties [extension].[PostSecondaryOrganization] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'PostSecondaryOrganization', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'PostSecondaryOrganization'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The name of the institution.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'PostSecondaryOrganization', @level2type=N'COLUMN', @level2name=N'NameOfInstitution'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The level of the institution.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'PostSecondaryOrganization', @level2type=N'COLUMN', @level2name=N'InstitutionLevelDescriptorId'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The type of control of the institution (i.e., public or private).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'PostSecondaryOrganization', @level2type=N'COLUMN', @level2name=N'InstitutionControlDescriptorId'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'An indication of acceptance.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'PostSecondaryOrganization', @level2type=N'COLUMN', @level2name=N'AcceptanceIndicator'
GO

-- Extended Properties [extension].[SpecialEducationGraduationStatusDescriptor] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The graduation status for special education.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SpecialEducationGraduationStatusDescriptor'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SpecialEducationGraduationStatusDescriptor', @level2type=N'COLUMN', @level2name=N'SpecialEducationGraduationStatusDescriptorId'
GO

-- Extended Properties [extension].[StudentAcademicRecordClassRankingExtension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Class Ranking Extension', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordClassRankingExtension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The identifier assigned to an education agency by the State Education Agency (SEA).  Also known as the State LEA ID.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordClassRankingExtension', @level2type=N'COLUMN', @level2name=N'EducationOrganizationId'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The identifier for the school year.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordClassRankingExtension', @level2type=N'COLUMN', @level2name=N'SchoolYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique alphanumeric code assigned to a student.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordClassRankingExtension', @level2type=N'COLUMN', @level2name=N'StudentUSI'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The term for the session during the school year.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordClassRankingExtension', @level2type=N'COLUMN', @level2name=N'TermDescriptorId'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The graduation status for special education.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordClassRankingExtension', @level2type=N'COLUMN', @level2name=N'SpecialEducationGraduationStatusDescriptorId'
GO

-- Extended Properties [extension].[StudentAcademicRecordExtension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordExtension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The identifier assigned to an education agency by the State Education Agency (SEA).  Also known as the State LEA ID.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordExtension', @level2type=N'COLUMN', @level2name=N'EducationOrganizationId'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The identifier for the school year.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordExtension', @level2type=N'COLUMN', @level2name=N'SchoolYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique alphanumeric code assigned to a student.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordExtension', @level2type=N'COLUMN', @level2name=N'StudentUSI'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The term for the session during the school year.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordExtension', @level2type=N'COLUMN', @level2name=N'TermDescriptorId'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The name of the institution.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordExtension', @level2type=N'COLUMN', @level2name=N'NameOfInstitution'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The type of submission certification.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StudentAcademicRecordExtension', @level2type=N'COLUMN', @level2name=N'SubmissionCertificationDescriptorId'
GO

-- Extended Properties [extension].[SubmissionCertificationDescriptor] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The type of submission certification.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SubmissionCertificationDescriptor'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SubmissionCertificationDescriptor', @level2type=N'COLUMN', @level2name=N'SubmissionCertificationDescriptorId'
GO


DROP TRIGGER IF EXISTS [sample].[sample_InstitutionControlDescriptor_TR_DeleteTracking]
GO

CREATE TRIGGER [sample].[sample_InstitutionControlDescriptor_TR_DeleteTracking] ON [sample].[InstitutionControlDescriptor] AFTER DELETE AS
BEGIN
    IF @@rowcount = 0 
        RETURN

    SET NOCOUNT ON

    INSERT INTO [tracked_changes_edfi].[Descriptor](OldDescriptorId, OldCodeValue, OldNamespace, Id, Discriminator, ChangeVersion)
    SELECT  d.InstitutionControlDescriptorId, b.CodeValue, b.Namespace, b.Id, 'sample.InstitutionControlDescriptor', (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM    deleted d
            INNER JOIN edfi.Descriptor b ON d.InstitutionControlDescriptorId = b.DescriptorId
END
GO

ALTER TABLE [sample].[InstitutionControlDescriptor] ENABLE TRIGGER [sample_InstitutionControlDescriptor_TR_DeleteTracking]
GO


DROP TRIGGER IF EXISTS [sample].[sample_InstitutionLevelDescriptor_TR_DeleteTracking]
GO

CREATE TRIGGER [sample].[sample_InstitutionLevelDescriptor_TR_DeleteTracking] ON [sample].[InstitutionLevelDescriptor] AFTER DELETE AS
BEGIN
    IF @@rowcount = 0 
        RETURN

    SET NOCOUNT ON

    INSERT INTO [tracked_changes_edfi].[Descriptor](OldDescriptorId, OldCodeValue, OldNamespace, Id, Discriminator, ChangeVersion)
    SELECT  d.InstitutionLevelDescriptorId, b.CodeValue, b.Namespace, b.Id, 'sample.InstitutionLevelDescriptor', (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM    deleted d
            INNER JOIN edfi.Descriptor b ON d.InstitutionLevelDescriptorId = b.DescriptorId
END
GO

ALTER TABLE [sample].[InstitutionLevelDescriptor] ENABLE TRIGGER [sample_InstitutionLevelDescriptor_TR_DeleteTracking]
GO


DROP TRIGGER IF EXISTS [sample].[sample_PostSecondaryOrganization_TR_DeleteTracking]
GO

CREATE TRIGGER [sample].[sample_PostSecondaryOrganization_TR_DeleteTracking] ON [sample].[PostSecondaryOrganization] AFTER DELETE AS
BEGIN
    IF @@rowcount = 0 
        RETURN

    SET NOCOUNT ON

    INSERT INTO [tracked_changes_sample].[PostSecondaryOrganization](OldNameOfInstitution, Id, Discriminator, ChangeVersion)
    SELECT d.NameOfInstitution, d.Id, d.Discriminator, (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM    deleted d
END
GO

ALTER TABLE [sample].[PostSecondaryOrganization] ENABLE TRIGGER [sample_PostSecondaryOrganization_TR_DeleteTracking]
GO


DROP TRIGGER IF EXISTS [sample].[sample_SpecialEducationGraduationStatusDescriptor_TR_DeleteTracking]
GO

CREATE TRIGGER [sample].[sample_SpecialEducationGraduationStatusDescriptor_TR_DeleteTracking] ON [sample].[SpecialEducationGraduationStatusDescriptor] AFTER DELETE AS
BEGIN
    IF @@rowcount = 0 
        RETURN

    SET NOCOUNT ON

    INSERT INTO [tracked_changes_edfi].[Descriptor](OldDescriptorId, OldCodeValue, OldNamespace, Id, Discriminator, ChangeVersion)
    SELECT  d.SpecialEducationGraduationStatusDescriptorId, b.CodeValue, b.Namespace, b.Id, 'sample.SpecialEducationGraduationStatusDescriptor', (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM    deleted d
            INNER JOIN edfi.Descriptor b ON d.SpecialEducationGraduationStatusDescriptorId = b.DescriptorId
END
GO

ALTER TABLE [sample].[SpecialEducationGraduationStatusDescriptor] ENABLE TRIGGER [sample_SpecialEducationGraduationStatusDescriptor_TR_DeleteTracking]
GO


DROP TRIGGER IF EXISTS [sample].[sample_SubmissionCertificationDescriptor_TR_DeleteTracking]
GO

CREATE TRIGGER [sample].[sample_SubmissionCertificationDescriptor_TR_DeleteTracking] ON [sample].[SubmissionCertificationDescriptor] AFTER DELETE AS
BEGIN
    IF @@rowcount = 0 
        RETURN

    SET NOCOUNT ON

    INSERT INTO [tracked_changes_edfi].[Descriptor](OldDescriptorId, OldCodeValue, OldNamespace, Id, Discriminator, ChangeVersion)
    SELECT  d.SubmissionCertificationDescriptorId, b.CodeValue, b.Namespace, b.Id, 'sample.SubmissionCertificationDescriptor', (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM    deleted d
            INNER JOIN edfi.Descriptor b ON d.SubmissionCertificationDescriptorId = b.DescriptorId
END
GO

ALTER TABLE [sample].[SubmissionCertificationDescriptor] ENABLE TRIGGER [sample_SubmissionCertificationDescriptor_TR_DeleteTracking]
GO



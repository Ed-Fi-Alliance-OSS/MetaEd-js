CREATE TRIGGER [sample].[sample_InstitutionControlDescriptor_TR_DeleteTracking] ON [sample].[InstitutionControlDescriptor] AFTER DELETE AS
BEGIN
    IF @@rowcount = 0 
        RETURN

    SET NOCOUNT ON

    INSERT INTO [changes].[sample_InstitutionControlDescriptor_TrackedDelete](InstitutionControlDescriptorId, Id, ChangeVersion)
    SELECT  d.InstitutionControlDescriptorId, Id, (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM    deleted d
            INNER JOIN edfi.Descriptor b ON d.InstitutionControlDescriptorId = b.DescriptorId
END
GO

ALTER TABLE [sample].[InstitutionControlDescriptor] ENABLE TRIGGER [sample_InstitutionControlDescriptor_TR_DeleteTracking]
GO


CREATE TRIGGER [sample].[sample_InstitutionLevelDescriptor_TR_DeleteTracking] ON [sample].[InstitutionLevelDescriptor] AFTER DELETE AS
BEGIN
    IF @@rowcount = 0 
        RETURN

    SET NOCOUNT ON

    INSERT INTO [changes].[sample_InstitutionLevelDescriptor_TrackedDelete](InstitutionLevelDescriptorId, Id, ChangeVersion)
    SELECT  d.InstitutionLevelDescriptorId, Id, (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM    deleted d
            INNER JOIN edfi.Descriptor b ON d.InstitutionLevelDescriptorId = b.DescriptorId
END
GO

ALTER TABLE [sample].[InstitutionLevelDescriptor] ENABLE TRIGGER [sample_InstitutionLevelDescriptor_TR_DeleteTracking]
GO


CREATE TRIGGER [sample].[sample_PostSecondaryOrganization_TR_DeleteTracking] ON [sample].[PostSecondaryOrganization] AFTER DELETE AS
BEGIN
    IF @@rowcount = 0 
        RETURN

    SET NOCOUNT ON

    INSERT INTO [changes].[sample_PostSecondaryOrganization_TrackedDelete](NameOfInstitution, Id, ChangeVersion)
    SELECT  NameOfInstitution, Id, (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM    deleted d
END
GO

ALTER TABLE [sample].[PostSecondaryOrganization] ENABLE TRIGGER [sample_PostSecondaryOrganization_TR_DeleteTracking]
GO


CREATE TRIGGER [sample].[sample_SpecialEducationGraduationStatusDescriptor_TR_DeleteTracking] ON [sample].[SpecialEducationGraduationStatusDescriptor] AFTER DELETE AS
BEGIN
    IF @@rowcount = 0 
        RETURN

    SET NOCOUNT ON

    INSERT INTO [changes].[sample_SpecialEducationGraduationStatusDescriptor_TrackedDelete](SpecialEducationGraduationStatusDescriptorId, Id, ChangeVersion)
    SELECT  d.SpecialEducationGraduationStatusDescriptorId, Id, (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM    deleted d
            INNER JOIN edfi.Descriptor b ON d.SpecialEducationGraduationStatusDescriptorId = b.DescriptorId
END
GO

ALTER TABLE [sample].[SpecialEducationGraduationStatusDescriptor] ENABLE TRIGGER [sample_SpecialEducationGraduationStatusDescriptor_TR_DeleteTracking]
GO


CREATE TRIGGER [sample].[sample_SubmissionCertificationDescriptor_TR_DeleteTracking] ON [sample].[SubmissionCertificationDescriptor] AFTER DELETE AS
BEGIN
    IF @@rowcount = 0 
        RETURN

    SET NOCOUNT ON

    INSERT INTO [changes].[sample_SubmissionCertificationDescriptor_TrackedDelete](SubmissionCertificationDescriptorId, Id, ChangeVersion)
    SELECT  d.SubmissionCertificationDescriptorId, Id, (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM    deleted d
            INNER JOIN edfi.Descriptor b ON d.SubmissionCertificationDescriptorId = b.DescriptorId
END
GO

ALTER TABLE [sample].[SubmissionCertificationDescriptor] ENABLE TRIGGER [sample_SubmissionCertificationDescriptor_TR_DeleteTracking]
GO



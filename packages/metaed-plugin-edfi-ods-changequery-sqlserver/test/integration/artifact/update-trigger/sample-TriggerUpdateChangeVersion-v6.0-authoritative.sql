DROP TRIGGER IF EXISTS [sample].[sample_PostSecondaryOrganization_TR_UpdateChangeVersion]
GO

CREATE TRIGGER [sample].[sample_PostSecondaryOrganization_TR_UpdateChangeVersion] ON [sample].[PostSecondaryOrganization] AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [sample].[PostSecondaryOrganization]
    SET ChangeVersion = (NEXT VALUE FOR [changes].[ChangeVersionSequence])
    FROM [sample].[PostSecondaryOrganization] u
    WHERE EXISTS (SELECT 1 FROM inserted i WHERE i.id = u.id);
END	
GO


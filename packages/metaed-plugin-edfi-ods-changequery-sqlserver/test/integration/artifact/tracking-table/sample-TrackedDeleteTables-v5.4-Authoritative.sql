IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'tracked_changes_sample')
EXEC sys.sp_executesql N'CREATE SCHEMA [tracked_changes_sample]'
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE object_id = OBJECT_ID(N'[tracked_changes_sample].[PostSecondaryOrganization]'))
CREATE TABLE [tracked_changes_sample].[PostSecondaryOrganization]
(
       OldNameOfInstitution [NVARCHAR](75) NOT NULL,
       NewNameOfInstitution [NVARCHAR](75) NULL,
       Id uniqueidentifier NOT NULL,
       ChangeVersion bigint NOT NULL,
       Discriminator [NVARCHAR](128) NULL,
       CreateDate DateTime2 NOT NULL DEFAULT (getutcdate()),
       CONSTRAINT PK_PostSecondaryOrganization PRIMARY KEY CLUSTERED (ChangeVersion)
)

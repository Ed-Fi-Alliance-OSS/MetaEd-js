IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[sample].[PostSecondaryOrganization]') AND name = 'ChangeVersion')
ALTER TABLE [sample].[PostSecondaryOrganization] ADD [ChangeVersion] [BIGINT] CONSTRAINT PostSecondaryOrganization_DF_ChangeVersion DEFAULT (0) NOT NULL;
ALTER TABLE [sample].[PostSecondaryOrganization] DROP CONSTRAINT PostSecondaryOrganization_DF_ChangeVersion;
ALTER TABLE [sample].[PostSecondaryOrganization] ADD CONSTRAINT PostSecondaryOrganization_DF_ChangeVersion DEFAULT (NEXT VALUE FOR [changes].[ChangeVersionSequence]) For [ChangeVersion];


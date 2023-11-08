
IF NOT EXISTS(SELECT * FROM sys.indexes WHERE name='IX_ChartOfAccount_EducationOrganizationId' AND object_id = OBJECT_ID('extension.ChartOfAccount')) 
BEGIN
    CREATE INDEX IX_ChartOfAccount_EducationOrganizationId ON extension.ChartOfAccount(EducationOrganizationId) INCLUDE (Id)
END;

IF NOT EXISTS(SELECT * FROM sys.indexes WHERE name='IX_LocalAccount_EducationOrganizationId' AND object_id = OBJECT_ID('extension.LocalAccount')) 
BEGIN
    CREATE INDEX IX_LocalAccount_EducationOrganizationId ON extension.LocalAccount(EducationOrganizationId) INCLUDE (Id)
END;

IF NOT EXISTS(SELECT * FROM sys.indexes WHERE name='IX_LocalActual_EducationOrganizationId' AND object_id = OBJECT_ID('extension.LocalActual')) 
BEGIN
    CREATE INDEX IX_LocalActual_EducationOrganizationId ON extension.LocalActual(EducationOrganizationId) INCLUDE (Id)
END;

IF NOT EXISTS(SELECT * FROM sys.indexes WHERE name='IX_LocalBudget_EducationOrganizationId' AND object_id = OBJECT_ID('extension.LocalBudget')) 
BEGIN
    CREATE INDEX IX_LocalBudget_EducationOrganizationId ON extension.LocalBudget(EducationOrganizationId) INCLUDE (Id)
END;

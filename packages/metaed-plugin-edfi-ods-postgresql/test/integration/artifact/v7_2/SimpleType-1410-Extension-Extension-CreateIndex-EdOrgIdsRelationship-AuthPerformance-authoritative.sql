
CREATE INDEX IF NOT EXISTS IX_ChartOfAccount_EducationOrganizationId ON extension.ChartOfAccount(EducationOrganizationId) INCLUDE (Id);

CREATE INDEX IF NOT EXISTS IX_LocalAccount_EducationOrganizationId ON extension.LocalAccount(EducationOrganizationId) INCLUDE (Id);

CREATE INDEX IF NOT EXISTS IX_LocalActual_EducationOrganizationId ON extension.LocalActual(EducationOrganizationId) INCLUDE (Id);

CREATE INDEX IF NOT EXISTS IX_LocalBudget_EducationOrganizationId ON extension.LocalBudget(EducationOrganizationId) INCLUDE (Id);

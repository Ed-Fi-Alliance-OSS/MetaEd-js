ALTER TABLE extension.AccountTypeDescriptor ADD CONSTRAINT FK_8f249f_Descriptor FOREIGN KEY (AccountTypeDescriptorId)
REFERENCES edfi.Descriptor (DescriptorId)
ON DELETE CASCADE
;

ALTER TABLE extension.BalanceSheetDimensionReportingTag ADD CONSTRAINT FK_bcbd82_BalanceSheetDimension FOREIGN KEY (BalanceSheetCode, FiscalYear)
REFERENCES extension.BalanceSheetDimension (BalanceSheetCode, FiscalYear)
ON DELETE CASCADE
;

ALTER TABLE extension.BalanceSheetDimensionReportingTag ADD CONSTRAINT FK_bcbd82_ReportingTagDescriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES extension.ReportingTagDescriptor (ReportingTagDescriptorId)
;

CREATE INDEX FK_bcbd82_ReportingTagDescriptor
ON extension.BalanceSheetDimensionReportingTag (ReportingTagDescriptorId ASC);

ALTER TABLE extension.ChartOfAccount ADD CONSTRAINT FK_131e2b_AccountTypeDescriptor FOREIGN KEY (AccountTypeDescriptorId)
REFERENCES extension.AccountTypeDescriptor (AccountTypeDescriptorId)
;

CREATE INDEX FK_131e2b_AccountTypeDescriptor
ON extension.ChartOfAccount (AccountTypeDescriptorId ASC);

ALTER TABLE extension.ChartOfAccount ADD CONSTRAINT FK_131e2b_BalanceSheetDimension FOREIGN KEY (BalanceSheetCode, FiscalYear)
REFERENCES extension.BalanceSheetDimension (BalanceSheetCode, FiscalYear)
;

CREATE INDEX FK_131e2b_BalanceSheetDimension
ON extension.ChartOfAccount (BalanceSheetCode ASC, FiscalYear ASC);

ALTER TABLE extension.ChartOfAccount ADD CONSTRAINT FK_131e2b_EducationOrganization FOREIGN KEY (EducationOrganizationId)
REFERENCES edfi.EducationOrganization (EducationOrganizationId)
;

ALTER TABLE extension.ChartOfAccount ADD CONSTRAINT FK_131e2b_FunctionDimension FOREIGN KEY (FiscalYear, FunctionCode)
REFERENCES extension.FunctionDimension (FiscalYear, FunctionCode)
;

CREATE INDEX FK_131e2b_FunctionDimension
ON extension.ChartOfAccount (FiscalYear ASC, FunctionCode ASC);

ALTER TABLE extension.ChartOfAccount ADD CONSTRAINT FK_131e2b_FundDimension FOREIGN KEY (FiscalYear, FundCode)
REFERENCES extension.FundDimension (FiscalYear, FundCode)
;

CREATE INDEX FK_131e2b_FundDimension
ON extension.ChartOfAccount (FiscalYear ASC, FundCode ASC);

ALTER TABLE extension.ChartOfAccount ADD CONSTRAINT FK_131e2b_ObjectDimension FOREIGN KEY (FiscalYear, ObjectCode)
REFERENCES extension.ObjectDimension (FiscalYear, ObjectCode)
;

CREATE INDEX FK_131e2b_ObjectDimension
ON extension.ChartOfAccount (FiscalYear ASC, ObjectCode ASC);

ALTER TABLE extension.ChartOfAccount ADD CONSTRAINT FK_131e2b_OperationalUnitDimension FOREIGN KEY (FiscalYear, OperationalUnitCode)
REFERENCES extension.OperationalUnitDimension (FiscalYear, OperationalUnitCode)
;

CREATE INDEX FK_131e2b_OperationalUnitDimension
ON extension.ChartOfAccount (FiscalYear ASC, OperationalUnitCode ASC);

ALTER TABLE extension.ChartOfAccount ADD CONSTRAINT FK_131e2b_ProgramDimension FOREIGN KEY (FiscalYear, ProgramCode)
REFERENCES extension.ProgramDimension (FiscalYear, ProgramCode)
;

CREATE INDEX FK_131e2b_ProgramDimension
ON extension.ChartOfAccount (FiscalYear ASC, ProgramCode ASC);

ALTER TABLE extension.ChartOfAccount ADD CONSTRAINT FK_131e2b_ProjectDimension FOREIGN KEY (FiscalYear, ProjectCode)
REFERENCES extension.ProjectDimension (FiscalYear, ProjectCode)
;

CREATE INDEX FK_131e2b_ProjectDimension
ON extension.ChartOfAccount (FiscalYear ASC, ProjectCode ASC);

ALTER TABLE extension.ChartOfAccount ADD CONSTRAINT FK_131e2b_SourceDimension FOREIGN KEY (FiscalYear, SourceCode)
REFERENCES extension.SourceDimension (FiscalYear, SourceCode)
;

CREATE INDEX FK_131e2b_SourceDimension
ON extension.ChartOfAccount (FiscalYear ASC, SourceCode ASC);

ALTER TABLE extension.ChartOfAccountReportingTag ADD CONSTRAINT FK_8422f4_ChartOfAccount FOREIGN KEY (AccountIdentifier, EducationOrganizationId, FiscalYear)
REFERENCES extension.ChartOfAccount (AccountIdentifier, EducationOrganizationId, FiscalYear)
ON DELETE CASCADE
;

ALTER TABLE extension.ChartOfAccountReportingTag ADD CONSTRAINT FK_8422f4_ReportingTagDescriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES extension.ReportingTagDescriptor (ReportingTagDescriptorId)
;

CREATE INDEX FK_8422f4_ReportingTagDescriptor
ON extension.ChartOfAccountReportingTag (ReportingTagDescriptorId ASC);

ALTER TABLE extension.FinancialCollectionDescriptor ADD CONSTRAINT FK_6dc716_Descriptor FOREIGN KEY (FinancialCollectionDescriptorId)
REFERENCES edfi.Descriptor (DescriptorId)
ON DELETE CASCADE
;

ALTER TABLE extension.FunctionDimensionReportingTag ADD CONSTRAINT FK_8d455d_FunctionDimension FOREIGN KEY (FiscalYear, FunctionCode)
REFERENCES extension.FunctionDimension (FiscalYear, FunctionCode)
ON DELETE CASCADE
;

ALTER TABLE extension.FunctionDimensionReportingTag ADD CONSTRAINT FK_8d455d_ReportingTagDescriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES extension.ReportingTagDescriptor (ReportingTagDescriptorId)
;

CREATE INDEX FK_8d455d_ReportingTagDescriptor
ON extension.FunctionDimensionReportingTag (ReportingTagDescriptorId ASC);

ALTER TABLE extension.FundDimensionReportingTag ADD CONSTRAINT FK_7062bd_FundDimension FOREIGN KEY (FiscalYear, FundCode)
REFERENCES extension.FundDimension (FiscalYear, FundCode)
ON DELETE CASCADE
;

ALTER TABLE extension.FundDimensionReportingTag ADD CONSTRAINT FK_7062bd_ReportingTagDescriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES extension.ReportingTagDescriptor (ReportingTagDescriptorId)
;

CREATE INDEX FK_7062bd_ReportingTagDescriptor
ON extension.FundDimensionReportingTag (ReportingTagDescriptorId ASC);

ALTER TABLE extension.LocalAccount ADD CONSTRAINT FK_32eddb_ChartOfAccount FOREIGN KEY (ChartOfAccountIdentifier, ChartOfAccountEducationOrganizationId, FiscalYear)
REFERENCES extension.ChartOfAccount (AccountIdentifier, EducationOrganizationId, FiscalYear)
;

CREATE INDEX FK_32eddb_ChartOfAccount
ON extension.LocalAccount (ChartOfAccountIdentifier ASC, ChartOfAccountEducationOrganizationId ASC, FiscalYear ASC);

ALTER TABLE extension.LocalAccount ADD CONSTRAINT FK_32eddb_EducationOrganization FOREIGN KEY (EducationOrganizationId)
REFERENCES edfi.EducationOrganization (EducationOrganizationId)
;

ALTER TABLE extension.LocalAccountReportingTag ADD CONSTRAINT FK_c38935_LocalAccount FOREIGN KEY (AccountIdentifier, EducationOrganizationId, FiscalYear)
REFERENCES extension.LocalAccount (AccountIdentifier, EducationOrganizationId, FiscalYear)
ON DELETE CASCADE
;

ALTER TABLE extension.LocalAccountReportingTag ADD CONSTRAINT FK_c38935_ReportingTagDescriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES extension.ReportingTagDescriptor (ReportingTagDescriptorId)
;

CREATE INDEX FK_c38935_ReportingTagDescriptor
ON extension.LocalAccountReportingTag (ReportingTagDescriptorId ASC);

ALTER TABLE extension.LocalActual ADD CONSTRAINT FK_b6310e_FinancialCollectionDescriptor FOREIGN KEY (FinancialCollectionDescriptorId)
REFERENCES extension.FinancialCollectionDescriptor (FinancialCollectionDescriptorId)
;

CREATE INDEX FK_b6310e_FinancialCollectionDescriptor
ON extension.LocalActual (FinancialCollectionDescriptorId ASC);

ALTER TABLE extension.LocalActual ADD CONSTRAINT FK_b6310e_LocalAccount FOREIGN KEY (AccountIdentifier, EducationOrganizationId, FiscalYear)
REFERENCES extension.LocalAccount (AccountIdentifier, EducationOrganizationId, FiscalYear)
;

CREATE INDEX FK_b6310e_LocalAccount
ON extension.LocalActual (AccountIdentifier ASC, EducationOrganizationId ASC, FiscalYear ASC);

ALTER TABLE extension.LocalBudget ADD CONSTRAINT FK_000683_FinancialCollectionDescriptor FOREIGN KEY (FinancialCollectionDescriptorId)
REFERENCES extension.FinancialCollectionDescriptor (FinancialCollectionDescriptorId)
;

CREATE INDEX FK_000683_FinancialCollectionDescriptor
ON extension.LocalBudget (FinancialCollectionDescriptorId ASC);

ALTER TABLE extension.LocalBudget ADD CONSTRAINT FK_000683_LocalAccount FOREIGN KEY (AccountIdentifier, EducationOrganizationId, FiscalYear)
REFERENCES extension.LocalAccount (AccountIdentifier, EducationOrganizationId, FiscalYear)
;

CREATE INDEX FK_000683_LocalAccount
ON extension.LocalBudget (AccountIdentifier ASC, EducationOrganizationId ASC, FiscalYear ASC);

ALTER TABLE extension.ObjectDimensionReportingTag ADD CONSTRAINT FK_fda3b7_ObjectDimension FOREIGN KEY (FiscalYear, ObjectCode)
REFERENCES extension.ObjectDimension (FiscalYear, ObjectCode)
ON DELETE CASCADE
;

ALTER TABLE extension.ObjectDimensionReportingTag ADD CONSTRAINT FK_fda3b7_ReportingTagDescriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES extension.ReportingTagDescriptor (ReportingTagDescriptorId)
;

CREATE INDEX FK_fda3b7_ReportingTagDescriptor
ON extension.ObjectDimensionReportingTag (ReportingTagDescriptorId ASC);

ALTER TABLE extension.OperationalUnitDimensionReportingTag ADD CONSTRAINT FK_3b06c7_OperationalUnitDimension FOREIGN KEY (FiscalYear, OperationalUnitCode)
REFERENCES extension.OperationalUnitDimension (FiscalYear, OperationalUnitCode)
ON DELETE CASCADE
;

ALTER TABLE extension.OperationalUnitDimensionReportingTag ADD CONSTRAINT FK_3b06c7_ReportingTagDescriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES extension.ReportingTagDescriptor (ReportingTagDescriptorId)
;

CREATE INDEX FK_3b06c7_ReportingTagDescriptor
ON extension.OperationalUnitDimensionReportingTag (ReportingTagDescriptorId ASC);

ALTER TABLE extension.ProgramDimensionReportingTag ADD CONSTRAINT FK_3e04ae_ProgramDimension FOREIGN KEY (FiscalYear, ProgramCode)
REFERENCES extension.ProgramDimension (FiscalYear, ProgramCode)
ON DELETE CASCADE
;

ALTER TABLE extension.ProgramDimensionReportingTag ADD CONSTRAINT FK_3e04ae_ReportingTagDescriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES extension.ReportingTagDescriptor (ReportingTagDescriptorId)
;

CREATE INDEX FK_3e04ae_ReportingTagDescriptor
ON extension.ProgramDimensionReportingTag (ReportingTagDescriptorId ASC);

ALTER TABLE extension.ProjectDimensionReportingTag ADD CONSTRAINT FK_b5314a_ProjectDimension FOREIGN KEY (FiscalYear, ProjectCode)
REFERENCES extension.ProjectDimension (FiscalYear, ProjectCode)
ON DELETE CASCADE
;

ALTER TABLE extension.ProjectDimensionReportingTag ADD CONSTRAINT FK_b5314a_ReportingTagDescriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES extension.ReportingTagDescriptor (ReportingTagDescriptorId)
;

CREATE INDEX FK_b5314a_ReportingTagDescriptor
ON extension.ProjectDimensionReportingTag (ReportingTagDescriptorId ASC);

ALTER TABLE extension.ReportingTagDescriptor ADD CONSTRAINT FK_b173f4_Descriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES edfi.Descriptor (DescriptorId)
ON DELETE CASCADE
;

ALTER TABLE extension.SourceDimensionReportingTag ADD CONSTRAINT FK_0c6eff_ReportingTagDescriptor FOREIGN KEY (ReportingTagDescriptorId)
REFERENCES extension.ReportingTagDescriptor (ReportingTagDescriptorId)
;

CREATE INDEX FK_0c6eff_ReportingTagDescriptor
ON extension.SourceDimensionReportingTag (ReportingTagDescriptorId ASC);

ALTER TABLE extension.SourceDimensionReportingTag ADD CONSTRAINT FK_0c6eff_SourceDimension FOREIGN KEY (FiscalYear, SourceCode)
REFERENCES extension.SourceDimension (FiscalYear, SourceCode)
ON DELETE CASCADE
;


ALTER TABLE [extension].[AccountTypeDescriptor] WITH CHECK ADD CONSTRAINT [FK_AccountTypeDescriptor_Descriptor] FOREIGN KEY ([AccountTypeDescriptorId])
REFERENCES [edfi].[Descriptor] ([DescriptorId])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[BalanceSheetDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_BalanceSheetDimensionReportingTag_BalanceSheetDimension] FOREIGN KEY ([BalanceSheetCode], [FiscalYear])
REFERENCES [extension].[BalanceSheetDimension] ([BalanceSheetCode], [FiscalYear])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[BalanceSheetDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_BalanceSheetDimensionReportingTag_ReportingTagDescriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [extension].[ReportingTagDescriptor] ([ReportingTagDescriptorId])
GO

ALTER TABLE [extension].[ChartOfAccount] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccount_AccountTypeDescriptor] FOREIGN KEY ([AccountTypeDescriptorId])
REFERENCES [extension].[AccountTypeDescriptor] ([AccountTypeDescriptorId])
GO

ALTER TABLE [extension].[ChartOfAccount] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccount_BalanceSheetDimension] FOREIGN KEY ([BalanceSheetCode], [FiscalYear])
REFERENCES [extension].[BalanceSheetDimension] ([BalanceSheetCode], [FiscalYear])
GO

ALTER TABLE [extension].[ChartOfAccount] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccount_EducationOrganization] FOREIGN KEY ([EducationOrganizationId])
REFERENCES [edfi].[EducationOrganization] ([EducationOrganizationId])
GO

ALTER TABLE [extension].[ChartOfAccount] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccount_FunctionDimension] FOREIGN KEY ([FiscalYear], [FunctionCode])
REFERENCES [extension].[FunctionDimension] ([FiscalYear], [FunctionCode])
GO

ALTER TABLE [extension].[ChartOfAccount] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccount_FundDimension] FOREIGN KEY ([FiscalYear], [FundCode])
REFERENCES [extension].[FundDimension] ([FiscalYear], [FundCode])
GO

ALTER TABLE [extension].[ChartOfAccount] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccount_ObjectDimension] FOREIGN KEY ([FiscalYear], [ObjectCode])
REFERENCES [extension].[ObjectDimension] ([FiscalYear], [ObjectCode])
GO

ALTER TABLE [extension].[ChartOfAccount] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccount_OperationalUnitDimension] FOREIGN KEY ([FiscalYear], [OperationalUnitCode])
REFERENCES [extension].[OperationalUnitDimension] ([FiscalYear], [OperationalUnitCode])
GO

ALTER TABLE [extension].[ChartOfAccount] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccount_ProgramDimension] FOREIGN KEY ([FiscalYear], [ProgramCode])
REFERENCES [extension].[ProgramDimension] ([FiscalYear], [ProgramCode])
GO

ALTER TABLE [extension].[ChartOfAccount] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccount_ProjectDimension] FOREIGN KEY ([FiscalYear], [ProjectCode])
REFERENCES [extension].[ProjectDimension] ([FiscalYear], [ProjectCode])
GO

ALTER TABLE [extension].[ChartOfAccount] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccount_SourceDimension] FOREIGN KEY ([FiscalYear], [SourceCode])
REFERENCES [extension].[SourceDimension] ([FiscalYear], [SourceCode])
GO

ALTER TABLE [extension].[ChartOfAccountReportingTag] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccountReportingTag_ChartOfAccount] FOREIGN KEY ([AccountIdentifier], [EducationOrganizationId], [FiscalYear])
REFERENCES [extension].[ChartOfAccount] ([AccountIdentifier], [EducationOrganizationId], [FiscalYear])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[ChartOfAccountReportingTag] WITH CHECK ADD CONSTRAINT [FK_ChartOfAccountReportingTag_ReportingTagDescriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [extension].[ReportingTagDescriptor] ([ReportingTagDescriptorId])
GO

ALTER TABLE [extension].[FinancialCollectionDescriptor] WITH CHECK ADD CONSTRAINT [FK_FinancialCollectionDescriptor_Descriptor] FOREIGN KEY ([FinancialCollectionDescriptorId])
REFERENCES [edfi].[Descriptor] ([DescriptorId])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[FunctionDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_FunctionDimensionReportingTag_FunctionDimension] FOREIGN KEY ([FiscalYear], [FunctionCode])
REFERENCES [extension].[FunctionDimension] ([FiscalYear], [FunctionCode])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[FunctionDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_FunctionDimensionReportingTag_ReportingTagDescriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [extension].[ReportingTagDescriptor] ([ReportingTagDescriptorId])
GO

ALTER TABLE [extension].[FundDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_FundDimensionReportingTag_FundDimension] FOREIGN KEY ([FiscalYear], [FundCode])
REFERENCES [extension].[FundDimension] ([FiscalYear], [FundCode])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[FundDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_FundDimensionReportingTag_ReportingTagDescriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [extension].[ReportingTagDescriptor] ([ReportingTagDescriptorId])
GO

ALTER TABLE [extension].[LocalAccount] WITH CHECK ADD CONSTRAINT [FK_LocalAccount_ChartOfAccount] FOREIGN KEY ([ChartOfAccountIdentifier], [ChartOfAccountEducationOrganizationId], [FiscalYear])
REFERENCES [extension].[ChartOfAccount] ([AccountIdentifier], [EducationOrganizationId], [FiscalYear])
GO

ALTER TABLE [extension].[LocalAccount] WITH CHECK ADD CONSTRAINT [FK_LocalAccount_EducationOrganization] FOREIGN KEY ([EducationOrganizationId])
REFERENCES [edfi].[EducationOrganization] ([EducationOrganizationId])
GO

ALTER TABLE [extension].[LocalAccountReportingTag] WITH CHECK ADD CONSTRAINT [FK_LocalAccountReportingTag_LocalAccount] FOREIGN KEY ([AccountIdentifier], [EducationOrganizationId], [FiscalYear])
REFERENCES [extension].[LocalAccount] ([AccountIdentifier], [EducationOrganizationId], [FiscalYear])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[LocalAccountReportingTag] WITH CHECK ADD CONSTRAINT [FK_LocalAccountReportingTag_ReportingTagDescriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [extension].[ReportingTagDescriptor] ([ReportingTagDescriptorId])
GO

ALTER TABLE [extension].[LocalActual] WITH CHECK ADD CONSTRAINT [FK_LocalActual_FinancialCollectionDescriptor] FOREIGN KEY ([FinancialCollectionDescriptorId])
REFERENCES [extension].[FinancialCollectionDescriptor] ([FinancialCollectionDescriptorId])
GO

ALTER TABLE [extension].[LocalActual] WITH CHECK ADD CONSTRAINT [FK_LocalActual_LocalAccount] FOREIGN KEY ([AccountIdentifier], [EducationOrganizationId], [FiscalYear])
REFERENCES [extension].[LocalAccount] ([AccountIdentifier], [EducationOrganizationId], [FiscalYear])
GO

ALTER TABLE [extension].[LocalBudget] WITH CHECK ADD CONSTRAINT [FK_LocalBudget_FinancialCollectionDescriptor] FOREIGN KEY ([FinancialCollectionDescriptorId])
REFERENCES [extension].[FinancialCollectionDescriptor] ([FinancialCollectionDescriptorId])
GO

ALTER TABLE [extension].[LocalBudget] WITH CHECK ADD CONSTRAINT [FK_LocalBudget_LocalAccount] FOREIGN KEY ([AccountIdentifier], [EducationOrganizationId], [FiscalYear])
REFERENCES [extension].[LocalAccount] ([AccountIdentifier], [EducationOrganizationId], [FiscalYear])
GO

ALTER TABLE [extension].[ObjectDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_ObjectDimensionReportingTag_ObjectDimension] FOREIGN KEY ([FiscalYear], [ObjectCode])
REFERENCES [extension].[ObjectDimension] ([FiscalYear], [ObjectCode])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[ObjectDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_ObjectDimensionReportingTag_ReportingTagDescriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [extension].[ReportingTagDescriptor] ([ReportingTagDescriptorId])
GO

ALTER TABLE [extension].[OperationalUnitDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_OperationalUnitDimensionReportingTag_OperationalUnitDimension] FOREIGN KEY ([FiscalYear], [OperationalUnitCode])
REFERENCES [extension].[OperationalUnitDimension] ([FiscalYear], [OperationalUnitCode])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[OperationalUnitDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_OperationalUnitDimensionReportingTag_ReportingTagDescriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [extension].[ReportingTagDescriptor] ([ReportingTagDescriptorId])
GO

ALTER TABLE [extension].[ProgramDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_ProgramDimensionReportingTag_ProgramDimension] FOREIGN KEY ([FiscalYear], [ProgramCode])
REFERENCES [extension].[ProgramDimension] ([FiscalYear], [ProgramCode])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[ProgramDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_ProgramDimensionReportingTag_ReportingTagDescriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [extension].[ReportingTagDescriptor] ([ReportingTagDescriptorId])
GO

ALTER TABLE [extension].[ProjectDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_ProjectDimensionReportingTag_ProjectDimension] FOREIGN KEY ([FiscalYear], [ProjectCode])
REFERENCES [extension].[ProjectDimension] ([FiscalYear], [ProjectCode])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[ProjectDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_ProjectDimensionReportingTag_ReportingTagDescriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [extension].[ReportingTagDescriptor] ([ReportingTagDescriptorId])
GO

ALTER TABLE [extension].[ReportingTagDescriptor] WITH CHECK ADD CONSTRAINT [FK_ReportingTagDescriptor_Descriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [edfi].[Descriptor] ([DescriptorId])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[SourceDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_SourceDimensionReportingTag_ReportingTagDescriptor] FOREIGN KEY ([ReportingTagDescriptorId])
REFERENCES [extension].[ReportingTagDescriptor] ([ReportingTagDescriptorId])
GO

ALTER TABLE [extension].[SourceDimensionReportingTag] WITH CHECK ADD CONSTRAINT [FK_SourceDimensionReportingTag_SourceDimension] FOREIGN KEY ([FiscalYear], [SourceCode])
REFERENCES [extension].[SourceDimension] ([FiscalYear], [SourceCode])
ON DELETE CASCADE
GO


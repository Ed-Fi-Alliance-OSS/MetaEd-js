-- Extended Properties [extension].[AccountTypeDescriptor] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Type of Account such as Revenue, Expenditure, or Balance Sheet.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'AccountTypeDescriptor'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'AccountTypeDescriptor', @level2type=N'COLUMN', @level2name=N'AccountTypeDescriptorId'
GO

-- Extended Properties [extension].[BalanceSheetDimension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'NCES Balance Sheet Dimension', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'BalanceSheetDimension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'BalanceSheetDimension', @level2type=N'COLUMN', @level2name=N'BalanceSheetCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'BalanceSheetDimension', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A description of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'BalanceSheetDimension', @level2type=N'COLUMN', @level2name=N'CodeName'
GO

-- Extended Properties [extension].[BalanceSheetDimensionReportingTag] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'BalanceSheetDimensionReportingTag'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'BalanceSheetDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'BalanceSheetCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'BalanceSheetDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'BalanceSheetDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO

-- Extended Properties [extension].[ChartOfAccount] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A valid combination of account dimensions under which financials are reported.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Code value for the valid combination of account dimensions under which financials are reported.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'AccountIdentifier'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fiscal year for the account', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A descriptive name for the account', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'AccountName'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Type of Account such as Revenue, Expenditure, or Balance Sheet.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'AccountTypeDescriptorId'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'BalanceSheetCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'FunctionCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'FundCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'ObjectCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'OperationalUnitCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'ProgramCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'ProjectCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccount', @level2type=N'COLUMN', @level2name=N'SourceCode'
GO

-- Extended Properties [extension].[ChartOfAccountReportingTag] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccountReportingTag'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Code value for the valid combination of account dimensions under which financials are reported.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccountReportingTag', @level2type=N'COLUMN', @level2name=N'AccountIdentifier'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fiscal year for the account', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccountReportingTag', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ChartOfAccountReportingTag', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO

-- Extended Properties [extension].[FinancialCollectionDescriptor] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The accounting period or grouping for which financial information is collected.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FinancialCollectionDescriptor'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FinancialCollectionDescriptor', @level2type=N'COLUMN', @level2name=N'FinancialCollectionDescriptorId'
GO

-- Extended Properties [extension].[FunctionDimension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'NCES Function Dimension', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FunctionDimension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FunctionDimension', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FunctionDimension', @level2type=N'COLUMN', @level2name=N'FunctionCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A description of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FunctionDimension', @level2type=N'COLUMN', @level2name=N'CodeName'
GO

-- Extended Properties [extension].[FunctionDimensionReportingTag] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FunctionDimensionReportingTag'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FunctionDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FunctionDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'FunctionCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FunctionDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO

-- Extended Properties [extension].[FundDimension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'NCES Fund Dimension', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FundDimension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FundDimension', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FundDimension', @level2type=N'COLUMN', @level2name=N'FundCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A description of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FundDimension', @level2type=N'COLUMN', @level2name=N'CodeName'
GO

-- Extended Properties [extension].[FundDimensionReportingTag] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FundDimensionReportingTag'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FundDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FundDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'FundCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'FundDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO

-- Extended Properties [extension].[LocalAccount] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'This is documentation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalAccount'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'This is documentation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalAccount', @level2type=N'COLUMN', @level2name=N'AccountIdentifier'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fiscal year for the account', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalAccount', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A descriptive name for the account', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalAccount', @level2type=N'COLUMN', @level2name=N'AccountName'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Code value for the valid combination of account dimensions under which financials are reported.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalAccount', @level2type=N'COLUMN', @level2name=N'ChartOfAccountIdentifier'
GO

-- Extended Properties [extension].[LocalAccountReportingTag] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalAccountReportingTag'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'This is documentation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalAccountReportingTag', @level2type=N'COLUMN', @level2name=N'AccountIdentifier'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fiscal year for the account', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalAccountReportingTag', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalAccountReportingTag', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO

-- Extended Properties [extension].[LocalActual] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Expense/Revenue amounts', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalActual'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'This is documentation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalActual', @level2type=N'COLUMN', @level2name=N'AccountIdentifier'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date that the amount is applied to.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalActual', @level2type=N'COLUMN', @level2name=N'AsOfDate'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fiscal year for the account', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalActual', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Currency value applied to the account.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalActual', @level2type=N'COLUMN', @level2name=N'Amount'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The accounting period or grouping for which the amount is collected.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalActual', @level2type=N'COLUMN', @level2name=N'FinancialCollectionDescriptorId'
GO

-- Extended Properties [extension].[LocalBudget] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Budget amounts', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalBudget'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'This is documentation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalBudget', @level2type=N'COLUMN', @level2name=N'AccountIdentifier'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date that the amount is applied to.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalBudget', @level2type=N'COLUMN', @level2name=N'AsOfDate'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fiscal year for the account', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalBudget', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Currency value applied to the account.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalBudget', @level2type=N'COLUMN', @level2name=N'Amount'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The accounting period or grouping for which the amount is collected.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'LocalBudget', @level2type=N'COLUMN', @level2name=N'FinancialCollectionDescriptorId'
GO

-- Extended Properties [extension].[ObjectDimension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'NCES Object Dimension', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ObjectDimension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ObjectDimension', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ObjectDimension', @level2type=N'COLUMN', @level2name=N'ObjectCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A description of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ObjectDimension', @level2type=N'COLUMN', @level2name=N'CodeName'
GO

-- Extended Properties [extension].[ObjectDimensionReportingTag] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ObjectDimensionReportingTag'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ObjectDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ObjectDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ObjectCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ObjectDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO

-- Extended Properties [extension].[OperationalUnitDimension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'NCES Operation Unit Dimension', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'OperationalUnitDimension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'OperationalUnitDimension', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'OperationalUnitDimension', @level2type=N'COLUMN', @level2name=N'OperationalUnitCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A description of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'OperationalUnitDimension', @level2type=N'COLUMN', @level2name=N'CodeName'
GO

-- Extended Properties [extension].[OperationalUnitDimensionReportingTag] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'OperationalUnitDimensionReportingTag'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'OperationalUnitDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'OperationalUnitDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'OperationalUnitCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'OperationalUnitDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO

-- Extended Properties [extension].[ProgramDimension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'NCES Program Dimension', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProgramDimension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProgramDimension', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProgramDimension', @level2type=N'COLUMN', @level2name=N'ProgramCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A description of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProgramDimension', @level2type=N'COLUMN', @level2name=N'CodeName'
GO

-- Extended Properties [extension].[ProgramDimensionReportingTag] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProgramDimensionReportingTag'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProgramDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProgramDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ProgramCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProgramDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO

-- Extended Properties [extension].[ProjectDimension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'NCES Project Dimension', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProjectDimension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProjectDimension', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProjectDimension', @level2type=N'COLUMN', @level2name=N'ProjectCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A description of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProjectDimension', @level2type=N'COLUMN', @level2name=N'CodeName'
GO

-- Extended Properties [extension].[ProjectDimensionReportingTag] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProjectDimensionReportingTag'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProjectDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProjectDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ProjectCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ProjectDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO

-- Extended Properties [extension].[ReportingTagDescriptor] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Descriptor for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ReportingTagDescriptor'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'ReportingTagDescriptor', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO

-- Extended Properties [extension].[SourceDimension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'NCES Source Dimension', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SourceDimension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SourceDimension', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SourceDimension', @level2type=N'COLUMN', @level2name=N'SourceCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A description of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SourceDimension', @level2type=N'COLUMN', @level2name=N'CodeName'
GO

-- Extended Properties [extension].[SourceDimensionReportingTag] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SourceDimensionReportingTag'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The fiscal year for which the account dimension is valid.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SourceDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'FiscalYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The code representation of the account dimension.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SourceDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'SourceCode'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Optional tag for accountability reporting (e.g. ESSA).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'SourceDimensionReportingTag', @level2type=N'COLUMN', @level2name=N'ReportingTagDescriptorId'
GO


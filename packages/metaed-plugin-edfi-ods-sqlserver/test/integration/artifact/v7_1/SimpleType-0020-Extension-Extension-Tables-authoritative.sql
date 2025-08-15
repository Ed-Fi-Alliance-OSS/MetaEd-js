-- Table [extension].[AccountTypeDescriptor] --
CREATE TABLE [extension].[AccountTypeDescriptor] (
    [AccountTypeDescriptorId] [INT] NOT NULL,
    CONSTRAINT [AccountTypeDescriptor_PK] PRIMARY KEY CLUSTERED (
        [AccountTypeDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Table [extension].[BalanceSheetDimension] --
CREATE TABLE [extension].[BalanceSheetDimension] (
    [BalanceSheetCode] [NVARCHAR](16) NOT NULL,
    [FiscalYear] [SMALLINT] NOT NULL,
    [CodeName] [NVARCHAR](100) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [BalanceSheetDimension_PK] PRIMARY KEY CLUSTERED (
        [BalanceSheetCode] ASC,
        [FiscalYear] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[BalanceSheetDimension] ADD CONSTRAINT [BalanceSheetDimension_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[BalanceSheetDimension] ADD CONSTRAINT [BalanceSheetDimension_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[BalanceSheetDimension] ADD CONSTRAINT [BalanceSheetDimension_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[BalanceSheetDimensionReportingTag] --
CREATE TABLE [extension].[BalanceSheetDimensionReportingTag] (
    [BalanceSheetCode] [NVARCHAR](16) NOT NULL,
    [FiscalYear] [SMALLINT] NOT NULL,
    [ReportingTagDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [BalanceSheetDimensionReportingTag_PK] PRIMARY KEY CLUSTERED (
        [BalanceSheetCode] ASC,
        [FiscalYear] ASC,
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[BalanceSheetDimensionReportingTag] ADD CONSTRAINT [BalanceSheetDimensionReportingTag_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[ChartOfAccount] --
CREATE TABLE [extension].[ChartOfAccount] (
    [AccountIdentifier] [NVARCHAR](50) NOT NULL,
    [EducationOrganizationId] [BIGINT] NOT NULL,
    [FiscalYear] [SMALLINT] NOT NULL,
    [AccountName] [NVARCHAR](100) NULL,
    [AccountTypeDescriptorId] [INT] NOT NULL,
    [BalanceSheetCode] [NVARCHAR](16) NULL,
    [FunctionCode] [NVARCHAR](16) NULL,
    [FundCode] [NVARCHAR](16) NULL,
    [ObjectCode] [NVARCHAR](16) NULL,
    [OperationalUnitCode] [NVARCHAR](16) NULL,
    [ProgramCode] [NVARCHAR](16) NULL,
    [ProjectCode] [NVARCHAR](16) NULL,
    [SourceCode] [NVARCHAR](16) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [ChartOfAccount_PK] PRIMARY KEY CLUSTERED (
        [AccountIdentifier] ASC,
        [EducationOrganizationId] ASC,
        [FiscalYear] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[ChartOfAccount] ADD CONSTRAINT [ChartOfAccount_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[ChartOfAccount] ADD CONSTRAINT [ChartOfAccount_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[ChartOfAccount] ADD CONSTRAINT [ChartOfAccount_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[ChartOfAccountReportingTag] --
CREATE TABLE [extension].[ChartOfAccountReportingTag] (
    [AccountIdentifier] [NVARCHAR](50) NOT NULL,
    [EducationOrganizationId] [BIGINT] NOT NULL,
    [FiscalYear] [SMALLINT] NOT NULL,
    [ReportingTagDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [ChartOfAccountReportingTag_PK] PRIMARY KEY CLUSTERED (
        [AccountIdentifier] ASC,
        [EducationOrganizationId] ASC,
        [FiscalYear] ASC,
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[ChartOfAccountReportingTag] ADD CONSTRAINT [ChartOfAccountReportingTag_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[FinancialCollectionDescriptor] --
CREATE TABLE [extension].[FinancialCollectionDescriptor] (
    [FinancialCollectionDescriptorId] [INT] NOT NULL,
    CONSTRAINT [FinancialCollectionDescriptor_PK] PRIMARY KEY CLUSTERED (
        [FinancialCollectionDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Table [extension].[FunctionDimension] --
CREATE TABLE [extension].[FunctionDimension] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [FunctionCode] [NVARCHAR](16) NOT NULL,
    [CodeName] [NVARCHAR](100) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [FunctionDimension_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [FunctionCode] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[FunctionDimension] ADD CONSTRAINT [FunctionDimension_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[FunctionDimension] ADD CONSTRAINT [FunctionDimension_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[FunctionDimension] ADD CONSTRAINT [FunctionDimension_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[FunctionDimensionReportingTag] --
CREATE TABLE [extension].[FunctionDimensionReportingTag] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [FunctionCode] [NVARCHAR](16) NOT NULL,
    [ReportingTagDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [FunctionDimensionReportingTag_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [FunctionCode] ASC,
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[FunctionDimensionReportingTag] ADD CONSTRAINT [FunctionDimensionReportingTag_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[FundDimension] --
CREATE TABLE [extension].[FundDimension] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [FundCode] [NVARCHAR](16) NOT NULL,
    [CodeName] [NVARCHAR](100) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [FundDimension_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [FundCode] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[FundDimension] ADD CONSTRAINT [FundDimension_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[FundDimension] ADD CONSTRAINT [FundDimension_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[FundDimension] ADD CONSTRAINT [FundDimension_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[FundDimensionReportingTag] --
CREATE TABLE [extension].[FundDimensionReportingTag] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [FundCode] [NVARCHAR](16) NOT NULL,
    [ReportingTagDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [FundDimensionReportingTag_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [FundCode] ASC,
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[FundDimensionReportingTag] ADD CONSTRAINT [FundDimensionReportingTag_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[LocalAccount] --
CREATE TABLE [extension].[LocalAccount] (
    [AccountIdentifier] [NVARCHAR](50) NOT NULL,
    [EducationOrganizationId] [BIGINT] NOT NULL,
    [FiscalYear] [SMALLINT] NOT NULL,
    [AccountName] [NVARCHAR](100) NULL,
    [ChartOfAccountIdentifier] [NVARCHAR](50) NOT NULL,
    [ChartOfAccountEducationOrganizationId] [BIGINT] NOT NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [LocalAccount_PK] PRIMARY KEY CLUSTERED (
        [AccountIdentifier] ASC,
        [EducationOrganizationId] ASC,
        [FiscalYear] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[LocalAccount] ADD CONSTRAINT [LocalAccount_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[LocalAccount] ADD CONSTRAINT [LocalAccount_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[LocalAccount] ADD CONSTRAINT [LocalAccount_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[LocalAccountReportingTag] --
CREATE TABLE [extension].[LocalAccountReportingTag] (
    [AccountIdentifier] [NVARCHAR](50) NOT NULL,
    [EducationOrganizationId] [BIGINT] NOT NULL,
    [FiscalYear] [SMALLINT] NOT NULL,
    [ReportingTagDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [LocalAccountReportingTag_PK] PRIMARY KEY CLUSTERED (
        [AccountIdentifier] ASC,
        [EducationOrganizationId] ASC,
        [FiscalYear] ASC,
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[LocalAccountReportingTag] ADD CONSTRAINT [LocalAccountReportingTag_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[LocalActual] --
CREATE TABLE [extension].[LocalActual] (
    [AccountIdentifier] [NVARCHAR](50) NOT NULL,
    [AsOfDate] [DATE] NOT NULL,
    [EducationOrganizationId] [BIGINT] NOT NULL,
    [FiscalYear] [SMALLINT] NOT NULL,
    [Amount] [MONEY] NOT NULL,
    [FinancialCollectionDescriptorId] [INT] NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [LocalActual_PK] PRIMARY KEY CLUSTERED (
        [AccountIdentifier] ASC,
        [AsOfDate] ASC,
        [EducationOrganizationId] ASC,
        [FiscalYear] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[LocalActual] ADD CONSTRAINT [LocalActual_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[LocalActual] ADD CONSTRAINT [LocalActual_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[LocalActual] ADD CONSTRAINT [LocalActual_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[LocalBudget] --
CREATE TABLE [extension].[LocalBudget] (
    [AccountIdentifier] [NVARCHAR](50) NOT NULL,
    [AsOfDate] [DATE] NOT NULL,
    [EducationOrganizationId] [BIGINT] NOT NULL,
    [FiscalYear] [SMALLINT] NOT NULL,
    [Amount] [MONEY] NOT NULL,
    [FinancialCollectionDescriptorId] [INT] NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [LocalBudget_PK] PRIMARY KEY CLUSTERED (
        [AccountIdentifier] ASC,
        [AsOfDate] ASC,
        [EducationOrganizationId] ASC,
        [FiscalYear] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[LocalBudget] ADD CONSTRAINT [LocalBudget_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[LocalBudget] ADD CONSTRAINT [LocalBudget_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[LocalBudget] ADD CONSTRAINT [LocalBudget_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[ObjectDimension] --
CREATE TABLE [extension].[ObjectDimension] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [ObjectCode] [NVARCHAR](16) NOT NULL,
    [CodeName] [NVARCHAR](100) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [ObjectDimension_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [ObjectCode] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[ObjectDimension] ADD CONSTRAINT [ObjectDimension_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[ObjectDimension] ADD CONSTRAINT [ObjectDimension_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[ObjectDimension] ADD CONSTRAINT [ObjectDimension_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[ObjectDimensionReportingTag] --
CREATE TABLE [extension].[ObjectDimensionReportingTag] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [ObjectCode] [NVARCHAR](16) NOT NULL,
    [ReportingTagDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [ObjectDimensionReportingTag_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [ObjectCode] ASC,
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[ObjectDimensionReportingTag] ADD CONSTRAINT [ObjectDimensionReportingTag_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[OperationalUnitDimension] --
CREATE TABLE [extension].[OperationalUnitDimension] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [OperationalUnitCode] [NVARCHAR](16) NOT NULL,
    [CodeName] [NVARCHAR](100) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [OperationalUnitDimension_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [OperationalUnitCode] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[OperationalUnitDimension] ADD CONSTRAINT [OperationalUnitDimension_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[OperationalUnitDimension] ADD CONSTRAINT [OperationalUnitDimension_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[OperationalUnitDimension] ADD CONSTRAINT [OperationalUnitDimension_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[OperationalUnitDimensionReportingTag] --
CREATE TABLE [extension].[OperationalUnitDimensionReportingTag] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [OperationalUnitCode] [NVARCHAR](16) NOT NULL,
    [ReportingTagDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [OperationalUnitDimensionReportingTag_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [OperationalUnitCode] ASC,
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[OperationalUnitDimensionReportingTag] ADD CONSTRAINT [OperationalUnitDimensionReportingTag_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[ProgramDimension] --
CREATE TABLE [extension].[ProgramDimension] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [ProgramCode] [NVARCHAR](16) NOT NULL,
    [CodeName] [NVARCHAR](100) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [ProgramDimension_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [ProgramCode] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[ProgramDimension] ADD CONSTRAINT [ProgramDimension_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[ProgramDimension] ADD CONSTRAINT [ProgramDimension_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[ProgramDimension] ADD CONSTRAINT [ProgramDimension_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[ProgramDimensionReportingTag] --
CREATE TABLE [extension].[ProgramDimensionReportingTag] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [ProgramCode] [NVARCHAR](16) NOT NULL,
    [ReportingTagDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [ProgramDimensionReportingTag_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [ProgramCode] ASC,
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[ProgramDimensionReportingTag] ADD CONSTRAINT [ProgramDimensionReportingTag_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[ProjectDimension] --
CREATE TABLE [extension].[ProjectDimension] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [ProjectCode] [NVARCHAR](16) NOT NULL,
    [CodeName] [NVARCHAR](100) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [ProjectDimension_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [ProjectCode] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[ProjectDimension] ADD CONSTRAINT [ProjectDimension_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[ProjectDimension] ADD CONSTRAINT [ProjectDimension_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[ProjectDimension] ADD CONSTRAINT [ProjectDimension_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[ProjectDimensionReportingTag] --
CREATE TABLE [extension].[ProjectDimensionReportingTag] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [ProjectCode] [NVARCHAR](16) NOT NULL,
    [ReportingTagDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [ProjectDimensionReportingTag_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [ProjectCode] ASC,
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[ProjectDimensionReportingTag] ADD CONSTRAINT [ProjectDimensionReportingTag_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[ReportingTagDescriptor] --
CREATE TABLE [extension].[ReportingTagDescriptor] (
    [ReportingTagDescriptorId] [INT] NOT NULL,
    CONSTRAINT [ReportingTagDescriptor_PK] PRIMARY KEY CLUSTERED (
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Table [extension].[SourceDimension] --
CREATE TABLE [extension].[SourceDimension] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [SourceCode] [NVARCHAR](16) NOT NULL,
    [CodeName] [NVARCHAR](100) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [SourceDimension_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [SourceCode] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[SourceDimension] ADD CONSTRAINT [SourceDimension_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[SourceDimension] ADD CONSTRAINT [SourceDimension_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[SourceDimension] ADD CONSTRAINT [SourceDimension_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[SourceDimensionReportingTag] --
CREATE TABLE [extension].[SourceDimensionReportingTag] (
    [FiscalYear] [SMALLINT] NOT NULL,
    [SourceCode] [NVARCHAR](16) NOT NULL,
    [ReportingTagDescriptorId] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [SourceDimensionReportingTag_PK] PRIMARY KEY CLUSTERED (
        [FiscalYear] ASC,
        [SourceCode] ASC,
        [ReportingTagDescriptorId] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[SourceDimensionReportingTag] ADD CONSTRAINT [SourceDimensionReportingTag_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO


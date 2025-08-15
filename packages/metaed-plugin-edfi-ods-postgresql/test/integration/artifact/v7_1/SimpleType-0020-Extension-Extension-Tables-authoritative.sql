-- Table extension.AccountTypeDescriptor --
CREATE TABLE extension.AccountTypeDescriptor (
    AccountTypeDescriptorId INT NOT NULL,
    CONSTRAINT AccountTypeDescriptor_PK PRIMARY KEY (AccountTypeDescriptorId)
);

-- Table extension.BalanceSheetDimension --
CREATE TABLE extension.BalanceSheetDimension (
    BalanceSheetCode VARCHAR(16) NOT NULL,
    FiscalYear SMALLINT NOT NULL,
    CodeName VARCHAR(100) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT BalanceSheetDimension_PK PRIMARY KEY (BalanceSheetCode, FiscalYear)
);
ALTER TABLE extension.BalanceSheetDimension ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.BalanceSheetDimension ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.BalanceSheetDimension ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.BalanceSheetDimensionReportingTag --
CREATE TABLE extension.BalanceSheetDimensionReportingTag (
    BalanceSheetCode VARCHAR(16) NOT NULL,
    FiscalYear SMALLINT NOT NULL,
    ReportingTagDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT BalanceSheetDimensionReportingTag_PK PRIMARY KEY (BalanceSheetCode, FiscalYear, ReportingTagDescriptorId)
);
ALTER TABLE extension.BalanceSheetDimensionReportingTag ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.ChartOfAccount --
CREATE TABLE extension.ChartOfAccount (
    AccountIdentifier VARCHAR(50) NOT NULL,
    EducationOrganizationId BIGINT NOT NULL,
    FiscalYear SMALLINT NOT NULL,
    AccountName VARCHAR(100) NULL,
    AccountTypeDescriptorId INT NOT NULL,
    BalanceSheetCode VARCHAR(16) NULL,
    FunctionCode VARCHAR(16) NULL,
    FundCode VARCHAR(16) NULL,
    ObjectCode VARCHAR(16) NULL,
    OperationalUnitCode VARCHAR(16) NULL,
    ProgramCode VARCHAR(16) NULL,
    ProjectCode VARCHAR(16) NULL,
    SourceCode VARCHAR(16) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT ChartOfAccount_PK PRIMARY KEY (AccountIdentifier, EducationOrganizationId, FiscalYear)
);
ALTER TABLE extension.ChartOfAccount ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.ChartOfAccount ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.ChartOfAccount ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.ChartOfAccountReportingTag --
CREATE TABLE extension.ChartOfAccountReportingTag (
    AccountIdentifier VARCHAR(50) NOT NULL,
    EducationOrganizationId BIGINT NOT NULL,
    FiscalYear SMALLINT NOT NULL,
    ReportingTagDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT ChartOfAccountReportingTag_PK PRIMARY KEY (AccountIdentifier, EducationOrganizationId, FiscalYear, ReportingTagDescriptorId)
);
ALTER TABLE extension.ChartOfAccountReportingTag ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.FinancialCollectionDescriptor --
CREATE TABLE extension.FinancialCollectionDescriptor (
    FinancialCollectionDescriptorId INT NOT NULL,
    CONSTRAINT FinancialCollectionDescriptor_PK PRIMARY KEY (FinancialCollectionDescriptorId)
);

-- Table extension.FunctionDimension --
CREATE TABLE extension.FunctionDimension (
    FiscalYear SMALLINT NOT NULL,
    FunctionCode VARCHAR(16) NOT NULL,
    CodeName VARCHAR(100) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT FunctionDimension_PK PRIMARY KEY (FiscalYear, FunctionCode)
);
ALTER TABLE extension.FunctionDimension ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.FunctionDimension ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.FunctionDimension ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.FunctionDimensionReportingTag --
CREATE TABLE extension.FunctionDimensionReportingTag (
    FiscalYear SMALLINT NOT NULL,
    FunctionCode VARCHAR(16) NOT NULL,
    ReportingTagDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT FunctionDimensionReportingTag_PK PRIMARY KEY (FiscalYear, FunctionCode, ReportingTagDescriptorId)
);
ALTER TABLE extension.FunctionDimensionReportingTag ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.FundDimension --
CREATE TABLE extension.FundDimension (
    FiscalYear SMALLINT NOT NULL,
    FundCode VARCHAR(16) NOT NULL,
    CodeName VARCHAR(100) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT FundDimension_PK PRIMARY KEY (FiscalYear, FundCode)
);
ALTER TABLE extension.FundDimension ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.FundDimension ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.FundDimension ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.FundDimensionReportingTag --
CREATE TABLE extension.FundDimensionReportingTag (
    FiscalYear SMALLINT NOT NULL,
    FundCode VARCHAR(16) NOT NULL,
    ReportingTagDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT FundDimensionReportingTag_PK PRIMARY KEY (FiscalYear, FundCode, ReportingTagDescriptorId)
);
ALTER TABLE extension.FundDimensionReportingTag ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.LocalAccount --
CREATE TABLE extension.LocalAccount (
    AccountIdentifier VARCHAR(50) NOT NULL,
    EducationOrganizationId BIGINT NOT NULL,
    FiscalYear SMALLINT NOT NULL,
    AccountName VARCHAR(100) NULL,
    ChartOfAccountIdentifier VARCHAR(50) NOT NULL,
    ChartOfAccountEducationOrganizationId BIGINT NOT NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT LocalAccount_PK PRIMARY KEY (AccountIdentifier, EducationOrganizationId, FiscalYear)
);
ALTER TABLE extension.LocalAccount ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.LocalAccount ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.LocalAccount ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.LocalAccountReportingTag --
CREATE TABLE extension.LocalAccountReportingTag (
    AccountIdentifier VARCHAR(50) NOT NULL,
    EducationOrganizationId BIGINT NOT NULL,
    FiscalYear SMALLINT NOT NULL,
    ReportingTagDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT LocalAccountReportingTag_PK PRIMARY KEY (AccountIdentifier, EducationOrganizationId, FiscalYear, ReportingTagDescriptorId)
);
ALTER TABLE extension.LocalAccountReportingTag ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.LocalActual --
CREATE TABLE extension.LocalActual (
    AccountIdentifier VARCHAR(50) NOT NULL,
    AsOfDate DATE NOT NULL,
    EducationOrganizationId BIGINT NOT NULL,
    FiscalYear SMALLINT NOT NULL,
    Amount MONEY NOT NULL,
    FinancialCollectionDescriptorId INT NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT LocalActual_PK PRIMARY KEY (AccountIdentifier, AsOfDate, EducationOrganizationId, FiscalYear)
);
ALTER TABLE extension.LocalActual ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.LocalActual ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.LocalActual ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.LocalBudget --
CREATE TABLE extension.LocalBudget (
    AccountIdentifier VARCHAR(50) NOT NULL,
    AsOfDate DATE NOT NULL,
    EducationOrganizationId BIGINT NOT NULL,
    FiscalYear SMALLINT NOT NULL,
    Amount MONEY NOT NULL,
    FinancialCollectionDescriptorId INT NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT LocalBudget_PK PRIMARY KEY (AccountIdentifier, AsOfDate, EducationOrganizationId, FiscalYear)
);
ALTER TABLE extension.LocalBudget ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.LocalBudget ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.LocalBudget ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.ObjectDimension --
CREATE TABLE extension.ObjectDimension (
    FiscalYear SMALLINT NOT NULL,
    ObjectCode VARCHAR(16) NOT NULL,
    CodeName VARCHAR(100) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT ObjectDimension_PK PRIMARY KEY (FiscalYear, ObjectCode)
);
ALTER TABLE extension.ObjectDimension ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.ObjectDimension ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.ObjectDimension ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.ObjectDimensionReportingTag --
CREATE TABLE extension.ObjectDimensionReportingTag (
    FiscalYear SMALLINT NOT NULL,
    ObjectCode VARCHAR(16) NOT NULL,
    ReportingTagDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT ObjectDimensionReportingTag_PK PRIMARY KEY (FiscalYear, ObjectCode, ReportingTagDescriptorId)
);
ALTER TABLE extension.ObjectDimensionReportingTag ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.OperationalUnitDimension --
CREATE TABLE extension.OperationalUnitDimension (
    FiscalYear SMALLINT NOT NULL,
    OperationalUnitCode VARCHAR(16) NOT NULL,
    CodeName VARCHAR(100) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT OperationalUnitDimension_PK PRIMARY KEY (FiscalYear, OperationalUnitCode)
);
ALTER TABLE extension.OperationalUnitDimension ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.OperationalUnitDimension ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.OperationalUnitDimension ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.OperationalUnitDimensionReportingTag --
CREATE TABLE extension.OperationalUnitDimensionReportingTag (
    FiscalYear SMALLINT NOT NULL,
    OperationalUnitCode VARCHAR(16) NOT NULL,
    ReportingTagDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT OperationalUnitDimensionReportingTag_PK PRIMARY KEY (FiscalYear, OperationalUnitCode, ReportingTagDescriptorId)
);
ALTER TABLE extension.OperationalUnitDimensionReportingTag ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.ProgramDimension --
CREATE TABLE extension.ProgramDimension (
    FiscalYear SMALLINT NOT NULL,
    ProgramCode VARCHAR(16) NOT NULL,
    CodeName VARCHAR(100) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT ProgramDimension_PK PRIMARY KEY (FiscalYear, ProgramCode)
);
ALTER TABLE extension.ProgramDimension ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.ProgramDimension ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.ProgramDimension ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.ProgramDimensionReportingTag --
CREATE TABLE extension.ProgramDimensionReportingTag (
    FiscalYear SMALLINT NOT NULL,
    ProgramCode VARCHAR(16) NOT NULL,
    ReportingTagDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT ProgramDimensionReportingTag_PK PRIMARY KEY (FiscalYear, ProgramCode, ReportingTagDescriptorId)
);
ALTER TABLE extension.ProgramDimensionReportingTag ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.ProjectDimension --
CREATE TABLE extension.ProjectDimension (
    FiscalYear SMALLINT NOT NULL,
    ProjectCode VARCHAR(16) NOT NULL,
    CodeName VARCHAR(100) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT ProjectDimension_PK PRIMARY KEY (FiscalYear, ProjectCode)
);
ALTER TABLE extension.ProjectDimension ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.ProjectDimension ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.ProjectDimension ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.ProjectDimensionReportingTag --
CREATE TABLE extension.ProjectDimensionReportingTag (
    FiscalYear SMALLINT NOT NULL,
    ProjectCode VARCHAR(16) NOT NULL,
    ReportingTagDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT ProjectDimensionReportingTag_PK PRIMARY KEY (FiscalYear, ProjectCode, ReportingTagDescriptorId)
);
ALTER TABLE extension.ProjectDimensionReportingTag ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.ReportingTagDescriptor --
CREATE TABLE extension.ReportingTagDescriptor (
    ReportingTagDescriptorId INT NOT NULL,
    CONSTRAINT ReportingTagDescriptor_PK PRIMARY KEY (ReportingTagDescriptorId)
);

-- Table extension.SourceDimension --
CREATE TABLE extension.SourceDimension (
    FiscalYear SMALLINT NOT NULL,
    SourceCode VARCHAR(16) NOT NULL,
    CodeName VARCHAR(100) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT SourceDimension_PK PRIMARY KEY (FiscalYear, SourceCode)
);
ALTER TABLE extension.SourceDimension ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.SourceDimension ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.SourceDimension ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.SourceDimensionReportingTag --
CREATE TABLE extension.SourceDimensionReportingTag (
    FiscalYear SMALLINT NOT NULL,
    SourceCode VARCHAR(16) NOT NULL,
    ReportingTagDescriptorId INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT SourceDimensionReportingTag_PK PRIMARY KEY (FiscalYear, SourceCode, ReportingTagDescriptorId)
);
ALTER TABLE extension.SourceDimensionReportingTag ALTER COLUMN CreateDate SET DEFAULT current_timestamp;


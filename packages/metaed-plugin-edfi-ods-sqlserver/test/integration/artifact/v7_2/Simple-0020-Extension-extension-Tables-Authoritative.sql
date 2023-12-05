-- Table [extension].[StaffEvaluation] --
CREATE TABLE [extension].[StaffEvaluation] (
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [MaxRating] [NVARCHAR](20) NOT NULL,
    [MinRating] [DECIMAL](6, 3) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [StaffEvaluation_PK] PRIMARY KEY CLUSTERED (
        [SchoolYear] ASC,
        [StaffEvaluationTitle] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluation] ADD CONSTRAINT [StaffEvaluation_DF_CreateDate] DEFAULT (getutcdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[StaffEvaluation] ADD CONSTRAINT [StaffEvaluation_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[StaffEvaluation] ADD CONSTRAINT [StaffEvaluation_DF_LastModifiedDate] DEFAULT (getutcdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[StaffEvaluationComponent] --
CREATE TABLE [extension].[StaffEvaluationComponent] (
    [EvaluationComponent] [NVARCHAR](50) NOT NULL,
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [MaxRating] [DECIMAL](6, 3) NOT NULL,
    [MinRating] [DECIMAL](6, 3) NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [StaffEvaluationComponent_PK] PRIMARY KEY CLUSTERED (
        [EvaluationComponent] ASC,
        [SchoolYear] ASC,
        [StaffEvaluationTitle] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluationComponent] ADD CONSTRAINT [StaffEvaluationComponent_DF_CreateDate] DEFAULT (getutcdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[StaffEvaluationComponent] ADD CONSTRAINT [StaffEvaluationComponent_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[StaffEvaluationComponent] ADD CONSTRAINT [StaffEvaluationComponent_DF_LastModifiedDate] DEFAULT (getutcdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[StaffEvaluationComponentStaffRatingLevel] --
CREATE TABLE [extension].[StaffEvaluationComponentStaffRatingLevel] (
    [EvaluationComponent] [NVARCHAR](50) NOT NULL,
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [MaxLevel] [DECIMAL](6, 3) NOT NULL,
    [MinLevel] [DECIMAL](6, 3) NULL,
    [StaffEvaluationLevel] [NVARCHAR](50) NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [StaffEvaluationComponentStaffRatingLevel_PK] PRIMARY KEY CLUSTERED (
        [EvaluationComponent] ASC,
        [SchoolYear] ASC,
        [StaffEvaluationTitle] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluationComponentStaffRatingLevel] ADD CONSTRAINT [StaffEvaluationComponentStaffRatingLevel_DF_CreateDate] DEFAULT (getutcdate()) FOR [CreateDate]
GO

-- Table [extension].[StaffEvaluationRating] --
CREATE TABLE [extension].[StaffEvaluationRating] (
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationDate] [DATE] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [StaffUSI] [INT] NOT NULL,
    [Rating] [DECIMAL](6, 3) NOT NULL,
    [Discriminator] [NVARCHAR](128) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    [LastModifiedDate] [DATETIME2] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [StaffEvaluationRating_PK] PRIMARY KEY CLUSTERED (
        [SchoolYear] ASC,
        [StaffEvaluationDate] ASC,
        [StaffEvaluationTitle] ASC,
        [StaffUSI] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluationRating] ADD CONSTRAINT [StaffEvaluationRating_DF_CreateDate] DEFAULT (getutcdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[StaffEvaluationRating] ADD CONSTRAINT [StaffEvaluationRating_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[StaffEvaluationRating] ADD CONSTRAINT [StaffEvaluationRating_DF_LastModifiedDate] DEFAULT (getutcdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[StaffEvaluationSampleCommonSubclass] --
CREATE TABLE [extension].[StaffEvaluationSampleCommonSubclass] (
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [StatusOne] [BIT] NOT NULL,
    [StatusTwo] [BIT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [StaffEvaluationSampleCommonSubclass_PK] PRIMARY KEY CLUSTERED (
        [SchoolYear] ASC,
        [StaffEvaluationTitle] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluationSampleCommonSubclass] ADD CONSTRAINT [StaffEvaluationSampleCommonSubclass_DF_CreateDate] DEFAULT (getutcdate()) FOR [CreateDate]
GO

-- Table [extension].[StaffEvaluationStaffRatingLevel] --
CREATE TABLE [extension].[StaffEvaluationStaffRatingLevel] (
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [StaffEvaluationLevel] [NVARCHAR](50) NOT NULL,
    [MaxLevel] [DECIMAL](6, 3) NOT NULL,
    [MinLevel] [DECIMAL](6, 3) NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [StaffEvaluationStaffRatingLevel_PK] PRIMARY KEY CLUSTERED (
        [SchoolYear] ASC,
        [StaffEvaluationTitle] ASC,
        [StaffEvaluationLevel] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluationStaffRatingLevel] ADD CONSTRAINT [StaffEvaluationStaffRatingLevel_DF_CreateDate] DEFAULT (getutcdate()) FOR [CreateDate]
GO

-- Table [extension].[StaffMyCollection] --
CREATE TABLE [extension].[StaffMyCollection] (
    [StaffUSI] [INT] NOT NULL,
    [MyCollection] [INT] NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [StaffMyCollection_PK] PRIMARY KEY CLUSTERED (
        [StaffUSI] ASC,
        [MyCollection] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffMyCollection] ADD CONSTRAINT [StaffMyCollection_DF_CreateDate] DEFAULT (getutcdate()) FOR [CreateDate]
GO

-- Table [extension].[StaffRatingLevel] --
CREATE TABLE [extension].[StaffRatingLevel] (
    [StaffUSI] [INT] NOT NULL,
    [MaxLevel] [DECIMAL](6, 3) NOT NULL,
    [MinLevel] [DECIMAL](6, 3) NULL,
    [StaffEvaluationLevel] [NVARCHAR](50) NOT NULL,
    [CreateDate] [DATETIME2] NOT NULL,
    CONSTRAINT [StaffRatingLevel_PK] PRIMARY KEY CLUSTERED (
        [StaffUSI] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffRatingLevel] ADD CONSTRAINT [StaffRatingLevel_DF_CreateDate] DEFAULT (getutcdate()) FOR [CreateDate]
GO


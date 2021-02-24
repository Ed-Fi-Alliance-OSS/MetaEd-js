-- Table [extension].[StaffEvaluation] --
CREATE TABLE [extension].[StaffEvaluation] (
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [MaxRating] [NVARCHAR](20) NOT NULL,
    [MinRating] [DECIMAL](6, 3) NULL,
    [CreateDate] [DATETIME] NOT NULL,
    [LastModifiedDate] [DATETIME] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [StaffEvaluation_PK] PRIMARY KEY CLUSTERED (
        [SchoolYear] ASC,
        [StaffEvaluationTitle] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluation] ADD CONSTRAINT [StaffEvaluation_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[StaffEvaluation] ADD CONSTRAINT [StaffEvaluation_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[StaffEvaluation] ADD CONSTRAINT [StaffEvaluation_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[StaffEvaluationComponent] --
CREATE TABLE [extension].[StaffEvaluationComponent] (
    [EvaluationComponent] [NVARCHAR](50) NOT NULL,
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [MaxRating] [DECIMAL](6, 3) NOT NULL,
    [MinRating] [DECIMAL](6, 3) NULL,
    [CreateDate] [DATETIME] NOT NULL,
    [LastModifiedDate] [DATETIME] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [StaffEvaluationComponent_PK] PRIMARY KEY CLUSTERED (
        [EvaluationComponent] ASC,
        [SchoolYear] ASC,
        [StaffEvaluationTitle] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluationComponent] ADD CONSTRAINT [StaffEvaluationComponent_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[StaffEvaluationComponent] ADD CONSTRAINT [StaffEvaluationComponent_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[StaffEvaluationComponent] ADD CONSTRAINT [StaffEvaluationComponent_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[StaffEvaluationComponentStaffRatingLevel] --
CREATE TABLE [extension].[StaffEvaluationComponentStaffRatingLevel] (
    [EvaluationComponent] [NVARCHAR](50) NOT NULL,
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [StaffEvaluationLevel] [NVARCHAR](50) NOT NULL,
    [MaxLevel] [DECIMAL](6, 3) NOT NULL,
    [MinLevel] [DECIMAL](6, 3) NULL,
    [CreateDate] [DATETIME] NOT NULL,
    CONSTRAINT [StaffEvaluationComponentStaffRatingLevel_PK] PRIMARY KEY CLUSTERED (
        [EvaluationComponent] ASC,
        [SchoolYear] ASC,
        [StaffEvaluationTitle] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluationComponentStaffRatingLevel] ADD CONSTRAINT [StaffEvaluationComponentStaffRatingLevel_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[StaffEvaluationRating] --
CREATE TABLE [extension].[StaffEvaluationRating] (
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationDate] [DATE] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [StaffUSI] [INT] NOT NULL,
    [Rating] [DECIMAL](6, 3) NOT NULL,
    [CreateDate] [DATETIME] NOT NULL,
    [LastModifiedDate] [DATETIME] NOT NULL,
    [Id] [UNIQUEIDENTIFIER] NOT NULL,
    CONSTRAINT [StaffEvaluationRating_PK] PRIMARY KEY CLUSTERED (
        [SchoolYear] ASC,
        [StaffEvaluationDate] ASC,
        [StaffEvaluationTitle] ASC,
        [StaffUSI] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluationRating] ADD CONSTRAINT [StaffEvaluationRating_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [extension].[StaffEvaluationRating] ADD CONSTRAINT [StaffEvaluationRating_DF_Id] DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [extension].[StaffEvaluationRating] ADD CONSTRAINT [StaffEvaluationRating_DF_LastModifiedDate] DEFAULT (getdate()) FOR [LastModifiedDate]
GO

-- Table [extension].[StaffEvaluationSampleCommonSubclass] --
CREATE TABLE [extension].[StaffEvaluationSampleCommonSubclass] (
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [StatusTwo] [BIT] NOT NULL,
    [StatusOne] [BIT] NOT NULL,
    [CreateDate] [DATETIME] NOT NULL,
    CONSTRAINT [StaffEvaluationSampleCommonSubclass_PK] PRIMARY KEY CLUSTERED (
        [SchoolYear] ASC,
        [StaffEvaluationTitle] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluationSampleCommonSubclass] ADD CONSTRAINT [StaffEvaluationSampleCommonSubclass_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[StaffEvaluationStaffRatingLevel] --
CREATE TABLE [extension].[StaffEvaluationStaffRatingLevel] (
    [SchoolYear] [SMALLINT] NOT NULL,
    [StaffEvaluationLevel] [NVARCHAR](50) NOT NULL,
    [StaffEvaluationTitle] [NVARCHAR](50) NOT NULL,
    [MaxLevel] [DECIMAL](6, 3) NOT NULL,
    [MinLevel] [DECIMAL](6, 3) NULL,
    [CreateDate] [DATETIME] NOT NULL,
    CONSTRAINT [StaffEvaluationStaffRatingLevel_PK] PRIMARY KEY CLUSTERED (
        [SchoolYear] ASC,
        [StaffEvaluationLevel] ASC,
        [StaffEvaluationTitle] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffEvaluationStaffRatingLevel] ADD CONSTRAINT [StaffEvaluationStaffRatingLevel_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[StaffExtension] --
CREATE TABLE [extension].[StaffExtension] (
    [StaffUSI] [INT] NOT NULL,
    CONSTRAINT [StaffExtension_PK] PRIMARY KEY CLUSTERED (
        [StaffUSI] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Table [extension].[StaffMyCollection] --
CREATE TABLE [extension].[StaffMyCollection] (
    [MyCollection] [INT] NOT NULL,
    [StaffUSI] [INT] NOT NULL,
    [CreateDate] [DATETIME] NOT NULL,
    CONSTRAINT [StaffMyCollection_PK] PRIMARY KEY CLUSTERED (
        [MyCollection] ASC,
        [StaffUSI] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffMyCollection] ADD CONSTRAINT [StaffMyCollection_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

-- Table [extension].[StaffRatingLevel] --
CREATE TABLE [extension].[StaffRatingLevel] (
    [StaffUSI] [INT] NOT NULL,
    [StaffEvaluationLevel] [NVARCHAR](50) NOT NULL,
    [MaxLevel] [DECIMAL](6, 3) NOT NULL,
    [MinLevel] [DECIMAL](6, 3) NULL,
    [CreateDate] [DATETIME] NOT NULL,
    CONSTRAINT [StaffRatingLevel_PK] PRIMARY KEY CLUSTERED (
        [StaffUSI] ASC
    ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [extension].[StaffRatingLevel] ADD CONSTRAINT [StaffRatingLevel_DF_CreateDate] DEFAULT (getdate()) FOR [CreateDate]
GO

ALTER TABLE [extension].[StaffEvaluation] WITH CHECK ADD CONSTRAINT [FK_StaffEvaluation_SchoolYearType] FOREIGN KEY ([SchoolYear])
REFERENCES [edfi].[SchoolYearType] ([SchoolYear])
GO

CREATE NONCLUSTERED INDEX [FK_StaffEvaluation_SchoolYearType]
ON [extension].[StaffEvaluation] ([SchoolYear] ASC)
GO

ALTER TABLE [extension].[StaffEvaluationComponent] WITH CHECK ADD CONSTRAINT [FK_StaffEvaluationComponent_StaffEvaluation] FOREIGN KEY ([SchoolYear], [StaffEvaluationTitle])
REFERENCES [extension].[StaffEvaluation] ([SchoolYear], [StaffEvaluationTitle])
GO

CREATE NONCLUSTERED INDEX [FK_StaffEvaluationComponent_StaffEvaluation]
ON [extension].[StaffEvaluationComponent] ([SchoolYear] ASC, [StaffEvaluationTitle] ASC)
GO

ALTER TABLE [extension].[StaffEvaluationComponentStaffRatingLevel] WITH CHECK ADD CONSTRAINT [FK_StaffEvaluationComponentStaffRatingLevel_StaffEvaluationComponent] FOREIGN KEY ([EvaluationComponent], [SchoolYear], [StaffEvaluationTitle])
REFERENCES [extension].[StaffEvaluationComponent] ([EvaluationComponent], [SchoolYear], [StaffEvaluationTitle])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[StaffEvaluationRating] WITH CHECK ADD CONSTRAINT [FK_StaffEvaluationRating_Staff] FOREIGN KEY ([StaffUSI])
REFERENCES [edfi].[Staff] ([StaffUSI])
GO

CREATE NONCLUSTERED INDEX [FK_StaffEvaluationRating_Staff]
ON [extension].[StaffEvaluationRating] ([StaffUSI] ASC)
GO

ALTER TABLE [extension].[StaffEvaluationRating] WITH CHECK ADD CONSTRAINT [FK_StaffEvaluationRating_StaffEvaluation] FOREIGN KEY ([SchoolYear], [StaffEvaluationTitle])
REFERENCES [extension].[StaffEvaluation] ([SchoolYear], [StaffEvaluationTitle])
GO

CREATE NONCLUSTERED INDEX [FK_StaffEvaluationRating_StaffEvaluation]
ON [extension].[StaffEvaluationRating] ([SchoolYear] ASC, [StaffEvaluationTitle] ASC)
GO

ALTER TABLE [extension].[StaffEvaluationSampleCommonSubclass] WITH CHECK ADD CONSTRAINT [FK_StaffEvaluationSampleCommonSubclass_StaffEvaluation] FOREIGN KEY ([SchoolYear], [StaffEvaluationTitle])
REFERENCES [extension].[StaffEvaluation] ([SchoolYear], [StaffEvaluationTitle])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[StaffEvaluationStaffRatingLevel] WITH CHECK ADD CONSTRAINT [FK_StaffEvaluationStaffRatingLevel_StaffEvaluation] FOREIGN KEY ([SchoolYear], [StaffEvaluationTitle])
REFERENCES [extension].[StaffEvaluation] ([SchoolYear], [StaffEvaluationTitle])
ON DELETE CASCADE
GO

CREATE NONCLUSTERED INDEX [FK_StaffEvaluationStaffRatingLevel_StaffEvaluation]
ON [extension].[StaffEvaluationStaffRatingLevel] ([SchoolYear] ASC, [StaffEvaluationTitle] ASC)
GO

ALTER TABLE [extension].[StaffExtension] WITH CHECK ADD CONSTRAINT [FK_StaffExtension_Staff] FOREIGN KEY ([StaffUSI])
REFERENCES [edfi].[Staff] ([StaffUSI])
ON DELETE CASCADE
GO

ALTER TABLE [extension].[StaffMyCollection] WITH CHECK ADD CONSTRAINT [FK_StaffMyCollection_Staff] FOREIGN KEY ([StaffUSI])
REFERENCES [edfi].[Staff] ([StaffUSI])
ON DELETE CASCADE
GO

CREATE NONCLUSTERED INDEX [FK_StaffMyCollection_Staff]
ON [extension].[StaffMyCollection] ([StaffUSI] ASC)
GO

ALTER TABLE [extension].[StaffRatingLevel] WITH CHECK ADD CONSTRAINT [FK_StaffRatingLevel_Staff] FOREIGN KEY ([StaffUSI])
REFERENCES [edfi].[Staff] ([StaffUSI])
ON DELETE CASCADE
GO

-- Extended Properties [extension].[StaffEvaluation] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'TBD', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluation'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The school year the Staff evaluation is applied.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluation', @level2type=N'COLUMN', @level2name=N'SchoolYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The name or title of the staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluation', @level2type=N'COLUMN', @level2name=N'StaffEvaluationTitle'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The maximum summary numerical rating or score for the staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluation', @level2type=N'COLUMN', @level2name=N'MaxRating'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The minimum summary numerical rating or score for the staff evaluation. If omitted, assumed to be 0.0.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluation', @level2type=N'COLUMN', @level2name=N'MinRating'
GO

-- Extended Properties [extension].[StaffEvaluationComponent] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The components of the evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponent'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Evaluation Component (e.g., Preparation, classroom control, delivery of instruction, etc.).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponent', @level2type=N'COLUMN', @level2name=N'EvaluationComponent'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The school year the Staff evaluation is applied.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponent', @level2type=N'COLUMN', @level2name=N'SchoolYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The name or title of the staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponent', @level2type=N'COLUMN', @level2name=N'StaffEvaluationTitle'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The max rating for the scale used for the Evaluation Component, if different from the overall staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponent', @level2type=N'COLUMN', @level2name=N'MaxRating'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The minimum rating for the scale used for the Evaluation Component, if different from the overall staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponent', @level2type=N'COLUMN', @level2name=N'MinRating'
GO

-- Extended Properties [extension].[StaffEvaluationComponentStaffRatingLevel] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The descriptive level(s) of ratings (cut scores) for staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponentStaffRatingLevel'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The Evaluation Component (e.g., Preparation, classroom control, delivery of instruction, etc.).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponentStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'EvaluationComponent'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The school year the Staff evaluation is applied.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponentStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'SchoolYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The name or title of the staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponentStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'StaffEvaluationTitle'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The title for a level of rating or evaluation band (e.g., Excellent, Acceptable, Needs Improvement, Unacceptable).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponentStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'StaffEvaluationLevel'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The maximum rating to achieve the level.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponentStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'MaxLevel'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The minimum rating to achieve the level.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationComponentStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'MinLevel'
GO

-- Extended Properties [extension].[StaffEvaluationRating] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The summary rating for a staff evaluation applied to an individual educator.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationRating'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The school year the Staff evaluation is applied.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationRating', @level2type=N'COLUMN', @level2name=N'SchoolYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date for the staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationRating', @level2type=N'COLUMN', @level2name=N'StaffEvaluationDate'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The name or title of the staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationRating', @level2type=N'COLUMN', @level2name=N'StaffEvaluationTitle'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique alphanumeric code assigned to a staff.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationRating', @level2type=N'COLUMN', @level2name=N'StaffUSI'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The numerical summary rating or score for the evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationRating', @level2type=N'COLUMN', @level2name=N'Rating'
GO

-- Extended Properties [extension].[StaffEvaluationSampleCommonSubclass] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'doc', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationSampleCommonSubclass'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The school year the Staff evaluation is applied.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationSampleCommonSubclass', @level2type=N'COLUMN', @level2name=N'SchoolYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The name or title of the staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationSampleCommonSubclass', @level2type=N'COLUMN', @level2name=N'StaffEvaluationTitle'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The status for two.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationSampleCommonSubclass', @level2type=N'COLUMN', @level2name=N'StatusTwo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The status for one.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationSampleCommonSubclass', @level2type=N'COLUMN', @level2name=N'StatusOne'
GO

-- Extended Properties [extension].[StaffEvaluationStaffRatingLevel] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The descriptive level(s) of ratings (cut scores) for staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationStaffRatingLevel'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The school year the Staff evaluation is applied.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'SchoolYear'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The title for a level of rating or evaluation band (e.g., Excellent, Acceptable, Needs Improvement, Unacceptable).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'StaffEvaluationLevel'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The name or title of the staff evaluation.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'StaffEvaluationTitle'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The maximum rating to achieve the level.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'MaxLevel'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The minimum rating to achieve the level.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffEvaluationStaffRatingLevel', @level2type=N'COLUMN', @level2name=N'MinLevel'
GO

-- Extended Properties [extension].[StaffExtension] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffExtension'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique alphanumeric code assigned to a staff.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffExtension', @level2type=N'COLUMN', @level2name=N'StaffUSI'
GO

-- Extended Properties [extension].[StaffMyCollection] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hi', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffMyCollection'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hi', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffMyCollection', @level2type=N'COLUMN', @level2name=N'MyCollection'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique alphanumeric code assigned to a staff.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffMyCollection', @level2type=N'COLUMN', @level2name=N'StaffUSI'
GO

-- Extended Properties [extension].[StaffRatingLevel] --
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'There', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffRatingLevel'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A unique alphanumeric code assigned to a staff.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffRatingLevel', @level2type=N'COLUMN', @level2name=N'StaffUSI'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The title for a level of rating or evaluation band (e.g., Excellent, Acceptable, Needs Improvement, Unacceptable).', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffRatingLevel', @level2type=N'COLUMN', @level2name=N'StaffEvaluationLevel'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The maximum rating to achieve the level.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffRatingLevel', @level2type=N'COLUMN', @level2name=N'MaxLevel'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The minimum rating to achieve the level.', @level0type=N'SCHEMA', @level0name=N'extension', @level1type=N'TABLE', @level1name=N'StaffRatingLevel', @level2type=N'COLUMN', @level2name=N'MinLevel'
GO


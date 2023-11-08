-- Table extension.StaffEvaluation --
CREATE TABLE extension.StaffEvaluation (
    SchoolYear SMALLINT NOT NULL,
    StaffEvaluationTitle VARCHAR(50) NOT NULL,
    MaxRating VARCHAR(20) NOT NULL,
    MinRating DECIMAL(6, 3) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT StaffEvaluation_PK PRIMARY KEY (SchoolYear, StaffEvaluationTitle)
); 
ALTER TABLE extension.StaffEvaluation ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.StaffEvaluation ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.StaffEvaluation ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.StaffEvaluationComponent --
CREATE TABLE extension.StaffEvaluationComponent (
    EvaluationComponent VARCHAR(50) NOT NULL,
    SchoolYear SMALLINT NOT NULL,
    StaffEvaluationTitle VARCHAR(50) NOT NULL,
    MaxRating DECIMAL(6, 3) NOT NULL,
    MinRating DECIMAL(6, 3) NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT StaffEvaluationComponent_PK PRIMARY KEY (EvaluationComponent, SchoolYear, StaffEvaluationTitle)
); 
ALTER TABLE extension.StaffEvaluationComponent ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.StaffEvaluationComponent ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.StaffEvaluationComponent ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.StaffEvaluationComponentStaffRatingLevel --
CREATE TABLE extension.StaffEvaluationComponentStaffRatingLevel (
    EvaluationComponent VARCHAR(50) NOT NULL,
    SchoolYear SMALLINT NOT NULL,
    StaffEvaluationTitle VARCHAR(50) NOT NULL,
    MaxLevel DECIMAL(6, 3) NOT NULL,
    MinLevel DECIMAL(6, 3) NULL,
    StaffEvaluationLevel VARCHAR(50) NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT StaffEvaluationComponentStaffRatingLevel_PK PRIMARY KEY (EvaluationComponent, SchoolYear, StaffEvaluationTitle)
); 
ALTER TABLE extension.StaffEvaluationComponentStaffRatingLevel ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.StaffEvaluationRating --
CREATE TABLE extension.StaffEvaluationRating (
    SchoolYear SMALLINT NOT NULL,
    StaffEvaluationDate DATE NOT NULL,
    StaffEvaluationTitle VARCHAR(50) NOT NULL,
    StaffUSI INT NOT NULL,
    Rating DECIMAL(6, 3) NOT NULL,
    Discriminator VARCHAR(128) NULL,
    CreateDate TIMESTAMP NOT NULL,
    LastModifiedDate TIMESTAMP NOT NULL,
    Id UUID NOT NULL,
    CONSTRAINT StaffEvaluationRating_PK PRIMARY KEY (SchoolYear, StaffEvaluationDate, StaffEvaluationTitle, StaffUSI)
); 
ALTER TABLE extension.StaffEvaluationRating ALTER COLUMN CreateDate SET DEFAULT current_timestamp;
ALTER TABLE extension.StaffEvaluationRating ALTER COLUMN Id SET DEFAULT gen_random_uuid();
ALTER TABLE extension.StaffEvaluationRating ALTER COLUMN LastModifiedDate SET DEFAULT current_timestamp;

-- Table extension.StaffEvaluationStaffRatingLevel --
CREATE TABLE extension.StaffEvaluationStaffRatingLevel (
    SchoolYear SMALLINT NOT NULL,
    StaffEvaluationTitle VARCHAR(50) NOT NULL,
    StaffEvaluationLevel VARCHAR(50) NOT NULL,
    MaxLevel DECIMAL(6, 3) NOT NULL,
    MinLevel DECIMAL(6, 3) NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT StaffEvaluationStaffRatingLevel_PK PRIMARY KEY (SchoolYear, StaffEvaluationTitle, StaffEvaluationLevel)
); 
ALTER TABLE extension.StaffEvaluationStaffRatingLevel ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.StaffMyCollection --
CREATE TABLE extension.StaffMyCollection (
    StaffUSI INT NOT NULL,
    MyCollection INT NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT StaffMyCollection_PK PRIMARY KEY (StaffUSI, MyCollection)
); 
ALTER TABLE extension.StaffMyCollection ALTER COLUMN CreateDate SET DEFAULT current_timestamp;

-- Table extension.StaffRatingLevel --
CREATE TABLE extension.StaffRatingLevel (
    StaffUSI INT NOT NULL,
    MaxLevel DECIMAL(6, 3) NOT NULL,
    MinLevel DECIMAL(6, 3) NULL,
    StaffEvaluationLevel VARCHAR(50) NOT NULL,
    CreateDate TIMESTAMP NOT NULL,
    CONSTRAINT StaffRatingLevel_PK PRIMARY KEY (StaffUSI)
); 
ALTER TABLE extension.StaffRatingLevel ALTER COLUMN CreateDate SET DEFAULT current_timestamp;


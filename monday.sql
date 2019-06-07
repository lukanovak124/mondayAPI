CREATE TABLE dev.dbo.MondayUsers (
    UserId INT PRIMARY KEY,
    UserUrl VARCHAR(100),
    UserName VARCHAR(100),
    UserEmail VARCHAR(100),
    PhotoUrl VARCHAR(500),
    Title VARCHAR(1000),
    Position VARCHAR(1000),
    Phone VARCHAR(1000),
    UserLocation VARCHAR(1000),
    UserStatus VARCHAR(1000),
    UserBirthday VARCHAR(100),
    IsGuest INT,
    CreatedAt DATETIME,
    UpdatedAt DATETIME,
);

CREATE TABLE dev.dbo.MondayProjects (
    ProjectId INT PRIMARY KEY,
    ProjectUrl VARCHAR(100),
    ProjectName VARCHAR(100),
    ProjectDescription VARCHAR(8000),
    ProjectKind VARCHAR(100),
    Columns VARCHAR(8000),
    CreatedAt DATETIME,
    UpdatedAt DATETIME,
);

CREATE TABLE dev.dbo.MondayTasks (
    TaskId INT PRIMARY KEY,
    TaskUrl VARCHAR(100),
    TaskName VARCHAR(100),
    UpdatesCount INT,
    ProjectId INT,
    ColumnValues VARCHAR(8000),
    CreatedAt DATETIME,
    UpdatedAt DATETIME,
);
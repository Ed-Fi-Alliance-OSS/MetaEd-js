#!/bin/bash

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to start..."
until docker exec metaed-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'MetaEdTest123' -Q "SELECT 1" -C &> /dev/null
do
  echo "SQL Server is unavailable - sleeping"
  sleep 1
done

echo "SQL Server is up - executing setup script"

# Create the setup SQL script with escaped password
docker exec metaed-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'MetaEdTest123' -C -Q "
-- Disable password policy for test user
ALTER LOGIN sa WITH CHECK_POLICY = OFF;

-- Create metaed login with simple password (matching test expectations)
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'metaed')
BEGIN
    CREATE LOGIN metaed WITH PASSWORD = 'metaed-test', CHECK_POLICY = OFF;
END

-- Create the test database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'MetaEd_Ods_Integration_Tests')
BEGIN
    CREATE DATABASE MetaEd_Ods_Integration_Tests;
END

-- Switch to the test database
USE MetaEd_Ods_Integration_Tests;

-- Create metaed user in the database
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'metaed')
BEGIN
    CREATE USER metaed FOR LOGIN metaed;
END

-- Grant necessary permissions
ALTER ROLE db_owner ADD MEMBER metaed;

-- Grant server-level permissions for creating/dropping databases during tests
ALTER SERVER ROLE sysadmin ADD MEMBER metaed;

PRINT 'Setup completed successfully';
"

echo "SQL Server setup completed"
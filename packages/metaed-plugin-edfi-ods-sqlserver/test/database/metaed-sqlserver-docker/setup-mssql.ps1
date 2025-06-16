# PowerShell script to set up SQL Server for MetaEd tests

Write-Host "Waiting for SQL Server to start..." -ForegroundColor Yellow

# Wait for SQL Server to be ready
$maxAttempts = 60
$attempt = 0

while ($attempt -lt $maxAttempts) {
    try {
        $output = docker exec metaed-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'MetaEd!Test123' -C -Q "SELECT 1" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SQL Server is up - executing setup script" -ForegroundColor Green
            break
        }
    }
    catch {
        # Ignore errors during connection attempts
    }
    
    Write-Host "SQL Server is unavailable - sleeping"
    Start-Sleep -Seconds 1
    $attempt++
}

if ($attempt -eq $maxAttempts) {
    Write-Host "ERROR: SQL Server failed to start within 60 seconds" -ForegroundColor Red
    exit 1
}

# Create the setup SQL script
Write-Host "Creating database and user..." -ForegroundColor Yellow

$setupScript = @"
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
GO
"@

# Execute the setup script
docker exec metaed-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'MetaEd!Test123' -C -Q $setupScript

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create database and login" -ForegroundColor Red
    exit 1
}

# Grant permissions
Write-Host "Granting permissions..." -ForegroundColor Yellow

$permissionsScript = @"
-- Create metaed user in the database
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'metaed')
BEGIN
    CREATE USER metaed FOR LOGIN metaed;
END

-- Grant necessary permissions
ALTER ROLE db_owner ADD MEMBER metaed;
GO
"@

docker exec metaed-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'MetaEd!Test123' -C -d MetaEd_Ods_Integration_Tests -Q $permissionsScript

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create user and grant permissions" -ForegroundColor Red
    exit 1
}

# Grant server-level permissions
$sysadminScript = @"
-- Grant server-level permissions for creating/dropping databases during tests
ALTER SERVER ROLE sysadmin ADD MEMBER metaed;
PRINT 'Setup completed successfully';
GO
"@

docker exec metaed-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'MetaEd!Test123' -C -Q $sysadminScript

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to grant sysadmin role" -ForegroundColor Red
    exit 1
}

Write-Host "SQL Server setup completed successfully!" -ForegroundColor Green

# Test the connection with metaed user
Write-Host "Testing connection with metaed user..." -ForegroundColor Yellow
docker exec metaed-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U metaed -P 'metaed-test' -C -d MetaEd_Ods_Integration_Tests -Q "SELECT DB_NAME() AS CurrentDatabase"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Connection test successful!" -ForegroundColor Green
} else {
    Write-Host "WARNING: Connection test failed" -ForegroundColor Yellow
}
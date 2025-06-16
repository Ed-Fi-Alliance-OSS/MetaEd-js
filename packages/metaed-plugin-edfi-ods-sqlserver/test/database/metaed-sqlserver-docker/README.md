# SQL Server Docker Setup for MetaEd Tests

This directory contains the necessary files to set up a SQL Server 2022 container for running MetaEd database tests.

## Prerequisites

- Docker installed and running on your system
- Docker Compose (included with Docker Desktop)

## Files

- `docker-compose.yml` - Docker Compose configuration for SQL Server 2022
- `setup-mssql.sh` - Shell script to configure SQL Server with the required user and database (Linux/macOS)
- `setup-mssql.ps1` - PowerShell script to configure SQL Server with the required user and database (Windows)

## Quick Start

1. **Start the SQL Server container:**
   ```bash
   cd packages/metaed-plugin-edfi-ods-sqlserver/test/database/docker-setup
   docker compose up -d
   ```

2. **Run the setup script:**
   
   **Linux/macOS:**
   ```bash
   ./setup-mssql.sh
   ```
   
   **Windows (PowerShell):**
   ```powershell
   .\setup-mssql.ps1
   ```

3. **Run a test:**
   ```bash
   # From the project root
   npx jest packages/metaed-plugin-edfi-ods-sqlserver/test/database/DomainEntity.test.ts
   ```

## Configuration Details

### SQL Server Container
- **Image:** Microsoft SQL Server 2022 Developer Edition
- **Container Name:** `metaed-mssql`
- **Port:** 1433 (default SQL Server port)
- **SA Password:** `MetaEd!Test123`

### Database Configuration
- **Database Name:** `MetaEd_Ods_Integration_Tests`
- **Login/Username:** `metaed`
- **Password:** `metaed-test`
- **Permissions:** 
  - `db_owner` role on the test database
  - `sysadmin` server role (required for creating/dropping databases during tests)

### Environment Variables (Optional)

The tests support the following environment variables if you need to override defaults:

- `MSSQL_SERVER` - SQL Server hostname (default: `localhost`)
- `MSSQL_PORT` - SQL Server port (default: `1433`)
- `MSSQL_USERNAME` - Database username (default: `metaed`)
- `MSSQL_PASSWORD` - Database password (default: `metaed-test`)
- `METAED_DATABASE` - Database name (default: `MetaEd_Ods_Integration_Tests`)

## Managing the Container

### Stop the container:
```bash
docker compose down
```

### Stop and remove all data:
```bash
docker compose down -v
```

### View container logs:
```bash
docker logs metaed-mssql
```

### Connect to SQL Server manually:
```bash
docker exec -it metaed-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U metaed -P 'metaed-test' -C
```

## Troubleshooting

1. **Container won't start:** Ensure port 1433 is not already in use by another SQL Server instance
   ```bash
   lsof -i :1433  # On macOS/Linux
   netstat -an | findstr :1433  # On Windows
   ```

2. **Connection timeout:** SQL Server takes 30-60 seconds to fully initialize on first run. The setup script will wait for it to be ready.

3. **Authentication failed:** Ensure you're using the correct credentials:
   - For SA account: username `sa`, password `MetaEd!Test123`
   - For test user: username `metaed`, password `metaed-test`

4. **sqlcmd not found:** The 2022 image uses `/opt/mssql-tools18/bin/sqlcmd` (note the "18" in the path)

## Notes

- The container uses a named volume `mssql-data` to persist database files between restarts
- Password policy is disabled for the test user to allow the simple password
- The SA password includes special characters and must be properly escaped in shell commands
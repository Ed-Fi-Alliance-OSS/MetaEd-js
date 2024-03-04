# Developer Onboarding Notes

## Repositories

| Repo | Purpose |
| --- | --- |
| [MetaEd-js](https://github.com/Ed-Fi-Closed/MetaEd-js) | This is the current Node.js/TypeScript implementation, structured as a [Lerna](https://lerna.js.org/) monorepo. |
| [vscode-metaed](https://github.com/Ed-Fi-Alliance-OSS/vscode-metaed-ide/) | VS Code extension |
| [MetaEd-Contrib](https://github.com/Ed-Fi-Alliance/MetaEd-Contrib)  | Community contributed MetaEd models​ |
| [Ed-Fi-Model](https://github.com/Ed-Fi-Alliance-Closed/Ed-Fi-Model) | Repository for the core Ed-Fi data model definition source (as MetaEd files). Note that the formal publication of the Ed-Fi UDM is as UML and a Data Handbook and is published in the Ed-Fi-Standard repo. |
| [MetaEd-IDE](https://github.com/Ed-Fi-Alliance/MetaEd-IDE) | The installation package for the MetaEd IDE on the Atom text editor. (OBSOLETE) |
| [Atom-MetaEd](https://github.com/Ed-Fi-Alliance/Atom-MetaEd) (Archived) | Spike of an Atom text editor package. (OBSOLETE) |
| [MetaEd](https://github.com/Ed-Fi-Alliance/MetaEd) (Archived) | Archived repository for Ed-Fi Alliance's original MetaEd C# project. (OBSOLETE) |

## Getting Started with MetaEd-js

1. Install Node 18 (LTS). Recommendation: use [nvm-windows](https://github.com/coreybutler/nvm-windows) or
   [nvs](https://github.com/jasongin/nvs).
2. Clone the repository
3. Switch to the new repo directory and run `npm install`
4. Run `npm run test`. If they all pass, you are done.
5. Review the package.json file for all of the commands that can be run.

If you are developing while connected to the MSDF network, then you may get an error related to `self signed certificate in
the certificate chain`. This is because MSDF decrypts and reencrypts traffic with a custom certificate. That certificate
needs to be added to the certificate chain used by NodeJs. Get a copy of `msdfrootca.cer` from another developer or MSDF IT
and put it somewhere locally. Before running `npm install`, setup an environment variable. Assuming PowerShell:

```shell
PS C:\source\MetaEd-js> $env:NODE_EXTRA_CA_CERTS="c:\source\msdfrootca.cer"
PS C:\source\MetaEd-js> npm install
```

## Running Integration Tests

MetaEd has integration tests that run on SQL Server. These tests run on Windows or Linux and do not rely on ODBC; therefore,
they must utilize username and password rather than integrated security. The following script will create a user with full
sysadmin authority to create and drop a test database:

```sql
USE [master]
GO

CREATE LOGIN [metaed] WITH PASSWORD=N'metaed-test', DEFAULT_DATABASE=[master], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO

USE [MetaEd_Ods_Integration_Tests]
GO

CREATE USER [metaed] FOR LOGIN [metaed]
GO

USE [MetaEd_Ods_Integration_Tests]
GO

ALTER ROLE [db_owner] ADD MEMBER [metaed]
GO

ALTER SERVER ROLE [sysadmin] ADD MEMBER [metaed]
GO
```

The following environment variables are available for overriding database settings (with default value shown):

* METAED\_DATABASE = 'MetaEd\_Ods\_Integration\_Tests'
* MSSQL\_SERVER = 'localhost'
* MSSQL\_PORT = 1433
* MSSQL\_USERNAME = 'metaed'
* MSSQL\_PASSWORD = 'metaed-test'
* MSSQL\_ENCRYPT = false
* MSSQL\_TRUST\_CERTIFICATE = false

There are similar integration test for PostgreSQL. Enviroment variables and defaults are:

* PGDATABASE= 'metaed\_integration\_tests'
* PGHOST= 'localhost'
* PGPORT= 5432
* PGUSER= 'postgres'
* PGPASSWORD= 'docker'

## Command Line Operation

See [cli.md](./cli.md)

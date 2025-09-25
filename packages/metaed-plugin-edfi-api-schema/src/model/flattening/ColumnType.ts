// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/**
 * Abstract column types that map to database-specific SQL types.
 * These types are database-agnostic and will be transformed to appropriate
 * SQL types for PostgreSQL and SQL Server during DDL generation.
 */
export type ColumnType =
  | 'bigint' // Maps to BIGINT
  | 'boolean' // Maps to BIT (SQL Server) or BOOLEAN (PostgreSQL)
  | 'currency' // Maps to MONEY
  | 'date' // Maps to DATE
  | 'datetime' // Maps to DATETIME2(7) (SQL Server) or TIMESTAMP (PostgreSQL)
  | 'decimal' // Maps to DECIMAL(precision, scale)
  | 'descriptor' // Maps to BIGINT (foreign key to descriptor table)
  | 'duration' // Maps to NVARCHAR(30) (SQL Server) or VARCHAR(30) (PostgreSQL)
  | 'integer' // Maps to INT
  | 'percent' // Maps to DECIMAL(5, 4)
  | 'short' // Maps to SMALLINT
  | 'string' // Maps to NVARCHAR(length) (SQL Server) or VARCHAR(length) (PostgreSQL)
  | 'time' // Maps to TIME
  | 'year' // Maps to SMALLINT
  | 'unknown';

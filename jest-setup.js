// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// eslint-disable-next-line import/no-extraneous-dependencies
const winston = require('winston');

const transport = new winston.transports.Console();
transport.silent = true;
winston.configure({ transports: [transport] });

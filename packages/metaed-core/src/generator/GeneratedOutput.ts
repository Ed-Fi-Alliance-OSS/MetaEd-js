// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/**
 * GeneratedOutput an object returned by a Generator for each artifact generated.
 *
 * **name** is the human-readable name for the artifact.
 *
 * **namespace** is the name of the namespace that the artifact applies to.  Generators usually create an artifact
 * type per namespace.
 *
 * **fileName** is the filename to be used for this artifact.
 *
 * **folderName** is the folder location the artifact should be placed in.  It will be relative to the namespace directory.
 *
 * **resultString** is the generator output as a string, typically used in conjunction with Handlebars templates.  It is ignored
 * if a **resultStream** is supplied.
 *
 * **resultStream** is the generator output as a binary stream.  **resultString** is ignored if this is supplied.
 */
export interface GeneratedOutput {
  name: string;
  namespace: string;
  fileName: string;
  folderName: string;
  resultString: string;
  resultStream: Buffer | null;
}

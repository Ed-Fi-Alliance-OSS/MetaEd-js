// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { MetaEdEnvironment, EnhancerResult, Interchange, InterchangeExtension, InterchangeItem } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';

export interface InterchangeItemEdfiXsd {
  xsdName: string;
  xsdType: string;
}

const equalXsdName = R.eqBy(R.path(['data', 'edfiXsd', 'xsdName']));
const equalXsdType = R.eqBy(R.path(['data', 'edfiXsd', 'xsdType']));
export const interchangeItemsEqual = R.both(equalXsdName, equalXsdType);
export const interchangeItemsNameEqual = equalXsdName;
export const unionOfInterchangeItems = R.unionWith(interchangeItemsEqual);
export const differenceOfInterchangeItems = R.differenceWith(interchangeItemsEqual);
export const differenceOfInterchangeItemsNameOnly = R.differenceWith(interchangeItemsNameEqual);

const enhancerName = 'InterchangeItemSetupEnhancer';

export function addInterchangeItemEdfiXsdTo(interchangeItem: InterchangeItem) {
  if (interchangeItem.data.edfiXsd == null) interchangeItem.data.edfiXsd = {};

  Object.assign(interchangeItem.data.edfiXsd, {
    xsdName: '',
    xsdType: '',
  });
}

function addInterchangeItemEdfiXsdToInterchange(interchange: Interchange | InterchangeExtension) {
  interchange.elements.forEach((interchangeItem) => addInterchangeItemEdfiXsdTo(interchangeItem));
  interchange.identityTemplates.forEach((interchangeItem) => addInterchangeItemEdfiXsdTo(interchangeItem));
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'interchange') as Interchange[]).forEach((interchange: Interchange) => {
    addInterchangeItemEdfiXsdToInterchange(interchange);
  });

  (getAllEntitiesOfType(metaEd, 'interchangeExtension') as InterchangeExtension[]).forEach(
    (interchangeExtension: InterchangeExtension) => {
      addInterchangeItemEdfiXsdToInterchange(interchangeExtension);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}

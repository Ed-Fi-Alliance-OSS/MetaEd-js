import R from 'ramda';
import { MetaEdEnvironment, EnhancerResult, Interchange, InterchangeExtension, InterchangeItem } from 'metaed-core';
import { getAllEntitiesOfType } from 'metaed-core';

export type InterchangeItemEdfiXsd = {
  xsdName: string;
  xsdType: string;
};

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
  interchange.elements.forEach(interchangeItem => addInterchangeItemEdfiXsdTo(interchangeItem));
  interchange.identityTemplates.forEach(interchangeItem => addInterchangeItemEdfiXsdTo(interchangeItem));
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'interchange') as Array<Interchange>).forEach((interchange: Interchange) => {
    addInterchangeItemEdfiXsdToInterchange(interchange);
  });

  (getAllEntitiesOfType(metaEd, 'interchangeExtension') as Array<InterchangeExtension>).forEach(
    (interchangeExtension: InterchangeExtension) => {
      addInterchangeItemEdfiXsdToInterchange(interchangeExtension);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}

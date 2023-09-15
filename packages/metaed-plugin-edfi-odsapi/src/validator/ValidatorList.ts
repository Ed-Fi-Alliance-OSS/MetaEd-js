import { Validator } from '@edfi/metaed-core';

import { validate as includingRequiredPropertiesInExtendedAssociationsProhibited } from './UpcomingImprovements/IncludingRequiredPropertiesInExtendedAssociationsProhibited';
import { validate as includingRequiredPropertiesInExtendedDomainEntitiesProhibited } from './UpcomingImprovements/IncludingRequiredPropertiesInExtendedDomainEntitiesProhibited';
import { validate as subclassingAnyAssociationExceptGeneralStudentProgramAssociationIsUnsupported } from './UpcomingImprovements/SubclassingAnyAssociationExceptGeneralStudentProgramAssociationIsUnsupported';
import { validate as subclassingAnyDomainEntityExceptEducationOrganizationIsUnsupported } from './UpcomingImprovements/SubclassingAnyDomainEntityExceptEducationOrganizationIsUnsupported';
import { validate as odsApiIgnoresRequiredOnChoicePropertiesInExtensions } from './OdsApiIgnoresRequiredOnChoicePropertiesInExtensions';

export function validatorList(): Validator[] {
  return [
    includingRequiredPropertiesInExtendedAssociationsProhibited,
    includingRequiredPropertiesInExtendedDomainEntitiesProhibited,
    odsApiIgnoresRequiredOnChoicePropertiesInExtensions,
    subclassingAnyAssociationExceptGeneralStudentProgramAssociationIsUnsupported,
    subclassingAnyDomainEntityExceptEducationOrganizationIsUnsupported,
  ];
}

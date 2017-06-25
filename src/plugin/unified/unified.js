// @flow
import type { Validator } from '../../core/validator/Validator';
import type { MetaEdCore, PluginData, MetaEdPlugin } from '../PluginTypes';

import { validate as associationExtensionExistsOnlyInExtensionNamespace } from './validator/AssociationExtension/AssociationExtensionExistsOnlyInExtensionNamespace';
import { validate as associationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass } from './validator/AssociationExtension/AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass';
import { validate as associationExtensionMustNotRedeclareProperties } from './validator/AssociationExtension/AssociationExtensionMustNotRedeclareProperties';

import { validate as associationPropertyMustMatchAnAssociation } from './validator/AssociationProperty/AssociationPropertyMustMatchAnAssociation';

import { validate as choicePropertyMustMatchAChoice } from './validator/ChoiceProperty/ChoicePropertyMustMatchAChoice';
import { validate as commonPropertyMustMatchACommon } from './validator/CommonProperty/CommonPropertyMustMatchACommon';
import { validate as mostEntitiesCannotHaveSameName } from './validator/CrossEntity/MostEntitiesCannotHaveSameName';
import { validate as domainEntityMustContainAnIdentity } from './validator/DomainEntity/DomainEntityMustContainAnIdentity';
import { validate as domainEntityMustContainNoMoreThanOneUniqueIdColumn } from './validator/DomainEntity/DomainEntityMustContainNoMoreThanOneUniqueIdColumn';

import { validate as domainEntityExtensionExistsOnlyInExtensionNamespace } from './validator/DomainEntityExtension/DomainEntityExtensionExistsOnlyInExtensionNamespace';
import { validate as domainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass } from './validator/DomainEntityExtension/DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass';
import { validate as domainEntityExtensionMustNotRedeclareProperties } from './validator/DomainEntityExtension/DomainEntityExtensionMustNotRedeclareProperties';


function validatorList(): Array<Validator> {
  return [
    associationExtensionExistsOnlyInExtensionNamespace,
    associationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass,
    associationExtensionMustNotRedeclareProperties,
    associationPropertyMustMatchAnAssociation,
    choicePropertyMustMatchAChoice,
    commonPropertyMustMatchACommon,
    mostEntitiesCannotHaveSameName,
    domainEntityMustContainAnIdentity,
    domainEntityMustContainNoMoreThanOneUniqueIdColumn,
    domainEntityExtensionExistsOnlyInExtensionNamespace,
    domainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass,
    domainEntityExtensionMustNotRedeclareProperties,
  ];
}

// eslint-disable-next-line no-unused-vars
export default function initialize(data: PluginData, host: MetaEdCore): MetaEdPlugin {
  return {
    validators: validatorList(),
  };
}

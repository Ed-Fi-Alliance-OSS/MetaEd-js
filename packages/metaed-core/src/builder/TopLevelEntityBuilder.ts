import R from 'ramda';

import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';
import { EntityProperty } from '../model/property/EntityProperty';
import { NoEntityProperty } from '../model/property/EntityProperty';
import { newMergeDirective, NoMergeDirective } from '../model/property/MergeDirective';
import { MergeDirective, MergeDirectiveSourceMap } from '../model/property/MergeDirective';
import { TopLevelEntity } from '../model/TopLevelEntity';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { NamespaceRepository } from '../model/NamespaceRepository';
import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { Namespace } from '../model/Namespace';
import { NoNamespace } from '../model/Namespace';
import { isSharedProperty } from '../model/property/PropertyType';
import { namespaceNameFrom } from './NamespaceBuilder';
import { extractDocumentation, extractDeprecationReason, isErrorText, squareBracketRemoval } from './BuilderUtility';
import { newBooleanProperty } from '../model/property/BooleanProperty';
import { newCurrencyProperty } from '../model/property/CurrencyProperty';
import { newDateProperty } from '../model/property/DateProperty';
import { newDatetimeProperty } from '../model/property/DatetimeProperty';
import { newDecimalProperty } from '../model/property/DecimalProperty';
import { DecimalProperty, DecimalPropertySourceMap } from '../model/property/DecimalProperty';
import { newDescriptorProperty } from '../model/property/DescriptorProperty';
import { newDurationProperty } from '../model/property/DurationProperty';
import { newEnumerationProperty } from '../model/property/EnumerationProperty';
import { newCommonProperty } from '../model/property/CommonProperty';
import { CommonProperty, CommonPropertySourceMap } from '../model/property/CommonProperty';
import { newInlineCommonProperty } from '../model/property/InlineCommonProperty';
import { newChoiceProperty } from '../model/property/ChoiceProperty';
import { newIntegerProperty } from '../model/property/IntegerProperty';
import { IntegerProperty, IntegerPropertySourceMap } from '../model/property/IntegerProperty';
import { newPercentProperty } from '../model/property/PercentProperty';
import { newAssociationProperty } from '../model/property/AssociationProperty';
import { AssociationProperty, AssociationPropertySourceMap } from '../model/property/AssociationProperty';
import { newDomainEntityProperty } from '../model/property/DomainEntityProperty';
import { DomainEntityProperty, DomainEntityPropertySourceMap } from '../model/property/DomainEntityProperty';
import { newSharedDecimalProperty } from '../model/property/SharedDecimalProperty';
import { newSharedIntegerProperty } from '../model/property/SharedIntegerProperty';
import { newSharedStringProperty } from '../model/property/SharedStringProperty';
import { newStringProperty } from '../model/property/StringProperty';
import { StringProperty, StringPropertySourceMap } from '../model/property/StringProperty';
import { newTimeProperty } from '../model/property/TimeProperty';
import { newYearProperty } from '../model/property/YearProperty';
import { ReferentialProperty, ReferentialPropertySourceMap } from '../model/property/ReferentialProperty';
import { newShortProperty } from '../model/property/ShortProperty';
import { ShortProperty, ShortPropertySourceMap } from '../model/property/ShortProperty';
import { newSharedShortProperty } from '../model/property/SharedShortProperty';
import { sourceMapFrom } from '../model/SourceMap';
import { ValidationFailure } from '../validator/ValidationFailure';
import { PropertyIndex } from '../model/property/PropertyRepository';

function propertyPathFrom(context: MetaEdGrammar.PropertyPathContext): string[] {
  if (R.any((token) => token.exception)(context.ID())) return [];
  return R.map((token) => token.getText())(context.ID());
}

/**
 * The superclass of most other entity builders.  It is never constructed directly.
 */
export class TopLevelEntityBuilder extends MetaEdGrammarListener {
  namespaceRepository: NamespaceRepository;

  currentNamespace: Namespace;

  currentTopLevelEntity: TopLevelEntity;

  currentProperty: EntityProperty;

  currentMergeDirective: MergeDirective;

  whenExitingPropertyCommand: (() => void)[];

  validationFailures: ValidationFailure[];

  currentTopLevelEntityPropertyLookup: Map<string, EntityProperty>;

  propertyRepository: PropertyIndex;

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super();
    this.namespaceRepository = metaEd.namespace;
    this.currentNamespace = NoNamespace;
    this.currentTopLevelEntity = NoTopLevelEntity;
    this.currentProperty = NoEntityProperty;
    this.currentMergeDirective = NoMergeDirective;
    this.whenExitingPropertyCommand = [];
    this.validationFailures = validationFailures;
    this.currentTopLevelEntityPropertyLookup = new Map();
    this.propertyRepository = metaEd.propertyIndex;
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    const namespace: Namespace | undefined = this.namespaceRepository.get(namespaceNameFrom(context));
    this.currentNamespace = namespace == null ? NoNamespace : namespace;
  }

  enteringEntity(entityFactory: () => TopLevelEntity) {
    this.currentTopLevelEntity = { ...entityFactory(), namespace: this.currentNamespace };
    this.currentTopLevelEntityPropertyLookup.clear();
  }

  exitingEntity() {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (this.currentTopLevelEntity.metaEdName) {
      const currentTopLevelEntityRepository: Map<string, TopLevelEntity> =
        this.currentNamespace.entity[this.currentTopLevelEntity.type];
      if (currentTopLevelEntityRepository.has(this.currentTopLevelEntity.metaEdName)) {
        this.validationFailures.push({
          validatorName: 'TopLevelEntityBuilder',
          category: 'error',
          message: `${this.currentTopLevelEntity.typeHumanizedName} named ${this.currentTopLevelEntity.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: this.currentTopLevelEntity.sourceMap.metaEdName,
          fileMap: null,
        });
        const duplicateEntity: TopLevelEntity | undefined = currentTopLevelEntityRepository.get(
          this.currentTopLevelEntity.metaEdName,
        );
        if (duplicateEntity != null) {
          this.validationFailures.push({
            validatorName: 'TopLevelEntityBuilder',
            category: 'error',
            message: `${duplicateEntity.typeHumanizedName} named ${duplicateEntity.metaEdName} is a duplicate declaration of that name.`,
            sourceMap: duplicateEntity.sourceMap.metaEdName,
            fileMap: null,
          });
        }
      } else {
        currentTopLevelEntityRepository.set(this.currentTopLevelEntity.metaEdName, this.currentTopLevelEntity);
      }
    }
    this.currentTopLevelEntity = NoTopLevelEntity;
  }

  enteringExtendeeName(context: MetaEdGrammar.ExtendeeNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.localExtendeeName() == null) return;

    const localExtendeeNameContext = context.localExtendeeName();
    if (
      localExtendeeNameContext.exception ||
      localExtendeeNameContext.ID() == null ||
      localExtendeeNameContext.ID().exception ||
      isErrorText(localExtendeeNameContext.ID().getText())
    )
      return;

    const extendeeName = localExtendeeNameContext.ID().getText();
    this.enteringName(extendeeName);
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);

    this.currentTopLevelEntity.baseEntityName = extendeeName;
    this.currentTopLevelEntity.sourceMap.baseEntityName = sourceMapFrom(localExtendeeNameContext);

    const extendeeNamespaceContext = context.extendeeNamespace();
    if (
      extendeeNamespaceContext == null ||
      extendeeNamespaceContext.exception ||
      extendeeNamespaceContext.ID() == null ||
      extendeeNamespaceContext.ID().exception ||
      isErrorText(extendeeNamespaceContext.ID().getText())
    ) {
      this.currentTopLevelEntity.baseEntityNamespaceName = this.currentNamespace.namespaceName;
      this.currentTopLevelEntity.sourceMap.baseEntityNamespaceName = this.currentTopLevelEntity.sourceMap.baseEntityName;
    } else {
      this.currentTopLevelEntity.baseEntityNamespaceName = extendeeNamespaceContext.ID().getText();
      this.currentTopLevelEntity.sourceMap.baseEntityNamespaceName = sourceMapFrom(extendeeNamespaceContext);
    }
  }

  enteringBaseName(context: MetaEdGrammar.BaseNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.localBaseName() == null) return;

    const localBaseNameContext = context.localBaseName();
    if (
      localBaseNameContext.exception ||
      localBaseNameContext.ID() == null ||
      localBaseNameContext.ID().exception ||
      isErrorText(localBaseNameContext.ID().getText())
    )
      return;

    this.currentTopLevelEntity.baseEntityName = localBaseNameContext.ID().getText();
    this.currentTopLevelEntity.sourceMap.baseEntityName = sourceMapFrom(localBaseNameContext);

    const baseNamespaceContext = context.baseNamespace();
    if (
      baseNamespaceContext == null ||
      baseNamespaceContext.exception ||
      baseNamespaceContext.ID() == null ||
      baseNamespaceContext.ID().exception ||
      isErrorText(baseNamespaceContext.ID().getText())
    ) {
      this.currentTopLevelEntity.baseEntityNamespaceName = this.currentNamespace.namespaceName;
      this.currentTopLevelEntity.sourceMap.baseEntityNamespaceName = this.currentTopLevelEntity.sourceMap.baseEntityName;
    } else {
      this.currentTopLevelEntity.baseEntityNamespaceName = baseNamespaceContext.ID().getText();
      this.currentTopLevelEntity.sourceMap.baseEntityNamespaceName = sourceMapFrom(baseNamespaceContext);
    }
  }

  enterDeprecated(context: MetaEdGrammar.DeprecatedContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;

    if (!context.exception) {
      this.currentTopLevelEntity.isDeprecated = true;
      this.currentTopLevelEntity.deprecationReason = extractDeprecationReason(context);
      this.currentTopLevelEntity.sourceMap.isDeprecated = sourceMapFrom(context);
      this.currentTopLevelEntity.sourceMap.deprecationReason = sourceMapFrom(context);
    }
  }

  enterDocumentation(context: MetaEdGrammar.DocumentationContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    this.currentTopLevelEntity.documentation = extractDocumentation(context);
    this.currentTopLevelEntity.sourceMap.documentation = sourceMapFrom(context);
  }

  enteringName(name: string) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    this.currentTopLevelEntity.metaEdName = name;
  }

  enterMetaEdId(context: MetaEdGrammar.MetaEdIdContext) {
    if (
      context.exception ||
      context.METAED_ID() == null ||
      context.METAED_ID().exception != null ||
      isErrorText(context.METAED_ID().getText())
    )
      return;

    if (this.currentProperty !== NoEntityProperty) {
      this.currentProperty.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentProperty.sourceMap.metaEdId = sourceMapFrom(context);
    } else if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentTopLevelEntity.sourceMap.metaEdId = sourceMapFrom(context);
    }
  }

  enterBooleanProperty(context: MetaEdGrammar.BooleanPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newBooleanProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterCurrencyProperty(context: MetaEdGrammar.CurrencyPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newCurrencyProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterDateProperty(context: MetaEdGrammar.DatePropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newDateProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterDatetimeProperty(context: MetaEdGrammar.DatetimePropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newDatetimeProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterDecimalProperty(context: MetaEdGrammar.DecimalPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newDecimalProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterDescriptorProperty(context: MetaEdGrammar.DescriptorPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newDescriptorProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterDurationProperty(context: MetaEdGrammar.DurationPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newDurationProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterEnumerationProperty(context: MetaEdGrammar.EnumerationPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newEnumerationProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterCommonProperty(context: MetaEdGrammar.CommonPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newCommonProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterInlineCommonProperty(context: MetaEdGrammar.InlineCommonPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newInlineCommonProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterChoiceProperty(context: MetaEdGrammar.ChoicePropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newChoiceProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterCommonExtensionOverride(context: MetaEdGrammar.CommonExtensionOverrideContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (context.exception) return;
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
    (this.currentProperty as CommonProperty).isExtensionOverride = true;
    (this.currentProperty.sourceMap as CommonPropertySourceMap).isExtensionOverride = sourceMapFrom(context);
  }

  enterIntegerProperty(context: MetaEdGrammar.IntegerPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newIntegerProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterShortProperty(context: MetaEdGrammar.ShortPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newShortProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterPercentProperty(context: MetaEdGrammar.PercentPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newPercentProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterAssociationProperty(context: MetaEdGrammar.AssociationPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newAssociationProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterDomainEntityProperty(context: MetaEdGrammar.DomainEntityPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newDomainEntityProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterSharedDecimalProperty(context: MetaEdGrammar.SharedDecimalPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newSharedDecimalProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterSharedIntegerProperty(context: MetaEdGrammar.SharedIntegerPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newSharedIntegerProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterSharedShortProperty(context: MetaEdGrammar.SharedShortPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newSharedShortProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterSharedStringProperty(context: MetaEdGrammar.SharedStringPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newSharedStringProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterStringProperty(context: MetaEdGrammar.StringPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newStringProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterTimeProperty(context: MetaEdGrammar.TimePropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newTimeProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  enterYearProperty(context: MetaEdGrammar.YearPropertyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = newYearProperty();
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
  }

  // @ts-ignore
  exitProperty(context: MetaEdGrammar.PropertyContext) {
    this.exitingProperty();
  }

  // side effect - pushes ValidationFailures if there is a name collision
  propertyNameCollision(): boolean {
    // if this is empty there's a parse error - go ahead and declare collision, but don't bother with error messages
    if (!this.currentProperty.fullPropertyName) return true;

    if (!this.currentTopLevelEntityPropertyLookup.has(this.currentProperty.fullPropertyName)) {
      this.currentTopLevelEntityPropertyLookup.set(this.currentProperty.fullPropertyName, this.currentProperty);
      return false;
    }

    this.validationFailures.push({
      validatorName: 'TopLevelEntityBuilder',
      category: 'error',
      message: `Property named ${this.currentProperty.metaEdName} is a duplicate declaration of that name. Use 'role name' keyword to avoid naming collisions.`,
      sourceMap: this.currentProperty.sourceMap.metaEdName,
      fileMap: null,
    });

    const duplicateProperty: EntityProperty = this.currentTopLevelEntityPropertyLookup.get(
      this.currentProperty.fullPropertyName,
    ) as EntityProperty;
    this.validationFailures.push({
      validatorName: 'TopLevelEntityBuilder',
      category: 'error',
      message: `Property named ${duplicateProperty.metaEdName} is a duplicate declaration of that name.  Use 'role name' keyword to avoid naming collisions.`,
      sourceMap: duplicateProperty.sourceMap.metaEdName,
      fileMap: null,
    });

    return true;
  }

  exitingProperty() {
    if (this.currentProperty === NoEntityProperty) return;
    this.currentProperty.namespace = this.currentTopLevelEntity.namespace;

    // a property references entities in its own namespace by default
    if (this.currentProperty.referencedNamespaceName === '') {
      this.currentProperty.referencedNamespaceName = this.currentProperty.namespace.namespaceName;
      this.currentProperty.sourceMap.referencedNamespaceName = this.currentProperty.sourceMap.metaEdName;
    }

    // Shared simple properties have sharedPropertyName as optional. If omitted, name is same as type being referenced
    if (!this.currentProperty.metaEdName && isSharedProperty(this.currentProperty)) {
      this.currentProperty.metaEdName = this.currentProperty.referencedType;
      this.currentProperty.sourceMap.metaEdName = this.currentProperty.sourceMap.referencedType;
    }

    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      while (this.whenExitingPropertyCommand.length > 0) {
        const command: () => void = this.whenExitingPropertyCommand.pop() as () => void;
        command();
      }

      this.currentProperty.parentEntity = this.currentTopLevelEntity;
      this.currentProperty.sourceMap.parentEntity = this.currentTopLevelEntity.sourceMap.type;

      this.currentProperty.parentEntityName = this.currentTopLevelEntity.metaEdName;
      this.currentProperty.sourceMap.parentEntityName = this.currentTopLevelEntity.sourceMap.metaEdName;

      this.currentProperty.fullPropertyName =
        (this.currentProperty.roleName !== this.currentProperty.metaEdName ? this.currentProperty.roleName : '') +
        this.currentProperty.metaEdName;
      // isQueryableOnly is XSD-specific and needs to be pulled out to artifact-specific configuration
      if (!this.currentProperty.isQueryableOnly && !this.propertyNameCollision()) {
        this.currentTopLevelEntity.properties.push(this.currentProperty);
        this.propertyRepository[this.currentProperty.type].push(this.currentProperty);
      }
    }

    this.currentProperty = NoEntityProperty;
  }

  enterPropertyDeprecated(context: MetaEdGrammar.PropertyDeprecatedContext) {
    if (this.currentProperty === NoEntityProperty) return;

    if (!context.exception) {
      this.currentProperty.isDeprecated = true;
      this.currentProperty.deprecationReason = extractDeprecationReason(context);
      this.currentProperty.sourceMap.isDeprecated = sourceMapFrom(context);
      this.currentProperty.sourceMap.deprecationReason = sourceMapFrom(context);
    }
  }

  enterPropertyDocumentation(context: MetaEdGrammar.PropertyDocumentationContext) {
    if (this.currentProperty === NoEntityProperty) return;

    if (!context.exception && context.INHERITED() != null && !context.INHERITED().exception) {
      this.currentProperty.documentationInherited = true;
      this.currentProperty.sourceMap.documentationInherited = sourceMapFrom(context);
    } else {
      this.currentProperty.documentation = extractDocumentation(context);
      this.currentProperty.sourceMap.documentation = sourceMapFrom(context);
    }
  }

  enterRoleNameName(context: MetaEdGrammar.RoleNameNameContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentProperty.roleName = context.ID().getText();
    this.currentProperty.sourceMap.roleName = sourceMapFrom(context);
  }

  enterShortenToName(context: MetaEdGrammar.ShortenToNameContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentProperty.shortenTo = context.ID().getText();
    this.currentProperty.sourceMap.shortenTo = sourceMapFrom(context);
  }

  enterPropertyName(context: MetaEdGrammar.PropertyNameContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (context.exception || context.localPropertyName() == null) return;

    this.enteringLocalPropertyName(context.localPropertyName());

    // School year enumerations are a very special case of enumeration - override the type
    if (this.currentProperty.metaEdName === 'SchoolYear' && this.currentProperty.type === 'enumeration') {
      this.currentProperty.type = 'schoolYearEnumeration';
    }

    const propertyNamespaceContext = context.propertyNamespace();
    if (
      propertyNamespaceContext == null ||
      propertyNamespaceContext.exception ||
      propertyNamespaceContext.ID() == null ||
      propertyNamespaceContext.ID().exception ||
      isErrorText(propertyNamespaceContext.ID().getText())
    ) {
      this.currentProperty.referencedNamespaceName = this.currentNamespace.namespaceName;
      this.currentProperty.sourceMap.referencedNamespaceName = this.currentProperty.sourceMap.metaEdName;
    } else {
      this.currentProperty.referencedNamespaceName = propertyNamespaceContext.ID().getText();
      this.currentProperty.sourceMap.referencedNamespaceName = sourceMapFrom(propertyNamespaceContext);
    }
  }

  enterSimplePropertyName(context: MetaEdGrammar.SimplePropertyNameContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (context.exception || context.localPropertyName() == null) return;

    this.enteringLocalPropertyName(context.localPropertyName());
  }

  enteringLocalPropertyName(localPropertyNameContext: MetaEdGrammar.LocalPropertyNameContext) {
    if (
      localPropertyNameContext.exception ||
      localPropertyNameContext.ID() == null ||
      localPropertyNameContext.ID().exception ||
      isErrorText(localPropertyNameContext.ID().getText())
    )
      return;
    this.currentProperty.metaEdName = localPropertyNameContext.ID().getText();
    this.currentProperty.sourceMap.metaEdName = sourceMapFrom(localPropertyNameContext);
  }

  enterSharedPropertyName(context: MetaEdGrammar.SharedPropertyNameContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentProperty.metaEdName = context.ID().getText();
    this.currentProperty.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterSharedPropertyType(context: MetaEdGrammar.SharedPropertyTypeContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (context.exception || context.localPropertyType() == null) return;
    const localPropertyTypeContext = context.localPropertyType();
    if (
      localPropertyTypeContext.exception ||
      localPropertyTypeContext.ID() == null ||
      localPropertyTypeContext.ID().exception ||
      isErrorText(localPropertyTypeContext.ID().getText())
    )
      return;
    this.currentProperty.referencedType = localPropertyTypeContext.ID().getText();
    this.currentProperty.sourceMap.referencedType = sourceMapFrom(localPropertyTypeContext);

    const propertyNamespaceContext = context.propertyNamespace();
    if (
      propertyNamespaceContext == null ||
      propertyNamespaceContext.exception ||
      propertyNamespaceContext.ID() == null ||
      propertyNamespaceContext.ID().exception ||
      isErrorText(propertyNamespaceContext.ID().getText())
    ) {
      this.currentProperty.referencedNamespaceName = this.currentNamespace.namespaceName;
      this.currentProperty.sourceMap.referencedNamespaceName = this.currentProperty.sourceMap.referencedType;
    } else {
      this.currentProperty.referencedNamespaceName = propertyNamespaceContext.ID().getText();
      this.currentProperty.sourceMap.referencedNamespaceName = sourceMapFrom(propertyNamespaceContext);
    }
  }

  enterIsQueryableField(context: MetaEdGrammar.IsQueryableFieldContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity || this.currentProperty === NoEntityProperty) return;
    this.whenExitingPropertyCommand.push(() => {
      this.currentTopLevelEntity.queryableFields.push(this.currentProperty);
      this.currentTopLevelEntity.sourceMap.queryableFields.push(sourceMapFrom(context));
    });
  }

  enterIsQueryableOnly(context: MetaEdGrammar.IsQueryableOnlyContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity || this.currentProperty === NoEntityProperty) return;
    this.currentProperty.isQueryableOnly = true;
    this.currentProperty.sourceMap.isQueryableOnly = sourceMapFrom(context);
    this.whenExitingPropertyCommand.push(() => {
      this.currentTopLevelEntity.queryableFields.push(this.currentProperty);
      this.currentTopLevelEntity.sourceMap.queryableFields.push(sourceMapFrom(context));
    });
  }

  enterIdentity(context: MetaEdGrammar.IdentityContext) {
    this.enteringIdentity(context);
  }

  enteringIdentity(
    context: MetaEdGrammar.DefiningDomainEntityContext | MetaEdGrammar.IdentityContext | MetaEdGrammar.IdentityRenameContext,
  ) {
    if (this.currentProperty === NoEntityProperty) return;
    this.currentProperty.isPartOfIdentity = true;
    this.currentProperty.sourceMap.isPartOfIdentity = sourceMapFrom(context);
    this.whenExitingPropertyCommand.push(() => {
      this.currentTopLevelEntity.identityProperties.push(this.currentProperty);
      this.currentTopLevelEntity.sourceMap.identityProperties.push(sourceMapFrom(context));
    });
  }

  enterIdentityRename(context: MetaEdGrammar.IdentityRenameContext) {
    if (this.currentProperty === NoEntityProperty) return;
    this.currentProperty.isIdentityRename = true;
    this.currentProperty.sourceMap.isIdentityRename = sourceMapFrom(context);
    this.enteringIdentity(context);
  }

  enterBaseKeyName(context: MetaEdGrammar.BaseKeyNameContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.currentProperty.baseKeyName = context.ID().getText();
    this.currentProperty.sourceMap.baseKeyName = sourceMapFrom(context);
  }

  enterRequired(context: MetaEdGrammar.RequiredContext) {
    if (this.currentProperty === NoEntityProperty) return;
    this.currentProperty.isRequired = true;
    this.currentProperty.sourceMap.isRequired = sourceMapFrom(context);
  }

  enterOptional(context: MetaEdGrammar.OptionalContext) {
    if (this.currentProperty === NoEntityProperty) return;
    this.currentProperty.isOptional = true;
    this.currentProperty.sourceMap.isOptional = sourceMapFrom(context);
  }

  enterRequiredCollection(context: MetaEdGrammar.RequiredCollectionContext) {
    if (this.currentProperty === NoEntityProperty) return;
    this.currentProperty.isRequiredCollection = true;
    this.currentProperty.sourceMap.isRequiredCollection = sourceMapFrom(context);
  }

  enterOptionalCollection(context: MetaEdGrammar.OptionalCollectionContext) {
    if (this.currentProperty === NoEntityProperty) return;
    this.currentProperty.isOptionalCollection = true;
    this.currentProperty.sourceMap.isOptionalCollection = sourceMapFrom(context);
  }

  enterMinLength(context: MetaEdGrammar.MinLengthContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    (this.currentProperty as StringProperty).minLength = context.UNSIGNED_INT().getText();
    this.currentProperty.hasRestriction = true;
    (this.currentProperty.sourceMap as StringPropertySourceMap).minLength = sourceMapFrom(context);
    this.currentProperty.sourceMap.hasRestriction = sourceMapFrom(context);
  }

  enterMaxLength(context: MetaEdGrammar.MaxLengthContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    (this.currentProperty as StringProperty).maxLength = context.UNSIGNED_INT().getText();
    this.currentProperty.hasRestriction = true;
    (this.currentProperty.sourceMap as StringPropertySourceMap).maxLength = sourceMapFrom(context);
    this.currentProperty.sourceMap.hasRestriction = sourceMapFrom(context);
  }

  enterDecimalPlaces(context: MetaEdGrammar.DecimalPlacesContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    (this.currentProperty as DecimalProperty).decimalPlaces = context.UNSIGNED_INT().getText();
    this.currentProperty.hasRestriction = true;
    (this.currentProperty.sourceMap as DecimalPropertySourceMap).decimalPlaces = sourceMapFrom(context);
    this.currentProperty.sourceMap.hasRestriction = sourceMapFrom(context);
  }

  enterTotalDigits(context: MetaEdGrammar.TotalDigitsContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    (this.currentProperty as DecimalProperty).totalDigits = context.UNSIGNED_INT().getText();
    this.currentProperty.hasRestriction = true;
    (this.currentProperty.sourceMap as DecimalPropertySourceMap).totalDigits = sourceMapFrom(context);
    this.currentProperty.sourceMap.hasRestriction = sourceMapFrom(context);
  }

  enterMinValue(context: MetaEdGrammar.MinValueContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (
      context.exception ||
      context.signed_int() == null ||
      context.signed_int().exception ||
      isErrorText(context.signed_int().getText())
    )
      return;
    (this.currentProperty as IntegerProperty | ShortProperty).minValue = context.signed_int().getText();
    (this.currentProperty.sourceMap as IntegerPropertySourceMap | ShortPropertySourceMap).minValue = sourceMapFrom(context);
    this.currentProperty.hasRestriction = true;
    this.currentProperty.sourceMap.hasRestriction = sourceMapFrom(context);
  }

  enterMaxValue(context: MetaEdGrammar.MaxValueContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (
      context.exception ||
      context.signed_int() == null ||
      context.signed_int().exception ||
      isErrorText(context.signed_int().getText())
    )
      return;
    (this.currentProperty as IntegerProperty | ShortProperty).maxValue = context.signed_int().getText();
    (this.currentProperty.sourceMap as IntegerPropertySourceMap | ShortPropertySourceMap).maxValue = sourceMapFrom(context);
    this.currentProperty.hasRestriction = true;
    this.currentProperty.sourceMap.hasRestriction = sourceMapFrom(context);
  }

  enterMinValueDecimal(context: MetaEdGrammar.MinValueDecimalContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (
      context.exception ||
      context.decimalValue() == null ||
      context.decimalValue().exception ||
      isErrorText(context.decimalValue().getText())
    )
      return;
    (this.currentProperty as DecimalProperty).minValue = context.decimalValue().getText();
    this.currentProperty.hasRestriction = true;
    (this.currentProperty.sourceMap as DecimalPropertySourceMap).minValue = sourceMapFrom(context);
    this.currentProperty.sourceMap.hasRestriction = sourceMapFrom(context);
  }

  enterMaxValueDecimal(context: MetaEdGrammar.MaxValueDecimalContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (
      context.exception ||
      context.decimalValue() == null ||
      context.decimalValue().exception ||
      isErrorText(context.decimalValue().getText())
    )
      return;
    (this.currentProperty as DecimalProperty).maxValue = context.decimalValue().getText();
    this.currentProperty.hasRestriction = true;
    (this.currentProperty.sourceMap as DecimalPropertySourceMap).maxValue = sourceMapFrom(context);
    this.currentProperty.sourceMap.hasRestriction = sourceMapFrom(context);
  }

  enterIsWeakReference(context: MetaEdGrammar.IsWeakReferenceContext) {
    if (this.currentProperty === NoEntityProperty) return;
    (this.currentProperty as DomainEntityProperty | AssociationProperty).isWeak = true;
    (this.currentProperty.sourceMap as DomainEntityPropertySourceMap | AssociationPropertySourceMap).isWeak =
      sourceMapFrom(context);
  }

  enterPotentiallyLogical(context: MetaEdGrammar.PotentiallyLogicalContext) {
    if (this.currentProperty === NoEntityProperty) return;
    (this.currentProperty as DomainEntityProperty | AssociationProperty).potentiallyLogical = true;
    (this.currentProperty.sourceMap as DomainEntityPropertySourceMap | AssociationPropertySourceMap).potentiallyLogical =
      sourceMapFrom(context);
  }

  // @ts-ignore
  enterMergeDirective(context: MetaEdGrammar.MergeDirectiveContext) {
    if (this.currentProperty === NoEntityProperty) return;
    if (context.exception) return;
    this.currentMergeDirective = newMergeDirective();
  }

  enterSourcePropertyPath(context: MetaEdGrammar.SourcePropertyPathContext) {
    if (this.currentMergeDirective === NoMergeDirective) return;
    if (context.exception || context.propertyPath() == null || context.propertyPath().exception) return;
    this.currentMergeDirective.sourcePropertyPathStrings = propertyPathFrom(context.propertyPath());
    (this.currentMergeDirective.sourceMap as MergeDirectiveSourceMap).sourcePropertyPathStrings = sourceMapFrom(context);
  }

  enterTargetPropertyPath(context: MetaEdGrammar.TargetPropertyPathContext) {
    if (this.currentMergeDirective === NoMergeDirective) return;
    if (context.exception || context.propertyPath() == null || context.propertyPath().exception) return;
    this.currentMergeDirective.targetPropertyPathStrings = propertyPathFrom(context.propertyPath());
    (this.currentMergeDirective.sourceMap as MergeDirectiveSourceMap).targetPropertyPathStrings = sourceMapFrom(context);
  }

  exitMergeDirective(context: MetaEdGrammar.MergeDirectiveContext) {
    if (this.currentProperty === NoEntityProperty || this.currentMergeDirective === NoMergeDirective) return;
    // TODO: As of METAED-881, the current property here could also be one of the shared simple properties, which
    // are not currently extensions of ReferentialProperty but have an equivalent mergeDirectives field
    (this.currentProperty as ReferentialProperty).mergeDirectives.push(this.currentMergeDirective);
    (this.currentProperty.sourceMap as ReferentialPropertySourceMap).mergeDirectives.push(sourceMapFrom(context));
    this.currentMergeDirective = NoMergeDirective;
  }
}

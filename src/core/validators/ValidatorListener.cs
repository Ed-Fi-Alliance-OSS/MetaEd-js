using System.Collections.Generic;
using System.Linq;
using Antlr4.Runtime;
using Antlr4.Runtime.Tree;
using MetaEd.Common.Extensions;
using MetaEd.Common.Services;
using MetaEd.Core.Tasks;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator
{
    public interface IValidatorListener : IMetaEdGrammarListener
    {
        void WithContext(IMetaEdContext context);
    }

    public class ValidatorListener : IValidatorListener
    {
        private readonly IRuleProvider _ruleProvider;
        private List<ValidationMessage> _errorMessageCollection;
        private IMetaEdFileIndex _metaEdFileIndex;
        private ISymbolTable _symbolTable;
        private List<ValidationMessage> _warningMessageCollection;

        public ValidatorListener(IRuleProvider ruleProvider)
        {
            _ruleProvider = ruleProvider;
        }

        public void WithContext(IMetaEdContext context)
        {
            _metaEdFileIndex = context.MetaEdFileIndex;
            _warningMessageCollection = context.WarningMessageCollection;
            _errorMessageCollection = context.ErrorMessageCollection;
            _symbolTable = context.SymbolTable;
        }

        private void ValidateContext<TContext>(TContext context) where TContext : ParserRuleContext
        {
            var validationRules = _ruleProvider.GetAll<TContext>(_symbolTable);

            validationRules.Where(x => x.Level == ValidationLevel.Error && !x.IsValid(context))
                .Each(y => _errorMessageCollection.Add(BuildValidationMessage(y, context)));

            validationRules.Where(x => x.Level == ValidationLevel.Warning && !x.IsValid(context))
                .Each(y => _warningMessageCollection.Add(BuildValidationMessage(y, context)));
        }

        private ValidationMessage BuildValidationMessage<TContext>(IValidationRule<TContext> rule, TContext context)
            where TContext : ParserRuleContext
        {
            var metaEdFile = _metaEdFileIndex.GetFileAndLineNumber(context.Start.Line);

            return new ValidationMessage
            {
                Message = rule.GetFailureMessage(context),
                CharacterPosition = context.Start.Column,
                ConcatenatedLineNumber = context.Start.Line,
                FileName = metaEdFile.FileName,
                LineNumber = metaEdFile.LineNumber
            };
        }

        #region Enter Methods

        public void EnterAbstractEntity(MetaEdGrammar.AbstractEntityContext context)
        {
            ValidateContext(context);
        }

        public void EnterAbstractEntityName(MetaEdGrammar.AbstractEntityNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterAssociation(MetaEdGrammar.AssociationContext context)
        {
            ValidateContext(context);
        }

        public void EnterAssociationExtension(MetaEdGrammar.AssociationExtensionContext context)
        {
            ValidateContext(context);
        }

        public void EnterAssociationName(MetaEdGrammar.AssociationNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterAssociationSubclass(MetaEdGrammar.AssociationSubclassContext context)
        {
            ValidateContext(context);
        }

        public void EnterBaseKeyName(MetaEdGrammar.BaseKeyNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterBaseName(MetaEdGrammar.BaseNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterBooleanProperty(MetaEdGrammar.BooleanPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterCascadeUpdate(MetaEdGrammar.CascadeUpdateContext context)
        {
            ValidateContext(context);
        }

        public void EnterChoiceName(MetaEdGrammar.ChoiceNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterChoiceType(MetaEdGrammar.ChoiceTypeContext context)
        {
            ValidateContext(context);
        }

        public void EnterCollection(MetaEdGrammar.CollectionContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonDecimalName(MetaEdGrammar.CommonDecimalNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonDecimal(MetaEdGrammar.CommonDecimalContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonIntegerName(MetaEdGrammar.CommonIntegerNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonInteger(MetaEdGrammar.CommonIntegerContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonShortName(MetaEdGrammar.CommonShortNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonShort(MetaEdGrammar.CommonShortContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonStringName(MetaEdGrammar.CommonStringNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonString(MetaEdGrammar.CommonStringContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonName(MetaEdGrammar.CommonNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonType(MetaEdGrammar.CommonTypeContext context)
        {
            ValidateContext(context);
        }

        public void EnterCommonTypeExtension(MetaEdGrammar.CommonTypeExtensionContext context)
        {
            ValidateContext(context);
        }

        public void EnterCurrencyProperty(MetaEdGrammar.CurrencyPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterDateProperty(MetaEdGrammar.DatePropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterDecimalPlaces(MetaEdGrammar.DecimalPlacesContext context)
        {
            ValidateContext(context);
        }

        public void EnterDecimalProperty(MetaEdGrammar.DecimalPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterDecimalValue(MetaEdGrammar.DecimalValueContext context)
        {
            ValidateContext(context);
        }

        public void EnterDescriptor(MetaEdGrammar.DescriptorContext context)
        {
            ValidateContext(context);
        }

        public void EnterDescriptorName(MetaEdGrammar.DescriptorNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterDescriptorProperty(MetaEdGrammar.DescriptorPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterDocumentation(MetaEdGrammar.DocumentationContext context)
        {
            ValidateContext(context);
        }

        public void EnterFooterDocumentation(MetaEdGrammar.FooterDocumentationContext context)
        {
            ValidateContext(context);
        }

        public void EnterExtendedDocumentation(MetaEdGrammar.ExtendedDocumentationContext context)
        {
            ValidateContext(context);
        }

        public void EnterUseCaseDocumentation(MetaEdGrammar.UseCaseDocumentationContext context)
        {
            ValidateContext(context);
        }

        public void EnterDocumentationLine(MetaEdGrammar.DocumentationLineContext context)
        {
            ValidateContext(context);
        }

        public void EnterDomain(MetaEdGrammar.DomainContext context)
        {
            ValidateContext(context);
        }

        public void EnterDomainItem(MetaEdGrammar.DomainItemContext context)
        {
            ValidateContext(context);
        }

        public void EnterDomainName(MetaEdGrammar.DomainNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterDomainEntity(MetaEdGrammar.DomainEntityContext context)
        {
            ValidateContext(context);
        }

        public void EnterDomainEntityExtension(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            ValidateContext(context);
        }

        public void EnterDomainEntitySubclass(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            ValidateContext(context);
        }

        public void EnterDurationProperty(MetaEdGrammar.DurationPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterEntityConfiguration(MetaEdGrammar.EntityConfigurationContext context)
        {
            ValidateContext(context);
        }

        public void EnterEntityName(MetaEdGrammar.EntityNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterEnumeration(MetaEdGrammar.EnumerationContext context)
        {
            ValidateContext(context);
        }

        public void EnterEnumerationName(MetaEdGrammar.EnumerationNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterEnumerationProperty(MetaEdGrammar.EnumerationPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterExtendeeName(MetaEdGrammar.ExtendeeNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterFirstDomainEntity(MetaEdGrammar.FirstDomainEntityContext context)
        {
            ValidateContext(context);
        }

        public void EnterIncludeProperty(MetaEdGrammar.IncludePropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterIncludeExtensionOverride(MetaEdGrammar.IncludeExtensionOverrideContext context)
        {
        }

        public void EnterInlineCommonName(MetaEdGrammar.InlineCommonNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterInlineCommonType(MetaEdGrammar.InlineCommonTypeContext context)
        {
            ValidateContext(context);
        }

        public void EnterSigned_int(MetaEdGrammar.Signed_intContext context)
        {
            ValidateContext(context);
        }

        public void EnterIntegerProperty(MetaEdGrammar.IntegerPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterInterchange(MetaEdGrammar.InterchangeContext context)
        {
            ValidateContext(context);
        }

        public void EnterInterchangeComponent(MetaEdGrammar.InterchangeComponentContext context)
        {
            ValidateContext(context);
        }

        public void EnterInterchangeElement(MetaEdGrammar.InterchangeElementContext context)
        {
            ValidateContext(context);
        }

        public void EnterInterchangeExtension(MetaEdGrammar.InterchangeExtensionContext context)
        {
            ValidateContext(context);
        }

        public void EnterInterchangeExtensionComponent(MetaEdGrammar.InterchangeExtensionComponentContext context)
        {
            ValidateContext(context);
        }

        public void EnterInterchangeIdentityTemplate(MetaEdGrammar.InterchangeIdentityTemplateContext context)
        {
            ValidateContext(context);
        }

        public void EnterInterchangeName(MetaEdGrammar.InterchangeNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterEnumerationItem(MetaEdGrammar.EnumerationItemContext context)
        {
            ValidateContext(context);
        }

        public void EnterMaxLength(MetaEdGrammar.MaxLengthContext context)
        {
            ValidateContext(context);
        }

        public void EnterMaxValue(MetaEdGrammar.MaxValueContext context)
        {
            ValidateContext(context);
        }

        public void EnterMaxValueDecimal(MetaEdGrammar.MaxValueDecimalContext context)
        {
            ValidateContext(context);
        }

        public void EnterIsWeakReference(MetaEdGrammar.IsWeakReferenceContext context)
        {
            ValidateContext(context);
        }

        public void EnterMergePartOfReference(MetaEdGrammar.MergePartOfReferenceContext context)
        {
            ValidateContext(context);
        }

        public void EnterMergePropertyPath(MetaEdGrammar.MergePropertyPathContext context)
        {
            ValidateContext(context);
        }

        public void EnterMetaEd(MetaEdGrammar.MetaEdContext context)
        {
            ValidateContext(context);
        }

        public void EnterMinLength(MetaEdGrammar.MinLengthContext context)
        {
            ValidateContext(context);
        }

        public void EnterMinValue(MetaEdGrammar.MinValueContext context)
        {
            ValidateContext(context);
        }

        public void EnterMinValueDecimal(MetaEdGrammar.MinValueDecimalContext context)
        {
            ValidateContext(context);
        }

        public void EnterNamespace(MetaEdGrammar.NamespaceContext context)
        {
            ValidateContext(context);
        }

        public void EnterNamespaceName(MetaEdGrammar.NamespaceNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterNamespaceType(MetaEdGrammar.NamespaceTypeContext context)
        {
            ValidateContext(context);
        }

        public void EnterNamespaceProjectExtension(MetaEdGrammar.NamespaceProjectExtensionContext context)
        {
            ValidateContext(context);
        }

        public void EnterOptional(MetaEdGrammar.OptionalContext context)
        {
            ValidateContext(context);
        }

        public void EnterOptionalCollection(MetaEdGrammar.OptionalCollectionContext context)
        {
            ValidateContext(context);
        }

        public void EnterOptionalMapType(MetaEdGrammar.OptionalMapTypeContext context)
        {
            ValidateContext(context);
        }

        public void EnterPercentProperty(MetaEdGrammar.PercentPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterIdentity(MetaEdGrammar.IdentityContext context)
        {
            ValidateContext(context);
        }

        public void EnterIdentityRename(MetaEdGrammar.IdentityRenameContext context)
        {
            ValidateContext(context);
        }

        public void EnterMetaEdId(MetaEdGrammar.MetaEdIdContext context)
        {
            ValidateContext(context);
        }

        public void EnterProperty(MetaEdGrammar.PropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterPropertyAnnotation(MetaEdGrammar.PropertyAnnotationContext context)
        {
            ValidateContext(context);
        }

        public void EnterPropertyComponents(MetaEdGrammar.PropertyComponentsContext context)
        {
            ValidateContext(context);
        }

        public void EnterPropertyName(MetaEdGrammar.PropertyNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterPropertyPath(MetaEdGrammar.PropertyPathContext context)
        {
            ValidateContext(context);
        }

        public void EnterReferenceProperty(MetaEdGrammar.ReferencePropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterRequired(MetaEdGrammar.RequiredContext context)
        {
            ValidateContext(context);
        }

        public void EnterRequiredCollection(MetaEdGrammar.RequiredCollectionContext context)
        {
            ValidateContext(context);
        }

        public void EnterRequiredMapType(MetaEdGrammar.RequiredMapTypeContext context)
        {
            ValidateContext(context);
        }

        public void EnterSecondDomainEntity(MetaEdGrammar.SecondDomainEntityContext context)
        {
            ValidateContext(context);
        }

        public void EnterShortDescription(MetaEdGrammar.ShortDescriptionContext context)
        {
            ValidateContext(context);
        }

        public void EnterSharedDecimalProperty(MetaEdGrammar.SharedDecimalPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterSharedIntegerProperty(MetaEdGrammar.SharedIntegerPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterSharedShortProperty(MetaEdGrammar.SharedShortPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterSharedStringProperty(MetaEdGrammar.SharedStringPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterSharedPropertyType(MetaEdGrammar.SharedPropertyTypeContext context)
        {
            ValidateContext(context);
        }

        public void EnterShortenToName(MetaEdGrammar.ShortenToNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterShortProperty(MetaEdGrammar.ShortPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterStringProperty(MetaEdGrammar.StringPropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterSubdomain(MetaEdGrammar.SubdomainContext context)
        {
            ValidateContext(context);
        }

        public void EnterParentDomainName(MetaEdGrammar.ParentDomainNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterSubdomainName(MetaEdGrammar.SubdomainNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterSubdomainPosition(MetaEdGrammar.SubdomainPositionContext context)
        {
            ValidateContext(context);
        }

        public void EnterTargetPropertyPath(MetaEdGrammar.TargetPropertyPathContext context)
        {
            ValidateContext(context);
        }

        public void EnterTimeProperty(MetaEdGrammar.TimePropertyContext context)
        {
            ValidateContext(context);
        }

        public void EnterTopLevelEntity(MetaEdGrammar.TopLevelEntityContext context)
        {
            ValidateContext(context);
        }

        public void EnterTotalDigits(MetaEdGrammar.TotalDigitsContext context)
        {
            ValidateContext(context);
        }

        public void EnterUnaryOperator(MetaEdGrammar.UnaryOperatorContext context)
        {
            ValidateContext(context);
        }

        public void EnterIsQueryableField(MetaEdGrammar.IsQueryableFieldContext context)
        {
            ValidateContext(context);
        }

        public void EnterIsQueryableOnly(MetaEdGrammar.IsQueryableOnlyContext context)
        {
            ValidateContext(context);
        }

        public void EnterWithContext(MetaEdGrammar.WithContextContext context)
        {
            ValidateContext(context);
        }

        public void EnterWithContextName(MetaEdGrammar.WithContextNameContext context)
        {
            ValidateContext(context);
        }

        public void EnterWithMapType(MetaEdGrammar.WithMapTypeContext context)
        {
            ValidateContext(context);
        }

        public void EnterYearProperty(MetaEdGrammar.YearPropertyContext context)
        {
            ValidateContext(context);
        }

        #endregion

        #region Exit Methods

        public void ExitAbstractEntity(MetaEdGrammar.AbstractEntityContext context)
        {
        }

        public void ExitAbstractEntityName(MetaEdGrammar.AbstractEntityNameContext context)
        {
        }

        public void ExitAssociation(MetaEdGrammar.AssociationContext context)
        {
        }

        public void ExitAssociationExtension(MetaEdGrammar.AssociationExtensionContext context)
        {
        }

        public void ExitAssociationName(MetaEdGrammar.AssociationNameContext context)
        {
        }

        public void ExitAssociationSubclass(MetaEdGrammar.AssociationSubclassContext context)
        {
        }

        public void ExitBaseKeyName(MetaEdGrammar.BaseKeyNameContext context)
        {
        }

        public void ExitBaseName(MetaEdGrammar.BaseNameContext context)
        {
        }

        public void ExitBooleanProperty(MetaEdGrammar.BooleanPropertyContext context)
        {
        }

        public void ExitCascadeUpdate(MetaEdGrammar.CascadeUpdateContext context)
        {
        }

        public void ExitChoiceName(MetaEdGrammar.ChoiceNameContext context)
        {
        }

        public void ExitChoiceType(MetaEdGrammar.ChoiceTypeContext context)
        {
        }

        public void ExitCollection(MetaEdGrammar.CollectionContext context)
        {
        }

        public void ExitCommonDecimalName(MetaEdGrammar.CommonDecimalNameContext context)
        {
        }

        public void ExitCommonDecimal(MetaEdGrammar.CommonDecimalContext context)
        {
        }

        public void ExitCommonIntegerName(MetaEdGrammar.CommonIntegerNameContext context)
        {
        }

        public void ExitCommonInteger(MetaEdGrammar.CommonIntegerContext context)
        {
        }

        public void ExitCommonShortName(MetaEdGrammar.CommonShortNameContext context)
        {
        }

        public void ExitCommonShort(MetaEdGrammar.CommonShortContext context)
        {
        }

        public void ExitCommonStringName(MetaEdGrammar.CommonStringNameContext context)
        {
        }

        public void ExitCommonString(MetaEdGrammar.CommonStringContext context)
        {
        }

        public void ExitCommonName(MetaEdGrammar.CommonNameContext context)
        {
        }

        public void ExitCommonType(MetaEdGrammar.CommonTypeContext context)
        {
        }

        public void ExitCommonTypeExtension(MetaEdGrammar.CommonTypeExtensionContext context)
        {
        }

        public void ExitCurrencyProperty(MetaEdGrammar.CurrencyPropertyContext context)
        {
        }

        public void ExitDateProperty(MetaEdGrammar.DatePropertyContext context)
        {
        }

        public void ExitDecimalPlaces(MetaEdGrammar.DecimalPlacesContext context)
        {
        }

        public void ExitDecimalProperty(MetaEdGrammar.DecimalPropertyContext context)
        {
        }

        public void ExitDecimalValue(MetaEdGrammar.DecimalValueContext context)
        {
        }

        public void ExitDescriptor(MetaEdGrammar.DescriptorContext context)
        {
        }

        public void ExitDescriptorName(MetaEdGrammar.DescriptorNameContext context)
        {
        }

        public void ExitDescriptorProperty(MetaEdGrammar.DescriptorPropertyContext context)
        {
        }

        public void ExitDocumentation(MetaEdGrammar.DocumentationContext context)
        {
        }

        public void ExitFooterDocumentation(MetaEdGrammar.FooterDocumentationContext context)
        {
        }

                public void ExitExtendedDocumentation(MetaEdGrammar.ExtendedDocumentationContext context)
        {
        }

        public void ExitUseCaseDocumentation(MetaEdGrammar.UseCaseDocumentationContext context)
        {
        }

        public void ExitDocumentationLine(MetaEdGrammar.DocumentationLineContext context)
        {
        }

        public void ExitDomain(MetaEdGrammar.DomainContext context)
        {
        }

        public void ExitDomainItem(MetaEdGrammar.DomainItemContext context)
        {
        }

        public void ExitDomainName(MetaEdGrammar.DomainNameContext context)
        {
        }

        public void ExitDomainEntity(MetaEdGrammar.DomainEntityContext context)
        {
        }

        public void ExitDomainEntityExtension(MetaEdGrammar.DomainEntityExtensionContext context)
        {
        }

        public void ExitDomainEntitySubclass(MetaEdGrammar.DomainEntitySubclassContext context)
        {
        }

        public void ExitDurationProperty(MetaEdGrammar.DurationPropertyContext context)
        {
        }

        public void ExitEntityConfiguration(MetaEdGrammar.EntityConfigurationContext context)
        {
        }

        public void ExitEntityName(MetaEdGrammar.EntityNameContext context)
        {
        }

        public void ExitEnumeration(MetaEdGrammar.EnumerationContext context)
        {
        }

        public void ExitEnumerationName(MetaEdGrammar.EnumerationNameContext context)
        {
        }

        public void ExitEnumerationProperty(MetaEdGrammar.EnumerationPropertyContext context)
        {
        }

        public void ExitExtendeeName(MetaEdGrammar.ExtendeeNameContext context)
        {
        }

        public void ExitFirstDomainEntity(MetaEdGrammar.FirstDomainEntityContext context)
        {
        }

        public void ExitIncludeProperty(MetaEdGrammar.IncludePropertyContext context)
        {
        }

        public void ExitIncludeExtensionOverride(MetaEdGrammar.IncludeExtensionOverrideContext context)
        {
        }

        public void ExitInlineCommonName(MetaEdGrammar.InlineCommonNameContext context)
        {
        }

        public void ExitInlineCommonType(MetaEdGrammar.InlineCommonTypeContext context)
        {
        }

        public void ExitSigned_int(MetaEdGrammar.Signed_intContext context)
        {
        }

        public void ExitIntegerProperty(MetaEdGrammar.IntegerPropertyContext context)
        {
        }

        public void ExitInterchange(MetaEdGrammar.InterchangeContext context)
        {
        }

        public void ExitInterchangeComponent(MetaEdGrammar.InterchangeComponentContext context)
        {
        }

        public void ExitInterchangeElement(MetaEdGrammar.InterchangeElementContext context)
        {
        }

        public void ExitInterchangeExtension(MetaEdGrammar.InterchangeExtensionContext context)
        {
        }

        public void ExitInterchangeExtensionComponent(MetaEdGrammar.InterchangeExtensionComponentContext context)
        {
        }

        public void ExitInterchangeIdentityTemplate(MetaEdGrammar.InterchangeIdentityTemplateContext context)
        {
        }

        public void ExitInterchangeName(MetaEdGrammar.InterchangeNameContext context)
        {
        }

        public void ExitEnumerationItem(MetaEdGrammar.EnumerationItemContext context)
        {
        }

        public void ExitMaxLength(MetaEdGrammar.MaxLengthContext context)
        {
        }

        public void ExitMaxValue(MetaEdGrammar.MaxValueContext context)
        {
        }

        public void ExitMaxValueDecimal(MetaEdGrammar.MaxValueDecimalContext context)
        {
        }

        public void ExitIsWeakReference(MetaEdGrammar.IsWeakReferenceContext context)
        {
        }

        public void ExitMergePartOfReference(MetaEdGrammar.MergePartOfReferenceContext context)
        {
        }

        public void ExitMergePropertyPath(MetaEdGrammar.MergePropertyPathContext context)
        {
        }

        public void ExitMetaEd(MetaEdGrammar.MetaEdContext context)
        {
        }

        public void ExitMinLength(MetaEdGrammar.MinLengthContext context)
        {
        }

        public void ExitMinValue(MetaEdGrammar.MinValueContext context)
        {
        }

        public void ExitMinValueDecimal(MetaEdGrammar.MinValueDecimalContext context)
        {
        }

        public void ExitNamespace(MetaEdGrammar.NamespaceContext context)
        {
        }

        public void ExitNamespaceName(MetaEdGrammar.NamespaceNameContext context)
        {
        }

        public void ExitNamespaceType(MetaEdGrammar.NamespaceTypeContext context)
        {
        }

        public void ExitNamespaceProjectExtension(MetaEdGrammar.NamespaceProjectExtensionContext context)
        {
        }

        public void ExitOptional(MetaEdGrammar.OptionalContext context)
        {
        }

        public void ExitOptionalCollection(MetaEdGrammar.OptionalCollectionContext context)
        {
        }

        public void ExitOptionalMapType(MetaEdGrammar.OptionalMapTypeContext context)
        {
        }

        public void ExitPercentProperty(MetaEdGrammar.PercentPropertyContext context)
        {
        }

        public void ExitIdentity(MetaEdGrammar.IdentityContext context)
        {
        }

        public void ExitIdentityRename(MetaEdGrammar.IdentityRenameContext context)
        {
        }

        public void ExitMetaEdId(MetaEdGrammar.MetaEdIdContext context)
        {
        }

        public void ExitProperty(MetaEdGrammar.PropertyContext context)
        {
        }

        public void ExitPropertyAnnotation(MetaEdGrammar.PropertyAnnotationContext context)
        {
        }

        public void ExitPropertyComponents(MetaEdGrammar.PropertyComponentsContext context)
        {
        }

        public void ExitPropertyName(MetaEdGrammar.PropertyNameContext context)
        {
        }

        public void ExitPropertyPath(MetaEdGrammar.PropertyPathContext context)
        {
        }

        public void ExitReferenceProperty(MetaEdGrammar.ReferencePropertyContext context)
        {
        }

        public void ExitRequired(MetaEdGrammar.RequiredContext context)
        {
        }

        public void ExitRequiredCollection(MetaEdGrammar.RequiredCollectionContext context)
        {
        }

        public void ExitRequiredMapType(MetaEdGrammar.RequiredMapTypeContext context)
        {
        }

        public void ExitSecondDomainEntity(MetaEdGrammar.SecondDomainEntityContext context)
        {
        }

        public void ExitSharedDecimalProperty(MetaEdGrammar.SharedDecimalPropertyContext context)
        {
        }

        public void ExitSharedIntegerProperty(MetaEdGrammar.SharedIntegerPropertyContext context)
        {
        }

        public void ExitSharedShortProperty(MetaEdGrammar.SharedShortPropertyContext context)
        {
        }

        public void ExitSharedStringProperty(MetaEdGrammar.SharedStringPropertyContext context)
        {
        }

        public void ExitSharedPropertyType(MetaEdGrammar.SharedPropertyTypeContext context)
        {
        }

        public void ExitShortDescription(MetaEdGrammar.ShortDescriptionContext context)
        {
        }

        public void ExitShortenToName(MetaEdGrammar.ShortenToNameContext context)
        {
        }

        public void ExitShortProperty(MetaEdGrammar.ShortPropertyContext context)
        {
        }

        public void ExitStringProperty(MetaEdGrammar.StringPropertyContext context)
        {
        }

        public void ExitSubdomain(MetaEdGrammar.SubdomainContext context)
        {
        }

        public void ExitParentDomainName(MetaEdGrammar.ParentDomainNameContext context)
        {
        }

        public void ExitSubdomainName(MetaEdGrammar.SubdomainNameContext context)
        {
        }

        public void ExitSubdomainPosition(MetaEdGrammar.SubdomainPositionContext context)
        {
        }

        public void ExitTargetPropertyPath(MetaEdGrammar.TargetPropertyPathContext context)
        {
        }

        public void ExitTimeProperty(MetaEdGrammar.TimePropertyContext context)
        {
        }

        public void ExitTopLevelEntity(MetaEdGrammar.TopLevelEntityContext context)
        {
        }

        public void ExitTotalDigits(MetaEdGrammar.TotalDigitsContext context)
        {
        }

        public void ExitUnaryOperator(MetaEdGrammar.UnaryOperatorContext context)
        {
        }

        public void ExitIsQueryableField(MetaEdGrammar.IsQueryableFieldContext context)
        {
        }

        public void ExitIsQueryableOnly(MetaEdGrammar.IsQueryableOnlyContext context)
        {
        }

        public void ExitWithContext(MetaEdGrammar.WithContextContext context)
        {
        }

        public void ExitWithContextName(MetaEdGrammar.WithContextNameContext context)
        {
        }

        public void ExitWithMapType(MetaEdGrammar.WithMapTypeContext context)
        {
        }

        public void ExitYearProperty(MetaEdGrammar.YearPropertyContext context)
        {
        }

        #endregion

        public void EnterEveryRule(ParserRuleContext ctx)
        {
        }

        public void ExitEveryRule(ParserRuleContext ctx)
        {
        }

        public void VisitErrorNode(IErrorNode node)
        {
        }

        public void VisitTerminal(ITerminalNode node)
        {
        }
    }
}
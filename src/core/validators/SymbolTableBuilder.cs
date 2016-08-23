using System.Collections.Generic;
using Antlr4.Runtime;
using Antlr4.Runtime.Tree;
using MetaEd.Common.Services;
using MetaEd.Core.Tasks;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator
{
    public interface ISymbolTableBuilder : IMetaEdGrammarListener
    {
        void WithContext(IMetaEdContext context);
    }

    public class SymbolTableBuilder : MetaEdGrammarBaseListener, ISymbolTableBuilder
    {
        private ISymbolTable _symbolTable;
        private IMetaEdFileIndex _metaEdFileIndex;
        private List<ValidationMessage> _errorMessageCollection;
        private readonly ISymbolTableBuilderListener _builderListener;
        private PropertySymbolTable _currentPropertySymbolTable;
        
        public SymbolTableBuilder(ISymbolTableBuilderListener builderListener)
        {
            _builderListener = builderListener;
        }

        public void WithContext(IMetaEdContext context)
        {
            _metaEdFileIndex = context.MetaEdFileIndex;
            _errorMessageCollection = context.ErrorMessageCollection;
            _symbolTable = context.SymbolTable;
            _builderListener.WithContext(context);
        }

        private void AddEntity(string entityType, ITerminalNode entityName, ParserRuleContext context)
        {
            if (!_builderListener.BeforeAddEntity(entityType, entityName, context)) return;

            if (_symbolTable.TryAdd(entityType, entityName.GetText(), context))
            {
                _currentPropertySymbolTable = _symbolTable.Get(entityType, entityName.GetText()).PropertySymbolTable;
                return;
            }

            var metaEdFile = _metaEdFileIndex.GetFileAndLineNumber(entityName.Symbol.Line);

            var failure = new ValidationMessage
                              {
                                      Message = string.Format("Duplicate {0} named {1}", entityType, entityName),
                                      CharacterPosition = entityName.Symbol.Column,
                                      ConcatenatedLineNumber = entityName.Symbol.Line,
                                      FileName = metaEdFile.FileName,
                                      LineNumber = metaEdFile.LineNumber
                              };
            _errorMessageCollection.Add(failure);
        }

        private void AddProperty(IPropertyWithComponents context)
        {
            var propertyName = context.IdNode();
            //check for a 'with context'
            var withContextContext = context.propertyComponents().withContext();
            var withContextPrefix = withContextContext == null ? string.Empty : withContextContext.withContextName().ID().GetText();

            if (_currentPropertySymbolTable == null)
            {
                // no current property symbol table means something went wrong elsewhere
                // validation failure should already have been created
                // TODO: log message?
                return;
            }

            if (_currentPropertySymbolTable.TryAdd(withContextPrefix + propertyName.GetText(), context))
                return;

            var metaEdFile = _metaEdFileIndex.GetFileAndLineNumber(propertyName.Symbol.Line);

            var duplicateFailure = new ValidationMessage
                                {
                                    Message = string.Format("Entity {0} has duplicate properties named {1}", _currentPropertySymbolTable.Parent.Name, propertyName.GetText()),
                                    CharacterPosition = propertyName.Symbol.Column,
                                    ConcatenatedLineNumber = propertyName.Symbol.Line,
                                    FileName = metaEdFile.FileName,
                                    LineNumber = metaEdFile.LineNumber
                                };
            _errorMessageCollection.Add(duplicateFailure);
        }

        public override void EnterDomainEntity(MetaEdGrammar.DomainEntityContext context)
        {
            AddEntity(SymbolTableEntityType.DomainEntityEntityType(), context.entityName().ID(), context);
        }

        public override void ExitDomainEntity(MetaEdGrammar.DomainEntityContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterAbstractEntity(MetaEdGrammar.AbstractEntityContext context)
        {
            AddEntity(SymbolTableEntityType.AbstractEntityEntityType(), context.abstractEntityName().ID(), context);
        }

        public override void ExitAbstractEntity(MetaEdGrammar.AbstractEntityContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterAssociation(MetaEdGrammar.AssociationContext context)
        {
            AddEntity(SymbolTableEntityType.AssociationEntityType(), context.associationName().ID(), context);
        }

        public override void ExitAssociation(MetaEdGrammar.AssociationContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterAssociationExtension(MetaEdGrammar.AssociationExtensionContext context)
        {
            AddEntity(SymbolTableEntityType.AssociationExtensionEntityType(), context.extendeeName().ID(), context);
        }

        public override void ExitAssociationExtension(MetaEdGrammar.AssociationExtensionContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterAssociationSubclass(MetaEdGrammar.AssociationSubclassContext context)
        {
            AddEntity(SymbolTableEntityType.AssociationSubclassEntityType(), context.associationName().ID(), context);
        }

        public override void ExitAssociationSubclass(MetaEdGrammar.AssociationSubclassContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterChoiceType(MetaEdGrammar.ChoiceTypeContext context)
        {
            AddEntity(context.CHOICE_TYPE().GetText(), context.choiceName().ID(), context);
        }

        public override void ExitChoiceType(MetaEdGrammar.ChoiceTypeContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterCommonDecimal(MetaEdGrammar.CommonDecimalContext context)
        {
            AddEntity(context.COMMON_DECIMAL().GetText(), context.commonDecimalName().ID(), context);
        }

        public override void ExitCommonDecimal(MetaEdGrammar.CommonDecimalContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterCommonInteger(MetaEdGrammar.CommonIntegerContext context)
        {
            AddEntity(context.COMMON_INTEGER().GetText(), context.commonIntegerName().ID(), context);
        }

        public override void ExitCommonInteger(MetaEdGrammar.CommonIntegerContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterCommonShort(MetaEdGrammar.CommonShortContext context)
        {
            AddEntity(context.COMMON_SHORT().GetText(), context.commonShortName().ID(), context);
        }

        public override void ExitCommonShort(MetaEdGrammar.CommonShortContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterCommonString(MetaEdGrammar.CommonStringContext context)
        {
            AddEntity(context.COMMON_STRING().GetText(), context.commonStringName().ID(), context);
        }

        public override void ExitCommonString(MetaEdGrammar.CommonStringContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterCommonType(MetaEdGrammar.CommonTypeContext context)
        {
            AddEntity(SymbolTableEntityType.CommonTypeEntityType(), context.commonName().ID(), context);
        }

        public override void ExitCommonType(MetaEdGrammar.CommonTypeContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterCommonTypeExtension(MetaEdGrammar.CommonTypeExtensionContext context)
        {
            AddEntity(SymbolTableEntityType.CommonTypeExtensionEntityType(), context.extendeeName().ID(), context);
        }

        public override void ExitCommonTypeExtension(MetaEdGrammar.CommonTypeExtensionContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterDescriptor(MetaEdGrammar.DescriptorContext context)
        {
            AddEntity(context.DESCRIPTOR_ENTITY().GetText(), context.descriptorName().ID(), context);
        }

        public override void ExitDescriptor(MetaEdGrammar.DescriptorContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterDomain(MetaEdGrammar.DomainContext context)
        {
            AddEntity(context.DOMAIN().GetText(), context.domainName().ID(), context);
        }

        public override void ExitDomain(MetaEdGrammar.DomainContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterDomainEntityExtension(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            AddEntity(SymbolTableEntityType.DomainEntityExtensionEntityType(), context.extendeeName().ID(), context);
        }

        public override void ExitDomainEntityExtension(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterDomainEntitySubclass(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            AddEntity(SymbolTableEntityType.DomainEntitySubclassEntityType(), context.entityName().ID(), context);
        }

        public override void ExitDomainEntitySubclass(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterEnumeration(MetaEdGrammar.EnumerationContext context)
        {
            AddEntity(SymbolTableEntityType.EnumerationEntityType(), context.enumerationName().ID(), context);
        }

        public override void ExitEnumeration(MetaEdGrammar.EnumerationContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterInlineCommonType(MetaEdGrammar.InlineCommonTypeContext context)
        {
            AddEntity(SymbolTableEntityType.InlineCommonTypeEntityType(), context.inlineCommonName().ID(), context);
        }

        public override void ExitInlineCommonType(MetaEdGrammar.InlineCommonTypeContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterInterchange(MetaEdGrammar.InterchangeContext context)
        {
            AddEntity(context.INTERCHANGE().GetText(), context.interchangeName().ID(), context);
        }

        public override void ExitInterchange(MetaEdGrammar.InterchangeContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterInterchangeExtension(MetaEdGrammar.InterchangeExtensionContext context)
        {
            AddEntity(context.INTERCHANGE().GetText() + context.ADDITIONS().GetText(), context.extendeeName().ID(), context);
        }

        public override void ExitInterchangeExtension(MetaEdGrammar.InterchangeExtensionContext context)
        {
            _currentPropertySymbolTable = null;
        }

        public override void EnterSubdomain(MetaEdGrammar.SubdomainContext context)
        {
            AddEntity(context.SUBDOMAIN().GetText(), context.subdomainName().ID(), context);
        }

        public override void ExitSubdomain(MetaEdGrammar.SubdomainContext context)
        {
            _currentPropertySymbolTable = null;
        }


        /****** Properties ******/

        public override void EnterBooleanProperty(MetaEdGrammar.BooleanPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterDateProperty(MetaEdGrammar.DatePropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterCurrencyProperty(MetaEdGrammar.CurrencyPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterDecimalProperty(MetaEdGrammar.DecimalPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterDescriptorProperty(MetaEdGrammar.DescriptorPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterDurationProperty(MetaEdGrammar.DurationPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterEnumerationProperty(MetaEdGrammar.EnumerationPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterIncludeProperty(MetaEdGrammar.IncludePropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterIntegerProperty(MetaEdGrammar.IntegerPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterReferenceProperty(MetaEdGrammar.ReferencePropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterSharedDecimalProperty(MetaEdGrammar.SharedDecimalPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterSharedIntegerProperty(MetaEdGrammar.SharedIntegerPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterSharedShortProperty(MetaEdGrammar.SharedShortPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterSharedStringProperty(MetaEdGrammar.SharedStringPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterShortProperty(MetaEdGrammar.ShortPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterStringProperty(MetaEdGrammar.StringPropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterTimeProperty(MetaEdGrammar.TimePropertyContext context)
        {
            AddProperty(context);
        }

        public override void EnterYearProperty(MetaEdGrammar.YearPropertyContext context)
        {
            AddProperty(context);
        }
    }
}

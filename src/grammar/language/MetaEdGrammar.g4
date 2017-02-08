parser grammar MetaEdGrammar;
options { tokenVocab=BaseLexer; }

// MetaEd

metaEd : namespace+;

// Namespace

namespace
    : BEGIN_NAMESPACE namespaceName namespaceType
      topLevelEntity+
      END_NAMESPACE
    ;

namespaceType : CORE | ID;

topLevelEntity
    : abstractEntity
    | association
    | associationExtension
    | associationSubclass
    | choiceType
    | commonDecimal
    | commonInteger
    | commonShort
    | commonString
    | commonType
    | commonTypeExtension
    | descriptor
    | domainEntity
    | domainEntityExtension
    | domainEntitySubclass
    | enumeration
    | inlineCommonType
    | interchange
    | interchangeExtension
    | domain
    | subdomain
    ;

// Documentation

documentation
    : DOCUMENTATION TEXT
    ;

enumerationItemDocumentation
    : DOCUMENTATION TEXT
    ;

mapTypeDocumentation
    : DOCUMENTATION TEXT
    ;

propertyDocumentation
    : DOCUMENTATION (TEXT | INHERITED)
    ;

// Abstract Entity

abstractEntity
    : ABSTRACT_ENTITY abstractEntityName metaEdId?
      documentation
      property+
    ;

// EntityConfiguration

entityConfiguration
    : cascadeUpdate
    ;

cascadeUpdate
    : CASCADE_UPDATE
    ;

// Association

association
    : ASSOCIATION associationName metaEdId?
      documentation
      entityConfiguration?
      firstDomainEntity
      secondDomainEntity
      property*
    ;

firstDomainEntity
    :  ASSOCIATION_DOMAIN_ENTITY propertyName metaEdId?
       propertyDocumentation
       withContext?
    ;

secondDomainEntity
    :  ASSOCIATION_DOMAIN_ENTITY propertyName metaEdId?
       propertyDocumentation
       withContext?
    ;

// AssociationExtension

associationExtension
     : ASSOCIATION extendeeName ADDITIONS metaEdId?
       property+
    ;

// AssociationSubclass

associationSubclass
    : ASSOCIATION associationName BASED_ON baseName metaEdId?
      documentation
      property+
   ;

// ChoiceType

choiceType
     : CHOICE_TYPE choiceName metaEdId?
      documentation
      property+
    ;

// CommonDecimal

commonDecimal
     : COMMON_DECIMAL commonDecimalName metaEdId?
      documentation
      totalDigits
      decimalPlaces
      minValueDecimal?
      maxValueDecimal?
    ;


// CommonInteger

commonInteger
     : COMMON_INTEGER commonIntegerName metaEdId?
      documentation
      minValue?
      maxValue?
    ;

// CommonShort

commonShort
     : COMMON_SHORT commonShortName metaEdId?
      documentation
      minValue?
      maxValue?
    ;

// CommonString

commonString
     : COMMON_STRING commonStringName metaEdId?
      documentation
      minLength?
      maxLength
    ;

// CommonType

commonType
    : COMMON_TYPE commonName metaEdId?
      documentation
      property+
    ;

// CommonTypeExtension

commonTypeExtension
    : COMMON_TYPE extendeeName ADDITIONS metaEdId?
      property+
    ;

// Descriptor

descriptor
    : DESCRIPTOR_ENTITY descriptorName metaEdId?
      documentation
      property*
      withMapType?
    ;

withMapType
    : (requiredMapType | optionalMapType)
      mapTypeDocumentation
      enumerationItem+
    ;

requiredMapType : WITH_MAP_TYPE ;

optionalMapType : WITH_OPTIONAL_MAP_TYPE ;

// Domain

domain
     : DOMAIN domainName metaEdId?
      documentation
      domainItem+
      footerDocumentation?
    ;

domainItem
    : DOMAIN_ITEM ID metaEdId?
    ;

footerDocumentation
    : FOOTER_DOCUMENTATION TEXT
    ;

//  DomainEntity

domainEntity
    : DOMAIN_ENTITY entityName metaEdId?
     documentation
     entityConfiguration?
     property+
   ;

domainEntityExtension
     : DOMAIN_ENTITY extendeeName ADDITIONS metaEdId?
       property+
    ;

domainEntitySubclass
     : DOMAIN_ENTITY entityName BASED_ON baseName metaEdId?
       documentation
       property+
    ;

// Enumeration

enumeration
	: ENUMERATION_ENTITY enumerationName metaEdId?
	  documentation
	  enumerationItem+
	;

enumerationItem
    : ENUMERATION_ITEM shortDescription metaEdId?
      enumerationItemDocumentation?
      ;

shortDescription : TEXT ;

// InlineCommonType
inlineCommonType
     : INLINE_COMMON_TYPE inlineCommonName metaEdId?
      documentation
      property+
    ;

// Interchange

interchange
    : INTERCHANGE interchangeName metaEdId?
      documentation
      extendedDocumentation?
      useCaseDocumentation?
      interchangeComponent
      ;

extendedDocumentation
    : EXTENDED_DOCUMENTATION TEXT
    ;

useCaseDocumentation
    : USE_CASE_DOCUMENTATION TEXT
    ;

interchangeComponent
    : interchangeIdentityTemplate* interchangeElement (interchangeElement | interchangeIdentityTemplate)*
    ;

interchangeElement
    : ELEMENT ID metaEdId?
    ;

interchangeIdentityTemplate
    : IDENTITY_TEMPLATE ID metaEdId?
    ;

interchangeExtension
	: INTERCHANGE extendeeName ADDITIONS metaEdId?
	  interchangeExtensionComponent
	  ;

interchangeExtensionComponent
	: (interchangeElement | interchangeIdentityTemplate)+
	;

// Subdomain

subdomain
     : SUBDOMAIN subdomainName SUBDOMAIN_OF parentDomainName metaEdId?
      documentation
      domainItem+
      (SUBDOMAIN_POSITION subdomainPosition)?
    ;

subdomainPosition
    : UNSIGNED_INT
    ;

// Property

minValue : MIN_VALUE signed_int ;

maxValue : MAX_VALUE signed_int ;

minValueDecimal : MIN_VALUE decimalValue ;

maxValueDecimal : MAX_VALUE decimalValue ;

decimalValue : DECIMAL_VALUE | signed_int ;

totalDigits : TOTAL_DIGITS UNSIGNED_INT ;

decimalPlaces : DECIMAL_PLACES UNSIGNED_INT ;

includeExtensionOverride : INCLUDE_EXTENSION;

propertyAnnotation : (identity | identityRename | required | optional | collection | isQueryableOnly) ;

identity : IDENTITY ;

identityRename : IDENTITY_RENAME baseKeyName ;

required : REQUIRED ;

optional : OPTIONAL ;

collection : (requiredCollection | optionalCollection) ;

requiredCollection : REQUIRED_COLLECTION ;

optionalCollection : OPTIONAL_COLLECTION ;

isQueryableOnly : IS_QUERYABLE_ONLY ;

propertyComponents
    : propertyDocumentation
      propertyAnnotation
      withContext?
      isQueryableField?
    ;

isQueryableField : IS_QUERYABLE_FIELD;

withContext
    : WITH_CONTEXT withContextName (SHORTEN_TO shortenToName)?
    ;

minLength : MIN_LENGTH UNSIGNED_INT;

maxLength : MAX_LENGTH UNSIGNED_INT;

property
    : booleanProperty
    | currencyProperty
    | dateProperty
    | decimalProperty
    | descriptorProperty
    | durationProperty
    | enumerationProperty
    | includeProperty
    | integerProperty
    | percentProperty
    | referenceProperty
    | sharedDecimalProperty
    | sharedIntegerProperty
    | sharedShortProperty
    | sharedStringProperty
    | shortProperty
    | stringProperty
    | timeProperty
    | yearProperty
    ;

booleanProperty : BOOLEAN propertyName metaEdId? propertyComponents;

currencyProperty : CURRENCY propertyName metaEdId? propertyComponents;

dateProperty : DATE propertyName metaEdId? propertyComponents;

decimalProperty : DECIMAL propertyName metaEdId? propertyComponents totalDigits decimalPlaces minValueDecimal? maxValueDecimal? ;

descriptorProperty : DESCRIPTOR propertyName metaEdId? propertyComponents ;

durationProperty :DURATION propertyName metaEdId? propertyComponents;

enumerationProperty : ENUMERATION propertyName metaEdId? propertyComponents ;

includeProperty : (INCLUDE | includeExtensionOverride) propertyName metaEdId?
            propertyComponents
            mergePartOfReference* ;

integerProperty : INTEGER propertyName metaEdId? propertyComponents minValue? maxValue? ;

percentProperty : PERCENT propertyName metaEdId? propertyComponents ;

referenceProperty : REFERENCE propertyName metaEdId?
            propertyComponents
            isWeakReference?
            mergePartOfReference* ;

sharedDecimalProperty : SHARED_DECIMAL sharedPropertyType (SHARED_NAMED propertyName)? metaEdId?
            propertyComponents ;

sharedIntegerProperty : SHARED_INTEGER sharedPropertyType (SHARED_NAMED propertyName)? metaEdId?
            propertyComponents ;

sharedShortProperty : SHARED_SHORT sharedPropertyType (SHARED_NAMED propertyName)? metaEdId?
            propertyComponents ;

sharedStringProperty : SHARED_STRING sharedPropertyType (SHARED_NAMED propertyName)? metaEdId?
            propertyComponents ;

shortProperty : SHORT propertyName metaEdId?
            propertyComponents
            minValue?
            maxValue? ;

stringProperty : STRING propertyName metaEdId?
            propertyComponents
            minLength?
            maxLength ;

timeProperty : TIME propertyName metaEdId?
            propertyComponents ;

yearProperty : YEAR propertyName metaEdId?
            propertyComponents ;

// ReferenceProperty
isWeakReference
    : IS_WEAK_REFERENCE
    ;

mergePartOfReference
    : MERGE_REFERENCE mergePropertyPath WITH targetPropertyPath
    ;

mergePropertyPath
    : propertyPath
    ;

targetPropertyPath
    : propertyPath
    ;

propertyPath
    : ID (PERIOD ID)*
    ;

// numeric

signed_int : unaryOperator? UNSIGNED_INT;

unaryOperator : POS_SIGN | NEG_SIGN;

// Identifiers

abstractEntityName : ID;
associationName : ID;
baseKeyName : ID;
baseName : ID;
choiceName : ID;
commonDecimalName : ID;
commonIntegerName : ID;
commonName : ID;
commonShortName : ID;
commonStringName : ID;
descriptorName : ID;
domainName : ID ;
entityName : ID;
enumerationName : ID;
extendeeName : ID;
inlineCommonName : ID;
interchangeName : ID;
parentDomainName : ID;
propertyName : ID;
sharedPropertyType : ID ;
shortenToName : ID;
subdomainName : ID;
withContextName : ID;

namespaceName : NAMESPACE_ID;
metaEdId : METAED_ID;

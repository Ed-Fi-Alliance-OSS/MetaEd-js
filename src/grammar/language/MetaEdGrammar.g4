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
    | choice
    | sharedDecimal
    | sharedInteger
    | sharedShort
    | sharedString
    | common
    | commonExtension
    | descriptor
    | domainEntity
    | domainEntityExtension
    | domainEntitySubclass
    | enumeration
    | inlineCommon
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
    :  DOMAIN_ENTITY_KEYWORD propertyName metaEdId?
       propertyDocumentation
       withContext?
    ;

secondDomainEntity
    :  DOMAIN_ENTITY_KEYWORD propertyName metaEdId?
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

// Choice

choice
     : CHOICE choiceName metaEdId?
      documentation
      property+
    ;

// SharedDecimal

sharedDecimal
     : SHARED_DECIMAL sharedDecimalName metaEdId?
      documentation
      totalDigits
      decimalPlaces
      minValueDecimal?
      maxValueDecimal?
    ;


// SharedInteger

sharedInteger
     : SHARED_INTEGER sharedIntegerName metaEdId?
      documentation
      minValue?
      maxValue?
    ;

// SharedShort

sharedShort
     : SHARED_SHORT sharedShortName metaEdId?
      documentation
      minValue?
      maxValue?
    ;

// SharedString

sharedString
     : SHARED_STRING sharedStringName metaEdId?
      documentation
      minLength?
      maxLength
    ;

// CommonType

common
    : COMMON commonName metaEdId?
      documentation
      property+
    ;

// CommonExtension

commonExtension
    : COMMON extendeeName ADDITIONS metaEdId?
      property+
    ;

// Descriptor

descriptor
    : DESCRIPTOR descriptorName metaEdId?
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
    : (ASSOCIATION_KEYWORD | DOMAIN_ENTITY_KEYWORD | COMMON_KEYWORD | INLINE_COMMON_KEYWORD | DESCRIPTOR_KEYWORD) ID metaEdId?
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
	: ENUMERATION enumerationName metaEdId?
	  documentation
	  enumerationItem+
	;

enumerationItem
    : ENUMERATION_ITEM shortDescription metaEdId?
      enumerationItemDocumentation?
      ;

shortDescription : TEXT ;

// InlineCommon
inlineCommon
     : INLINE_COMMON inlineCommonName metaEdId?
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
    : interchangeIdentity* interchangeElement (interchangeElement | interchangeIdentity)*
    ;

interchangeElement
    : (ASSOCIATION_KEYWORD | DOMAIN_ENTITY_KEYWORD) ID metaEdId?
    ;

interchangeIdentity
    : (ASSOCIATION_IDENTITY | DOMAIN_ENTITY_IDENTITY) ID metaEdId?
    ;

interchangeExtension
	: INTERCHANGE extendeeName ADDITIONS metaEdId?
	  interchangeExtensionComponent
	  ;

interchangeExtensionComponent
	: (interchangeElement | interchangeIdentity)+
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

commonExtensionOverride : COMMON_EXTENSION;

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
    : associationProperty
    | booleanProperty
    | choiceProperty
    | commonProperty
    | currencyProperty
    | dateProperty
    | decimalProperty
    | descriptorProperty
    | domainEntityProperty
    | durationProperty
    | enumerationProperty
    | inlineCommonProperty
    | integerProperty
    | percentProperty
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

descriptorProperty : DESCRIPTOR_KEYWORD propertyName metaEdId? propertyComponents ;

durationProperty :DURATION propertyName metaEdId? propertyComponents;

enumerationProperty : ENUMERATION_KEYWORD propertyName metaEdId? propertyComponents ;

commonProperty : (COMMON_KEYWORD | commonExtensionOverride) propertyName metaEdId?
            propertyComponents
            mergePartOfReference* ;

inlineCommonProperty : INLINE_COMMON_KEYWORD propertyName metaEdId?
            propertyComponents
            mergePartOfReference* ;

choiceProperty : CHOICE_KEYWORD propertyName metaEdId?
            propertyComponents
            mergePartOfReference* ;

integerProperty : INTEGER propertyName metaEdId? propertyComponents minValue? maxValue? ;

percentProperty : PERCENT propertyName metaEdId? propertyComponents ;

associationProperty : ASSOCIATION_KEYWORD propertyName metaEdId?
            propertyComponents
            isWeakReference?
            mergePartOfReference* ;

domainEntityProperty : DOMAIN_ENTITY_KEYWORD propertyName metaEdId?
            propertyComponents
            isWeakReference?
            mergePartOfReference* ;

sharedDecimalProperty : SHARED_DECIMAL_KEYWORD sharedPropertyType (SHARED_NAMED propertyName)? metaEdId?
            propertyComponents ;

sharedIntegerProperty : SHARED_INTEGER_KEYWORD sharedPropertyType (SHARED_NAMED propertyName)? metaEdId?
            propertyComponents ;

sharedShortProperty : SHARED_SHORT_KEYWORD sharedPropertyType (SHARED_NAMED propertyName)? metaEdId?
            propertyComponents ;

sharedStringProperty : SHARED_STRING_KEYWORD sharedPropertyType (SHARED_NAMED propertyName)? metaEdId?
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
sharedDecimalName : ID;
sharedIntegerName : ID;
commonName : ID;
sharedShortName : ID;
sharedStringName : ID;
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

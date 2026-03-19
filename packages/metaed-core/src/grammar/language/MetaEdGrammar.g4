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
    | commonSubclass
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

// Deprecated

deprecated
    : DEPRECATED TEXT
    ;

propertyDeprecated
    : DEPRECATED TEXT
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
      deprecated?
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
      deprecated?
      documentation
      entityConfiguration?
      definingDomainEntity
      definingDomainEntity
      property*
    ;

definingDomainEntity
    :  DOMAIN_ENTITY_KEYWORD propertyName metaEdId?
       propertyDeprecated?
       propertyDocumentation
       roleName?
       mergeDirective*
    ;

// AssociationExtension

associationExtension
     : ASSOCIATION extendeeName ADDITIONS metaEdId?
       deprecated?
       property+
    ;

// AssociationSubclass

associationSubclass
    : ASSOCIATION associationName BASED_ON baseName metaEdId?
      deprecated?
      documentation
      property+
   ;

// Choice

choice
     : CHOICE choiceName metaEdId?
      deprecated? 
      documentation
      property+
    ;

// SharedDecimal

sharedDecimal
     : SHARED_DECIMAL sharedDecimalName metaEdId?
      deprecated?
      documentation
      totalDigits
      decimalPlaces
      minValueDecimal?
      maxValueDecimal?
    ;


// SharedInteger

sharedInteger
     : SHARED_INTEGER sharedIntegerName metaEdId?
      deprecated?
      documentation
      minValue?
      maxValue?
    ;

// SharedShort

sharedShort
     : SHARED_SHORT sharedShortName metaEdId?
      deprecated?
      documentation
      minValue?
      maxValue?
    ;

// SharedString

sharedString
     : SHARED_STRING sharedStringName metaEdId?
      deprecated?
      documentation
      minLength?
      maxLength
    ;

// CommonType

common
    : COMMON commonName metaEdId?
      deprecated?
      documentation
      property+
    ;

// CommonExtension

commonExtension
    : COMMON extendeeName ADDITIONS metaEdId?
      deprecated?
      property+
    ;

// CommonSubclass

commonSubclass
    : COMMON commonName BASED_ON baseName metaEdId?
      deprecated?
      documentation
      property+
   ;

// Descriptor

descriptor
    : DESCRIPTOR descriptorName metaEdId?
      deprecated?
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
      deprecated?
      documentation
      domainItem+
      footerDocumentation?
    ;

domainItem
    : (ASSOCIATION_KEYWORD
     | COMMON_KEYWORD
     | DOMAIN_ENTITY_KEYWORD
     | DESCRIPTOR_KEYWORD
     | INLINE_COMMON_KEYWORD)
     (baseNamespace PERIOD)? localDomainItemName metaEdId?
    ;

footerDocumentation
    : FOOTER_DOCUMENTATION TEXT
    ;

//  DomainEntity

domainEntity
    : DOMAIN_ENTITY entityName metaEdId?
     deprecated?
     documentation
     entityConfiguration?
     property+
   ;

domainEntityExtension
    : DOMAIN_ENTITY extendeeName ADDITIONS metaEdId?
      deprecated?    
      property+
    ;

domainEntitySubclass
    : DOMAIN_ENTITY entityName BASED_ON baseName metaEdId?
      deprecated?
      documentation
      property+
    ;

// Enumeration

enumeration
	: ENUMERATION enumerationName metaEdId?
      deprecated?
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
      deprecated?
      documentation
      property+
    ;

// Interchange

interchange
    : INTERCHANGE interchangeName metaEdId?
      deprecated?
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
    : (ASSOCIATION_KEYWORD | DESCRIPTOR_KEYWORD | DOMAIN_ENTITY_KEYWORD)
      (baseNamespace PERIOD)? localInterchangeItemName metaEdId?
    ;

interchangeIdentity
    : (ASSOCIATION_IDENTITY | DOMAIN_ENTITY_IDENTITY)
      (baseNamespace PERIOD)? localInterchangeItemName metaEdId?
    ;

interchangeExtension
	: INTERCHANGE extendeeName ADDITIONS metaEdId?
      deprecated?
	  interchangeExtensionComponent
	;

interchangeExtensionComponent
	: (interchangeElement | interchangeIdentity)+
	;

// Subdomain

subdomain
    : SUBDOMAIN subdomainName SUBDOMAIN_OF parentDomainName metaEdId?
      deprecated?
      documentation
      domainItem+
      (SUBDOMAIN_POSITION subdomainPosition)?
    ;

subdomainPosition
    : UNSIGNED_INT
    ;

// Property

minValue : MIN_VALUE (signed_int | BIG) ;

maxValue : MAX_VALUE (signed_int | BIG) ;

minValueShort : MIN_VALUE signed_int ;

maxValueShort : MAX_VALUE signed_int ;

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
    : propertyDeprecated?
      propertyDocumentation
      propertyAnnotation
      roleName?
      isQueryableField?
    ;

isQueryableField : IS_QUERYABLE_FIELD;

roleName
    : ROLE_NAME roleNameName (SHORTEN_TO shortenToName)?
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
    | datetimeProperty
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

booleanProperty : BOOLEAN simplePropertyName metaEdId? propertyComponents;

currencyProperty : CURRENCY simplePropertyName metaEdId? propertyComponents;

dateProperty : DATE simplePropertyName metaEdId? propertyComponents;

datetimeProperty : DATETIME simplePropertyName metaEdId? propertyComponents;

decimalProperty : DECIMAL simplePropertyName metaEdId? propertyComponents totalDigits decimalPlaces minValueDecimal? maxValueDecimal? ;

descriptorProperty : DESCRIPTOR_KEYWORD propertyName metaEdId? propertyComponents ;

durationProperty :DURATION simplePropertyName metaEdId? propertyComponents;

enumerationProperty : ENUMERATION_KEYWORD propertyName metaEdId? propertyComponents ;

commonProperty : (COMMON_KEYWORD | commonExtensionOverride) propertyName metaEdId?
            propertyComponents
            mergeDirective* ;

inlineCommonProperty : INLINE_COMMON_KEYWORD propertyName metaEdId?
            propertyComponents
            mergeDirective* ;

choiceProperty : CHOICE_KEYWORD propertyName metaEdId?
            propertyComponents
            mergeDirective* ;

integerProperty : INTEGER simplePropertyName metaEdId? propertyComponents minValue? maxValue? ;

percentProperty : PERCENT simplePropertyName metaEdId? propertyComponents ;

associationProperty : ASSOCIATION_KEYWORD propertyName metaEdId?
            propertyComponents
            potentiallyLogical?
            isWeakReference?
            mergeDirective* ;

domainEntityProperty : DOMAIN_ENTITY_KEYWORD propertyName metaEdId?
            propertyComponents
            potentiallyLogical?
            isWeakReference?
            mergeDirective* ;

sharedDecimalProperty : SHARED_DECIMAL_KEYWORD sharedPropertyType (SHARED_NAMED sharedPropertyName)? metaEdId?
            propertyComponents
            mergeDirective* ;

sharedIntegerProperty : SHARED_INTEGER_KEYWORD sharedPropertyType (SHARED_NAMED sharedPropertyName)? metaEdId?
            propertyComponents
            mergeDirective* ;

sharedShortProperty : SHARED_SHORT_KEYWORD sharedPropertyType (SHARED_NAMED sharedPropertyName)? metaEdId?
            propertyComponents
            mergeDirective* ;

sharedStringProperty : SHARED_STRING_KEYWORD sharedPropertyType (SHARED_NAMED sharedPropertyName)? metaEdId?
            propertyComponents
            mergeDirective* ;

shortProperty : SHORT simplePropertyName metaEdId?
            propertyComponents
            minValueShort?
            maxValueShort? ;

stringProperty : STRING simplePropertyName metaEdId?
            propertyComponents
            minLength?
            maxLength ;

timeProperty : TIME simplePropertyName metaEdId?
            propertyComponents ;

yearProperty : YEAR simplePropertyName metaEdId?
            propertyComponents ;

// ReferenceProperty
isWeakReference
    : IS_WEAK_REFERENCE
    ;

potentiallyLogical
    : POTENTIALLY_LOGICAL
    ;

mergeDirective
    : MERGE_REFERENCE sourcePropertyPath WITH targetPropertyPath
    ;

sourcePropertyPath
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
baseName
    : (baseNamespace PERIOD)? localBaseName
    ;
baseNamespace : ID;
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
extendeeName
    : (extendeeNamespace PERIOD)? localExtendeeName
    ;
extendeeNamespace: ID;
inlineCommonName : ID;
interchangeName : ID;
localBaseName : ID;
localDomainItemName: ID;
localExtendeeName : ID;
localInterchangeItemName : ID;
localPropertyName : ID;
localPropertyType : ID;
parentDomainName : ID;
propertyName
    : (propertyNamespace PERIOD)? localPropertyName
    ;
propertyNamespace : ID;
roleNameName : ID;
sharedPropertyName : ID;
sharedPropertyType
    : (propertyNamespace PERIOD)? localPropertyType
    ;
shortenToName : ID;
simplePropertyName: localPropertyName;
subdomainName : ID;

namespaceName : ID;
metaEdId : METAED_ID;

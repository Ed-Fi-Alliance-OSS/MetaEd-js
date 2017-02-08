lexer grammar BaseLexer;

ABSTRACT_ENTITY :       'Abstract Entity';
ASSOCIATION :           'Association';
BEGIN_NAMESPACE :       'Begin Namespace';
END_NAMESPACE :         'End Namespace';
CHOICE_TYPE :           'Choice Common Type';
COMMON_TYPE :           'Common Type';
COMMON_DECIMAL :        'Common Decimal';
COMMON_INTEGER :        'Common Integer';
COMMON_SHORT :          'Common Short';
COMMON_STRING :         'Common String';
DESCRIPTOR_ENTITY :     'Descriptor';
DOMAIN :                'Domain';
DOMAIN_ENTITY :         'Domain Entity';
ENUMERATION_ENTITY :    'Enumeration';
INLINE :                'Inline';
INTERCHANGE :           'Interchange';
INLINE_COMMON_TYPE :    'Inline Common Type';
SUBDOMAIN :             'Subdomain';
TYPE :                  'Type';

CORE :                      'core';
ASSOCIATION_DOMAIN_ENTITY : 'domain entity';
BOOLEAN :                   'bool';
CURRENCY :                  'currency';
DATE :                      'date';
DECIMAL :                   'decimal';
DESCRIPTOR :                'descriptor';
DOMAIN_ITEM :               'domain item';
DURATION :                  'duration';
ELEMENT :                   'element';
ENUMERATION :               'enumeration';
ENUMERATION_ITEM :          'item';
IDENTITY_TEMPLATE :         'identity template';
INCLUDE :                   'include';
INCLUDE_EXTENSION :         'include extension';
INTEGER :                   'integer';
PERCENT :                   'percent';
REFERENCE :                 'reference';
SHARED_DECIMAL :            'shared decimal';
SHARED_INTEGER :            'shared integer';
SHARED_SHORT :              'shared short';
SHARED_STRING :             'shared string';
SHARED_NAMED :              'named';
SHORT :                     'short';
STRING :                    'string';
TIME :                      'time';
YEAR :                      'year';

ADDITIONS :             'additions';
BASED_ON :              'based on';
CASCADE_UPDATE :        'allow primary key updates';
DECIMAL_PLACES :        'decimal places';
IDENTITY :              'is part of identity';
IDENTITY_RENAME :       'renames identity property';
IS_QUERYABLE_FIELD :    'is queryable field';
IS_QUERYABLE_ONLY :     'is queryable only';
IS_WEAK_REFERENCE :     'is weak';
MERGE_REFERENCE :       'merge';
MIN_LENGTH :            'min length';
MAX_LENGTH :            'max length';
MIN_VALUE :             'min value';
MAX_VALUE :             'max value';
OPTIONAL :              'is optional';
OPTIONAL_COLLECTION :   'is optional collection';
REQUIRED :              'is required';
REQUIRED_COLLECTION :   'is required collection';
SHORTEN_TO :            'shorten to';
SUBDOMAIN_OF :          'of';
SUBDOMAIN_POSITION :    'position';
TOTAL_DIGITS :          'total digits';
WITH :                  'with';
WITH_CONTEXT :          'with context';
WITH_OPTIONAL_MAP_TYPE : 'with optional map type';
WITH_MAP_TYPE :         'with map type';

DOCUMENTATION:              'documentation';
INHERITED:                  'inherited';
EXTENDED_DOCUMENTATION :    'extended documentation';
USE_CASE_DOCUMENTATION :    'use case documentation';
FOOTER_DOCUMENTATION :      'footer documentation';

fragment DIGIT :		[0-9];
fragment UPPER_CASE :   [A-Z];
fragment LOWER_CASE :   [a-z];
fragment MIXED_CASE :   UPPER_CASE | LOWER_CASE;
fragment ALPHANUMERIC : DIGIT | UPPER_CASE | LOWER_CASE;
fragment INT_FRAG :     ([0] | [1-9] [0-9]*);

ID : UPPER_CASE (ALPHANUMERIC)* ;
NAMESPACE_ID : LOWER_CASE+;

UNSIGNED_INT : INT_FRAG;
DECIMAL_VALUE : '-'? INT_FRAG '.' [0-9]* ;
TEXT : '"' ( '""' | ~["] )* '"';

fragment METAED_ID_START : '[';
fragment METAED_ID_END : ']';
METAED_ID : METAED_ID_START DIGIT+ ('-' DIGIT +)? METAED_ID_END;

POS_SIGN : '+';
NEG_SIGN : '-';
PERIOD : '.';

LINE_COMMENT : '//' .*? '\r'? '\n' -> skip ; // Match "//" stuff '\n'

WS : [ \t\n\r]+ -> skip ;

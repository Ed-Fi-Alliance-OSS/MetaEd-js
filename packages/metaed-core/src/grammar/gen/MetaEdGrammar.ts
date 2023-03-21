// Generated from ./packages/metaed-core/src/grammar/language/MetaEdGrammar.g4 by ANTLR 4.12.0
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import MetaEdGrammarListener from "./MetaEdGrammarListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class MetaEdGrammar extends Parser {
	public static readonly ABSTRACT_ENTITY = 1;
	public static readonly ASSOCIATION = 2;
	public static readonly BEGIN_NAMESPACE = 3;
	public static readonly END_NAMESPACE = 4;
	public static readonly CHOICE = 5;
	public static readonly COMMON = 6;
	public static readonly DESCRIPTOR = 7;
	public static readonly DOMAIN = 8;
	public static readonly DOMAIN_ENTITY = 9;
	public static readonly ENUMERATION = 10;
	public static readonly INLINE = 11;
	public static readonly INTERCHANGE = 12;
	public static readonly INLINE_COMMON = 13;
	public static readonly SHARED_DECIMAL = 14;
	public static readonly SHARED_INTEGER = 15;
	public static readonly SHARED_SHORT = 16;
	public static readonly SHARED_STRING = 17;
	public static readonly SUBDOMAIN = 18;
	public static readonly TYPE = 19;
	public static readonly ASSOCIATION_KEYWORD = 20;
	public static readonly ASSOCIATION_IDENTITY = 21;
	public static readonly BOOLEAN = 22;
	public static readonly CHOICE_KEYWORD = 23;
	public static readonly COMMON_KEYWORD = 24;
	public static readonly COMMON_EXTENSION = 25;
	public static readonly CURRENCY = 26;
	public static readonly DATE = 27;
	public static readonly DATETIME = 28;
	public static readonly DECIMAL = 29;
	public static readonly DESCRIPTOR_KEYWORD = 30;
	public static readonly DOMAIN_ENTITY_KEYWORD = 31;
	public static readonly DOMAIN_ENTITY_IDENTITY = 32;
	public static readonly DOMAIN_ITEM = 33;
	public static readonly DURATION = 34;
	public static readonly ELEMENT = 35;
	public static readonly ENUMERATION_KEYWORD = 36;
	public static readonly ENUMERATION_ITEM = 37;
	public static readonly INLINE_COMMON_KEYWORD = 38;
	public static readonly INTEGER = 39;
	public static readonly PERCENT = 40;
	public static readonly REFERENCE = 41;
	public static readonly SHARED_DECIMAL_KEYWORD = 42;
	public static readonly SHARED_INTEGER_KEYWORD = 43;
	public static readonly SHARED_SHORT_KEYWORD = 44;
	public static readonly SHARED_STRING_KEYWORD = 45;
	public static readonly SHARED_NAMED = 46;
	public static readonly SHORT = 47;
	public static readonly STRING = 48;
	public static readonly TIME = 49;
	public static readonly YEAR = 50;
	public static readonly ADDITIONS = 51;
	public static readonly BASED_ON = 52;
	public static readonly CORE = 53;
	public static readonly CASCADE_UPDATE = 54;
	public static readonly DECIMAL_PLACES = 55;
	public static readonly IDENTITY = 56;
	public static readonly IDENTITY_RENAME = 57;
	public static readonly IS_QUERYABLE_FIELD = 58;
	public static readonly IS_QUERYABLE_ONLY = 59;
	public static readonly IS_WEAK_REFERENCE = 60;
	public static readonly POTENTIALLY_LOGICAL = 61;
	public static readonly MERGE_REFERENCE = 62;
	public static readonly MIN_LENGTH = 63;
	public static readonly MAX_LENGTH = 64;
	public static readonly MIN_VALUE = 65;
	public static readonly MAX_VALUE = 66;
	public static readonly OPTIONAL = 67;
	public static readonly OPTIONAL_COLLECTION = 68;
	public static readonly REQUIRED = 69;
	public static readonly REQUIRED_COLLECTION = 70;
	public static readonly ROLE_NAME = 71;
	public static readonly SHORTEN_TO = 72;
	public static readonly SUBDOMAIN_OF = 73;
	public static readonly SUBDOMAIN_POSITION = 74;
	public static readonly TOTAL_DIGITS = 75;
	public static readonly WITH = 76;
	public static readonly WITH_OPTIONAL_MAP_TYPE = 77;
	public static readonly WITH_MAP_TYPE = 78;
	public static readonly DEPRECATED = 79;
	public static readonly DOCUMENTATION = 80;
	public static readonly INHERITED = 81;
	public static readonly EXTENDED_DOCUMENTATION = 82;
	public static readonly USE_CASE_DOCUMENTATION = 83;
	public static readonly FOOTER_DOCUMENTATION = 84;
	public static readonly ID = 85;
	public static readonly UNSIGNED_INT = 86;
	public static readonly DECIMAL_VALUE = 87;
	public static readonly TEXT = 88;
	public static readonly METAED_ID = 89;
	public static readonly POS_SIGN = 90;
	public static readonly NEG_SIGN = 91;
	public static readonly PERIOD = 92;
	public static readonly LINE_COMMENT = 93;
	public static readonly WS = 94;
	public static readonly ERROR_CHARACTER = 95;
	public static readonly EOF = Token.EOF;
	public static readonly RULE_metaEd = 0;
	public static readonly RULE_namespace = 1;
	public static readonly RULE_namespaceType = 2;
	public static readonly RULE_topLevelEntity = 3;
	public static readonly RULE_deprecated = 4;
	public static readonly RULE_propertyDeprecated = 5;
	public static readonly RULE_documentation = 6;
	public static readonly RULE_enumerationItemDocumentation = 7;
	public static readonly RULE_mapTypeDocumentation = 8;
	public static readonly RULE_propertyDocumentation = 9;
	public static readonly RULE_abstractEntity = 10;
	public static readonly RULE_entityConfiguration = 11;
	public static readonly RULE_cascadeUpdate = 12;
	public static readonly RULE_association = 13;
	public static readonly RULE_definingDomainEntity = 14;
	public static readonly RULE_associationExtension = 15;
	public static readonly RULE_associationSubclass = 16;
	public static readonly RULE_choice = 17;
	public static readonly RULE_sharedDecimal = 18;
	public static readonly RULE_sharedInteger = 19;
	public static readonly RULE_sharedShort = 20;
	public static readonly RULE_sharedString = 21;
	public static readonly RULE_common = 22;
	public static readonly RULE_commonExtension = 23;
	public static readonly RULE_commonSubclass = 24;
	public static readonly RULE_descriptor = 25;
	public static readonly RULE_withMapType = 26;
	public static readonly RULE_requiredMapType = 27;
	public static readonly RULE_optionalMapType = 28;
	public static readonly RULE_domain = 29;
	public static readonly RULE_domainItem = 30;
	public static readonly RULE_footerDocumentation = 31;
	public static readonly RULE_domainEntity = 32;
	public static readonly RULE_domainEntityExtension = 33;
	public static readonly RULE_domainEntitySubclass = 34;
	public static readonly RULE_enumeration = 35;
	public static readonly RULE_enumerationItem = 36;
	public static readonly RULE_shortDescription = 37;
	public static readonly RULE_inlineCommon = 38;
	public static readonly RULE_interchange = 39;
	public static readonly RULE_extendedDocumentation = 40;
	public static readonly RULE_useCaseDocumentation = 41;
	public static readonly RULE_interchangeComponent = 42;
	public static readonly RULE_interchangeElement = 43;
	public static readonly RULE_interchangeIdentity = 44;
	public static readonly RULE_interchangeExtension = 45;
	public static readonly RULE_interchangeExtensionComponent = 46;
	public static readonly RULE_subdomain = 47;
	public static readonly RULE_subdomainPosition = 48;
	public static readonly RULE_minValue = 49;
	public static readonly RULE_maxValue = 50;
	public static readonly RULE_minValueDecimal = 51;
	public static readonly RULE_maxValueDecimal = 52;
	public static readonly RULE_decimalValue = 53;
	public static readonly RULE_totalDigits = 54;
	public static readonly RULE_decimalPlaces = 55;
	public static readonly RULE_commonExtensionOverride = 56;
	public static readonly RULE_propertyAnnotation = 57;
	public static readonly RULE_identity = 58;
	public static readonly RULE_identityRename = 59;
	public static readonly RULE_required = 60;
	public static readonly RULE_optional = 61;
	public static readonly RULE_collection = 62;
	public static readonly RULE_requiredCollection = 63;
	public static readonly RULE_optionalCollection = 64;
	public static readonly RULE_isQueryableOnly = 65;
	public static readonly RULE_propertyComponents = 66;
	public static readonly RULE_isQueryableField = 67;
	public static readonly RULE_roleName = 68;
	public static readonly RULE_minLength = 69;
	public static readonly RULE_maxLength = 70;
	public static readonly RULE_property = 71;
	public static readonly RULE_booleanProperty = 72;
	public static readonly RULE_currencyProperty = 73;
	public static readonly RULE_dateProperty = 74;
	public static readonly RULE_datetimeProperty = 75;
	public static readonly RULE_decimalProperty = 76;
	public static readonly RULE_descriptorProperty = 77;
	public static readonly RULE_durationProperty = 78;
	public static readonly RULE_enumerationProperty = 79;
	public static readonly RULE_commonProperty = 80;
	public static readonly RULE_inlineCommonProperty = 81;
	public static readonly RULE_choiceProperty = 82;
	public static readonly RULE_integerProperty = 83;
	public static readonly RULE_percentProperty = 84;
	public static readonly RULE_associationProperty = 85;
	public static readonly RULE_domainEntityProperty = 86;
	public static readonly RULE_sharedDecimalProperty = 87;
	public static readonly RULE_sharedIntegerProperty = 88;
	public static readonly RULE_sharedShortProperty = 89;
	public static readonly RULE_sharedStringProperty = 90;
	public static readonly RULE_shortProperty = 91;
	public static readonly RULE_stringProperty = 92;
	public static readonly RULE_timeProperty = 93;
	public static readonly RULE_yearProperty = 94;
	public static readonly RULE_isWeakReference = 95;
	public static readonly RULE_potentiallyLogical = 96;
	public static readonly RULE_mergeDirective = 97;
	public static readonly RULE_sourcePropertyPath = 98;
	public static readonly RULE_targetPropertyPath = 99;
	public static readonly RULE_propertyPath = 100;
	public static readonly RULE_signed_int = 101;
	public static readonly RULE_unaryOperator = 102;
	public static readonly RULE_abstractEntityName = 103;
	public static readonly RULE_associationName = 104;
	public static readonly RULE_baseKeyName = 105;
	public static readonly RULE_baseName = 106;
	public static readonly RULE_baseNamespace = 107;
	public static readonly RULE_choiceName = 108;
	public static readonly RULE_sharedDecimalName = 109;
	public static readonly RULE_sharedIntegerName = 110;
	public static readonly RULE_commonName = 111;
	public static readonly RULE_sharedShortName = 112;
	public static readonly RULE_sharedStringName = 113;
	public static readonly RULE_descriptorName = 114;
	public static readonly RULE_domainName = 115;
	public static readonly RULE_entityName = 116;
	public static readonly RULE_enumerationName = 117;
	public static readonly RULE_extendeeName = 118;
	public static readonly RULE_extendeeNamespace = 119;
	public static readonly RULE_inlineCommonName = 120;
	public static readonly RULE_interchangeName = 121;
	public static readonly RULE_localBaseName = 122;
	public static readonly RULE_localDomainItemName = 123;
	public static readonly RULE_localExtendeeName = 124;
	public static readonly RULE_localInterchangeItemName = 125;
	public static readonly RULE_localPropertyName = 126;
	public static readonly RULE_localPropertyType = 127;
	public static readonly RULE_parentDomainName = 128;
	public static readonly RULE_propertyName = 129;
	public static readonly RULE_propertyNamespace = 130;
	public static readonly RULE_roleNameName = 131;
	public static readonly RULE_sharedPropertyName = 132;
	public static readonly RULE_sharedPropertyType = 133;
	public static readonly RULE_shortenToName = 134;
	public static readonly RULE_simplePropertyName = 135;
	public static readonly RULE_subdomainName = 136;
	public static readonly RULE_namespaceName = 137;
	public static readonly RULE_metaEdId = 138;
	public static readonly literalNames: (string | null)[] = [ null, "'Abstract Entity'", 
                                                            "'Association'", 
                                                            "'Begin Namespace'", 
                                                            "'End Namespace'", 
                                                            "'Choice'", 
                                                            "'Common'", 
                                                            "'Descriptor'", 
                                                            "'Domain'", 
                                                            "'Domain Entity'", 
                                                            "'Enumeration'", 
                                                            "'Inline'", 
                                                            "'Interchange'", 
                                                            "'Inline Common'", 
                                                            "'Shared Decimal'", 
                                                            "'Shared Integer'", 
                                                            "'Shared Short'", 
                                                            "'Shared String'", 
                                                            "'Subdomain'", 
                                                            "'Type'", "'association'", 
                                                            "'association identity'", 
                                                            "'bool'", "'choice'", 
                                                            "'common'", 
                                                            "'common extension'", 
                                                            "'currency'", 
                                                            "'date'", "'datetime'", 
                                                            "'decimal'", 
                                                            "'descriptor'", 
                                                            "'domain entity'", 
                                                            "'domain entity identity'", 
                                                            "'domain item'", 
                                                            "'duration'", 
                                                            "'element'", 
                                                            "'enumeration'", 
                                                            "'item'", "'inline common'", 
                                                            "'integer'", 
                                                            "'percent'", 
                                                            "'reference'", 
                                                            "'shared decimal'", 
                                                            "'shared integer'", 
                                                            "'shared short'", 
                                                            "'shared string'", 
                                                            "'named'", "'short'", 
                                                            "'string'", 
                                                            "'time'", "'year'", 
                                                            "'additions'", 
                                                            "'based on'", 
                                                            "'core'", "'allow primary key updates'", 
                                                            "'decimal places'", 
                                                            "'is part of identity'", 
                                                            "'renames identity property'", 
                                                            "'is queryable field'", 
                                                            "'is queryable only'", 
                                                            "'is weak'", 
                                                            "'potentially logical'", 
                                                            "'merge'", "'min length'", 
                                                            "'max length'", 
                                                            "'min value'", 
                                                            "'max value'", 
                                                            "'is optional'", 
                                                            "'is optional collection'", 
                                                            "'is required'", 
                                                            "'is required collection'", 
                                                            "'role name'", 
                                                            "'shorten to'", 
                                                            "'of'", "'position'", 
                                                            "'total digits'", 
                                                            "'with'", "'with optional map type'", 
                                                            "'with map type'", 
                                                            "'deprecated'", 
                                                            "'documentation'", 
                                                            "'inherited'", 
                                                            "'extended documentation'", 
                                                            "'use case documentation'", 
                                                            "'footer documentation'", 
                                                            null, null, 
                                                            null, null, 
                                                            null, "'+'", 
                                                            "'-'", "'.'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "ABSTRACT_ENTITY", 
                                                             "ASSOCIATION", 
                                                             "BEGIN_NAMESPACE", 
                                                             "END_NAMESPACE", 
                                                             "CHOICE", "COMMON", 
                                                             "DESCRIPTOR", 
                                                             "DOMAIN", "DOMAIN_ENTITY", 
                                                             "ENUMERATION", 
                                                             "INLINE", "INTERCHANGE", 
                                                             "INLINE_COMMON", 
                                                             "SHARED_DECIMAL", 
                                                             "SHARED_INTEGER", 
                                                             "SHARED_SHORT", 
                                                             "SHARED_STRING", 
                                                             "SUBDOMAIN", 
                                                             "TYPE", "ASSOCIATION_KEYWORD", 
                                                             "ASSOCIATION_IDENTITY", 
                                                             "BOOLEAN", 
                                                             "CHOICE_KEYWORD", 
                                                             "COMMON_KEYWORD", 
                                                             "COMMON_EXTENSION", 
                                                             "CURRENCY", 
                                                             "DATE", "DATETIME", 
                                                             "DECIMAL", 
                                                             "DESCRIPTOR_KEYWORD", 
                                                             "DOMAIN_ENTITY_KEYWORD", 
                                                             "DOMAIN_ENTITY_IDENTITY", 
                                                             "DOMAIN_ITEM", 
                                                             "DURATION", 
                                                             "ELEMENT", 
                                                             "ENUMERATION_KEYWORD", 
                                                             "ENUMERATION_ITEM", 
                                                             "INLINE_COMMON_KEYWORD", 
                                                             "INTEGER", 
                                                             "PERCENT", 
                                                             "REFERENCE", 
                                                             "SHARED_DECIMAL_KEYWORD", 
                                                             "SHARED_INTEGER_KEYWORD", 
                                                             "SHARED_SHORT_KEYWORD", 
                                                             "SHARED_STRING_KEYWORD", 
                                                             "SHARED_NAMED", 
                                                             "SHORT", "STRING", 
                                                             "TIME", "YEAR", 
                                                             "ADDITIONS", 
                                                             "BASED_ON", 
                                                             "CORE", "CASCADE_UPDATE", 
                                                             "DECIMAL_PLACES", 
                                                             "IDENTITY", 
                                                             "IDENTITY_RENAME", 
                                                             "IS_QUERYABLE_FIELD", 
                                                             "IS_QUERYABLE_ONLY", 
                                                             "IS_WEAK_REFERENCE", 
                                                             "POTENTIALLY_LOGICAL", 
                                                             "MERGE_REFERENCE", 
                                                             "MIN_LENGTH", 
                                                             "MAX_LENGTH", 
                                                             "MIN_VALUE", 
                                                             "MAX_VALUE", 
                                                             "OPTIONAL", 
                                                             "OPTIONAL_COLLECTION", 
                                                             "REQUIRED", 
                                                             "REQUIRED_COLLECTION", 
                                                             "ROLE_NAME", 
                                                             "SHORTEN_TO", 
                                                             "SUBDOMAIN_OF", 
                                                             "SUBDOMAIN_POSITION", 
                                                             "TOTAL_DIGITS", 
                                                             "WITH", "WITH_OPTIONAL_MAP_TYPE", 
                                                             "WITH_MAP_TYPE", 
                                                             "DEPRECATED", 
                                                             "DOCUMENTATION", 
                                                             "INHERITED", 
                                                             "EXTENDED_DOCUMENTATION", 
                                                             "USE_CASE_DOCUMENTATION", 
                                                             "FOOTER_DOCUMENTATION", 
                                                             "ID", "UNSIGNED_INT", 
                                                             "DECIMAL_VALUE", 
                                                             "TEXT", "METAED_ID", 
                                                             "POS_SIGN", 
                                                             "NEG_SIGN", 
                                                             "PERIOD", "LINE_COMMENT", 
                                                             "WS", "ERROR_CHARACTER" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"metaEd", "namespace", "namespaceType", "topLevelEntity", "deprecated", 
		"propertyDeprecated", "documentation", "enumerationItemDocumentation", 
		"mapTypeDocumentation", "propertyDocumentation", "abstractEntity", "entityConfiguration", 
		"cascadeUpdate", "association", "definingDomainEntity", "associationExtension", 
		"associationSubclass", "choice", "sharedDecimal", "sharedInteger", "sharedShort", 
		"sharedString", "common", "commonExtension", "commonSubclass", "descriptor", 
		"withMapType", "requiredMapType", "optionalMapType", "domain", "domainItem", 
		"footerDocumentation", "domainEntity", "domainEntityExtension", "domainEntitySubclass", 
		"enumeration", "enumerationItem", "shortDescription", "inlineCommon", 
		"interchange", "extendedDocumentation", "useCaseDocumentation", "interchangeComponent", 
		"interchangeElement", "interchangeIdentity", "interchangeExtension", "interchangeExtensionComponent", 
		"subdomain", "subdomainPosition", "minValue", "maxValue", "minValueDecimal", 
		"maxValueDecimal", "decimalValue", "totalDigits", "decimalPlaces", "commonExtensionOverride", 
		"propertyAnnotation", "identity", "identityRename", "required", "optional", 
		"collection", "requiredCollection", "optionalCollection", "isQueryableOnly", 
		"propertyComponents", "isQueryableField", "roleName", "minLength", "maxLength", 
		"property", "booleanProperty", "currencyProperty", "dateProperty", "datetimeProperty", 
		"decimalProperty", "descriptorProperty", "durationProperty", "enumerationProperty", 
		"commonProperty", "inlineCommonProperty", "choiceProperty", "integerProperty", 
		"percentProperty", "associationProperty", "domainEntityProperty", "sharedDecimalProperty", 
		"sharedIntegerProperty", "sharedShortProperty", "sharedStringProperty", 
		"shortProperty", "stringProperty", "timeProperty", "yearProperty", "isWeakReference", 
		"potentiallyLogical", "mergeDirective", "sourcePropertyPath", "targetPropertyPath", 
		"propertyPath", "signed_int", "unaryOperator", "abstractEntityName", "associationName", 
		"baseKeyName", "baseName", "baseNamespace", "choiceName", "sharedDecimalName", 
		"sharedIntegerName", "commonName", "sharedShortName", "sharedStringName", 
		"descriptorName", "domainName", "entityName", "enumerationName", "extendeeName", 
		"extendeeNamespace", "inlineCommonName", "interchangeName", "localBaseName", 
		"localDomainItemName", "localExtendeeName", "localInterchangeItemName", 
		"localPropertyName", "localPropertyType", "parentDomainName", "propertyName", 
		"propertyNamespace", "roleNameName", "sharedPropertyName", "sharedPropertyType", 
		"shortenToName", "simplePropertyName", "subdomainName", "namespaceName", 
		"metaEdId",
	];
	public get grammarFileName(): string { return "MetaEdGrammar.g4"; }
	public get literalNames(): (string | null)[] { return MetaEdGrammar.literalNames; }
	public get symbolicNames(): (string | null)[] { return MetaEdGrammar.symbolicNames; }
	public get ruleNames(): string[] { return MetaEdGrammar.ruleNames; }
	public get serializedATN(): number[] { return MetaEdGrammar._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, MetaEdGrammar._ATN, MetaEdGrammar.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public metaEd(): MetaEdContext {
		let localctx: MetaEdContext = new MetaEdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, MetaEdGrammar.RULE_metaEd);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 279;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 278;
				this.namespace();
				}
				}
				this.state = 281;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===3);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public namespace(): NamespaceContext {
		let localctx: NamespaceContext = new NamespaceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, MetaEdGrammar.RULE_namespace);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 283;
			this.match(MetaEdGrammar.BEGIN_NAMESPACE);
			this.state = 284;
			this.namespaceName();
			this.state = 285;
			this.namespaceType();
			this.state = 287;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 286;
				this.topLevelEntity();
				}
				}
				this.state = 289;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 522214) !== 0));
			this.state = 291;
			this.match(MetaEdGrammar.END_NAMESPACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public namespaceType(): NamespaceTypeContext {
		let localctx: NamespaceTypeContext = new NamespaceTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, MetaEdGrammar.RULE_namespaceType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 293;
			_la = this._input.LA(1);
			if(!(_la===53 || _la===85)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public topLevelEntity(): TopLevelEntityContext {
		let localctx: TopLevelEntityContext = new TopLevelEntityContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, MetaEdGrammar.RULE_topLevelEntity);
		try {
			this.state = 317;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 295;
				this.abstractEntity();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 296;
				this.association();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 297;
				this.associationExtension();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 298;
				this.associationSubclass();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 299;
				this.choice();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 300;
				this.sharedDecimal();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 301;
				this.sharedInteger();
				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 302;
				this.sharedShort();
				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 303;
				this.sharedString();
				}
				break;
			case 10:
				this.enterOuterAlt(localctx, 10);
				{
				this.state = 304;
				this.common();
				}
				break;
			case 11:
				this.enterOuterAlt(localctx, 11);
				{
				this.state = 305;
				this.commonExtension();
				}
				break;
			case 12:
				this.enterOuterAlt(localctx, 12);
				{
				this.state = 306;
				this.commonSubclass();
				}
				break;
			case 13:
				this.enterOuterAlt(localctx, 13);
				{
				this.state = 307;
				this.descriptor();
				}
				break;
			case 14:
				this.enterOuterAlt(localctx, 14);
				{
				this.state = 308;
				this.domainEntity();
				}
				break;
			case 15:
				this.enterOuterAlt(localctx, 15);
				{
				this.state = 309;
				this.domainEntityExtension();
				}
				break;
			case 16:
				this.enterOuterAlt(localctx, 16);
				{
				this.state = 310;
				this.domainEntitySubclass();
				}
				break;
			case 17:
				this.enterOuterAlt(localctx, 17);
				{
				this.state = 311;
				this.enumeration();
				}
				break;
			case 18:
				this.enterOuterAlt(localctx, 18);
				{
				this.state = 312;
				this.inlineCommon();
				}
				break;
			case 19:
				this.enterOuterAlt(localctx, 19);
				{
				this.state = 313;
				this.interchange();
				}
				break;
			case 20:
				this.enterOuterAlt(localctx, 20);
				{
				this.state = 314;
				this.interchangeExtension();
				}
				break;
			case 21:
				this.enterOuterAlt(localctx, 21);
				{
				this.state = 315;
				this.domain();
				}
				break;
			case 22:
				this.enterOuterAlt(localctx, 22);
				{
				this.state = 316;
				this.subdomain();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public deprecated(): DeprecatedContext {
		let localctx: DeprecatedContext = new DeprecatedContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, MetaEdGrammar.RULE_deprecated);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 319;
			this.match(MetaEdGrammar.DEPRECATED);
			this.state = 320;
			this.match(MetaEdGrammar.TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyDeprecated(): PropertyDeprecatedContext {
		let localctx: PropertyDeprecatedContext = new PropertyDeprecatedContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, MetaEdGrammar.RULE_propertyDeprecated);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 322;
			this.match(MetaEdGrammar.DEPRECATED);
			this.state = 323;
			this.match(MetaEdGrammar.TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public documentation(): DocumentationContext {
		let localctx: DocumentationContext = new DocumentationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, MetaEdGrammar.RULE_documentation);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 325;
			this.match(MetaEdGrammar.DOCUMENTATION);
			this.state = 326;
			this.match(MetaEdGrammar.TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumerationItemDocumentation(): EnumerationItemDocumentationContext {
		let localctx: EnumerationItemDocumentationContext = new EnumerationItemDocumentationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, MetaEdGrammar.RULE_enumerationItemDocumentation);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 328;
			this.match(MetaEdGrammar.DOCUMENTATION);
			this.state = 329;
			this.match(MetaEdGrammar.TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public mapTypeDocumentation(): MapTypeDocumentationContext {
		let localctx: MapTypeDocumentationContext = new MapTypeDocumentationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, MetaEdGrammar.RULE_mapTypeDocumentation);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 331;
			this.match(MetaEdGrammar.DOCUMENTATION);
			this.state = 332;
			this.match(MetaEdGrammar.TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyDocumentation(): PropertyDocumentationContext {
		let localctx: PropertyDocumentationContext = new PropertyDocumentationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, MetaEdGrammar.RULE_propertyDocumentation);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 334;
			this.match(MetaEdGrammar.DOCUMENTATION);
			this.state = 335;
			_la = this._input.LA(1);
			if(!(_la===81 || _la===88)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public abstractEntity(): AbstractEntityContext {
		let localctx: AbstractEntityContext = new AbstractEntityContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, MetaEdGrammar.RULE_abstractEntity);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 337;
			this.match(MetaEdGrammar.ABSTRACT_ENTITY);
			this.state = 338;
			this.abstractEntityName();
			this.state = 340;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 339;
				this.metaEdId();
				}
			}

			this.state = 343;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 342;
				this.deprecated();
				}
			}

			this.state = 345;
			this.documentation();
			this.state = 347;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 346;
				this.property();
				}
				}
				this.state = 349;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public entityConfiguration(): EntityConfigurationContext {
		let localctx: EntityConfigurationContext = new EntityConfigurationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, MetaEdGrammar.RULE_entityConfiguration);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 351;
			this.cascadeUpdate();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public cascadeUpdate(): CascadeUpdateContext {
		let localctx: CascadeUpdateContext = new CascadeUpdateContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, MetaEdGrammar.RULE_cascadeUpdate);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 353;
			this.match(MetaEdGrammar.CASCADE_UPDATE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public association(): AssociationContext {
		let localctx: AssociationContext = new AssociationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, MetaEdGrammar.RULE_association);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 355;
			this.match(MetaEdGrammar.ASSOCIATION);
			this.state = 356;
			this.associationName();
			this.state = 358;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 357;
				this.metaEdId();
				}
			}

			this.state = 361;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 360;
				this.deprecated();
				}
			}

			this.state = 363;
			this.documentation();
			this.state = 365;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===54) {
				{
				this.state = 364;
				this.entityConfiguration();
				}
			}

			this.state = 367;
			this.definingDomainEntity();
			this.state = 368;
			this.definingDomainEntity();
			this.state = 372;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0)) {
				{
				{
				this.state = 369;
				this.property();
				}
				}
				this.state = 374;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public definingDomainEntity(): DefiningDomainEntityContext {
		let localctx: DefiningDomainEntityContext = new DefiningDomainEntityContext(this, this._ctx, this.state);
		this.enterRule(localctx, 28, MetaEdGrammar.RULE_definingDomainEntity);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 375;
			this.match(MetaEdGrammar.DOMAIN_ENTITY_KEYWORD);
			this.state = 376;
			this.propertyName();
			this.state = 378;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 377;
				this.metaEdId();
				}
			}

			this.state = 381;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 380;
				this.propertyDeprecated();
				}
			}

			this.state = 383;
			this.propertyDocumentation();
			this.state = 385;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===71) {
				{
				this.state = 384;
				this.roleName();
				}
			}

			this.state = 390;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===62) {
				{
				{
				this.state = 387;
				this.mergeDirective();
				}
				}
				this.state = 392;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public associationExtension(): AssociationExtensionContext {
		let localctx: AssociationExtensionContext = new AssociationExtensionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 30, MetaEdGrammar.RULE_associationExtension);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 393;
			this.match(MetaEdGrammar.ASSOCIATION);
			this.state = 394;
			this.extendeeName();
			this.state = 395;
			this.match(MetaEdGrammar.ADDITIONS);
			this.state = 397;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 396;
				this.metaEdId();
				}
			}

			this.state = 400;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 399;
				this.deprecated();
				}
			}

			this.state = 403;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 402;
				this.property();
				}
				}
				this.state = 405;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public associationSubclass(): AssociationSubclassContext {
		let localctx: AssociationSubclassContext = new AssociationSubclassContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, MetaEdGrammar.RULE_associationSubclass);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 407;
			this.match(MetaEdGrammar.ASSOCIATION);
			this.state = 408;
			this.associationName();
			this.state = 409;
			this.match(MetaEdGrammar.BASED_ON);
			this.state = 410;
			this.baseName();
			this.state = 412;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 411;
				this.metaEdId();
				}
			}

			this.state = 415;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 414;
				this.deprecated();
				}
			}

			this.state = 417;
			this.documentation();
			this.state = 419;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 418;
				this.property();
				}
				}
				this.state = 421;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public choice(): ChoiceContext {
		let localctx: ChoiceContext = new ChoiceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 34, MetaEdGrammar.RULE_choice);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 423;
			this.match(MetaEdGrammar.CHOICE);
			this.state = 424;
			this.choiceName();
			this.state = 426;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 425;
				this.metaEdId();
				}
			}

			this.state = 429;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 428;
				this.deprecated();
				}
			}

			this.state = 431;
			this.documentation();
			this.state = 433;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 432;
				this.property();
				}
				}
				this.state = 435;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedDecimal(): SharedDecimalContext {
		let localctx: SharedDecimalContext = new SharedDecimalContext(this, this._ctx, this.state);
		this.enterRule(localctx, 36, MetaEdGrammar.RULE_sharedDecimal);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 437;
			this.match(MetaEdGrammar.SHARED_DECIMAL);
			this.state = 438;
			this.sharedDecimalName();
			this.state = 440;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 439;
				this.metaEdId();
				}
			}

			this.state = 443;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 442;
				this.deprecated();
				}
			}

			this.state = 445;
			this.documentation();
			this.state = 446;
			this.totalDigits();
			this.state = 447;
			this.decimalPlaces();
			this.state = 449;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===65) {
				{
				this.state = 448;
				this.minValueDecimal();
				}
			}

			this.state = 452;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===66) {
				{
				this.state = 451;
				this.maxValueDecimal();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedInteger(): SharedIntegerContext {
		let localctx: SharedIntegerContext = new SharedIntegerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, MetaEdGrammar.RULE_sharedInteger);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 454;
			this.match(MetaEdGrammar.SHARED_INTEGER);
			this.state = 455;
			this.sharedIntegerName();
			this.state = 457;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 456;
				this.metaEdId();
				}
			}

			this.state = 460;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 459;
				this.deprecated();
				}
			}

			this.state = 462;
			this.documentation();
			this.state = 464;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===65) {
				{
				this.state = 463;
				this.minValue();
				}
			}

			this.state = 467;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===66) {
				{
				this.state = 466;
				this.maxValue();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedShort(): SharedShortContext {
		let localctx: SharedShortContext = new SharedShortContext(this, this._ctx, this.state);
		this.enterRule(localctx, 40, MetaEdGrammar.RULE_sharedShort);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 469;
			this.match(MetaEdGrammar.SHARED_SHORT);
			this.state = 470;
			this.sharedShortName();
			this.state = 472;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 471;
				this.metaEdId();
				}
			}

			this.state = 475;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 474;
				this.deprecated();
				}
			}

			this.state = 477;
			this.documentation();
			this.state = 479;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===65) {
				{
				this.state = 478;
				this.minValue();
				}
			}

			this.state = 482;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===66) {
				{
				this.state = 481;
				this.maxValue();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedString(): SharedStringContext {
		let localctx: SharedStringContext = new SharedStringContext(this, this._ctx, this.state);
		this.enterRule(localctx, 42, MetaEdGrammar.RULE_sharedString);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 484;
			this.match(MetaEdGrammar.SHARED_STRING);
			this.state = 485;
			this.sharedStringName();
			this.state = 487;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 486;
				this.metaEdId();
				}
			}

			this.state = 490;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 489;
				this.deprecated();
				}
			}

			this.state = 492;
			this.documentation();
			this.state = 494;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===63) {
				{
				this.state = 493;
				this.minLength();
				}
			}

			this.state = 496;
			this.maxLength();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public common(): CommonContext {
		let localctx: CommonContext = new CommonContext(this, this._ctx, this.state);
		this.enterRule(localctx, 44, MetaEdGrammar.RULE_common);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 498;
			this.match(MetaEdGrammar.COMMON);
			this.state = 499;
			this.commonName();
			this.state = 501;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 500;
				this.metaEdId();
				}
			}

			this.state = 504;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 503;
				this.deprecated();
				}
			}

			this.state = 506;
			this.documentation();
			this.state = 508;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 507;
				this.property();
				}
				}
				this.state = 510;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public commonExtension(): CommonExtensionContext {
		let localctx: CommonExtensionContext = new CommonExtensionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 46, MetaEdGrammar.RULE_commonExtension);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 512;
			this.match(MetaEdGrammar.COMMON);
			this.state = 513;
			this.extendeeName();
			this.state = 514;
			this.match(MetaEdGrammar.ADDITIONS);
			this.state = 516;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 515;
				this.metaEdId();
				}
			}

			this.state = 519;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 518;
				this.deprecated();
				}
			}

			this.state = 522;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 521;
				this.property();
				}
				}
				this.state = 524;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public commonSubclass(): CommonSubclassContext {
		let localctx: CommonSubclassContext = new CommonSubclassContext(this, this._ctx, this.state);
		this.enterRule(localctx, 48, MetaEdGrammar.RULE_commonSubclass);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 526;
			this.match(MetaEdGrammar.COMMON);
			this.state = 527;
			this.commonName();
			this.state = 528;
			this.match(MetaEdGrammar.BASED_ON);
			this.state = 529;
			this.baseName();
			this.state = 531;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 530;
				this.metaEdId();
				}
			}

			this.state = 534;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 533;
				this.deprecated();
				}
			}

			this.state = 536;
			this.documentation();
			this.state = 538;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 537;
				this.property();
				}
				}
				this.state = 540;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public descriptor(): DescriptorContext {
		let localctx: DescriptorContext = new DescriptorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 50, MetaEdGrammar.RULE_descriptor);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 542;
			this.match(MetaEdGrammar.DESCRIPTOR);
			this.state = 543;
			this.descriptorName();
			this.state = 545;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 544;
				this.metaEdId();
				}
			}

			this.state = 548;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 547;
				this.deprecated();
				}
			}

			this.state = 550;
			this.documentation();
			this.state = 554;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0)) {
				{
				{
				this.state = 551;
				this.property();
				}
				}
				this.state = 556;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 558;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===77 || _la===78) {
				{
				this.state = 557;
				this.withMapType();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public withMapType(): WithMapTypeContext {
		let localctx: WithMapTypeContext = new WithMapTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 52, MetaEdGrammar.RULE_withMapType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 562;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 78:
				{
				this.state = 560;
				this.requiredMapType();
				}
				break;
			case 77:
				{
				this.state = 561;
				this.optionalMapType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 564;
			this.mapTypeDocumentation();
			this.state = 566;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 565;
				this.enumerationItem();
				}
				}
				this.state = 568;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===37);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public requiredMapType(): RequiredMapTypeContext {
		let localctx: RequiredMapTypeContext = new RequiredMapTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, MetaEdGrammar.RULE_requiredMapType);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 570;
			this.match(MetaEdGrammar.WITH_MAP_TYPE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public optionalMapType(): OptionalMapTypeContext {
		let localctx: OptionalMapTypeContext = new OptionalMapTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 56, MetaEdGrammar.RULE_optionalMapType);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 572;
			this.match(MetaEdGrammar.WITH_OPTIONAL_MAP_TYPE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public domain(): DomainContext {
		let localctx: DomainContext = new DomainContext(this, this._ctx, this.state);
		this.enterRule(localctx, 58, MetaEdGrammar.RULE_domain);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 574;
			this.match(MetaEdGrammar.DOMAIN);
			this.state = 575;
			this.domainName();
			this.state = 577;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 576;
				this.metaEdId();
				}
			}

			this.state = 580;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 579;
				this.deprecated();
				}
			}

			this.state = 582;
			this.documentation();
			this.state = 584;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 583;
				this.domainItem();
				}
				}
				this.state = 586;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 265233) !== 0));
			this.state = 589;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===84) {
				{
				this.state = 588;
				this.footerDocumentation();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public domainItem(): DomainItemContext {
		let localctx: DomainItemContext = new DomainItemContext(this, this._ctx, this.state);
		this.enterRule(localctx, 60, MetaEdGrammar.RULE_domainItem);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 591;
			_la = this._input.LA(1);
			if(!(((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 265233) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 595;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 57, this._ctx) ) {
			case 1:
				{
				this.state = 592;
				this.baseNamespace();
				this.state = 593;
				this.match(MetaEdGrammar.PERIOD);
				}
				break;
			}
			this.state = 597;
			this.localDomainItemName();
			this.state = 599;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 598;
				this.metaEdId();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public footerDocumentation(): FooterDocumentationContext {
		let localctx: FooterDocumentationContext = new FooterDocumentationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 62, MetaEdGrammar.RULE_footerDocumentation);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 601;
			this.match(MetaEdGrammar.FOOTER_DOCUMENTATION);
			this.state = 602;
			this.match(MetaEdGrammar.TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public domainEntity(): DomainEntityContext {
		let localctx: DomainEntityContext = new DomainEntityContext(this, this._ctx, this.state);
		this.enterRule(localctx, 64, MetaEdGrammar.RULE_domainEntity);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 604;
			this.match(MetaEdGrammar.DOMAIN_ENTITY);
			this.state = 605;
			this.entityName();
			this.state = 607;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 606;
				this.metaEdId();
				}
			}

			this.state = 610;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 609;
				this.deprecated();
				}
			}

			this.state = 612;
			this.documentation();
			this.state = 614;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===54) {
				{
				this.state = 613;
				this.entityConfiguration();
				}
			}

			this.state = 617;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 616;
				this.property();
				}
				}
				this.state = 619;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public domainEntityExtension(): DomainEntityExtensionContext {
		let localctx: DomainEntityExtensionContext = new DomainEntityExtensionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 66, MetaEdGrammar.RULE_domainEntityExtension);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 621;
			this.match(MetaEdGrammar.DOMAIN_ENTITY);
			this.state = 622;
			this.extendeeName();
			this.state = 623;
			this.match(MetaEdGrammar.ADDITIONS);
			this.state = 625;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 624;
				this.metaEdId();
				}
			}

			this.state = 628;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 627;
				this.deprecated();
				}
			}

			this.state = 631;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 630;
				this.property();
				}
				}
				this.state = 633;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public domainEntitySubclass(): DomainEntitySubclassContext {
		let localctx: DomainEntitySubclassContext = new DomainEntitySubclassContext(this, this._ctx, this.state);
		this.enterRule(localctx, 68, MetaEdGrammar.RULE_domainEntitySubclass);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 635;
			this.match(MetaEdGrammar.DOMAIN_ENTITY);
			this.state = 636;
			this.entityName();
			this.state = 637;
			this.match(MetaEdGrammar.BASED_ON);
			this.state = 638;
			this.baseName();
			this.state = 640;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 639;
				this.metaEdId();
				}
			}

			this.state = 643;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 642;
				this.deprecated();
				}
			}

			this.state = 645;
			this.documentation();
			this.state = 647;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 646;
				this.property();
				}
				}
				this.state = 649;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumeration(): EnumerationContext {
		let localctx: EnumerationContext = new EnumerationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 70, MetaEdGrammar.RULE_enumeration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 651;
			this.match(MetaEdGrammar.ENUMERATION);
			this.state = 652;
			this.enumerationName();
			this.state = 654;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 653;
				this.metaEdId();
				}
			}

			this.state = 657;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 656;
				this.deprecated();
				}
			}

			this.state = 659;
			this.documentation();
			this.state = 661;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 660;
				this.enumerationItem();
				}
				}
				this.state = 663;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===37);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumerationItem(): EnumerationItemContext {
		let localctx: EnumerationItemContext = new EnumerationItemContext(this, this._ctx, this.state);
		this.enterRule(localctx, 72, MetaEdGrammar.RULE_enumerationItem);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 665;
			this.match(MetaEdGrammar.ENUMERATION_ITEM);
			this.state = 666;
			this.shortDescription();
			this.state = 668;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 667;
				this.metaEdId();
				}
			}

			this.state = 671;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===80) {
				{
				this.state = 670;
				this.enumerationItemDocumentation();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public shortDescription(): ShortDescriptionContext {
		let localctx: ShortDescriptionContext = new ShortDescriptionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 74, MetaEdGrammar.RULE_shortDescription);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 673;
			this.match(MetaEdGrammar.TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public inlineCommon(): InlineCommonContext {
		let localctx: InlineCommonContext = new InlineCommonContext(this, this._ctx, this.state);
		this.enterRule(localctx, 76, MetaEdGrammar.RULE_inlineCommon);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 675;
			this.match(MetaEdGrammar.INLINE_COMMON);
			this.state = 676;
			this.inlineCommonName();
			this.state = 678;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 677;
				this.metaEdId();
				}
			}

			this.state = 681;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 680;
				this.deprecated();
				}
			}

			this.state = 683;
			this.documentation();
			this.state = 685;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 684;
				this.property();
				}
				}
				this.state = 687;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 2078101501) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interchange(): InterchangeContext {
		let localctx: InterchangeContext = new InterchangeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 78, MetaEdGrammar.RULE_interchange);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 689;
			this.match(MetaEdGrammar.INTERCHANGE);
			this.state = 690;
			this.interchangeName();
			this.state = 692;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 691;
				this.metaEdId();
				}
			}

			this.state = 695;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 694;
				this.deprecated();
				}
			}

			this.state = 697;
			this.documentation();
			this.state = 699;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===82) {
				{
				this.state = 698;
				this.extendedDocumentation();
				}
			}

			this.state = 702;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===83) {
				{
				this.state = 701;
				this.useCaseDocumentation();
				}
			}

			this.state = 704;
			this.interchangeComponent();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public extendedDocumentation(): ExtendedDocumentationContext {
		let localctx: ExtendedDocumentationContext = new ExtendedDocumentationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 80, MetaEdGrammar.RULE_extendedDocumentation);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 706;
			this.match(MetaEdGrammar.EXTENDED_DOCUMENTATION);
			this.state = 707;
			this.match(MetaEdGrammar.TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public useCaseDocumentation(): UseCaseDocumentationContext {
		let localctx: UseCaseDocumentationContext = new UseCaseDocumentationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 82, MetaEdGrammar.RULE_useCaseDocumentation);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 709;
			this.match(MetaEdGrammar.USE_CASE_DOCUMENTATION);
			this.state = 710;
			this.match(MetaEdGrammar.TEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interchangeComponent(): InterchangeComponentContext {
		let localctx: InterchangeComponentContext = new InterchangeComponentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 84, MetaEdGrammar.RULE_interchangeComponent);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 715;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===21 || _la===32) {
				{
				{
				this.state = 712;
				this.interchangeIdentity();
				}
				}
				this.state = 717;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 718;
			this.interchangeElement();
			this.state = 723;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 7171) !== 0)) {
				{
				this.state = 721;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 20:
				case 30:
				case 31:
					{
					this.state = 719;
					this.interchangeElement();
					}
					break;
				case 21:
				case 32:
					{
					this.state = 720;
					this.interchangeIdentity();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 725;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interchangeElement(): InterchangeElementContext {
		let localctx: InterchangeElementContext = new InterchangeElementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 86, MetaEdGrammar.RULE_interchangeElement);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 726;
			_la = this._input.LA(1);
			if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 3222274048) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 730;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 84, this._ctx) ) {
			case 1:
				{
				this.state = 727;
				this.baseNamespace();
				this.state = 728;
				this.match(MetaEdGrammar.PERIOD);
				}
				break;
			}
			this.state = 732;
			this.localInterchangeItemName();
			this.state = 734;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 733;
				this.metaEdId();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interchangeIdentity(): InterchangeIdentityContext {
		let localctx: InterchangeIdentityContext = new InterchangeIdentityContext(this, this._ctx, this.state);
		this.enterRule(localctx, 88, MetaEdGrammar.RULE_interchangeIdentity);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 736;
			_la = this._input.LA(1);
			if(!(_la===21 || _la===32)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 740;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 86, this._ctx) ) {
			case 1:
				{
				this.state = 737;
				this.baseNamespace();
				this.state = 738;
				this.match(MetaEdGrammar.PERIOD);
				}
				break;
			}
			this.state = 742;
			this.localInterchangeItemName();
			this.state = 744;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 743;
				this.metaEdId();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interchangeExtension(): InterchangeExtensionContext {
		let localctx: InterchangeExtensionContext = new InterchangeExtensionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 90, MetaEdGrammar.RULE_interchangeExtension);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 746;
			this.match(MetaEdGrammar.INTERCHANGE);
			this.state = 747;
			this.extendeeName();
			this.state = 748;
			this.match(MetaEdGrammar.ADDITIONS);
			this.state = 750;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 749;
				this.metaEdId();
				}
			}

			this.state = 753;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 752;
				this.deprecated();
				}
			}

			this.state = 755;
			this.interchangeExtensionComponent();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interchangeExtensionComponent(): InterchangeExtensionComponentContext {
		let localctx: InterchangeExtensionComponentContext = new InterchangeExtensionComponentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 92, MetaEdGrammar.RULE_interchangeExtensionComponent);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 759;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				this.state = 759;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 20:
				case 30:
				case 31:
					{
					this.state = 757;
					this.interchangeElement();
					}
					break;
				case 21:
				case 32:
					{
					this.state = 758;
					this.interchangeIdentity();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 761;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 7171) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public subdomain(): SubdomainContext {
		let localctx: SubdomainContext = new SubdomainContext(this, this._ctx, this.state);
		this.enterRule(localctx, 94, MetaEdGrammar.RULE_subdomain);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 763;
			this.match(MetaEdGrammar.SUBDOMAIN);
			this.state = 764;
			this.subdomainName();
			this.state = 765;
			this.match(MetaEdGrammar.SUBDOMAIN_OF);
			this.state = 766;
			this.parentDomainName();
			this.state = 768;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 767;
				this.metaEdId();
				}
			}

			this.state = 771;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 770;
				this.deprecated();
				}
			}

			this.state = 773;
			this.documentation();
			this.state = 775;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 774;
				this.domainItem();
				}
				}
				this.state = 777;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 265233) !== 0));
			this.state = 781;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===74) {
				{
				this.state = 779;
				this.match(MetaEdGrammar.SUBDOMAIN_POSITION);
				this.state = 780;
				this.subdomainPosition();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public subdomainPosition(): SubdomainPositionContext {
		let localctx: SubdomainPositionContext = new SubdomainPositionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 96, MetaEdGrammar.RULE_subdomainPosition);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 783;
			this.match(MetaEdGrammar.UNSIGNED_INT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public minValue(): MinValueContext {
		let localctx: MinValueContext = new MinValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 98, MetaEdGrammar.RULE_minValue);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 785;
			this.match(MetaEdGrammar.MIN_VALUE);
			this.state = 786;
			this.signed_int();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public maxValue(): MaxValueContext {
		let localctx: MaxValueContext = new MaxValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 100, MetaEdGrammar.RULE_maxValue);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 788;
			this.match(MetaEdGrammar.MAX_VALUE);
			this.state = 789;
			this.signed_int();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public minValueDecimal(): MinValueDecimalContext {
		let localctx: MinValueDecimalContext = new MinValueDecimalContext(this, this._ctx, this.state);
		this.enterRule(localctx, 102, MetaEdGrammar.RULE_minValueDecimal);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 791;
			this.match(MetaEdGrammar.MIN_VALUE);
			this.state = 792;
			this.decimalValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public maxValueDecimal(): MaxValueDecimalContext {
		let localctx: MaxValueDecimalContext = new MaxValueDecimalContext(this, this._ctx, this.state);
		this.enterRule(localctx, 104, MetaEdGrammar.RULE_maxValueDecimal);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 794;
			this.match(MetaEdGrammar.MAX_VALUE);
			this.state = 795;
			this.decimalValue();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public decimalValue(): DecimalValueContext {
		let localctx: DecimalValueContext = new DecimalValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 106, MetaEdGrammar.RULE_decimalValue);
		try {
			this.state = 799;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 87:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 797;
				this.match(MetaEdGrammar.DECIMAL_VALUE);
				}
				break;
			case 86:
			case 90:
			case 91:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 798;
				this.signed_int();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public totalDigits(): TotalDigitsContext {
		let localctx: TotalDigitsContext = new TotalDigitsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 108, MetaEdGrammar.RULE_totalDigits);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 801;
			this.match(MetaEdGrammar.TOTAL_DIGITS);
			this.state = 802;
			this.match(MetaEdGrammar.UNSIGNED_INT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public decimalPlaces(): DecimalPlacesContext {
		let localctx: DecimalPlacesContext = new DecimalPlacesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 110, MetaEdGrammar.RULE_decimalPlaces);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 804;
			this.match(MetaEdGrammar.DECIMAL_PLACES);
			this.state = 805;
			this.match(MetaEdGrammar.UNSIGNED_INT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public commonExtensionOverride(): CommonExtensionOverrideContext {
		let localctx: CommonExtensionOverrideContext = new CommonExtensionOverrideContext(this, this._ctx, this.state);
		this.enterRule(localctx, 112, MetaEdGrammar.RULE_commonExtensionOverride);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 807;
			this.match(MetaEdGrammar.COMMON_EXTENSION);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyAnnotation(): PropertyAnnotationContext {
		let localctx: PropertyAnnotationContext = new PropertyAnnotationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 114, MetaEdGrammar.RULE_propertyAnnotation);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 815;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 56:
				{
				this.state = 809;
				this.identity();
				}
				break;
			case 57:
				{
				this.state = 810;
				this.identityRename();
				}
				break;
			case 69:
				{
				this.state = 811;
				this.required();
				}
				break;
			case 67:
				{
				this.state = 812;
				this.optional();
				}
				break;
			case 68:
			case 70:
				{
				this.state = 813;
				this.collection();
				}
				break;
			case 59:
				{
				this.state = 814;
				this.isQueryableOnly();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public identity(): IdentityContext {
		let localctx: IdentityContext = new IdentityContext(this, this._ctx, this.state);
		this.enterRule(localctx, 116, MetaEdGrammar.RULE_identity);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 817;
			this.match(MetaEdGrammar.IDENTITY);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public identityRename(): IdentityRenameContext {
		let localctx: IdentityRenameContext = new IdentityRenameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 118, MetaEdGrammar.RULE_identityRename);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 819;
			this.match(MetaEdGrammar.IDENTITY_RENAME);
			this.state = 820;
			this.baseKeyName();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public required(): RequiredContext {
		let localctx: RequiredContext = new RequiredContext(this, this._ctx, this.state);
		this.enterRule(localctx, 120, MetaEdGrammar.RULE_required);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 822;
			this.match(MetaEdGrammar.REQUIRED);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public optional(): OptionalContext {
		let localctx: OptionalContext = new OptionalContext(this, this._ctx, this.state);
		this.enterRule(localctx, 122, MetaEdGrammar.RULE_optional);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 824;
			this.match(MetaEdGrammar.OPTIONAL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public collection(): CollectionContext {
		let localctx: CollectionContext = new CollectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 124, MetaEdGrammar.RULE_collection);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 828;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 70:
				{
				this.state = 826;
				this.requiredCollection();
				}
				break;
			case 68:
				{
				this.state = 827;
				this.optionalCollection();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public requiredCollection(): RequiredCollectionContext {
		let localctx: RequiredCollectionContext = new RequiredCollectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 126, MetaEdGrammar.RULE_requiredCollection);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 830;
			this.match(MetaEdGrammar.REQUIRED_COLLECTION);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public optionalCollection(): OptionalCollectionContext {
		let localctx: OptionalCollectionContext = new OptionalCollectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 128, MetaEdGrammar.RULE_optionalCollection);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 832;
			this.match(MetaEdGrammar.OPTIONAL_COLLECTION);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public isQueryableOnly(): IsQueryableOnlyContext {
		let localctx: IsQueryableOnlyContext = new IsQueryableOnlyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 130, MetaEdGrammar.RULE_isQueryableOnly);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 834;
			this.match(MetaEdGrammar.IS_QUERYABLE_ONLY);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyComponents(): PropertyComponentsContext {
		let localctx: PropertyComponentsContext = new PropertyComponentsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 132, MetaEdGrammar.RULE_propertyComponents);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 837;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===79) {
				{
				this.state = 836;
				this.propertyDeprecated();
				}
			}

			this.state = 839;
			this.propertyDocumentation();
			this.state = 840;
			this.propertyAnnotation();
			this.state = 842;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===71) {
				{
				this.state = 841;
				this.roleName();
				}
			}

			this.state = 845;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===58) {
				{
				this.state = 844;
				this.isQueryableField();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public isQueryableField(): IsQueryableFieldContext {
		let localctx: IsQueryableFieldContext = new IsQueryableFieldContext(this, this._ctx, this.state);
		this.enterRule(localctx, 134, MetaEdGrammar.RULE_isQueryableField);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 847;
			this.match(MetaEdGrammar.IS_QUERYABLE_FIELD);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public roleName(): RoleNameContext {
		let localctx: RoleNameContext = new RoleNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 136, MetaEdGrammar.RULE_roleName);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 849;
			this.match(MetaEdGrammar.ROLE_NAME);
			this.state = 850;
			this.roleNameName();
			this.state = 853;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===72) {
				{
				this.state = 851;
				this.match(MetaEdGrammar.SHORTEN_TO);
				this.state = 852;
				this.shortenToName();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public minLength(): MinLengthContext {
		let localctx: MinLengthContext = new MinLengthContext(this, this._ctx, this.state);
		this.enterRule(localctx, 138, MetaEdGrammar.RULE_minLength);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 855;
			this.match(MetaEdGrammar.MIN_LENGTH);
			this.state = 856;
			this.match(MetaEdGrammar.UNSIGNED_INT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public maxLength(): MaxLengthContext {
		let localctx: MaxLengthContext = new MaxLengthContext(this, this._ctx, this.state);
		this.enterRule(localctx, 140, MetaEdGrammar.RULE_maxLength);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 858;
			this.match(MetaEdGrammar.MAX_LENGTH);
			this.state = 859;
			this.match(MetaEdGrammar.UNSIGNED_INT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public property(): PropertyContext {
		let localctx: PropertyContext = new PropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 142, MetaEdGrammar.RULE_property);
		try {
			this.state = 884;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 20:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 861;
				this.associationProperty();
				}
				break;
			case 22:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 862;
				this.booleanProperty();
				}
				break;
			case 23:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 863;
				this.choiceProperty();
				}
				break;
			case 24:
			case 25:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 864;
				this.commonProperty();
				}
				break;
			case 26:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 865;
				this.currencyProperty();
				}
				break;
			case 27:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 866;
				this.dateProperty();
				}
				break;
			case 28:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 867;
				this.datetimeProperty();
				}
				break;
			case 29:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 868;
				this.decimalProperty();
				}
				break;
			case 30:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 869;
				this.descriptorProperty();
				}
				break;
			case 31:
				this.enterOuterAlt(localctx, 10);
				{
				this.state = 870;
				this.domainEntityProperty();
				}
				break;
			case 34:
				this.enterOuterAlt(localctx, 11);
				{
				this.state = 871;
				this.durationProperty();
				}
				break;
			case 36:
				this.enterOuterAlt(localctx, 12);
				{
				this.state = 872;
				this.enumerationProperty();
				}
				break;
			case 38:
				this.enterOuterAlt(localctx, 13);
				{
				this.state = 873;
				this.inlineCommonProperty();
				}
				break;
			case 39:
				this.enterOuterAlt(localctx, 14);
				{
				this.state = 874;
				this.integerProperty();
				}
				break;
			case 40:
				this.enterOuterAlt(localctx, 15);
				{
				this.state = 875;
				this.percentProperty();
				}
				break;
			case 42:
				this.enterOuterAlt(localctx, 16);
				{
				this.state = 876;
				this.sharedDecimalProperty();
				}
				break;
			case 43:
				this.enterOuterAlt(localctx, 17);
				{
				this.state = 877;
				this.sharedIntegerProperty();
				}
				break;
			case 44:
				this.enterOuterAlt(localctx, 18);
				{
				this.state = 878;
				this.sharedShortProperty();
				}
				break;
			case 45:
				this.enterOuterAlt(localctx, 19);
				{
				this.state = 879;
				this.sharedStringProperty();
				}
				break;
			case 47:
				this.enterOuterAlt(localctx, 20);
				{
				this.state = 880;
				this.shortProperty();
				}
				break;
			case 48:
				this.enterOuterAlt(localctx, 21);
				{
				this.state = 881;
				this.stringProperty();
				}
				break;
			case 49:
				this.enterOuterAlt(localctx, 22);
				{
				this.state = 882;
				this.timeProperty();
				}
				break;
			case 50:
				this.enterOuterAlt(localctx, 23);
				{
				this.state = 883;
				this.yearProperty();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public booleanProperty(): BooleanPropertyContext {
		let localctx: BooleanPropertyContext = new BooleanPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 144, MetaEdGrammar.RULE_booleanProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 886;
			this.match(MetaEdGrammar.BOOLEAN);
			this.state = 887;
			this.simplePropertyName();
			this.state = 889;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 888;
				this.metaEdId();
				}
			}

			this.state = 891;
			this.propertyComponents();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public currencyProperty(): CurrencyPropertyContext {
		let localctx: CurrencyPropertyContext = new CurrencyPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 146, MetaEdGrammar.RULE_currencyProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 893;
			this.match(MetaEdGrammar.CURRENCY);
			this.state = 894;
			this.simplePropertyName();
			this.state = 896;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 895;
				this.metaEdId();
				}
			}

			this.state = 898;
			this.propertyComponents();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dateProperty(): DatePropertyContext {
		let localctx: DatePropertyContext = new DatePropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 148, MetaEdGrammar.RULE_dateProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 900;
			this.match(MetaEdGrammar.DATE);
			this.state = 901;
			this.simplePropertyName();
			this.state = 903;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 902;
				this.metaEdId();
				}
			}

			this.state = 905;
			this.propertyComponents();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public datetimeProperty(): DatetimePropertyContext {
		let localctx: DatetimePropertyContext = new DatetimePropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 150, MetaEdGrammar.RULE_datetimeProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 907;
			this.match(MetaEdGrammar.DATETIME);
			this.state = 908;
			this.simplePropertyName();
			this.state = 910;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 909;
				this.metaEdId();
				}
			}

			this.state = 912;
			this.propertyComponents();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public decimalProperty(): DecimalPropertyContext {
		let localctx: DecimalPropertyContext = new DecimalPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 152, MetaEdGrammar.RULE_decimalProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 914;
			this.match(MetaEdGrammar.DECIMAL);
			this.state = 915;
			this.simplePropertyName();
			this.state = 917;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 916;
				this.metaEdId();
				}
			}

			this.state = 919;
			this.propertyComponents();
			this.state = 920;
			this.totalDigits();
			this.state = 921;
			this.decimalPlaces();
			this.state = 923;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===65) {
				{
				this.state = 922;
				this.minValueDecimal();
				}
			}

			this.state = 926;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===66) {
				{
				this.state = 925;
				this.maxValueDecimal();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public descriptorProperty(): DescriptorPropertyContext {
		let localctx: DescriptorPropertyContext = new DescriptorPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 154, MetaEdGrammar.RULE_descriptorProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 928;
			this.match(MetaEdGrammar.DESCRIPTOR_KEYWORD);
			this.state = 929;
			this.propertyName();
			this.state = 931;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 930;
				this.metaEdId();
				}
			}

			this.state = 933;
			this.propertyComponents();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public durationProperty(): DurationPropertyContext {
		let localctx: DurationPropertyContext = new DurationPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 156, MetaEdGrammar.RULE_durationProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 935;
			this.match(MetaEdGrammar.DURATION);
			this.state = 936;
			this.simplePropertyName();
			this.state = 938;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 937;
				this.metaEdId();
				}
			}

			this.state = 940;
			this.propertyComponents();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumerationProperty(): EnumerationPropertyContext {
		let localctx: EnumerationPropertyContext = new EnumerationPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 158, MetaEdGrammar.RULE_enumerationProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 942;
			this.match(MetaEdGrammar.ENUMERATION_KEYWORD);
			this.state = 943;
			this.propertyName();
			this.state = 945;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 944;
				this.metaEdId();
				}
			}

			this.state = 947;
			this.propertyComponents();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public commonProperty(): CommonPropertyContext {
		let localctx: CommonPropertyContext = new CommonPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 160, MetaEdGrammar.RULE_commonProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 951;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 24:
				{
				this.state = 949;
				this.match(MetaEdGrammar.COMMON_KEYWORD);
				}
				break;
			case 25:
				{
				this.state = 950;
				this.commonExtensionOverride();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 953;
			this.propertyName();
			this.state = 955;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 954;
				this.metaEdId();
				}
			}

			this.state = 957;
			this.propertyComponents();
			this.state = 961;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===62) {
				{
				{
				this.state = 958;
				this.mergeDirective();
				}
				}
				this.state = 963;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public inlineCommonProperty(): InlineCommonPropertyContext {
		let localctx: InlineCommonPropertyContext = new InlineCommonPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 162, MetaEdGrammar.RULE_inlineCommonProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 964;
			this.match(MetaEdGrammar.INLINE_COMMON_KEYWORD);
			this.state = 965;
			this.propertyName();
			this.state = 967;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 966;
				this.metaEdId();
				}
			}

			this.state = 969;
			this.propertyComponents();
			this.state = 973;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===62) {
				{
				{
				this.state = 970;
				this.mergeDirective();
				}
				}
				this.state = 975;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public choiceProperty(): ChoicePropertyContext {
		let localctx: ChoicePropertyContext = new ChoicePropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 164, MetaEdGrammar.RULE_choiceProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 976;
			this.match(MetaEdGrammar.CHOICE_KEYWORD);
			this.state = 977;
			this.propertyName();
			this.state = 979;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 978;
				this.metaEdId();
				}
			}

			this.state = 981;
			this.propertyComponents();
			this.state = 985;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===62) {
				{
				{
				this.state = 982;
				this.mergeDirective();
				}
				}
				this.state = 987;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public integerProperty(): IntegerPropertyContext {
		let localctx: IntegerPropertyContext = new IntegerPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 166, MetaEdGrammar.RULE_integerProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 988;
			this.match(MetaEdGrammar.INTEGER);
			this.state = 989;
			this.simplePropertyName();
			this.state = 991;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 990;
				this.metaEdId();
				}
			}

			this.state = 993;
			this.propertyComponents();
			this.state = 995;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===65) {
				{
				this.state = 994;
				this.minValue();
				}
			}

			this.state = 998;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===66) {
				{
				this.state = 997;
				this.maxValue();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public percentProperty(): PercentPropertyContext {
		let localctx: PercentPropertyContext = new PercentPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 168, MetaEdGrammar.RULE_percentProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1000;
			this.match(MetaEdGrammar.PERCENT);
			this.state = 1001;
			this.simplePropertyName();
			this.state = 1003;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1002;
				this.metaEdId();
				}
			}

			this.state = 1005;
			this.propertyComponents();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public associationProperty(): AssociationPropertyContext {
		let localctx: AssociationPropertyContext = new AssociationPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 170, MetaEdGrammar.RULE_associationProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1007;
			this.match(MetaEdGrammar.ASSOCIATION_KEYWORD);
			this.state = 1008;
			this.propertyName();
			this.state = 1010;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1009;
				this.metaEdId();
				}
			}

			this.state = 1012;
			this.propertyComponents();
			this.state = 1014;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===61) {
				{
				this.state = 1013;
				this.potentiallyLogical();
				}
			}

			this.state = 1017;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===60) {
				{
				this.state = 1016;
				this.isWeakReference();
				}
			}

			this.state = 1022;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===62) {
				{
				{
				this.state = 1019;
				this.mergeDirective();
				}
				}
				this.state = 1024;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public domainEntityProperty(): DomainEntityPropertyContext {
		let localctx: DomainEntityPropertyContext = new DomainEntityPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 172, MetaEdGrammar.RULE_domainEntityProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1025;
			this.match(MetaEdGrammar.DOMAIN_ENTITY_KEYWORD);
			this.state = 1026;
			this.propertyName();
			this.state = 1028;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1027;
				this.metaEdId();
				}
			}

			this.state = 1030;
			this.propertyComponents();
			this.state = 1032;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===61) {
				{
				this.state = 1031;
				this.potentiallyLogical();
				}
			}

			this.state = 1035;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===60) {
				{
				this.state = 1034;
				this.isWeakReference();
				}
			}

			this.state = 1040;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===62) {
				{
				{
				this.state = 1037;
				this.mergeDirective();
				}
				}
				this.state = 1042;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedDecimalProperty(): SharedDecimalPropertyContext {
		let localctx: SharedDecimalPropertyContext = new SharedDecimalPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 174, MetaEdGrammar.RULE_sharedDecimalProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1043;
			this.match(MetaEdGrammar.SHARED_DECIMAL_KEYWORD);
			this.state = 1044;
			this.sharedPropertyType();
			this.state = 1047;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===46) {
				{
				this.state = 1045;
				this.match(MetaEdGrammar.SHARED_NAMED);
				this.state = 1046;
				this.sharedPropertyName();
				}
			}

			this.state = 1050;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1049;
				this.metaEdId();
				}
			}

			this.state = 1052;
			this.propertyComponents();
			this.state = 1056;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===62) {
				{
				{
				this.state = 1053;
				this.mergeDirective();
				}
				}
				this.state = 1058;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedIntegerProperty(): SharedIntegerPropertyContext {
		let localctx: SharedIntegerPropertyContext = new SharedIntegerPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 176, MetaEdGrammar.RULE_sharedIntegerProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1059;
			this.match(MetaEdGrammar.SHARED_INTEGER_KEYWORD);
			this.state = 1060;
			this.sharedPropertyType();
			this.state = 1063;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===46) {
				{
				this.state = 1061;
				this.match(MetaEdGrammar.SHARED_NAMED);
				this.state = 1062;
				this.sharedPropertyName();
				}
			}

			this.state = 1066;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1065;
				this.metaEdId();
				}
			}

			this.state = 1068;
			this.propertyComponents();
			this.state = 1072;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===62) {
				{
				{
				this.state = 1069;
				this.mergeDirective();
				}
				}
				this.state = 1074;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedShortProperty(): SharedShortPropertyContext {
		let localctx: SharedShortPropertyContext = new SharedShortPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 178, MetaEdGrammar.RULE_sharedShortProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1075;
			this.match(MetaEdGrammar.SHARED_SHORT_KEYWORD);
			this.state = 1076;
			this.sharedPropertyType();
			this.state = 1079;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===46) {
				{
				this.state = 1077;
				this.match(MetaEdGrammar.SHARED_NAMED);
				this.state = 1078;
				this.sharedPropertyName();
				}
			}

			this.state = 1082;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1081;
				this.metaEdId();
				}
			}

			this.state = 1084;
			this.propertyComponents();
			this.state = 1088;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===62) {
				{
				{
				this.state = 1085;
				this.mergeDirective();
				}
				}
				this.state = 1090;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedStringProperty(): SharedStringPropertyContext {
		let localctx: SharedStringPropertyContext = new SharedStringPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 180, MetaEdGrammar.RULE_sharedStringProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1091;
			this.match(MetaEdGrammar.SHARED_STRING_KEYWORD);
			this.state = 1092;
			this.sharedPropertyType();
			this.state = 1095;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===46) {
				{
				this.state = 1093;
				this.match(MetaEdGrammar.SHARED_NAMED);
				this.state = 1094;
				this.sharedPropertyName();
				}
			}

			this.state = 1098;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1097;
				this.metaEdId();
				}
			}

			this.state = 1100;
			this.propertyComponents();
			this.state = 1104;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===62) {
				{
				{
				this.state = 1101;
				this.mergeDirective();
				}
				}
				this.state = 1106;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public shortProperty(): ShortPropertyContext {
		let localctx: ShortPropertyContext = new ShortPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 182, MetaEdGrammar.RULE_shortProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1107;
			this.match(MetaEdGrammar.SHORT);
			this.state = 1108;
			this.simplePropertyName();
			this.state = 1110;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1109;
				this.metaEdId();
				}
			}

			this.state = 1112;
			this.propertyComponents();
			this.state = 1114;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===65) {
				{
				this.state = 1113;
				this.minValue();
				}
			}

			this.state = 1117;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===66) {
				{
				this.state = 1116;
				this.maxValue();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public stringProperty(): StringPropertyContext {
		let localctx: StringPropertyContext = new StringPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 184, MetaEdGrammar.RULE_stringProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1119;
			this.match(MetaEdGrammar.STRING);
			this.state = 1120;
			this.simplePropertyName();
			this.state = 1122;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1121;
				this.metaEdId();
				}
			}

			this.state = 1124;
			this.propertyComponents();
			this.state = 1126;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===63) {
				{
				this.state = 1125;
				this.minLength();
				}
			}

			this.state = 1128;
			this.maxLength();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public timeProperty(): TimePropertyContext {
		let localctx: TimePropertyContext = new TimePropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 186, MetaEdGrammar.RULE_timeProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1130;
			this.match(MetaEdGrammar.TIME);
			this.state = 1131;
			this.simplePropertyName();
			this.state = 1133;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1132;
				this.metaEdId();
				}
			}

			this.state = 1135;
			this.propertyComponents();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public yearProperty(): YearPropertyContext {
		let localctx: YearPropertyContext = new YearPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 188, MetaEdGrammar.RULE_yearProperty);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1137;
			this.match(MetaEdGrammar.YEAR);
			this.state = 1138;
			this.simplePropertyName();
			this.state = 1140;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===89) {
				{
				this.state = 1139;
				this.metaEdId();
				}
			}

			this.state = 1142;
			this.propertyComponents();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public isWeakReference(): IsWeakReferenceContext {
		let localctx: IsWeakReferenceContext = new IsWeakReferenceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 190, MetaEdGrammar.RULE_isWeakReference);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1144;
			this.match(MetaEdGrammar.IS_WEAK_REFERENCE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public potentiallyLogical(): PotentiallyLogicalContext {
		let localctx: PotentiallyLogicalContext = new PotentiallyLogicalContext(this, this._ctx, this.state);
		this.enterRule(localctx, 192, MetaEdGrammar.RULE_potentiallyLogical);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1146;
			this.match(MetaEdGrammar.POTENTIALLY_LOGICAL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public mergeDirective(): MergeDirectiveContext {
		let localctx: MergeDirectiveContext = new MergeDirectiveContext(this, this._ctx, this.state);
		this.enterRule(localctx, 194, MetaEdGrammar.RULE_mergeDirective);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1148;
			this.match(MetaEdGrammar.MERGE_REFERENCE);
			this.state = 1149;
			this.sourcePropertyPath();
			this.state = 1150;
			this.match(MetaEdGrammar.WITH);
			this.state = 1151;
			this.targetPropertyPath();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sourcePropertyPath(): SourcePropertyPathContext {
		let localctx: SourcePropertyPathContext = new SourcePropertyPathContext(this, this._ctx, this.state);
		this.enterRule(localctx, 196, MetaEdGrammar.RULE_sourcePropertyPath);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1153;
			this.propertyPath();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public targetPropertyPath(): TargetPropertyPathContext {
		let localctx: TargetPropertyPathContext = new TargetPropertyPathContext(this, this._ctx, this.state);
		this.enterRule(localctx, 198, MetaEdGrammar.RULE_targetPropertyPath);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1155;
			this.propertyPath();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyPath(): PropertyPathContext {
		let localctx: PropertyPathContext = new PropertyPathContext(this, this._ctx, this.state);
		this.enterRule(localctx, 200, MetaEdGrammar.RULE_propertyPath);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1157;
			this.match(MetaEdGrammar.ID);
			this.state = 1162;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===92) {
				{
				{
				this.state = 1158;
				this.match(MetaEdGrammar.PERIOD);
				this.state = 1159;
				this.match(MetaEdGrammar.ID);
				}
				}
				this.state = 1164;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public signed_int(): Signed_intContext {
		let localctx: Signed_intContext = new Signed_intContext(this, this._ctx, this.state);
		this.enterRule(localctx, 202, MetaEdGrammar.RULE_signed_int);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1166;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===90 || _la===91) {
				{
				this.state = 1165;
				this.unaryOperator();
				}
			}

			this.state = 1168;
			this.match(MetaEdGrammar.UNSIGNED_INT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public unaryOperator(): UnaryOperatorContext {
		let localctx: UnaryOperatorContext = new UnaryOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 204, MetaEdGrammar.RULE_unaryOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1170;
			_la = this._input.LA(1);
			if(!(_la===90 || _la===91)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public abstractEntityName(): AbstractEntityNameContext {
		let localctx: AbstractEntityNameContext = new AbstractEntityNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 206, MetaEdGrammar.RULE_abstractEntityName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1172;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public associationName(): AssociationNameContext {
		let localctx: AssociationNameContext = new AssociationNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 208, MetaEdGrammar.RULE_associationName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1174;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public baseKeyName(): BaseKeyNameContext {
		let localctx: BaseKeyNameContext = new BaseKeyNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 210, MetaEdGrammar.RULE_baseKeyName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1176;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public baseName(): BaseNameContext {
		let localctx: BaseNameContext = new BaseNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 212, MetaEdGrammar.RULE_baseName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1181;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 154, this._ctx) ) {
			case 1:
				{
				this.state = 1178;
				this.baseNamespace();
				this.state = 1179;
				this.match(MetaEdGrammar.PERIOD);
				}
				break;
			}
			this.state = 1183;
			this.localBaseName();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public baseNamespace(): BaseNamespaceContext {
		let localctx: BaseNamespaceContext = new BaseNamespaceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 214, MetaEdGrammar.RULE_baseNamespace);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1185;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public choiceName(): ChoiceNameContext {
		let localctx: ChoiceNameContext = new ChoiceNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 216, MetaEdGrammar.RULE_choiceName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1187;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedDecimalName(): SharedDecimalNameContext {
		let localctx: SharedDecimalNameContext = new SharedDecimalNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 218, MetaEdGrammar.RULE_sharedDecimalName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1189;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedIntegerName(): SharedIntegerNameContext {
		let localctx: SharedIntegerNameContext = new SharedIntegerNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 220, MetaEdGrammar.RULE_sharedIntegerName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1191;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public commonName(): CommonNameContext {
		let localctx: CommonNameContext = new CommonNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 222, MetaEdGrammar.RULE_commonName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1193;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedShortName(): SharedShortNameContext {
		let localctx: SharedShortNameContext = new SharedShortNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 224, MetaEdGrammar.RULE_sharedShortName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1195;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedStringName(): SharedStringNameContext {
		let localctx: SharedStringNameContext = new SharedStringNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 226, MetaEdGrammar.RULE_sharedStringName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1197;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public descriptorName(): DescriptorNameContext {
		let localctx: DescriptorNameContext = new DescriptorNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 228, MetaEdGrammar.RULE_descriptorName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1199;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public domainName(): DomainNameContext {
		let localctx: DomainNameContext = new DomainNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 230, MetaEdGrammar.RULE_domainName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1201;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public entityName(): EntityNameContext {
		let localctx: EntityNameContext = new EntityNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 232, MetaEdGrammar.RULE_entityName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1203;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumerationName(): EnumerationNameContext {
		let localctx: EnumerationNameContext = new EnumerationNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 234, MetaEdGrammar.RULE_enumerationName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1205;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public extendeeName(): ExtendeeNameContext {
		let localctx: ExtendeeNameContext = new ExtendeeNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 236, MetaEdGrammar.RULE_extendeeName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1210;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 155, this._ctx) ) {
			case 1:
				{
				this.state = 1207;
				this.extendeeNamespace();
				this.state = 1208;
				this.match(MetaEdGrammar.PERIOD);
				}
				break;
			}
			this.state = 1212;
			this.localExtendeeName();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public extendeeNamespace(): ExtendeeNamespaceContext {
		let localctx: ExtendeeNamespaceContext = new ExtendeeNamespaceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 238, MetaEdGrammar.RULE_extendeeNamespace);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1214;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public inlineCommonName(): InlineCommonNameContext {
		let localctx: InlineCommonNameContext = new InlineCommonNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 240, MetaEdGrammar.RULE_inlineCommonName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1216;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public interchangeName(): InterchangeNameContext {
		let localctx: InterchangeNameContext = new InterchangeNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 242, MetaEdGrammar.RULE_interchangeName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1218;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public localBaseName(): LocalBaseNameContext {
		let localctx: LocalBaseNameContext = new LocalBaseNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 244, MetaEdGrammar.RULE_localBaseName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1220;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public localDomainItemName(): LocalDomainItemNameContext {
		let localctx: LocalDomainItemNameContext = new LocalDomainItemNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 246, MetaEdGrammar.RULE_localDomainItemName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1222;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public localExtendeeName(): LocalExtendeeNameContext {
		let localctx: LocalExtendeeNameContext = new LocalExtendeeNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 248, MetaEdGrammar.RULE_localExtendeeName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1224;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public localInterchangeItemName(): LocalInterchangeItemNameContext {
		let localctx: LocalInterchangeItemNameContext = new LocalInterchangeItemNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 250, MetaEdGrammar.RULE_localInterchangeItemName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1226;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public localPropertyName(): LocalPropertyNameContext {
		let localctx: LocalPropertyNameContext = new LocalPropertyNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 252, MetaEdGrammar.RULE_localPropertyName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1228;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public localPropertyType(): LocalPropertyTypeContext {
		let localctx: LocalPropertyTypeContext = new LocalPropertyTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 254, MetaEdGrammar.RULE_localPropertyType);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1230;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parentDomainName(): ParentDomainNameContext {
		let localctx: ParentDomainNameContext = new ParentDomainNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 256, MetaEdGrammar.RULE_parentDomainName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1232;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyName(): PropertyNameContext {
		let localctx: PropertyNameContext = new PropertyNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 258, MetaEdGrammar.RULE_propertyName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1237;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 156, this._ctx) ) {
			case 1:
				{
				this.state = 1234;
				this.propertyNamespace();
				this.state = 1235;
				this.match(MetaEdGrammar.PERIOD);
				}
				break;
			}
			this.state = 1239;
			this.localPropertyName();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyNamespace(): PropertyNamespaceContext {
		let localctx: PropertyNamespaceContext = new PropertyNamespaceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 260, MetaEdGrammar.RULE_propertyNamespace);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1241;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public roleNameName(): RoleNameNameContext {
		let localctx: RoleNameNameContext = new RoleNameNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 262, MetaEdGrammar.RULE_roleNameName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1243;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedPropertyName(): SharedPropertyNameContext {
		let localctx: SharedPropertyNameContext = new SharedPropertyNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 264, MetaEdGrammar.RULE_sharedPropertyName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1245;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sharedPropertyType(): SharedPropertyTypeContext {
		let localctx: SharedPropertyTypeContext = new SharedPropertyTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 266, MetaEdGrammar.RULE_sharedPropertyType);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1250;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 157, this._ctx) ) {
			case 1:
				{
				this.state = 1247;
				this.propertyNamespace();
				this.state = 1248;
				this.match(MetaEdGrammar.PERIOD);
				}
				break;
			}
			this.state = 1252;
			this.localPropertyType();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public shortenToName(): ShortenToNameContext {
		let localctx: ShortenToNameContext = new ShortenToNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 268, MetaEdGrammar.RULE_shortenToName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1254;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simplePropertyName(): SimplePropertyNameContext {
		let localctx: SimplePropertyNameContext = new SimplePropertyNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 270, MetaEdGrammar.RULE_simplePropertyName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1256;
			this.localPropertyName();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public subdomainName(): SubdomainNameContext {
		let localctx: SubdomainNameContext = new SubdomainNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 272, MetaEdGrammar.RULE_subdomainName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1258;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public namespaceName(): NamespaceNameContext {
		let localctx: NamespaceNameContext = new NamespaceNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 274, MetaEdGrammar.RULE_namespaceName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1260;
			this.match(MetaEdGrammar.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public metaEdId(): MetaEdIdContext {
		let localctx: MetaEdIdContext = new MetaEdIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 276, MetaEdGrammar.RULE_metaEdId);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1262;
			this.match(MetaEdGrammar.METAED_ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public static readonly _serializedATN: number[] = [4,1,95,1265,2,0,7,0,
	2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,
	2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,
	17,7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,
	7,24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,
	31,2,32,7,32,2,33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,
	2,39,7,39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
	46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,52,2,53,
	7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,2,59,7,59,2,60,7,
	60,2,61,7,61,2,62,7,62,2,63,7,63,2,64,7,64,2,65,7,65,2,66,7,66,2,67,7,67,
	2,68,7,68,2,69,7,69,2,70,7,70,2,71,7,71,2,72,7,72,2,73,7,73,2,74,7,74,2,
	75,7,75,2,76,7,76,2,77,7,77,2,78,7,78,2,79,7,79,2,80,7,80,2,81,7,81,2,82,
	7,82,2,83,7,83,2,84,7,84,2,85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,2,89,7,
	89,2,90,7,90,2,91,7,91,2,92,7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,96,7,96,
	2,97,7,97,2,98,7,98,2,99,7,99,2,100,7,100,2,101,7,101,2,102,7,102,2,103,
	7,103,2,104,7,104,2,105,7,105,2,106,7,106,2,107,7,107,2,108,7,108,2,109,
	7,109,2,110,7,110,2,111,7,111,2,112,7,112,2,113,7,113,2,114,7,114,2,115,
	7,115,2,116,7,116,2,117,7,117,2,118,7,118,2,119,7,119,2,120,7,120,2,121,
	7,121,2,122,7,122,2,123,7,123,2,124,7,124,2,125,7,125,2,126,7,126,2,127,
	7,127,2,128,7,128,2,129,7,129,2,130,7,130,2,131,7,131,2,132,7,132,2,133,
	7,133,2,134,7,134,2,135,7,135,2,136,7,136,2,137,7,137,2,138,7,138,1,0,4,
	0,280,8,0,11,0,12,0,281,1,1,1,1,1,1,1,1,4,1,288,8,1,11,1,12,1,289,1,1,1,
	1,1,2,1,2,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,
	3,1,3,1,3,1,3,1,3,1,3,1,3,3,3,318,8,3,1,4,1,4,1,4,1,5,1,5,1,5,1,6,1,6,1,
	6,1,7,1,7,1,7,1,8,1,8,1,8,1,9,1,9,1,9,1,10,1,10,1,10,3,10,341,8,10,1,10,
	3,10,344,8,10,1,10,1,10,4,10,348,8,10,11,10,12,10,349,1,11,1,11,1,12,1,
	12,1,13,1,13,1,13,3,13,359,8,13,1,13,3,13,362,8,13,1,13,1,13,3,13,366,8,
	13,1,13,1,13,1,13,5,13,371,8,13,10,13,12,13,374,9,13,1,14,1,14,1,14,3,14,
	379,8,14,1,14,3,14,382,8,14,1,14,1,14,3,14,386,8,14,1,14,5,14,389,8,14,
	10,14,12,14,392,9,14,1,15,1,15,1,15,1,15,3,15,398,8,15,1,15,3,15,401,8,
	15,1,15,4,15,404,8,15,11,15,12,15,405,1,16,1,16,1,16,1,16,1,16,3,16,413,
	8,16,1,16,3,16,416,8,16,1,16,1,16,4,16,420,8,16,11,16,12,16,421,1,17,1,
	17,1,17,3,17,427,8,17,1,17,3,17,430,8,17,1,17,1,17,4,17,434,8,17,11,17,
	12,17,435,1,18,1,18,1,18,3,18,441,8,18,1,18,3,18,444,8,18,1,18,1,18,1,18,
	1,18,3,18,450,8,18,1,18,3,18,453,8,18,1,19,1,19,1,19,3,19,458,8,19,1,19,
	3,19,461,8,19,1,19,1,19,3,19,465,8,19,1,19,3,19,468,8,19,1,20,1,20,1,20,
	3,20,473,8,20,1,20,3,20,476,8,20,1,20,1,20,3,20,480,8,20,1,20,3,20,483,
	8,20,1,21,1,21,1,21,3,21,488,8,21,1,21,3,21,491,8,21,1,21,1,21,3,21,495,
	8,21,1,21,1,21,1,22,1,22,1,22,3,22,502,8,22,1,22,3,22,505,8,22,1,22,1,22,
	4,22,509,8,22,11,22,12,22,510,1,23,1,23,1,23,1,23,3,23,517,8,23,1,23,3,
	23,520,8,23,1,23,4,23,523,8,23,11,23,12,23,524,1,24,1,24,1,24,1,24,1,24,
	3,24,532,8,24,1,24,3,24,535,8,24,1,24,1,24,4,24,539,8,24,11,24,12,24,540,
	1,25,1,25,1,25,3,25,546,8,25,1,25,3,25,549,8,25,1,25,1,25,5,25,553,8,25,
	10,25,12,25,556,9,25,1,25,3,25,559,8,25,1,26,1,26,3,26,563,8,26,1,26,1,
	26,4,26,567,8,26,11,26,12,26,568,1,27,1,27,1,28,1,28,1,29,1,29,1,29,3,29,
	578,8,29,1,29,3,29,581,8,29,1,29,1,29,4,29,585,8,29,11,29,12,29,586,1,29,
	3,29,590,8,29,1,30,1,30,1,30,1,30,3,30,596,8,30,1,30,1,30,3,30,600,8,30,
	1,31,1,31,1,31,1,32,1,32,1,32,3,32,608,8,32,1,32,3,32,611,8,32,1,32,1,32,
	3,32,615,8,32,1,32,4,32,618,8,32,11,32,12,32,619,1,33,1,33,1,33,1,33,3,
	33,626,8,33,1,33,3,33,629,8,33,1,33,4,33,632,8,33,11,33,12,33,633,1,34,
	1,34,1,34,1,34,1,34,3,34,641,8,34,1,34,3,34,644,8,34,1,34,1,34,4,34,648,
	8,34,11,34,12,34,649,1,35,1,35,1,35,3,35,655,8,35,1,35,3,35,658,8,35,1,
	35,1,35,4,35,662,8,35,11,35,12,35,663,1,36,1,36,1,36,3,36,669,8,36,1,36,
	3,36,672,8,36,1,37,1,37,1,38,1,38,1,38,3,38,679,8,38,1,38,3,38,682,8,38,
	1,38,1,38,4,38,686,8,38,11,38,12,38,687,1,39,1,39,1,39,3,39,693,8,39,1,
	39,3,39,696,8,39,1,39,1,39,3,39,700,8,39,1,39,3,39,703,8,39,1,39,1,39,1,
	40,1,40,1,40,1,41,1,41,1,41,1,42,5,42,714,8,42,10,42,12,42,717,9,42,1,42,
	1,42,1,42,5,42,722,8,42,10,42,12,42,725,9,42,1,43,1,43,1,43,1,43,3,43,731,
	8,43,1,43,1,43,3,43,735,8,43,1,44,1,44,1,44,1,44,3,44,741,8,44,1,44,1,44,
	3,44,745,8,44,1,45,1,45,1,45,1,45,3,45,751,8,45,1,45,3,45,754,8,45,1,45,
	1,45,1,46,1,46,4,46,760,8,46,11,46,12,46,761,1,47,1,47,1,47,1,47,1,47,3,
	47,769,8,47,1,47,3,47,772,8,47,1,47,1,47,4,47,776,8,47,11,47,12,47,777,
	1,47,1,47,3,47,782,8,47,1,48,1,48,1,49,1,49,1,49,1,50,1,50,1,50,1,51,1,
	51,1,51,1,52,1,52,1,52,1,53,1,53,3,53,800,8,53,1,54,1,54,1,54,1,55,1,55,
	1,55,1,56,1,56,1,57,1,57,1,57,1,57,1,57,1,57,3,57,816,8,57,1,58,1,58,1,
	59,1,59,1,59,1,60,1,60,1,61,1,61,1,62,1,62,3,62,829,8,62,1,63,1,63,1,64,
	1,64,1,65,1,65,1,66,3,66,838,8,66,1,66,1,66,1,66,3,66,843,8,66,1,66,3,66,
	846,8,66,1,67,1,67,1,68,1,68,1,68,1,68,3,68,854,8,68,1,69,1,69,1,69,1,70,
	1,70,1,70,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,
	71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,3,71,885,8,71,1,72,
	1,72,1,72,3,72,890,8,72,1,72,1,72,1,73,1,73,1,73,3,73,897,8,73,1,73,1,73,
	1,74,1,74,1,74,3,74,904,8,74,1,74,1,74,1,75,1,75,1,75,3,75,911,8,75,1,75,
	1,75,1,76,1,76,1,76,3,76,918,8,76,1,76,1,76,1,76,1,76,3,76,924,8,76,1,76,
	3,76,927,8,76,1,77,1,77,1,77,3,77,932,8,77,1,77,1,77,1,78,1,78,1,78,3,78,
	939,8,78,1,78,1,78,1,79,1,79,1,79,3,79,946,8,79,1,79,1,79,1,80,1,80,3,80,
	952,8,80,1,80,1,80,3,80,956,8,80,1,80,1,80,5,80,960,8,80,10,80,12,80,963,
	9,80,1,81,1,81,1,81,3,81,968,8,81,1,81,1,81,5,81,972,8,81,10,81,12,81,975,
	9,81,1,82,1,82,1,82,3,82,980,8,82,1,82,1,82,5,82,984,8,82,10,82,12,82,987,
	9,82,1,83,1,83,1,83,3,83,992,8,83,1,83,1,83,3,83,996,8,83,1,83,3,83,999,
	8,83,1,84,1,84,1,84,3,84,1004,8,84,1,84,1,84,1,85,1,85,1,85,3,85,1011,8,
	85,1,85,1,85,3,85,1015,8,85,1,85,3,85,1018,8,85,1,85,5,85,1021,8,85,10,
	85,12,85,1024,9,85,1,86,1,86,1,86,3,86,1029,8,86,1,86,1,86,3,86,1033,8,
	86,1,86,3,86,1036,8,86,1,86,5,86,1039,8,86,10,86,12,86,1042,9,86,1,87,1,
	87,1,87,1,87,3,87,1048,8,87,1,87,3,87,1051,8,87,1,87,1,87,5,87,1055,8,87,
	10,87,12,87,1058,9,87,1,88,1,88,1,88,1,88,3,88,1064,8,88,1,88,3,88,1067,
	8,88,1,88,1,88,5,88,1071,8,88,10,88,12,88,1074,9,88,1,89,1,89,1,89,1,89,
	3,89,1080,8,89,1,89,3,89,1083,8,89,1,89,1,89,5,89,1087,8,89,10,89,12,89,
	1090,9,89,1,90,1,90,1,90,1,90,3,90,1096,8,90,1,90,3,90,1099,8,90,1,90,1,
	90,5,90,1103,8,90,10,90,12,90,1106,9,90,1,91,1,91,1,91,3,91,1111,8,91,1,
	91,1,91,3,91,1115,8,91,1,91,3,91,1118,8,91,1,92,1,92,1,92,3,92,1123,8,92,
	1,92,1,92,3,92,1127,8,92,1,92,1,92,1,93,1,93,1,93,3,93,1134,8,93,1,93,1,
	93,1,94,1,94,1,94,3,94,1141,8,94,1,94,1,94,1,95,1,95,1,96,1,96,1,97,1,97,
	1,97,1,97,1,97,1,98,1,98,1,99,1,99,1,100,1,100,1,100,5,100,1161,8,100,10,
	100,12,100,1164,9,100,1,101,3,101,1167,8,101,1,101,1,101,1,102,1,102,1,
	103,1,103,1,104,1,104,1,105,1,105,1,106,1,106,1,106,3,106,1182,8,106,1,
	106,1,106,1,107,1,107,1,108,1,108,1,109,1,109,1,110,1,110,1,111,1,111,1,
	112,1,112,1,113,1,113,1,114,1,114,1,115,1,115,1,116,1,116,1,117,1,117,1,
	118,1,118,1,118,3,118,1211,8,118,1,118,1,118,1,119,1,119,1,120,1,120,1,
	121,1,121,1,122,1,122,1,123,1,123,1,124,1,124,1,125,1,125,1,126,1,126,1,
	127,1,127,1,128,1,128,1,129,1,129,1,129,3,129,1238,8,129,1,129,1,129,1,
	130,1,130,1,131,1,131,1,132,1,132,1,133,1,133,1,133,3,133,1251,8,133,1,
	133,1,133,1,134,1,134,1,135,1,135,1,136,1,136,1,137,1,137,1,138,1,138,1,
	138,0,0,139,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,
	44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,
	92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,
	130,132,134,136,138,140,142,144,146,148,150,152,154,156,158,160,162,164,
	166,168,170,172,174,176,178,180,182,184,186,188,190,192,194,196,198,200,
	202,204,206,208,210,212,214,216,218,220,222,224,226,228,230,232,234,236,
	238,240,242,244,246,248,250,252,254,256,258,260,262,264,266,268,270,272,
	274,276,0,6,2,0,53,53,85,85,2,0,81,81,88,88,4,0,20,20,24,24,30,31,38,38,
	2,0,20,20,30,31,2,0,21,21,32,32,1,0,90,91,1328,0,279,1,0,0,0,2,283,1,0,
	0,0,4,293,1,0,0,0,6,317,1,0,0,0,8,319,1,0,0,0,10,322,1,0,0,0,12,325,1,0,
	0,0,14,328,1,0,0,0,16,331,1,0,0,0,18,334,1,0,0,0,20,337,1,0,0,0,22,351,
	1,0,0,0,24,353,1,0,0,0,26,355,1,0,0,0,28,375,1,0,0,0,30,393,1,0,0,0,32,
	407,1,0,0,0,34,423,1,0,0,0,36,437,1,0,0,0,38,454,1,0,0,0,40,469,1,0,0,0,
	42,484,1,0,0,0,44,498,1,0,0,0,46,512,1,0,0,0,48,526,1,0,0,0,50,542,1,0,
	0,0,52,562,1,0,0,0,54,570,1,0,0,0,56,572,1,0,0,0,58,574,1,0,0,0,60,591,
	1,0,0,0,62,601,1,0,0,0,64,604,1,0,0,0,66,621,1,0,0,0,68,635,1,0,0,0,70,
	651,1,0,0,0,72,665,1,0,0,0,74,673,1,0,0,0,76,675,1,0,0,0,78,689,1,0,0,0,
	80,706,1,0,0,0,82,709,1,0,0,0,84,715,1,0,0,0,86,726,1,0,0,0,88,736,1,0,
	0,0,90,746,1,0,0,0,92,759,1,0,0,0,94,763,1,0,0,0,96,783,1,0,0,0,98,785,
	1,0,0,0,100,788,1,0,0,0,102,791,1,0,0,0,104,794,1,0,0,0,106,799,1,0,0,0,
	108,801,1,0,0,0,110,804,1,0,0,0,112,807,1,0,0,0,114,815,1,0,0,0,116,817,
	1,0,0,0,118,819,1,0,0,0,120,822,1,0,0,0,122,824,1,0,0,0,124,828,1,0,0,0,
	126,830,1,0,0,0,128,832,1,0,0,0,130,834,1,0,0,0,132,837,1,0,0,0,134,847,
	1,0,0,0,136,849,1,0,0,0,138,855,1,0,0,0,140,858,1,0,0,0,142,884,1,0,0,0,
	144,886,1,0,0,0,146,893,1,0,0,0,148,900,1,0,0,0,150,907,1,0,0,0,152,914,
	1,0,0,0,154,928,1,0,0,0,156,935,1,0,0,0,158,942,1,0,0,0,160,951,1,0,0,0,
	162,964,1,0,0,0,164,976,1,0,0,0,166,988,1,0,0,0,168,1000,1,0,0,0,170,1007,
	1,0,0,0,172,1025,1,0,0,0,174,1043,1,0,0,0,176,1059,1,0,0,0,178,1075,1,0,
	0,0,180,1091,1,0,0,0,182,1107,1,0,0,0,184,1119,1,0,0,0,186,1130,1,0,0,0,
	188,1137,1,0,0,0,190,1144,1,0,0,0,192,1146,1,0,0,0,194,1148,1,0,0,0,196,
	1153,1,0,0,0,198,1155,1,0,0,0,200,1157,1,0,0,0,202,1166,1,0,0,0,204,1170,
	1,0,0,0,206,1172,1,0,0,0,208,1174,1,0,0,0,210,1176,1,0,0,0,212,1181,1,0,
	0,0,214,1185,1,0,0,0,216,1187,1,0,0,0,218,1189,1,0,0,0,220,1191,1,0,0,0,
	222,1193,1,0,0,0,224,1195,1,0,0,0,226,1197,1,0,0,0,228,1199,1,0,0,0,230,
	1201,1,0,0,0,232,1203,1,0,0,0,234,1205,1,0,0,0,236,1210,1,0,0,0,238,1214,
	1,0,0,0,240,1216,1,0,0,0,242,1218,1,0,0,0,244,1220,1,0,0,0,246,1222,1,0,
	0,0,248,1224,1,0,0,0,250,1226,1,0,0,0,252,1228,1,0,0,0,254,1230,1,0,0,0,
	256,1232,1,0,0,0,258,1237,1,0,0,0,260,1241,1,0,0,0,262,1243,1,0,0,0,264,
	1245,1,0,0,0,266,1250,1,0,0,0,268,1254,1,0,0,0,270,1256,1,0,0,0,272,1258,
	1,0,0,0,274,1260,1,0,0,0,276,1262,1,0,0,0,278,280,3,2,1,0,279,278,1,0,0,
	0,280,281,1,0,0,0,281,279,1,0,0,0,281,282,1,0,0,0,282,1,1,0,0,0,283,284,
	5,3,0,0,284,285,3,274,137,0,285,287,3,4,2,0,286,288,3,6,3,0,287,286,1,0,
	0,0,288,289,1,0,0,0,289,287,1,0,0,0,289,290,1,0,0,0,290,291,1,0,0,0,291,
	292,5,4,0,0,292,3,1,0,0,0,293,294,7,0,0,0,294,5,1,0,0,0,295,318,3,20,10,
	0,296,318,3,26,13,0,297,318,3,30,15,0,298,318,3,32,16,0,299,318,3,34,17,
	0,300,318,3,36,18,0,301,318,3,38,19,0,302,318,3,40,20,0,303,318,3,42,21,
	0,304,318,3,44,22,0,305,318,3,46,23,0,306,318,3,48,24,0,307,318,3,50,25,
	0,308,318,3,64,32,0,309,318,3,66,33,0,310,318,3,68,34,0,311,318,3,70,35,
	0,312,318,3,76,38,0,313,318,3,78,39,0,314,318,3,90,45,0,315,318,3,58,29,
	0,316,318,3,94,47,0,317,295,1,0,0,0,317,296,1,0,0,0,317,297,1,0,0,0,317,
	298,1,0,0,0,317,299,1,0,0,0,317,300,1,0,0,0,317,301,1,0,0,0,317,302,1,0,
	0,0,317,303,1,0,0,0,317,304,1,0,0,0,317,305,1,0,0,0,317,306,1,0,0,0,317,
	307,1,0,0,0,317,308,1,0,0,0,317,309,1,0,0,0,317,310,1,0,0,0,317,311,1,0,
	0,0,317,312,1,0,0,0,317,313,1,0,0,0,317,314,1,0,0,0,317,315,1,0,0,0,317,
	316,1,0,0,0,318,7,1,0,0,0,319,320,5,79,0,0,320,321,5,88,0,0,321,9,1,0,0,
	0,322,323,5,79,0,0,323,324,5,88,0,0,324,11,1,0,0,0,325,326,5,80,0,0,326,
	327,5,88,0,0,327,13,1,0,0,0,328,329,5,80,0,0,329,330,5,88,0,0,330,15,1,
	0,0,0,331,332,5,80,0,0,332,333,5,88,0,0,333,17,1,0,0,0,334,335,5,80,0,0,
	335,336,7,1,0,0,336,19,1,0,0,0,337,338,5,1,0,0,338,340,3,206,103,0,339,
	341,3,276,138,0,340,339,1,0,0,0,340,341,1,0,0,0,341,343,1,0,0,0,342,344,
	3,8,4,0,343,342,1,0,0,0,343,344,1,0,0,0,344,345,1,0,0,0,345,347,3,12,6,
	0,346,348,3,142,71,0,347,346,1,0,0,0,348,349,1,0,0,0,349,347,1,0,0,0,349,
	350,1,0,0,0,350,21,1,0,0,0,351,352,3,24,12,0,352,23,1,0,0,0,353,354,5,54,
	0,0,354,25,1,0,0,0,355,356,5,2,0,0,356,358,3,208,104,0,357,359,3,276,138,
	0,358,357,1,0,0,0,358,359,1,0,0,0,359,361,1,0,0,0,360,362,3,8,4,0,361,360,
	1,0,0,0,361,362,1,0,0,0,362,363,1,0,0,0,363,365,3,12,6,0,364,366,3,22,11,
	0,365,364,1,0,0,0,365,366,1,0,0,0,366,367,1,0,0,0,367,368,3,28,14,0,368,
	372,3,28,14,0,369,371,3,142,71,0,370,369,1,0,0,0,371,374,1,0,0,0,372,370,
	1,0,0,0,372,373,1,0,0,0,373,27,1,0,0,0,374,372,1,0,0,0,375,376,5,31,0,0,
	376,378,3,258,129,0,377,379,3,276,138,0,378,377,1,0,0,0,378,379,1,0,0,0,
	379,381,1,0,0,0,380,382,3,10,5,0,381,380,1,0,0,0,381,382,1,0,0,0,382,383,
	1,0,0,0,383,385,3,18,9,0,384,386,3,136,68,0,385,384,1,0,0,0,385,386,1,0,
	0,0,386,390,1,0,0,0,387,389,3,194,97,0,388,387,1,0,0,0,389,392,1,0,0,0,
	390,388,1,0,0,0,390,391,1,0,0,0,391,29,1,0,0,0,392,390,1,0,0,0,393,394,
	5,2,0,0,394,395,3,236,118,0,395,397,5,51,0,0,396,398,3,276,138,0,397,396,
	1,0,0,0,397,398,1,0,0,0,398,400,1,0,0,0,399,401,3,8,4,0,400,399,1,0,0,0,
	400,401,1,0,0,0,401,403,1,0,0,0,402,404,3,142,71,0,403,402,1,0,0,0,404,
	405,1,0,0,0,405,403,1,0,0,0,405,406,1,0,0,0,406,31,1,0,0,0,407,408,5,2,
	0,0,408,409,3,208,104,0,409,410,5,52,0,0,410,412,3,212,106,0,411,413,3,
	276,138,0,412,411,1,0,0,0,412,413,1,0,0,0,413,415,1,0,0,0,414,416,3,8,4,
	0,415,414,1,0,0,0,415,416,1,0,0,0,416,417,1,0,0,0,417,419,3,12,6,0,418,
	420,3,142,71,0,419,418,1,0,0,0,420,421,1,0,0,0,421,419,1,0,0,0,421,422,
	1,0,0,0,422,33,1,0,0,0,423,424,5,5,0,0,424,426,3,216,108,0,425,427,3,276,
	138,0,426,425,1,0,0,0,426,427,1,0,0,0,427,429,1,0,0,0,428,430,3,8,4,0,429,
	428,1,0,0,0,429,430,1,0,0,0,430,431,1,0,0,0,431,433,3,12,6,0,432,434,3,
	142,71,0,433,432,1,0,0,0,434,435,1,0,0,0,435,433,1,0,0,0,435,436,1,0,0,
	0,436,35,1,0,0,0,437,438,5,14,0,0,438,440,3,218,109,0,439,441,3,276,138,
	0,440,439,1,0,0,0,440,441,1,0,0,0,441,443,1,0,0,0,442,444,3,8,4,0,443,442,
	1,0,0,0,443,444,1,0,0,0,444,445,1,0,0,0,445,446,3,12,6,0,446,447,3,108,
	54,0,447,449,3,110,55,0,448,450,3,102,51,0,449,448,1,0,0,0,449,450,1,0,
	0,0,450,452,1,0,0,0,451,453,3,104,52,0,452,451,1,0,0,0,452,453,1,0,0,0,
	453,37,1,0,0,0,454,455,5,15,0,0,455,457,3,220,110,0,456,458,3,276,138,0,
	457,456,1,0,0,0,457,458,1,0,0,0,458,460,1,0,0,0,459,461,3,8,4,0,460,459,
	1,0,0,0,460,461,1,0,0,0,461,462,1,0,0,0,462,464,3,12,6,0,463,465,3,98,49,
	0,464,463,1,0,0,0,464,465,1,0,0,0,465,467,1,0,0,0,466,468,3,100,50,0,467,
	466,1,0,0,0,467,468,1,0,0,0,468,39,1,0,0,0,469,470,5,16,0,0,470,472,3,224,
	112,0,471,473,3,276,138,0,472,471,1,0,0,0,472,473,1,0,0,0,473,475,1,0,0,
	0,474,476,3,8,4,0,475,474,1,0,0,0,475,476,1,0,0,0,476,477,1,0,0,0,477,479,
	3,12,6,0,478,480,3,98,49,0,479,478,1,0,0,0,479,480,1,0,0,0,480,482,1,0,
	0,0,481,483,3,100,50,0,482,481,1,0,0,0,482,483,1,0,0,0,483,41,1,0,0,0,484,
	485,5,17,0,0,485,487,3,226,113,0,486,488,3,276,138,0,487,486,1,0,0,0,487,
	488,1,0,0,0,488,490,1,0,0,0,489,491,3,8,4,0,490,489,1,0,0,0,490,491,1,0,
	0,0,491,492,1,0,0,0,492,494,3,12,6,0,493,495,3,138,69,0,494,493,1,0,0,0,
	494,495,1,0,0,0,495,496,1,0,0,0,496,497,3,140,70,0,497,43,1,0,0,0,498,499,
	5,6,0,0,499,501,3,222,111,0,500,502,3,276,138,0,501,500,1,0,0,0,501,502,
	1,0,0,0,502,504,1,0,0,0,503,505,3,8,4,0,504,503,1,0,0,0,504,505,1,0,0,0,
	505,506,1,0,0,0,506,508,3,12,6,0,507,509,3,142,71,0,508,507,1,0,0,0,509,
	510,1,0,0,0,510,508,1,0,0,0,510,511,1,0,0,0,511,45,1,0,0,0,512,513,5,6,
	0,0,513,514,3,236,118,0,514,516,5,51,0,0,515,517,3,276,138,0,516,515,1,
	0,0,0,516,517,1,0,0,0,517,519,1,0,0,0,518,520,3,8,4,0,519,518,1,0,0,0,519,
	520,1,0,0,0,520,522,1,0,0,0,521,523,3,142,71,0,522,521,1,0,0,0,523,524,
	1,0,0,0,524,522,1,0,0,0,524,525,1,0,0,0,525,47,1,0,0,0,526,527,5,6,0,0,
	527,528,3,222,111,0,528,529,5,52,0,0,529,531,3,212,106,0,530,532,3,276,
	138,0,531,530,1,0,0,0,531,532,1,0,0,0,532,534,1,0,0,0,533,535,3,8,4,0,534,
	533,1,0,0,0,534,535,1,0,0,0,535,536,1,0,0,0,536,538,3,12,6,0,537,539,3,
	142,71,0,538,537,1,0,0,0,539,540,1,0,0,0,540,538,1,0,0,0,540,541,1,0,0,
	0,541,49,1,0,0,0,542,543,5,7,0,0,543,545,3,228,114,0,544,546,3,276,138,
	0,545,544,1,0,0,0,545,546,1,0,0,0,546,548,1,0,0,0,547,549,3,8,4,0,548,547,
	1,0,0,0,548,549,1,0,0,0,549,550,1,0,0,0,550,554,3,12,6,0,551,553,3,142,
	71,0,552,551,1,0,0,0,553,556,1,0,0,0,554,552,1,0,0,0,554,555,1,0,0,0,555,
	558,1,0,0,0,556,554,1,0,0,0,557,559,3,52,26,0,558,557,1,0,0,0,558,559,1,
	0,0,0,559,51,1,0,0,0,560,563,3,54,27,0,561,563,3,56,28,0,562,560,1,0,0,
	0,562,561,1,0,0,0,563,564,1,0,0,0,564,566,3,16,8,0,565,567,3,72,36,0,566,
	565,1,0,0,0,567,568,1,0,0,0,568,566,1,0,0,0,568,569,1,0,0,0,569,53,1,0,
	0,0,570,571,5,78,0,0,571,55,1,0,0,0,572,573,5,77,0,0,573,57,1,0,0,0,574,
	575,5,8,0,0,575,577,3,230,115,0,576,578,3,276,138,0,577,576,1,0,0,0,577,
	578,1,0,0,0,578,580,1,0,0,0,579,581,3,8,4,0,580,579,1,0,0,0,580,581,1,0,
	0,0,581,582,1,0,0,0,582,584,3,12,6,0,583,585,3,60,30,0,584,583,1,0,0,0,
	585,586,1,0,0,0,586,584,1,0,0,0,586,587,1,0,0,0,587,589,1,0,0,0,588,590,
	3,62,31,0,589,588,1,0,0,0,589,590,1,0,0,0,590,59,1,0,0,0,591,595,7,2,0,
	0,592,593,3,214,107,0,593,594,5,92,0,0,594,596,1,0,0,0,595,592,1,0,0,0,
	595,596,1,0,0,0,596,597,1,0,0,0,597,599,3,246,123,0,598,600,3,276,138,0,
	599,598,1,0,0,0,599,600,1,0,0,0,600,61,1,0,0,0,601,602,5,84,0,0,602,603,
	5,88,0,0,603,63,1,0,0,0,604,605,5,9,0,0,605,607,3,232,116,0,606,608,3,276,
	138,0,607,606,1,0,0,0,607,608,1,0,0,0,608,610,1,0,0,0,609,611,3,8,4,0,610,
	609,1,0,0,0,610,611,1,0,0,0,611,612,1,0,0,0,612,614,3,12,6,0,613,615,3,
	22,11,0,614,613,1,0,0,0,614,615,1,0,0,0,615,617,1,0,0,0,616,618,3,142,71,
	0,617,616,1,0,0,0,618,619,1,0,0,0,619,617,1,0,0,0,619,620,1,0,0,0,620,65,
	1,0,0,0,621,622,5,9,0,0,622,623,3,236,118,0,623,625,5,51,0,0,624,626,3,
	276,138,0,625,624,1,0,0,0,625,626,1,0,0,0,626,628,1,0,0,0,627,629,3,8,4,
	0,628,627,1,0,0,0,628,629,1,0,0,0,629,631,1,0,0,0,630,632,3,142,71,0,631,
	630,1,0,0,0,632,633,1,0,0,0,633,631,1,0,0,0,633,634,1,0,0,0,634,67,1,0,
	0,0,635,636,5,9,0,0,636,637,3,232,116,0,637,638,5,52,0,0,638,640,3,212,
	106,0,639,641,3,276,138,0,640,639,1,0,0,0,640,641,1,0,0,0,641,643,1,0,0,
	0,642,644,3,8,4,0,643,642,1,0,0,0,643,644,1,0,0,0,644,645,1,0,0,0,645,647,
	3,12,6,0,646,648,3,142,71,0,647,646,1,0,0,0,648,649,1,0,0,0,649,647,1,0,
	0,0,649,650,1,0,0,0,650,69,1,0,0,0,651,652,5,10,0,0,652,654,3,234,117,0,
	653,655,3,276,138,0,654,653,1,0,0,0,654,655,1,0,0,0,655,657,1,0,0,0,656,
	658,3,8,4,0,657,656,1,0,0,0,657,658,1,0,0,0,658,659,1,0,0,0,659,661,3,12,
	6,0,660,662,3,72,36,0,661,660,1,0,0,0,662,663,1,0,0,0,663,661,1,0,0,0,663,
	664,1,0,0,0,664,71,1,0,0,0,665,666,5,37,0,0,666,668,3,74,37,0,667,669,3,
	276,138,0,668,667,1,0,0,0,668,669,1,0,0,0,669,671,1,0,0,0,670,672,3,14,
	7,0,671,670,1,0,0,0,671,672,1,0,0,0,672,73,1,0,0,0,673,674,5,88,0,0,674,
	75,1,0,0,0,675,676,5,13,0,0,676,678,3,240,120,0,677,679,3,276,138,0,678,
	677,1,0,0,0,678,679,1,0,0,0,679,681,1,0,0,0,680,682,3,8,4,0,681,680,1,0,
	0,0,681,682,1,0,0,0,682,683,1,0,0,0,683,685,3,12,6,0,684,686,3,142,71,0,
	685,684,1,0,0,0,686,687,1,0,0,0,687,685,1,0,0,0,687,688,1,0,0,0,688,77,
	1,0,0,0,689,690,5,12,0,0,690,692,3,242,121,0,691,693,3,276,138,0,692,691,
	1,0,0,0,692,693,1,0,0,0,693,695,1,0,0,0,694,696,3,8,4,0,695,694,1,0,0,0,
	695,696,1,0,0,0,696,697,1,0,0,0,697,699,3,12,6,0,698,700,3,80,40,0,699,
	698,1,0,0,0,699,700,1,0,0,0,700,702,1,0,0,0,701,703,3,82,41,0,702,701,1,
	0,0,0,702,703,1,0,0,0,703,704,1,0,0,0,704,705,3,84,42,0,705,79,1,0,0,0,
	706,707,5,82,0,0,707,708,5,88,0,0,708,81,1,0,0,0,709,710,5,83,0,0,710,711,
	5,88,0,0,711,83,1,0,0,0,712,714,3,88,44,0,713,712,1,0,0,0,714,717,1,0,0,
	0,715,713,1,0,0,0,715,716,1,0,0,0,716,718,1,0,0,0,717,715,1,0,0,0,718,723,
	3,86,43,0,719,722,3,86,43,0,720,722,3,88,44,0,721,719,1,0,0,0,721,720,1,
	0,0,0,722,725,1,0,0,0,723,721,1,0,0,0,723,724,1,0,0,0,724,85,1,0,0,0,725,
	723,1,0,0,0,726,730,7,3,0,0,727,728,3,214,107,0,728,729,5,92,0,0,729,731,
	1,0,0,0,730,727,1,0,0,0,730,731,1,0,0,0,731,732,1,0,0,0,732,734,3,250,125,
	0,733,735,3,276,138,0,734,733,1,0,0,0,734,735,1,0,0,0,735,87,1,0,0,0,736,
	740,7,4,0,0,737,738,3,214,107,0,738,739,5,92,0,0,739,741,1,0,0,0,740,737,
	1,0,0,0,740,741,1,0,0,0,741,742,1,0,0,0,742,744,3,250,125,0,743,745,3,276,
	138,0,744,743,1,0,0,0,744,745,1,0,0,0,745,89,1,0,0,0,746,747,5,12,0,0,747,
	748,3,236,118,0,748,750,5,51,0,0,749,751,3,276,138,0,750,749,1,0,0,0,750,
	751,1,0,0,0,751,753,1,0,0,0,752,754,3,8,4,0,753,752,1,0,0,0,753,754,1,0,
	0,0,754,755,1,0,0,0,755,756,3,92,46,0,756,91,1,0,0,0,757,760,3,86,43,0,
	758,760,3,88,44,0,759,757,1,0,0,0,759,758,1,0,0,0,760,761,1,0,0,0,761,759,
	1,0,0,0,761,762,1,0,0,0,762,93,1,0,0,0,763,764,5,18,0,0,764,765,3,272,136,
	0,765,766,5,73,0,0,766,768,3,256,128,0,767,769,3,276,138,0,768,767,1,0,
	0,0,768,769,1,0,0,0,769,771,1,0,0,0,770,772,3,8,4,0,771,770,1,0,0,0,771,
	772,1,0,0,0,772,773,1,0,0,0,773,775,3,12,6,0,774,776,3,60,30,0,775,774,
	1,0,0,0,776,777,1,0,0,0,777,775,1,0,0,0,777,778,1,0,0,0,778,781,1,0,0,0,
	779,780,5,74,0,0,780,782,3,96,48,0,781,779,1,0,0,0,781,782,1,0,0,0,782,
	95,1,0,0,0,783,784,5,86,0,0,784,97,1,0,0,0,785,786,5,65,0,0,786,787,3,202,
	101,0,787,99,1,0,0,0,788,789,5,66,0,0,789,790,3,202,101,0,790,101,1,0,0,
	0,791,792,5,65,0,0,792,793,3,106,53,0,793,103,1,0,0,0,794,795,5,66,0,0,
	795,796,3,106,53,0,796,105,1,0,0,0,797,800,5,87,0,0,798,800,3,202,101,0,
	799,797,1,0,0,0,799,798,1,0,0,0,800,107,1,0,0,0,801,802,5,75,0,0,802,803,
	5,86,0,0,803,109,1,0,0,0,804,805,5,55,0,0,805,806,5,86,0,0,806,111,1,0,
	0,0,807,808,5,25,0,0,808,113,1,0,0,0,809,816,3,116,58,0,810,816,3,118,59,
	0,811,816,3,120,60,0,812,816,3,122,61,0,813,816,3,124,62,0,814,816,3,130,
	65,0,815,809,1,0,0,0,815,810,1,0,0,0,815,811,1,0,0,0,815,812,1,0,0,0,815,
	813,1,0,0,0,815,814,1,0,0,0,816,115,1,0,0,0,817,818,5,56,0,0,818,117,1,
	0,0,0,819,820,5,57,0,0,820,821,3,210,105,0,821,119,1,0,0,0,822,823,5,69,
	0,0,823,121,1,0,0,0,824,825,5,67,0,0,825,123,1,0,0,0,826,829,3,126,63,0,
	827,829,3,128,64,0,828,826,1,0,0,0,828,827,1,0,0,0,829,125,1,0,0,0,830,
	831,5,70,0,0,831,127,1,0,0,0,832,833,5,68,0,0,833,129,1,0,0,0,834,835,5,
	59,0,0,835,131,1,0,0,0,836,838,3,10,5,0,837,836,1,0,0,0,837,838,1,0,0,0,
	838,839,1,0,0,0,839,840,3,18,9,0,840,842,3,114,57,0,841,843,3,136,68,0,
	842,841,1,0,0,0,842,843,1,0,0,0,843,845,1,0,0,0,844,846,3,134,67,0,845,
	844,1,0,0,0,845,846,1,0,0,0,846,133,1,0,0,0,847,848,5,58,0,0,848,135,1,
	0,0,0,849,850,5,71,0,0,850,853,3,262,131,0,851,852,5,72,0,0,852,854,3,268,
	134,0,853,851,1,0,0,0,853,854,1,0,0,0,854,137,1,0,0,0,855,856,5,63,0,0,
	856,857,5,86,0,0,857,139,1,0,0,0,858,859,5,64,0,0,859,860,5,86,0,0,860,
	141,1,0,0,0,861,885,3,170,85,0,862,885,3,144,72,0,863,885,3,164,82,0,864,
	885,3,160,80,0,865,885,3,146,73,0,866,885,3,148,74,0,867,885,3,150,75,0,
	868,885,3,152,76,0,869,885,3,154,77,0,870,885,3,172,86,0,871,885,3,156,
	78,0,872,885,3,158,79,0,873,885,3,162,81,0,874,885,3,166,83,0,875,885,3,
	168,84,0,876,885,3,174,87,0,877,885,3,176,88,0,878,885,3,178,89,0,879,885,
	3,180,90,0,880,885,3,182,91,0,881,885,3,184,92,0,882,885,3,186,93,0,883,
	885,3,188,94,0,884,861,1,0,0,0,884,862,1,0,0,0,884,863,1,0,0,0,884,864,
	1,0,0,0,884,865,1,0,0,0,884,866,1,0,0,0,884,867,1,0,0,0,884,868,1,0,0,0,
	884,869,1,0,0,0,884,870,1,0,0,0,884,871,1,0,0,0,884,872,1,0,0,0,884,873,
	1,0,0,0,884,874,1,0,0,0,884,875,1,0,0,0,884,876,1,0,0,0,884,877,1,0,0,0,
	884,878,1,0,0,0,884,879,1,0,0,0,884,880,1,0,0,0,884,881,1,0,0,0,884,882,
	1,0,0,0,884,883,1,0,0,0,885,143,1,0,0,0,886,887,5,22,0,0,887,889,3,270,
	135,0,888,890,3,276,138,0,889,888,1,0,0,0,889,890,1,0,0,0,890,891,1,0,0,
	0,891,892,3,132,66,0,892,145,1,0,0,0,893,894,5,26,0,0,894,896,3,270,135,
	0,895,897,3,276,138,0,896,895,1,0,0,0,896,897,1,0,0,0,897,898,1,0,0,0,898,
	899,3,132,66,0,899,147,1,0,0,0,900,901,5,27,0,0,901,903,3,270,135,0,902,
	904,3,276,138,0,903,902,1,0,0,0,903,904,1,0,0,0,904,905,1,0,0,0,905,906,
	3,132,66,0,906,149,1,0,0,0,907,908,5,28,0,0,908,910,3,270,135,0,909,911,
	3,276,138,0,910,909,1,0,0,0,910,911,1,0,0,0,911,912,1,0,0,0,912,913,3,132,
	66,0,913,151,1,0,0,0,914,915,5,29,0,0,915,917,3,270,135,0,916,918,3,276,
	138,0,917,916,1,0,0,0,917,918,1,0,0,0,918,919,1,0,0,0,919,920,3,132,66,
	0,920,921,3,108,54,0,921,923,3,110,55,0,922,924,3,102,51,0,923,922,1,0,
	0,0,923,924,1,0,0,0,924,926,1,0,0,0,925,927,3,104,52,0,926,925,1,0,0,0,
	926,927,1,0,0,0,927,153,1,0,0,0,928,929,5,30,0,0,929,931,3,258,129,0,930,
	932,3,276,138,0,931,930,1,0,0,0,931,932,1,0,0,0,932,933,1,0,0,0,933,934,
	3,132,66,0,934,155,1,0,0,0,935,936,5,34,0,0,936,938,3,270,135,0,937,939,
	3,276,138,0,938,937,1,0,0,0,938,939,1,0,0,0,939,940,1,0,0,0,940,941,3,132,
	66,0,941,157,1,0,0,0,942,943,5,36,0,0,943,945,3,258,129,0,944,946,3,276,
	138,0,945,944,1,0,0,0,945,946,1,0,0,0,946,947,1,0,0,0,947,948,3,132,66,
	0,948,159,1,0,0,0,949,952,5,24,0,0,950,952,3,112,56,0,951,949,1,0,0,0,951,
	950,1,0,0,0,952,953,1,0,0,0,953,955,3,258,129,0,954,956,3,276,138,0,955,
	954,1,0,0,0,955,956,1,0,0,0,956,957,1,0,0,0,957,961,3,132,66,0,958,960,
	3,194,97,0,959,958,1,0,0,0,960,963,1,0,0,0,961,959,1,0,0,0,961,962,1,0,
	0,0,962,161,1,0,0,0,963,961,1,0,0,0,964,965,5,38,0,0,965,967,3,258,129,
	0,966,968,3,276,138,0,967,966,1,0,0,0,967,968,1,0,0,0,968,969,1,0,0,0,969,
	973,3,132,66,0,970,972,3,194,97,0,971,970,1,0,0,0,972,975,1,0,0,0,973,971,
	1,0,0,0,973,974,1,0,0,0,974,163,1,0,0,0,975,973,1,0,0,0,976,977,5,23,0,
	0,977,979,3,258,129,0,978,980,3,276,138,0,979,978,1,0,0,0,979,980,1,0,0,
	0,980,981,1,0,0,0,981,985,3,132,66,0,982,984,3,194,97,0,983,982,1,0,0,0,
	984,987,1,0,0,0,985,983,1,0,0,0,985,986,1,0,0,0,986,165,1,0,0,0,987,985,
	1,0,0,0,988,989,5,39,0,0,989,991,3,270,135,0,990,992,3,276,138,0,991,990,
	1,0,0,0,991,992,1,0,0,0,992,993,1,0,0,0,993,995,3,132,66,0,994,996,3,98,
	49,0,995,994,1,0,0,0,995,996,1,0,0,0,996,998,1,0,0,0,997,999,3,100,50,0,
	998,997,1,0,0,0,998,999,1,0,0,0,999,167,1,0,0,0,1000,1001,5,40,0,0,1001,
	1003,3,270,135,0,1002,1004,3,276,138,0,1003,1002,1,0,0,0,1003,1004,1,0,
	0,0,1004,1005,1,0,0,0,1005,1006,3,132,66,0,1006,169,1,0,0,0,1007,1008,5,
	20,0,0,1008,1010,3,258,129,0,1009,1011,3,276,138,0,1010,1009,1,0,0,0,1010,
	1011,1,0,0,0,1011,1012,1,0,0,0,1012,1014,3,132,66,0,1013,1015,3,192,96,
	0,1014,1013,1,0,0,0,1014,1015,1,0,0,0,1015,1017,1,0,0,0,1016,1018,3,190,
	95,0,1017,1016,1,0,0,0,1017,1018,1,0,0,0,1018,1022,1,0,0,0,1019,1021,3,
	194,97,0,1020,1019,1,0,0,0,1021,1024,1,0,0,0,1022,1020,1,0,0,0,1022,1023,
	1,0,0,0,1023,171,1,0,0,0,1024,1022,1,0,0,0,1025,1026,5,31,0,0,1026,1028,
	3,258,129,0,1027,1029,3,276,138,0,1028,1027,1,0,0,0,1028,1029,1,0,0,0,1029,
	1030,1,0,0,0,1030,1032,3,132,66,0,1031,1033,3,192,96,0,1032,1031,1,0,0,
	0,1032,1033,1,0,0,0,1033,1035,1,0,0,0,1034,1036,3,190,95,0,1035,1034,1,
	0,0,0,1035,1036,1,0,0,0,1036,1040,1,0,0,0,1037,1039,3,194,97,0,1038,1037,
	1,0,0,0,1039,1042,1,0,0,0,1040,1038,1,0,0,0,1040,1041,1,0,0,0,1041,173,
	1,0,0,0,1042,1040,1,0,0,0,1043,1044,5,42,0,0,1044,1047,3,266,133,0,1045,
	1046,5,46,0,0,1046,1048,3,264,132,0,1047,1045,1,0,0,0,1047,1048,1,0,0,0,
	1048,1050,1,0,0,0,1049,1051,3,276,138,0,1050,1049,1,0,0,0,1050,1051,1,0,
	0,0,1051,1052,1,0,0,0,1052,1056,3,132,66,0,1053,1055,3,194,97,0,1054,1053,
	1,0,0,0,1055,1058,1,0,0,0,1056,1054,1,0,0,0,1056,1057,1,0,0,0,1057,175,
	1,0,0,0,1058,1056,1,0,0,0,1059,1060,5,43,0,0,1060,1063,3,266,133,0,1061,
	1062,5,46,0,0,1062,1064,3,264,132,0,1063,1061,1,0,0,0,1063,1064,1,0,0,0,
	1064,1066,1,0,0,0,1065,1067,3,276,138,0,1066,1065,1,0,0,0,1066,1067,1,0,
	0,0,1067,1068,1,0,0,0,1068,1072,3,132,66,0,1069,1071,3,194,97,0,1070,1069,
	1,0,0,0,1071,1074,1,0,0,0,1072,1070,1,0,0,0,1072,1073,1,0,0,0,1073,177,
	1,0,0,0,1074,1072,1,0,0,0,1075,1076,5,44,0,0,1076,1079,3,266,133,0,1077,
	1078,5,46,0,0,1078,1080,3,264,132,0,1079,1077,1,0,0,0,1079,1080,1,0,0,0,
	1080,1082,1,0,0,0,1081,1083,3,276,138,0,1082,1081,1,0,0,0,1082,1083,1,0,
	0,0,1083,1084,1,0,0,0,1084,1088,3,132,66,0,1085,1087,3,194,97,0,1086,1085,
	1,0,0,0,1087,1090,1,0,0,0,1088,1086,1,0,0,0,1088,1089,1,0,0,0,1089,179,
	1,0,0,0,1090,1088,1,0,0,0,1091,1092,5,45,0,0,1092,1095,3,266,133,0,1093,
	1094,5,46,0,0,1094,1096,3,264,132,0,1095,1093,1,0,0,0,1095,1096,1,0,0,0,
	1096,1098,1,0,0,0,1097,1099,3,276,138,0,1098,1097,1,0,0,0,1098,1099,1,0,
	0,0,1099,1100,1,0,0,0,1100,1104,3,132,66,0,1101,1103,3,194,97,0,1102,1101,
	1,0,0,0,1103,1106,1,0,0,0,1104,1102,1,0,0,0,1104,1105,1,0,0,0,1105,181,
	1,0,0,0,1106,1104,1,0,0,0,1107,1108,5,47,0,0,1108,1110,3,270,135,0,1109,
	1111,3,276,138,0,1110,1109,1,0,0,0,1110,1111,1,0,0,0,1111,1112,1,0,0,0,
	1112,1114,3,132,66,0,1113,1115,3,98,49,0,1114,1113,1,0,0,0,1114,1115,1,
	0,0,0,1115,1117,1,0,0,0,1116,1118,3,100,50,0,1117,1116,1,0,0,0,1117,1118,
	1,0,0,0,1118,183,1,0,0,0,1119,1120,5,48,0,0,1120,1122,3,270,135,0,1121,
	1123,3,276,138,0,1122,1121,1,0,0,0,1122,1123,1,0,0,0,1123,1124,1,0,0,0,
	1124,1126,3,132,66,0,1125,1127,3,138,69,0,1126,1125,1,0,0,0,1126,1127,1,
	0,0,0,1127,1128,1,0,0,0,1128,1129,3,140,70,0,1129,185,1,0,0,0,1130,1131,
	5,49,0,0,1131,1133,3,270,135,0,1132,1134,3,276,138,0,1133,1132,1,0,0,0,
	1133,1134,1,0,0,0,1134,1135,1,0,0,0,1135,1136,3,132,66,0,1136,187,1,0,0,
	0,1137,1138,5,50,0,0,1138,1140,3,270,135,0,1139,1141,3,276,138,0,1140,1139,
	1,0,0,0,1140,1141,1,0,0,0,1141,1142,1,0,0,0,1142,1143,3,132,66,0,1143,189,
	1,0,0,0,1144,1145,5,60,0,0,1145,191,1,0,0,0,1146,1147,5,61,0,0,1147,193,
	1,0,0,0,1148,1149,5,62,0,0,1149,1150,3,196,98,0,1150,1151,5,76,0,0,1151,
	1152,3,198,99,0,1152,195,1,0,0,0,1153,1154,3,200,100,0,1154,197,1,0,0,0,
	1155,1156,3,200,100,0,1156,199,1,0,0,0,1157,1162,5,85,0,0,1158,1159,5,92,
	0,0,1159,1161,5,85,0,0,1160,1158,1,0,0,0,1161,1164,1,0,0,0,1162,1160,1,
	0,0,0,1162,1163,1,0,0,0,1163,201,1,0,0,0,1164,1162,1,0,0,0,1165,1167,3,
	204,102,0,1166,1165,1,0,0,0,1166,1167,1,0,0,0,1167,1168,1,0,0,0,1168,1169,
	5,86,0,0,1169,203,1,0,0,0,1170,1171,7,5,0,0,1171,205,1,0,0,0,1172,1173,
	5,85,0,0,1173,207,1,0,0,0,1174,1175,5,85,0,0,1175,209,1,0,0,0,1176,1177,
	5,85,0,0,1177,211,1,0,0,0,1178,1179,3,214,107,0,1179,1180,5,92,0,0,1180,
	1182,1,0,0,0,1181,1178,1,0,0,0,1181,1182,1,0,0,0,1182,1183,1,0,0,0,1183,
	1184,3,244,122,0,1184,213,1,0,0,0,1185,1186,5,85,0,0,1186,215,1,0,0,0,1187,
	1188,5,85,0,0,1188,217,1,0,0,0,1189,1190,5,85,0,0,1190,219,1,0,0,0,1191,
	1192,5,85,0,0,1192,221,1,0,0,0,1193,1194,5,85,0,0,1194,223,1,0,0,0,1195,
	1196,5,85,0,0,1196,225,1,0,0,0,1197,1198,5,85,0,0,1198,227,1,0,0,0,1199,
	1200,5,85,0,0,1200,229,1,0,0,0,1201,1202,5,85,0,0,1202,231,1,0,0,0,1203,
	1204,5,85,0,0,1204,233,1,0,0,0,1205,1206,5,85,0,0,1206,235,1,0,0,0,1207,
	1208,3,238,119,0,1208,1209,5,92,0,0,1209,1211,1,0,0,0,1210,1207,1,0,0,0,
	1210,1211,1,0,0,0,1211,1212,1,0,0,0,1212,1213,3,248,124,0,1213,237,1,0,
	0,0,1214,1215,5,85,0,0,1215,239,1,0,0,0,1216,1217,5,85,0,0,1217,241,1,0,
	0,0,1218,1219,5,85,0,0,1219,243,1,0,0,0,1220,1221,5,85,0,0,1221,245,1,0,
	0,0,1222,1223,5,85,0,0,1223,247,1,0,0,0,1224,1225,5,85,0,0,1225,249,1,0,
	0,0,1226,1227,5,85,0,0,1227,251,1,0,0,0,1228,1229,5,85,0,0,1229,253,1,0,
	0,0,1230,1231,5,85,0,0,1231,255,1,0,0,0,1232,1233,5,85,0,0,1233,257,1,0,
	0,0,1234,1235,3,260,130,0,1235,1236,5,92,0,0,1236,1238,1,0,0,0,1237,1234,
	1,0,0,0,1237,1238,1,0,0,0,1238,1239,1,0,0,0,1239,1240,3,252,126,0,1240,
	259,1,0,0,0,1241,1242,5,85,0,0,1242,261,1,0,0,0,1243,1244,5,85,0,0,1244,
	263,1,0,0,0,1245,1246,5,85,0,0,1246,265,1,0,0,0,1247,1248,3,260,130,0,1248,
	1249,5,92,0,0,1249,1251,1,0,0,0,1250,1247,1,0,0,0,1250,1251,1,0,0,0,1251,
	1252,1,0,0,0,1252,1253,3,254,127,0,1253,267,1,0,0,0,1254,1255,5,85,0,0,
	1255,269,1,0,0,0,1256,1257,3,252,126,0,1257,271,1,0,0,0,1258,1259,5,85,
	0,0,1259,273,1,0,0,0,1260,1261,5,85,0,0,1261,275,1,0,0,0,1262,1263,5,89,
	0,0,1263,277,1,0,0,0,158,281,289,317,340,343,349,358,361,365,372,378,381,
	385,390,397,400,405,412,415,421,426,429,435,440,443,449,452,457,460,464,
	467,472,475,479,482,487,490,494,501,504,510,516,519,524,531,534,540,545,
	548,554,558,562,568,577,580,586,589,595,599,607,610,614,619,625,628,633,
	640,643,649,654,657,663,668,671,678,681,687,692,695,699,702,715,721,723,
	730,734,740,744,750,753,759,761,768,771,777,781,799,815,828,837,842,845,
	853,884,889,896,903,910,917,923,926,931,938,945,951,955,961,967,973,979,
	985,991,995,998,1003,1010,1014,1017,1022,1028,1032,1035,1040,1047,1050,
	1056,1063,1066,1072,1079,1082,1088,1095,1098,1104,1110,1114,1117,1122,1126,
	1133,1140,1162,1166,1181,1210,1237,1250];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!MetaEdGrammar.__ATN) {
			MetaEdGrammar.__ATN = new ATNDeserializer().deserialize(MetaEdGrammar._serializedATN);
		}

		return MetaEdGrammar.__ATN;
	}


	static DecisionsToDFA = MetaEdGrammar._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class MetaEdContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public namespace_list(): NamespaceContext[] {
		return this.getTypedRuleContexts(NamespaceContext) as NamespaceContext[];
	}
	public namespace(i: number): NamespaceContext {
		return this.getTypedRuleContext(NamespaceContext, i) as NamespaceContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_metaEd;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterMetaEd) {
	 		listener.enterMetaEd(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitMetaEd) {
	 		listener.exitMetaEd(this);
		}
	}
}


export class NamespaceContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BEGIN_NAMESPACE(): TerminalNode {
		return this.getToken(MetaEdGrammar.BEGIN_NAMESPACE, 0);
	}
	public namespaceName(): NamespaceNameContext {
		return this.getTypedRuleContext(NamespaceNameContext, 0) as NamespaceNameContext;
	}
	public namespaceType(): NamespaceTypeContext {
		return this.getTypedRuleContext(NamespaceTypeContext, 0) as NamespaceTypeContext;
	}
	public END_NAMESPACE(): TerminalNode {
		return this.getToken(MetaEdGrammar.END_NAMESPACE, 0);
	}
	public topLevelEntity_list(): TopLevelEntityContext[] {
		return this.getTypedRuleContexts(TopLevelEntityContext) as TopLevelEntityContext[];
	}
	public topLevelEntity(i: number): TopLevelEntityContext {
		return this.getTypedRuleContext(TopLevelEntityContext, i) as TopLevelEntityContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_namespace;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterNamespace) {
	 		listener.enterNamespace(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitNamespace) {
	 		listener.exitNamespace(this);
		}
	}
}


export class NamespaceTypeContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CORE(): TerminalNode {
		return this.getToken(MetaEdGrammar.CORE, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_namespaceType;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterNamespaceType) {
	 		listener.enterNamespaceType(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitNamespaceType) {
	 		listener.exitNamespaceType(this);
		}
	}
}


export class TopLevelEntityContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public abstractEntity(): AbstractEntityContext {
		return this.getTypedRuleContext(AbstractEntityContext, 0) as AbstractEntityContext;
	}
	public association(): AssociationContext {
		return this.getTypedRuleContext(AssociationContext, 0) as AssociationContext;
	}
	public associationExtension(): AssociationExtensionContext {
		return this.getTypedRuleContext(AssociationExtensionContext, 0) as AssociationExtensionContext;
	}
	public associationSubclass(): AssociationSubclassContext {
		return this.getTypedRuleContext(AssociationSubclassContext, 0) as AssociationSubclassContext;
	}
	public choice(): ChoiceContext {
		return this.getTypedRuleContext(ChoiceContext, 0) as ChoiceContext;
	}
	public sharedDecimal(): SharedDecimalContext {
		return this.getTypedRuleContext(SharedDecimalContext, 0) as SharedDecimalContext;
	}
	public sharedInteger(): SharedIntegerContext {
		return this.getTypedRuleContext(SharedIntegerContext, 0) as SharedIntegerContext;
	}
	public sharedShort(): SharedShortContext {
		return this.getTypedRuleContext(SharedShortContext, 0) as SharedShortContext;
	}
	public sharedString(): SharedStringContext {
		return this.getTypedRuleContext(SharedStringContext, 0) as SharedStringContext;
	}
	public common(): CommonContext {
		return this.getTypedRuleContext(CommonContext, 0) as CommonContext;
	}
	public commonExtension(): CommonExtensionContext {
		return this.getTypedRuleContext(CommonExtensionContext, 0) as CommonExtensionContext;
	}
	public commonSubclass(): CommonSubclassContext {
		return this.getTypedRuleContext(CommonSubclassContext, 0) as CommonSubclassContext;
	}
	public descriptor(): DescriptorContext {
		return this.getTypedRuleContext(DescriptorContext, 0) as DescriptorContext;
	}
	public domainEntity(): DomainEntityContext {
		return this.getTypedRuleContext(DomainEntityContext, 0) as DomainEntityContext;
	}
	public domainEntityExtension(): DomainEntityExtensionContext {
		return this.getTypedRuleContext(DomainEntityExtensionContext, 0) as DomainEntityExtensionContext;
	}
	public domainEntitySubclass(): DomainEntitySubclassContext {
		return this.getTypedRuleContext(DomainEntitySubclassContext, 0) as DomainEntitySubclassContext;
	}
	public enumeration(): EnumerationContext {
		return this.getTypedRuleContext(EnumerationContext, 0) as EnumerationContext;
	}
	public inlineCommon(): InlineCommonContext {
		return this.getTypedRuleContext(InlineCommonContext, 0) as InlineCommonContext;
	}
	public interchange(): InterchangeContext {
		return this.getTypedRuleContext(InterchangeContext, 0) as InterchangeContext;
	}
	public interchangeExtension(): InterchangeExtensionContext {
		return this.getTypedRuleContext(InterchangeExtensionContext, 0) as InterchangeExtensionContext;
	}
	public domain(): DomainContext {
		return this.getTypedRuleContext(DomainContext, 0) as DomainContext;
	}
	public subdomain(): SubdomainContext {
		return this.getTypedRuleContext(SubdomainContext, 0) as SubdomainContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_topLevelEntity;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterTopLevelEntity) {
	 		listener.enterTopLevelEntity(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitTopLevelEntity) {
	 		listener.exitTopLevelEntity(this);
		}
	}
}


export class DeprecatedContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEPRECATED(): TerminalNode {
		return this.getToken(MetaEdGrammar.DEPRECATED, 0);
	}
	public TEXT(): TerminalNode {
		return this.getToken(MetaEdGrammar.TEXT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_deprecated;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDeprecated) {
	 		listener.enterDeprecated(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDeprecated) {
	 		listener.exitDeprecated(this);
		}
	}
}


export class PropertyDeprecatedContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEPRECATED(): TerminalNode {
		return this.getToken(MetaEdGrammar.DEPRECATED, 0);
	}
	public TEXT(): TerminalNode {
		return this.getToken(MetaEdGrammar.TEXT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_propertyDeprecated;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterPropertyDeprecated) {
	 		listener.enterPropertyDeprecated(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitPropertyDeprecated) {
	 		listener.exitPropertyDeprecated(this);
		}
	}
}


export class DocumentationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOCUMENTATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOCUMENTATION, 0);
	}
	public TEXT(): TerminalNode {
		return this.getToken(MetaEdGrammar.TEXT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_documentation;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDocumentation) {
	 		listener.enterDocumentation(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDocumentation) {
	 		listener.exitDocumentation(this);
		}
	}
}


export class EnumerationItemDocumentationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOCUMENTATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOCUMENTATION, 0);
	}
	public TEXT(): TerminalNode {
		return this.getToken(MetaEdGrammar.TEXT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_enumerationItemDocumentation;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterEnumerationItemDocumentation) {
	 		listener.enterEnumerationItemDocumentation(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitEnumerationItemDocumentation) {
	 		listener.exitEnumerationItemDocumentation(this);
		}
	}
}


export class MapTypeDocumentationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOCUMENTATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOCUMENTATION, 0);
	}
	public TEXT(): TerminalNode {
		return this.getToken(MetaEdGrammar.TEXT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_mapTypeDocumentation;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterMapTypeDocumentation) {
	 		listener.enterMapTypeDocumentation(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitMapTypeDocumentation) {
	 		listener.exitMapTypeDocumentation(this);
		}
	}
}


export class PropertyDocumentationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOCUMENTATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOCUMENTATION, 0);
	}
	public TEXT(): TerminalNode {
		return this.getToken(MetaEdGrammar.TEXT, 0);
	}
	public INHERITED(): TerminalNode {
		return this.getToken(MetaEdGrammar.INHERITED, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_propertyDocumentation;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterPropertyDocumentation) {
	 		listener.enterPropertyDocumentation(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitPropertyDocumentation) {
	 		listener.exitPropertyDocumentation(this);
		}
	}
}


export class AbstractEntityContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ABSTRACT_ENTITY(): TerminalNode {
		return this.getToken(MetaEdGrammar.ABSTRACT_ENTITY, 0);
	}
	public abstractEntityName(): AbstractEntityNameContext {
		return this.getTypedRuleContext(AbstractEntityNameContext, 0) as AbstractEntityNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_abstractEntity;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterAbstractEntity) {
	 		listener.enterAbstractEntity(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitAbstractEntity) {
	 		listener.exitAbstractEntity(this);
		}
	}
}


export class EntityConfigurationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public cascadeUpdate(): CascadeUpdateContext {
		return this.getTypedRuleContext(CascadeUpdateContext, 0) as CascadeUpdateContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_entityConfiguration;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterEntityConfiguration) {
	 		listener.enterEntityConfiguration(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitEntityConfiguration) {
	 		listener.exitEntityConfiguration(this);
		}
	}
}


export class CascadeUpdateContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CASCADE_UPDATE(): TerminalNode {
		return this.getToken(MetaEdGrammar.CASCADE_UPDATE, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_cascadeUpdate;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterCascadeUpdate) {
	 		listener.enterCascadeUpdate(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitCascadeUpdate) {
	 		listener.exitCascadeUpdate(this);
		}
	}
}


export class AssociationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ASSOCIATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.ASSOCIATION, 0);
	}
	public associationName(): AssociationNameContext {
		return this.getTypedRuleContext(AssociationNameContext, 0) as AssociationNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public definingDomainEntity_list(): DefiningDomainEntityContext[] {
		return this.getTypedRuleContexts(DefiningDomainEntityContext) as DefiningDomainEntityContext[];
	}
	public definingDomainEntity(i: number): DefiningDomainEntityContext {
		return this.getTypedRuleContext(DefiningDomainEntityContext, i) as DefiningDomainEntityContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public entityConfiguration(): EntityConfigurationContext {
		return this.getTypedRuleContext(EntityConfigurationContext, 0) as EntityConfigurationContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_association;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterAssociation) {
	 		listener.enterAssociation(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitAssociation) {
	 		listener.exitAssociation(this);
		}
	}
}


export class DefiningDomainEntityContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOMAIN_ENTITY_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOMAIN_ENTITY_KEYWORD, 0);
	}
	public propertyName(): PropertyNameContext {
		return this.getTypedRuleContext(PropertyNameContext, 0) as PropertyNameContext;
	}
	public propertyDocumentation(): PropertyDocumentationContext {
		return this.getTypedRuleContext(PropertyDocumentationContext, 0) as PropertyDocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public propertyDeprecated(): PropertyDeprecatedContext {
		return this.getTypedRuleContext(PropertyDeprecatedContext, 0) as PropertyDeprecatedContext;
	}
	public roleName(): RoleNameContext {
		return this.getTypedRuleContext(RoleNameContext, 0) as RoleNameContext;
	}
	public mergeDirective_list(): MergeDirectiveContext[] {
		return this.getTypedRuleContexts(MergeDirectiveContext) as MergeDirectiveContext[];
	}
	public mergeDirective(i: number): MergeDirectiveContext {
		return this.getTypedRuleContext(MergeDirectiveContext, i) as MergeDirectiveContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_definingDomainEntity;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDefiningDomainEntity) {
	 		listener.enterDefiningDomainEntity(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDefiningDomainEntity) {
	 		listener.exitDefiningDomainEntity(this);
		}
	}
}


export class AssociationExtensionContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ASSOCIATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.ASSOCIATION, 0);
	}
	public extendeeName(): ExtendeeNameContext {
		return this.getTypedRuleContext(ExtendeeNameContext, 0) as ExtendeeNameContext;
	}
	public ADDITIONS(): TerminalNode {
		return this.getToken(MetaEdGrammar.ADDITIONS, 0);
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_associationExtension;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterAssociationExtension) {
	 		listener.enterAssociationExtension(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitAssociationExtension) {
	 		listener.exitAssociationExtension(this);
		}
	}
}


export class AssociationSubclassContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ASSOCIATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.ASSOCIATION, 0);
	}
	public associationName(): AssociationNameContext {
		return this.getTypedRuleContext(AssociationNameContext, 0) as AssociationNameContext;
	}
	public BASED_ON(): TerminalNode {
		return this.getToken(MetaEdGrammar.BASED_ON, 0);
	}
	public baseName(): BaseNameContext {
		return this.getTypedRuleContext(BaseNameContext, 0) as BaseNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_associationSubclass;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterAssociationSubclass) {
	 		listener.enterAssociationSubclass(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitAssociationSubclass) {
	 		listener.exitAssociationSubclass(this);
		}
	}
}


export class ChoiceContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CHOICE(): TerminalNode {
		return this.getToken(MetaEdGrammar.CHOICE, 0);
	}
	public choiceName(): ChoiceNameContext {
		return this.getTypedRuleContext(ChoiceNameContext, 0) as ChoiceNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_choice;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterChoice) {
	 		listener.enterChoice(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitChoice) {
	 		listener.exitChoice(this);
		}
	}
}


export class SharedDecimalContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHARED_DECIMAL(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_DECIMAL, 0);
	}
	public sharedDecimalName(): SharedDecimalNameContext {
		return this.getTypedRuleContext(SharedDecimalNameContext, 0) as SharedDecimalNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public totalDigits(): TotalDigitsContext {
		return this.getTypedRuleContext(TotalDigitsContext, 0) as TotalDigitsContext;
	}
	public decimalPlaces(): DecimalPlacesContext {
		return this.getTypedRuleContext(DecimalPlacesContext, 0) as DecimalPlacesContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public minValueDecimal(): MinValueDecimalContext {
		return this.getTypedRuleContext(MinValueDecimalContext, 0) as MinValueDecimalContext;
	}
	public maxValueDecimal(): MaxValueDecimalContext {
		return this.getTypedRuleContext(MaxValueDecimalContext, 0) as MaxValueDecimalContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedDecimal;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedDecimal) {
	 		listener.enterSharedDecimal(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedDecimal) {
	 		listener.exitSharedDecimal(this);
		}
	}
}


export class SharedIntegerContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHARED_INTEGER(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_INTEGER, 0);
	}
	public sharedIntegerName(): SharedIntegerNameContext {
		return this.getTypedRuleContext(SharedIntegerNameContext, 0) as SharedIntegerNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public minValue(): MinValueContext {
		return this.getTypedRuleContext(MinValueContext, 0) as MinValueContext;
	}
	public maxValue(): MaxValueContext {
		return this.getTypedRuleContext(MaxValueContext, 0) as MaxValueContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedInteger;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedInteger) {
	 		listener.enterSharedInteger(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedInteger) {
	 		listener.exitSharedInteger(this);
		}
	}
}


export class SharedShortContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHARED_SHORT(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_SHORT, 0);
	}
	public sharedShortName(): SharedShortNameContext {
		return this.getTypedRuleContext(SharedShortNameContext, 0) as SharedShortNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public minValue(): MinValueContext {
		return this.getTypedRuleContext(MinValueContext, 0) as MinValueContext;
	}
	public maxValue(): MaxValueContext {
		return this.getTypedRuleContext(MaxValueContext, 0) as MaxValueContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedShort;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedShort) {
	 		listener.enterSharedShort(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedShort) {
	 		listener.exitSharedShort(this);
		}
	}
}


export class SharedStringContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHARED_STRING(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_STRING, 0);
	}
	public sharedStringName(): SharedStringNameContext {
		return this.getTypedRuleContext(SharedStringNameContext, 0) as SharedStringNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public maxLength(): MaxLengthContext {
		return this.getTypedRuleContext(MaxLengthContext, 0) as MaxLengthContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public minLength(): MinLengthContext {
		return this.getTypedRuleContext(MinLengthContext, 0) as MinLengthContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedString;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedString) {
	 		listener.enterSharedString(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedString) {
	 		listener.exitSharedString(this);
		}
	}
}


export class CommonContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COMMON(): TerminalNode {
		return this.getToken(MetaEdGrammar.COMMON, 0);
	}
	public commonName(): CommonNameContext {
		return this.getTypedRuleContext(CommonNameContext, 0) as CommonNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_common;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterCommon) {
	 		listener.enterCommon(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitCommon) {
	 		listener.exitCommon(this);
		}
	}
}


export class CommonExtensionContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COMMON(): TerminalNode {
		return this.getToken(MetaEdGrammar.COMMON, 0);
	}
	public extendeeName(): ExtendeeNameContext {
		return this.getTypedRuleContext(ExtendeeNameContext, 0) as ExtendeeNameContext;
	}
	public ADDITIONS(): TerminalNode {
		return this.getToken(MetaEdGrammar.ADDITIONS, 0);
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_commonExtension;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterCommonExtension) {
	 		listener.enterCommonExtension(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitCommonExtension) {
	 		listener.exitCommonExtension(this);
		}
	}
}


export class CommonSubclassContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COMMON(): TerminalNode {
		return this.getToken(MetaEdGrammar.COMMON, 0);
	}
	public commonName(): CommonNameContext {
		return this.getTypedRuleContext(CommonNameContext, 0) as CommonNameContext;
	}
	public BASED_ON(): TerminalNode {
		return this.getToken(MetaEdGrammar.BASED_ON, 0);
	}
	public baseName(): BaseNameContext {
		return this.getTypedRuleContext(BaseNameContext, 0) as BaseNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_commonSubclass;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterCommonSubclass) {
	 		listener.enterCommonSubclass(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitCommonSubclass) {
	 		listener.exitCommonSubclass(this);
		}
	}
}


export class DescriptorContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DESCRIPTOR(): TerminalNode {
		return this.getToken(MetaEdGrammar.DESCRIPTOR, 0);
	}
	public descriptorName(): DescriptorNameContext {
		return this.getTypedRuleContext(DescriptorNameContext, 0) as DescriptorNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
	public withMapType(): WithMapTypeContext {
		return this.getTypedRuleContext(WithMapTypeContext, 0) as WithMapTypeContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_descriptor;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDescriptor) {
	 		listener.enterDescriptor(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDescriptor) {
	 		listener.exitDescriptor(this);
		}
	}
}


export class WithMapTypeContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public mapTypeDocumentation(): MapTypeDocumentationContext {
		return this.getTypedRuleContext(MapTypeDocumentationContext, 0) as MapTypeDocumentationContext;
	}
	public requiredMapType(): RequiredMapTypeContext {
		return this.getTypedRuleContext(RequiredMapTypeContext, 0) as RequiredMapTypeContext;
	}
	public optionalMapType(): OptionalMapTypeContext {
		return this.getTypedRuleContext(OptionalMapTypeContext, 0) as OptionalMapTypeContext;
	}
	public enumerationItem_list(): EnumerationItemContext[] {
		return this.getTypedRuleContexts(EnumerationItemContext) as EnumerationItemContext[];
	}
	public enumerationItem(i: number): EnumerationItemContext {
		return this.getTypedRuleContext(EnumerationItemContext, i) as EnumerationItemContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_withMapType;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterWithMapType) {
	 		listener.enterWithMapType(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitWithMapType) {
	 		listener.exitWithMapType(this);
		}
	}
}


export class RequiredMapTypeContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WITH_MAP_TYPE(): TerminalNode {
		return this.getToken(MetaEdGrammar.WITH_MAP_TYPE, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_requiredMapType;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterRequiredMapType) {
	 		listener.enterRequiredMapType(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitRequiredMapType) {
	 		listener.exitRequiredMapType(this);
		}
	}
}


export class OptionalMapTypeContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WITH_OPTIONAL_MAP_TYPE(): TerminalNode {
		return this.getToken(MetaEdGrammar.WITH_OPTIONAL_MAP_TYPE, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_optionalMapType;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterOptionalMapType) {
	 		listener.enterOptionalMapType(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitOptionalMapType) {
	 		listener.exitOptionalMapType(this);
		}
	}
}


export class DomainContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOMAIN(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOMAIN, 0);
	}
	public domainName(): DomainNameContext {
		return this.getTypedRuleContext(DomainNameContext, 0) as DomainNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public domainItem_list(): DomainItemContext[] {
		return this.getTypedRuleContexts(DomainItemContext) as DomainItemContext[];
	}
	public domainItem(i: number): DomainItemContext {
		return this.getTypedRuleContext(DomainItemContext, i) as DomainItemContext;
	}
	public footerDocumentation(): FooterDocumentationContext {
		return this.getTypedRuleContext(FooterDocumentationContext, 0) as FooterDocumentationContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_domain;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDomain) {
	 		listener.enterDomain(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDomain) {
	 		listener.exitDomain(this);
		}
	}
}


export class DomainItemContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public localDomainItemName(): LocalDomainItemNameContext {
		return this.getTypedRuleContext(LocalDomainItemNameContext, 0) as LocalDomainItemNameContext;
	}
	public ASSOCIATION_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.ASSOCIATION_KEYWORD, 0);
	}
	public COMMON_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.COMMON_KEYWORD, 0);
	}
	public DOMAIN_ENTITY_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOMAIN_ENTITY_KEYWORD, 0);
	}
	public DESCRIPTOR_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.DESCRIPTOR_KEYWORD, 0);
	}
	public INLINE_COMMON_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.INLINE_COMMON_KEYWORD, 0);
	}
	public baseNamespace(): BaseNamespaceContext {
		return this.getTypedRuleContext(BaseNamespaceContext, 0) as BaseNamespaceContext;
	}
	public PERIOD(): TerminalNode {
		return this.getToken(MetaEdGrammar.PERIOD, 0);
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_domainItem;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDomainItem) {
	 		listener.enterDomainItem(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDomainItem) {
	 		listener.exitDomainItem(this);
		}
	}
}


export class FooterDocumentationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FOOTER_DOCUMENTATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.FOOTER_DOCUMENTATION, 0);
	}
	public TEXT(): TerminalNode {
		return this.getToken(MetaEdGrammar.TEXT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_footerDocumentation;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterFooterDocumentation) {
	 		listener.enterFooterDocumentation(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitFooterDocumentation) {
	 		listener.exitFooterDocumentation(this);
		}
	}
}


export class DomainEntityContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOMAIN_ENTITY(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOMAIN_ENTITY, 0);
	}
	public entityName(): EntityNameContext {
		return this.getTypedRuleContext(EntityNameContext, 0) as EntityNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public entityConfiguration(): EntityConfigurationContext {
		return this.getTypedRuleContext(EntityConfigurationContext, 0) as EntityConfigurationContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_domainEntity;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDomainEntity) {
	 		listener.enterDomainEntity(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDomainEntity) {
	 		listener.exitDomainEntity(this);
		}
	}
}


export class DomainEntityExtensionContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOMAIN_ENTITY(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOMAIN_ENTITY, 0);
	}
	public extendeeName(): ExtendeeNameContext {
		return this.getTypedRuleContext(ExtendeeNameContext, 0) as ExtendeeNameContext;
	}
	public ADDITIONS(): TerminalNode {
		return this.getToken(MetaEdGrammar.ADDITIONS, 0);
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_domainEntityExtension;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDomainEntityExtension) {
	 		listener.enterDomainEntityExtension(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDomainEntityExtension) {
	 		listener.exitDomainEntityExtension(this);
		}
	}
}


export class DomainEntitySubclassContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOMAIN_ENTITY(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOMAIN_ENTITY, 0);
	}
	public entityName(): EntityNameContext {
		return this.getTypedRuleContext(EntityNameContext, 0) as EntityNameContext;
	}
	public BASED_ON(): TerminalNode {
		return this.getToken(MetaEdGrammar.BASED_ON, 0);
	}
	public baseName(): BaseNameContext {
		return this.getTypedRuleContext(BaseNameContext, 0) as BaseNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_domainEntitySubclass;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDomainEntitySubclass) {
	 		listener.enterDomainEntitySubclass(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDomainEntitySubclass) {
	 		listener.exitDomainEntitySubclass(this);
		}
	}
}


export class EnumerationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ENUMERATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.ENUMERATION, 0);
	}
	public enumerationName(): EnumerationNameContext {
		return this.getTypedRuleContext(EnumerationNameContext, 0) as EnumerationNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public enumerationItem_list(): EnumerationItemContext[] {
		return this.getTypedRuleContexts(EnumerationItemContext) as EnumerationItemContext[];
	}
	public enumerationItem(i: number): EnumerationItemContext {
		return this.getTypedRuleContext(EnumerationItemContext, i) as EnumerationItemContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_enumeration;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterEnumeration) {
	 		listener.enterEnumeration(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitEnumeration) {
	 		listener.exitEnumeration(this);
		}
	}
}


export class EnumerationItemContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ENUMERATION_ITEM(): TerminalNode {
		return this.getToken(MetaEdGrammar.ENUMERATION_ITEM, 0);
	}
	public shortDescription(): ShortDescriptionContext {
		return this.getTypedRuleContext(ShortDescriptionContext, 0) as ShortDescriptionContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public enumerationItemDocumentation(): EnumerationItemDocumentationContext {
		return this.getTypedRuleContext(EnumerationItemDocumentationContext, 0) as EnumerationItemDocumentationContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_enumerationItem;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterEnumerationItem) {
	 		listener.enterEnumerationItem(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitEnumerationItem) {
	 		listener.exitEnumerationItem(this);
		}
	}
}


export class ShortDescriptionContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TEXT(): TerminalNode {
		return this.getToken(MetaEdGrammar.TEXT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_shortDescription;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterShortDescription) {
	 		listener.enterShortDescription(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitShortDescription) {
	 		listener.exitShortDescription(this);
		}
	}
}


export class InlineCommonContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INLINE_COMMON(): TerminalNode {
		return this.getToken(MetaEdGrammar.INLINE_COMMON, 0);
	}
	public inlineCommonName(): InlineCommonNameContext {
		return this.getTypedRuleContext(InlineCommonNameContext, 0) as InlineCommonNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public property_list(): PropertyContext[] {
		return this.getTypedRuleContexts(PropertyContext) as PropertyContext[];
	}
	public property(i: number): PropertyContext {
		return this.getTypedRuleContext(PropertyContext, i) as PropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_inlineCommon;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterInlineCommon) {
	 		listener.enterInlineCommon(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitInlineCommon) {
	 		listener.exitInlineCommon(this);
		}
	}
}


export class InterchangeContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INTERCHANGE(): TerminalNode {
		return this.getToken(MetaEdGrammar.INTERCHANGE, 0);
	}
	public interchangeName(): InterchangeNameContext {
		return this.getTypedRuleContext(InterchangeNameContext, 0) as InterchangeNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public interchangeComponent(): InterchangeComponentContext {
		return this.getTypedRuleContext(InterchangeComponentContext, 0) as InterchangeComponentContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public extendedDocumentation(): ExtendedDocumentationContext {
		return this.getTypedRuleContext(ExtendedDocumentationContext, 0) as ExtendedDocumentationContext;
	}
	public useCaseDocumentation(): UseCaseDocumentationContext {
		return this.getTypedRuleContext(UseCaseDocumentationContext, 0) as UseCaseDocumentationContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_interchange;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterInterchange) {
	 		listener.enterInterchange(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitInterchange) {
	 		listener.exitInterchange(this);
		}
	}
}


export class ExtendedDocumentationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EXTENDED_DOCUMENTATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.EXTENDED_DOCUMENTATION, 0);
	}
	public TEXT(): TerminalNode {
		return this.getToken(MetaEdGrammar.TEXT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_extendedDocumentation;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterExtendedDocumentation) {
	 		listener.enterExtendedDocumentation(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitExtendedDocumentation) {
	 		listener.exitExtendedDocumentation(this);
		}
	}
}


export class UseCaseDocumentationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USE_CASE_DOCUMENTATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.USE_CASE_DOCUMENTATION, 0);
	}
	public TEXT(): TerminalNode {
		return this.getToken(MetaEdGrammar.TEXT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_useCaseDocumentation;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterUseCaseDocumentation) {
	 		listener.enterUseCaseDocumentation(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitUseCaseDocumentation) {
	 		listener.exitUseCaseDocumentation(this);
		}
	}
}


export class InterchangeComponentContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public interchangeElement_list(): InterchangeElementContext[] {
		return this.getTypedRuleContexts(InterchangeElementContext) as InterchangeElementContext[];
	}
	public interchangeElement(i: number): InterchangeElementContext {
		return this.getTypedRuleContext(InterchangeElementContext, i) as InterchangeElementContext;
	}
	public interchangeIdentity_list(): InterchangeIdentityContext[] {
		return this.getTypedRuleContexts(InterchangeIdentityContext) as InterchangeIdentityContext[];
	}
	public interchangeIdentity(i: number): InterchangeIdentityContext {
		return this.getTypedRuleContext(InterchangeIdentityContext, i) as InterchangeIdentityContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_interchangeComponent;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterInterchangeComponent) {
	 		listener.enterInterchangeComponent(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitInterchangeComponent) {
	 		listener.exitInterchangeComponent(this);
		}
	}
}


export class InterchangeElementContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public localInterchangeItemName(): LocalInterchangeItemNameContext {
		return this.getTypedRuleContext(LocalInterchangeItemNameContext, 0) as LocalInterchangeItemNameContext;
	}
	public ASSOCIATION_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.ASSOCIATION_KEYWORD, 0);
	}
	public DESCRIPTOR_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.DESCRIPTOR_KEYWORD, 0);
	}
	public DOMAIN_ENTITY_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOMAIN_ENTITY_KEYWORD, 0);
	}
	public baseNamespace(): BaseNamespaceContext {
		return this.getTypedRuleContext(BaseNamespaceContext, 0) as BaseNamespaceContext;
	}
	public PERIOD(): TerminalNode {
		return this.getToken(MetaEdGrammar.PERIOD, 0);
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_interchangeElement;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterInterchangeElement) {
	 		listener.enterInterchangeElement(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitInterchangeElement) {
	 		listener.exitInterchangeElement(this);
		}
	}
}


export class InterchangeIdentityContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public localInterchangeItemName(): LocalInterchangeItemNameContext {
		return this.getTypedRuleContext(LocalInterchangeItemNameContext, 0) as LocalInterchangeItemNameContext;
	}
	public ASSOCIATION_IDENTITY(): TerminalNode {
		return this.getToken(MetaEdGrammar.ASSOCIATION_IDENTITY, 0);
	}
	public DOMAIN_ENTITY_IDENTITY(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOMAIN_ENTITY_IDENTITY, 0);
	}
	public baseNamespace(): BaseNamespaceContext {
		return this.getTypedRuleContext(BaseNamespaceContext, 0) as BaseNamespaceContext;
	}
	public PERIOD(): TerminalNode {
		return this.getToken(MetaEdGrammar.PERIOD, 0);
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_interchangeIdentity;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterInterchangeIdentity) {
	 		listener.enterInterchangeIdentity(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitInterchangeIdentity) {
	 		listener.exitInterchangeIdentity(this);
		}
	}
}


export class InterchangeExtensionContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INTERCHANGE(): TerminalNode {
		return this.getToken(MetaEdGrammar.INTERCHANGE, 0);
	}
	public extendeeName(): ExtendeeNameContext {
		return this.getTypedRuleContext(ExtendeeNameContext, 0) as ExtendeeNameContext;
	}
	public ADDITIONS(): TerminalNode {
		return this.getToken(MetaEdGrammar.ADDITIONS, 0);
	}
	public interchangeExtensionComponent(): InterchangeExtensionComponentContext {
		return this.getTypedRuleContext(InterchangeExtensionComponentContext, 0) as InterchangeExtensionComponentContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_interchangeExtension;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterInterchangeExtension) {
	 		listener.enterInterchangeExtension(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitInterchangeExtension) {
	 		listener.exitInterchangeExtension(this);
		}
	}
}


export class InterchangeExtensionComponentContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public interchangeElement_list(): InterchangeElementContext[] {
		return this.getTypedRuleContexts(InterchangeElementContext) as InterchangeElementContext[];
	}
	public interchangeElement(i: number): InterchangeElementContext {
		return this.getTypedRuleContext(InterchangeElementContext, i) as InterchangeElementContext;
	}
	public interchangeIdentity_list(): InterchangeIdentityContext[] {
		return this.getTypedRuleContexts(InterchangeIdentityContext) as InterchangeIdentityContext[];
	}
	public interchangeIdentity(i: number): InterchangeIdentityContext {
		return this.getTypedRuleContext(InterchangeIdentityContext, i) as InterchangeIdentityContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_interchangeExtensionComponent;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterInterchangeExtensionComponent) {
	 		listener.enterInterchangeExtensionComponent(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitInterchangeExtensionComponent) {
	 		listener.exitInterchangeExtensionComponent(this);
		}
	}
}


export class SubdomainContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SUBDOMAIN(): TerminalNode {
		return this.getToken(MetaEdGrammar.SUBDOMAIN, 0);
	}
	public subdomainName(): SubdomainNameContext {
		return this.getTypedRuleContext(SubdomainNameContext, 0) as SubdomainNameContext;
	}
	public SUBDOMAIN_OF(): TerminalNode {
		return this.getToken(MetaEdGrammar.SUBDOMAIN_OF, 0);
	}
	public parentDomainName(): ParentDomainNameContext {
		return this.getTypedRuleContext(ParentDomainNameContext, 0) as ParentDomainNameContext;
	}
	public documentation(): DocumentationContext {
		return this.getTypedRuleContext(DocumentationContext, 0) as DocumentationContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public deprecated(): DeprecatedContext {
		return this.getTypedRuleContext(DeprecatedContext, 0) as DeprecatedContext;
	}
	public domainItem_list(): DomainItemContext[] {
		return this.getTypedRuleContexts(DomainItemContext) as DomainItemContext[];
	}
	public domainItem(i: number): DomainItemContext {
		return this.getTypedRuleContext(DomainItemContext, i) as DomainItemContext;
	}
	public SUBDOMAIN_POSITION(): TerminalNode {
		return this.getToken(MetaEdGrammar.SUBDOMAIN_POSITION, 0);
	}
	public subdomainPosition(): SubdomainPositionContext {
		return this.getTypedRuleContext(SubdomainPositionContext, 0) as SubdomainPositionContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_subdomain;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSubdomain) {
	 		listener.enterSubdomain(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSubdomain) {
	 		listener.exitSubdomain(this);
		}
	}
}


export class SubdomainPositionContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNSIGNED_INT(): TerminalNode {
		return this.getToken(MetaEdGrammar.UNSIGNED_INT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_subdomainPosition;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSubdomainPosition) {
	 		listener.enterSubdomainPosition(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSubdomainPosition) {
	 		listener.exitSubdomainPosition(this);
		}
	}
}


export class MinValueContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MIN_VALUE(): TerminalNode {
		return this.getToken(MetaEdGrammar.MIN_VALUE, 0);
	}
	public signed_int(): Signed_intContext {
		return this.getTypedRuleContext(Signed_intContext, 0) as Signed_intContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_minValue;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterMinValue) {
	 		listener.enterMinValue(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitMinValue) {
	 		listener.exitMinValue(this);
		}
	}
}


export class MaxValueContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MAX_VALUE(): TerminalNode {
		return this.getToken(MetaEdGrammar.MAX_VALUE, 0);
	}
	public signed_int(): Signed_intContext {
		return this.getTypedRuleContext(Signed_intContext, 0) as Signed_intContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_maxValue;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterMaxValue) {
	 		listener.enterMaxValue(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitMaxValue) {
	 		listener.exitMaxValue(this);
		}
	}
}


export class MinValueDecimalContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MIN_VALUE(): TerminalNode {
		return this.getToken(MetaEdGrammar.MIN_VALUE, 0);
	}
	public decimalValue(): DecimalValueContext {
		return this.getTypedRuleContext(DecimalValueContext, 0) as DecimalValueContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_minValueDecimal;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterMinValueDecimal) {
	 		listener.enterMinValueDecimal(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitMinValueDecimal) {
	 		listener.exitMinValueDecimal(this);
		}
	}
}


export class MaxValueDecimalContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MAX_VALUE(): TerminalNode {
		return this.getToken(MetaEdGrammar.MAX_VALUE, 0);
	}
	public decimalValue(): DecimalValueContext {
		return this.getTypedRuleContext(DecimalValueContext, 0) as DecimalValueContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_maxValueDecimal;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterMaxValueDecimal) {
	 		listener.enterMaxValueDecimal(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitMaxValueDecimal) {
	 		listener.exitMaxValueDecimal(this);
		}
	}
}


export class DecimalValueContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DECIMAL_VALUE(): TerminalNode {
		return this.getToken(MetaEdGrammar.DECIMAL_VALUE, 0);
	}
	public signed_int(): Signed_intContext {
		return this.getTypedRuleContext(Signed_intContext, 0) as Signed_intContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_decimalValue;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDecimalValue) {
	 		listener.enterDecimalValue(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDecimalValue) {
	 		listener.exitDecimalValue(this);
		}
	}
}


export class TotalDigitsContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TOTAL_DIGITS(): TerminalNode {
		return this.getToken(MetaEdGrammar.TOTAL_DIGITS, 0);
	}
	public UNSIGNED_INT(): TerminalNode {
		return this.getToken(MetaEdGrammar.UNSIGNED_INT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_totalDigits;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterTotalDigits) {
	 		listener.enterTotalDigits(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitTotalDigits) {
	 		listener.exitTotalDigits(this);
		}
	}
}


export class DecimalPlacesContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DECIMAL_PLACES(): TerminalNode {
		return this.getToken(MetaEdGrammar.DECIMAL_PLACES, 0);
	}
	public UNSIGNED_INT(): TerminalNode {
		return this.getToken(MetaEdGrammar.UNSIGNED_INT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_decimalPlaces;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDecimalPlaces) {
	 		listener.enterDecimalPlaces(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDecimalPlaces) {
	 		listener.exitDecimalPlaces(this);
		}
	}
}


export class CommonExtensionOverrideContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COMMON_EXTENSION(): TerminalNode {
		return this.getToken(MetaEdGrammar.COMMON_EXTENSION, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_commonExtensionOverride;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterCommonExtensionOverride) {
	 		listener.enterCommonExtensionOverride(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitCommonExtensionOverride) {
	 		listener.exitCommonExtensionOverride(this);
		}
	}
}


export class PropertyAnnotationContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identity(): IdentityContext {
		return this.getTypedRuleContext(IdentityContext, 0) as IdentityContext;
	}
	public identityRename(): IdentityRenameContext {
		return this.getTypedRuleContext(IdentityRenameContext, 0) as IdentityRenameContext;
	}
	public required(): RequiredContext {
		return this.getTypedRuleContext(RequiredContext, 0) as RequiredContext;
	}
	public optional(): OptionalContext {
		return this.getTypedRuleContext(OptionalContext, 0) as OptionalContext;
	}
	public collection(): CollectionContext {
		return this.getTypedRuleContext(CollectionContext, 0) as CollectionContext;
	}
	public isQueryableOnly(): IsQueryableOnlyContext {
		return this.getTypedRuleContext(IsQueryableOnlyContext, 0) as IsQueryableOnlyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_propertyAnnotation;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterPropertyAnnotation) {
	 		listener.enterPropertyAnnotation(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitPropertyAnnotation) {
	 		listener.exitPropertyAnnotation(this);
		}
	}
}


export class IdentityContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTITY(): TerminalNode {
		return this.getToken(MetaEdGrammar.IDENTITY, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_identity;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterIdentity) {
	 		listener.enterIdentity(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitIdentity) {
	 		listener.exitIdentity(this);
		}
	}
}


export class IdentityRenameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTITY_RENAME(): TerminalNode {
		return this.getToken(MetaEdGrammar.IDENTITY_RENAME, 0);
	}
	public baseKeyName(): BaseKeyNameContext {
		return this.getTypedRuleContext(BaseKeyNameContext, 0) as BaseKeyNameContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_identityRename;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterIdentityRename) {
	 		listener.enterIdentityRename(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitIdentityRename) {
	 		listener.exitIdentityRename(this);
		}
	}
}


export class RequiredContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public REQUIRED(): TerminalNode {
		return this.getToken(MetaEdGrammar.REQUIRED, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_required;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterRequired) {
	 		listener.enterRequired(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitRequired) {
	 		listener.exitRequired(this);
		}
	}
}


export class OptionalContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OPTIONAL(): TerminalNode {
		return this.getToken(MetaEdGrammar.OPTIONAL, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_optional;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterOptional) {
	 		listener.enterOptional(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitOptional) {
	 		listener.exitOptional(this);
		}
	}
}


export class CollectionContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public requiredCollection(): RequiredCollectionContext {
		return this.getTypedRuleContext(RequiredCollectionContext, 0) as RequiredCollectionContext;
	}
	public optionalCollection(): OptionalCollectionContext {
		return this.getTypedRuleContext(OptionalCollectionContext, 0) as OptionalCollectionContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_collection;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterCollection) {
	 		listener.enterCollection(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitCollection) {
	 		listener.exitCollection(this);
		}
	}
}


export class RequiredCollectionContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public REQUIRED_COLLECTION(): TerminalNode {
		return this.getToken(MetaEdGrammar.REQUIRED_COLLECTION, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_requiredCollection;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterRequiredCollection) {
	 		listener.enterRequiredCollection(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitRequiredCollection) {
	 		listener.exitRequiredCollection(this);
		}
	}
}


export class OptionalCollectionContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OPTIONAL_COLLECTION(): TerminalNode {
		return this.getToken(MetaEdGrammar.OPTIONAL_COLLECTION, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_optionalCollection;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterOptionalCollection) {
	 		listener.enterOptionalCollection(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitOptionalCollection) {
	 		listener.exitOptionalCollection(this);
		}
	}
}


export class IsQueryableOnlyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IS_QUERYABLE_ONLY(): TerminalNode {
		return this.getToken(MetaEdGrammar.IS_QUERYABLE_ONLY, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_isQueryableOnly;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterIsQueryableOnly) {
	 		listener.enterIsQueryableOnly(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitIsQueryableOnly) {
	 		listener.exitIsQueryableOnly(this);
		}
	}
}


export class PropertyComponentsContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public propertyDocumentation(): PropertyDocumentationContext {
		return this.getTypedRuleContext(PropertyDocumentationContext, 0) as PropertyDocumentationContext;
	}
	public propertyAnnotation(): PropertyAnnotationContext {
		return this.getTypedRuleContext(PropertyAnnotationContext, 0) as PropertyAnnotationContext;
	}
	public propertyDeprecated(): PropertyDeprecatedContext {
		return this.getTypedRuleContext(PropertyDeprecatedContext, 0) as PropertyDeprecatedContext;
	}
	public roleName(): RoleNameContext {
		return this.getTypedRuleContext(RoleNameContext, 0) as RoleNameContext;
	}
	public isQueryableField(): IsQueryableFieldContext {
		return this.getTypedRuleContext(IsQueryableFieldContext, 0) as IsQueryableFieldContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_propertyComponents;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterPropertyComponents) {
	 		listener.enterPropertyComponents(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitPropertyComponents) {
	 		listener.exitPropertyComponents(this);
		}
	}
}


export class IsQueryableFieldContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IS_QUERYABLE_FIELD(): TerminalNode {
		return this.getToken(MetaEdGrammar.IS_QUERYABLE_FIELD, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_isQueryableField;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterIsQueryableField) {
	 		listener.enterIsQueryableField(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitIsQueryableField) {
	 		listener.exitIsQueryableField(this);
		}
	}
}


export class RoleNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ROLE_NAME(): TerminalNode {
		return this.getToken(MetaEdGrammar.ROLE_NAME, 0);
	}
	public roleNameName(): RoleNameNameContext {
		return this.getTypedRuleContext(RoleNameNameContext, 0) as RoleNameNameContext;
	}
	public SHORTEN_TO(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHORTEN_TO, 0);
	}
	public shortenToName(): ShortenToNameContext {
		return this.getTypedRuleContext(ShortenToNameContext, 0) as ShortenToNameContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_roleName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterRoleName) {
	 		listener.enterRoleName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitRoleName) {
	 		listener.exitRoleName(this);
		}
	}
}


export class MinLengthContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MIN_LENGTH(): TerminalNode {
		return this.getToken(MetaEdGrammar.MIN_LENGTH, 0);
	}
	public UNSIGNED_INT(): TerminalNode {
		return this.getToken(MetaEdGrammar.UNSIGNED_INT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_minLength;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterMinLength) {
	 		listener.enterMinLength(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitMinLength) {
	 		listener.exitMinLength(this);
		}
	}
}


export class MaxLengthContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MAX_LENGTH(): TerminalNode {
		return this.getToken(MetaEdGrammar.MAX_LENGTH, 0);
	}
	public UNSIGNED_INT(): TerminalNode {
		return this.getToken(MetaEdGrammar.UNSIGNED_INT, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_maxLength;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterMaxLength) {
	 		listener.enterMaxLength(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitMaxLength) {
	 		listener.exitMaxLength(this);
		}
	}
}


export class PropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public associationProperty(): AssociationPropertyContext {
		return this.getTypedRuleContext(AssociationPropertyContext, 0) as AssociationPropertyContext;
	}
	public booleanProperty(): BooleanPropertyContext {
		return this.getTypedRuleContext(BooleanPropertyContext, 0) as BooleanPropertyContext;
	}
	public choiceProperty(): ChoicePropertyContext {
		return this.getTypedRuleContext(ChoicePropertyContext, 0) as ChoicePropertyContext;
	}
	public commonProperty(): CommonPropertyContext {
		return this.getTypedRuleContext(CommonPropertyContext, 0) as CommonPropertyContext;
	}
	public currencyProperty(): CurrencyPropertyContext {
		return this.getTypedRuleContext(CurrencyPropertyContext, 0) as CurrencyPropertyContext;
	}
	public dateProperty(): DatePropertyContext {
		return this.getTypedRuleContext(DatePropertyContext, 0) as DatePropertyContext;
	}
	public datetimeProperty(): DatetimePropertyContext {
		return this.getTypedRuleContext(DatetimePropertyContext, 0) as DatetimePropertyContext;
	}
	public decimalProperty(): DecimalPropertyContext {
		return this.getTypedRuleContext(DecimalPropertyContext, 0) as DecimalPropertyContext;
	}
	public descriptorProperty(): DescriptorPropertyContext {
		return this.getTypedRuleContext(DescriptorPropertyContext, 0) as DescriptorPropertyContext;
	}
	public domainEntityProperty(): DomainEntityPropertyContext {
		return this.getTypedRuleContext(DomainEntityPropertyContext, 0) as DomainEntityPropertyContext;
	}
	public durationProperty(): DurationPropertyContext {
		return this.getTypedRuleContext(DurationPropertyContext, 0) as DurationPropertyContext;
	}
	public enumerationProperty(): EnumerationPropertyContext {
		return this.getTypedRuleContext(EnumerationPropertyContext, 0) as EnumerationPropertyContext;
	}
	public inlineCommonProperty(): InlineCommonPropertyContext {
		return this.getTypedRuleContext(InlineCommonPropertyContext, 0) as InlineCommonPropertyContext;
	}
	public integerProperty(): IntegerPropertyContext {
		return this.getTypedRuleContext(IntegerPropertyContext, 0) as IntegerPropertyContext;
	}
	public percentProperty(): PercentPropertyContext {
		return this.getTypedRuleContext(PercentPropertyContext, 0) as PercentPropertyContext;
	}
	public sharedDecimalProperty(): SharedDecimalPropertyContext {
		return this.getTypedRuleContext(SharedDecimalPropertyContext, 0) as SharedDecimalPropertyContext;
	}
	public sharedIntegerProperty(): SharedIntegerPropertyContext {
		return this.getTypedRuleContext(SharedIntegerPropertyContext, 0) as SharedIntegerPropertyContext;
	}
	public sharedShortProperty(): SharedShortPropertyContext {
		return this.getTypedRuleContext(SharedShortPropertyContext, 0) as SharedShortPropertyContext;
	}
	public sharedStringProperty(): SharedStringPropertyContext {
		return this.getTypedRuleContext(SharedStringPropertyContext, 0) as SharedStringPropertyContext;
	}
	public shortProperty(): ShortPropertyContext {
		return this.getTypedRuleContext(ShortPropertyContext, 0) as ShortPropertyContext;
	}
	public stringProperty(): StringPropertyContext {
		return this.getTypedRuleContext(StringPropertyContext, 0) as StringPropertyContext;
	}
	public timeProperty(): TimePropertyContext {
		return this.getTypedRuleContext(TimePropertyContext, 0) as TimePropertyContext;
	}
	public yearProperty(): YearPropertyContext {
		return this.getTypedRuleContext(YearPropertyContext, 0) as YearPropertyContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_property;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterProperty) {
	 		listener.enterProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitProperty) {
	 		listener.exitProperty(this);
		}
	}
}


export class BooleanPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BOOLEAN(): TerminalNode {
		return this.getToken(MetaEdGrammar.BOOLEAN, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_booleanProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterBooleanProperty) {
	 		listener.enterBooleanProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitBooleanProperty) {
	 		listener.exitBooleanProperty(this);
		}
	}
}


export class CurrencyPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CURRENCY(): TerminalNode {
		return this.getToken(MetaEdGrammar.CURRENCY, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_currencyProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterCurrencyProperty) {
	 		listener.enterCurrencyProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitCurrencyProperty) {
	 		listener.exitCurrencyProperty(this);
		}
	}
}


export class DatePropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DATE(): TerminalNode {
		return this.getToken(MetaEdGrammar.DATE, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_dateProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDateProperty) {
	 		listener.enterDateProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDateProperty) {
	 		listener.exitDateProperty(this);
		}
	}
}


export class DatetimePropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DATETIME(): TerminalNode {
		return this.getToken(MetaEdGrammar.DATETIME, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_datetimeProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDatetimeProperty) {
	 		listener.enterDatetimeProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDatetimeProperty) {
	 		listener.exitDatetimeProperty(this);
		}
	}
}


export class DecimalPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DECIMAL(): TerminalNode {
		return this.getToken(MetaEdGrammar.DECIMAL, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public totalDigits(): TotalDigitsContext {
		return this.getTypedRuleContext(TotalDigitsContext, 0) as TotalDigitsContext;
	}
	public decimalPlaces(): DecimalPlacesContext {
		return this.getTypedRuleContext(DecimalPlacesContext, 0) as DecimalPlacesContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public minValueDecimal(): MinValueDecimalContext {
		return this.getTypedRuleContext(MinValueDecimalContext, 0) as MinValueDecimalContext;
	}
	public maxValueDecimal(): MaxValueDecimalContext {
		return this.getTypedRuleContext(MaxValueDecimalContext, 0) as MaxValueDecimalContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_decimalProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDecimalProperty) {
	 		listener.enterDecimalProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDecimalProperty) {
	 		listener.exitDecimalProperty(this);
		}
	}
}


export class DescriptorPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DESCRIPTOR_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.DESCRIPTOR_KEYWORD, 0);
	}
	public propertyName(): PropertyNameContext {
		return this.getTypedRuleContext(PropertyNameContext, 0) as PropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_descriptorProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDescriptorProperty) {
	 		listener.enterDescriptorProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDescriptorProperty) {
	 		listener.exitDescriptorProperty(this);
		}
	}
}


export class DurationPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DURATION(): TerminalNode {
		return this.getToken(MetaEdGrammar.DURATION, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_durationProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDurationProperty) {
	 		listener.enterDurationProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDurationProperty) {
	 		listener.exitDurationProperty(this);
		}
	}
}


export class EnumerationPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ENUMERATION_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.ENUMERATION_KEYWORD, 0);
	}
	public propertyName(): PropertyNameContext {
		return this.getTypedRuleContext(PropertyNameContext, 0) as PropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_enumerationProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterEnumerationProperty) {
	 		listener.enterEnumerationProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitEnumerationProperty) {
	 		listener.exitEnumerationProperty(this);
		}
	}
}


export class CommonPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public propertyName(): PropertyNameContext {
		return this.getTypedRuleContext(PropertyNameContext, 0) as PropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public COMMON_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.COMMON_KEYWORD, 0);
	}
	public commonExtensionOverride(): CommonExtensionOverrideContext {
		return this.getTypedRuleContext(CommonExtensionOverrideContext, 0) as CommonExtensionOverrideContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public mergeDirective_list(): MergeDirectiveContext[] {
		return this.getTypedRuleContexts(MergeDirectiveContext) as MergeDirectiveContext[];
	}
	public mergeDirective(i: number): MergeDirectiveContext {
		return this.getTypedRuleContext(MergeDirectiveContext, i) as MergeDirectiveContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_commonProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterCommonProperty) {
	 		listener.enterCommonProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitCommonProperty) {
	 		listener.exitCommonProperty(this);
		}
	}
}


export class InlineCommonPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INLINE_COMMON_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.INLINE_COMMON_KEYWORD, 0);
	}
	public propertyName(): PropertyNameContext {
		return this.getTypedRuleContext(PropertyNameContext, 0) as PropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public mergeDirective_list(): MergeDirectiveContext[] {
		return this.getTypedRuleContexts(MergeDirectiveContext) as MergeDirectiveContext[];
	}
	public mergeDirective(i: number): MergeDirectiveContext {
		return this.getTypedRuleContext(MergeDirectiveContext, i) as MergeDirectiveContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_inlineCommonProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterInlineCommonProperty) {
	 		listener.enterInlineCommonProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitInlineCommonProperty) {
	 		listener.exitInlineCommonProperty(this);
		}
	}
}


export class ChoicePropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CHOICE_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.CHOICE_KEYWORD, 0);
	}
	public propertyName(): PropertyNameContext {
		return this.getTypedRuleContext(PropertyNameContext, 0) as PropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public mergeDirective_list(): MergeDirectiveContext[] {
		return this.getTypedRuleContexts(MergeDirectiveContext) as MergeDirectiveContext[];
	}
	public mergeDirective(i: number): MergeDirectiveContext {
		return this.getTypedRuleContext(MergeDirectiveContext, i) as MergeDirectiveContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_choiceProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterChoiceProperty) {
	 		listener.enterChoiceProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitChoiceProperty) {
	 		listener.exitChoiceProperty(this);
		}
	}
}


export class IntegerPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INTEGER(): TerminalNode {
		return this.getToken(MetaEdGrammar.INTEGER, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public minValue(): MinValueContext {
		return this.getTypedRuleContext(MinValueContext, 0) as MinValueContext;
	}
	public maxValue(): MaxValueContext {
		return this.getTypedRuleContext(MaxValueContext, 0) as MaxValueContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_integerProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterIntegerProperty) {
	 		listener.enterIntegerProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitIntegerProperty) {
	 		listener.exitIntegerProperty(this);
		}
	}
}


export class PercentPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PERCENT(): TerminalNode {
		return this.getToken(MetaEdGrammar.PERCENT, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_percentProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterPercentProperty) {
	 		listener.enterPercentProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitPercentProperty) {
	 		listener.exitPercentProperty(this);
		}
	}
}


export class AssociationPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ASSOCIATION_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.ASSOCIATION_KEYWORD, 0);
	}
	public propertyName(): PropertyNameContext {
		return this.getTypedRuleContext(PropertyNameContext, 0) as PropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public potentiallyLogical(): PotentiallyLogicalContext {
		return this.getTypedRuleContext(PotentiallyLogicalContext, 0) as PotentiallyLogicalContext;
	}
	public isWeakReference(): IsWeakReferenceContext {
		return this.getTypedRuleContext(IsWeakReferenceContext, 0) as IsWeakReferenceContext;
	}
	public mergeDirective_list(): MergeDirectiveContext[] {
		return this.getTypedRuleContexts(MergeDirectiveContext) as MergeDirectiveContext[];
	}
	public mergeDirective(i: number): MergeDirectiveContext {
		return this.getTypedRuleContext(MergeDirectiveContext, i) as MergeDirectiveContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_associationProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterAssociationProperty) {
	 		listener.enterAssociationProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitAssociationProperty) {
	 		listener.exitAssociationProperty(this);
		}
	}
}


export class DomainEntityPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOMAIN_ENTITY_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.DOMAIN_ENTITY_KEYWORD, 0);
	}
	public propertyName(): PropertyNameContext {
		return this.getTypedRuleContext(PropertyNameContext, 0) as PropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public potentiallyLogical(): PotentiallyLogicalContext {
		return this.getTypedRuleContext(PotentiallyLogicalContext, 0) as PotentiallyLogicalContext;
	}
	public isWeakReference(): IsWeakReferenceContext {
		return this.getTypedRuleContext(IsWeakReferenceContext, 0) as IsWeakReferenceContext;
	}
	public mergeDirective_list(): MergeDirectiveContext[] {
		return this.getTypedRuleContexts(MergeDirectiveContext) as MergeDirectiveContext[];
	}
	public mergeDirective(i: number): MergeDirectiveContext {
		return this.getTypedRuleContext(MergeDirectiveContext, i) as MergeDirectiveContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_domainEntityProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDomainEntityProperty) {
	 		listener.enterDomainEntityProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDomainEntityProperty) {
	 		listener.exitDomainEntityProperty(this);
		}
	}
}


export class SharedDecimalPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHARED_DECIMAL_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_DECIMAL_KEYWORD, 0);
	}
	public sharedPropertyType(): SharedPropertyTypeContext {
		return this.getTypedRuleContext(SharedPropertyTypeContext, 0) as SharedPropertyTypeContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public SHARED_NAMED(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_NAMED, 0);
	}
	public sharedPropertyName(): SharedPropertyNameContext {
		return this.getTypedRuleContext(SharedPropertyNameContext, 0) as SharedPropertyNameContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public mergeDirective_list(): MergeDirectiveContext[] {
		return this.getTypedRuleContexts(MergeDirectiveContext) as MergeDirectiveContext[];
	}
	public mergeDirective(i: number): MergeDirectiveContext {
		return this.getTypedRuleContext(MergeDirectiveContext, i) as MergeDirectiveContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedDecimalProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedDecimalProperty) {
	 		listener.enterSharedDecimalProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedDecimalProperty) {
	 		listener.exitSharedDecimalProperty(this);
		}
	}
}


export class SharedIntegerPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHARED_INTEGER_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_INTEGER_KEYWORD, 0);
	}
	public sharedPropertyType(): SharedPropertyTypeContext {
		return this.getTypedRuleContext(SharedPropertyTypeContext, 0) as SharedPropertyTypeContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public SHARED_NAMED(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_NAMED, 0);
	}
	public sharedPropertyName(): SharedPropertyNameContext {
		return this.getTypedRuleContext(SharedPropertyNameContext, 0) as SharedPropertyNameContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public mergeDirective_list(): MergeDirectiveContext[] {
		return this.getTypedRuleContexts(MergeDirectiveContext) as MergeDirectiveContext[];
	}
	public mergeDirective(i: number): MergeDirectiveContext {
		return this.getTypedRuleContext(MergeDirectiveContext, i) as MergeDirectiveContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedIntegerProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedIntegerProperty) {
	 		listener.enterSharedIntegerProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedIntegerProperty) {
	 		listener.exitSharedIntegerProperty(this);
		}
	}
}


export class SharedShortPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHARED_SHORT_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_SHORT_KEYWORD, 0);
	}
	public sharedPropertyType(): SharedPropertyTypeContext {
		return this.getTypedRuleContext(SharedPropertyTypeContext, 0) as SharedPropertyTypeContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public SHARED_NAMED(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_NAMED, 0);
	}
	public sharedPropertyName(): SharedPropertyNameContext {
		return this.getTypedRuleContext(SharedPropertyNameContext, 0) as SharedPropertyNameContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public mergeDirective_list(): MergeDirectiveContext[] {
		return this.getTypedRuleContexts(MergeDirectiveContext) as MergeDirectiveContext[];
	}
	public mergeDirective(i: number): MergeDirectiveContext {
		return this.getTypedRuleContext(MergeDirectiveContext, i) as MergeDirectiveContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedShortProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedShortProperty) {
	 		listener.enterSharedShortProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedShortProperty) {
	 		listener.exitSharedShortProperty(this);
		}
	}
}


export class SharedStringPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHARED_STRING_KEYWORD(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_STRING_KEYWORD, 0);
	}
	public sharedPropertyType(): SharedPropertyTypeContext {
		return this.getTypedRuleContext(SharedPropertyTypeContext, 0) as SharedPropertyTypeContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public SHARED_NAMED(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHARED_NAMED, 0);
	}
	public sharedPropertyName(): SharedPropertyNameContext {
		return this.getTypedRuleContext(SharedPropertyNameContext, 0) as SharedPropertyNameContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public mergeDirective_list(): MergeDirectiveContext[] {
		return this.getTypedRuleContexts(MergeDirectiveContext) as MergeDirectiveContext[];
	}
	public mergeDirective(i: number): MergeDirectiveContext {
		return this.getTypedRuleContext(MergeDirectiveContext, i) as MergeDirectiveContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedStringProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedStringProperty) {
	 		listener.enterSharedStringProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedStringProperty) {
	 		listener.exitSharedStringProperty(this);
		}
	}
}


export class ShortPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHORT(): TerminalNode {
		return this.getToken(MetaEdGrammar.SHORT, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public minValue(): MinValueContext {
		return this.getTypedRuleContext(MinValueContext, 0) as MinValueContext;
	}
	public maxValue(): MaxValueContext {
		return this.getTypedRuleContext(MaxValueContext, 0) as MaxValueContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_shortProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterShortProperty) {
	 		listener.enterShortProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitShortProperty) {
	 		listener.exitShortProperty(this);
		}
	}
}


export class StringPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public STRING(): TerminalNode {
		return this.getToken(MetaEdGrammar.STRING, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public maxLength(): MaxLengthContext {
		return this.getTypedRuleContext(MaxLengthContext, 0) as MaxLengthContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
	public minLength(): MinLengthContext {
		return this.getTypedRuleContext(MinLengthContext, 0) as MinLengthContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_stringProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterStringProperty) {
	 		listener.enterStringProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitStringProperty) {
	 		listener.exitStringProperty(this);
		}
	}
}


export class TimePropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TIME(): TerminalNode {
		return this.getToken(MetaEdGrammar.TIME, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_timeProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterTimeProperty) {
	 		listener.enterTimeProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitTimeProperty) {
	 		listener.exitTimeProperty(this);
		}
	}
}


export class YearPropertyContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public YEAR(): TerminalNode {
		return this.getToken(MetaEdGrammar.YEAR, 0);
	}
	public simplePropertyName(): SimplePropertyNameContext {
		return this.getTypedRuleContext(SimplePropertyNameContext, 0) as SimplePropertyNameContext;
	}
	public propertyComponents(): PropertyComponentsContext {
		return this.getTypedRuleContext(PropertyComponentsContext, 0) as PropertyComponentsContext;
	}
	public metaEdId(): MetaEdIdContext {
		return this.getTypedRuleContext(MetaEdIdContext, 0) as MetaEdIdContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_yearProperty;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterYearProperty) {
	 		listener.enterYearProperty(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitYearProperty) {
	 		listener.exitYearProperty(this);
		}
	}
}


export class IsWeakReferenceContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IS_WEAK_REFERENCE(): TerminalNode {
		return this.getToken(MetaEdGrammar.IS_WEAK_REFERENCE, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_isWeakReference;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterIsWeakReference) {
	 		listener.enterIsWeakReference(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitIsWeakReference) {
	 		listener.exitIsWeakReference(this);
		}
	}
}


export class PotentiallyLogicalContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public POTENTIALLY_LOGICAL(): TerminalNode {
		return this.getToken(MetaEdGrammar.POTENTIALLY_LOGICAL, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_potentiallyLogical;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterPotentiallyLogical) {
	 		listener.enterPotentiallyLogical(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitPotentiallyLogical) {
	 		listener.exitPotentiallyLogical(this);
		}
	}
}


export class MergeDirectiveContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MERGE_REFERENCE(): TerminalNode {
		return this.getToken(MetaEdGrammar.MERGE_REFERENCE, 0);
	}
	public sourcePropertyPath(): SourcePropertyPathContext {
		return this.getTypedRuleContext(SourcePropertyPathContext, 0) as SourcePropertyPathContext;
	}
	public WITH(): TerminalNode {
		return this.getToken(MetaEdGrammar.WITH, 0);
	}
	public targetPropertyPath(): TargetPropertyPathContext {
		return this.getTypedRuleContext(TargetPropertyPathContext, 0) as TargetPropertyPathContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_mergeDirective;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterMergeDirective) {
	 		listener.enterMergeDirective(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitMergeDirective) {
	 		listener.exitMergeDirective(this);
		}
	}
}


export class SourcePropertyPathContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public propertyPath(): PropertyPathContext {
		return this.getTypedRuleContext(PropertyPathContext, 0) as PropertyPathContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sourcePropertyPath;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSourcePropertyPath) {
	 		listener.enterSourcePropertyPath(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSourcePropertyPath) {
	 		listener.exitSourcePropertyPath(this);
		}
	}
}


export class TargetPropertyPathContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public propertyPath(): PropertyPathContext {
		return this.getTypedRuleContext(PropertyPathContext, 0) as PropertyPathContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_targetPropertyPath;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterTargetPropertyPath) {
	 		listener.enterTargetPropertyPath(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitTargetPropertyPath) {
	 		listener.exitTargetPropertyPath(this);
		}
	}
}


export class PropertyPathContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(MetaEdGrammar.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, i);
	}
	public PERIOD_list(): TerminalNode[] {
	    	return this.getTokens(MetaEdGrammar.PERIOD);
	}
	public PERIOD(i: number): TerminalNode {
		return this.getToken(MetaEdGrammar.PERIOD, i);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_propertyPath;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterPropertyPath) {
	 		listener.enterPropertyPath(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitPropertyPath) {
	 		listener.exitPropertyPath(this);
		}
	}
}


export class Signed_intContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNSIGNED_INT(): TerminalNode {
		return this.getToken(MetaEdGrammar.UNSIGNED_INT, 0);
	}
	public unaryOperator(): UnaryOperatorContext {
		return this.getTypedRuleContext(UnaryOperatorContext, 0) as UnaryOperatorContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_signed_int;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSigned_int) {
	 		listener.enterSigned_int(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSigned_int) {
	 		listener.exitSigned_int(this);
		}
	}
}


export class UnaryOperatorContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public POS_SIGN(): TerminalNode {
		return this.getToken(MetaEdGrammar.POS_SIGN, 0);
	}
	public NEG_SIGN(): TerminalNode {
		return this.getToken(MetaEdGrammar.NEG_SIGN, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_unaryOperator;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterUnaryOperator) {
	 		listener.enterUnaryOperator(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitUnaryOperator) {
	 		listener.exitUnaryOperator(this);
		}
	}
}


export class AbstractEntityNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_abstractEntityName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterAbstractEntityName) {
	 		listener.enterAbstractEntityName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitAbstractEntityName) {
	 		listener.exitAbstractEntityName(this);
		}
	}
}


export class AssociationNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_associationName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterAssociationName) {
	 		listener.enterAssociationName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitAssociationName) {
	 		listener.exitAssociationName(this);
		}
	}
}


export class BaseKeyNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_baseKeyName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterBaseKeyName) {
	 		listener.enterBaseKeyName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitBaseKeyName) {
	 		listener.exitBaseKeyName(this);
		}
	}
}


export class BaseNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public localBaseName(): LocalBaseNameContext {
		return this.getTypedRuleContext(LocalBaseNameContext, 0) as LocalBaseNameContext;
	}
	public baseNamespace(): BaseNamespaceContext {
		return this.getTypedRuleContext(BaseNamespaceContext, 0) as BaseNamespaceContext;
	}
	public PERIOD(): TerminalNode {
		return this.getToken(MetaEdGrammar.PERIOD, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_baseName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterBaseName) {
	 		listener.enterBaseName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitBaseName) {
	 		listener.exitBaseName(this);
		}
	}
}


export class BaseNamespaceContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_baseNamespace;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterBaseNamespace) {
	 		listener.enterBaseNamespace(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitBaseNamespace) {
	 		listener.exitBaseNamespace(this);
		}
	}
}


export class ChoiceNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_choiceName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterChoiceName) {
	 		listener.enterChoiceName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitChoiceName) {
	 		listener.exitChoiceName(this);
		}
	}
}


export class SharedDecimalNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedDecimalName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedDecimalName) {
	 		listener.enterSharedDecimalName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedDecimalName) {
	 		listener.exitSharedDecimalName(this);
		}
	}
}


export class SharedIntegerNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedIntegerName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedIntegerName) {
	 		listener.enterSharedIntegerName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedIntegerName) {
	 		listener.exitSharedIntegerName(this);
		}
	}
}


export class CommonNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_commonName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterCommonName) {
	 		listener.enterCommonName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitCommonName) {
	 		listener.exitCommonName(this);
		}
	}
}


export class SharedShortNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedShortName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedShortName) {
	 		listener.enterSharedShortName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedShortName) {
	 		listener.exitSharedShortName(this);
		}
	}
}


export class SharedStringNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedStringName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedStringName) {
	 		listener.enterSharedStringName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedStringName) {
	 		listener.exitSharedStringName(this);
		}
	}
}


export class DescriptorNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_descriptorName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDescriptorName) {
	 		listener.enterDescriptorName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDescriptorName) {
	 		listener.exitDescriptorName(this);
		}
	}
}


export class DomainNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_domainName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterDomainName) {
	 		listener.enterDomainName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitDomainName) {
	 		listener.exitDomainName(this);
		}
	}
}


export class EntityNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_entityName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterEntityName) {
	 		listener.enterEntityName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitEntityName) {
	 		listener.exitEntityName(this);
		}
	}
}


export class EnumerationNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_enumerationName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterEnumerationName) {
	 		listener.enterEnumerationName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitEnumerationName) {
	 		listener.exitEnumerationName(this);
		}
	}
}


export class ExtendeeNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public localExtendeeName(): LocalExtendeeNameContext {
		return this.getTypedRuleContext(LocalExtendeeNameContext, 0) as LocalExtendeeNameContext;
	}
	public extendeeNamespace(): ExtendeeNamespaceContext {
		return this.getTypedRuleContext(ExtendeeNamespaceContext, 0) as ExtendeeNamespaceContext;
	}
	public PERIOD(): TerminalNode {
		return this.getToken(MetaEdGrammar.PERIOD, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_extendeeName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterExtendeeName) {
	 		listener.enterExtendeeName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitExtendeeName) {
	 		listener.exitExtendeeName(this);
		}
	}
}


export class ExtendeeNamespaceContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_extendeeNamespace;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterExtendeeNamespace) {
	 		listener.enterExtendeeNamespace(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitExtendeeNamespace) {
	 		listener.exitExtendeeNamespace(this);
		}
	}
}


export class InlineCommonNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_inlineCommonName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterInlineCommonName) {
	 		listener.enterInlineCommonName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitInlineCommonName) {
	 		listener.exitInlineCommonName(this);
		}
	}
}


export class InterchangeNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_interchangeName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterInterchangeName) {
	 		listener.enterInterchangeName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitInterchangeName) {
	 		listener.exitInterchangeName(this);
		}
	}
}


export class LocalBaseNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_localBaseName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterLocalBaseName) {
	 		listener.enterLocalBaseName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitLocalBaseName) {
	 		listener.exitLocalBaseName(this);
		}
	}
}


export class LocalDomainItemNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_localDomainItemName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterLocalDomainItemName) {
	 		listener.enterLocalDomainItemName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitLocalDomainItemName) {
	 		listener.exitLocalDomainItemName(this);
		}
	}
}


export class LocalExtendeeNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_localExtendeeName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterLocalExtendeeName) {
	 		listener.enterLocalExtendeeName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitLocalExtendeeName) {
	 		listener.exitLocalExtendeeName(this);
		}
	}
}


export class LocalInterchangeItemNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_localInterchangeItemName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterLocalInterchangeItemName) {
	 		listener.enterLocalInterchangeItemName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitLocalInterchangeItemName) {
	 		listener.exitLocalInterchangeItemName(this);
		}
	}
}


export class LocalPropertyNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_localPropertyName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterLocalPropertyName) {
	 		listener.enterLocalPropertyName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitLocalPropertyName) {
	 		listener.exitLocalPropertyName(this);
		}
	}
}


export class LocalPropertyTypeContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_localPropertyType;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterLocalPropertyType) {
	 		listener.enterLocalPropertyType(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitLocalPropertyType) {
	 		listener.exitLocalPropertyType(this);
		}
	}
}


export class ParentDomainNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_parentDomainName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterParentDomainName) {
	 		listener.enterParentDomainName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitParentDomainName) {
	 		listener.exitParentDomainName(this);
		}
	}
}


export class PropertyNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public localPropertyName(): LocalPropertyNameContext {
		return this.getTypedRuleContext(LocalPropertyNameContext, 0) as LocalPropertyNameContext;
	}
	public propertyNamespace(): PropertyNamespaceContext {
		return this.getTypedRuleContext(PropertyNamespaceContext, 0) as PropertyNamespaceContext;
	}
	public PERIOD(): TerminalNode {
		return this.getToken(MetaEdGrammar.PERIOD, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_propertyName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterPropertyName) {
	 		listener.enterPropertyName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitPropertyName) {
	 		listener.exitPropertyName(this);
		}
	}
}


export class PropertyNamespaceContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_propertyNamespace;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterPropertyNamespace) {
	 		listener.enterPropertyNamespace(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitPropertyNamespace) {
	 		listener.exitPropertyNamespace(this);
		}
	}
}


export class RoleNameNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_roleNameName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterRoleNameName) {
	 		listener.enterRoleNameName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitRoleNameName) {
	 		listener.exitRoleNameName(this);
		}
	}
}


export class SharedPropertyNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedPropertyName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedPropertyName) {
	 		listener.enterSharedPropertyName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedPropertyName) {
	 		listener.exitSharedPropertyName(this);
		}
	}
}


export class SharedPropertyTypeContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public localPropertyType(): LocalPropertyTypeContext {
		return this.getTypedRuleContext(LocalPropertyTypeContext, 0) as LocalPropertyTypeContext;
	}
	public propertyNamespace(): PropertyNamespaceContext {
		return this.getTypedRuleContext(PropertyNamespaceContext, 0) as PropertyNamespaceContext;
	}
	public PERIOD(): TerminalNode {
		return this.getToken(MetaEdGrammar.PERIOD, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_sharedPropertyType;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSharedPropertyType) {
	 		listener.enterSharedPropertyType(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSharedPropertyType) {
	 		listener.exitSharedPropertyType(this);
		}
	}
}


export class ShortenToNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_shortenToName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterShortenToName) {
	 		listener.enterShortenToName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitShortenToName) {
	 		listener.exitShortenToName(this);
		}
	}
}


export class SimplePropertyNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public localPropertyName(): LocalPropertyNameContext {
		return this.getTypedRuleContext(LocalPropertyNameContext, 0) as LocalPropertyNameContext;
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_simplePropertyName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSimplePropertyName) {
	 		listener.enterSimplePropertyName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSimplePropertyName) {
	 		listener.exitSimplePropertyName(this);
		}
	}
}


export class SubdomainNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_subdomainName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterSubdomainName) {
	 		listener.enterSubdomainName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitSubdomainName) {
	 		listener.exitSubdomainName(this);
		}
	}
}


export class NamespaceNameContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_namespaceName;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterNamespaceName) {
	 		listener.enterNamespaceName(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitNamespaceName) {
	 		listener.exitNamespaceName(this);
		}
	}
}


export class MetaEdIdContext extends ParserRuleContext {
	constructor(parser?: MetaEdGrammar, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public METAED_ID(): TerminalNode {
		return this.getToken(MetaEdGrammar.METAED_ID, 0);
	}
    public get ruleIndex(): number {
    	return MetaEdGrammar.RULE_metaEdId;
	}
	public enterRule(listener: MetaEdGrammarListener): void {
	    if(listener.enterMetaEdId) {
	 		listener.enterMetaEdId(this);
		}
	}
	public exitRule(listener: MetaEdGrammarListener): void {
	    if(listener.exitMetaEdId) {
	 		listener.exitMetaEdId(this);
		}
	}
}

// Generated from c:\work\metaed\MetaEd-js\packages\metaed-core\src\grammar\language\MetaEdGrammar.g4 by ANTLR 4.9.2
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class MetaEdGrammar extends Parser {
	static { RuntimeMetaData.checkVersion("4.9.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		ABSTRACT_ENTITY=1, ASSOCIATION=2, BEGIN_NAMESPACE=3, END_NAMESPACE=4, 
		CHOICE=5, COMMON=6, DESCRIPTOR=7, DOMAIN=8, DOMAIN_ENTITY=9, ENUMERATION=10, 
		INLINE=11, INTERCHANGE=12, INLINE_COMMON=13, SHARED_DECIMAL=14, SHARED_INTEGER=15, 
		SHARED_SHORT=16, SHARED_STRING=17, SUBDOMAIN=18, TYPE=19, ASSOCIATION_KEYWORD=20, 
		ASSOCIATION_IDENTITY=21, BOOLEAN=22, CHOICE_KEYWORD=23, COMMON_KEYWORD=24, 
		COMMON_EXTENSION=25, CURRENCY=26, DATE=27, DATETIME=28, DECIMAL=29, DESCRIPTOR_KEYWORD=30, 
		DOMAIN_ENTITY_KEYWORD=31, DOMAIN_ENTITY_IDENTITY=32, DOMAIN_ITEM=33, DURATION=34, 
		ELEMENT=35, ENUMERATION_KEYWORD=36, ENUMERATION_ITEM=37, INLINE_COMMON_KEYWORD=38, 
		INTEGER=39, PERCENT=40, REFERENCE=41, SHARED_DECIMAL_KEYWORD=42, SHARED_INTEGER_KEYWORD=43, 
		SHARED_SHORT_KEYWORD=44, SHARED_STRING_KEYWORD=45, SHARED_NAMED=46, SHORT=47, 
		STRING=48, TIME=49, YEAR=50, ADDITIONS=51, BIG=52, BASED_ON=53, CORE=54, 
		CASCADE_UPDATE=55, DECIMAL_PLACES=56, IDENTITY=57, IDENTITY_RENAME=58, 
		IS_QUERYABLE_FIELD=59, IS_QUERYABLE_ONLY=60, IS_WEAK_REFERENCE=61, POTENTIALLY_LOGICAL=62, 
		MERGE_REFERENCE=63, MIN_LENGTH=64, MAX_LENGTH=65, MIN_VALUE=66, MAX_VALUE=67, 
		OPTIONAL=68, OPTIONAL_COLLECTION=69, REQUIRED=70, REQUIRED_COLLECTION=71, 
		ROLE_NAME=72, SHORTEN_TO=73, SUBDOMAIN_OF=74, SUBDOMAIN_POSITION=75, TOTAL_DIGITS=76, 
		WITH=77, WITH_OPTIONAL_MAP_TYPE=78, WITH_MAP_TYPE=79, DEPRECATED=80, DOCUMENTATION=81, 
		INHERITED=82, EXTENDED_DOCUMENTATION=83, USE_CASE_DOCUMENTATION=84, FOOTER_DOCUMENTATION=85, 
		ID=86, UNSIGNED_INT=87, DECIMAL_VALUE=88, TEXT=89, METAED_ID=90, POS_SIGN=91, 
		NEG_SIGN=92, PERIOD=93, LINE_COMMENT=94, WS=95, ERROR_CHARACTER=96;
	public static final int
		RULE_metaEd = 0, RULE_namespace = 1, RULE_namespaceType = 2, RULE_topLevelEntity = 3, 
		RULE_deprecated = 4, RULE_propertyDeprecated = 5, RULE_documentation = 6, 
		RULE_enumerationItemDocumentation = 7, RULE_mapTypeDocumentation = 8, 
		RULE_propertyDocumentation = 9, RULE_abstractEntity = 10, RULE_entityConfiguration = 11, 
		RULE_cascadeUpdate = 12, RULE_association = 13, RULE_definingDomainEntity = 14, 
		RULE_associationExtension = 15, RULE_associationSubclass = 16, RULE_choice = 17, 
		RULE_sharedDecimal = 18, RULE_sharedInteger = 19, RULE_sharedShort = 20, 
		RULE_sharedString = 21, RULE_common = 22, RULE_commonExtension = 23, RULE_commonSubclass = 24, 
		RULE_descriptor = 25, RULE_withMapType = 26, RULE_requiredMapType = 27, 
		RULE_optionalMapType = 28, RULE_domain = 29, RULE_domainItem = 30, RULE_footerDocumentation = 31, 
		RULE_domainEntity = 32, RULE_domainEntityExtension = 33, RULE_domainEntitySubclass = 34, 
		RULE_enumeration = 35, RULE_enumerationItem = 36, RULE_shortDescription = 37, 
		RULE_inlineCommon = 38, RULE_interchange = 39, RULE_extendedDocumentation = 40, 
		RULE_useCaseDocumentation = 41, RULE_interchangeComponent = 42, RULE_interchangeElement = 43, 
		RULE_interchangeIdentity = 44, RULE_interchangeExtension = 45, RULE_interchangeExtensionComponent = 46, 
		RULE_subdomain = 47, RULE_subdomainPosition = 48, RULE_minValue = 49, 
		RULE_maxValue = 50, RULE_minValueShort = 51, RULE_maxValueShort = 52, 
		RULE_minValueDecimal = 53, RULE_maxValueDecimal = 54, RULE_decimalValue = 55, 
		RULE_totalDigits = 56, RULE_decimalPlaces = 57, RULE_commonExtensionOverride = 58, 
		RULE_propertyAnnotation = 59, RULE_identity = 60, RULE_identityRename = 61, 
		RULE_required = 62, RULE_optional = 63, RULE_collection = 64, RULE_requiredCollection = 65, 
		RULE_optionalCollection = 66, RULE_isQueryableOnly = 67, RULE_propertyComponents = 68, 
		RULE_isQueryableField = 69, RULE_roleName = 70, RULE_minLength = 71, RULE_maxLength = 72, 
		RULE_property = 73, RULE_booleanProperty = 74, RULE_currencyProperty = 75, 
		RULE_dateProperty = 76, RULE_datetimeProperty = 77, RULE_decimalProperty = 78, 
		RULE_descriptorProperty = 79, RULE_durationProperty = 80, RULE_enumerationProperty = 81, 
		RULE_commonProperty = 82, RULE_inlineCommonProperty = 83, RULE_choiceProperty = 84, 
		RULE_integerProperty = 85, RULE_percentProperty = 86, RULE_associationProperty = 87, 
		RULE_domainEntityProperty = 88, RULE_sharedDecimalProperty = 89, RULE_sharedIntegerProperty = 90, 
		RULE_sharedShortProperty = 91, RULE_sharedStringProperty = 92, RULE_shortProperty = 93, 
		RULE_stringProperty = 94, RULE_timeProperty = 95, RULE_yearProperty = 96, 
		RULE_isWeakReference = 97, RULE_potentiallyLogical = 98, RULE_mergeDirective = 99, 
		RULE_sourcePropertyPath = 100, RULE_targetPropertyPath = 101, RULE_propertyPath = 102, 
		RULE_signed_int = 103, RULE_unaryOperator = 104, RULE_abstractEntityName = 105, 
		RULE_associationName = 106, RULE_baseKeyName = 107, RULE_baseName = 108, 
		RULE_baseNamespace = 109, RULE_choiceName = 110, RULE_sharedDecimalName = 111, 
		RULE_sharedIntegerName = 112, RULE_commonName = 113, RULE_sharedShortName = 114, 
		RULE_sharedStringName = 115, RULE_descriptorName = 116, RULE_domainName = 117, 
		RULE_entityName = 118, RULE_enumerationName = 119, RULE_extendeeName = 120, 
		RULE_extendeeNamespace = 121, RULE_inlineCommonName = 122, RULE_interchangeName = 123, 
		RULE_localBaseName = 124, RULE_localDomainItemName = 125, RULE_localExtendeeName = 126, 
		RULE_localInterchangeItemName = 127, RULE_localPropertyName = 128, RULE_localPropertyType = 129, 
		RULE_parentDomainName = 130, RULE_propertyName = 131, RULE_propertyNamespace = 132, 
		RULE_roleNameName = 133, RULE_sharedPropertyName = 134, RULE_sharedPropertyType = 135, 
		RULE_shortenToName = 136, RULE_simplePropertyName = 137, RULE_subdomainName = 138, 
		RULE_namespaceName = 139, RULE_metaEdId = 140;
	private static String[] makeRuleNames() {
		return new String[] {
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
			"interchangeElement", "interchangeIdentity", "interchangeExtension", 
			"interchangeExtensionComponent", "subdomain", "subdomainPosition", "minValue", 
			"maxValue", "minValueShort", "maxValueShort", "minValueDecimal", "maxValueDecimal", 
			"decimalValue", "totalDigits", "decimalPlaces", "commonExtensionOverride", 
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
			"propertyPath", "signed_int", "unaryOperator", "abstractEntityName", 
			"associationName", "baseKeyName", "baseName", "baseNamespace", "choiceName", 
			"sharedDecimalName", "sharedIntegerName", "commonName", "sharedShortName", 
			"sharedStringName", "descriptorName", "domainName", "entityName", "enumerationName", 
			"extendeeName", "extendeeNamespace", "inlineCommonName", "interchangeName", 
			"localBaseName", "localDomainItemName", "localExtendeeName", "localInterchangeItemName", 
			"localPropertyName", "localPropertyType", "parentDomainName", "propertyName", 
			"propertyNamespace", "roleNameName", "sharedPropertyName", "sharedPropertyType", 
			"shortenToName", "simplePropertyName", "subdomainName", "namespaceName", 
			"metaEdId"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'Abstract Entity'", "'Association'", "'Begin Namespace'", "'End Namespace'", 
			"'Choice'", "'Common'", "'Descriptor'", "'Domain'", "'Domain Entity'", 
			"'Enumeration'", "'Inline'", "'Interchange'", "'Inline Common'", "'Shared Decimal'", 
			"'Shared Integer'", "'Shared Short'", "'Shared String'", "'Subdomain'", 
			"'Type'", "'association'", "'association identity'", "'bool'", "'choice'", 
			"'common'", "'common extension'", "'currency'", "'date'", "'datetime'", 
			"'decimal'", "'descriptor'", "'domain entity'", "'domain entity identity'", 
			"'domain item'", "'duration'", "'element'", "'enumeration'", "'item'", 
			"'inline common'", "'integer'", "'percent'", "'reference'", "'shared decimal'", 
			"'shared integer'", "'shared short'", "'shared string'", "'named'", "'short'", 
			"'string'", "'time'", "'year'", "'additions'", "'big'", "'based on'", 
			"'core'", "'allow primary key updates'", "'decimal places'", "'is part of identity'", 
			"'renames identity property'", "'is queryable field'", "'is queryable only'", 
			"'is weak'", "'potentially logical'", "'merge'", "'min length'", "'max length'", 
			"'min value'", "'max value'", "'is optional'", "'is optional collection'", 
			"'is required'", "'is required collection'", "'role name'", "'shorten to'", 
			"'of'", "'position'", "'total digits'", "'with'", "'with optional map type'", 
			"'with map type'", "'deprecated'", "'documentation'", "'inherited'", 
			"'extended documentation'", "'use case documentation'", "'footer documentation'", 
			null, null, null, null, null, "'+'", "'-'", "'.'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "ABSTRACT_ENTITY", "ASSOCIATION", "BEGIN_NAMESPACE", "END_NAMESPACE", 
			"CHOICE", "COMMON", "DESCRIPTOR", "DOMAIN", "DOMAIN_ENTITY", "ENUMERATION", 
			"INLINE", "INTERCHANGE", "INLINE_COMMON", "SHARED_DECIMAL", "SHARED_INTEGER", 
			"SHARED_SHORT", "SHARED_STRING", "SUBDOMAIN", "TYPE", "ASSOCIATION_KEYWORD", 
			"ASSOCIATION_IDENTITY", "BOOLEAN", "CHOICE_KEYWORD", "COMMON_KEYWORD", 
			"COMMON_EXTENSION", "CURRENCY", "DATE", "DATETIME", "DECIMAL", "DESCRIPTOR_KEYWORD", 
			"DOMAIN_ENTITY_KEYWORD", "DOMAIN_ENTITY_IDENTITY", "DOMAIN_ITEM", "DURATION", 
			"ELEMENT", "ENUMERATION_KEYWORD", "ENUMERATION_ITEM", "INLINE_COMMON_KEYWORD", 
			"INTEGER", "PERCENT", "REFERENCE", "SHARED_DECIMAL_KEYWORD", "SHARED_INTEGER_KEYWORD", 
			"SHARED_SHORT_KEYWORD", "SHARED_STRING_KEYWORD", "SHARED_NAMED", "SHORT", 
			"STRING", "TIME", "YEAR", "ADDITIONS", "BIG", "BASED_ON", "CORE", "CASCADE_UPDATE", 
			"DECIMAL_PLACES", "IDENTITY", "IDENTITY_RENAME", "IS_QUERYABLE_FIELD", 
			"IS_QUERYABLE_ONLY", "IS_WEAK_REFERENCE", "POTENTIALLY_LOGICAL", "MERGE_REFERENCE", 
			"MIN_LENGTH", "MAX_LENGTH", "MIN_VALUE", "MAX_VALUE", "OPTIONAL", "OPTIONAL_COLLECTION", 
			"REQUIRED", "REQUIRED_COLLECTION", "ROLE_NAME", "SHORTEN_TO", "SUBDOMAIN_OF", 
			"SUBDOMAIN_POSITION", "TOTAL_DIGITS", "WITH", "WITH_OPTIONAL_MAP_TYPE", 
			"WITH_MAP_TYPE", "DEPRECATED", "DOCUMENTATION", "INHERITED", "EXTENDED_DOCUMENTATION", 
			"USE_CASE_DOCUMENTATION", "FOOTER_DOCUMENTATION", "ID", "UNSIGNED_INT", 
			"DECIMAL_VALUE", "TEXT", "METAED_ID", "POS_SIGN", "NEG_SIGN", "PERIOD", 
			"LINE_COMMENT", "WS", "ERROR_CHARACTER"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "MetaEdGrammar.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public MetaEdGrammar(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class MetaEdContext extends ParserRuleContext {
		public List<NamespaceContext> namespace() {
			return getRuleContexts(NamespaceContext.class);
		}
		public NamespaceContext namespace(int i) {
			return getRuleContext(NamespaceContext.class,i);
		}
		public MetaEdContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_metaEd; }
	}

	public final MetaEdContext metaEd() throws RecognitionException {
		MetaEdContext _localctx = new MetaEdContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_metaEd);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(283); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(282);
				namespace();
				}
				}
				setState(285); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==BEGIN_NAMESPACE );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NamespaceContext extends ParserRuleContext {
		public TerminalNode BEGIN_NAMESPACE() { return getToken(MetaEdGrammar.BEGIN_NAMESPACE, 0); }
		public NamespaceNameContext namespaceName() {
			return getRuleContext(NamespaceNameContext.class,0);
		}
		public NamespaceTypeContext namespaceType() {
			return getRuleContext(NamespaceTypeContext.class,0);
		}
		public TerminalNode END_NAMESPACE() { return getToken(MetaEdGrammar.END_NAMESPACE, 0); }
		public List<TopLevelEntityContext> topLevelEntity() {
			return getRuleContexts(TopLevelEntityContext.class);
		}
		public TopLevelEntityContext topLevelEntity(int i) {
			return getRuleContext(TopLevelEntityContext.class,i);
		}
		public NamespaceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_namespace; }
	}

	public final NamespaceContext namespace() throws RecognitionException {
		NamespaceContext _localctx = new NamespaceContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_namespace);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(287);
			match(BEGIN_NAMESPACE);
			setState(288);
			namespaceName();
			setState(289);
			namespaceType();
			setState(291); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(290);
				topLevelEntity();
				}
				}
				setState(293); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ABSTRACT_ENTITY) | (1L << ASSOCIATION) | (1L << CHOICE) | (1L << COMMON) | (1L << DESCRIPTOR) | (1L << DOMAIN) | (1L << DOMAIN_ENTITY) | (1L << ENUMERATION) | (1L << INTERCHANGE) | (1L << INLINE_COMMON) | (1L << SHARED_DECIMAL) | (1L << SHARED_INTEGER) | (1L << SHARED_SHORT) | (1L << SHARED_STRING) | (1L << SUBDOMAIN))) != 0) );
			setState(295);
			match(END_NAMESPACE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NamespaceTypeContext extends ParserRuleContext {
		public TerminalNode CORE() { return getToken(MetaEdGrammar.CORE, 0); }
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public NamespaceTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_namespaceType; }
	}

	public final NamespaceTypeContext namespaceType() throws RecognitionException {
		NamespaceTypeContext _localctx = new NamespaceTypeContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_namespaceType);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(297);
			_la = _input.LA(1);
			if ( !(_la==CORE || _la==ID) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TopLevelEntityContext extends ParserRuleContext {
		public AbstractEntityContext abstractEntity() {
			return getRuleContext(AbstractEntityContext.class,0);
		}
		public AssociationContext association() {
			return getRuleContext(AssociationContext.class,0);
		}
		public AssociationExtensionContext associationExtension() {
			return getRuleContext(AssociationExtensionContext.class,0);
		}
		public AssociationSubclassContext associationSubclass() {
			return getRuleContext(AssociationSubclassContext.class,0);
		}
		public ChoiceContext choice() {
			return getRuleContext(ChoiceContext.class,0);
		}
		public SharedDecimalContext sharedDecimal() {
			return getRuleContext(SharedDecimalContext.class,0);
		}
		public SharedIntegerContext sharedInteger() {
			return getRuleContext(SharedIntegerContext.class,0);
		}
		public SharedShortContext sharedShort() {
			return getRuleContext(SharedShortContext.class,0);
		}
		public SharedStringContext sharedString() {
			return getRuleContext(SharedStringContext.class,0);
		}
		public CommonContext common() {
			return getRuleContext(CommonContext.class,0);
		}
		public CommonExtensionContext commonExtension() {
			return getRuleContext(CommonExtensionContext.class,0);
		}
		public CommonSubclassContext commonSubclass() {
			return getRuleContext(CommonSubclassContext.class,0);
		}
		public DescriptorContext descriptor() {
			return getRuleContext(DescriptorContext.class,0);
		}
		public DomainEntityContext domainEntity() {
			return getRuleContext(DomainEntityContext.class,0);
		}
		public DomainEntityExtensionContext domainEntityExtension() {
			return getRuleContext(DomainEntityExtensionContext.class,0);
		}
		public DomainEntitySubclassContext domainEntitySubclass() {
			return getRuleContext(DomainEntitySubclassContext.class,0);
		}
		public EnumerationContext enumeration() {
			return getRuleContext(EnumerationContext.class,0);
		}
		public InlineCommonContext inlineCommon() {
			return getRuleContext(InlineCommonContext.class,0);
		}
		public InterchangeContext interchange() {
			return getRuleContext(InterchangeContext.class,0);
		}
		public InterchangeExtensionContext interchangeExtension() {
			return getRuleContext(InterchangeExtensionContext.class,0);
		}
		public DomainContext domain() {
			return getRuleContext(DomainContext.class,0);
		}
		public SubdomainContext subdomain() {
			return getRuleContext(SubdomainContext.class,0);
		}
		public TopLevelEntityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_topLevelEntity; }
	}

	public final TopLevelEntityContext topLevelEntity() throws RecognitionException {
		TopLevelEntityContext _localctx = new TopLevelEntityContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_topLevelEntity);
		try {
			setState(321);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,2,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(299);
				abstractEntity();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(300);
				association();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(301);
				associationExtension();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(302);
				associationSubclass();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(303);
				choice();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(304);
				sharedDecimal();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(305);
				sharedInteger();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(306);
				sharedShort();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(307);
				sharedString();
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(308);
				common();
				}
				break;
			case 11:
				enterOuterAlt(_localctx, 11);
				{
				setState(309);
				commonExtension();
				}
				break;
			case 12:
				enterOuterAlt(_localctx, 12);
				{
				setState(310);
				commonSubclass();
				}
				break;
			case 13:
				enterOuterAlt(_localctx, 13);
				{
				setState(311);
				descriptor();
				}
				break;
			case 14:
				enterOuterAlt(_localctx, 14);
				{
				setState(312);
				domainEntity();
				}
				break;
			case 15:
				enterOuterAlt(_localctx, 15);
				{
				setState(313);
				domainEntityExtension();
				}
				break;
			case 16:
				enterOuterAlt(_localctx, 16);
				{
				setState(314);
				domainEntitySubclass();
				}
				break;
			case 17:
				enterOuterAlt(_localctx, 17);
				{
				setState(315);
				enumeration();
				}
				break;
			case 18:
				enterOuterAlt(_localctx, 18);
				{
				setState(316);
				inlineCommon();
				}
				break;
			case 19:
				enterOuterAlt(_localctx, 19);
				{
				setState(317);
				interchange();
				}
				break;
			case 20:
				enterOuterAlt(_localctx, 20);
				{
				setState(318);
				interchangeExtension();
				}
				break;
			case 21:
				enterOuterAlt(_localctx, 21);
				{
				setState(319);
				domain();
				}
				break;
			case 22:
				enterOuterAlt(_localctx, 22);
				{
				setState(320);
				subdomain();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DeprecatedContext extends ParserRuleContext {
		public TerminalNode DEPRECATED() { return getToken(MetaEdGrammar.DEPRECATED, 0); }
		public TerminalNode TEXT() { return getToken(MetaEdGrammar.TEXT, 0); }
		public DeprecatedContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_deprecated; }
	}

	public final DeprecatedContext deprecated() throws RecognitionException {
		DeprecatedContext _localctx = new DeprecatedContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_deprecated);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(323);
			match(DEPRECATED);
			setState(324);
			match(TEXT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyDeprecatedContext extends ParserRuleContext {
		public TerminalNode DEPRECATED() { return getToken(MetaEdGrammar.DEPRECATED, 0); }
		public TerminalNode TEXT() { return getToken(MetaEdGrammar.TEXT, 0); }
		public PropertyDeprecatedContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyDeprecated; }
	}

	public final PropertyDeprecatedContext propertyDeprecated() throws RecognitionException {
		PropertyDeprecatedContext _localctx = new PropertyDeprecatedContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_propertyDeprecated);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(326);
			match(DEPRECATED);
			setState(327);
			match(TEXT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DocumentationContext extends ParserRuleContext {
		public TerminalNode DOCUMENTATION() { return getToken(MetaEdGrammar.DOCUMENTATION, 0); }
		public TerminalNode TEXT() { return getToken(MetaEdGrammar.TEXT, 0); }
		public DocumentationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_documentation; }
	}

	public final DocumentationContext documentation() throws RecognitionException {
		DocumentationContext _localctx = new DocumentationContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_documentation);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(329);
			match(DOCUMENTATION);
			setState(330);
			match(TEXT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EnumerationItemDocumentationContext extends ParserRuleContext {
		public TerminalNode DOCUMENTATION() { return getToken(MetaEdGrammar.DOCUMENTATION, 0); }
		public TerminalNode TEXT() { return getToken(MetaEdGrammar.TEXT, 0); }
		public EnumerationItemDocumentationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_enumerationItemDocumentation; }
	}

	public final EnumerationItemDocumentationContext enumerationItemDocumentation() throws RecognitionException {
		EnumerationItemDocumentationContext _localctx = new EnumerationItemDocumentationContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_enumerationItemDocumentation);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(332);
			match(DOCUMENTATION);
			setState(333);
			match(TEXT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MapTypeDocumentationContext extends ParserRuleContext {
		public TerminalNode DOCUMENTATION() { return getToken(MetaEdGrammar.DOCUMENTATION, 0); }
		public TerminalNode TEXT() { return getToken(MetaEdGrammar.TEXT, 0); }
		public MapTypeDocumentationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_mapTypeDocumentation; }
	}

	public final MapTypeDocumentationContext mapTypeDocumentation() throws RecognitionException {
		MapTypeDocumentationContext _localctx = new MapTypeDocumentationContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_mapTypeDocumentation);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(335);
			match(DOCUMENTATION);
			setState(336);
			match(TEXT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyDocumentationContext extends ParserRuleContext {
		public TerminalNode DOCUMENTATION() { return getToken(MetaEdGrammar.DOCUMENTATION, 0); }
		public TerminalNode TEXT() { return getToken(MetaEdGrammar.TEXT, 0); }
		public TerminalNode INHERITED() { return getToken(MetaEdGrammar.INHERITED, 0); }
		public PropertyDocumentationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyDocumentation; }
	}

	public final PropertyDocumentationContext propertyDocumentation() throws RecognitionException {
		PropertyDocumentationContext _localctx = new PropertyDocumentationContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_propertyDocumentation);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(338);
			match(DOCUMENTATION);
			setState(339);
			_la = _input.LA(1);
			if ( !(_la==INHERITED || _la==TEXT) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AbstractEntityContext extends ParserRuleContext {
		public TerminalNode ABSTRACT_ENTITY() { return getToken(MetaEdGrammar.ABSTRACT_ENTITY, 0); }
		public AbstractEntityNameContext abstractEntityName() {
			return getRuleContext(AbstractEntityNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public AbstractEntityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_abstractEntity; }
	}

	public final AbstractEntityContext abstractEntity() throws RecognitionException {
		AbstractEntityContext _localctx = new AbstractEntityContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_abstractEntity);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(341);
			match(ABSTRACT_ENTITY);
			setState(342);
			abstractEntityName();
			setState(344);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(343);
				metaEdId();
				}
			}

			setState(347);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(346);
				deprecated();
				}
			}

			setState(349);
			documentation();
			setState(351); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(350);
				property();
				}
				}
				setState(353); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityConfigurationContext extends ParserRuleContext {
		public CascadeUpdateContext cascadeUpdate() {
			return getRuleContext(CascadeUpdateContext.class,0);
		}
		public EntityConfigurationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityConfiguration; }
	}

	public final EntityConfigurationContext entityConfiguration() throws RecognitionException {
		EntityConfigurationContext _localctx = new EntityConfigurationContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_entityConfiguration);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(355);
			cascadeUpdate();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CascadeUpdateContext extends ParserRuleContext {
		public TerminalNode CASCADE_UPDATE() { return getToken(MetaEdGrammar.CASCADE_UPDATE, 0); }
		public CascadeUpdateContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_cascadeUpdate; }
	}

	public final CascadeUpdateContext cascadeUpdate() throws RecognitionException {
		CascadeUpdateContext _localctx = new CascadeUpdateContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_cascadeUpdate);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(357);
			match(CASCADE_UPDATE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AssociationContext extends ParserRuleContext {
		public TerminalNode ASSOCIATION() { return getToken(MetaEdGrammar.ASSOCIATION, 0); }
		public AssociationNameContext associationName() {
			return getRuleContext(AssociationNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public List<DefiningDomainEntityContext> definingDomainEntity() {
			return getRuleContexts(DefiningDomainEntityContext.class);
		}
		public DefiningDomainEntityContext definingDomainEntity(int i) {
			return getRuleContext(DefiningDomainEntityContext.class,i);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public EntityConfigurationContext entityConfiguration() {
			return getRuleContext(EntityConfigurationContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public AssociationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_association; }
	}

	public final AssociationContext association() throws RecognitionException {
		AssociationContext _localctx = new AssociationContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_association);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(359);
			match(ASSOCIATION);
			setState(360);
			associationName();
			setState(362);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(361);
				metaEdId();
				}
			}

			setState(365);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(364);
				deprecated();
				}
			}

			setState(367);
			documentation();
			setState(369);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==CASCADE_UPDATE) {
				{
				setState(368);
				entityConfiguration();
				}
			}

			setState(371);
			definingDomainEntity();
			setState(372);
			definingDomainEntity();
			setState(376);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0)) {
				{
				{
				setState(373);
				property();
				}
				}
				setState(378);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DefiningDomainEntityContext extends ParserRuleContext {
		public TerminalNode DOMAIN_ENTITY_KEYWORD() { return getToken(MetaEdGrammar.DOMAIN_ENTITY_KEYWORD, 0); }
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public PropertyDocumentationContext propertyDocumentation() {
			return getRuleContext(PropertyDocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public PropertyDeprecatedContext propertyDeprecated() {
			return getRuleContext(PropertyDeprecatedContext.class,0);
		}
		public RoleNameContext roleName() {
			return getRuleContext(RoleNameContext.class,0);
		}
		public List<MergeDirectiveContext> mergeDirective() {
			return getRuleContexts(MergeDirectiveContext.class);
		}
		public MergeDirectiveContext mergeDirective(int i) {
			return getRuleContext(MergeDirectiveContext.class,i);
		}
		public DefiningDomainEntityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_definingDomainEntity; }
	}

	public final DefiningDomainEntityContext definingDomainEntity() throws RecognitionException {
		DefiningDomainEntityContext _localctx = new DefiningDomainEntityContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_definingDomainEntity);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(379);
			match(DOMAIN_ENTITY_KEYWORD);
			setState(380);
			propertyName();
			setState(382);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(381);
				metaEdId();
				}
			}

			setState(385);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(384);
				propertyDeprecated();
				}
			}

			setState(387);
			propertyDocumentation();
			setState(389);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==ROLE_NAME) {
				{
				setState(388);
				roleName();
				}
			}

			setState(394);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MERGE_REFERENCE) {
				{
				{
				setState(391);
				mergeDirective();
				}
				}
				setState(396);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AssociationExtensionContext extends ParserRuleContext {
		public TerminalNode ASSOCIATION() { return getToken(MetaEdGrammar.ASSOCIATION, 0); }
		public ExtendeeNameContext extendeeName() {
			return getRuleContext(ExtendeeNameContext.class,0);
		}
		public TerminalNode ADDITIONS() { return getToken(MetaEdGrammar.ADDITIONS, 0); }
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public AssociationExtensionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_associationExtension; }
	}

	public final AssociationExtensionContext associationExtension() throws RecognitionException {
		AssociationExtensionContext _localctx = new AssociationExtensionContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_associationExtension);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(397);
			match(ASSOCIATION);
			setState(398);
			extendeeName();
			setState(399);
			match(ADDITIONS);
			setState(401);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(400);
				metaEdId();
				}
			}

			setState(404);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(403);
				deprecated();
				}
			}

			setState(407); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(406);
				property();
				}
				}
				setState(409); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AssociationSubclassContext extends ParserRuleContext {
		public TerminalNode ASSOCIATION() { return getToken(MetaEdGrammar.ASSOCIATION, 0); }
		public AssociationNameContext associationName() {
			return getRuleContext(AssociationNameContext.class,0);
		}
		public TerminalNode BASED_ON() { return getToken(MetaEdGrammar.BASED_ON, 0); }
		public BaseNameContext baseName() {
			return getRuleContext(BaseNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public AssociationSubclassContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_associationSubclass; }
	}

	public final AssociationSubclassContext associationSubclass() throws RecognitionException {
		AssociationSubclassContext _localctx = new AssociationSubclassContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_associationSubclass);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(411);
			match(ASSOCIATION);
			setState(412);
			associationName();
			setState(413);
			match(BASED_ON);
			setState(414);
			baseName();
			setState(416);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(415);
				metaEdId();
				}
			}

			setState(419);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(418);
				deprecated();
				}
			}

			setState(421);
			documentation();
			setState(423); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(422);
				property();
				}
				}
				setState(425); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ChoiceContext extends ParserRuleContext {
		public TerminalNode CHOICE() { return getToken(MetaEdGrammar.CHOICE, 0); }
		public ChoiceNameContext choiceName() {
			return getRuleContext(ChoiceNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public ChoiceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_choice; }
	}

	public final ChoiceContext choice() throws RecognitionException {
		ChoiceContext _localctx = new ChoiceContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_choice);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(427);
			match(CHOICE);
			setState(428);
			choiceName();
			setState(430);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(429);
				metaEdId();
				}
			}

			setState(433);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(432);
				deprecated();
				}
			}

			setState(435);
			documentation();
			setState(437); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(436);
				property();
				}
				}
				setState(439); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedDecimalContext extends ParserRuleContext {
		public TerminalNode SHARED_DECIMAL() { return getToken(MetaEdGrammar.SHARED_DECIMAL, 0); }
		public SharedDecimalNameContext sharedDecimalName() {
			return getRuleContext(SharedDecimalNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public TotalDigitsContext totalDigits() {
			return getRuleContext(TotalDigitsContext.class,0);
		}
		public DecimalPlacesContext decimalPlaces() {
			return getRuleContext(DecimalPlacesContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public MinValueDecimalContext minValueDecimal() {
			return getRuleContext(MinValueDecimalContext.class,0);
		}
		public MaxValueDecimalContext maxValueDecimal() {
			return getRuleContext(MaxValueDecimalContext.class,0);
		}
		public SharedDecimalContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedDecimal; }
	}

	public final SharedDecimalContext sharedDecimal() throws RecognitionException {
		SharedDecimalContext _localctx = new SharedDecimalContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_sharedDecimal);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(441);
			match(SHARED_DECIMAL);
			setState(442);
			sharedDecimalName();
			setState(444);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(443);
				metaEdId();
				}
			}

			setState(447);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(446);
				deprecated();
				}
			}

			setState(449);
			documentation();
			setState(450);
			totalDigits();
			setState(451);
			decimalPlaces();
			setState(453);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MIN_VALUE) {
				{
				setState(452);
				minValueDecimal();
				}
			}

			setState(456);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MAX_VALUE) {
				{
				setState(455);
				maxValueDecimal();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedIntegerContext extends ParserRuleContext {
		public TerminalNode SHARED_INTEGER() { return getToken(MetaEdGrammar.SHARED_INTEGER, 0); }
		public SharedIntegerNameContext sharedIntegerName() {
			return getRuleContext(SharedIntegerNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public MinValueContext minValue() {
			return getRuleContext(MinValueContext.class,0);
		}
		public MaxValueContext maxValue() {
			return getRuleContext(MaxValueContext.class,0);
		}
		public SharedIntegerContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedInteger; }
	}

	public final SharedIntegerContext sharedInteger() throws RecognitionException {
		SharedIntegerContext _localctx = new SharedIntegerContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_sharedInteger);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(458);
			match(SHARED_INTEGER);
			setState(459);
			sharedIntegerName();
			setState(461);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(460);
				metaEdId();
				}
			}

			setState(464);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(463);
				deprecated();
				}
			}

			setState(466);
			documentation();
			setState(468);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MIN_VALUE) {
				{
				setState(467);
				minValue();
				}
			}

			setState(471);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MAX_VALUE) {
				{
				setState(470);
				maxValue();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedShortContext extends ParserRuleContext {
		public TerminalNode SHARED_SHORT() { return getToken(MetaEdGrammar.SHARED_SHORT, 0); }
		public SharedShortNameContext sharedShortName() {
			return getRuleContext(SharedShortNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public MinValueContext minValue() {
			return getRuleContext(MinValueContext.class,0);
		}
		public MaxValueContext maxValue() {
			return getRuleContext(MaxValueContext.class,0);
		}
		public SharedShortContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedShort; }
	}

	public final SharedShortContext sharedShort() throws RecognitionException {
		SharedShortContext _localctx = new SharedShortContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_sharedShort);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(473);
			match(SHARED_SHORT);
			setState(474);
			sharedShortName();
			setState(476);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(475);
				metaEdId();
				}
			}

			setState(479);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(478);
				deprecated();
				}
			}

			setState(481);
			documentation();
			setState(483);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MIN_VALUE) {
				{
				setState(482);
				minValue();
				}
			}

			setState(486);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MAX_VALUE) {
				{
				setState(485);
				maxValue();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedStringContext extends ParserRuleContext {
		public TerminalNode SHARED_STRING() { return getToken(MetaEdGrammar.SHARED_STRING, 0); }
		public SharedStringNameContext sharedStringName() {
			return getRuleContext(SharedStringNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MaxLengthContext maxLength() {
			return getRuleContext(MaxLengthContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public MinLengthContext minLength() {
			return getRuleContext(MinLengthContext.class,0);
		}
		public SharedStringContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedString; }
	}

	public final SharedStringContext sharedString() throws RecognitionException {
		SharedStringContext _localctx = new SharedStringContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_sharedString);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(488);
			match(SHARED_STRING);
			setState(489);
			sharedStringName();
			setState(491);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(490);
				metaEdId();
				}
			}

			setState(494);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(493);
				deprecated();
				}
			}

			setState(496);
			documentation();
			setState(498);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MIN_LENGTH) {
				{
				setState(497);
				minLength();
				}
			}

			setState(500);
			maxLength();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CommonContext extends ParserRuleContext {
		public TerminalNode COMMON() { return getToken(MetaEdGrammar.COMMON, 0); }
		public CommonNameContext commonName() {
			return getRuleContext(CommonNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public CommonContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_common; }
	}

	public final CommonContext common() throws RecognitionException {
		CommonContext _localctx = new CommonContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_common);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(502);
			match(COMMON);
			setState(503);
			commonName();
			setState(505);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(504);
				metaEdId();
				}
			}

			setState(508);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(507);
				deprecated();
				}
			}

			setState(510);
			documentation();
			setState(512); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(511);
				property();
				}
				}
				setState(514); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CommonExtensionContext extends ParserRuleContext {
		public TerminalNode COMMON() { return getToken(MetaEdGrammar.COMMON, 0); }
		public ExtendeeNameContext extendeeName() {
			return getRuleContext(ExtendeeNameContext.class,0);
		}
		public TerminalNode ADDITIONS() { return getToken(MetaEdGrammar.ADDITIONS, 0); }
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public CommonExtensionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commonExtension; }
	}

	public final CommonExtensionContext commonExtension() throws RecognitionException {
		CommonExtensionContext _localctx = new CommonExtensionContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_commonExtension);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(516);
			match(COMMON);
			setState(517);
			extendeeName();
			setState(518);
			match(ADDITIONS);
			setState(520);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(519);
				metaEdId();
				}
			}

			setState(523);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(522);
				deprecated();
				}
			}

			setState(526); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(525);
				property();
				}
				}
				setState(528); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CommonSubclassContext extends ParserRuleContext {
		public TerminalNode COMMON() { return getToken(MetaEdGrammar.COMMON, 0); }
		public CommonNameContext commonName() {
			return getRuleContext(CommonNameContext.class,0);
		}
		public TerminalNode BASED_ON() { return getToken(MetaEdGrammar.BASED_ON, 0); }
		public BaseNameContext baseName() {
			return getRuleContext(BaseNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public CommonSubclassContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commonSubclass; }
	}

	public final CommonSubclassContext commonSubclass() throws RecognitionException {
		CommonSubclassContext _localctx = new CommonSubclassContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_commonSubclass);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(530);
			match(COMMON);
			setState(531);
			commonName();
			setState(532);
			match(BASED_ON);
			setState(533);
			baseName();
			setState(535);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(534);
				metaEdId();
				}
			}

			setState(538);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(537);
				deprecated();
				}
			}

			setState(540);
			documentation();
			setState(542); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(541);
				property();
				}
				}
				setState(544); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DescriptorContext extends ParserRuleContext {
		public TerminalNode DESCRIPTOR() { return getToken(MetaEdGrammar.DESCRIPTOR, 0); }
		public DescriptorNameContext descriptorName() {
			return getRuleContext(DescriptorNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public WithMapTypeContext withMapType() {
			return getRuleContext(WithMapTypeContext.class,0);
		}
		public DescriptorContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_descriptor; }
	}

	public final DescriptorContext descriptor() throws RecognitionException {
		DescriptorContext _localctx = new DescriptorContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_descriptor);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(546);
			match(DESCRIPTOR);
			setState(547);
			descriptorName();
			setState(549);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(548);
				metaEdId();
				}
			}

			setState(552);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(551);
				deprecated();
				}
			}

			setState(554);
			documentation();
			setState(558);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0)) {
				{
				{
				setState(555);
				property();
				}
				}
				setState(560);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(562);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==WITH_OPTIONAL_MAP_TYPE || _la==WITH_MAP_TYPE) {
				{
				setState(561);
				withMapType();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class WithMapTypeContext extends ParserRuleContext {
		public MapTypeDocumentationContext mapTypeDocumentation() {
			return getRuleContext(MapTypeDocumentationContext.class,0);
		}
		public RequiredMapTypeContext requiredMapType() {
			return getRuleContext(RequiredMapTypeContext.class,0);
		}
		public OptionalMapTypeContext optionalMapType() {
			return getRuleContext(OptionalMapTypeContext.class,0);
		}
		public List<EnumerationItemContext> enumerationItem() {
			return getRuleContexts(EnumerationItemContext.class);
		}
		public EnumerationItemContext enumerationItem(int i) {
			return getRuleContext(EnumerationItemContext.class,i);
		}
		public WithMapTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_withMapType; }
	}

	public final WithMapTypeContext withMapType() throws RecognitionException {
		WithMapTypeContext _localctx = new WithMapTypeContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_withMapType);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(566);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case WITH_MAP_TYPE:
				{
				setState(564);
				requiredMapType();
				}
				break;
			case WITH_OPTIONAL_MAP_TYPE:
				{
				setState(565);
				optionalMapType();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(568);
			mapTypeDocumentation();
			setState(570); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(569);
				enumerationItem();
				}
				}
				setState(572); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==ENUMERATION_ITEM );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class RequiredMapTypeContext extends ParserRuleContext {
		public TerminalNode WITH_MAP_TYPE() { return getToken(MetaEdGrammar.WITH_MAP_TYPE, 0); }
		public RequiredMapTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_requiredMapType; }
	}

	public final RequiredMapTypeContext requiredMapType() throws RecognitionException {
		RequiredMapTypeContext _localctx = new RequiredMapTypeContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_requiredMapType);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(574);
			match(WITH_MAP_TYPE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class OptionalMapTypeContext extends ParserRuleContext {
		public TerminalNode WITH_OPTIONAL_MAP_TYPE() { return getToken(MetaEdGrammar.WITH_OPTIONAL_MAP_TYPE, 0); }
		public OptionalMapTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_optionalMapType; }
	}

	public final OptionalMapTypeContext optionalMapType() throws RecognitionException {
		OptionalMapTypeContext _localctx = new OptionalMapTypeContext(_ctx, getState());
		enterRule(_localctx, 56, RULE_optionalMapType);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(576);
			match(WITH_OPTIONAL_MAP_TYPE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DomainContext extends ParserRuleContext {
		public TerminalNode DOMAIN() { return getToken(MetaEdGrammar.DOMAIN, 0); }
		public DomainNameContext domainName() {
			return getRuleContext(DomainNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<DomainItemContext> domainItem() {
			return getRuleContexts(DomainItemContext.class);
		}
		public DomainItemContext domainItem(int i) {
			return getRuleContext(DomainItemContext.class,i);
		}
		public FooterDocumentationContext footerDocumentation() {
			return getRuleContext(FooterDocumentationContext.class,0);
		}
		public DomainContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_domain; }
	}

	public final DomainContext domain() throws RecognitionException {
		DomainContext _localctx = new DomainContext(_ctx, getState());
		enterRule(_localctx, 58, RULE_domain);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(578);
			match(DOMAIN);
			setState(579);
			domainName();
			setState(581);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(580);
				metaEdId();
				}
			}

			setState(584);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(583);
				deprecated();
				}
			}

			setState(586);
			documentation();
			setState(588); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(587);
				domainItem();
				}
				}
				setState(590); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << INLINE_COMMON_KEYWORD))) != 0) );
			setState(593);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==FOOTER_DOCUMENTATION) {
				{
				setState(592);
				footerDocumentation();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DomainItemContext extends ParserRuleContext {
		public LocalDomainItemNameContext localDomainItemName() {
			return getRuleContext(LocalDomainItemNameContext.class,0);
		}
		public TerminalNode ASSOCIATION_KEYWORD() { return getToken(MetaEdGrammar.ASSOCIATION_KEYWORD, 0); }
		public TerminalNode COMMON_KEYWORD() { return getToken(MetaEdGrammar.COMMON_KEYWORD, 0); }
		public TerminalNode DOMAIN_ENTITY_KEYWORD() { return getToken(MetaEdGrammar.DOMAIN_ENTITY_KEYWORD, 0); }
		public TerminalNode DESCRIPTOR_KEYWORD() { return getToken(MetaEdGrammar.DESCRIPTOR_KEYWORD, 0); }
		public TerminalNode INLINE_COMMON_KEYWORD() { return getToken(MetaEdGrammar.INLINE_COMMON_KEYWORD, 0); }
		public BaseNamespaceContext baseNamespace() {
			return getRuleContext(BaseNamespaceContext.class,0);
		}
		public TerminalNode PERIOD() { return getToken(MetaEdGrammar.PERIOD, 0); }
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DomainItemContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_domainItem; }
	}

	public final DomainItemContext domainItem() throws RecognitionException {
		DomainItemContext _localctx = new DomainItemContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_domainItem);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(595);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << INLINE_COMMON_KEYWORD))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(599);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,57,_ctx) ) {
			case 1:
				{
				setState(596);
				baseNamespace();
				setState(597);
				match(PERIOD);
				}
				break;
			}
			setState(601);
			localDomainItemName();
			setState(603);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(602);
				metaEdId();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FooterDocumentationContext extends ParserRuleContext {
		public TerminalNode FOOTER_DOCUMENTATION() { return getToken(MetaEdGrammar.FOOTER_DOCUMENTATION, 0); }
		public TerminalNode TEXT() { return getToken(MetaEdGrammar.TEXT, 0); }
		public FooterDocumentationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_footerDocumentation; }
	}

	public final FooterDocumentationContext footerDocumentation() throws RecognitionException {
		FooterDocumentationContext _localctx = new FooterDocumentationContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_footerDocumentation);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(605);
			match(FOOTER_DOCUMENTATION);
			setState(606);
			match(TEXT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DomainEntityContext extends ParserRuleContext {
		public TerminalNode DOMAIN_ENTITY() { return getToken(MetaEdGrammar.DOMAIN_ENTITY, 0); }
		public EntityNameContext entityName() {
			return getRuleContext(EntityNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public EntityConfigurationContext entityConfiguration() {
			return getRuleContext(EntityConfigurationContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public DomainEntityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_domainEntity; }
	}

	public final DomainEntityContext domainEntity() throws RecognitionException {
		DomainEntityContext _localctx = new DomainEntityContext(_ctx, getState());
		enterRule(_localctx, 64, RULE_domainEntity);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(608);
			match(DOMAIN_ENTITY);
			setState(609);
			entityName();
			setState(611);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(610);
				metaEdId();
				}
			}

			setState(614);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(613);
				deprecated();
				}
			}

			setState(616);
			documentation();
			setState(618);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==CASCADE_UPDATE) {
				{
				setState(617);
				entityConfiguration();
				}
			}

			setState(621); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(620);
				property();
				}
				}
				setState(623); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DomainEntityExtensionContext extends ParserRuleContext {
		public TerminalNode DOMAIN_ENTITY() { return getToken(MetaEdGrammar.DOMAIN_ENTITY, 0); }
		public ExtendeeNameContext extendeeName() {
			return getRuleContext(ExtendeeNameContext.class,0);
		}
		public TerminalNode ADDITIONS() { return getToken(MetaEdGrammar.ADDITIONS, 0); }
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public DomainEntityExtensionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_domainEntityExtension; }
	}

	public final DomainEntityExtensionContext domainEntityExtension() throws RecognitionException {
		DomainEntityExtensionContext _localctx = new DomainEntityExtensionContext(_ctx, getState());
		enterRule(_localctx, 66, RULE_domainEntityExtension);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(625);
			match(DOMAIN_ENTITY);
			setState(626);
			extendeeName();
			setState(627);
			match(ADDITIONS);
			setState(629);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(628);
				metaEdId();
				}
			}

			setState(632);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(631);
				deprecated();
				}
			}

			setState(635); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(634);
				property();
				}
				}
				setState(637); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DomainEntitySubclassContext extends ParserRuleContext {
		public TerminalNode DOMAIN_ENTITY() { return getToken(MetaEdGrammar.DOMAIN_ENTITY, 0); }
		public EntityNameContext entityName() {
			return getRuleContext(EntityNameContext.class,0);
		}
		public TerminalNode BASED_ON() { return getToken(MetaEdGrammar.BASED_ON, 0); }
		public BaseNameContext baseName() {
			return getRuleContext(BaseNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public DomainEntitySubclassContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_domainEntitySubclass; }
	}

	public final DomainEntitySubclassContext domainEntitySubclass() throws RecognitionException {
		DomainEntitySubclassContext _localctx = new DomainEntitySubclassContext(_ctx, getState());
		enterRule(_localctx, 68, RULE_domainEntitySubclass);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(639);
			match(DOMAIN_ENTITY);
			setState(640);
			entityName();
			setState(641);
			match(BASED_ON);
			setState(642);
			baseName();
			setState(644);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(643);
				metaEdId();
				}
			}

			setState(647);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(646);
				deprecated();
				}
			}

			setState(649);
			documentation();
			setState(651); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(650);
				property();
				}
				}
				setState(653); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EnumerationContext extends ParserRuleContext {
		public TerminalNode ENUMERATION() { return getToken(MetaEdGrammar.ENUMERATION, 0); }
		public EnumerationNameContext enumerationName() {
			return getRuleContext(EnumerationNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<EnumerationItemContext> enumerationItem() {
			return getRuleContexts(EnumerationItemContext.class);
		}
		public EnumerationItemContext enumerationItem(int i) {
			return getRuleContext(EnumerationItemContext.class,i);
		}
		public EnumerationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_enumeration; }
	}

	public final EnumerationContext enumeration() throws RecognitionException {
		EnumerationContext _localctx = new EnumerationContext(_ctx, getState());
		enterRule(_localctx, 70, RULE_enumeration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(655);
			match(ENUMERATION);
			setState(656);
			enumerationName();
			setState(658);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(657);
				metaEdId();
				}
			}

			setState(661);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(660);
				deprecated();
				}
			}

			setState(663);
			documentation();
			setState(665); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(664);
				enumerationItem();
				}
				}
				setState(667); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==ENUMERATION_ITEM );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EnumerationItemContext extends ParserRuleContext {
		public TerminalNode ENUMERATION_ITEM() { return getToken(MetaEdGrammar.ENUMERATION_ITEM, 0); }
		public ShortDescriptionContext shortDescription() {
			return getRuleContext(ShortDescriptionContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public EnumerationItemDocumentationContext enumerationItemDocumentation() {
			return getRuleContext(EnumerationItemDocumentationContext.class,0);
		}
		public EnumerationItemContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_enumerationItem; }
	}

	public final EnumerationItemContext enumerationItem() throws RecognitionException {
		EnumerationItemContext _localctx = new EnumerationItemContext(_ctx, getState());
		enterRule(_localctx, 72, RULE_enumerationItem);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(669);
			match(ENUMERATION_ITEM);
			setState(670);
			shortDescription();
			setState(672);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(671);
				metaEdId();
				}
			}

			setState(675);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DOCUMENTATION) {
				{
				setState(674);
				enumerationItemDocumentation();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ShortDescriptionContext extends ParserRuleContext {
		public TerminalNode TEXT() { return getToken(MetaEdGrammar.TEXT, 0); }
		public ShortDescriptionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_shortDescription; }
	}

	public final ShortDescriptionContext shortDescription() throws RecognitionException {
		ShortDescriptionContext _localctx = new ShortDescriptionContext(_ctx, getState());
		enterRule(_localctx, 74, RULE_shortDescription);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(677);
			match(TEXT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InlineCommonContext extends ParserRuleContext {
		public TerminalNode INLINE_COMMON() { return getToken(MetaEdGrammar.INLINE_COMMON, 0); }
		public InlineCommonNameContext inlineCommonName() {
			return getRuleContext(InlineCommonNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<PropertyContext> property() {
			return getRuleContexts(PropertyContext.class);
		}
		public PropertyContext property(int i) {
			return getRuleContext(PropertyContext.class,i);
		}
		public InlineCommonContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_inlineCommon; }
	}

	public final InlineCommonContext inlineCommon() throws RecognitionException {
		InlineCommonContext _localctx = new InlineCommonContext(_ctx, getState());
		enterRule(_localctx, 76, RULE_inlineCommon);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(679);
			match(INLINE_COMMON);
			setState(680);
			inlineCommonName();
			setState(682);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(681);
				metaEdId();
				}
			}

			setState(685);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(684);
				deprecated();
				}
			}

			setState(687);
			documentation();
			setState(689); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(688);
				property();
				}
				}
				setState(691); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << BOOLEAN) | (1L << CHOICE_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << COMMON_EXTENSION) | (1L << CURRENCY) | (1L << DATE) | (1L << DATETIME) | (1L << DECIMAL) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DURATION) | (1L << ENUMERATION_KEYWORD) | (1L << INLINE_COMMON_KEYWORD) | (1L << INTEGER) | (1L << PERCENT) | (1L << SHARED_DECIMAL_KEYWORD) | (1L << SHARED_INTEGER_KEYWORD) | (1L << SHARED_SHORT_KEYWORD) | (1L << SHARED_STRING_KEYWORD) | (1L << SHORT) | (1L << STRING) | (1L << TIME) | (1L << YEAR))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InterchangeContext extends ParserRuleContext {
		public TerminalNode INTERCHANGE() { return getToken(MetaEdGrammar.INTERCHANGE, 0); }
		public InterchangeNameContext interchangeName() {
			return getRuleContext(InterchangeNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public InterchangeComponentContext interchangeComponent() {
			return getRuleContext(InterchangeComponentContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public ExtendedDocumentationContext extendedDocumentation() {
			return getRuleContext(ExtendedDocumentationContext.class,0);
		}
		public UseCaseDocumentationContext useCaseDocumentation() {
			return getRuleContext(UseCaseDocumentationContext.class,0);
		}
		public InterchangeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_interchange; }
	}

	public final InterchangeContext interchange() throws RecognitionException {
		InterchangeContext _localctx = new InterchangeContext(_ctx, getState());
		enterRule(_localctx, 78, RULE_interchange);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(693);
			match(INTERCHANGE);
			setState(694);
			interchangeName();
			setState(696);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(695);
				metaEdId();
				}
			}

			setState(699);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(698);
				deprecated();
				}
			}

			setState(701);
			documentation();
			setState(703);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==EXTENDED_DOCUMENTATION) {
				{
				setState(702);
				extendedDocumentation();
				}
			}

			setState(706);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==USE_CASE_DOCUMENTATION) {
				{
				setState(705);
				useCaseDocumentation();
				}
			}

			setState(708);
			interchangeComponent();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExtendedDocumentationContext extends ParserRuleContext {
		public TerminalNode EXTENDED_DOCUMENTATION() { return getToken(MetaEdGrammar.EXTENDED_DOCUMENTATION, 0); }
		public TerminalNode TEXT() { return getToken(MetaEdGrammar.TEXT, 0); }
		public ExtendedDocumentationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_extendedDocumentation; }
	}

	public final ExtendedDocumentationContext extendedDocumentation() throws RecognitionException {
		ExtendedDocumentationContext _localctx = new ExtendedDocumentationContext(_ctx, getState());
		enterRule(_localctx, 80, RULE_extendedDocumentation);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(710);
			match(EXTENDED_DOCUMENTATION);
			setState(711);
			match(TEXT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class UseCaseDocumentationContext extends ParserRuleContext {
		public TerminalNode USE_CASE_DOCUMENTATION() { return getToken(MetaEdGrammar.USE_CASE_DOCUMENTATION, 0); }
		public TerminalNode TEXT() { return getToken(MetaEdGrammar.TEXT, 0); }
		public UseCaseDocumentationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_useCaseDocumentation; }
	}

	public final UseCaseDocumentationContext useCaseDocumentation() throws RecognitionException {
		UseCaseDocumentationContext _localctx = new UseCaseDocumentationContext(_ctx, getState());
		enterRule(_localctx, 82, RULE_useCaseDocumentation);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(713);
			match(USE_CASE_DOCUMENTATION);
			setState(714);
			match(TEXT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InterchangeComponentContext extends ParserRuleContext {
		public List<InterchangeElementContext> interchangeElement() {
			return getRuleContexts(InterchangeElementContext.class);
		}
		public InterchangeElementContext interchangeElement(int i) {
			return getRuleContext(InterchangeElementContext.class,i);
		}
		public List<InterchangeIdentityContext> interchangeIdentity() {
			return getRuleContexts(InterchangeIdentityContext.class);
		}
		public InterchangeIdentityContext interchangeIdentity(int i) {
			return getRuleContext(InterchangeIdentityContext.class,i);
		}
		public InterchangeComponentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_interchangeComponent; }
	}

	public final InterchangeComponentContext interchangeComponent() throws RecognitionException {
		InterchangeComponentContext _localctx = new InterchangeComponentContext(_ctx, getState());
		enterRule(_localctx, 84, RULE_interchangeComponent);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(719);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==ASSOCIATION_IDENTITY || _la==DOMAIN_ENTITY_IDENTITY) {
				{
				{
				setState(716);
				interchangeIdentity();
				}
				}
				setState(721);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(722);
			interchangeElement();
			setState(727);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << ASSOCIATION_IDENTITY) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DOMAIN_ENTITY_IDENTITY))) != 0)) {
				{
				setState(725);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case ASSOCIATION_KEYWORD:
				case DESCRIPTOR_KEYWORD:
				case DOMAIN_ENTITY_KEYWORD:
					{
					setState(723);
					interchangeElement();
					}
					break;
				case ASSOCIATION_IDENTITY:
				case DOMAIN_ENTITY_IDENTITY:
					{
					setState(724);
					interchangeIdentity();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(729);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InterchangeElementContext extends ParserRuleContext {
		public LocalInterchangeItemNameContext localInterchangeItemName() {
			return getRuleContext(LocalInterchangeItemNameContext.class,0);
		}
		public TerminalNode ASSOCIATION_KEYWORD() { return getToken(MetaEdGrammar.ASSOCIATION_KEYWORD, 0); }
		public TerminalNode DESCRIPTOR_KEYWORD() { return getToken(MetaEdGrammar.DESCRIPTOR_KEYWORD, 0); }
		public TerminalNode DOMAIN_ENTITY_KEYWORD() { return getToken(MetaEdGrammar.DOMAIN_ENTITY_KEYWORD, 0); }
		public BaseNamespaceContext baseNamespace() {
			return getRuleContext(BaseNamespaceContext.class,0);
		}
		public TerminalNode PERIOD() { return getToken(MetaEdGrammar.PERIOD, 0); }
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public InterchangeElementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_interchangeElement; }
	}

	public final InterchangeElementContext interchangeElement() throws RecognitionException {
		InterchangeElementContext _localctx = new InterchangeElementContext(_ctx, getState());
		enterRule(_localctx, 86, RULE_interchangeElement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(730);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(734);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,84,_ctx) ) {
			case 1:
				{
				setState(731);
				baseNamespace();
				setState(732);
				match(PERIOD);
				}
				break;
			}
			setState(736);
			localInterchangeItemName();
			setState(738);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(737);
				metaEdId();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InterchangeIdentityContext extends ParserRuleContext {
		public LocalInterchangeItemNameContext localInterchangeItemName() {
			return getRuleContext(LocalInterchangeItemNameContext.class,0);
		}
		public TerminalNode ASSOCIATION_IDENTITY() { return getToken(MetaEdGrammar.ASSOCIATION_IDENTITY, 0); }
		public TerminalNode DOMAIN_ENTITY_IDENTITY() { return getToken(MetaEdGrammar.DOMAIN_ENTITY_IDENTITY, 0); }
		public BaseNamespaceContext baseNamespace() {
			return getRuleContext(BaseNamespaceContext.class,0);
		}
		public TerminalNode PERIOD() { return getToken(MetaEdGrammar.PERIOD, 0); }
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public InterchangeIdentityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_interchangeIdentity; }
	}

	public final InterchangeIdentityContext interchangeIdentity() throws RecognitionException {
		InterchangeIdentityContext _localctx = new InterchangeIdentityContext(_ctx, getState());
		enterRule(_localctx, 88, RULE_interchangeIdentity);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(740);
			_la = _input.LA(1);
			if ( !(_la==ASSOCIATION_IDENTITY || _la==DOMAIN_ENTITY_IDENTITY) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(744);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,86,_ctx) ) {
			case 1:
				{
				setState(741);
				baseNamespace();
				setState(742);
				match(PERIOD);
				}
				break;
			}
			setState(746);
			localInterchangeItemName();
			setState(748);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(747);
				metaEdId();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InterchangeExtensionContext extends ParserRuleContext {
		public TerminalNode INTERCHANGE() { return getToken(MetaEdGrammar.INTERCHANGE, 0); }
		public ExtendeeNameContext extendeeName() {
			return getRuleContext(ExtendeeNameContext.class,0);
		}
		public TerminalNode ADDITIONS() { return getToken(MetaEdGrammar.ADDITIONS, 0); }
		public InterchangeExtensionComponentContext interchangeExtensionComponent() {
			return getRuleContext(InterchangeExtensionComponentContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public InterchangeExtensionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_interchangeExtension; }
	}

	public final InterchangeExtensionContext interchangeExtension() throws RecognitionException {
		InterchangeExtensionContext _localctx = new InterchangeExtensionContext(_ctx, getState());
		enterRule(_localctx, 90, RULE_interchangeExtension);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(750);
			match(INTERCHANGE);
			setState(751);
			extendeeName();
			setState(752);
			match(ADDITIONS);
			setState(754);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(753);
				metaEdId();
				}
			}

			setState(757);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(756);
				deprecated();
				}
			}

			setState(759);
			interchangeExtensionComponent();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InterchangeExtensionComponentContext extends ParserRuleContext {
		public List<InterchangeElementContext> interchangeElement() {
			return getRuleContexts(InterchangeElementContext.class);
		}
		public InterchangeElementContext interchangeElement(int i) {
			return getRuleContext(InterchangeElementContext.class,i);
		}
		public List<InterchangeIdentityContext> interchangeIdentity() {
			return getRuleContexts(InterchangeIdentityContext.class);
		}
		public InterchangeIdentityContext interchangeIdentity(int i) {
			return getRuleContext(InterchangeIdentityContext.class,i);
		}
		public InterchangeExtensionComponentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_interchangeExtensionComponent; }
	}

	public final InterchangeExtensionComponentContext interchangeExtensionComponent() throws RecognitionException {
		InterchangeExtensionComponentContext _localctx = new InterchangeExtensionComponentContext(_ctx, getState());
		enterRule(_localctx, 92, RULE_interchangeExtensionComponent);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(763); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				setState(763);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case ASSOCIATION_KEYWORD:
				case DESCRIPTOR_KEYWORD:
				case DOMAIN_ENTITY_KEYWORD:
					{
					setState(761);
					interchangeElement();
					}
					break;
				case ASSOCIATION_IDENTITY:
				case DOMAIN_ENTITY_IDENTITY:
					{
					setState(762);
					interchangeIdentity();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(765); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << ASSOCIATION_IDENTITY) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << DOMAIN_ENTITY_IDENTITY))) != 0) );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SubdomainContext extends ParserRuleContext {
		public TerminalNode SUBDOMAIN() { return getToken(MetaEdGrammar.SUBDOMAIN, 0); }
		public SubdomainNameContext subdomainName() {
			return getRuleContext(SubdomainNameContext.class,0);
		}
		public TerminalNode SUBDOMAIN_OF() { return getToken(MetaEdGrammar.SUBDOMAIN_OF, 0); }
		public ParentDomainNameContext parentDomainName() {
			return getRuleContext(ParentDomainNameContext.class,0);
		}
		public DocumentationContext documentation() {
			return getRuleContext(DocumentationContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DeprecatedContext deprecated() {
			return getRuleContext(DeprecatedContext.class,0);
		}
		public List<DomainItemContext> domainItem() {
			return getRuleContexts(DomainItemContext.class);
		}
		public DomainItemContext domainItem(int i) {
			return getRuleContext(DomainItemContext.class,i);
		}
		public TerminalNode SUBDOMAIN_POSITION() { return getToken(MetaEdGrammar.SUBDOMAIN_POSITION, 0); }
		public SubdomainPositionContext subdomainPosition() {
			return getRuleContext(SubdomainPositionContext.class,0);
		}
		public SubdomainContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_subdomain; }
	}

	public final SubdomainContext subdomain() throws RecognitionException {
		SubdomainContext _localctx = new SubdomainContext(_ctx, getState());
		enterRule(_localctx, 94, RULE_subdomain);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(767);
			match(SUBDOMAIN);
			setState(768);
			subdomainName();
			setState(769);
			match(SUBDOMAIN_OF);
			setState(770);
			parentDomainName();
			setState(772);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(771);
				metaEdId();
				}
			}

			setState(775);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(774);
				deprecated();
				}
			}

			setState(777);
			documentation();
			setState(779); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(778);
				domainItem();
				}
				}
				setState(781); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << ASSOCIATION_KEYWORD) | (1L << COMMON_KEYWORD) | (1L << DESCRIPTOR_KEYWORD) | (1L << DOMAIN_ENTITY_KEYWORD) | (1L << INLINE_COMMON_KEYWORD))) != 0) );
			setState(785);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SUBDOMAIN_POSITION) {
				{
				setState(783);
				match(SUBDOMAIN_POSITION);
				setState(784);
				subdomainPosition();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SubdomainPositionContext extends ParserRuleContext {
		public TerminalNode UNSIGNED_INT() { return getToken(MetaEdGrammar.UNSIGNED_INT, 0); }
		public SubdomainPositionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_subdomainPosition; }
	}

	public final SubdomainPositionContext subdomainPosition() throws RecognitionException {
		SubdomainPositionContext _localctx = new SubdomainPositionContext(_ctx, getState());
		enterRule(_localctx, 96, RULE_subdomainPosition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(787);
			match(UNSIGNED_INT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MinValueContext extends ParserRuleContext {
		public TerminalNode MIN_VALUE() { return getToken(MetaEdGrammar.MIN_VALUE, 0); }
		public Signed_intContext signed_int() {
			return getRuleContext(Signed_intContext.class,0);
		}
		public TerminalNode BIG() { return getToken(MetaEdGrammar.BIG, 0); }
		public MinValueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_minValue; }
	}

	public final MinValueContext minValue() throws RecognitionException {
		MinValueContext _localctx = new MinValueContext(_ctx, getState());
		enterRule(_localctx, 98, RULE_minValue);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(789);
			match(MIN_VALUE);
			setState(792);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case UNSIGNED_INT:
			case POS_SIGN:
			case NEG_SIGN:
				{
				setState(790);
				signed_int();
				}
				break;
			case BIG:
				{
				setState(791);
				match(BIG);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MaxValueContext extends ParserRuleContext {
		public TerminalNode MAX_VALUE() { return getToken(MetaEdGrammar.MAX_VALUE, 0); }
		public Signed_intContext signed_int() {
			return getRuleContext(Signed_intContext.class,0);
		}
		public TerminalNode BIG() { return getToken(MetaEdGrammar.BIG, 0); }
		public MaxValueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_maxValue; }
	}

	public final MaxValueContext maxValue() throws RecognitionException {
		MaxValueContext _localctx = new MaxValueContext(_ctx, getState());
		enterRule(_localctx, 100, RULE_maxValue);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(794);
			match(MAX_VALUE);
			setState(797);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case UNSIGNED_INT:
			case POS_SIGN:
			case NEG_SIGN:
				{
				setState(795);
				signed_int();
				}
				break;
			case BIG:
				{
				setState(796);
				match(BIG);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MinValueShortContext extends ParserRuleContext {
		public TerminalNode MIN_VALUE() { return getToken(MetaEdGrammar.MIN_VALUE, 0); }
		public Signed_intContext signed_int() {
			return getRuleContext(Signed_intContext.class,0);
		}
		public MinValueShortContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_minValueShort; }
	}

	public final MinValueShortContext minValueShort() throws RecognitionException {
		MinValueShortContext _localctx = new MinValueShortContext(_ctx, getState());
		enterRule(_localctx, 102, RULE_minValueShort);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(799);
			match(MIN_VALUE);
			setState(800);
			signed_int();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MaxValueShortContext extends ParserRuleContext {
		public TerminalNode MAX_VALUE() { return getToken(MetaEdGrammar.MAX_VALUE, 0); }
		public Signed_intContext signed_int() {
			return getRuleContext(Signed_intContext.class,0);
		}
		public MaxValueShortContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_maxValueShort; }
	}

	public final MaxValueShortContext maxValueShort() throws RecognitionException {
		MaxValueShortContext _localctx = new MaxValueShortContext(_ctx, getState());
		enterRule(_localctx, 104, RULE_maxValueShort);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(802);
			match(MAX_VALUE);
			setState(803);
			signed_int();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MinValueDecimalContext extends ParserRuleContext {
		public TerminalNode MIN_VALUE() { return getToken(MetaEdGrammar.MIN_VALUE, 0); }
		public DecimalValueContext decimalValue() {
			return getRuleContext(DecimalValueContext.class,0);
		}
		public MinValueDecimalContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_minValueDecimal; }
	}

	public final MinValueDecimalContext minValueDecimal() throws RecognitionException {
		MinValueDecimalContext _localctx = new MinValueDecimalContext(_ctx, getState());
		enterRule(_localctx, 106, RULE_minValueDecimal);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(805);
			match(MIN_VALUE);
			setState(806);
			decimalValue();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MaxValueDecimalContext extends ParserRuleContext {
		public TerminalNode MAX_VALUE() { return getToken(MetaEdGrammar.MAX_VALUE, 0); }
		public DecimalValueContext decimalValue() {
			return getRuleContext(DecimalValueContext.class,0);
		}
		public MaxValueDecimalContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_maxValueDecimal; }
	}

	public final MaxValueDecimalContext maxValueDecimal() throws RecognitionException {
		MaxValueDecimalContext _localctx = new MaxValueDecimalContext(_ctx, getState());
		enterRule(_localctx, 108, RULE_maxValueDecimal);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(808);
			match(MAX_VALUE);
			setState(809);
			decimalValue();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DecimalValueContext extends ParserRuleContext {
		public TerminalNode DECIMAL_VALUE() { return getToken(MetaEdGrammar.DECIMAL_VALUE, 0); }
		public Signed_intContext signed_int() {
			return getRuleContext(Signed_intContext.class,0);
		}
		public DecimalValueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_decimalValue; }
	}

	public final DecimalValueContext decimalValue() throws RecognitionException {
		DecimalValueContext _localctx = new DecimalValueContext(_ctx, getState());
		enterRule(_localctx, 110, RULE_decimalValue);
		try {
			setState(813);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case DECIMAL_VALUE:
				enterOuterAlt(_localctx, 1);
				{
				setState(811);
				match(DECIMAL_VALUE);
				}
				break;
			case UNSIGNED_INT:
			case POS_SIGN:
			case NEG_SIGN:
				enterOuterAlt(_localctx, 2);
				{
				setState(812);
				signed_int();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TotalDigitsContext extends ParserRuleContext {
		public TerminalNode TOTAL_DIGITS() { return getToken(MetaEdGrammar.TOTAL_DIGITS, 0); }
		public TerminalNode UNSIGNED_INT() { return getToken(MetaEdGrammar.UNSIGNED_INT, 0); }
		public TotalDigitsContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_totalDigits; }
	}

	public final TotalDigitsContext totalDigits() throws RecognitionException {
		TotalDigitsContext _localctx = new TotalDigitsContext(_ctx, getState());
		enterRule(_localctx, 112, RULE_totalDigits);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(815);
			match(TOTAL_DIGITS);
			setState(816);
			match(UNSIGNED_INT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DecimalPlacesContext extends ParserRuleContext {
		public TerminalNode DECIMAL_PLACES() { return getToken(MetaEdGrammar.DECIMAL_PLACES, 0); }
		public TerminalNode UNSIGNED_INT() { return getToken(MetaEdGrammar.UNSIGNED_INT, 0); }
		public DecimalPlacesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_decimalPlaces; }
	}

	public final DecimalPlacesContext decimalPlaces() throws RecognitionException {
		DecimalPlacesContext _localctx = new DecimalPlacesContext(_ctx, getState());
		enterRule(_localctx, 114, RULE_decimalPlaces);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(818);
			match(DECIMAL_PLACES);
			setState(819);
			match(UNSIGNED_INT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CommonExtensionOverrideContext extends ParserRuleContext {
		public TerminalNode COMMON_EXTENSION() { return getToken(MetaEdGrammar.COMMON_EXTENSION, 0); }
		public CommonExtensionOverrideContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commonExtensionOverride; }
	}

	public final CommonExtensionOverrideContext commonExtensionOverride() throws RecognitionException {
		CommonExtensionOverrideContext _localctx = new CommonExtensionOverrideContext(_ctx, getState());
		enterRule(_localctx, 116, RULE_commonExtensionOverride);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(821);
			match(COMMON_EXTENSION);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyAnnotationContext extends ParserRuleContext {
		public IdentityContext identity() {
			return getRuleContext(IdentityContext.class,0);
		}
		public IdentityRenameContext identityRename() {
			return getRuleContext(IdentityRenameContext.class,0);
		}
		public RequiredContext required() {
			return getRuleContext(RequiredContext.class,0);
		}
		public OptionalContext optional() {
			return getRuleContext(OptionalContext.class,0);
		}
		public CollectionContext collection() {
			return getRuleContext(CollectionContext.class,0);
		}
		public IsQueryableOnlyContext isQueryableOnly() {
			return getRuleContext(IsQueryableOnlyContext.class,0);
		}
		public PropertyAnnotationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyAnnotation; }
	}

	public final PropertyAnnotationContext propertyAnnotation() throws RecognitionException {
		PropertyAnnotationContext _localctx = new PropertyAnnotationContext(_ctx, getState());
		enterRule(_localctx, 118, RULE_propertyAnnotation);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(829);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IDENTITY:
				{
				setState(823);
				identity();
				}
				break;
			case IDENTITY_RENAME:
				{
				setState(824);
				identityRename();
				}
				break;
			case REQUIRED:
				{
				setState(825);
				required();
				}
				break;
			case OPTIONAL:
				{
				setState(826);
				optional();
				}
				break;
			case OPTIONAL_COLLECTION:
			case REQUIRED_COLLECTION:
				{
				setState(827);
				collection();
				}
				break;
			case IS_QUERYABLE_ONLY:
				{
				setState(828);
				isQueryableOnly();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IdentityContext extends ParserRuleContext {
		public TerminalNode IDENTITY() { return getToken(MetaEdGrammar.IDENTITY, 0); }
		public IdentityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_identity; }
	}

	public final IdentityContext identity() throws RecognitionException {
		IdentityContext _localctx = new IdentityContext(_ctx, getState());
		enterRule(_localctx, 120, RULE_identity);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(831);
			match(IDENTITY);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IdentityRenameContext extends ParserRuleContext {
		public TerminalNode IDENTITY_RENAME() { return getToken(MetaEdGrammar.IDENTITY_RENAME, 0); }
		public BaseKeyNameContext baseKeyName() {
			return getRuleContext(BaseKeyNameContext.class,0);
		}
		public IdentityRenameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_identityRename; }
	}

	public final IdentityRenameContext identityRename() throws RecognitionException {
		IdentityRenameContext _localctx = new IdentityRenameContext(_ctx, getState());
		enterRule(_localctx, 122, RULE_identityRename);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(833);
			match(IDENTITY_RENAME);
			setState(834);
			baseKeyName();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class RequiredContext extends ParserRuleContext {
		public TerminalNode REQUIRED() { return getToken(MetaEdGrammar.REQUIRED, 0); }
		public RequiredContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_required; }
	}

	public final RequiredContext required() throws RecognitionException {
		RequiredContext _localctx = new RequiredContext(_ctx, getState());
		enterRule(_localctx, 124, RULE_required);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(836);
			match(REQUIRED);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class OptionalContext extends ParserRuleContext {
		public TerminalNode OPTIONAL() { return getToken(MetaEdGrammar.OPTIONAL, 0); }
		public OptionalContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_optional; }
	}

	public final OptionalContext optional() throws RecognitionException {
		OptionalContext _localctx = new OptionalContext(_ctx, getState());
		enterRule(_localctx, 126, RULE_optional);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(838);
			match(OPTIONAL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CollectionContext extends ParserRuleContext {
		public RequiredCollectionContext requiredCollection() {
			return getRuleContext(RequiredCollectionContext.class,0);
		}
		public OptionalCollectionContext optionalCollection() {
			return getRuleContext(OptionalCollectionContext.class,0);
		}
		public CollectionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_collection; }
	}

	public final CollectionContext collection() throws RecognitionException {
		CollectionContext _localctx = new CollectionContext(_ctx, getState());
		enterRule(_localctx, 128, RULE_collection);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(842);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case REQUIRED_COLLECTION:
				{
				setState(840);
				requiredCollection();
				}
				break;
			case OPTIONAL_COLLECTION:
				{
				setState(841);
				optionalCollection();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class RequiredCollectionContext extends ParserRuleContext {
		public TerminalNode REQUIRED_COLLECTION() { return getToken(MetaEdGrammar.REQUIRED_COLLECTION, 0); }
		public RequiredCollectionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_requiredCollection; }
	}

	public final RequiredCollectionContext requiredCollection() throws RecognitionException {
		RequiredCollectionContext _localctx = new RequiredCollectionContext(_ctx, getState());
		enterRule(_localctx, 130, RULE_requiredCollection);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(844);
			match(REQUIRED_COLLECTION);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class OptionalCollectionContext extends ParserRuleContext {
		public TerminalNode OPTIONAL_COLLECTION() { return getToken(MetaEdGrammar.OPTIONAL_COLLECTION, 0); }
		public OptionalCollectionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_optionalCollection; }
	}

	public final OptionalCollectionContext optionalCollection() throws RecognitionException {
		OptionalCollectionContext _localctx = new OptionalCollectionContext(_ctx, getState());
		enterRule(_localctx, 132, RULE_optionalCollection);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(846);
			match(OPTIONAL_COLLECTION);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IsQueryableOnlyContext extends ParserRuleContext {
		public TerminalNode IS_QUERYABLE_ONLY() { return getToken(MetaEdGrammar.IS_QUERYABLE_ONLY, 0); }
		public IsQueryableOnlyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_isQueryableOnly; }
	}

	public final IsQueryableOnlyContext isQueryableOnly() throws RecognitionException {
		IsQueryableOnlyContext _localctx = new IsQueryableOnlyContext(_ctx, getState());
		enterRule(_localctx, 134, RULE_isQueryableOnly);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(848);
			match(IS_QUERYABLE_ONLY);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyComponentsContext extends ParserRuleContext {
		public PropertyDocumentationContext propertyDocumentation() {
			return getRuleContext(PropertyDocumentationContext.class,0);
		}
		public PropertyAnnotationContext propertyAnnotation() {
			return getRuleContext(PropertyAnnotationContext.class,0);
		}
		public PropertyDeprecatedContext propertyDeprecated() {
			return getRuleContext(PropertyDeprecatedContext.class,0);
		}
		public RoleNameContext roleName() {
			return getRuleContext(RoleNameContext.class,0);
		}
		public IsQueryableFieldContext isQueryableField() {
			return getRuleContext(IsQueryableFieldContext.class,0);
		}
		public PropertyComponentsContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyComponents; }
	}

	public final PropertyComponentsContext propertyComponents() throws RecognitionException {
		PropertyComponentsContext _localctx = new PropertyComponentsContext(_ctx, getState());
		enterRule(_localctx, 136, RULE_propertyComponents);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(851);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DEPRECATED) {
				{
				setState(850);
				propertyDeprecated();
				}
			}

			setState(853);
			propertyDocumentation();
			setState(854);
			propertyAnnotation();
			setState(856);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==ROLE_NAME) {
				{
				setState(855);
				roleName();
				}
			}

			setState(859);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IS_QUERYABLE_FIELD) {
				{
				setState(858);
				isQueryableField();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IsQueryableFieldContext extends ParserRuleContext {
		public TerminalNode IS_QUERYABLE_FIELD() { return getToken(MetaEdGrammar.IS_QUERYABLE_FIELD, 0); }
		public IsQueryableFieldContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_isQueryableField; }
	}

	public final IsQueryableFieldContext isQueryableField() throws RecognitionException {
		IsQueryableFieldContext _localctx = new IsQueryableFieldContext(_ctx, getState());
		enterRule(_localctx, 138, RULE_isQueryableField);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(861);
			match(IS_QUERYABLE_FIELD);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class RoleNameContext extends ParserRuleContext {
		public TerminalNode ROLE_NAME() { return getToken(MetaEdGrammar.ROLE_NAME, 0); }
		public RoleNameNameContext roleNameName() {
			return getRuleContext(RoleNameNameContext.class,0);
		}
		public TerminalNode SHORTEN_TO() { return getToken(MetaEdGrammar.SHORTEN_TO, 0); }
		public ShortenToNameContext shortenToName() {
			return getRuleContext(ShortenToNameContext.class,0);
		}
		public RoleNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_roleName; }
	}

	public final RoleNameContext roleName() throws RecognitionException {
		RoleNameContext _localctx = new RoleNameContext(_ctx, getState());
		enterRule(_localctx, 140, RULE_roleName);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(863);
			match(ROLE_NAME);
			setState(864);
			roleNameName();
			setState(867);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SHORTEN_TO) {
				{
				setState(865);
				match(SHORTEN_TO);
				setState(866);
				shortenToName();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MinLengthContext extends ParserRuleContext {
		public TerminalNode MIN_LENGTH() { return getToken(MetaEdGrammar.MIN_LENGTH, 0); }
		public TerminalNode UNSIGNED_INT() { return getToken(MetaEdGrammar.UNSIGNED_INT, 0); }
		public MinLengthContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_minLength; }
	}

	public final MinLengthContext minLength() throws RecognitionException {
		MinLengthContext _localctx = new MinLengthContext(_ctx, getState());
		enterRule(_localctx, 142, RULE_minLength);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(869);
			match(MIN_LENGTH);
			setState(870);
			match(UNSIGNED_INT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MaxLengthContext extends ParserRuleContext {
		public TerminalNode MAX_LENGTH() { return getToken(MetaEdGrammar.MAX_LENGTH, 0); }
		public TerminalNode UNSIGNED_INT() { return getToken(MetaEdGrammar.UNSIGNED_INT, 0); }
		public MaxLengthContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_maxLength; }
	}

	public final MaxLengthContext maxLength() throws RecognitionException {
		MaxLengthContext _localctx = new MaxLengthContext(_ctx, getState());
		enterRule(_localctx, 144, RULE_maxLength);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(872);
			match(MAX_LENGTH);
			setState(873);
			match(UNSIGNED_INT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyContext extends ParserRuleContext {
		public AssociationPropertyContext associationProperty() {
			return getRuleContext(AssociationPropertyContext.class,0);
		}
		public BooleanPropertyContext booleanProperty() {
			return getRuleContext(BooleanPropertyContext.class,0);
		}
		public ChoicePropertyContext choiceProperty() {
			return getRuleContext(ChoicePropertyContext.class,0);
		}
		public CommonPropertyContext commonProperty() {
			return getRuleContext(CommonPropertyContext.class,0);
		}
		public CurrencyPropertyContext currencyProperty() {
			return getRuleContext(CurrencyPropertyContext.class,0);
		}
		public DatePropertyContext dateProperty() {
			return getRuleContext(DatePropertyContext.class,0);
		}
		public DatetimePropertyContext datetimeProperty() {
			return getRuleContext(DatetimePropertyContext.class,0);
		}
		public DecimalPropertyContext decimalProperty() {
			return getRuleContext(DecimalPropertyContext.class,0);
		}
		public DescriptorPropertyContext descriptorProperty() {
			return getRuleContext(DescriptorPropertyContext.class,0);
		}
		public DomainEntityPropertyContext domainEntityProperty() {
			return getRuleContext(DomainEntityPropertyContext.class,0);
		}
		public DurationPropertyContext durationProperty() {
			return getRuleContext(DurationPropertyContext.class,0);
		}
		public EnumerationPropertyContext enumerationProperty() {
			return getRuleContext(EnumerationPropertyContext.class,0);
		}
		public InlineCommonPropertyContext inlineCommonProperty() {
			return getRuleContext(InlineCommonPropertyContext.class,0);
		}
		public IntegerPropertyContext integerProperty() {
			return getRuleContext(IntegerPropertyContext.class,0);
		}
		public PercentPropertyContext percentProperty() {
			return getRuleContext(PercentPropertyContext.class,0);
		}
		public SharedDecimalPropertyContext sharedDecimalProperty() {
			return getRuleContext(SharedDecimalPropertyContext.class,0);
		}
		public SharedIntegerPropertyContext sharedIntegerProperty() {
			return getRuleContext(SharedIntegerPropertyContext.class,0);
		}
		public SharedShortPropertyContext sharedShortProperty() {
			return getRuleContext(SharedShortPropertyContext.class,0);
		}
		public SharedStringPropertyContext sharedStringProperty() {
			return getRuleContext(SharedStringPropertyContext.class,0);
		}
		public ShortPropertyContext shortProperty() {
			return getRuleContext(ShortPropertyContext.class,0);
		}
		public StringPropertyContext stringProperty() {
			return getRuleContext(StringPropertyContext.class,0);
		}
		public TimePropertyContext timeProperty() {
			return getRuleContext(TimePropertyContext.class,0);
		}
		public YearPropertyContext yearProperty() {
			return getRuleContext(YearPropertyContext.class,0);
		}
		public PropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_property; }
	}

	public final PropertyContext property() throws RecognitionException {
		PropertyContext _localctx = new PropertyContext(_ctx, getState());
		enterRule(_localctx, 146, RULE_property);
		try {
			setState(898);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case ASSOCIATION_KEYWORD:
				enterOuterAlt(_localctx, 1);
				{
				setState(875);
				associationProperty();
				}
				break;
			case BOOLEAN:
				enterOuterAlt(_localctx, 2);
				{
				setState(876);
				booleanProperty();
				}
				break;
			case CHOICE_KEYWORD:
				enterOuterAlt(_localctx, 3);
				{
				setState(877);
				choiceProperty();
				}
				break;
			case COMMON_KEYWORD:
			case COMMON_EXTENSION:
				enterOuterAlt(_localctx, 4);
				{
				setState(878);
				commonProperty();
				}
				break;
			case CURRENCY:
				enterOuterAlt(_localctx, 5);
				{
				setState(879);
				currencyProperty();
				}
				break;
			case DATE:
				enterOuterAlt(_localctx, 6);
				{
				setState(880);
				dateProperty();
				}
				break;
			case DATETIME:
				enterOuterAlt(_localctx, 7);
				{
				setState(881);
				datetimeProperty();
				}
				break;
			case DECIMAL:
				enterOuterAlt(_localctx, 8);
				{
				setState(882);
				decimalProperty();
				}
				break;
			case DESCRIPTOR_KEYWORD:
				enterOuterAlt(_localctx, 9);
				{
				setState(883);
				descriptorProperty();
				}
				break;
			case DOMAIN_ENTITY_KEYWORD:
				enterOuterAlt(_localctx, 10);
				{
				setState(884);
				domainEntityProperty();
				}
				break;
			case DURATION:
				enterOuterAlt(_localctx, 11);
				{
				setState(885);
				durationProperty();
				}
				break;
			case ENUMERATION_KEYWORD:
				enterOuterAlt(_localctx, 12);
				{
				setState(886);
				enumerationProperty();
				}
				break;
			case INLINE_COMMON_KEYWORD:
				enterOuterAlt(_localctx, 13);
				{
				setState(887);
				inlineCommonProperty();
				}
				break;
			case INTEGER:
				enterOuterAlt(_localctx, 14);
				{
				setState(888);
				integerProperty();
				}
				break;
			case PERCENT:
				enterOuterAlt(_localctx, 15);
				{
				setState(889);
				percentProperty();
				}
				break;
			case SHARED_DECIMAL_KEYWORD:
				enterOuterAlt(_localctx, 16);
				{
				setState(890);
				sharedDecimalProperty();
				}
				break;
			case SHARED_INTEGER_KEYWORD:
				enterOuterAlt(_localctx, 17);
				{
				setState(891);
				sharedIntegerProperty();
				}
				break;
			case SHARED_SHORT_KEYWORD:
				enterOuterAlt(_localctx, 18);
				{
				setState(892);
				sharedShortProperty();
				}
				break;
			case SHARED_STRING_KEYWORD:
				enterOuterAlt(_localctx, 19);
				{
				setState(893);
				sharedStringProperty();
				}
				break;
			case SHORT:
				enterOuterAlt(_localctx, 20);
				{
				setState(894);
				shortProperty();
				}
				break;
			case STRING:
				enterOuterAlt(_localctx, 21);
				{
				setState(895);
				stringProperty();
				}
				break;
			case TIME:
				enterOuterAlt(_localctx, 22);
				{
				setState(896);
				timeProperty();
				}
				break;
			case YEAR:
				enterOuterAlt(_localctx, 23);
				{
				setState(897);
				yearProperty();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BooleanPropertyContext extends ParserRuleContext {
		public TerminalNode BOOLEAN() { return getToken(MetaEdGrammar.BOOLEAN, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public BooleanPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_booleanProperty; }
	}

	public final BooleanPropertyContext booleanProperty() throws RecognitionException {
		BooleanPropertyContext _localctx = new BooleanPropertyContext(_ctx, getState());
		enterRule(_localctx, 148, RULE_booleanProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(900);
			match(BOOLEAN);
			setState(901);
			simplePropertyName();
			setState(903);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(902);
				metaEdId();
				}
			}

			setState(905);
			propertyComponents();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CurrencyPropertyContext extends ParserRuleContext {
		public TerminalNode CURRENCY() { return getToken(MetaEdGrammar.CURRENCY, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public CurrencyPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_currencyProperty; }
	}

	public final CurrencyPropertyContext currencyProperty() throws RecognitionException {
		CurrencyPropertyContext _localctx = new CurrencyPropertyContext(_ctx, getState());
		enterRule(_localctx, 150, RULE_currencyProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(907);
			match(CURRENCY);
			setState(908);
			simplePropertyName();
			setState(910);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(909);
				metaEdId();
				}
			}

			setState(912);
			propertyComponents();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DatePropertyContext extends ParserRuleContext {
		public TerminalNode DATE() { return getToken(MetaEdGrammar.DATE, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DatePropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_dateProperty; }
	}

	public final DatePropertyContext dateProperty() throws RecognitionException {
		DatePropertyContext _localctx = new DatePropertyContext(_ctx, getState());
		enterRule(_localctx, 152, RULE_dateProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(914);
			match(DATE);
			setState(915);
			simplePropertyName();
			setState(917);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(916);
				metaEdId();
				}
			}

			setState(919);
			propertyComponents();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DatetimePropertyContext extends ParserRuleContext {
		public TerminalNode DATETIME() { return getToken(MetaEdGrammar.DATETIME, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DatetimePropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_datetimeProperty; }
	}

	public final DatetimePropertyContext datetimeProperty() throws RecognitionException {
		DatetimePropertyContext _localctx = new DatetimePropertyContext(_ctx, getState());
		enterRule(_localctx, 154, RULE_datetimeProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(921);
			match(DATETIME);
			setState(922);
			simplePropertyName();
			setState(924);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(923);
				metaEdId();
				}
			}

			setState(926);
			propertyComponents();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DecimalPropertyContext extends ParserRuleContext {
		public TerminalNode DECIMAL() { return getToken(MetaEdGrammar.DECIMAL, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public TotalDigitsContext totalDigits() {
			return getRuleContext(TotalDigitsContext.class,0);
		}
		public DecimalPlacesContext decimalPlaces() {
			return getRuleContext(DecimalPlacesContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public MinValueDecimalContext minValueDecimal() {
			return getRuleContext(MinValueDecimalContext.class,0);
		}
		public MaxValueDecimalContext maxValueDecimal() {
			return getRuleContext(MaxValueDecimalContext.class,0);
		}
		public DecimalPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_decimalProperty; }
	}

	public final DecimalPropertyContext decimalProperty() throws RecognitionException {
		DecimalPropertyContext _localctx = new DecimalPropertyContext(_ctx, getState());
		enterRule(_localctx, 156, RULE_decimalProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(928);
			match(DECIMAL);
			setState(929);
			simplePropertyName();
			setState(931);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(930);
				metaEdId();
				}
			}

			setState(933);
			propertyComponents();
			setState(934);
			totalDigits();
			setState(935);
			decimalPlaces();
			setState(937);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MIN_VALUE) {
				{
				setState(936);
				minValueDecimal();
				}
			}

			setState(940);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MAX_VALUE) {
				{
				setState(939);
				maxValueDecimal();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DescriptorPropertyContext extends ParserRuleContext {
		public TerminalNode DESCRIPTOR_KEYWORD() { return getToken(MetaEdGrammar.DESCRIPTOR_KEYWORD, 0); }
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DescriptorPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_descriptorProperty; }
	}

	public final DescriptorPropertyContext descriptorProperty() throws RecognitionException {
		DescriptorPropertyContext _localctx = new DescriptorPropertyContext(_ctx, getState());
		enterRule(_localctx, 158, RULE_descriptorProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(942);
			match(DESCRIPTOR_KEYWORD);
			setState(943);
			propertyName();
			setState(945);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(944);
				metaEdId();
				}
			}

			setState(947);
			propertyComponents();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DurationPropertyContext extends ParserRuleContext {
		public TerminalNode DURATION() { return getToken(MetaEdGrammar.DURATION, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public DurationPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_durationProperty; }
	}

	public final DurationPropertyContext durationProperty() throws RecognitionException {
		DurationPropertyContext _localctx = new DurationPropertyContext(_ctx, getState());
		enterRule(_localctx, 160, RULE_durationProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(949);
			match(DURATION);
			setState(950);
			simplePropertyName();
			setState(952);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(951);
				metaEdId();
				}
			}

			setState(954);
			propertyComponents();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EnumerationPropertyContext extends ParserRuleContext {
		public TerminalNode ENUMERATION_KEYWORD() { return getToken(MetaEdGrammar.ENUMERATION_KEYWORD, 0); }
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public EnumerationPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_enumerationProperty; }
	}

	public final EnumerationPropertyContext enumerationProperty() throws RecognitionException {
		EnumerationPropertyContext _localctx = new EnumerationPropertyContext(_ctx, getState());
		enterRule(_localctx, 162, RULE_enumerationProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(956);
			match(ENUMERATION_KEYWORD);
			setState(957);
			propertyName();
			setState(959);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(958);
				metaEdId();
				}
			}

			setState(961);
			propertyComponents();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CommonPropertyContext extends ParserRuleContext {
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public TerminalNode COMMON_KEYWORD() { return getToken(MetaEdGrammar.COMMON_KEYWORD, 0); }
		public CommonExtensionOverrideContext commonExtensionOverride() {
			return getRuleContext(CommonExtensionOverrideContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public List<MergeDirectiveContext> mergeDirective() {
			return getRuleContexts(MergeDirectiveContext.class);
		}
		public MergeDirectiveContext mergeDirective(int i) {
			return getRuleContext(MergeDirectiveContext.class,i);
		}
		public CommonPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commonProperty; }
	}

	public final CommonPropertyContext commonProperty() throws RecognitionException {
		CommonPropertyContext _localctx = new CommonPropertyContext(_ctx, getState());
		enterRule(_localctx, 164, RULE_commonProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(965);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case COMMON_KEYWORD:
				{
				setState(963);
				match(COMMON_KEYWORD);
				}
				break;
			case COMMON_EXTENSION:
				{
				setState(964);
				commonExtensionOverride();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(967);
			propertyName();
			setState(969);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(968);
				metaEdId();
				}
			}

			setState(971);
			propertyComponents();
			setState(975);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MERGE_REFERENCE) {
				{
				{
				setState(972);
				mergeDirective();
				}
				}
				setState(977);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InlineCommonPropertyContext extends ParserRuleContext {
		public TerminalNode INLINE_COMMON_KEYWORD() { return getToken(MetaEdGrammar.INLINE_COMMON_KEYWORD, 0); }
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public List<MergeDirectiveContext> mergeDirective() {
			return getRuleContexts(MergeDirectiveContext.class);
		}
		public MergeDirectiveContext mergeDirective(int i) {
			return getRuleContext(MergeDirectiveContext.class,i);
		}
		public InlineCommonPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_inlineCommonProperty; }
	}

	public final InlineCommonPropertyContext inlineCommonProperty() throws RecognitionException {
		InlineCommonPropertyContext _localctx = new InlineCommonPropertyContext(_ctx, getState());
		enterRule(_localctx, 166, RULE_inlineCommonProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(978);
			match(INLINE_COMMON_KEYWORD);
			setState(979);
			propertyName();
			setState(981);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(980);
				metaEdId();
				}
			}

			setState(983);
			propertyComponents();
			setState(987);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MERGE_REFERENCE) {
				{
				{
				setState(984);
				mergeDirective();
				}
				}
				setState(989);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ChoicePropertyContext extends ParserRuleContext {
		public TerminalNode CHOICE_KEYWORD() { return getToken(MetaEdGrammar.CHOICE_KEYWORD, 0); }
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public List<MergeDirectiveContext> mergeDirective() {
			return getRuleContexts(MergeDirectiveContext.class);
		}
		public MergeDirectiveContext mergeDirective(int i) {
			return getRuleContext(MergeDirectiveContext.class,i);
		}
		public ChoicePropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_choiceProperty; }
	}

	public final ChoicePropertyContext choiceProperty() throws RecognitionException {
		ChoicePropertyContext _localctx = new ChoicePropertyContext(_ctx, getState());
		enterRule(_localctx, 168, RULE_choiceProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(990);
			match(CHOICE_KEYWORD);
			setState(991);
			propertyName();
			setState(993);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(992);
				metaEdId();
				}
			}

			setState(995);
			propertyComponents();
			setState(999);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MERGE_REFERENCE) {
				{
				{
				setState(996);
				mergeDirective();
				}
				}
				setState(1001);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IntegerPropertyContext extends ParserRuleContext {
		public TerminalNode INTEGER() { return getToken(MetaEdGrammar.INTEGER, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public MinValueContext minValue() {
			return getRuleContext(MinValueContext.class,0);
		}
		public MaxValueContext maxValue() {
			return getRuleContext(MaxValueContext.class,0);
		}
		public IntegerPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_integerProperty; }
	}

	public final IntegerPropertyContext integerProperty() throws RecognitionException {
		IntegerPropertyContext _localctx = new IntegerPropertyContext(_ctx, getState());
		enterRule(_localctx, 170, RULE_integerProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1002);
			match(INTEGER);
			setState(1003);
			simplePropertyName();
			setState(1005);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1004);
				metaEdId();
				}
			}

			setState(1007);
			propertyComponents();
			setState(1009);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MIN_VALUE) {
				{
				setState(1008);
				minValue();
				}
			}

			setState(1012);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MAX_VALUE) {
				{
				setState(1011);
				maxValue();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PercentPropertyContext extends ParserRuleContext {
		public TerminalNode PERCENT() { return getToken(MetaEdGrammar.PERCENT, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public PercentPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_percentProperty; }
	}

	public final PercentPropertyContext percentProperty() throws RecognitionException {
		PercentPropertyContext _localctx = new PercentPropertyContext(_ctx, getState());
		enterRule(_localctx, 172, RULE_percentProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1014);
			match(PERCENT);
			setState(1015);
			simplePropertyName();
			setState(1017);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1016);
				metaEdId();
				}
			}

			setState(1019);
			propertyComponents();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AssociationPropertyContext extends ParserRuleContext {
		public TerminalNode ASSOCIATION_KEYWORD() { return getToken(MetaEdGrammar.ASSOCIATION_KEYWORD, 0); }
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public PotentiallyLogicalContext potentiallyLogical() {
			return getRuleContext(PotentiallyLogicalContext.class,0);
		}
		public IsWeakReferenceContext isWeakReference() {
			return getRuleContext(IsWeakReferenceContext.class,0);
		}
		public List<MergeDirectiveContext> mergeDirective() {
			return getRuleContexts(MergeDirectiveContext.class);
		}
		public MergeDirectiveContext mergeDirective(int i) {
			return getRuleContext(MergeDirectiveContext.class,i);
		}
		public AssociationPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_associationProperty; }
	}

	public final AssociationPropertyContext associationProperty() throws RecognitionException {
		AssociationPropertyContext _localctx = new AssociationPropertyContext(_ctx, getState());
		enterRule(_localctx, 174, RULE_associationProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1021);
			match(ASSOCIATION_KEYWORD);
			setState(1022);
			propertyName();
			setState(1024);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1023);
				metaEdId();
				}
			}

			setState(1026);
			propertyComponents();
			setState(1028);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==POTENTIALLY_LOGICAL) {
				{
				setState(1027);
				potentiallyLogical();
				}
			}

			setState(1031);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IS_WEAK_REFERENCE) {
				{
				setState(1030);
				isWeakReference();
				}
			}

			setState(1036);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MERGE_REFERENCE) {
				{
				{
				setState(1033);
				mergeDirective();
				}
				}
				setState(1038);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DomainEntityPropertyContext extends ParserRuleContext {
		public TerminalNode DOMAIN_ENTITY_KEYWORD() { return getToken(MetaEdGrammar.DOMAIN_ENTITY_KEYWORD, 0); }
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public PotentiallyLogicalContext potentiallyLogical() {
			return getRuleContext(PotentiallyLogicalContext.class,0);
		}
		public IsWeakReferenceContext isWeakReference() {
			return getRuleContext(IsWeakReferenceContext.class,0);
		}
		public List<MergeDirectiveContext> mergeDirective() {
			return getRuleContexts(MergeDirectiveContext.class);
		}
		public MergeDirectiveContext mergeDirective(int i) {
			return getRuleContext(MergeDirectiveContext.class,i);
		}
		public DomainEntityPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_domainEntityProperty; }
	}

	public final DomainEntityPropertyContext domainEntityProperty() throws RecognitionException {
		DomainEntityPropertyContext _localctx = new DomainEntityPropertyContext(_ctx, getState());
		enterRule(_localctx, 176, RULE_domainEntityProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1039);
			match(DOMAIN_ENTITY_KEYWORD);
			setState(1040);
			propertyName();
			setState(1042);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1041);
				metaEdId();
				}
			}

			setState(1044);
			propertyComponents();
			setState(1046);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==POTENTIALLY_LOGICAL) {
				{
				setState(1045);
				potentiallyLogical();
				}
			}

			setState(1049);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IS_WEAK_REFERENCE) {
				{
				setState(1048);
				isWeakReference();
				}
			}

			setState(1054);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MERGE_REFERENCE) {
				{
				{
				setState(1051);
				mergeDirective();
				}
				}
				setState(1056);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedDecimalPropertyContext extends ParserRuleContext {
		public TerminalNode SHARED_DECIMAL_KEYWORD() { return getToken(MetaEdGrammar.SHARED_DECIMAL_KEYWORD, 0); }
		public SharedPropertyTypeContext sharedPropertyType() {
			return getRuleContext(SharedPropertyTypeContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public TerminalNode SHARED_NAMED() { return getToken(MetaEdGrammar.SHARED_NAMED, 0); }
		public SharedPropertyNameContext sharedPropertyName() {
			return getRuleContext(SharedPropertyNameContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public List<MergeDirectiveContext> mergeDirective() {
			return getRuleContexts(MergeDirectiveContext.class);
		}
		public MergeDirectiveContext mergeDirective(int i) {
			return getRuleContext(MergeDirectiveContext.class,i);
		}
		public SharedDecimalPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedDecimalProperty; }
	}

	public final SharedDecimalPropertyContext sharedDecimalProperty() throws RecognitionException {
		SharedDecimalPropertyContext _localctx = new SharedDecimalPropertyContext(_ctx, getState());
		enterRule(_localctx, 178, RULE_sharedDecimalProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1057);
			match(SHARED_DECIMAL_KEYWORD);
			setState(1058);
			sharedPropertyType();
			setState(1061);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SHARED_NAMED) {
				{
				setState(1059);
				match(SHARED_NAMED);
				setState(1060);
				sharedPropertyName();
				}
			}

			setState(1064);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1063);
				metaEdId();
				}
			}

			setState(1066);
			propertyComponents();
			setState(1070);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MERGE_REFERENCE) {
				{
				{
				setState(1067);
				mergeDirective();
				}
				}
				setState(1072);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedIntegerPropertyContext extends ParserRuleContext {
		public TerminalNode SHARED_INTEGER_KEYWORD() { return getToken(MetaEdGrammar.SHARED_INTEGER_KEYWORD, 0); }
		public SharedPropertyTypeContext sharedPropertyType() {
			return getRuleContext(SharedPropertyTypeContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public TerminalNode SHARED_NAMED() { return getToken(MetaEdGrammar.SHARED_NAMED, 0); }
		public SharedPropertyNameContext sharedPropertyName() {
			return getRuleContext(SharedPropertyNameContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public List<MergeDirectiveContext> mergeDirective() {
			return getRuleContexts(MergeDirectiveContext.class);
		}
		public MergeDirectiveContext mergeDirective(int i) {
			return getRuleContext(MergeDirectiveContext.class,i);
		}
		public SharedIntegerPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedIntegerProperty; }
	}

	public final SharedIntegerPropertyContext sharedIntegerProperty() throws RecognitionException {
		SharedIntegerPropertyContext _localctx = new SharedIntegerPropertyContext(_ctx, getState());
		enterRule(_localctx, 180, RULE_sharedIntegerProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1073);
			match(SHARED_INTEGER_KEYWORD);
			setState(1074);
			sharedPropertyType();
			setState(1077);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SHARED_NAMED) {
				{
				setState(1075);
				match(SHARED_NAMED);
				setState(1076);
				sharedPropertyName();
				}
			}

			setState(1080);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1079);
				metaEdId();
				}
			}

			setState(1082);
			propertyComponents();
			setState(1086);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MERGE_REFERENCE) {
				{
				{
				setState(1083);
				mergeDirective();
				}
				}
				setState(1088);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedShortPropertyContext extends ParserRuleContext {
		public TerminalNode SHARED_SHORT_KEYWORD() { return getToken(MetaEdGrammar.SHARED_SHORT_KEYWORD, 0); }
		public SharedPropertyTypeContext sharedPropertyType() {
			return getRuleContext(SharedPropertyTypeContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public TerminalNode SHARED_NAMED() { return getToken(MetaEdGrammar.SHARED_NAMED, 0); }
		public SharedPropertyNameContext sharedPropertyName() {
			return getRuleContext(SharedPropertyNameContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public List<MergeDirectiveContext> mergeDirective() {
			return getRuleContexts(MergeDirectiveContext.class);
		}
		public MergeDirectiveContext mergeDirective(int i) {
			return getRuleContext(MergeDirectiveContext.class,i);
		}
		public SharedShortPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedShortProperty; }
	}

	public final SharedShortPropertyContext sharedShortProperty() throws RecognitionException {
		SharedShortPropertyContext _localctx = new SharedShortPropertyContext(_ctx, getState());
		enterRule(_localctx, 182, RULE_sharedShortProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1089);
			match(SHARED_SHORT_KEYWORD);
			setState(1090);
			sharedPropertyType();
			setState(1093);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SHARED_NAMED) {
				{
				setState(1091);
				match(SHARED_NAMED);
				setState(1092);
				sharedPropertyName();
				}
			}

			setState(1096);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1095);
				metaEdId();
				}
			}

			setState(1098);
			propertyComponents();
			setState(1102);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MERGE_REFERENCE) {
				{
				{
				setState(1099);
				mergeDirective();
				}
				}
				setState(1104);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedStringPropertyContext extends ParserRuleContext {
		public TerminalNode SHARED_STRING_KEYWORD() { return getToken(MetaEdGrammar.SHARED_STRING_KEYWORD, 0); }
		public SharedPropertyTypeContext sharedPropertyType() {
			return getRuleContext(SharedPropertyTypeContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public TerminalNode SHARED_NAMED() { return getToken(MetaEdGrammar.SHARED_NAMED, 0); }
		public SharedPropertyNameContext sharedPropertyName() {
			return getRuleContext(SharedPropertyNameContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public List<MergeDirectiveContext> mergeDirective() {
			return getRuleContexts(MergeDirectiveContext.class);
		}
		public MergeDirectiveContext mergeDirective(int i) {
			return getRuleContext(MergeDirectiveContext.class,i);
		}
		public SharedStringPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedStringProperty; }
	}

	public final SharedStringPropertyContext sharedStringProperty() throws RecognitionException {
		SharedStringPropertyContext _localctx = new SharedStringPropertyContext(_ctx, getState());
		enterRule(_localctx, 184, RULE_sharedStringProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1105);
			match(SHARED_STRING_KEYWORD);
			setState(1106);
			sharedPropertyType();
			setState(1109);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SHARED_NAMED) {
				{
				setState(1107);
				match(SHARED_NAMED);
				setState(1108);
				sharedPropertyName();
				}
			}

			setState(1112);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1111);
				metaEdId();
				}
			}

			setState(1114);
			propertyComponents();
			setState(1118);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==MERGE_REFERENCE) {
				{
				{
				setState(1115);
				mergeDirective();
				}
				}
				setState(1120);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ShortPropertyContext extends ParserRuleContext {
		public TerminalNode SHORT() { return getToken(MetaEdGrammar.SHORT, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public MinValueShortContext minValueShort() {
			return getRuleContext(MinValueShortContext.class,0);
		}
		public MaxValueShortContext maxValueShort() {
			return getRuleContext(MaxValueShortContext.class,0);
		}
		public ShortPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_shortProperty; }
	}

	public final ShortPropertyContext shortProperty() throws RecognitionException {
		ShortPropertyContext _localctx = new ShortPropertyContext(_ctx, getState());
		enterRule(_localctx, 186, RULE_shortProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1121);
			match(SHORT);
			setState(1122);
			simplePropertyName();
			setState(1124);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1123);
				metaEdId();
				}
			}

			setState(1126);
			propertyComponents();
			setState(1128);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MIN_VALUE) {
				{
				setState(1127);
				minValueShort();
				}
			}

			setState(1131);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MAX_VALUE) {
				{
				setState(1130);
				maxValueShort();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class StringPropertyContext extends ParserRuleContext {
		public TerminalNode STRING() { return getToken(MetaEdGrammar.STRING, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MaxLengthContext maxLength() {
			return getRuleContext(MaxLengthContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public MinLengthContext minLength() {
			return getRuleContext(MinLengthContext.class,0);
		}
		public StringPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_stringProperty; }
	}

	public final StringPropertyContext stringProperty() throws RecognitionException {
		StringPropertyContext _localctx = new StringPropertyContext(_ctx, getState());
		enterRule(_localctx, 188, RULE_stringProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1133);
			match(STRING);
			setState(1134);
			simplePropertyName();
			setState(1136);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1135);
				metaEdId();
				}
			}

			setState(1138);
			propertyComponents();
			setState(1140);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==MIN_LENGTH) {
				{
				setState(1139);
				minLength();
				}
			}

			setState(1142);
			maxLength();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TimePropertyContext extends ParserRuleContext {
		public TerminalNode TIME() { return getToken(MetaEdGrammar.TIME, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public TimePropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_timeProperty; }
	}

	public final TimePropertyContext timeProperty() throws RecognitionException {
		TimePropertyContext _localctx = new TimePropertyContext(_ctx, getState());
		enterRule(_localctx, 190, RULE_timeProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1144);
			match(TIME);
			setState(1145);
			simplePropertyName();
			setState(1147);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1146);
				metaEdId();
				}
			}

			setState(1149);
			propertyComponents();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class YearPropertyContext extends ParserRuleContext {
		public TerminalNode YEAR() { return getToken(MetaEdGrammar.YEAR, 0); }
		public SimplePropertyNameContext simplePropertyName() {
			return getRuleContext(SimplePropertyNameContext.class,0);
		}
		public PropertyComponentsContext propertyComponents() {
			return getRuleContext(PropertyComponentsContext.class,0);
		}
		public MetaEdIdContext metaEdId() {
			return getRuleContext(MetaEdIdContext.class,0);
		}
		public YearPropertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_yearProperty; }
	}

	public final YearPropertyContext yearProperty() throws RecognitionException {
		YearPropertyContext _localctx = new YearPropertyContext(_ctx, getState());
		enterRule(_localctx, 192, RULE_yearProperty);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1151);
			match(YEAR);
			setState(1152);
			simplePropertyName();
			setState(1154);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==METAED_ID) {
				{
				setState(1153);
				metaEdId();
				}
			}

			setState(1156);
			propertyComponents();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IsWeakReferenceContext extends ParserRuleContext {
		public TerminalNode IS_WEAK_REFERENCE() { return getToken(MetaEdGrammar.IS_WEAK_REFERENCE, 0); }
		public IsWeakReferenceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_isWeakReference; }
	}

	public final IsWeakReferenceContext isWeakReference() throws RecognitionException {
		IsWeakReferenceContext _localctx = new IsWeakReferenceContext(_ctx, getState());
		enterRule(_localctx, 194, RULE_isWeakReference);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1158);
			match(IS_WEAK_REFERENCE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PotentiallyLogicalContext extends ParserRuleContext {
		public TerminalNode POTENTIALLY_LOGICAL() { return getToken(MetaEdGrammar.POTENTIALLY_LOGICAL, 0); }
		public PotentiallyLogicalContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_potentiallyLogical; }
	}

	public final PotentiallyLogicalContext potentiallyLogical() throws RecognitionException {
		PotentiallyLogicalContext _localctx = new PotentiallyLogicalContext(_ctx, getState());
		enterRule(_localctx, 196, RULE_potentiallyLogical);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1160);
			match(POTENTIALLY_LOGICAL);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MergeDirectiveContext extends ParserRuleContext {
		public TerminalNode MERGE_REFERENCE() { return getToken(MetaEdGrammar.MERGE_REFERENCE, 0); }
		public SourcePropertyPathContext sourcePropertyPath() {
			return getRuleContext(SourcePropertyPathContext.class,0);
		}
		public TerminalNode WITH() { return getToken(MetaEdGrammar.WITH, 0); }
		public TargetPropertyPathContext targetPropertyPath() {
			return getRuleContext(TargetPropertyPathContext.class,0);
		}
		public MergeDirectiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_mergeDirective; }
	}

	public final MergeDirectiveContext mergeDirective() throws RecognitionException {
		MergeDirectiveContext _localctx = new MergeDirectiveContext(_ctx, getState());
		enterRule(_localctx, 198, RULE_mergeDirective);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1162);
			match(MERGE_REFERENCE);
			setState(1163);
			sourcePropertyPath();
			setState(1164);
			match(WITH);
			setState(1165);
			targetPropertyPath();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SourcePropertyPathContext extends ParserRuleContext {
		public PropertyPathContext propertyPath() {
			return getRuleContext(PropertyPathContext.class,0);
		}
		public SourcePropertyPathContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sourcePropertyPath; }
	}

	public final SourcePropertyPathContext sourcePropertyPath() throws RecognitionException {
		SourcePropertyPathContext _localctx = new SourcePropertyPathContext(_ctx, getState());
		enterRule(_localctx, 200, RULE_sourcePropertyPath);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1167);
			propertyPath();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TargetPropertyPathContext extends ParserRuleContext {
		public PropertyPathContext propertyPath() {
			return getRuleContext(PropertyPathContext.class,0);
		}
		public TargetPropertyPathContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_targetPropertyPath; }
	}

	public final TargetPropertyPathContext targetPropertyPath() throws RecognitionException {
		TargetPropertyPathContext _localctx = new TargetPropertyPathContext(_ctx, getState());
		enterRule(_localctx, 202, RULE_targetPropertyPath);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1169);
			propertyPath();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyPathContext extends ParserRuleContext {
		public List<TerminalNode> ID() { return getTokens(MetaEdGrammar.ID); }
		public TerminalNode ID(int i) {
			return getToken(MetaEdGrammar.ID, i);
		}
		public List<TerminalNode> PERIOD() { return getTokens(MetaEdGrammar.PERIOD); }
		public TerminalNode PERIOD(int i) {
			return getToken(MetaEdGrammar.PERIOD, i);
		}
		public PropertyPathContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyPath; }
	}

	public final PropertyPathContext propertyPath() throws RecognitionException {
		PropertyPathContext _localctx = new PropertyPathContext(_ctx, getState());
		enterRule(_localctx, 204, RULE_propertyPath);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1171);
			match(ID);
			setState(1176);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==PERIOD) {
				{
				{
				setState(1172);
				match(PERIOD);
				setState(1173);
				match(ID);
				}
				}
				setState(1178);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Signed_intContext extends ParserRuleContext {
		public TerminalNode UNSIGNED_INT() { return getToken(MetaEdGrammar.UNSIGNED_INT, 0); }
		public UnaryOperatorContext unaryOperator() {
			return getRuleContext(UnaryOperatorContext.class,0);
		}
		public Signed_intContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_signed_int; }
	}

	public final Signed_intContext signed_int() throws RecognitionException {
		Signed_intContext _localctx = new Signed_intContext(_ctx, getState());
		enterRule(_localctx, 206, RULE_signed_int);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1180);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==POS_SIGN || _la==NEG_SIGN) {
				{
				setState(1179);
				unaryOperator();
				}
			}

			setState(1182);
			match(UNSIGNED_INT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class UnaryOperatorContext extends ParserRuleContext {
		public TerminalNode POS_SIGN() { return getToken(MetaEdGrammar.POS_SIGN, 0); }
		public TerminalNode NEG_SIGN() { return getToken(MetaEdGrammar.NEG_SIGN, 0); }
		public UnaryOperatorContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_unaryOperator; }
	}

	public final UnaryOperatorContext unaryOperator() throws RecognitionException {
		UnaryOperatorContext _localctx = new UnaryOperatorContext(_ctx, getState());
		enterRule(_localctx, 208, RULE_unaryOperator);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1184);
			_la = _input.LA(1);
			if ( !(_la==POS_SIGN || _la==NEG_SIGN) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AbstractEntityNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public AbstractEntityNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_abstractEntityName; }
	}

	public final AbstractEntityNameContext abstractEntityName() throws RecognitionException {
		AbstractEntityNameContext _localctx = new AbstractEntityNameContext(_ctx, getState());
		enterRule(_localctx, 210, RULE_abstractEntityName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1186);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AssociationNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public AssociationNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_associationName; }
	}

	public final AssociationNameContext associationName() throws RecognitionException {
		AssociationNameContext _localctx = new AssociationNameContext(_ctx, getState());
		enterRule(_localctx, 212, RULE_associationName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1188);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BaseKeyNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public BaseKeyNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_baseKeyName; }
	}

	public final BaseKeyNameContext baseKeyName() throws RecognitionException {
		BaseKeyNameContext _localctx = new BaseKeyNameContext(_ctx, getState());
		enterRule(_localctx, 214, RULE_baseKeyName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1190);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BaseNameContext extends ParserRuleContext {
		public LocalBaseNameContext localBaseName() {
			return getRuleContext(LocalBaseNameContext.class,0);
		}
		public BaseNamespaceContext baseNamespace() {
			return getRuleContext(BaseNamespaceContext.class,0);
		}
		public TerminalNode PERIOD() { return getToken(MetaEdGrammar.PERIOD, 0); }
		public BaseNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_baseName; }
	}

	public final BaseNameContext baseName() throws RecognitionException {
		BaseNameContext _localctx = new BaseNameContext(_ctx, getState());
		enterRule(_localctx, 216, RULE_baseName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1195);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,156,_ctx) ) {
			case 1:
				{
				setState(1192);
				baseNamespace();
				setState(1193);
				match(PERIOD);
				}
				break;
			}
			setState(1197);
			localBaseName();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BaseNamespaceContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public BaseNamespaceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_baseNamespace; }
	}

	public final BaseNamespaceContext baseNamespace() throws RecognitionException {
		BaseNamespaceContext _localctx = new BaseNamespaceContext(_ctx, getState());
		enterRule(_localctx, 218, RULE_baseNamespace);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1199);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ChoiceNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public ChoiceNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_choiceName; }
	}

	public final ChoiceNameContext choiceName() throws RecognitionException {
		ChoiceNameContext _localctx = new ChoiceNameContext(_ctx, getState());
		enterRule(_localctx, 220, RULE_choiceName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1201);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedDecimalNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public SharedDecimalNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedDecimalName; }
	}

	public final SharedDecimalNameContext sharedDecimalName() throws RecognitionException {
		SharedDecimalNameContext _localctx = new SharedDecimalNameContext(_ctx, getState());
		enterRule(_localctx, 222, RULE_sharedDecimalName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1203);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedIntegerNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public SharedIntegerNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedIntegerName; }
	}

	public final SharedIntegerNameContext sharedIntegerName() throws RecognitionException {
		SharedIntegerNameContext _localctx = new SharedIntegerNameContext(_ctx, getState());
		enterRule(_localctx, 224, RULE_sharedIntegerName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1205);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CommonNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public CommonNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_commonName; }
	}

	public final CommonNameContext commonName() throws RecognitionException {
		CommonNameContext _localctx = new CommonNameContext(_ctx, getState());
		enterRule(_localctx, 226, RULE_commonName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1207);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedShortNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public SharedShortNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedShortName; }
	}

	public final SharedShortNameContext sharedShortName() throws RecognitionException {
		SharedShortNameContext _localctx = new SharedShortNameContext(_ctx, getState());
		enterRule(_localctx, 228, RULE_sharedShortName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1209);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedStringNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public SharedStringNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedStringName; }
	}

	public final SharedStringNameContext sharedStringName() throws RecognitionException {
		SharedStringNameContext _localctx = new SharedStringNameContext(_ctx, getState());
		enterRule(_localctx, 230, RULE_sharedStringName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1211);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DescriptorNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public DescriptorNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_descriptorName; }
	}

	public final DescriptorNameContext descriptorName() throws RecognitionException {
		DescriptorNameContext _localctx = new DescriptorNameContext(_ctx, getState());
		enterRule(_localctx, 232, RULE_descriptorName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1213);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DomainNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public DomainNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_domainName; }
	}

	public final DomainNameContext domainName() throws RecognitionException {
		DomainNameContext _localctx = new DomainNameContext(_ctx, getState());
		enterRule(_localctx, 234, RULE_domainName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1215);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public EntityNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityName; }
	}

	public final EntityNameContext entityName() throws RecognitionException {
		EntityNameContext _localctx = new EntityNameContext(_ctx, getState());
		enterRule(_localctx, 236, RULE_entityName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1217);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EnumerationNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public EnumerationNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_enumerationName; }
	}

	public final EnumerationNameContext enumerationName() throws RecognitionException {
		EnumerationNameContext _localctx = new EnumerationNameContext(_ctx, getState());
		enterRule(_localctx, 238, RULE_enumerationName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1219);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExtendeeNameContext extends ParserRuleContext {
		public LocalExtendeeNameContext localExtendeeName() {
			return getRuleContext(LocalExtendeeNameContext.class,0);
		}
		public ExtendeeNamespaceContext extendeeNamespace() {
			return getRuleContext(ExtendeeNamespaceContext.class,0);
		}
		public TerminalNode PERIOD() { return getToken(MetaEdGrammar.PERIOD, 0); }
		public ExtendeeNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_extendeeName; }
	}

	public final ExtendeeNameContext extendeeName() throws RecognitionException {
		ExtendeeNameContext _localctx = new ExtendeeNameContext(_ctx, getState());
		enterRule(_localctx, 240, RULE_extendeeName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1224);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,157,_ctx) ) {
			case 1:
				{
				setState(1221);
				extendeeNamespace();
				setState(1222);
				match(PERIOD);
				}
				break;
			}
			setState(1226);
			localExtendeeName();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExtendeeNamespaceContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public ExtendeeNamespaceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_extendeeNamespace; }
	}

	public final ExtendeeNamespaceContext extendeeNamespace() throws RecognitionException {
		ExtendeeNamespaceContext _localctx = new ExtendeeNamespaceContext(_ctx, getState());
		enterRule(_localctx, 242, RULE_extendeeNamespace);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1228);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InlineCommonNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public InlineCommonNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_inlineCommonName; }
	}

	public final InlineCommonNameContext inlineCommonName() throws RecognitionException {
		InlineCommonNameContext _localctx = new InlineCommonNameContext(_ctx, getState());
		enterRule(_localctx, 244, RULE_inlineCommonName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1230);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InterchangeNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public InterchangeNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_interchangeName; }
	}

	public final InterchangeNameContext interchangeName() throws RecognitionException {
		InterchangeNameContext _localctx = new InterchangeNameContext(_ctx, getState());
		enterRule(_localctx, 246, RULE_interchangeName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1232);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LocalBaseNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public LocalBaseNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_localBaseName; }
	}

	public final LocalBaseNameContext localBaseName() throws RecognitionException {
		LocalBaseNameContext _localctx = new LocalBaseNameContext(_ctx, getState());
		enterRule(_localctx, 248, RULE_localBaseName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1234);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LocalDomainItemNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public LocalDomainItemNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_localDomainItemName; }
	}

	public final LocalDomainItemNameContext localDomainItemName() throws RecognitionException {
		LocalDomainItemNameContext _localctx = new LocalDomainItemNameContext(_ctx, getState());
		enterRule(_localctx, 250, RULE_localDomainItemName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1236);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LocalExtendeeNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public LocalExtendeeNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_localExtendeeName; }
	}

	public final LocalExtendeeNameContext localExtendeeName() throws RecognitionException {
		LocalExtendeeNameContext _localctx = new LocalExtendeeNameContext(_ctx, getState());
		enterRule(_localctx, 252, RULE_localExtendeeName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1238);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LocalInterchangeItemNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public LocalInterchangeItemNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_localInterchangeItemName; }
	}

	public final LocalInterchangeItemNameContext localInterchangeItemName() throws RecognitionException {
		LocalInterchangeItemNameContext _localctx = new LocalInterchangeItemNameContext(_ctx, getState());
		enterRule(_localctx, 254, RULE_localInterchangeItemName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1240);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LocalPropertyNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public LocalPropertyNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_localPropertyName; }
	}

	public final LocalPropertyNameContext localPropertyName() throws RecognitionException {
		LocalPropertyNameContext _localctx = new LocalPropertyNameContext(_ctx, getState());
		enterRule(_localctx, 256, RULE_localPropertyName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1242);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LocalPropertyTypeContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public LocalPropertyTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_localPropertyType; }
	}

	public final LocalPropertyTypeContext localPropertyType() throws RecognitionException {
		LocalPropertyTypeContext _localctx = new LocalPropertyTypeContext(_ctx, getState());
		enterRule(_localctx, 258, RULE_localPropertyType);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1244);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ParentDomainNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public ParentDomainNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_parentDomainName; }
	}

	public final ParentDomainNameContext parentDomainName() throws RecognitionException {
		ParentDomainNameContext _localctx = new ParentDomainNameContext(_ctx, getState());
		enterRule(_localctx, 260, RULE_parentDomainName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1246);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyNameContext extends ParserRuleContext {
		public LocalPropertyNameContext localPropertyName() {
			return getRuleContext(LocalPropertyNameContext.class,0);
		}
		public PropertyNamespaceContext propertyNamespace() {
			return getRuleContext(PropertyNamespaceContext.class,0);
		}
		public TerminalNode PERIOD() { return getToken(MetaEdGrammar.PERIOD, 0); }
		public PropertyNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyName; }
	}

	public final PropertyNameContext propertyName() throws RecognitionException {
		PropertyNameContext _localctx = new PropertyNameContext(_ctx, getState());
		enterRule(_localctx, 262, RULE_propertyName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1251);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,158,_ctx) ) {
			case 1:
				{
				setState(1248);
				propertyNamespace();
				setState(1249);
				match(PERIOD);
				}
				break;
			}
			setState(1253);
			localPropertyName();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyNamespaceContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public PropertyNamespaceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyNamespace; }
	}

	public final PropertyNamespaceContext propertyNamespace() throws RecognitionException {
		PropertyNamespaceContext _localctx = new PropertyNamespaceContext(_ctx, getState());
		enterRule(_localctx, 264, RULE_propertyNamespace);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1255);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class RoleNameNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public RoleNameNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_roleNameName; }
	}

	public final RoleNameNameContext roleNameName() throws RecognitionException {
		RoleNameNameContext _localctx = new RoleNameNameContext(_ctx, getState());
		enterRule(_localctx, 266, RULE_roleNameName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1257);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedPropertyNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public SharedPropertyNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedPropertyName; }
	}

	public final SharedPropertyNameContext sharedPropertyName() throws RecognitionException {
		SharedPropertyNameContext _localctx = new SharedPropertyNameContext(_ctx, getState());
		enterRule(_localctx, 268, RULE_sharedPropertyName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1259);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SharedPropertyTypeContext extends ParserRuleContext {
		public LocalPropertyTypeContext localPropertyType() {
			return getRuleContext(LocalPropertyTypeContext.class,0);
		}
		public PropertyNamespaceContext propertyNamespace() {
			return getRuleContext(PropertyNamespaceContext.class,0);
		}
		public TerminalNode PERIOD() { return getToken(MetaEdGrammar.PERIOD, 0); }
		public SharedPropertyTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sharedPropertyType; }
	}

	public final SharedPropertyTypeContext sharedPropertyType() throws RecognitionException {
		SharedPropertyTypeContext _localctx = new SharedPropertyTypeContext(_ctx, getState());
		enterRule(_localctx, 270, RULE_sharedPropertyType);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1264);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,159,_ctx) ) {
			case 1:
				{
				setState(1261);
				propertyNamespace();
				setState(1262);
				match(PERIOD);
				}
				break;
			}
			setState(1266);
			localPropertyType();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ShortenToNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public ShortenToNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_shortenToName; }
	}

	public final ShortenToNameContext shortenToName() throws RecognitionException {
		ShortenToNameContext _localctx = new ShortenToNameContext(_ctx, getState());
		enterRule(_localctx, 272, RULE_shortenToName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1268);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SimplePropertyNameContext extends ParserRuleContext {
		public LocalPropertyNameContext localPropertyName() {
			return getRuleContext(LocalPropertyNameContext.class,0);
		}
		public SimplePropertyNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_simplePropertyName; }
	}

	public final SimplePropertyNameContext simplePropertyName() throws RecognitionException {
		SimplePropertyNameContext _localctx = new SimplePropertyNameContext(_ctx, getState());
		enterRule(_localctx, 274, RULE_simplePropertyName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1270);
			localPropertyName();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SubdomainNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public SubdomainNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_subdomainName; }
	}

	public final SubdomainNameContext subdomainName() throws RecognitionException {
		SubdomainNameContext _localctx = new SubdomainNameContext(_ctx, getState());
		enterRule(_localctx, 276, RULE_subdomainName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1272);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NamespaceNameContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(MetaEdGrammar.ID, 0); }
		public NamespaceNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_namespaceName; }
	}

	public final NamespaceNameContext namespaceName() throws RecognitionException {
		NamespaceNameContext _localctx = new NamespaceNameContext(_ctx, getState());
		enterRule(_localctx, 278, RULE_namespaceName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1274);
			match(ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MetaEdIdContext extends ParserRuleContext {
		public TerminalNode METAED_ID() { return getToken(MetaEdGrammar.METAED_ID, 0); }
		public MetaEdIdContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_metaEdId; }
	}

	public final MetaEdIdContext metaEdId() throws RecognitionException {
		MetaEdIdContext _localctx = new MetaEdIdContext(_ctx, getState());
		enterRule(_localctx, 280, RULE_metaEdId);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1276);
			match(METAED_ID);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3b\u0501\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31\t\31"+
		"\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37\t\37\4 \t \4!"+
		"\t!\4\"\t\"\4#\t#\4$\t$\4%\t%\4&\t&\4\'\t\'\4(\t(\4)\t)\4*\t*\4+\t+\4"+
		",\t,\4-\t-\4.\t.\4/\t/\4\60\t\60\4\61\t\61\4\62\t\62\4\63\t\63\4\64\t"+
		"\64\4\65\t\65\4\66\t\66\4\67\t\67\48\t8\49\t9\4:\t:\4;\t;\4<\t<\4=\t="+
		"\4>\t>\4?\t?\4@\t@\4A\tA\4B\tB\4C\tC\4D\tD\4E\tE\4F\tF\4G\tG\4H\tH\4I"+
		"\tI\4J\tJ\4K\tK\4L\tL\4M\tM\4N\tN\4O\tO\4P\tP\4Q\tQ\4R\tR\4S\tS\4T\tT"+
		"\4U\tU\4V\tV\4W\tW\4X\tX\4Y\tY\4Z\tZ\4[\t[\4\\\t\\\4]\t]\4^\t^\4_\t_\4"+
		"`\t`\4a\ta\4b\tb\4c\tc\4d\td\4e\te\4f\tf\4g\tg\4h\th\4i\ti\4j\tj\4k\t"+
		"k\4l\tl\4m\tm\4n\tn\4o\to\4p\tp\4q\tq\4r\tr\4s\ts\4t\tt\4u\tu\4v\tv\4"+
		"w\tw\4x\tx\4y\ty\4z\tz\4{\t{\4|\t|\4}\t}\4~\t~\4\177\t\177\4\u0080\t\u0080"+
		"\4\u0081\t\u0081\4\u0082\t\u0082\4\u0083\t\u0083\4\u0084\t\u0084\4\u0085"+
		"\t\u0085\4\u0086\t\u0086\4\u0087\t\u0087\4\u0088\t\u0088\4\u0089\t\u0089"+
		"\4\u008a\t\u008a\4\u008b\t\u008b\4\u008c\t\u008c\4\u008d\t\u008d\4\u008e"+
		"\t\u008e\3\2\6\2\u011e\n\2\r\2\16\2\u011f\3\3\3\3\3\3\3\3\6\3\u0126\n"+
		"\3\r\3\16\3\u0127\3\3\3\3\3\4\3\4\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5"+
		"\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\5\5\u0144\n\5\3\6"+
		"\3\6\3\6\3\7\3\7\3\7\3\b\3\b\3\b\3\t\3\t\3\t\3\n\3\n\3\n\3\13\3\13\3\13"+
		"\3\f\3\f\3\f\5\f\u015b\n\f\3\f\5\f\u015e\n\f\3\f\3\f\6\f\u0162\n\f\r\f"+
		"\16\f\u0163\3\r\3\r\3\16\3\16\3\17\3\17\3\17\5\17\u016d\n\17\3\17\5\17"+
		"\u0170\n\17\3\17\3\17\5\17\u0174\n\17\3\17\3\17\3\17\7\17\u0179\n\17\f"+
		"\17\16\17\u017c\13\17\3\20\3\20\3\20\5\20\u0181\n\20\3\20\5\20\u0184\n"+
		"\20\3\20\3\20\5\20\u0188\n\20\3\20\7\20\u018b\n\20\f\20\16\20\u018e\13"+
		"\20\3\21\3\21\3\21\3\21\5\21\u0194\n\21\3\21\5\21\u0197\n\21\3\21\6\21"+
		"\u019a\n\21\r\21\16\21\u019b\3\22\3\22\3\22\3\22\3\22\5\22\u01a3\n\22"+
		"\3\22\5\22\u01a6\n\22\3\22\3\22\6\22\u01aa\n\22\r\22\16\22\u01ab\3\23"+
		"\3\23\3\23\5\23\u01b1\n\23\3\23\5\23\u01b4\n\23\3\23\3\23\6\23\u01b8\n"+
		"\23\r\23\16\23\u01b9\3\24\3\24\3\24\5\24\u01bf\n\24\3\24\5\24\u01c2\n"+
		"\24\3\24\3\24\3\24\3\24\5\24\u01c8\n\24\3\24\5\24\u01cb\n\24\3\25\3\25"+
		"\3\25\5\25\u01d0\n\25\3\25\5\25\u01d3\n\25\3\25\3\25\5\25\u01d7\n\25\3"+
		"\25\5\25\u01da\n\25\3\26\3\26\3\26\5\26\u01df\n\26\3\26\5\26\u01e2\n\26"+
		"\3\26\3\26\5\26\u01e6\n\26\3\26\5\26\u01e9\n\26\3\27\3\27\3\27\5\27\u01ee"+
		"\n\27\3\27\5\27\u01f1\n\27\3\27\3\27\5\27\u01f5\n\27\3\27\3\27\3\30\3"+
		"\30\3\30\5\30\u01fc\n\30\3\30\5\30\u01ff\n\30\3\30\3\30\6\30\u0203\n\30"+
		"\r\30\16\30\u0204\3\31\3\31\3\31\3\31\5\31\u020b\n\31\3\31\5\31\u020e"+
		"\n\31\3\31\6\31\u0211\n\31\r\31\16\31\u0212\3\32\3\32\3\32\3\32\3\32\5"+
		"\32\u021a\n\32\3\32\5\32\u021d\n\32\3\32\3\32\6\32\u0221\n\32\r\32\16"+
		"\32\u0222\3\33\3\33\3\33\5\33\u0228\n\33\3\33\5\33\u022b\n\33\3\33\3\33"+
		"\7\33\u022f\n\33\f\33\16\33\u0232\13\33\3\33\5\33\u0235\n\33\3\34\3\34"+
		"\5\34\u0239\n\34\3\34\3\34\6\34\u023d\n\34\r\34\16\34\u023e\3\35\3\35"+
		"\3\36\3\36\3\37\3\37\3\37\5\37\u0248\n\37\3\37\5\37\u024b\n\37\3\37\3"+
		"\37\6\37\u024f\n\37\r\37\16\37\u0250\3\37\5\37\u0254\n\37\3 \3 \3 \3 "+
		"\5 \u025a\n \3 \3 \5 \u025e\n \3!\3!\3!\3\"\3\"\3\"\5\"\u0266\n\"\3\""+
		"\5\"\u0269\n\"\3\"\3\"\5\"\u026d\n\"\3\"\6\"\u0270\n\"\r\"\16\"\u0271"+
		"\3#\3#\3#\3#\5#\u0278\n#\3#\5#\u027b\n#\3#\6#\u027e\n#\r#\16#\u027f\3"+
		"$\3$\3$\3$\3$\5$\u0287\n$\3$\5$\u028a\n$\3$\3$\6$\u028e\n$\r$\16$\u028f"+
		"\3%\3%\3%\5%\u0295\n%\3%\5%\u0298\n%\3%\3%\6%\u029c\n%\r%\16%\u029d\3"+
		"&\3&\3&\5&\u02a3\n&\3&\5&\u02a6\n&\3\'\3\'\3(\3(\3(\5(\u02ad\n(\3(\5("+
		"\u02b0\n(\3(\3(\6(\u02b4\n(\r(\16(\u02b5\3)\3)\3)\5)\u02bb\n)\3)\5)\u02be"+
		"\n)\3)\3)\5)\u02c2\n)\3)\5)\u02c5\n)\3)\3)\3*\3*\3*\3+\3+\3+\3,\7,\u02d0"+
		"\n,\f,\16,\u02d3\13,\3,\3,\3,\7,\u02d8\n,\f,\16,\u02db\13,\3-\3-\3-\3"+
		"-\5-\u02e1\n-\3-\3-\5-\u02e5\n-\3.\3.\3.\3.\5.\u02eb\n.\3.\3.\5.\u02ef"+
		"\n.\3/\3/\3/\3/\5/\u02f5\n/\3/\5/\u02f8\n/\3/\3/\3\60\3\60\6\60\u02fe"+
		"\n\60\r\60\16\60\u02ff\3\61\3\61\3\61\3\61\3\61\5\61\u0307\n\61\3\61\5"+
		"\61\u030a\n\61\3\61\3\61\6\61\u030e\n\61\r\61\16\61\u030f\3\61\3\61\5"+
		"\61\u0314\n\61\3\62\3\62\3\63\3\63\3\63\5\63\u031b\n\63\3\64\3\64\3\64"+
		"\5\64\u0320\n\64\3\65\3\65\3\65\3\66\3\66\3\66\3\67\3\67\3\67\38\38\3"+
		"8\39\39\59\u0330\n9\3:\3:\3:\3;\3;\3;\3<\3<\3=\3=\3=\3=\3=\3=\5=\u0340"+
		"\n=\3>\3>\3?\3?\3?\3@\3@\3A\3A\3B\3B\5B\u034d\nB\3C\3C\3D\3D\3E\3E\3F"+
		"\5F\u0356\nF\3F\3F\3F\5F\u035b\nF\3F\5F\u035e\nF\3G\3G\3H\3H\3H\3H\5H"+
		"\u0366\nH\3I\3I\3I\3J\3J\3J\3K\3K\3K\3K\3K\3K\3K\3K\3K\3K\3K\3K\3K\3K"+
		"\3K\3K\3K\3K\3K\3K\3K\3K\3K\5K\u0385\nK\3L\3L\3L\5L\u038a\nL\3L\3L\3M"+
		"\3M\3M\5M\u0391\nM\3M\3M\3N\3N\3N\5N\u0398\nN\3N\3N\3O\3O\3O\5O\u039f"+
		"\nO\3O\3O\3P\3P\3P\5P\u03a6\nP\3P\3P\3P\3P\5P\u03ac\nP\3P\5P\u03af\nP"+
		"\3Q\3Q\3Q\5Q\u03b4\nQ\3Q\3Q\3R\3R\3R\5R\u03bb\nR\3R\3R\3S\3S\3S\5S\u03c2"+
		"\nS\3S\3S\3T\3T\5T\u03c8\nT\3T\3T\5T\u03cc\nT\3T\3T\7T\u03d0\nT\fT\16"+
		"T\u03d3\13T\3U\3U\3U\5U\u03d8\nU\3U\3U\7U\u03dc\nU\fU\16U\u03df\13U\3"+
		"V\3V\3V\5V\u03e4\nV\3V\3V\7V\u03e8\nV\fV\16V\u03eb\13V\3W\3W\3W\5W\u03f0"+
		"\nW\3W\3W\5W\u03f4\nW\3W\5W\u03f7\nW\3X\3X\3X\5X\u03fc\nX\3X\3X\3Y\3Y"+
		"\3Y\5Y\u0403\nY\3Y\3Y\5Y\u0407\nY\3Y\5Y\u040a\nY\3Y\7Y\u040d\nY\fY\16"+
		"Y\u0410\13Y\3Z\3Z\3Z\5Z\u0415\nZ\3Z\3Z\5Z\u0419\nZ\3Z\5Z\u041c\nZ\3Z\7"+
		"Z\u041f\nZ\fZ\16Z\u0422\13Z\3[\3[\3[\3[\5[\u0428\n[\3[\5[\u042b\n[\3["+
		"\3[\7[\u042f\n[\f[\16[\u0432\13[\3\\\3\\\3\\\3\\\5\\\u0438\n\\\3\\\5\\"+
		"\u043b\n\\\3\\\3\\\7\\\u043f\n\\\f\\\16\\\u0442\13\\\3]\3]\3]\3]\5]\u0448"+
		"\n]\3]\5]\u044b\n]\3]\3]\7]\u044f\n]\f]\16]\u0452\13]\3^\3^\3^\3^\5^\u0458"+
		"\n^\3^\5^\u045b\n^\3^\3^\7^\u045f\n^\f^\16^\u0462\13^\3_\3_\3_\5_\u0467"+
		"\n_\3_\3_\5_\u046b\n_\3_\5_\u046e\n_\3`\3`\3`\5`\u0473\n`\3`\3`\5`\u0477"+
		"\n`\3`\3`\3a\3a\3a\5a\u047e\na\3a\3a\3b\3b\3b\5b\u0485\nb\3b\3b\3c\3c"+
		"\3d\3d\3e\3e\3e\3e\3e\3f\3f\3g\3g\3h\3h\3h\7h\u0499\nh\fh\16h\u049c\13"+
		"h\3i\5i\u049f\ni\3i\3i\3j\3j\3k\3k\3l\3l\3m\3m\3n\3n\3n\5n\u04ae\nn\3"+
		"n\3n\3o\3o\3p\3p\3q\3q\3r\3r\3s\3s\3t\3t\3u\3u\3v\3v\3w\3w\3x\3x\3y\3"+
		"y\3z\3z\3z\5z\u04cb\nz\3z\3z\3{\3{\3|\3|\3}\3}\3~\3~\3\177\3\177\3\u0080"+
		"\3\u0080\3\u0081\3\u0081\3\u0082\3\u0082\3\u0083\3\u0083\3\u0084\3\u0084"+
		"\3\u0085\3\u0085\3\u0085\5\u0085\u04e6\n\u0085\3\u0085\3\u0085\3\u0086"+
		"\3\u0086\3\u0087\3\u0087\3\u0088\3\u0088\3\u0089\3\u0089\3\u0089\5\u0089"+
		"\u04f3\n\u0089\3\u0089\3\u0089\3\u008a\3\u008a\3\u008b\3\u008b\3\u008c"+
		"\3\u008c\3\u008d\3\u008d\3\u008e\3\u008e\3\u008e\2\2\u008f\2\4\6\b\n\f"+
		"\16\20\22\24\26\30\32\34\36 \"$&(*,.\60\62\64\668:<>@BDFHJLNPRTVXZ\\^"+
		"`bdfhjlnprtvxz|~\u0080\u0082\u0084\u0086\u0088\u008a\u008c\u008e\u0090"+
		"\u0092\u0094\u0096\u0098\u009a\u009c\u009e\u00a0\u00a2\u00a4\u00a6\u00a8"+
		"\u00aa\u00ac\u00ae\u00b0\u00b2\u00b4\u00b6\u00b8\u00ba\u00bc\u00be\u00c0"+
		"\u00c2\u00c4\u00c6\u00c8\u00ca\u00cc\u00ce\u00d0\u00d2\u00d4\u00d6\u00d8"+
		"\u00da\u00dc\u00de\u00e0\u00e2\u00e4\u00e6\u00e8\u00ea\u00ec\u00ee\u00f0"+
		"\u00f2\u00f4\u00f6\u00f8\u00fa\u00fc\u00fe\u0100\u0102\u0104\u0106\u0108"+
		"\u010a\u010c\u010e\u0110\u0112\u0114\u0116\u0118\u011a\2\b\4\288XX\4\2"+
		"TT[[\6\2\26\26\32\32 !((\4\2\26\26 !\4\2\27\27\"\"\3\2]^\2\u0540\2\u011d"+
		"\3\2\2\2\4\u0121\3\2\2\2\6\u012b\3\2\2\2\b\u0143\3\2\2\2\n\u0145\3\2\2"+
		"\2\f\u0148\3\2\2\2\16\u014b\3\2\2\2\20\u014e\3\2\2\2\22\u0151\3\2\2\2"+
		"\24\u0154\3\2\2\2\26\u0157\3\2\2\2\30\u0165\3\2\2\2\32\u0167\3\2\2\2\34"+
		"\u0169\3\2\2\2\36\u017d\3\2\2\2 \u018f\3\2\2\2\"\u019d\3\2\2\2$\u01ad"+
		"\3\2\2\2&\u01bb\3\2\2\2(\u01cc\3\2\2\2*\u01db\3\2\2\2,\u01ea\3\2\2\2."+
		"\u01f8\3\2\2\2\60\u0206\3\2\2\2\62\u0214\3\2\2\2\64\u0224\3\2\2\2\66\u0238"+
		"\3\2\2\28\u0240\3\2\2\2:\u0242\3\2\2\2<\u0244\3\2\2\2>\u0255\3\2\2\2@"+
		"\u025f\3\2\2\2B\u0262\3\2\2\2D\u0273\3\2\2\2F\u0281\3\2\2\2H\u0291\3\2"+
		"\2\2J\u029f\3\2\2\2L\u02a7\3\2\2\2N\u02a9\3\2\2\2P\u02b7\3\2\2\2R\u02c8"+
		"\3\2\2\2T\u02cb\3\2\2\2V\u02d1\3\2\2\2X\u02dc\3\2\2\2Z\u02e6\3\2\2\2\\"+
		"\u02f0\3\2\2\2^\u02fd\3\2\2\2`\u0301\3\2\2\2b\u0315\3\2\2\2d\u0317\3\2"+
		"\2\2f\u031c\3\2\2\2h\u0321\3\2\2\2j\u0324\3\2\2\2l\u0327\3\2\2\2n\u032a"+
		"\3\2\2\2p\u032f\3\2\2\2r\u0331\3\2\2\2t\u0334\3\2\2\2v\u0337\3\2\2\2x"+
		"\u033f\3\2\2\2z\u0341\3\2\2\2|\u0343\3\2\2\2~\u0346\3\2\2\2\u0080\u0348"+
		"\3\2\2\2\u0082\u034c\3\2\2\2\u0084\u034e\3\2\2\2\u0086\u0350\3\2\2\2\u0088"+
		"\u0352\3\2\2\2\u008a\u0355\3\2\2\2\u008c\u035f\3\2\2\2\u008e\u0361\3\2"+
		"\2\2\u0090\u0367\3\2\2\2\u0092\u036a\3\2\2\2\u0094\u0384\3\2\2\2\u0096"+
		"\u0386\3\2\2\2\u0098\u038d\3\2\2\2\u009a\u0394\3\2\2\2\u009c\u039b\3\2"+
		"\2\2\u009e\u03a2\3\2\2\2\u00a0\u03b0\3\2\2\2\u00a2\u03b7\3\2\2\2\u00a4"+
		"\u03be\3\2\2\2\u00a6\u03c7\3\2\2\2\u00a8\u03d4\3\2\2\2\u00aa\u03e0\3\2"+
		"\2\2\u00ac\u03ec\3\2\2\2\u00ae\u03f8\3\2\2\2\u00b0\u03ff\3\2\2\2\u00b2"+
		"\u0411\3\2\2\2\u00b4\u0423\3\2\2\2\u00b6\u0433\3\2\2\2\u00b8\u0443\3\2"+
		"\2\2\u00ba\u0453\3\2\2\2\u00bc\u0463\3\2\2\2\u00be\u046f\3\2\2\2\u00c0"+
		"\u047a\3\2\2\2\u00c2\u0481\3\2\2\2\u00c4\u0488\3\2\2\2\u00c6\u048a\3\2"+
		"\2\2\u00c8\u048c\3\2\2\2\u00ca\u0491\3\2\2\2\u00cc\u0493\3\2\2\2\u00ce"+
		"\u0495\3\2\2\2\u00d0\u049e\3\2\2\2\u00d2\u04a2\3\2\2\2\u00d4\u04a4\3\2"+
		"\2\2\u00d6\u04a6\3\2\2\2\u00d8\u04a8\3\2\2\2\u00da\u04ad\3\2\2\2\u00dc"+
		"\u04b1\3\2\2\2\u00de\u04b3\3\2\2\2\u00e0\u04b5\3\2\2\2\u00e2\u04b7\3\2"+
		"\2\2\u00e4\u04b9\3\2\2\2\u00e6\u04bb\3\2\2\2\u00e8\u04bd\3\2\2\2\u00ea"+
		"\u04bf\3\2\2\2\u00ec\u04c1\3\2\2\2\u00ee\u04c3\3\2\2\2\u00f0\u04c5\3\2"+
		"\2\2\u00f2\u04ca\3\2\2\2\u00f4\u04ce\3\2\2\2\u00f6\u04d0\3\2\2\2\u00f8"+
		"\u04d2\3\2\2\2\u00fa\u04d4\3\2\2\2\u00fc\u04d6\3\2\2\2\u00fe\u04d8\3\2"+
		"\2\2\u0100\u04da\3\2\2\2\u0102\u04dc\3\2\2\2\u0104\u04de\3\2\2\2\u0106"+
		"\u04e0\3\2\2\2\u0108\u04e5\3\2\2\2\u010a\u04e9\3\2\2\2\u010c\u04eb\3\2"+
		"\2\2\u010e\u04ed\3\2\2\2\u0110\u04f2\3\2\2\2\u0112\u04f6\3\2\2\2\u0114"+
		"\u04f8\3\2\2\2\u0116\u04fa\3\2\2\2\u0118\u04fc\3\2\2\2\u011a\u04fe\3\2"+
		"\2\2\u011c\u011e\5\4\3\2\u011d\u011c\3\2\2\2\u011e\u011f\3\2\2\2\u011f"+
		"\u011d\3\2\2\2\u011f\u0120\3\2\2\2\u0120\3\3\2\2\2\u0121\u0122\7\5\2\2"+
		"\u0122\u0123\5\u0118\u008d\2\u0123\u0125\5\6\4\2\u0124\u0126\5\b\5\2\u0125"+
		"\u0124\3\2\2\2\u0126\u0127\3\2\2\2\u0127\u0125\3\2\2\2\u0127\u0128\3\2"+
		"\2\2\u0128\u0129\3\2\2\2\u0129\u012a\7\6\2\2\u012a\5\3\2\2\2\u012b\u012c"+
		"\t\2\2\2\u012c\7\3\2\2\2\u012d\u0144\5\26\f\2\u012e\u0144\5\34\17\2\u012f"+
		"\u0144\5 \21\2\u0130\u0144\5\"\22\2\u0131\u0144\5$\23\2\u0132\u0144\5"+
		"&\24\2\u0133\u0144\5(\25\2\u0134\u0144\5*\26\2\u0135\u0144\5,\27\2\u0136"+
		"\u0144\5.\30\2\u0137\u0144\5\60\31\2\u0138\u0144\5\62\32\2\u0139\u0144"+
		"\5\64\33\2\u013a\u0144\5B\"\2\u013b\u0144\5D#\2\u013c\u0144\5F$\2\u013d"+
		"\u0144\5H%\2\u013e\u0144\5N(\2\u013f\u0144\5P)\2\u0140\u0144\5\\/\2\u0141"+
		"\u0144\5<\37\2\u0142\u0144\5`\61\2\u0143\u012d\3\2\2\2\u0143\u012e\3\2"+
		"\2\2\u0143\u012f\3\2\2\2\u0143\u0130\3\2\2\2\u0143\u0131\3\2\2\2\u0143"+
		"\u0132\3\2\2\2\u0143\u0133\3\2\2\2\u0143\u0134\3\2\2\2\u0143\u0135\3\2"+
		"\2\2\u0143\u0136\3\2\2\2\u0143\u0137\3\2\2\2\u0143\u0138\3\2\2\2\u0143"+
		"\u0139\3\2\2\2\u0143\u013a\3\2\2\2\u0143\u013b\3\2\2\2\u0143\u013c\3\2"+
		"\2\2\u0143\u013d\3\2\2\2\u0143\u013e\3\2\2\2\u0143\u013f\3\2\2\2\u0143"+
		"\u0140\3\2\2\2\u0143\u0141\3\2\2\2\u0143\u0142\3\2\2\2\u0144\t\3\2\2\2"+
		"\u0145\u0146\7R\2\2\u0146\u0147\7[\2\2\u0147\13\3\2\2\2\u0148\u0149\7"+
		"R\2\2\u0149\u014a\7[\2\2\u014a\r\3\2\2\2\u014b\u014c\7S\2\2\u014c\u014d"+
		"\7[\2\2\u014d\17\3\2\2\2\u014e\u014f\7S\2\2\u014f\u0150\7[\2\2\u0150\21"+
		"\3\2\2\2\u0151\u0152\7S\2\2\u0152\u0153\7[\2\2\u0153\23\3\2\2\2\u0154"+
		"\u0155\7S\2\2\u0155\u0156\t\3\2\2\u0156\25\3\2\2\2\u0157\u0158\7\3\2\2"+
		"\u0158\u015a\5\u00d4k\2\u0159\u015b\5\u011a\u008e\2\u015a\u0159\3\2\2"+
		"\2\u015a\u015b\3\2\2\2\u015b\u015d\3\2\2\2\u015c\u015e\5\n\6\2\u015d\u015c"+
		"\3\2\2\2\u015d\u015e\3\2\2\2\u015e\u015f\3\2\2\2\u015f\u0161\5\16\b\2"+
		"\u0160\u0162\5\u0094K\2\u0161\u0160\3\2\2\2\u0162\u0163\3\2\2\2\u0163"+
		"\u0161\3\2\2\2\u0163\u0164\3\2\2\2\u0164\27\3\2\2\2\u0165\u0166\5\32\16"+
		"\2\u0166\31\3\2\2\2\u0167\u0168\79\2\2\u0168\33\3\2\2\2\u0169\u016a\7"+
		"\4\2\2\u016a\u016c\5\u00d6l\2\u016b\u016d\5\u011a\u008e\2\u016c\u016b"+
		"\3\2\2\2\u016c\u016d\3\2\2\2\u016d\u016f\3\2\2\2\u016e\u0170\5\n\6\2\u016f"+
		"\u016e\3\2\2\2\u016f\u0170\3\2\2\2\u0170\u0171\3\2\2\2\u0171\u0173\5\16"+
		"\b\2\u0172\u0174\5\30\r\2\u0173\u0172\3\2\2\2\u0173\u0174\3\2\2\2\u0174"+
		"\u0175\3\2\2\2\u0175\u0176\5\36\20\2\u0176\u017a\5\36\20\2\u0177\u0179"+
		"\5\u0094K\2\u0178\u0177\3\2\2\2\u0179\u017c\3\2\2\2\u017a\u0178\3\2\2"+
		"\2\u017a\u017b\3\2\2\2\u017b\35\3\2\2\2\u017c\u017a\3\2\2\2\u017d\u017e"+
		"\7!\2\2\u017e\u0180\5\u0108\u0085\2\u017f\u0181\5\u011a\u008e\2\u0180"+
		"\u017f\3\2\2\2\u0180\u0181\3\2\2\2\u0181\u0183\3\2\2\2\u0182\u0184\5\f"+
		"\7\2\u0183\u0182\3\2\2\2\u0183\u0184\3\2\2\2\u0184\u0185\3\2\2\2\u0185"+
		"\u0187\5\24\13\2\u0186\u0188\5\u008eH\2\u0187\u0186\3\2\2\2\u0187\u0188"+
		"\3\2\2\2\u0188\u018c\3\2\2\2\u0189\u018b\5\u00c8e\2\u018a\u0189\3\2\2"+
		"\2\u018b\u018e\3\2\2\2\u018c\u018a\3\2\2\2\u018c\u018d\3\2\2\2\u018d\37"+
		"\3\2\2\2\u018e\u018c\3\2\2\2\u018f\u0190\7\4\2\2\u0190\u0191\5\u00f2z"+
		"\2\u0191\u0193\7\65\2\2\u0192\u0194\5\u011a\u008e\2\u0193\u0192\3\2\2"+
		"\2\u0193\u0194\3\2\2\2\u0194\u0196\3\2\2\2\u0195\u0197\5\n\6\2\u0196\u0195"+
		"\3\2\2\2\u0196\u0197\3\2\2\2\u0197\u0199\3\2\2\2\u0198\u019a\5\u0094K"+
		"\2\u0199\u0198\3\2\2\2\u019a\u019b\3\2\2\2\u019b\u0199\3\2\2\2\u019b\u019c"+
		"\3\2\2\2\u019c!\3\2\2\2\u019d\u019e\7\4\2\2\u019e\u019f\5\u00d6l\2\u019f"+
		"\u01a0\7\67\2\2\u01a0\u01a2\5\u00dan\2\u01a1\u01a3\5\u011a\u008e\2\u01a2"+
		"\u01a1\3\2\2\2\u01a2\u01a3\3\2\2\2\u01a3\u01a5\3\2\2\2\u01a4\u01a6\5\n"+
		"\6\2\u01a5\u01a4\3\2\2\2\u01a5\u01a6\3\2\2\2\u01a6\u01a7\3\2\2\2\u01a7"+
		"\u01a9\5\16\b\2\u01a8\u01aa\5\u0094K\2\u01a9\u01a8\3\2\2\2\u01aa\u01ab"+
		"\3\2\2\2\u01ab\u01a9\3\2\2\2\u01ab\u01ac\3\2\2\2\u01ac#\3\2\2\2\u01ad"+
		"\u01ae\7\7\2\2\u01ae\u01b0\5\u00dep\2\u01af\u01b1\5\u011a\u008e\2\u01b0"+
		"\u01af\3\2\2\2\u01b0\u01b1\3\2\2\2\u01b1\u01b3\3\2\2\2\u01b2\u01b4\5\n"+
		"\6\2\u01b3\u01b2\3\2\2\2\u01b3\u01b4\3\2\2\2\u01b4\u01b5\3\2\2\2\u01b5"+
		"\u01b7\5\16\b\2\u01b6\u01b8\5\u0094K\2\u01b7\u01b6\3\2\2\2\u01b8\u01b9"+
		"\3\2\2\2\u01b9\u01b7\3\2\2\2\u01b9\u01ba\3\2\2\2\u01ba%\3\2\2\2\u01bb"+
		"\u01bc\7\20\2\2\u01bc\u01be\5\u00e0q\2\u01bd\u01bf\5\u011a\u008e\2\u01be"+
		"\u01bd\3\2\2\2\u01be\u01bf\3\2\2\2\u01bf\u01c1\3\2\2\2\u01c0\u01c2\5\n"+
		"\6\2\u01c1\u01c0\3\2\2\2\u01c1\u01c2\3\2\2\2\u01c2\u01c3\3\2\2\2\u01c3"+
		"\u01c4\5\16\b\2\u01c4\u01c5\5r:\2\u01c5\u01c7\5t;\2\u01c6\u01c8\5l\67"+
		"\2\u01c7\u01c6\3\2\2\2\u01c7\u01c8\3\2\2\2\u01c8\u01ca\3\2\2\2\u01c9\u01cb"+
		"\5n8\2\u01ca\u01c9\3\2\2\2\u01ca\u01cb\3\2\2\2\u01cb\'\3\2\2\2\u01cc\u01cd"+
		"\7\21\2\2\u01cd\u01cf\5\u00e2r\2\u01ce\u01d0\5\u011a\u008e\2\u01cf\u01ce"+
		"\3\2\2\2\u01cf\u01d0\3\2\2\2\u01d0\u01d2\3\2\2\2\u01d1\u01d3\5\n\6\2\u01d2"+
		"\u01d1\3\2\2\2\u01d2\u01d3\3\2\2\2\u01d3\u01d4\3\2\2\2\u01d4\u01d6\5\16"+
		"\b\2\u01d5\u01d7\5d\63\2\u01d6\u01d5\3\2\2\2\u01d6\u01d7\3\2\2\2\u01d7"+
		"\u01d9\3\2\2\2\u01d8\u01da\5f\64\2\u01d9\u01d8\3\2\2\2\u01d9\u01da\3\2"+
		"\2\2\u01da)\3\2\2\2\u01db\u01dc\7\22\2\2\u01dc\u01de\5\u00e6t\2\u01dd"+
		"\u01df\5\u011a\u008e\2\u01de\u01dd\3\2\2\2\u01de\u01df\3\2\2\2\u01df\u01e1"+
		"\3\2\2\2\u01e0\u01e2\5\n\6\2\u01e1\u01e0\3\2\2\2\u01e1\u01e2\3\2\2\2\u01e2"+
		"\u01e3\3\2\2\2\u01e3\u01e5\5\16\b\2\u01e4\u01e6\5d\63\2\u01e5\u01e4\3"+
		"\2\2\2\u01e5\u01e6\3\2\2\2\u01e6\u01e8\3\2\2\2\u01e7\u01e9\5f\64\2\u01e8"+
		"\u01e7\3\2\2\2\u01e8\u01e9\3\2\2\2\u01e9+\3\2\2\2\u01ea\u01eb\7\23\2\2"+
		"\u01eb\u01ed\5\u00e8u\2\u01ec\u01ee\5\u011a\u008e\2\u01ed\u01ec\3\2\2"+
		"\2\u01ed\u01ee\3\2\2\2\u01ee\u01f0\3\2\2\2\u01ef\u01f1\5\n\6\2\u01f0\u01ef"+
		"\3\2\2\2\u01f0\u01f1\3\2\2\2\u01f1\u01f2\3\2\2\2\u01f2\u01f4\5\16\b\2"+
		"\u01f3\u01f5\5\u0090I\2\u01f4\u01f3\3\2\2\2\u01f4\u01f5\3\2\2\2\u01f5"+
		"\u01f6\3\2\2\2\u01f6\u01f7\5\u0092J\2\u01f7-\3\2\2\2\u01f8\u01f9\7\b\2"+
		"\2\u01f9\u01fb\5\u00e4s\2\u01fa\u01fc\5\u011a\u008e\2\u01fb\u01fa\3\2"+
		"\2\2\u01fb\u01fc\3\2\2\2\u01fc\u01fe\3\2\2\2\u01fd\u01ff\5\n\6\2\u01fe"+
		"\u01fd\3\2\2\2\u01fe\u01ff\3\2\2\2\u01ff\u0200\3\2\2\2\u0200\u0202\5\16"+
		"\b\2\u0201\u0203\5\u0094K\2\u0202\u0201\3\2\2\2\u0203\u0204\3\2\2\2\u0204"+
		"\u0202\3\2\2\2\u0204\u0205\3\2\2\2\u0205/\3\2\2\2\u0206\u0207\7\b\2\2"+
		"\u0207\u0208\5\u00f2z\2\u0208\u020a\7\65\2\2\u0209\u020b\5\u011a\u008e"+
		"\2\u020a\u0209\3\2\2\2\u020a\u020b\3\2\2\2\u020b\u020d\3\2\2\2\u020c\u020e"+
		"\5\n\6\2\u020d\u020c\3\2\2\2\u020d\u020e\3\2\2\2\u020e\u0210\3\2\2\2\u020f"+
		"\u0211\5\u0094K\2\u0210\u020f\3\2\2\2\u0211\u0212\3\2\2\2\u0212\u0210"+
		"\3\2\2\2\u0212\u0213\3\2\2\2\u0213\61\3\2\2\2\u0214\u0215\7\b\2\2\u0215"+
		"\u0216\5\u00e4s\2\u0216\u0217\7\67\2\2\u0217\u0219\5\u00dan\2\u0218\u021a"+
		"\5\u011a\u008e\2\u0219\u0218\3\2\2\2\u0219\u021a\3\2\2\2\u021a\u021c\3"+
		"\2\2\2\u021b\u021d\5\n\6\2\u021c\u021b\3\2\2\2\u021c\u021d\3\2\2\2\u021d"+
		"\u021e\3\2\2\2\u021e\u0220\5\16\b\2\u021f\u0221\5\u0094K\2\u0220\u021f"+
		"\3\2\2\2\u0221\u0222\3\2\2\2\u0222\u0220\3\2\2\2\u0222\u0223\3\2\2\2\u0223"+
		"\63\3\2\2\2\u0224\u0225\7\t\2\2\u0225\u0227\5\u00eav\2\u0226\u0228\5\u011a"+
		"\u008e\2\u0227\u0226\3\2\2\2\u0227\u0228\3\2\2\2\u0228\u022a\3\2\2\2\u0229"+
		"\u022b\5\n\6\2\u022a\u0229\3\2\2\2\u022a\u022b\3\2\2\2\u022b\u022c\3\2"+
		"\2\2\u022c\u0230\5\16\b\2\u022d\u022f\5\u0094K\2\u022e\u022d\3\2\2\2\u022f"+
		"\u0232\3\2\2\2\u0230\u022e\3\2\2\2\u0230\u0231\3\2\2\2\u0231\u0234\3\2"+
		"\2\2\u0232\u0230\3\2\2\2\u0233\u0235\5\66\34\2\u0234\u0233\3\2\2\2\u0234"+
		"\u0235\3\2\2\2\u0235\65\3\2\2\2\u0236\u0239\58\35\2\u0237\u0239\5:\36"+
		"\2\u0238\u0236\3\2\2\2\u0238\u0237\3\2\2\2\u0239\u023a\3\2\2\2\u023a\u023c"+
		"\5\22\n\2\u023b\u023d\5J&\2\u023c\u023b\3\2\2\2\u023d\u023e\3\2\2\2\u023e"+
		"\u023c\3\2\2\2\u023e\u023f\3\2\2\2\u023f\67\3\2\2\2\u0240\u0241\7Q\2\2"+
		"\u02419\3\2\2\2\u0242\u0243\7P\2\2\u0243;\3\2\2\2\u0244\u0245\7\n\2\2"+
		"\u0245\u0247\5\u00ecw\2\u0246\u0248\5\u011a\u008e\2\u0247\u0246\3\2\2"+
		"\2\u0247\u0248\3\2\2\2\u0248\u024a\3\2\2\2\u0249\u024b\5\n\6\2\u024a\u0249"+
		"\3\2\2\2\u024a\u024b\3\2\2\2\u024b\u024c\3\2\2\2\u024c\u024e\5\16\b\2"+
		"\u024d\u024f\5> \2\u024e\u024d\3\2\2\2\u024f\u0250\3\2\2\2\u0250\u024e"+
		"\3\2\2\2\u0250\u0251\3\2\2\2\u0251\u0253\3\2\2\2\u0252\u0254\5@!\2\u0253"+
		"\u0252\3\2\2\2\u0253\u0254\3\2\2\2\u0254=\3\2\2\2\u0255\u0259\t\4\2\2"+
		"\u0256\u0257\5\u00dco\2\u0257\u0258\7_\2\2\u0258\u025a\3\2\2\2\u0259\u0256"+
		"\3\2\2\2\u0259\u025a\3\2\2\2\u025a\u025b\3\2\2\2\u025b\u025d\5\u00fc\177"+
		"\2\u025c\u025e\5\u011a\u008e\2\u025d\u025c\3\2\2\2\u025d\u025e\3\2\2\2"+
		"\u025e?\3\2\2\2\u025f\u0260\7W\2\2\u0260\u0261\7[\2\2\u0261A\3\2\2\2\u0262"+
		"\u0263\7\13\2\2\u0263\u0265\5\u00eex\2\u0264\u0266\5\u011a\u008e\2\u0265"+
		"\u0264\3\2\2\2\u0265\u0266\3\2\2\2\u0266\u0268\3\2\2\2\u0267\u0269\5\n"+
		"\6\2\u0268\u0267\3\2\2\2\u0268\u0269\3\2\2\2\u0269\u026a\3\2\2\2\u026a"+
		"\u026c\5\16\b\2\u026b\u026d\5\30\r\2\u026c\u026b\3\2\2\2\u026c\u026d\3"+
		"\2\2\2\u026d\u026f\3\2\2\2\u026e\u0270\5\u0094K\2\u026f\u026e\3\2\2\2"+
		"\u0270\u0271\3\2\2\2\u0271\u026f\3\2\2\2\u0271\u0272\3\2\2\2\u0272C\3"+
		"\2\2\2\u0273\u0274\7\13\2\2\u0274\u0275\5\u00f2z\2\u0275\u0277\7\65\2"+
		"\2\u0276\u0278\5\u011a\u008e\2\u0277\u0276\3\2\2\2\u0277\u0278\3\2\2\2"+
		"\u0278\u027a\3\2\2\2\u0279\u027b\5\n\6\2\u027a\u0279\3\2\2\2\u027a\u027b"+
		"\3\2\2\2\u027b\u027d\3\2\2\2\u027c\u027e\5\u0094K\2\u027d\u027c\3\2\2"+
		"\2\u027e\u027f\3\2\2\2\u027f\u027d\3\2\2\2\u027f\u0280\3\2\2\2\u0280E"+
		"\3\2\2\2\u0281\u0282\7\13\2\2\u0282\u0283\5\u00eex\2\u0283\u0284\7\67"+
		"\2\2\u0284\u0286\5\u00dan\2\u0285\u0287\5\u011a\u008e\2\u0286\u0285\3"+
		"\2\2\2\u0286\u0287\3\2\2\2\u0287\u0289\3\2\2\2\u0288\u028a\5\n\6\2\u0289"+
		"\u0288\3\2\2\2\u0289\u028a\3\2\2\2\u028a\u028b\3\2\2\2\u028b\u028d\5\16"+
		"\b\2\u028c\u028e\5\u0094K\2\u028d\u028c\3\2\2\2\u028e\u028f\3\2\2\2\u028f"+
		"\u028d\3\2\2\2\u028f\u0290\3\2\2\2\u0290G\3\2\2\2\u0291\u0292\7\f\2\2"+
		"\u0292\u0294\5\u00f0y\2\u0293\u0295\5\u011a\u008e\2\u0294\u0293\3\2\2"+
		"\2\u0294\u0295\3\2\2\2\u0295\u0297\3\2\2\2\u0296\u0298\5\n\6\2\u0297\u0296"+
		"\3\2\2\2\u0297\u0298\3\2\2\2\u0298\u0299\3\2\2\2\u0299\u029b\5\16\b\2"+
		"\u029a\u029c\5J&\2\u029b\u029a\3\2\2\2\u029c\u029d\3\2\2\2\u029d\u029b"+
		"\3\2\2\2\u029d\u029e\3\2\2\2\u029eI\3\2\2\2\u029f\u02a0\7\'\2\2\u02a0"+
		"\u02a2\5L\'\2\u02a1\u02a3\5\u011a\u008e\2\u02a2\u02a1\3\2\2\2\u02a2\u02a3"+
		"\3\2\2\2\u02a3\u02a5\3\2\2\2\u02a4\u02a6\5\20\t\2\u02a5\u02a4\3\2\2\2"+
		"\u02a5\u02a6\3\2\2\2\u02a6K\3\2\2\2\u02a7\u02a8\7[\2\2\u02a8M\3\2\2\2"+
		"\u02a9\u02aa\7\17\2\2\u02aa\u02ac\5\u00f6|\2\u02ab\u02ad\5\u011a\u008e"+
		"\2\u02ac\u02ab\3\2\2\2\u02ac\u02ad\3\2\2\2\u02ad\u02af\3\2\2\2\u02ae\u02b0"+
		"\5\n\6\2\u02af\u02ae\3\2\2\2\u02af\u02b0\3\2\2\2\u02b0\u02b1\3\2\2\2\u02b1"+
		"\u02b3\5\16\b\2\u02b2\u02b4\5\u0094K\2\u02b3\u02b2\3\2\2\2\u02b4\u02b5"+
		"\3\2\2\2\u02b5\u02b3\3\2\2\2\u02b5\u02b6\3\2\2\2\u02b6O\3\2\2\2\u02b7"+
		"\u02b8\7\16\2\2\u02b8\u02ba\5\u00f8}\2\u02b9\u02bb\5\u011a\u008e\2\u02ba"+
		"\u02b9\3\2\2\2\u02ba\u02bb\3\2\2\2\u02bb\u02bd\3\2\2\2\u02bc\u02be\5\n"+
		"\6\2\u02bd\u02bc\3\2\2\2\u02bd\u02be\3\2\2\2\u02be\u02bf\3\2\2\2\u02bf"+
		"\u02c1\5\16\b\2\u02c0\u02c2\5R*\2\u02c1\u02c0\3\2\2\2\u02c1\u02c2\3\2"+
		"\2\2\u02c2\u02c4\3\2\2\2\u02c3\u02c5\5T+\2\u02c4\u02c3\3\2\2\2\u02c4\u02c5"+
		"\3\2\2\2\u02c5\u02c6\3\2\2\2\u02c6\u02c7\5V,\2\u02c7Q\3\2\2\2\u02c8\u02c9"+
		"\7U\2\2\u02c9\u02ca\7[\2\2\u02caS\3\2\2\2\u02cb\u02cc\7V\2\2\u02cc\u02cd"+
		"\7[\2\2\u02cdU\3\2\2\2\u02ce\u02d0\5Z.\2\u02cf\u02ce\3\2\2\2\u02d0\u02d3"+
		"\3\2\2\2\u02d1\u02cf\3\2\2\2\u02d1\u02d2\3\2\2\2\u02d2\u02d4\3\2\2\2\u02d3"+
		"\u02d1\3\2\2\2\u02d4\u02d9\5X-\2\u02d5\u02d8\5X-\2\u02d6\u02d8\5Z.\2\u02d7"+
		"\u02d5\3\2\2\2\u02d7\u02d6\3\2\2\2\u02d8\u02db\3\2\2\2\u02d9\u02d7\3\2"+
		"\2\2\u02d9\u02da\3\2\2\2\u02daW\3\2\2\2\u02db\u02d9\3\2\2\2\u02dc\u02e0"+
		"\t\5\2\2\u02dd\u02de\5\u00dco\2\u02de\u02df\7_\2\2\u02df\u02e1\3\2\2\2"+
		"\u02e0\u02dd\3\2\2\2\u02e0\u02e1\3\2\2\2\u02e1\u02e2\3\2\2\2\u02e2\u02e4"+
		"\5\u0100\u0081\2\u02e3\u02e5\5\u011a\u008e\2\u02e4\u02e3\3\2\2\2\u02e4"+
		"\u02e5\3\2\2\2\u02e5Y\3\2\2\2\u02e6\u02ea\t\6\2\2\u02e7\u02e8\5\u00dc"+
		"o\2\u02e8\u02e9\7_\2\2\u02e9\u02eb\3\2\2\2\u02ea\u02e7\3\2\2\2\u02ea\u02eb"+
		"\3\2\2\2\u02eb\u02ec\3\2\2\2\u02ec\u02ee\5\u0100\u0081\2\u02ed\u02ef\5"+
		"\u011a\u008e\2\u02ee\u02ed\3\2\2\2\u02ee\u02ef\3\2\2\2\u02ef[\3\2\2\2"+
		"\u02f0\u02f1\7\16\2\2\u02f1\u02f2\5\u00f2z\2\u02f2\u02f4\7\65\2\2\u02f3"+
		"\u02f5\5\u011a\u008e\2\u02f4\u02f3\3\2\2\2\u02f4\u02f5\3\2\2\2\u02f5\u02f7"+
		"\3\2\2\2\u02f6\u02f8\5\n\6\2\u02f7\u02f6\3\2\2\2\u02f7\u02f8\3\2\2\2\u02f8"+
		"\u02f9\3\2\2\2\u02f9\u02fa\5^\60\2\u02fa]\3\2\2\2\u02fb\u02fe\5X-\2\u02fc"+
		"\u02fe\5Z.\2\u02fd\u02fb\3\2\2\2\u02fd\u02fc\3\2\2\2\u02fe\u02ff\3\2\2"+
		"\2\u02ff\u02fd\3\2\2\2\u02ff\u0300\3\2\2\2\u0300_\3\2\2\2\u0301\u0302"+
		"\7\24\2\2\u0302\u0303\5\u0116\u008c\2\u0303\u0304\7L\2\2\u0304\u0306\5"+
		"\u0106\u0084\2\u0305\u0307\5\u011a\u008e\2\u0306\u0305\3\2\2\2\u0306\u0307"+
		"\3\2\2\2\u0307\u0309\3\2\2\2\u0308\u030a\5\n\6\2\u0309\u0308\3\2\2\2\u0309"+
		"\u030a\3\2\2\2\u030a\u030b\3\2\2\2\u030b\u030d\5\16\b\2\u030c\u030e\5"+
		"> \2\u030d\u030c\3\2\2\2\u030e\u030f\3\2\2\2\u030f\u030d\3\2\2\2\u030f"+
		"\u0310\3\2\2\2\u0310\u0313\3\2\2\2\u0311\u0312\7M\2\2\u0312\u0314\5b\62"+
		"\2\u0313\u0311\3\2\2\2\u0313\u0314\3\2\2\2\u0314a\3\2\2\2\u0315\u0316"+
		"\7Y\2\2\u0316c\3\2\2\2\u0317\u031a\7D\2\2\u0318\u031b\5\u00d0i\2\u0319"+
		"\u031b\7\66\2\2\u031a\u0318\3\2\2\2\u031a\u0319\3\2\2\2\u031be\3\2\2\2"+
		"\u031c\u031f\7E\2\2\u031d\u0320\5\u00d0i\2\u031e\u0320\7\66\2\2\u031f"+
		"\u031d\3\2\2\2\u031f\u031e\3\2\2\2\u0320g\3\2\2\2\u0321\u0322\7D\2\2\u0322"+
		"\u0323\5\u00d0i\2\u0323i\3\2\2\2\u0324\u0325\7E\2\2\u0325\u0326\5\u00d0"+
		"i\2\u0326k\3\2\2\2\u0327\u0328\7D\2\2\u0328\u0329\5p9\2\u0329m\3\2\2\2"+
		"\u032a\u032b\7E\2\2\u032b\u032c\5p9\2\u032co\3\2\2\2\u032d\u0330\7Z\2"+
		"\2\u032e\u0330\5\u00d0i\2\u032f\u032d\3\2\2\2\u032f\u032e\3\2\2\2\u0330"+
		"q\3\2\2\2\u0331\u0332\7N\2\2\u0332\u0333\7Y\2\2\u0333s\3\2\2\2\u0334\u0335"+
		"\7:\2\2\u0335\u0336\7Y\2\2\u0336u\3\2\2\2\u0337\u0338\7\33\2\2\u0338w"+
		"\3\2\2\2\u0339\u0340\5z>\2\u033a\u0340\5|?\2\u033b\u0340\5~@\2\u033c\u0340"+
		"\5\u0080A\2\u033d\u0340\5\u0082B\2\u033e\u0340\5\u0088E\2\u033f\u0339"+
		"\3\2\2\2\u033f\u033a\3\2\2\2\u033f\u033b\3\2\2\2\u033f\u033c\3\2\2\2\u033f"+
		"\u033d\3\2\2\2\u033f\u033e\3\2\2\2\u0340y\3\2\2\2\u0341\u0342\7;\2\2\u0342"+
		"{\3\2\2\2\u0343\u0344\7<\2\2\u0344\u0345\5\u00d8m\2\u0345}\3\2\2\2\u0346"+
		"\u0347\7H\2\2\u0347\177\3\2\2\2\u0348\u0349\7F\2\2\u0349\u0081\3\2\2\2"+
		"\u034a\u034d\5\u0084C\2\u034b\u034d\5\u0086D\2\u034c\u034a\3\2\2\2\u034c"+
		"\u034b\3\2\2\2\u034d\u0083\3\2\2\2\u034e\u034f\7I\2\2\u034f\u0085\3\2"+
		"\2\2\u0350\u0351\7G\2\2\u0351\u0087\3\2\2\2\u0352\u0353\7>\2\2\u0353\u0089"+
		"\3\2\2\2\u0354\u0356\5\f\7\2\u0355\u0354\3\2\2\2\u0355\u0356\3\2\2\2\u0356"+
		"\u0357\3\2\2\2\u0357\u0358\5\24\13\2\u0358\u035a\5x=\2\u0359\u035b\5\u008e"+
		"H\2\u035a\u0359\3\2\2\2\u035a\u035b\3\2\2\2\u035b\u035d\3\2\2\2\u035c"+
		"\u035e\5\u008cG\2\u035d\u035c\3\2\2\2\u035d\u035e\3\2\2\2\u035e\u008b"+
		"\3\2\2\2\u035f\u0360\7=\2\2\u0360\u008d\3\2\2\2\u0361\u0362\7J\2\2\u0362"+
		"\u0365\5\u010c\u0087\2\u0363\u0364\7K\2\2\u0364\u0366\5\u0112\u008a\2"+
		"\u0365\u0363\3\2\2\2\u0365\u0366\3\2\2\2\u0366\u008f\3\2\2\2\u0367\u0368"+
		"\7B\2\2\u0368\u0369\7Y\2\2\u0369\u0091\3\2\2\2\u036a\u036b\7C\2\2\u036b"+
		"\u036c\7Y\2\2\u036c\u0093\3\2\2\2\u036d\u0385\5\u00b0Y\2\u036e\u0385\5"+
		"\u0096L\2\u036f\u0385\5\u00aaV\2\u0370\u0385\5\u00a6T\2\u0371\u0385\5"+
		"\u0098M\2\u0372\u0385\5\u009aN\2\u0373\u0385\5\u009cO\2\u0374\u0385\5"+
		"\u009eP\2\u0375\u0385\5\u00a0Q\2\u0376\u0385\5\u00b2Z\2\u0377\u0385\5"+
		"\u00a2R\2\u0378\u0385\5\u00a4S\2\u0379\u0385\5\u00a8U\2\u037a\u0385\5"+
		"\u00acW\2\u037b\u0385\5\u00aeX\2\u037c\u0385\5\u00b4[\2\u037d\u0385\5"+
		"\u00b6\\\2\u037e\u0385\5\u00b8]\2\u037f\u0385\5\u00ba^\2\u0380\u0385\5"+
		"\u00bc_\2\u0381\u0385\5\u00be`\2\u0382\u0385\5\u00c0a\2\u0383\u0385\5"+
		"\u00c2b\2\u0384\u036d\3\2\2\2\u0384\u036e\3\2\2\2\u0384\u036f\3\2\2\2"+
		"\u0384\u0370\3\2\2\2\u0384\u0371\3\2\2\2\u0384\u0372\3\2\2\2\u0384\u0373"+
		"\3\2\2\2\u0384\u0374\3\2\2\2\u0384\u0375\3\2\2\2\u0384\u0376\3\2\2\2\u0384"+
		"\u0377\3\2\2\2\u0384\u0378\3\2\2\2\u0384\u0379\3\2\2\2\u0384\u037a\3\2"+
		"\2\2\u0384\u037b\3\2\2\2\u0384\u037c\3\2\2\2\u0384\u037d\3\2\2\2\u0384"+
		"\u037e\3\2\2\2\u0384\u037f\3\2\2\2\u0384\u0380\3\2\2\2\u0384\u0381\3\2"+
		"\2\2\u0384\u0382\3\2\2\2\u0384\u0383\3\2\2\2\u0385\u0095\3\2\2\2\u0386"+
		"\u0387\7\30\2\2\u0387\u0389\5\u0114\u008b\2\u0388\u038a\5\u011a\u008e"+
		"\2\u0389\u0388\3\2\2\2\u0389\u038a\3\2\2\2\u038a\u038b\3\2\2\2\u038b\u038c"+
		"\5\u008aF\2\u038c\u0097\3\2\2\2\u038d\u038e\7\34\2\2\u038e\u0390\5\u0114"+
		"\u008b\2\u038f\u0391\5\u011a\u008e\2\u0390\u038f\3\2\2\2\u0390\u0391\3"+
		"\2\2\2\u0391\u0392\3\2\2\2\u0392\u0393\5\u008aF\2\u0393\u0099\3\2\2\2"+
		"\u0394\u0395\7\35\2\2\u0395\u0397\5\u0114\u008b\2\u0396\u0398\5\u011a"+
		"\u008e\2\u0397\u0396\3\2\2\2\u0397\u0398\3\2\2\2\u0398\u0399\3\2\2\2\u0399"+
		"\u039a\5\u008aF\2\u039a\u009b\3\2\2\2\u039b\u039c\7\36\2\2\u039c\u039e"+
		"\5\u0114\u008b\2\u039d\u039f\5\u011a\u008e\2\u039e\u039d\3\2\2\2\u039e"+
		"\u039f\3\2\2\2\u039f\u03a0\3\2\2\2\u03a0\u03a1\5\u008aF\2\u03a1\u009d"+
		"\3\2\2\2\u03a2\u03a3\7\37\2\2\u03a3\u03a5\5\u0114\u008b\2\u03a4\u03a6"+
		"\5\u011a\u008e\2\u03a5\u03a4\3\2\2\2\u03a5\u03a6\3\2\2\2\u03a6\u03a7\3"+
		"\2\2\2\u03a7\u03a8\5\u008aF\2\u03a8\u03a9\5r:\2\u03a9\u03ab\5t;\2\u03aa"+
		"\u03ac\5l\67\2\u03ab\u03aa\3\2\2\2\u03ab\u03ac\3\2\2\2\u03ac\u03ae\3\2"+
		"\2\2\u03ad\u03af\5n8\2\u03ae\u03ad\3\2\2\2\u03ae\u03af\3\2\2\2\u03af\u009f"+
		"\3\2\2\2\u03b0\u03b1\7 \2\2\u03b1\u03b3\5\u0108\u0085\2\u03b2\u03b4\5"+
		"\u011a\u008e\2\u03b3\u03b2\3\2\2\2\u03b3\u03b4\3\2\2\2\u03b4\u03b5\3\2"+
		"\2\2\u03b5\u03b6\5\u008aF\2\u03b6\u00a1\3\2\2\2\u03b7\u03b8\7$\2\2\u03b8"+
		"\u03ba\5\u0114\u008b\2\u03b9\u03bb\5\u011a\u008e\2\u03ba\u03b9\3\2\2\2"+
		"\u03ba\u03bb\3\2\2\2\u03bb\u03bc\3\2\2\2\u03bc\u03bd\5\u008aF\2\u03bd"+
		"\u00a3\3\2\2\2\u03be\u03bf\7&\2\2\u03bf\u03c1\5\u0108\u0085\2\u03c0\u03c2"+
		"\5\u011a\u008e\2\u03c1\u03c0\3\2\2\2\u03c1\u03c2\3\2\2\2\u03c2\u03c3\3"+
		"\2\2\2\u03c3\u03c4\5\u008aF\2\u03c4\u00a5\3\2\2\2\u03c5\u03c8\7\32\2\2"+
		"\u03c6\u03c8\5v<\2\u03c7\u03c5\3\2\2\2\u03c7\u03c6\3\2\2\2\u03c8\u03c9"+
		"\3\2\2\2\u03c9\u03cb\5\u0108\u0085\2\u03ca\u03cc\5\u011a\u008e\2\u03cb"+
		"\u03ca\3\2\2\2\u03cb\u03cc\3\2\2\2\u03cc\u03cd\3\2\2\2\u03cd\u03d1\5\u008a"+
		"F\2\u03ce\u03d0\5\u00c8e\2\u03cf\u03ce\3\2\2\2\u03d0\u03d3\3\2\2\2\u03d1"+
		"\u03cf\3\2\2\2\u03d1\u03d2\3\2\2\2\u03d2\u00a7\3\2\2\2\u03d3\u03d1\3\2"+
		"\2\2\u03d4\u03d5\7(\2\2\u03d5\u03d7\5\u0108\u0085\2\u03d6\u03d8\5\u011a"+
		"\u008e\2\u03d7\u03d6\3\2\2\2\u03d7\u03d8\3\2\2\2\u03d8\u03d9\3\2\2\2\u03d9"+
		"\u03dd\5\u008aF\2\u03da\u03dc\5\u00c8e\2\u03db\u03da\3\2\2\2\u03dc\u03df"+
		"\3\2\2\2\u03dd\u03db\3\2\2\2\u03dd\u03de\3\2\2\2\u03de\u00a9\3\2\2\2\u03df"+
		"\u03dd\3\2\2\2\u03e0\u03e1\7\31\2\2\u03e1\u03e3\5\u0108\u0085\2\u03e2"+
		"\u03e4\5\u011a\u008e\2\u03e3\u03e2\3\2\2\2\u03e3\u03e4\3\2\2\2\u03e4\u03e5"+
		"\3\2\2\2\u03e5\u03e9\5\u008aF\2\u03e6\u03e8\5\u00c8e\2\u03e7\u03e6\3\2"+
		"\2\2\u03e8\u03eb\3\2\2\2\u03e9\u03e7\3\2\2\2\u03e9\u03ea\3\2\2\2\u03ea"+
		"\u00ab\3\2\2\2\u03eb\u03e9\3\2\2\2\u03ec\u03ed\7)\2\2\u03ed\u03ef\5\u0114"+
		"\u008b\2\u03ee\u03f0\5\u011a\u008e\2\u03ef\u03ee\3\2\2\2\u03ef\u03f0\3"+
		"\2\2\2\u03f0\u03f1\3\2\2\2\u03f1\u03f3\5\u008aF\2\u03f2\u03f4\5d\63\2"+
		"\u03f3\u03f2\3\2\2\2\u03f3\u03f4\3\2\2\2\u03f4\u03f6\3\2\2\2\u03f5\u03f7"+
		"\5f\64\2\u03f6\u03f5\3\2\2\2\u03f6\u03f7\3\2\2\2\u03f7\u00ad\3\2\2\2\u03f8"+
		"\u03f9\7*\2\2\u03f9\u03fb\5\u0114\u008b\2\u03fa\u03fc\5\u011a\u008e\2"+
		"\u03fb\u03fa\3\2\2\2\u03fb\u03fc\3\2\2\2\u03fc\u03fd\3\2\2\2\u03fd\u03fe"+
		"\5\u008aF\2\u03fe\u00af\3\2\2\2\u03ff\u0400\7\26\2\2\u0400\u0402\5\u0108"+
		"\u0085\2\u0401\u0403\5\u011a\u008e\2\u0402\u0401\3\2\2\2\u0402\u0403\3"+
		"\2\2\2\u0403\u0404\3\2\2\2\u0404\u0406\5\u008aF\2\u0405\u0407\5\u00c6"+
		"d\2\u0406\u0405\3\2\2\2\u0406\u0407\3\2\2\2\u0407\u0409\3\2\2\2\u0408"+
		"\u040a\5\u00c4c\2\u0409\u0408\3\2\2\2\u0409\u040a\3\2\2\2\u040a\u040e"+
		"\3\2\2\2\u040b\u040d\5\u00c8e\2\u040c\u040b\3\2\2\2\u040d\u0410\3\2\2"+
		"\2\u040e\u040c\3\2\2\2\u040e\u040f\3\2\2\2\u040f\u00b1\3\2\2\2\u0410\u040e"+
		"\3\2\2\2\u0411\u0412\7!\2\2\u0412\u0414\5\u0108\u0085\2\u0413\u0415\5"+
		"\u011a\u008e\2\u0414\u0413\3\2\2\2\u0414\u0415\3\2\2\2\u0415\u0416\3\2"+
		"\2\2\u0416\u0418\5\u008aF\2\u0417\u0419\5\u00c6d\2\u0418\u0417\3\2\2\2"+
		"\u0418\u0419\3\2\2\2\u0419\u041b\3\2\2\2\u041a\u041c\5\u00c4c\2\u041b"+
		"\u041a\3\2\2\2\u041b\u041c\3\2\2\2\u041c\u0420\3\2\2\2\u041d\u041f\5\u00c8"+
		"e\2\u041e\u041d\3\2\2\2\u041f\u0422\3\2\2\2\u0420\u041e\3\2\2\2\u0420"+
		"\u0421\3\2\2\2\u0421\u00b3\3\2\2\2\u0422\u0420\3\2\2\2\u0423\u0424\7,"+
		"\2\2\u0424\u0427\5\u0110\u0089\2\u0425\u0426\7\60\2\2\u0426\u0428\5\u010e"+
		"\u0088\2\u0427\u0425\3\2\2\2\u0427\u0428\3\2\2\2\u0428\u042a\3\2\2\2\u0429"+
		"\u042b\5\u011a\u008e\2\u042a\u0429\3\2\2\2\u042a\u042b\3\2\2\2\u042b\u042c"+
		"\3\2\2\2\u042c\u0430\5\u008aF\2\u042d\u042f\5\u00c8e\2\u042e\u042d\3\2"+
		"\2\2\u042f\u0432\3\2\2\2\u0430\u042e\3\2\2\2\u0430\u0431\3\2\2\2\u0431"+
		"\u00b5\3\2\2\2\u0432\u0430\3\2\2\2\u0433\u0434\7-\2\2\u0434\u0437\5\u0110"+
		"\u0089\2\u0435\u0436\7\60\2\2\u0436\u0438\5\u010e\u0088\2\u0437\u0435"+
		"\3\2\2\2\u0437\u0438\3\2\2\2\u0438\u043a\3\2\2\2\u0439\u043b\5\u011a\u008e"+
		"\2\u043a\u0439\3\2\2\2\u043a\u043b\3\2\2\2\u043b\u043c\3\2\2\2\u043c\u0440"+
		"\5\u008aF\2\u043d\u043f\5\u00c8e\2\u043e\u043d\3\2\2\2\u043f\u0442\3\2"+
		"\2\2\u0440\u043e\3\2\2\2\u0440\u0441\3\2\2\2\u0441\u00b7\3\2\2\2\u0442"+
		"\u0440\3\2\2\2\u0443\u0444\7.\2\2\u0444\u0447\5\u0110\u0089\2\u0445\u0446"+
		"\7\60\2\2\u0446\u0448\5\u010e\u0088\2\u0447\u0445\3\2\2\2\u0447\u0448"+
		"\3\2\2\2\u0448\u044a\3\2\2\2\u0449\u044b\5\u011a\u008e\2\u044a\u0449\3"+
		"\2\2\2\u044a\u044b\3\2\2\2\u044b\u044c\3\2\2\2\u044c\u0450\5\u008aF\2"+
		"\u044d\u044f\5\u00c8e\2\u044e\u044d\3\2\2\2\u044f\u0452\3\2\2\2\u0450"+
		"\u044e\3\2\2\2\u0450\u0451\3\2\2\2\u0451\u00b9\3\2\2\2\u0452\u0450\3\2"+
		"\2\2\u0453\u0454\7/\2\2\u0454\u0457\5\u0110\u0089\2\u0455\u0456\7\60\2"+
		"\2\u0456\u0458\5\u010e\u0088\2\u0457\u0455\3\2\2\2\u0457\u0458\3\2\2\2"+
		"\u0458\u045a\3\2\2\2\u0459\u045b\5\u011a\u008e\2\u045a\u0459\3\2\2\2\u045a"+
		"\u045b\3\2\2\2\u045b\u045c\3\2\2\2\u045c\u0460\5\u008aF\2\u045d\u045f"+
		"\5\u00c8e\2\u045e\u045d\3\2\2\2\u045f\u0462\3\2\2\2\u0460\u045e\3\2\2"+
		"\2\u0460\u0461\3\2\2\2\u0461\u00bb\3\2\2\2\u0462\u0460\3\2\2\2\u0463\u0464"+
		"\7\61\2\2\u0464\u0466\5\u0114\u008b\2\u0465\u0467\5\u011a\u008e\2\u0466"+
		"\u0465\3\2\2\2\u0466\u0467\3\2\2\2\u0467\u0468\3\2\2\2\u0468\u046a\5\u008a"+
		"F\2\u0469\u046b\5h\65\2\u046a\u0469\3\2\2\2\u046a\u046b\3\2\2\2\u046b"+
		"\u046d\3\2\2\2\u046c\u046e\5j\66\2\u046d\u046c\3\2\2\2\u046d\u046e\3\2"+
		"\2\2\u046e\u00bd\3\2\2\2\u046f\u0470\7\62\2\2\u0470\u0472\5\u0114\u008b"+
		"\2\u0471\u0473\5\u011a\u008e\2\u0472\u0471\3\2\2\2\u0472\u0473\3\2\2\2"+
		"\u0473\u0474\3\2\2\2\u0474\u0476\5\u008aF\2\u0475\u0477\5\u0090I\2\u0476"+
		"\u0475\3\2\2\2\u0476\u0477\3\2\2\2\u0477\u0478\3\2\2\2\u0478\u0479\5\u0092"+
		"J\2\u0479\u00bf\3\2\2\2\u047a\u047b\7\63\2\2\u047b\u047d\5\u0114\u008b"+
		"\2\u047c\u047e\5\u011a\u008e\2\u047d\u047c\3\2\2\2\u047d\u047e\3\2\2\2"+
		"\u047e\u047f\3\2\2\2\u047f\u0480\5\u008aF\2\u0480\u00c1\3\2\2\2\u0481"+
		"\u0482\7\64\2\2\u0482\u0484\5\u0114\u008b\2\u0483\u0485\5\u011a\u008e"+
		"\2\u0484\u0483\3\2\2\2\u0484\u0485\3\2\2\2\u0485\u0486\3\2\2\2\u0486\u0487"+
		"\5\u008aF\2\u0487\u00c3\3\2\2\2\u0488\u0489\7?\2\2\u0489\u00c5\3\2\2\2"+
		"\u048a\u048b\7@\2\2\u048b\u00c7\3\2\2\2\u048c\u048d\7A\2\2\u048d\u048e"+
		"\5\u00caf\2\u048e\u048f\7O\2\2\u048f\u0490\5\u00ccg\2\u0490\u00c9\3\2"+
		"\2\2\u0491\u0492\5\u00ceh\2\u0492\u00cb\3\2\2\2\u0493\u0494\5\u00ceh\2"+
		"\u0494\u00cd\3\2\2\2\u0495\u049a\7X\2\2\u0496\u0497\7_\2\2\u0497\u0499"+
		"\7X\2\2\u0498\u0496\3\2\2\2\u0499\u049c\3\2\2\2\u049a\u0498\3\2\2\2\u049a"+
		"\u049b\3\2\2\2\u049b\u00cf\3\2\2\2\u049c\u049a\3\2\2\2\u049d\u049f\5\u00d2"+
		"j\2\u049e\u049d\3\2\2\2\u049e\u049f\3\2\2\2\u049f\u04a0\3\2\2\2\u04a0"+
		"\u04a1\7Y\2\2\u04a1\u00d1\3\2\2\2\u04a2\u04a3\t\7\2\2\u04a3\u00d3\3\2"+
		"\2\2\u04a4\u04a5\7X\2\2\u04a5\u00d5\3\2\2\2\u04a6\u04a7\7X\2\2\u04a7\u00d7"+
		"\3\2\2\2\u04a8\u04a9\7X\2\2\u04a9\u00d9\3\2\2\2\u04aa\u04ab\5\u00dco\2"+
		"\u04ab\u04ac\7_\2\2\u04ac\u04ae\3\2\2\2\u04ad\u04aa\3\2\2\2\u04ad\u04ae"+
		"\3\2\2\2\u04ae\u04af\3\2\2\2\u04af\u04b0\5\u00fa~\2\u04b0\u00db\3\2\2"+
		"\2\u04b1\u04b2\7X\2\2\u04b2\u00dd\3\2\2\2\u04b3\u04b4\7X\2\2\u04b4\u00df"+
		"\3\2\2\2\u04b5\u04b6\7X\2\2\u04b6\u00e1\3\2\2\2\u04b7\u04b8\7X\2\2\u04b8"+
		"\u00e3\3\2\2\2\u04b9\u04ba\7X\2\2\u04ba\u00e5\3\2\2\2\u04bb\u04bc\7X\2"+
		"\2\u04bc\u00e7\3\2\2\2\u04bd\u04be\7X\2\2\u04be\u00e9\3\2\2\2\u04bf\u04c0"+
		"\7X\2\2\u04c0\u00eb\3\2\2\2\u04c1\u04c2\7X\2\2\u04c2\u00ed\3\2\2\2\u04c3"+
		"\u04c4\7X\2\2\u04c4\u00ef\3\2\2\2\u04c5\u04c6\7X\2\2\u04c6\u00f1\3\2\2"+
		"\2\u04c7\u04c8\5\u00f4{\2\u04c8\u04c9\7_\2\2\u04c9\u04cb\3\2\2\2\u04ca"+
		"\u04c7\3\2\2\2\u04ca\u04cb\3\2\2\2\u04cb\u04cc\3\2\2\2\u04cc\u04cd\5\u00fe"+
		"\u0080\2\u04cd\u00f3\3\2\2\2\u04ce\u04cf\7X\2\2\u04cf\u00f5\3\2\2\2\u04d0"+
		"\u04d1\7X\2\2\u04d1\u00f7\3\2\2\2\u04d2\u04d3\7X\2\2\u04d3\u00f9\3\2\2"+
		"\2\u04d4\u04d5\7X\2\2\u04d5\u00fb\3\2\2\2\u04d6\u04d7\7X\2\2\u04d7\u00fd"+
		"\3\2\2\2\u04d8\u04d9\7X\2\2\u04d9\u00ff\3\2\2\2\u04da\u04db\7X\2\2\u04db"+
		"\u0101\3\2\2\2\u04dc\u04dd\7X\2\2\u04dd\u0103\3\2\2\2\u04de\u04df\7X\2"+
		"\2\u04df\u0105\3\2\2\2\u04e0\u04e1\7X\2\2\u04e1\u0107\3\2\2\2\u04e2\u04e3"+
		"\5\u010a\u0086\2\u04e3\u04e4\7_\2\2\u04e4\u04e6\3\2\2\2\u04e5\u04e2\3"+
		"\2\2\2\u04e5\u04e6\3\2\2\2\u04e6\u04e7\3\2\2\2\u04e7\u04e8\5\u0102\u0082"+
		"\2\u04e8\u0109\3\2\2\2\u04e9\u04ea\7X\2\2\u04ea\u010b\3\2\2\2\u04eb\u04ec"+
		"\7X\2\2\u04ec\u010d\3\2\2\2\u04ed\u04ee\7X\2\2\u04ee\u010f\3\2\2\2\u04ef"+
		"\u04f0\5\u010a\u0086\2\u04f0\u04f1\7_\2\2\u04f1\u04f3\3\2\2\2\u04f2\u04ef"+
		"\3\2\2\2\u04f2\u04f3\3\2\2\2\u04f3\u04f4\3\2\2\2\u04f4\u04f5\5\u0104\u0083"+
		"\2\u04f5\u0111\3\2\2\2\u04f6\u04f7\7X\2\2\u04f7\u0113\3\2\2\2\u04f8\u04f9"+
		"\5\u0102\u0082\2\u04f9\u0115\3\2\2\2\u04fa\u04fb\7X\2\2\u04fb\u0117\3"+
		"\2\2\2\u04fc\u04fd\7X\2\2\u04fd\u0119\3\2\2\2\u04fe\u04ff\7\\\2\2\u04ff"+
		"\u011b\3\2\2\2\u00a2\u011f\u0127\u0143\u015a\u015d\u0163\u016c\u016f\u0173"+
		"\u017a\u0180\u0183\u0187\u018c\u0193\u0196\u019b\u01a2\u01a5\u01ab\u01b0"+
		"\u01b3\u01b9\u01be\u01c1\u01c7\u01ca\u01cf\u01d2\u01d6\u01d9\u01de\u01e1"+
		"\u01e5\u01e8\u01ed\u01f0\u01f4\u01fb\u01fe\u0204\u020a\u020d\u0212\u0219"+
		"\u021c\u0222\u0227\u022a\u0230\u0234\u0238\u023e\u0247\u024a\u0250\u0253"+
		"\u0259\u025d\u0265\u0268\u026c\u0271\u0277\u027a\u027f\u0286\u0289\u028f"+
		"\u0294\u0297\u029d\u02a2\u02a5\u02ac\u02af\u02b5\u02ba\u02bd\u02c1\u02c4"+
		"\u02d1\u02d7\u02d9\u02e0\u02e4\u02ea\u02ee\u02f4\u02f7\u02fd\u02ff\u0306"+
		"\u0309\u030f\u0313\u031a\u031f\u032f\u033f\u034c\u0355\u035a\u035d\u0365"+
		"\u0384\u0389\u0390\u0397\u039e\u03a5\u03ab\u03ae\u03b3\u03ba\u03c1\u03c7"+
		"\u03cb\u03d1\u03d7\u03dd\u03e3\u03e9\u03ef\u03f3\u03f6\u03fb\u0402\u0406"+
		"\u0409\u040e\u0414\u0418\u041b\u0420\u0427\u042a\u0430\u0437\u043a\u0440"+
		"\u0447\u044a\u0450\u0457\u045a\u0460\u0466\u046a\u046d\u0472\u0476\u047d"+
		"\u0484\u049a\u049e\u04ad\u04ca\u04e5\u04f2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}
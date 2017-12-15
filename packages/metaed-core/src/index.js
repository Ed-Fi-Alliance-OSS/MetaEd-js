// @flow

// Functions

export { deepFreeze, deepFreezeAssign, prependIndefiniteArticle, orderByProp } from './Utility';
export { executePipeline } from './task/Pipeline';
export { createMetaEdFile } from './task/MetaEdFile';
export { loadCoreBufferedFiles, loadExtensionBufferedFiles } from './task/BufferFileLoader';
export { loadFiles } from './task/FileSystemFilenameLoader';
export { loadPlugins, scanForPlugins } from './task/LoadPlugins';
export { newState } from './State';
export { newPipelineOptions } from './task/PipelineOptions';
export { loadFileIndex } from './task/LoadFileIndex';
export { buildParseTree } from './task/BuildParseTree';
export { buildMetaEd } from './grammar/ParseTreeBuilder';
export { execute as walkBuilders } from './task/WalkBuilders';
export { execute as runValidators } from './task/RunValidators';
export { execute as runEnhancers } from './task/RunEnhancers';
export { execute as runGenerators } from './task/RunGenerators';
export { fileMapForFailure } from './task/FileMapForFailure';
export { addEntity, getAllEntities, getAllTopLevelEntities, getEntity, getTopLevelCoreEntity, getEntitiesOfType, getAllEntitiesNoSimpleTypes } from './model/EntityRepository';
export { addProperty, getAllProperties, getPropertiesOfType, newPropertyIndex } from './model/property/PropertyRepository';
export { isReferenceProperty, isSharedProperty, allPropertyTypes } from './model/property/PropertyType';
export { allEntityModelTypes, allTopLevelEntityModelTypes, topLevelCoreEntityModelTypes } from './model/ModelType';

// Builders

export { AssociationBuilder } from './builder/AssociationBuilder';
export { AssociationExtensionBuilder } from './builder/AssociationExtensionBuilder';
export { AssociationSubclassBuilder } from './builder/AssociationSubclassBuilder';
export { ChoiceBuilder } from './builder/ChoiceBuilder';
export { CommonBuilder } from './builder/CommonBuilder';
export { CommonExtensionBuilder } from './builder/CommonExtensionBuilder';
export { DecimalTypeBuilder } from './builder/DecimalTypeBuilder';
export { DescriptorBuilder } from './builder/DescriptorBuilder';
export { DomainBuilder } from './builder/DomainBuilder';
export { DomainEntityBuilder } from './builder/DomainEntityBuilder';
export { DomainEntityExtensionBuilder } from './builder/DomainEntityExtensionBuilder';
export { DomainEntitySubclassBuilder } from './builder/DomainEntitySubclassBuilder';
export { EnumerationBuilder } from './builder/EnumerationBuilder';
export { IntegerTypeBuilder } from './builder/IntegerTypeBuilder';
export { InterchangeBuilder } from './builder/InterchangeBuilder';
export { NamespaceInfoBuilder } from './builder/NamespaceInfoBuilder';
export { SharedDecimalBuilder } from './builder/SharedDecimalBuilder';
export { SharedIntegerBuilder } from './builder/SharedIntegerBuilder';
export { SharedStringBuilder } from './builder/SharedStringBuilder';
export { StringTypeBuilder } from './builder/StringTypeBuilder';

// Flow types

export type { State } from './State';
export type { InputDirectory } from './task/FileSystemFilenameLoader';
export type { FileSet, MetaEdFile } from './task/MetaEdFile';
export type { FileIndex } from './task/FileIndex';
export type { PipelineOptions } from './task/PipelineOptions';
export type { Validator } from './validator/Validator';
export type { ValidationFailure } from './validator/ValidationFailure';
export type { Enhancer } from './enhancer/Enhancer';
export type { EnhancerResult } from './enhancer/EnhancerResult';
export type { Generator } from './generator/Generator';
export type { GeneratorResult } from './generator/GeneratorResult';
export type { GeneratedOutput } from './generator/GeneratedOutput';
export type { MetaEdEnvironment, PluginEnvironment, SemVer } from './MetaEdEnvironment';
export type { MetaEdPlugin, PluginManifest } from './plugin/PluginTypes';

// Properties
export type { AssociationProperty, AssociationPropertySourceMap } from './model/property/AssociationProperty';
export type { BooleanProperty, BooleanPropertySourceMap } from './model/property/BooleanProperty';
export type { ChoiceProperty, ChoicePropertySourceMap } from './model/property/ChoiceProperty';
export type { CommonProperty, CommonPropertySourceMap } from './model/property/CommonProperty';
export type { CurrencyProperty, CurrencyPropertySourceMap } from './model/property/CurrencyProperty';
export type { DateProperty, DatePropertySourceMap } from './model/property/DateProperty';
export type { DecimalProperty, DecimalPropertySourceMap } from './model/property/DecimalProperty';
export type { DescriptorProperty, DescriptorPropertySourceMap } from './model/property/DescriptorProperty';
export type { DomainEntityProperty, DomainEntityPropertySourceMap } from './model/property/DomainEntityProperty';
export type { DurationProperty, DurationPropertySourceMap } from './model/property/DurationProperty';
export type { EntityProperty, EntityPropertySourceMap, HasReferencedEntity } from './model/property/EntityProperty';
export type { EnumerationProperty, EnumerationPropertySourceMap } from './model/property/EnumerationProperty';
export type { InlineCommonProperty, InlineCommonPropertySourceMap } from './model/property/InlineCommonProperty';
export type { IntegerProperty, IntegerPropertySourceMap } from './model/property/IntegerProperty';
export type { MergedProperty, MergedPropertySourceMap } from './model/property/MergedProperty';
export type { PercentProperty, PercentPropertySourceMap } from './model/property/PercentProperty';
export type { PropertyIndex } from './model/property/PropertyRepository';
export type { PropertyType } from './model/property/PropertyType';
export type { ReferentialProperty, ReferentialPropertySourceMap } from './model/property/ReferentialProperty';
export type { SchoolYearEnumerationProperty, SchoolYearEnumerationPropertySourceMap } from './model/property/SchoolYearEnumerationProperty';
export type { SharedDecimalProperty } from './model/property/SharedDecimalProperty';
export type { SharedIntegerProperty } from './model/property/SharedIntegerProperty';
export type { SharedShortProperty } from './model/property/SharedShortProperty';
export type { SharedStringProperty } from './model/property/SharedStringProperty';
export type { ShortProperty, ShortPropertySourceMap } from './model/property/ShortProperty';
export type { SimpleProperty, SimplePropertySourceMap } from './model/property/SimpleProperty';
export type { SharedSimple, SharedSimpleSourceMap } from './model/SharedSimple';
export type { StringProperty, StringPropertySourceMap } from './model/property/StringProperty';
export type { TimeProperty, TimePropertySourceMap } from './model/property/TimeProperty';
export type { YearProperty, YearPropertySourceMap } from './model/property/YearProperty';

// Entities
export type { AbstractEntity, AbstractEntitySourceMap } from './model/AbstractEntity';
export type { Association, AssociationSourceMap } from './model/Association';
export type { AssociationExtension, AssociationExtensionSourceMap } from './model/AssociationExtension';
export type { AssociationSubclass, AssociationSubclassSourceMap } from './model/AssociationSubclass';
export type { Choice, ChoiceSourceMap } from './model/Choice';
export type { Common, CommonSourceMap } from './model/Common';
export type { CommonExtension, CommonExtensionSourceMap } from './model/CommonExtension';
export type { DecimalType, DecimalTypeSourceMap } from './model/DecimalType';
export type { Descriptor, DescriptorSourceMap } from './model/Descriptor';
export type { Domain, DomainSourceMap } from './model/Domain';
export type { DomainEntity, DomainEntitySourceMap } from './model/DomainEntity';
export type { DomainEntityExtension, DomainEntityExtensionSourceMap } from './model/DomainEntityExtension';
export type { DomainEntitySubclass, DomainEntitySubclassSourceMap } from './model/DomainEntitySubclass';
export type { DomainItem, DomainItemSourceMap } from './model/DomainItem';
export type { EntityRepository } from './model/EntityRepository';
export type { Enumeration, EnumerationSourceMap } from './model/Enumeration';
export type { EnumerationItem, EnumerationItemSourceMap } from './model/EnumerationItem';
export type { IntegerType, IntegerTypeSourceMap } from './model/IntegerType';
export type { Interchange, InterchangeSourceMap } from './model/Interchange';
export type { InterchangeExtension } from './model/InterchangeExtension';
export type { InterchangeItem, InterchangeItemSourceMap } from './model/InterchangeItem';
export type { MapTypeEnumeration } from './model/MapTypeEnumeration';
export type { ModelBase, ModelBaseSourceMap } from './model/ModelBase';
export type { ModelType } from './model/ModelType';
export type { NamespaceInfo, NamespaceInfoSourceMap } from './model/NamespaceInfo';
export type { SchoolYearEnumeration } from './model/SchoolYearEnumeration';
export type { SharedDecimal, SharedDecimalSourceMap } from './model/SharedDecimal';
export type { SharedInteger, SharedIntegerSourceMap } from './model/SharedInteger';
export type { SharedString, SharedStringSourceMap } from './model/SharedString';
export type { SourceMap } from './model/SourceMap';
export type { StringType, StringTypeSourceMap } from './model/StringType';
export type { Subdomain, SubdomainSourceMap } from './model/Subdomain';
export type { TopLevelEntity, TopLevelEntitySourceMap } from './model/TopLevelEntity';

// Null Objects
export { NoMapTypeEnumeration } from './model/MapTypeEnumeration';
export { NoTopLevelEntity } from './model/TopLevelEntity';
export { NoSharedSimple } from './model/SharedSimple';

// Factories
export { newMetaEdEnvironment, newPluginEnvironment } from './MetaEdEnvironment';
export { newMetaEdPlugin } from './plugin/PluginTypes';

export { asAssociationProperty, newAssociationProperty } from './model/property/AssociationProperty';
export { asBooleanProperty, newBooleanProperty } from './model/property/BooleanProperty';
export { asChoiceProperty, newChoiceProperty } from './model/property/ChoiceProperty';
export { asCommonProperty, newCommonProperty } from './model/property/CommonProperty';
export { asCurrencyProperty, newCurrencyProperty } from './model/property/CurrencyProperty';
export { asDateProperty, newDateProperty } from './model/property/DateProperty';
export { asDecimalProperty, newDecimalProperty } from './model/property/DecimalProperty';
export { asDescriptorProperty, newDescriptorProperty } from './model/property/DescriptorProperty';
export { asDomainEntityProperty, newDomainEntityProperty } from './model/property/DomainEntityProperty';
export { asDurationProperty, newDurationProperty } from './model/property/DurationProperty';
export { asEnumerationProperty, newEnumerationProperty } from './model/property/EnumerationProperty';
export { asInlineCommonProperty, newInlineCommonProperty } from './model/property/InlineCommonProperty';
export { asIntegerProperty, newIntegerProperty } from './model/property/IntegerProperty';
export { asMergedProperty, newMergedProperty } from './model/property/MergedProperty';
export { asPercentProperty, newPercentProperty } from './model/property/PercentProperty';
export { asReferentialProperty, newReferentialProperty, isReferentialProperty } from './model/property/ReferentialProperty';
export { asSchoolYearEnumerationProperty, newSchoolYearEnumerationProperty } from './model/property/SchoolYearEnumerationProperty';
export { asSharedDecimalProperty, newSharedDecimalProperty } from './model/property/SharedDecimalProperty';
export { asSharedIntegerProperty, newSharedIntegerProperty } from './model/property/SharedIntegerProperty';
export { asSharedShortProperty, newSharedShortProperty } from './model/property/SharedShortProperty';
export { asSharedStringProperty, newSharedStringProperty } from './model/property/SharedStringProperty';
export { asShortProperty, newShortProperty } from './model/property/ShortProperty';
export { asSimpleProperty, newSimpleProperty } from './model/property/SimpleProperty';
export { asStringProperty, newStringProperty } from './model/property/StringProperty';
export { asTimeProperty, newTimeProperty } from './model/property/TimeProperty';
export { asYearProperty, newYearProperty } from './model/property/YearProperty';

export { asAbstractEntity, newAbstractEntity } from './model/AbstractEntity';
export { asAssociation, newAssociation } from './model/Association';
export { asAssociationExtension, newAssociationExtension } from './model/AssociationExtension';
export { asAssociationSubclass, newAssociationSubclass } from './model/AssociationSubclass';
export { asChoice, newChoice } from './model/Choice';
export { asCommon, newCommon, asInlineCommon, newInlineCommon } from './model/Common';
export { asCommonExtension, newCommonExtension } from './model/CommonExtension';
export { asDecimalType, newDecimalType } from './model/DecimalType';
export { asDescriptor, newDescriptor } from './model/Descriptor';
export { asDomain, asDomainBase, newDomain } from './model/Domain';
export { asDomainEntity, newDomainEntity } from './model/DomainEntity';
export { asDomainEntityExtension, newDomainEntityExtension } from './model/DomainEntityExtension';
export { asDomainEntitySubclass, newDomainEntitySubclass } from './model/DomainEntitySubclass';
export { asDomainItem, newDomainItem } from './model/DomainItem';
export { asEnumeration, newEnumeration } from './model/Enumeration';
export { asEnumerationItem, newEnumerationItem } from './model/EnumerationItem';
export { asIntegerType, newIntegerType } from './model/IntegerType';
export { asInterchange, newInterchange } from './model/Interchange';
export { asInterchangeExtension, newInterchangeExtension } from './model/InterchangeExtension';
export { asInterchangeItem, newInterchangeItem } from './model/InterchangeItem';
export { asMapTypeEnumeration, newMapTypeEnumeration } from './model/MapTypeEnumeration';
export { asModelType } from './model/ModelType';
export { newNamespaceInfo } from './model/NamespaceInfo';
export { asSchoolYearEnumeration, newSchoolYearEnumeration } from './model/SchoolYearEnumeration';
export { asSharedDecimal, newSharedDecimal } from './model/SharedDecimal';
export { asSharedInteger, newSharedInteger } from './model/SharedInteger';
export { asSharedString, newSharedString } from './model/SharedString';
export { newSourceMap } from './model/SourceMap';
export { asStringType, newStringType } from './model/StringType';
export { asSubdomain, newSubdomain } from './model/Subdomain';
export { asTopLevelEntity, newTopLevelEntity } from './model/TopLevelEntity';

// for plugin testing

export { MetaEdTextBuilder } from './grammar/MetaEdTextBuilder';

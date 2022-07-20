import { State } from '../State';

// export const validateVersion = (version: SemVer, message: string) => {
//   const cleaned = semver.clean(version);
//   if (semver.valid(cleaned) == null) throw new Error(message);
//   return cleaned;
// };

// export const validateSchema = (metaEdConfiguration: MetaEdConfiguration) => {
//   const schema = fs.readFileSync(path.resolve(__dirname, '../metaEd.schema.json'), 'utf-8');
//   const ajv = new Ajv({ logger: winston, allErrors: true });
//   ajv.addMetaSchema(jsonSchemaDraft06);
//   const isValid = ajv.validate(JSON.parse(schema), metaEdConfiguration);
//   if (!isValid && ajv.errors.length > 0) {
//     ajv.errors.forEach(error => winston.error(error, error.message, error.dataPath !== '' ? `(${error.dataPath})` : ''));
//     throw new Error('MetaEd configuration validation failed!');
//   }
//   return isValid;
// };

// // eslint-disable-next-line
// function dummyValidateSchema(ignore: any) {
//   winston.info('MetaEd configuration file validation off');
// }

export function validateConfiguration(state: State): State {
  /* Maybe switch from ajv (uses eval/Function) to https://github.com/danwang/json-schema-validator-generator, double-check it doesn't use eval or Function */
  // if (validateSchema(state.metaEdConfiguration)) {
  return state;
}

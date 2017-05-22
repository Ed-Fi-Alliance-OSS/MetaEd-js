// no flow
const _Warning = Symbol('Warning');
const _Error = Symbol('Error');

export default class ValidationLevel {
  static get Warning() {
    return _Warning;
  }

  static get Error() {
    return _Error;
  }
}

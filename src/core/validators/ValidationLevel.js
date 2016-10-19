export default class ValidationLevel {
    static get Warning() : Symbol {
        return _Warning;
    }

    static get Error() : Symbol {
      return _Error;
    }
}

const _Warning = Symbol('Warning');
const _Error = Symbol('Error');

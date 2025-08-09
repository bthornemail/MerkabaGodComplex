import assert from "node:assert";

export default  function performAssertion(assertionType: '==' | '===' | '!=' | '!==' | '>' | '<' | '>=' | '<=' | '&&' | '||' | 'true' | 'false' | 'ok' | 'error' | 'success', actual: null | boolean | object | Array<boolean | object | number | string> | number | string, expected: null | boolean | object | Array<boolean | object | number | string> | number | string, message: string) {
    switch (assertionType) {
      case 'true':
        assert(actual, message);
        break;
      case 'false':
        assert(!actual, message);
        break;
      case '===':
        assert.strictEqual(actual, expected, message);
        break;
      case '==':
        assert.equal(actual, expected, message);
        break;
      case '!==':
        assert.notStrictEqual(actual, expected, message);
        break;
      case '!=':
        assert.notEqual(actual, expected, message);
        break;
      case 'ok':
        assert.ok(actual, message);
        break;
      case 'error':
        assert.throws(() => actual); //, expected, message);
        break;
      case 'success':
        assert.doesNotThrow(() => actual, message);
        break;
      case '>':
      case '<':
      case '>=':
      case '<=':
      case '&&':
      case '||':
      default:
        console.warn('Unsupported assertion type:', assertionType);
        break;
    }
  };
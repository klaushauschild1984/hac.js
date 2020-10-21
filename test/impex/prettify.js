const fs = require('fs');
const assert = require('assert');

const prettify = require('../../lib/impex/prettify');

describe('prettify', () => {
    it('impex', () => {
        const malformed = fs.readFileSync('test/impex/malformed.impex').toString();
        const prettified = prettify(malformed);
        const pretty = fs.readFileSync('test/impex/pretty.impex').toString();
        assert.strictEqual(prettified, pretty);
    });
});
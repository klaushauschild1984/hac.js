const fs = require('fs');
const assert = require('assert');

const parser = require('../../lib/impex/parser');

describe('parser', () => {
    it('newline', () => {
        const tokens = parser('\n');
        assert.strictEqual(tokens.length, 1);
        assert.strictEqual(tokens[0].type, 'newline');
    });
    it('comment', () => {
        const tokens = parser('#     comment   \n');
        assert.strictEqual(tokens.length, 1);
        assert.strictEqual(tokens[0].type, 'comment');
        assert.strictEqual(tokens[0].value, 'comment');
    });
    describe('macro', () => {
        it('parse', () => {
            const tokens = parser('$macro    =   value  \n');
            assert.strictEqual(tokens.length, 1);
            assert.strictEqual(tokens[0].type, 'macro');
            assert.strictEqual(tokens[0].value.name, 'macro');
            assert.strictEqual(tokens[0].value.replacement, 'value');
        });
        it('$ followed by whitespace', () => {
            try {
                parser('$ macro');
                assert.fail();
            } catch (exception) {
            }
        });
        it('missing =', () => {
            try {
                parser('$macro');
                assert.fail();
            } catch (exception) {
            }
        });
    });
    it('sample impex', () => {
        const impex = fs.readFileSync('test/impex/pretty.impex').toString();
        const tokens = parser(impex);
        assert.strictEqual(tokens.length, 18);
    });
});
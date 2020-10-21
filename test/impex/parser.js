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
    describe('data', () => {
        it('empty cells', () => {
            const tokens = parser(';super very long value that is longer than its header   ;;; ;;;');
            assert.strictEqual(tokens.length, 1);
            assert.strictEqual(tokens[0].type, 'data');
            assert.strictEqual(tokens[0].value.length, 1);
        });
    });
    describe('header', () => {
        it('simple', () => {
            const tokens = parser('INSERT_UPDATE Product; code');
            assert.strictEqual(tokens.length, 1);
            assert.strictEqual(tokens[0].type, 'header');
            assert.strictEqual(tokens[0].value.mode, 'INSERT_UPDATE');
            assert.strictEqual(tokens[0].value.columns.length, 1);
            assert.strictEqual(tokens[0].value.columns[0].column, 'code');
            assert.strictEqual(tokens[0].value.columns[0].modifiers.length, 0);
        });
        it('modifiers', () => {
            const tokens = parser('iNsErT_uPdAtE Product; code [unique  =true ]  [allownull=true    ,default=code]; description[lang=en];approvalStatus(code)');
            assert.strictEqual(tokens.length, 1);
            assert.strictEqual(tokens[0].type, 'header');
            assert.strictEqual(tokens[0].value.mode, 'INSERT_UPDATE');
            assert.strictEqual(tokens[0].value.columns.length, 3);
            assert.strictEqual(tokens[0].value.columns[0].column, 'code');
            assert.strictEqual(tokens[0].value.columns[0].modifiers.length, 3);
            assert.strictEqual(tokens[0].value.columns[1].column, 'description');
            assert.strictEqual(tokens[0].value.columns[1].modifiers.length, 1);
            assert.strictEqual(tokens[0].value.columns[2].column, 'approvalStatus(code)');
            assert.strictEqual(tokens[0].value.columns[2].modifiers.length, 0);
        });
    });
    it('sample impex', () => {
        const impex = fs.readFileSync('test/impex/pretty.impex').toString();
        const tokens = parser(impex);
        assert.strictEqual(tokens.length, 18);
    });
});
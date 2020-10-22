const fs = require('fs');
const assert = require('assert');

const prettify = require('../../lib/impex/prettify');

describe('prettify', () => {
    it('simple', () => {
        const prettified = prettify('' +
            'INSERT_UPDATE     Product   ;code[unique=true]     ;;; ;\n' +
            '    ;   code'
        );
        assert.strictEqual(prettified, '' +
            'INSERT_UPDATE Product; code[unique = true]\n' +
            '                     ; code\n'
        );
    });
    it('long values', () => {
        const prettified = prettify('' +
            '    REMOVE Product;code[unique=true];name[lang=en]\n' +
            ';super very long value that is longer than its header   ;;; ;;;'
        );
        assert.strictEqual(prettified, '' +
            'REMOVE Product; code[unique = true]                                  ; name[lang = en]\n' +
            '              ; super very long value that is longer than its header ;\n'
        );
    });
    it('modifiers', () => {
        const prettified = prettify('' +
            'update Product; code [unique  =true ]  [allownull=true    ,default=code]\n' +
            ';foo;bar'
        );
        assert.strictEqual(prettified, '' +
            'UPDATE Product; code[unique = true, allownull = true, default = code] ;\n' +
            '              ; foo                                                   ; bar\n'
        );
    });
    it('impex', () => {
        const malformed = fs.readFileSync('test/impex/malformed.impex').toString();
        const prettified = prettify(malformed);
        const pretty = fs.readFileSync('test/impex/pretty.impex').toString();
        assert.strictEqual(prettified, pretty);
    });
});
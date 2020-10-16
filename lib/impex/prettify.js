const antlr4 = require('antlr4');

const ImpexLexer = require('./ImpexLexer').ImpexLexer;
const ImpexParser = require('./ImpexParser').ImpexParser;

module.exports = (input) => {

    const chars = new antlr4.InputStream(input);
    const lexer = new ImpexLexer(chars);
    const tokens  = new antlr4.CommonTokenStream(lexer);
    const parser = new ImpexParser(tokens);
    parser.buildParseTrees = true;
    const tree = parser.impex();

};
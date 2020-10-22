const EOL = require('os').EOL;

const parser = require('./parser');

const indent_header = (token, indentation) => {
    indentation.push(token.value.mode.length + 1 + token.value.type.length);
    for (const column of token.value.columns) {
        let length = column.column.length;
        if (column.modifiers !== undefined && column.modifiers.length > 0) {
            length++;
            for (const modifier of column.modifiers) {
                length += modifier.key.length + 3 + modifier.value.length;
            }
            length += (column.modifiers.length - 1) * 2;
            length++;
        }
        indentation.push(length);
    }
};

const indent_data = (token) => {
    for (let i = 0; i < token.value.length; i++) {
        const data = token.value[i];
        const length = data.length;
        if (token.indentation[i + 1] === undefined) {
            token.indentation.push(length);
        }
        if (length > token.indentation[i + 1]) {
            token.indentation[i + 1] = length;
        }
    }
};

const prettify_header = (token) => {
    let header = `${token.value.mode} ${token.value.type}`;
    const columns = token.value.columns;
    let i = 0;
    for (; i < columns.length; i++) {
        let head = '; ';
        head += columns[i].column;
        if (columns[i].modifiers !== undefined && columns[i].modifiers.length > 0) {
            head += '[';
            head += columns[i].modifiers.map(modifier => `${modifier.key} = ${modifier.value}`).join(', ');
            head += ']';
        }
        header += head.padEnd(token.indentation[i + 1] + 3, ' ');
    }
    for (let j = i + 1; j < token.indentation.length; j++) {
        header += ' ;';
    }
    return header.trimEnd() + EOL;
};

const prettify_data = (token) => {
    let line = '';
    line += ''.padEnd(token.indentation[0], ' ');
    let i = 0;
    for (; i < token.value.length; i++) {
        if (i > 0) {
            line += ' ';
        }
        line += '; ';

        const value = token.value[i];
        if (value.startsWith('"') && value.endsWith('"') && value.includes('"')) {
            line += '"' + EOL;
            line += value.slice(1, value.length - 1) + EOL;
            line += '"';
        } else {
            line += value.padEnd(token.indentation[i + 1], ' ');
        }
    }
    if ((token.indentation.length - 1) > i) {
        line += ' ;';
    }
    return line.trimEnd() + EOL;
};

module.exports = (input) => {

    let output = '';

    const tokens = parser(input);

    // prepare indentation
    let indentation = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        switch (token.type) {
            case 'header':
                indentation = [];
                token.indentation = indentation;
                indent_header(token, indentation)
                break;
            case 'data':
                token.indentation = indentation;
                indent_data(token);
                break;
        }
    }

    // pretty print output
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        switch (token.type) {
            case 'newline':
                output += EOL;
                break;
            case 'comment':
                output += `# ${token.value}${EOL}`;
                break;
            case 'macro':
                output += `$${token.value.name} = ${token.value.replacement}${EOL}`;
                break;
            case 'header':
                output += prettify_header(token);
                break;
            case 'data':
                output += prettify_data(token);
                break;
        }
    }

    return output;

};
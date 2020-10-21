const EOL = require('os').EOL;

const parser = require('./parser');

const prettify_header = (token) => {
    let header = `${token.value.mode} ${token.value.type}`;
    const columns = token.value.columns;
    for (let i = 0; i < columns.length; i++) {
        if (i > 0) {
            header += ' ';
        }
        header += '; ';
        header += columns[i].column;
        if (columns[i].modifiers !== undefined && columns[i].modifiers.length > 0) {
            header += '[';
            header += columns[i].modifiers.map(modifier => `${modifier.key} = ${modifier.value}`).join(', ');
            header += ']';
        }
    }
    return header + EOL;
};

const prettify_data = (token) => {
    let data = '';
    const values = token.value;
    for (let i = 0; i < values.length; i++) {
        if (i > 0) {
            data += ' ';
        }
        data += '; ';
        const value = values[i];
        if (value.startsWith('"') && value.endsWith('"') && value.includes('"')) {
            data += '"' + EOL;
            data += value.slice(1, value.length - 1) + EOL;
            data += '"';
        } else {
            data += value;
        }
    }
    return data + EOL;
};

module.exports = (input) => {

    let output = '';

    const tokens = parser(input);
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
const read_token = (i, input, stop, type, producer, wrapper) => {
    let value = '';
    let j = i;
    let wrapped_value = false;
    for (; j < input.length; j++) {
        const char = input.charAt(j);
        if (char === wrapper) {
            wrapped_value = !wrapped_value;
        }
        if (char === stop && !wrapped_value) {
            break;
        }
        value += char;
    }
    return {
        ahead: j,
        token: {
            type: type,
            value: producer(value)
        }
    };
}

const read_newline = (i, input) => {
    return read_token(i, input, '\n', 'newline',
        value => undefined);
}

const read_comment = (i, input) => {
    return read_token(i, input, '\n', 'comment',
        value => value.trim());
}

const read_macro = (i, input) => {
    return read_token(i, input, '\n', 'macro',
        value => {
            const macro = value.split('=');
            // TODO format replacement as well, typically header expressions found here
            return {
                name: macro[0].trim(),
                replacement: macro[1].trim()
            };
        });
}

const read_data = (i, input) => {
    return read_token(i, input, '\n', 'data',
        value => {
            // TODO ; inside of "" wrapped values
            return value.trim().split(';');
        }, '"');
}

const read_header = (i, input) => {
    return read_token(i - 1, input, '\n', 'header',
        value => {
            const mode = value.split(' ', 2)[0];
            const headers = value.replace(mode, '').split(';')
                .map(header => header.trim())
                .filter(header => header.length !== 0);

            return {
                mode: mode.toUpperCase(),
                type: headers[0],
                columns: headers.slice(1).map(header => {
                    const column = header.split('[', 2)[0];
                    const modifiers = header.replace(column, '').trim();
                    return {
                        column: column,
                        modifiers: modifiers.length === 0 ? [] : modifiers.split(/[,\[]/)
                            .filter(modifier => modifier.trim().length !== 0)
                            .map(modifier => modifier.replace(']', '').trim())
                            .map(modifier => {
                                return {
                                    key: modifier.split('=')[0].trim(),
                                    value: modifier.split('=')[1].trim()
                                }
                            })
                    };
                })
            };
        });
}

module.exports = (input) => {

    const tokens = [];

    for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i);

        let read = (i, input) => {
        };

        switch (char) {
            case ' ':
            case '\t':
                // skip white spaces
                continue;
            case '\n':
                read = read_newline;
                break;
            case '#':
                read = read_comment;
                break;
            case '$':
                read = read_macro;
                break;
            case ';':
                read = read_data;
                break;
            case 'i':
            case 'I':
            case 'u':
            case 'U':
            case 'r':
            case 'R':
                read = read_header;
                break;
        }

        if (read(i + 1, input) === undefined) {
            throw {
                message: 'unrecognized character',
                character: char
            }
        }
        const {ahead, token} = read(i + 1, input);
        i = ahead;
        tokens.push(token);
    }

    return tokens;

};
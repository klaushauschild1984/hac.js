const fs = require('fs');
const os = require("os");
const path = require('path');

const line_reader = require('line-reader-sync');

const MACRO = '$';
const COMMENT = '#';
const KEY_WORDS = [
    'INSERT',
    'UPDATE',
    'INSERT_UPDATE',
    'REMOVE'
];
const DATA = ';';

module.exports = (impex) => {
    const chunks = read_chunks(impex);
    process_chunks(chunks);
    const formatted_impex = create_formatted_file(impex);
    write_file(chunks, formatted_impex);
};

const process_chunks = (chunks) => {
    const format_header = (line) => {
        // clean trailing ;
        line = line.trim();
        while (line.endsWith(';')) {
            line = line.substring(0, line.length - 1).trim();
        }

        const values = line.split(';');

        // handle KEYWORD TableName
        const key_table = values[0].split(/\s+/);
        values[0] = key_table.join(' ');

        for (let i = 1; i < values.length; i++) {
            if (values[i].indexOf('[') === -1) {
                continue;
            }
            const field = values[i].substring(0, values[i].indexOf('[')).trim();
            const modifier = [...values[i].matchAll(/\w+\s*=\s*\w+/gm)]
                .map(m => m[0])
                .map(m => {
                    const key_value = m.split('=');
                    return `${key_value[0].trim()} = ${key_value[1].trim()}`;
                })
                .join(', ');
            values[i] = `${field}[${modifier}]`;
        }

        return values.join(';');
    }

    for (let chunk of chunks) {
        for (let i = 0; i < chunk.lines.length; i++) {

            // macros
            if (chunk.lines[i].startsWith(MACRO)) {
                const macro = chunk.lines[i].split('=', 2).map(s => s.trim());
                chunk.lines[i] = `${macro[0]} = ${macro[1]}`;
                continue;
            }

            // comments
            if (chunk.lines[i].startsWith(COMMENT)) {
                const comment = chunk.lines[i].substr(1).trim();
                chunk.lines[i] = `# ${comment}`;
                continue;
            }

            // header
            const key_word = chunk.lines[i].split(/\s/)[0];
            let header = false;
            if (KEY_WORDS.includes(key_word)) {
                chunk.lines[i] = format_header(chunk.lines[i]);
                header = true;
            }

            // header or data
            const indention = chunk.lines[i].split(';')
                .map(value => value.trim())
                .map(value => value.length + (header ? 0 : 1));
            for (let j = 0; j < indention.length; j++) {
                if (chunk.indention.length <= j) {
                    chunk.indention.push(indention[j]);
                }
                if (indention[j] > chunk.indention[j]) {
                    chunk.indention[j] = indention[j];
                }
            }
        }

        // fix indention
        for (let i = 0; i < chunk.lines.length; i++) {
            // ignore macros and comments
            if (chunk.lines[i].startsWith(MACRO) || chunk.lines[i].startsWith(COMMENT)) {
                continue;
            }

            const values = chunk.lines[i].split(';').map(value => value.trim());
            let line = '';
            for (let j = 0; j < values.length; j++) {
                line += `${values[j]}`.padEnd(chunk.indention[j], ' ') + '; ';
            }
            chunk.lines[i] = line;
        }
    }
}

const write_file = (chunks, impex) => {
    const append = (line) => {
        fs.writeFileSync(impex, `${line}${os.EOL}`, {
            flag: 'a+'
        });
    }

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        for (let line of chunk.lines) {
            append(line);
        }

        if (i !== chunks.length - 1) {
            append('');
        }
    }
}

const create_formatted_file = (impex) => {
    const name = path.parse(impex).name;
    const ext = path.parse(impex).ext;
    let formatted_impex = `${name}.formatted${ext}`;
    fs.writeFileSync(formatted_impex, '');
    return formatted_impex;
}

const read_chunks = (impex) => {
    const new_chunk = (chs) => {
        const ch = {
            header: false,
            lines: [],
            indention: [],
        };
        chs.push(ch);
        return ch;
    }

    const lines = new line_reader(impex).toLines();

    const chunks = [];
    let chunk = undefined;
    for (let line of lines) {
        // handle blank lines
        line = line.trim();
        if (line.length === 0) {
            chunk = new_chunk(chunks);
            continue;
        }

        // first chunk
        if (chunk === undefined) {
            chunk = new_chunk(chunks);
        }

        // key word line (typically introduce new chunk)
        const key_word = line.split(/\s/)[0];
        if (KEY_WORDS.includes(key_word)) {
            if (chunk.header) {
                chunk = new_chunk(chunks);
            } else {
                chunk.header = true;
            }
        }
        chunk.lines.push(line);
    }

    return chunks;
}

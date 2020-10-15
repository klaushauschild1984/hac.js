const pkg = require('./package.json');
const format = require('./format');

console.log(`${pkg.name} ${pkg.version}`);

const impex = process.argv.slice(2)[0];
if (impex === undefined) {
    console.error('Missing impex file to format. Please provide one.');
    process.exit(1);
}
console.log(`  formatting : ${impex}`);
format(impex);
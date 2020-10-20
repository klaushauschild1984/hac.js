const parser = require('./parser');

module.exports = (input) => {

    const tokens = parser(input);
    console.log(tokens);

};
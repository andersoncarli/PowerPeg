const Parser = require('./powerpeg'); // Import the Parser class

const parser = new Parser("bit:[0|1 bits+")
console.log(parser.parse("01 101 0101"))
console.log(parser.match("01 101 0101"))

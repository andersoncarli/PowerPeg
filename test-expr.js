const Parser = require('./powerpeg'); // Import the Parser class

// Define a complex grammar
const grammar = {
  start: "expression",
  expression: "term (operator term)*",
  term: "number | '(' expression ')'",
  operator: "+ | - | * | /",
  number: "[0-9]+",
};

// Create a new instance of the Parser with the grammar
const parser = new Parser(grammar);

// Define a large input data for stress testing
const largeExpression = "(1 + 2) * (3 - (4 / 2)) + (5 * 6) - (7 / (8 + 9)) * 10";

// Test the parser with large input data
console.time('Parser');
const result = parser.match(largeExpression);
console.timeEnd('Parser');

// Print the result
console.log("Result:", result ? "Valid Expression" : "Invalid Expression");

import Parser from 'powerpeg';

const JSONGrammar = {
  start: "{ value }",
  value: "object|array|string|number|boolean|null",
  object: "{ (pair (, pair)*)? }",
  pair: "string : value",
  array: "\\[ (value (, value)*)? \\]",
  string: "' [^']* ' | \" [^\"]* \"",
  number: "-?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?",
  boolean: "true|false",
  null: "null",
};

const jsonParser = new Parser(JSON.stringify(JSONGrammar));
const jsonString = '{"name": "John", "age": 30, "isAdmin": true}';
console.log(jsonParser.match(jsonString));
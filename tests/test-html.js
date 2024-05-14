const Parser = require('./powerpeg'); // Import the Parser class

// Define the HTML grammar
const htmlGrammar = {
  start: "element*",
  element: "< tag attribute* > ( content | element* ) </ tag >",
  tag: "[a-zA-Z][a-zA-Z0-9]*",
  attribute: "name '=' value",
  name: "[a-zA-Z][a-zA-Z0-9-]*",
  value: "'[^']*' | \"[^\"]*\"",
  content: "[^<]+"
};

// Define a sample HTML code to test
const htmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sample HTML</title>
</head>
<body>
  <h1>Welcome to PowerPeg</h1>
  <p>This is a sample HTML code.</p>
</body>
</html>
`;

// Create a new instance of the Parser with the HTML grammar
const htmlParser = new Parser(htmlGrammar);

// Test the parser with the HTML code
const result = htmlParser.match(htmlCode);

// Print the result
console.log(result ? "Valid HTML Code" : "Invalid HTML Code");

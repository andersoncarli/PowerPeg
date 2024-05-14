const Grammar = {
  "\s": { type: "space", value: "\s" },
  "\t": { type: "tab", value: "\t" },
  "\n": { type: "newline", value: "\n" },
  "\r": { type: "return", value: "\r" },
  "\\": { type: "escape", value: () => source[++pos] },
  "#": { type: "comment", value: () => until("\n").slice(1, -1) },
  ":": { type: "tuple", value: () => until("\n").slice(1, -1) },
  "{": { type: "code", value: () => until("}").slice(1, -1) },
  "^": { type: "begin", value: () => pos == 0 },
  "$": { type: "end", value: () => pos >= source.length },
  "?": { type: "zeroOne", value: () => !next("?") },
  "*": { type: "zeroPlus", value: () => !next("?") },
  "+": { type: "onePlus", value: () => !next("?") },
  '"': { type: "string_d", value: () => until('"').slice(1, -1) },
  "'": { type: "string_s", value: () => until("'").slice(1, -1) },
  ".": { type: "any", value: () => source[pos] },

  start: { rule: "^ rule+ $", prefix: ['^', '+', 'rule', '$'] },
  choice: { rule: "term (\| term)+", prefix: ['term', '+', 'group', ['\|', 'term']] },
  string: { rule: "string_d|string_s", prefix: ['choice', ['"', "'"]] },
  quantifier: { rule: "\?|\*|\+", prefix: ['choice', ['?', '*', '+']] },

  lineBreak: { rule: "\n \r?", prefix: ['newLine', '?', '\r'] },
  whitespace: { rule: "(\s|\t)+", prefix: ['+', 'choice', ['\s', '\t']] },

  list: { rule: "term (, term)+", prefix: ["term", '+', 'group', [',', 'term']] },
  control: { rule: "start|end", prefix: ['choice', ["start", "end"]] },

  term: {
    rule: "group|type|tuple|terminal quantifier?",
    prefix: ['choice', ['group', 'type', 'tuple', 'terminal'], '?', 'quantifier']
  },

  group: { rule: "\( choice|list \)", prefix: ['(', 'choice'[, 'choice', 'list'], ')'] },

  charset: {
    rule: "\[ ^? char-char|char+ \]",
    prefix: ['choice', [['[', '?', '^', 'char', '-', 'char'], ['+', 'char'], ']']]
  },

  terminal: {
    rule: "name|string|charset|literal",
    prefix: ["choice", ["name", "string", "charset", "literal"]]
  },

  name: {
    rule: "letter (letter|digit)*", regex: /[a-zA-Z_.][0-9a-zA-Z_.]*/,
    prefix: ['letter', '+', 'choice', ['letter', 'digit']]
  },

  digit: { rule: "[0-9]", regex: /[0-9]/ },
  letter: { rule: "[a-zA-Z_.]", regex: /[a-zA-Z_.]/ },
  tag: { rule: "name|string", prefix: ['choice', ["name", "string"]] },
  rule: { rule: "term code? \n", prefix: ['term', '?', 'code', '\n'] },
  type: { rule: "name tuple", prefix: ["name", "tuple"] },
  tuple: { rule: "(\: term)+", prefix: ["+", [":", 'term']] },
  literal: { rule: "\.", prefix: ["\."] },
}

module.export = Grammar
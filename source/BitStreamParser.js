require('./GrammarParser.js')

class BitStreamParser {
  constructor(grammar, start) {
    let objectGrammar = ParseGrammar(grammar, 'start')
    this.parser = Parser(objectGrammar, start);
  }

  parse(source) {
    return this.parser.parse(source);
  }

  match(source) {
    try {
      this.parse(source);
      return true;
    } catch (error) {
      return false;
    }
  }

  compile(source) {
    const ast = this.parse(source);
    return ast.bits.split(' ').map(bit => parseInt(bit, 2));
  }
}

const BitStreamTextGrammar = "bits:bit+; bit:0|1; spaces: spaces+; space:\ ";
const BitStreamHotGrammar = (new GrammarParser(grammarText, 'bits')).parse();

console.logdir(BitStreamHotGrammar);

const parser = new BitStreamParser(BitStreamHotGrammar)
console.dir(parser.parse("01 101")); // should print the AST of the match
console.log(parser.match("01 101")); // should return true
console.log(parser.match("01 a 2"));      // should return false
console.log(parser.compile("01 101"));// should produce the decimal values [1, 5]

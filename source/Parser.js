// const Grammar = require('./Grammar.js')

class Parser {
  constructor(grammar, start) {
    this.grammar = grammar;
    this.start = start;
    this.pos = 0;
  }

  parse(source) {
    const chunks = source.split(/(\s+|\b|\W)/).filter(chunk => chunk.trim() !== '');
    const stack = [this.start];
    const ast = {};

    const parseProduction = () => {
      const production = stack.pop();

      if (typeof production === 'string') {
        if (production in this.grammar) {
          stack.push(this.grammar[production]);
        } else {
          if (chunks[this.pos] === production) {
            ast[production] = chunks[this.pos++];
          } else {
            throw new Error(`Unexpected token: ${chunks[this.pos]}`);
          }
        }
      } else if (Array.isArray(production)) {
        for (const element of production.reverse()) {
          stack.push(element);
        }
      } else if (typeof production === 'object') {
        if (production.regex) {
          const regex = new RegExp(production.regex);
          const chunk = chunks[this.pos++];
          if (regex.test(chunk)) {
            ast[production.type] = chunk;
          } else {
            throw new Error(`Unexpected token: ${chunk}`);
          }
        } else if ('prefix' in production) {
          stack.push(...production.prefix);
        } else if ('rule' in production) {
          stack.push(...production.rule.split(' '));
        } else {
          throw new Error(`Invalid production: ${production}`);
        }
      } else {
        throw new Error(`Invalid production: ${production}`);
      }
    };

    try {
      while (stack.length > 0) {
        parseProduction();
      }
      return ast;
    } catch (error) {
      throw error;
    }
  }
}

// Example usage:
const BitStreamGrammar = {
  bits: { rule: "bit+", prefix: ['+', 'bits'] },
  bit: { rule: "0|1", prefix: ['choice', ['0', '1']] },
  spaces: { rule: "space+", prefix: ['+', 'space'] },
  "\s": { type: "space", regex: /\s+/ }
};

const parser = new Parser(BitStreamGrammar, 'bits');
const ast = parser.parse("01 101 0101");
console.log(ast);


/*
GrammarParser should be capable of receiving a pure text grammar like this

"bits:bit+; bit:0|1; spaces: spaces+; space:\ "

and return a object representation like this

const BitStreamGrammar = {
  bits: { rule: "bit+", prefix: ['+', 'bits'] },
  bit: { rule: "0|1", prefix: ['choice', ['0', '1']] },
  spaces: { rule: "space+", prefix: ['+', 'space'] },
  "\s": { type: "space", regex: /\s+/ }
};
*/

class GrammarParser extends Parser {
  constructor(grammarText, start) {
    this.grammarText = grammarText;
    this.start = start;
    this.grammarObject = null;
  }

  parse() {
    const grammarObject = {};
    const productions = this.grammarText.split(';').map(production => production.trim());
    productions.forEach(production => {
      const [name, rule] = production.split(':');
      grammarObject[name] = this.parseProduction(rule.trim());
    });
    this.grammarObject = grammarObject;
    return grammarObject;
  }

  parseProduction(rule) {
    const production = {};
    production.rule = rule;
    production.prefix = this.generatePrefix(rule);
    return production;
  }

  generatePrefix(rule) {
    const prefix = [];
    const terms = rule.split(/\s+/);
    terms.forEach(term => {
      if (term.startsWith('(')) {
        prefix.push(term.slice(1));
      } else if (term.endsWith(')')) {
        prefix.push(term.slice(0, -1));
      } else {
        prefix.push(term);
      }
    });
    return prefix;
  }
}


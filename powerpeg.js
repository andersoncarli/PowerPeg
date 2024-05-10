class Parser {
  constructor(grammar) {
    this.pos = 0
    this.ast = {}
    this.Grammar =  this.bootGrammar(Grammar)
    this.grammar =  this.loadGrammar(grammar)
  }

  next(expected) {
    let len = expected.length
    let found = this.source.slice(this.pos, this.pos + len)
    if (found == expected) {
      this.pos += len
      return true;
    }
  }

  loadGrammar(grammar) {
    this.source = grammar
    this.grammar = {
    }

    let tag = '', ast = { type: 'start', children: [] }
    do {
      let c = this.source[this.pos++]; tag += c
      let ruleFunc = this.grammarconst Grammar = {
        // terminals
        "\\": { tag: "escape",   value: () => ( this.source[++this.pos] ) },
        "\s": { tag: "space",    value: "\s" },
        "\t": { tag: "tab",      value: "\t" },
        "\n": { tag: "newline",  value: "\n" },
        "\r": { tag: "return",   value: "\r" },
        "#":  { tag: "comment",  value: () => ( this.until("\n") ) },
        "{":  { tag: 'code',     value: () => ( this.until("}").slice(1, -1) ) },
        ":":  { tag: 'tuple',    value: () => ( this.until("\n").slice(1, -1) ) },
        "^":  { tag: "begin",    value: () => ( this.pos == 0 ) },
        "$":  { tag: "end",      value: () => ( !this.source[this.pos + 1] ) },
        "?":  { tag: "zeroOne",  greed: () => ( !this.next("?") ) },
        "*":  { tag: "zeroPlus", greed: () => ( !this.next("?") ) },
        "+":  { tag: "onePlus",  greed: () => ( !this.next("?") ) },
        '"':  { tag: "double",   value: () => ( this.until('"').slice(1, -1) ) },
        "'":  { tag: "single",   value: () => ( this.until("'").slice(1, -1) ) },
        ".":  { tag: "char",     value: () => ( this.source[this.pos] ) },

        // not terminals
        start      : "^ rule+ $",
        string     : "single | double",
        whitespace : "(\s | \t | \n \r?)+",
        quantifier : "* | + | ?",
        choice     : "term (| term)+",
        list       : "term (, term)+",
        control    : "start | end",
        term       : "group | type | tuple | terminal quantifier?",
        charset    : "\[ ^? char-char|char+ ]",
        group      : "\( choice|list )",
        digit      : "[0-9]",
        letter     : "[a-zA-Z_.]",
        name       : "(letter | digit)+",
        tag        : "name | string",
        rule       : "term code? ;|\n",
        terminal   : "name | string | charset | literal",
        type       : "name tuple",
        tuple      : "(\: term)+",
        literal    : ".+"
      }[tag] || this.grammar[c]
      if (ruleFunc) {
        let node = ruleFunc()
        if (node.type == 'tuple' && tag)
          node = { type: tag, value: this.parse(node.value) }
        ast.children.push(node)
        tag = '';
        //continue
      }
    } while (this.pos < this.source.length)

    this.grammarAST = this.parse(grammar) // parse itself after boot
  }

  addRule(tag, rule) {
    let code = (rule[0] === "{")
      ? `return { literal:"${tag}",${rule.slice(1, -1)}}`
      : `return {"literal.${tag}", this.match("${rule}") }`
    console.log(code)
    let f = new Function([], code)
    this.grammar[tag] = f
  }

  until(expected) {
    let p = this.pos, c;
    do {
      c = this.source[++this.pos]
      if (c == "\\") c = this.source[++this.pos]
    } while (c != expected || !c);

    return this.source.slice(p, ++this.pos);
  }

  // parse should return the AST
  parse(expected) {
    let p = this.pos;
    if (!expected) expected = "start"
    const rule = this.grammar[expected]
    if (rule) {
      const node = rule.call(this, expected, this.pos, [])
      if (node) {
        node.expected = expected
        node.pos = p
        node.match = this.source.slice(p, this.pos)
        return node
      }
      this.pos = p
    }

    let literal = this.source.slice(this.pos, this.pos + expected.length)
    if (literal === expected) {
      this.pos += expected.length
      return { type: "literal", value: expected }
    }
    return undefined
  }

  // match should return the array of matches
  match(source) {
    let ast = this.parse(source)
    return !!ast
  }
}

// Check if module.exports is defined (CommonJS environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Parser;
}

// Check if window is defined (Browser environment)
if (typeof window !== 'undefined') {
  window.Parser = Parser;
}

// Check if define is a function (RequireJS environment)
if (typeof define === 'function' && define.amd) {
  define('PowerPeg', [], function() {
    return Parser;
  });
}
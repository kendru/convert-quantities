const Unit = require('./Unit');
const Dimension = require('./Dimension');
const system = require('./system');
const { LexError, ParseError } = require('./errors');

function getUnitForSymbol(sym) {
    return system.lookup(sym) || new Unit(Dimension.NONE, sym);
}

function isIdentChar(c) {
    return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c === '_' ||
            c === 'Ω' ||
            c === '°' ||
            c === 'Å' ||
            c === '"' ||
            c === '\'';
}

function isDigit(c) {
    return (c >= '0' && c <= '9');
}
    
class Lexer {

    constructor() {
        this.pos = 0;
        this.buffer = null;
        this.bufferLen = 0;
    
        this.ops = {
            '*': 'TIMES',
            '/': 'DIV',
            '+': 'PLUS',
            '-': 'MINUS',
            '^': 'POW'
        };
    }

    input(buffer) {
        this.pos = 0;
        this.buffer = buffer;
        this.bufferLen = buffer.length;
    }

    token() {
        let c, op, token;
    
        this._skipWhitespace();
        if (this.pos >= this.bufferLen) {
            return {
                tkClass: '$',
                value: null,
                pos: this.pos
            };
        }
    
        c = this.buffer.charAt(this.pos);
    
        op = this.ops[c];
        if (typeof op !== 'undefined') {
            token = {
                tkClass: op,
                value: c,
                pos: this.pos
            };
            this.pos += 1;
            return token;
        }
    
        if (isIdentChar(c)) {
            return this._processIdent();
        }
        if (isDigit(c)) {
            return this._processNum();
        }
    
        throw new LexError(`Invalid token at ${this.pos}`);
    }

    _processIdent() {
        let endpos = this.pos + 1;
    
        // consume as much input as possible
        while (endpos < this.bufferLen && isIdentChar(this.buffer.charAt(endpos))) {
            endpos += 1;
        }
    
        const token = {
            tkClass: 'IDENT',
            value: this.buffer.substring(this.pos, endpos),
            pos: this.pos
        };
        this.pos = endpos;
    
        return token;
    }

    _processNum() {
        let endpos = this.pos + 1;
    
        while (endpos < this.bufferLen && isDigit(this.buffer.charAt(endpos))) {
            endpos += 1;
        }
    
        const token = {
            tkClass: 'NUM',
            value: parseInt(this.buffer.substring(this.pos, endpos), 10),
            pos: this.pos
        };
        this.pos = endpos;
    
        return token;
    }

    _skipWhitespace() {
        let c;
        while (this.pos < this.bufferLen) {
            c = this.buffer.charAt(this.pos);
            if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
                this.pos += 1;
            } else {
                break;
            }
        }
    }
}

class Node  {

    constructor(type, left, right) {
        this.type = type;
        
        if (typeof right !== 'undefined') {
            this.left = left;
            this.right = right;
            this.value = null;
        } else {
            this.value = left;
            this.left = null;
            this.right = null;
        }
    }

    evaluate() {
        switch (this.type) {
            case 'IDENT':
                return getUnitForSymbol(this.value);
            case 'NUM':
                return this.value;
            case 'TIMES':
                return this.left.evaluate().times(this.right.evaluate());
            case 'DIV':
                return this.left.evaluate().divide(this.right.evaluate());
            case 'POW':
                return this.left.evaluate().pow(this.right.evaluate());
        }

        throw new ParseError(`Invalid AST node type: ${this.type}`);
    }
}

/**
 * Recursive descent parser for the following grammar:
 *
 * EXPR ->
 *     TERMS / TERMS
 *     | TERMS
 * TERMS ->
 *     | TERM * TERMS
 *     | TERM
 * TERM ->
 *     IDENT ^ NUMERIC
 *     | IDENT
 * NUMERIC ->
 *     + NUM
 *     | - NUM
 *     | NUM
 */
class Parser {
    constructor() {
        this.buffer = [];
        this.expr = null;
        this.pos = 0;
    }

    input(tokens) {
        this.buffer = tokens;
        this.pos = 0;
        
        return this;
    }

    parse() {
        const succ = this._isExprAny();
        
        if (succ && this.pos === this.buffer.length) {
            return succ;
        }
    
        throw new ParseError(`Malformed expression at ${this.buffer[this.pos].pos}`);
    }

    _isTerminal(tkClass) {
        const current = this.buffer[this.pos];
        this.pos += 1;
    
        if ((typeof current !== 'undefined') &&
            (current.tkClass === tkClass)
        ) {
            return current.value;
        }
    }

    _isExpr0() {
        const n = this._isTermsAny();
        if (n && this._isTerminal('DIV')) {
            const d = this._isTermsAny();
            if (d) {
                return new Node('DIV', n, d);
            }
        }
    }

    _isExpr1() {
        return this._isTermsAny();
    }

    _isExprAny() {
        const save = this.pos;
        const result = this._isExpr0();
    
        if (result) {
            return result;
        }
    
        this.pos = save;
        return this._isExpr1();
    }

    _isTerms0() {
        const t1 = this._isTermAny();
        if (t1 && this._isTerminal('TIMES')) {
            const t2 = this._isTermAny();
            if (t2) {
                return new Node('TIMES', t1, t2);
            }
        }
    }

    _isTerms1() {
        return this._isTermAny();
    }

    _isTermsAny() {
        const save = this.pos;
        const result = this._isTerms0();
        
        if (result) {
            return result;
        }
    
        this.pos = save;
        return this._isTerms1();
    }

    _isTerm0() {
        const id = this._isTerminal('IDENT');
        if (id && this._isTerminal('POW')) {
            const exp = this._isNumericAny();
            if (exp) {
                return new Node('POW', new Node('IDENT', id), exp);
            }
        }
    }

    _isTerm1() {
        const id = this._isTerminal('IDENT');
        if (id) {
            return new Node('IDENT', id);
        }
    }

    _isTermAny() {
        const save = this.pos
        const result = this._isTerm0();
    
        if (result) {
            return result;
        }
    
        this.pos = save;
        return this._isTerm1();
    }

    _isNumeric0() {
        if (this._isTerminal('PLUS')) {
            const n = this._isTerminal('NUM');
            if (n) {
                return new Node('NUM', n);
            }
        }
    }

    _isNumeric1() {
        if (this._isTerminal('MINUS')) {
            const n = this._isTerminal('NUM');
            if (n) {
                return new Node('NUM', -n);
            }
        }
    }

    _isNumeric2() {
        const n = this._isTerminal('NUM');
        if (n) {
            return new Node('NUM', n);
        }
    }

    _isNumericAny() {
        const save = this.pos;
        let result = this._isNumeric0();
        if (result) {
            return result;
        }
    
        this.pos = save;
        result = this._isNumeric1();
        if (result) {
            return result;
        }
    
        this.pos = save;
        return this._isNumeric2();
    }
}

 function parseUnitExpr(str) {
    const lexer = new Lexer();
    const parser = new Parser();
    const tokens = [];

    lexer.input(str);

    while (true) {
        const token = lexer.token();
        if (token.tkClass === '$') {
            break;
        }

        tokens.push(token);
    }

    return parser.input(tokens)
        .parse()
        .evaluate();
}

module.exports = parseUnitExpr;
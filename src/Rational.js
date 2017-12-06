
// Fast prime factorization function
// Source: http://www.coderenaissance.com/2011/06/finding-prime-factors-in-javascript.html
function primeFactorization(num, result = []) {
    const root = Math.sqrt(num);
    let x = 2;

    if (num % x) {
        x = 3;
        while (num % x !== 0) {
            x += 2;
            if (x >= root) {
                break;
            }
        }
    }
    x = (x <= root) ? x : num;
    result.push(x);

    return (x === num) ? result : primeFactorization(num / x, result);
}

function countTerms(acc, term) {
    if (typeof acc[term] === 'undefined') {
        acc[term] = 1;
    } else {
        acc[term] += 1;
    }
    return acc;
}

function termToString(count, term) {
    if (count === 1) {
        return term.toString();
    }

    return term.toString() + '^' + count;
}

function termListToString(terms) {
    const termCounts = terms.reduce(countTerms, {});
    return Object.keys(termCounts)
        .map(k => termToString(termCounts[k], k))
        .sort()
        .join('*');
}

function literalPart(terms) {
    return terms
        .filter(term => typeof term === 'number')
        .reduce(
            (factors, n) => factors.concat(primeFactorization(n)),
            []
        );
}

function symbolicPart(terms) {
    return terms.filter(term => typeof term === 'string');
}

function simplifyPart(part) {
    const [ numer, denom ] = part;

    // Each term in the numerator gets a positive count
    let counts = numer.reduce(countTerms, {});

    // Each term in the denominator gets a negative count
    counts = denom.reduce((acc, term) => {
        if (typeof acc[term] === 'undefined') {
            acc[term] = -1;
        } else {
            acc[term] -= 1;
        }
        return acc;
    }, counts);

    return Object.keys(counts)
        .map(key => ([ key, counts[key] ]))
        // remove factors that have cancelled out
        .filter(([_, count]) => count !== 0)
        .reduce((acc, pair) => {
            if (pair[1] > 0) {
                acc[0].push(pair); // numerator
            } else {
                acc[1].push(pair); // denominator
            }

            return acc;
        }, [[], []])
        .map(partition =>
            partition.reduce((acc, pair) => {
                let [ val, count ] = pair;
                if (isFinite(val)) {
                    val = +val;
                }
                count = Math.abs(count);

                return acc.concat([...Array(count).keys()].map(() => val));
            }, [])
        )
};

function simplify(rational) {
    rational.literal = simplifyPart(rational.literal);
    rational.symbolic = simplifyPart(rational.symbolic);
}

function evalLits(acc, term) {
    return acc * term;
}
function literalAsString(literalPart) {
    const [numer, denom] = literalPart;

    const evaluatedNumer = numer.reduce(evalLits, 1);
    const evaluatedDenom = denom.reduce(evalLits, 1);

    if (evaluatedNumer / evaluatedDenom === 1) {
        return '';
    }

    if (evaluatedDenom === 1) {
        return String(evaluatedNumer);
    }

    return evaluatedNumer + '/' + evaluatedDenom;
}

 function symbolicAsString(symbolicPart) {
    const countedExpr = symbolicPart.map(termListToString);
    let [numer, denom] = countedExpr;

    // Handle the case where there is only a sumbol in the denominator
    if (numer === '' && denom !== '') {
        numer = '1';
    }

    return numer + (denom !== '' ? '/' + denom : '');
}

class Rational {

    constructor(numer, denom) {
        if (!Array.isArray(numer)) {
            numer = [numer];
        }
        if (!Array.isArray(denom)) {
            denom = [denom];
        }
    
        this.literal = [numer, denom].map(literalPart);
        this.symbolic = [numer, denom].map(symbolicPart);
    
        simplify(this);
    }

    getNumer() {
        return this.literal[0].concat(this.symbolic[0]);
    }

    getDenom() {
        return this.literal[1].concat(this.symbolic[1]);
    }

    // Note that we are cheating here, and this definition of equality assumes
    // that the rationals have already been simplified and a common ordering applied
    equals(that) {
        return this.toString() === that.toString();
    }

    times(that) {
        const numer = this.getNumer().concat(that.getNumer());
        const denom = this.getDenom().concat(that.getDenom());
    
        return new Rational(numer, denom);
    }

    divide(that) {
        const numer = this.getNumer().concat(that.getDenom());
        const denom = this.getDenom().concat(that.getNumer());
    
        return new Rational(numer, denom);
    }

    pow(exponent) {
        if (exponent < 0) {
            return (new Rational(1)).divide(this.pow(-exponent));
        }
        if (exponent === 0) {
            return new Rational(1);
        }
        if (exponent === 1) {
            return this;
        }
    
        return this.times(this.pow(exponent - 1));
    }
    
    toString() {
        return [literalAsString(this.literal), symbolicAsString(this.symbolic)]
            .filter(str => str.length > 0)
            .join(' ');
    }
}

module.exports = Rational;

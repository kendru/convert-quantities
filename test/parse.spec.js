const { expect } = require('chai');
const system = require('../src/system');
const Dimension = require('../src/Dimension');
const Unit = require('../src/Unit');
const parse = require('../src/parse');

const { METRE, SECOND } = system.SI;

describe('Parsing Module Tests', function () {

    it('should parse a valid expression with a numerator and denominator into a derived unit', function () {
        const expectedUnit = METRE.pow(3).divide(SECOND.pow(2));
        expect(parse('m^3 / s^2').equals(expectedUnit)).to.equal(true);
    });

    it('should parse a valid expression with multiplied units into a derived unit', function () {
        const expectedUnit = METRE.times(SECOND.pow(2));
        expect(parse('m*s^2').equals(expectedUnit)).to.equal(true);
    });

    it('should deal with multi-character identifiers', function () {
        const expectedUnit = new Unit(Dimension.NONE, 'abc');
        expect(parse('abc').equals(expectedUnit)).to.equal(true);
    });

    it('should deal with multi-character numbers', function () {
        const expectedUnit = METRE.pow(12);
        expect(parse('m^12').equals(expectedUnit)).to.equal(true);
    });

    describe('Parsing whitespace', function () {
        const expectedUnit = METRE.divide(SECOND);

        it('should ignore leading whitespace', function () {
            expect(parse('\n     \t   m/s').equals(expectedUnit)).to.equal(true);
        });

        it('should ignore trailing whitespace', function () {
            expect(parse('m/s\n\t       \n').equals(expectedUnit)).to.equal(true);
        });

        it('should ignore intervening whitespace', function () {
            expect(parse('m    \n /\n\t  s').equals(expectedUnit)).to.equal(true);
        });
    });

    describe('Parsing numbers', function () {
        it('should parse exponents with explicit positive sign', function () {
            const expectedUnit = METRE.pow(2);
            expect(parse('m^+2').equals(expectedUnit)).to.equal(true);
        });

        it('should parse exponents with explicit negative sign', function () {
            try {
                parse('m^-2');
            } catch (e) {
                if (e.type === 'ParseException') {
                    expect(false).to.equal(true, 'Parse error thrown for negative exponent');
                }

                // Note that although the parsing should succeed, we do not currently
                // support negative powers being applied to units, so we will get an
                // exception when the expression is evaluated
            }
        });
    });

    describe('Error conditions', function () {
        it('should throw an error when an invalid token is encountered', function () {
            const badLex = () => parse('a&%,');

            expect(badLex).to.throw();
        });

        it('should throw an error when multiple operators in a row are encountered', function () {
            const badParse = () => parse('m^2 * * s');

            expect(badParse).to.throw();
        });

        it('should throw an error when multiple signs in a row are encountered', function () {
            const badParse = () => parse('m^++2');

            expect(badParse).to.throw();
        });

        it('should throw an error when an exponent is not a number', function () {
            const badParse1 = () => parse('m^m');
            const badParse2 = () => parse('m^+m');
            const badParse3 = () => parse('m^-m');

            expect(badParse1).to.throw();
            expect(badParse2).to.throw();
            expect(badParse3).to.throw();
        });

        it('should throw an error when an expression has a trailing "/"', function () {
            const badParse = () => parse('m /');

            expect(badParse).to.throw();
        });

        it('should throw an error when an expression has a more than 1 "/"', function () {
            const badParse = () => parse('m / s / s');

            expect(badParse).to.throw();
        });
    });
});
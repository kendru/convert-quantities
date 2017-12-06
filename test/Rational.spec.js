const { expect } = require('chai');
const Rational = require('../src/Rational');

describe('Rationals Module Tests', function () {

    describe('Literals', function () {
        it('should create a literal value', function () {
            const fortyTwo = new Rational(42);
            expect(fortyTwo).to.be.instanceof(Rational);
        });

        it('should assign a value a string representation', function () {
            const fortyTwo = new Rational(42);
            expect(fortyTwo.toString()).to.equal('42');
        });

        it('should equate two equal values', function () {
            const fortyTwo = new Rational(42);
            const alsoFortyTwo = new Rational(42);

            expect(fortyTwo.equals(alsoFortyTwo)).to.equal(true);
        });

        it('should not equate two unequal values', function () {
            const fortyTwo = new Rational(42);
            const one = new Rational(1);

            expect(fortyTwo.equals(one)).to.equal(false);
        });

        it('should multiply two numbers', function () {
            const seven = new Rational(7);
            const two = new Rational(2);

            expect(seven.times(two).toString()).to.equal('14');
        });

        it('should divide two numbers', function () {
            const six = new Rational(6);
            const two = new Rational(2);

            expect(six.divide(two).toString()).to.equal('3');
        });

        it('should raise numbers to positive powers', function () {
            const two = new Rational(2);

            expect(two.pow(8).toString()).to.equal('256');
        });

        it('should raise numbers to negative powers', function () {
            const two = new Rational(2);

            expect(two.pow(-8).toString()).to.equal('1/256');
        });

        it('should return a unit value when raising to the zeroth power', function () {
            const num = new Rational(123);
            const unitValue = new Rational(1);

            expect(num.pow(0).equals(unitValue)).to.equal(true);
        });
    });

    describe('Symbols', function () {
        it('should create a symbol', function () {
            const x = new Rational('X');
            expect(x).to.be.instanceof(Rational);
        });

        it('should assign a symbol a string representation', function () {
            const x = new Rational('X');
            expect(x.toString()).to.equal('X');
        });

        it('should equate two equal symbols having the same symbol', function () {
            const x = new Rational('X');
            const alsoX = new Rational('X');

            expect(x.equals(alsoX)).to.equal(true);
        });

        it('should not equate two symbolic values having different symbols', function () {
            const x = new Rational('X');
            const y = new Rational('Y');

            expect(x.equals(y)).to.equal(false);
        });

        describe('multiplication', function () {
            it('should generate a correct string representation', function () {
                const x = new Rational('X');
                const y = new Rational('Y');

                expect(x.times(y).toString()).to.equal('X*Y');
            });

            it('should use exponential syntax when the same symbol is multiplied', function () {
                const x = new Rational('X');

                expect(x.times(x).toString()).to.equal('X^2');
            });

            it('should multiply by a rational', function () {
                const x = new Rational('X');
                const rat = new Rational('Y', 'Z');

                expect(x.times(rat).toString()).to.equal('X*Y/Z');
            });

            it('should obey the commutative property', function () {
                const x = new Rational('X');
                const y = new Rational('Y');

                expect(x.times(y).equals(y.times(x))).to.equal(true);
            });
        });

        describe('division', function () {

            it('should generate the correct string representation', function () {
                const x = new Rational('X');
                const y = new Rational('Y');

                expect(x.divide(y).toString()).to.equal('X/Y');
            });

            it('should use exponential syntax', function () {
                const x = new Rational('X');
                const y = new Rational('Y');

                expect(x.divide(y).divide(y).toString()).to.equal('X/Y^2');
            });

            it('should divide by another rational with numerator and denominator', function () {
                const x = new Rational('X');
                const rat = new Rational('Y', 'Z');

                expect(x.divide(rat).toString()).to.equal('X*Z/Y');
            });

            it('should not commute division', function () {
                const x = new Rational('X');
                const y = new Rational('Y');

                expect(x.divide(y).equals(y.divide(x))).to.equal(false);
            });
        });

        describe('exponentiation', function () {

            it('should raise a symbol to a positive power', function () {
                const x = new Rational('X');

                expect(x.pow(3).toString()).to.equal('X^3');
            });

            it('should raise a symbol to a negative power', function () {
                const x = new Rational('X');

                expect(x.pow(-3).toString()).to.equal('1/X^3');
            });
        });
    });

    describe('Rationals', function () {
        it('should create a rational of irreducible values', function () {
            const oneHalf = new Rational(1, 2);

            expect(oneHalf.toString()).to.equal('1/2');
        });

        it('should use a default denominator of 1', function () {
            const two = new Rational(2);

            expect(two.toString()).to.equal('2');
        });

        it('should evaluate numerators of values', function () {
            const threeHalves = new Rational([1, 3], 2);

            expect(threeHalves.toString()).to.equal('3/2');
        });

        it('should evaluate denominators of values', function () {
            const twoThirds = new Rational(2, [1, 3]);

            expect(twoThirds.toString()).to.equal('2/3');
        });

        it('should simplify literal values', function () {
            const twoFourths = new Rational(2, 4);

            expect(twoFourths.toString()).to.equal('1/2');
        });

        it('should create a rational of symbolic values', function () {
            const xOverY = new Rational('x', 'y');

            expect(xOverY.toString()).to.equal('x/y');
        });

        it('should evaluate numerators of symbols', function () {
            const rat = new Rational(['x', 'y'], 'z');

            expect(rat.toString()).to.equal('x*y/z');
        });

        it('should evaluate denominators of symbols', function () {
            const rat = new Rational('x', ['y', 'z']);

            expect(rat.toString()).to.equal('x/y*z');
        });

        it('should use exponent notation', function () {
            const xsOverY = new Rational(['x', 'x', 'x'], 'y');

            expect(xsOverY.toString()).to.equal('x^3/y');
        });

        it('should simplify rationals of symbols', function () {
            const rat1 = new Rational(['x', 'y'], ['y', 'z']);
            const rat2 = new Rational(['x', 'x', 'x'], ['x', 'x']);

            expect(rat1.toString()).to.equal('x/z');
            expect(rat2.toString()).to.equal('x');
        });

        it('should create basic rationals with literal and symbolic components', function () {
            const fiveX = new Rational([5, 'x']);

            expect(fiveX.toString()).to.equal('5 x');
        });

        it('should create more complicated rationals with literal and symbolic components', function () {
            const fiveXOverThreeY = new Rational([5, 'x'], [3, 'y']);

            expect(fiveXOverThreeY.toString()).to.equal('5/3 x/y');
        });

        it('should simplify rationals with both literal and symbolic components', function () {
            const complicated = new Rational([2, 'x', 'x', 'y'], ['y', 4, 'z']);

            expect(complicated.toString()).to.equal('1/2 x^2/z');
        });

        it('should correctly determine equality of an all-literal rational', function () {
            const oneHalf = new Rational(1, 2);
            const twoFourths = new Rational(2, 4);
            const twoThirds = new Rational(2, 3);

            expect(oneHalf.equals(twoFourths)).to.equal(true);
            expect(oneHalf.equals(twoThirds)).to.equal(false);
        });

        describe('multiplication', function () {

            it('should multiply two all-literal expressions', function () {
                const oneHalf = new Rational(1, 2);
                const twoThirds = new Rational(2, 3);

                expect(oneHalf.times(twoThirds).toString()).to.equal('1/3');
            });

            it('should multiply two all-symbolic expressions', function () {
                const sym1 = new Rational('x', 'y');
                const sym2 = new Rational('a', 'b');

                expect(sym1.times(sym2).toString()).to.equal('a*x/b*y');
            });

            it('should multiply two mixed expressions', function () {
                const oneHalf = new Rational('1', '2');
                const sym = new Rational('a', 'b');

                expect(oneHalf.times(sym).toString()).to.equal('1/2 a/b');
            });

            it('should commute multilication all-symbolic expressions', function () {
                const oneHalf = new Rational('1', '2');
                const sym = new Rational('a', 'b');
                const mixed = new Rational(['b', 'c', 9], [3, 'x']);

                expect(oneHalf.times(sym).times(mixed).equals(mixed.times(oneHalf).times(sym))).to.equal(true);
            });
        });

        describe('division', function () {

            it('should divide two all-literal expressions', function () {
                const oneHalf = new Rational(1, 2);
                const twoThirds = new Rational(2, 3);

                expect(oneHalf.divide(twoThirds).toString()).to.equal('3/4');
            });

            it('should divide two all-symbolic expressions', function () {
                const sym1 = new Rational('x', 'y');
                const sym2 = new Rational('a', 'b');

                expect(sym1.divide(sym2).toString()).to.equal('b*x/a*y');
            });

            it('should divide two mixed expressions', function () {
                const oneHalf = new Rational('1', '2');
                const sym = new Rational('a', 'b');

                expect(oneHalf.divide(sym).toString()).to.equal('1/2 b/a');
            });
            it('should not commute multilication all-symbolic expressions', function () {
                const oneHalf = new Rational('1', '2');
                const sym = new Rational('a', 'b');
                const mixed = new Rational(['b', 'c', 9], [3, 'x']);

                expect(oneHalf.divide(sym).divide(mixed).equals(mixed.divide(oneHalf).divide(sym))).to.equal(false);
            });
        });

        describe('exponentiation', function () {

            it('should raise all terms in an all-literal expression to a power', function () {
                const twoThirds = new Rational(2, 3);

                expect(twoThirds.pow(2).toString()).to.equal('4/9');
            });

            it('should raise all terms in an all-symbolic expression to a power', function () {
                const sym = new Rational('x', 'y');

                expect(sym.pow(2).toString()).to.equal('x^2/y^2');
            });

            it('should raise all terms in an mixed expression to a power', function () {
                const mixed = new Rational([2, 'x'], [3, 'y']);

                expect(mixed.pow(2).toString()).to.equal('4/9 x^2/y^2');
            });
        });
    });
});

const Rational = require('./Rational');

/**
 * Dimensions describe a type of measurement within which it is
 * meaningful to perform conversions. For instance, centimetres may
 * be converted to metres because they are both units of length, but
 * centemetres may not be converted to seconds because one is a unit
 * of length and the other is a unit of time.
 *
 * Note on implementation:
 * - A _unit property is created that holds an object that is used for
 * keeping track of
 *
 * Note that we are using the the dimensions of the recommended
 * SI base units <http://en.wikipedia.org/wiki/SI_base_unit>, which
 * can express any physical quantity.
 */
class Dimension {
    
    constructor(symbolOrRational) {
        if (symbolOrRational instanceof Rational) {
            this.representation = symbolOrRational;
        } else {
            this.representation = new Rational(symbolOrRational);
        }
    }

    /**
     * Multiply dimension by another dimension
     *
     * @param {Dimension} other
     * @return {Dimension}
     */
    times(other) {
        return new Dimension(this.representation.times(other.representation));
    }

    /**
     * Divide dimension by another dimension
     *
     * @param {Dimension} other
     * @return {Dimension}
    */
    divide(other) {
        return new Dimension(this.representation.divide(other.representation));
    }

    /**
     * Raise dimension to an integer power
     *
     * @param {Number} n
     * @return {Dimension}
     */
    pow(n) {
        return new Dimension(this.representation.pow(n));
    }

    toString() {
        return this.representation.toString();
    }

    /**
     * Determine dimension equality.
     *
     * Dimensions are considered to be equal if their symbolic represenations are equal.
     *
     * @param {Dimension} other
     * @return {Boolean}
     */
    equals(other) {
        return this.representation.equals(other.representation);
    }
}

Dimension.NONE = new Dimension(1); // no symbolic representation
Dimension.LENGTH = new Dimension('L');
Dimension.MASS = new Dimension('M');
Dimension.TIME = new Dimension('T');
Dimension.ELECTRIC_CURRENT = new Dimension('I');
Dimension.TEMPERATURE = new Dimension('θ');
Dimension.AMOUNT_OF_SUBSTANCE = new Dimension('N');
Dimension.LUMINOUS_INTENSITY = new Dimension('J');

module.exports = Dimension;
const { IncompatibleUnitsError } = require('./errors');

/**
 * Converts the value of the "other" Quantity to the units of the "self" Quantity
 * 
 * @param {Quantity} self
 * @param {Quantity} other
 * @return {Object}
 * @throws {IncompatibleUnitsError}
 */
function convertValue (self, other) {
    if (!self.unit.dimension.equals(other.unit.dimension)) {
        throw new IncompatibleUnitsError(`${self.unit} is not compatible with ${other.unit}`);
    }

    return other.as(self.unit).value;
}

class Quantity {

    /**
     * Quantity constructor
     *
     * @param {Object} value
     * @param {Unit} unit
     */
    constructor(value, unit) {
        this.value = value;
        this.unit = unit;
    };

    /**
     * Multiply one quantity by another
     *
     * Multiplies the value and the units of two quantities. If two
     * quantities of 5 metres are miltiplied, the result would be 25
     * *square* meters, since two units of length form a unit of area
     * when multiplied.
     *
     * @param {Quantity} other
     * @return {Quantity}
     */
    times(other) {
        return new Quantity(this.value * other.value, this.unit.times(other.unit));
    }

    /**
     * Divide one quantity by another
     *
     * Divides the value as well as the units of two quantities.
     *
     * @param {Quantity} other
     * @return {Quantity}
     */
    divide(other) {
        return new Quantity(this.value / other.value, this.unit.divide(other.unit));
    }

    /**
     * Adds a quantity
     *
     * Uses the unit of the lefthand quantity when the units differ.
     *
     * @param {Quantity} other
     * @return {Quantity}
     */
    add(other) {
        return new Quantity(this.value + convertValue(this, other), this.unit);
    }

    /**
     * Subtracts a quantity
     *
     * Uses the unit of the lefthand quantity when the units differ.
     *
     * @param {Quantity} other
     * @return {Quantity}
     */
    subtract(other) {
        return new Quantity(this.value - convertValue(this, other), this.unit);
    }

    /**
     * Creates a quantity converted to a new unit
     *
     * Converts quantity into terms of another unit. The original
     * unit and target unit must be of the same dimension.
     *
     * @param {Unit} targetUnit
     * @param {Quantity}
     * @throws {IncompatibleUnitsError}
     */
    as(targetUnit) {
        if (!this.unit.dimension.equals(targetUnit.dimension)) {
            throw new IncompatibleUnitsError(`${this.unit} is not compatible with ${targetUnit}`);
        }

        if (this.unit.equals(targetUnit)) {
            return this;
        }

        const val = targetUnit.transformation.unapply(
            this.unit.transformation.apply(this.value)
        );

        return new Quantity(val, targetUnit);
    };

    toString() {
        return `${this.value} ${this.unit.toString()}`;
    }

    getValue(precision = null) {
        if (precision === null) {
            return this.value;
        }

        const places = Math.pow(10, precision);
        return Math.floor(this.value * places) / places;
    }

    /**
     * Test two quantities for equality
     *
     * If the quantites are in the same unit, they are equal if their values are equal.
     * If the quantites are in different units of the same dimension, they are equal if
     * they can be converted to the same value in some unit. If the quantities are in
     * different units in different dimensions, and Exception is thrown, since equality
     * across dimesnions is not defined.
     *
     * Since the floating point arithmetic that occurs in performing conversions affects
     * the value, the a precision may be given. If specified, the values are only checked
     * for equality to `precision` decimal places.
     *
     * @param {Quantity} other
     * @param {Number} Optional number of digits of precision to consider
     * @return {Boolean}
     * @throws {IncompatibleUnitsError}
     */
    equals(other, precision) {
        if (!this.unit.dimension.equals(other.unit.dimension)) {
            throw new IncompatibleUnitsError(`Cannot equate quantities of units in incompatible dimensions (${this.unit.dimension}, ${other.unit.dimension})`);
        }

        if (this.unit.equals(other.unit)) {
            return this.getValue(precision) === other.getValue(precision);
        }

        return this.equals(other.as(this.unit));
    }
}

module.exports = Quantity;
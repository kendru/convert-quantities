const Rational = require('./Rational');
const Pipeline = require('./Pipeline');
const PipelineOperation = require('./PipelineOperation');
const { InvalidArgumentError } = require('./errors');

const type_ = Symbol('type');
const BASE = Symbol('type:base');
const DERIVED = Symbol('type:derived');

function asDerived(unit) {
    unit[type_] = DERIVED;
    return unit;
}

/**
 * A unit may be a base unit or a derived unit, defined in terms
 * of an affine transformation of the base unit.
 *
 * Units have string representation.
 *
 * Units are independent of other entities.
 */
class Unit {

    constructor(dimension, representation) {
        this.dimension = dimension;
        this.representation = (representation instanceof Rational) ?
            representation :
            new Rational(representation);
        this.transformation = new Pipeline();
        this[type_] = BASE;
    };

    get isBase() {
        return this[type_] === BASE;
    }

    toString() {
        return this.representation.toString();
    }

    times(unitOrScalar, symbol = null) {
        let dimension;
        let transformation;
        const representation = (symbol === null) ? 
            this.representation.times(unitOrScalar.representation) :
            new Rational(symbol);

        if (unitOrScalar instanceof Unit) {
            dimension = this.dimension.times(unitOrScalar.dimension);
            transformation = unitOrScalar.transformation;
        } else {
            dimension = this.dimension;
            transformation = new Pipeline(PipelineOperation.multiply(unitOrScalar));
        }

        const newUnit = asDerived(new Unit(dimension, representation));
        newUnit.transformation.concat(this.transformation).concat(transformation);
        return newUnit;
    }

    divide(unitOrScalar, symbol = null) {
       let dimension;
       let transformation;
       const representation = (symbol === null) ? 
           this.representation.divide(unitOrScalar.representation) :
           new Rational(symbol);

       if (unitOrScalar instanceof Unit) {
           dimension = this.dimension.divide(unitOrScalar.dimension);
           transformation = unitOrScalar.transformation.inverse;
       } else {
           dimension = this.dimension;
           transformation = new Pipeline(PipelineOperation.divide(unitOrScalar));
       }

       const newUnit = asDerived(new Unit(dimension, representation));
       newUnit.transformation.concat(this.transformation).concat(transformation);
       return newUnit;
    }

    /**
     * Add a scalar to a unit.
     * 
     * We are assuming that only scalars may be added to units.
     * Furthermore, there is no subtract method due to the fact that an amout
     * may be subreacted simply by adding -amount.
     *
     * @param {Number} amount
     * @param {String} symbol Symbol to use for new unit
     * @return {DerivedUnit}
     */
    add(amount, symbol) {
        var representation = new Rational(symbol),
            newUnit = asDerived(new Unit(this.dimension, representation));

        newUnit.transformation.push(PipelineOperation.add(amount));
        newUnit.transformation.concat(this.transformation);
        return newUnit;
    }

    /**
     * Raise a unit to a power.
     *
     * Note that only positive powers are supported here and that raising
     * a unit to a power produces a unit of a different dimension. E.g.
     * Metre is a measure of length, but Metre raised to the second power
     * is a measure of area.
     *
     * @param {Number} n A positive integral power
     * @return {Unit}
     */
    pow(n) {
        if (n < 1) {
            throw new InvalidArgumentError('Power must be >= 1');
        }
        if (n === 1) {
            return this;
        }

        return this.times(this.pow(n - 1));
    }

    /**
     * Check for unit equality.
     *
     * Units are considered equal if they have the same symbolic representation.
     *
     * @param {Unit} other
     * @return {Boolean}
     */
    equals(other) {
        return this.representation.equals(other.representation);
    }
}

Unit.BASE = BASE;
Unit.DERIVED = DERIVED;

module.exports = Unit;
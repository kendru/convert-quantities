const Quantity = require('./Quantity');

const num_ = Symbol('num');
const str_ = Symbol('str');
/**
 * Data type to hold string and numeric values
 * as they pass through a transformation.
 */
class Intermediate {

    constructor(num, str = null) {
        this[num_] = num;
        this[str_] = str;
    }

    valueOf() {
        return this[num_];
    }

    toString() {
        return this[str_] !== null ? this[str_] : String(this.valueOf());
    }
}


const transformations_ = Symbol('transformations');
class Converter {

    constructor(transformations = []) {
        this[transformations_] = transformations;
    }

    get transformations() {
        return this[transformations_];
    }

    /**
     * Transforms a quantity or raw value into a string representation
     *
     * @param {Quantity|Object} value
     * @return {String}
     */
    apply(value) {
        const initial = (value instanceof Quantity) ? value.getValue() : value;

        return this.transformations.reduce((acc, xf) => xf(acc), initial).toString();
    }

    /**
     * Append a transformation function to the converter
     * 
     * @param {Function} transformation Function with the
     * following signature: Function<A, Function<A, Intermediate>>
     */
    then(transformation) {
        this.transformations.push(transformation);
        return this;
    }

    /**
     * Concatenate another conversion pipeline to create a new Converter
     *
     * @param {Converter} other
     * @return {Converter}
     */
    concat(other) {
        return new Converter([ ...this.transformations, ...other.transformations ]);
    }
}

Converter.Intermediate = Intermediate;
/**
 * Each transform has the following type signature:
 * Function<A, Function<A, Intermediate>>
 * 
 * Each function is required to return an Intermediate
 * because while some transformation affect the numeric
 * value, others affect the string representation; and
 * we do not want to convert between string and number
 * inside each transformation.
 */
Converter.transformations = {
    divideBy: x => val => new Intermediate(val / x),
    multiplyBy: x => val => new Intermediate(val * x),
    roundTo: (x, keepTrailingZeros) =>
        val => {
            const places = Math.pow(10, x);
            let result = (Math.round(val * places) / places).toFixed(x);

            if (!keepTrailingZeros) {
                result = result.replace(/\.0+$/, '');
            }

            return new Intermediate(+result, result + '');
        },

    prefixWith: s => val => new Intermediate(+val, `${s}${val}`),
    suffixWith: s => val => new Intermediate(+val, `${val}${s}`),
    groupDigitsBy: (groupSize, separator = ',') =>
        val => {
            const x = val.toString().split('.');
            let [ x1 ] = x;
            const x2 = x.length > 1 ? '.' + x[1] : '';
            const rgx = new RegExp('(\\d+)(\\d{' + groupSize + '})');

            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + separator + '$2');
            }

            return new Intermediate(+val, x1 + x2);
        }
};

Converter.registerTransformation = (name, xf) => Converter.transformations[name] = xf;

module.exports = Converter;
const { expect } = require('chai');
const system = require('../src/system');
const Quantity = require('../src/Quantity');
const Converter = require('../src/Converter');

const { METRE, ONE } = system.SI;
const { divideBy, multiplyBy, roundTo, prefixWith, suffixWith, groupDigitsBy } = Converter.transformations;

describe('Display conversions', function () {
    describe('transformations', function () {
        
        it('should divide by a number', function () {
            const result = divideBy(5)(50);

            expect(result.valueOf()).to.equal(10);
            expect(result.toString()).to.equal('10');
        });

        it('should multiply by a number', function () {
            const result = multiplyBy(5)(4);

            expect(result.valueOf()).to.equal(20);
            expect(result.toString()).to.equal('20');
        });

        it('should round to a given number of decimal places', function () {
            const result = roundTo(2)(12.345);

            expect(result.valueOf()).to.equal(12.35);
            expect(result.toString()).to.equal('12.35');
        });

        it('should drop trailing zeros by default', function () {
            const result = roundTo(2)(12);

            expect(result.toString()).to.equal('12');
        });

        it('should keep trailing zeros if specified', function () {
            const result = roundTo(2, true)(12);

            expect(result.toString()).to.equal('12.00');
        });

        it('should prefix with a value', function () {
            const result = prefixWith('$')(100);

            expect(result.valueOf()).to.equal(100);
            expect(result.toString()).to.equal('$100');
        });

        it('should suffix with a value', function () {
            const result = suffixWith('K')(5);

            expect(result.valueOf()).to.equal(5);
            expect(result.toString()).to.equal('5K');
        });

        it('should group digits into groups with specified size', function () {
            const result = groupDigitsBy(3, ',')(100000);

            expect(result.valueOf()).to.equal(100000);
            expect(result.toString()).to.equal('100,000');
        });

        it('should make the first group smaller when digits % group size > 0', function () {
            const result = groupDigitsBy(3, ',')(1000000);

            expect(result.valueOf()).to.equal(1000000);
            expect(result.toString()).to.equal('1,000,000');
        });

        it('should not group digits after the decimal point', function () {
            const result = groupDigitsBy(3, ',')(1000.123123);

            expect(result.valueOf()).to.equal(1000.123123);
            expect(result.toString()).to.equal('1,000.123123');
        });

        it('should use the specified separator', function () {
            const result = groupDigitsBy(3, ':')(1000);

            expect(result.valueOf()).to.equal(1000);
            expect(result.toString()).to.equal('1:000');
        });

        it('should default to use a comma as the separator', function () {
            const result = groupDigitsBy(3)(1000);

            expect(result.valueOf()).to.equal(1000);
            expect(result.toString()).to.equal('1,000');
        });

        it('should allow transformations of arbitrary types', function () {
            const addDay = function (dateStr) {
                    const dt = new Date(dateStr);
                    return new Date(dt.setDate(dt.getDate() + 1));
                },
                qty = new Quantity('January 21, 1964', ONE),
                c = new Converter([addDay]),
                result = c.apply(qty);

            expect(result).to.contain('22');
        });
    });

    describe('Converter objects', function () {
        const qty = new Quantity(50, METRE);

        it('should convert with a single transformer', function () {
            const c = new Converter([divideBy(10)]);
            expect(c.apply(qty)).to.equal('5');
        });

        it('should convert with a multiple transformers', function () {
            const transformations = [
                    multiplyBy(100),
                    roundTo(2, true),
                    groupDigitsBy(3, ','),
                    prefixWith('$')
                ];
            const c = new Converter(transformations);

            expect(c.apply(qty)).to.equal('$5,000.00');
        });

        it('should concatenate two converters together', function () {
            const c1 = new Converter([divideBy(1000)]);
            const c2 = new Converter([roundTo(1, true), suffixWith(' K')]);
            const c3 = c1.concat(c2);

            expect(c3.apply(5000)).to.equal('5.0 K');
        });

        it('should provide a fluent API for chaining transformations', function () {
            const divideBy2 = divideBy(2);
            const roundto1Place = roundTo(1, true);
            const c = new Converter()
                .then(divideBy2)
                .then(roundto1Place);

            expect(c.apply(qty)).to.equal('25.0');
        });

        it('should accept a raw numeric value', function () {
            const c = new Converter([divideBy(10)]);
            expect(c.apply(50)).to.equal('5');
        });
    });
});
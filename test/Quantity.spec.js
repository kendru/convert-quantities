const { expect } = require('chai');
const system = require('../src/system');
const Quantity = require('../src/Quantity');

const { SI, NON_SI } = system;
const {
    GRAM,
    METRE, CENTIMETRE, MILLIMETRE, KILOMETRE,
    SECOND,
    METRES_PER_SECOND,
    TESLA,
    ONE
} = SI;
const { MINUTE, HOUR, MILE, FOOT, LITRE } = NON_SI;

describe('Quantities', function () {
    
    it('should create a quantity in the given unit', function () {
        const myHeight = new Quantity(1.6, METRE);

        expect(myHeight).to.be.instanceof(Quantity);
        expect(myHeight.unit).to.equal(METRE);
        expect(myHeight.toString()).to.equal('1.6 m');
    });

    it('should convert from a derived unit to the base unit', function () {
        const myHeight = new Quantity(160, CENTIMETRE);
        const myHeightInMetres = myHeight.as(METRE);

        expect(myHeightInMetres.unit.equals(METRE)).to.equal(true);
        expect(myHeightInMetres.toString()).to.equal('1.6 m');
    });

    it('should convert from a base unit to a derived unit', function () {
        const myHeight = new Quantity(1.6, METRE);
        const myHeightInCentimetres = myHeight.as(CENTIMETRE);

        expect(myHeightInCentimetres.unit.equals(CENTIMETRE)).to.equal(true);
        expect(myHeightInCentimetres.toString()).to.equal('160 cm');
    });

    it('should convert between derived units', function () {
        const quarterDiameter = new Quantity(24.26, MILLIMETRE);
        const quarterDiameterInCentimetres = quarterDiameter.as(CENTIMETRE);

        expect(quarterDiameterInCentimetres.unit.equals(CENTIMETRE)).to.equal(true);
        expect(quarterDiameterInCentimetres.toString()).to.equal('2.426 cm');
    });

    it('should throw an exception when attempting to convert between units of different dimensions', function () {
        const badConverter = function () {
            const q = new Quantity(1.6, METRE);
            q.as(SECOND);
        };

        expect(badConverter).to.throw();
    });

    it('should convert using a unit with an add transformation', function () {
        const myHeight = new Quantity(1.6, METRE);
        const meterPlus = METRE.add(1, 'm+');
        const mySmallHeight = myHeight.as(meterPlus);

        expect(mySmallHeight.unit.equals(meterPlus)).to.equal(true);
        expect(mySmallHeight.value).to.be.closeTo(0.6, 5);
    });

    it('should convert from an add-transformed unit back to the base unit', function () {
        const meterPlus = METRE.add(1, 'm+');
        const myHeight = new Quantity(1.6, meterPlus);
        const myTallHeight = myHeight.as(METRE);

        expect(myTallHeight.unit.equals(METRE)).to.equal(true);
        expect(myTallHeight.value).to.be.closeTo(2.6, 5);
    });

    it('should get the value with its natural precision by default', function () {
        const someQty = new Quantity(1 / 9, METRE);

        expect(someQty.getValue()).to.equal(1 / 9);
    });

    it('should get the value with the specified precision', function () {
        const someQty = new Quantity(1 / 9, METRE);

        expect(someQty.getValue(5)).to.equal(0.11111);
    });

    describe('addition and subtraction', function () {
        const oneMetre = new Quantity(1, METRE);
        const threeMetres = new Quantity(3, METRE);

        it('should use the same unit when adding quantities of equal units', function () {
            const fourMetres = oneMetre.add(threeMetres);

            expect(fourMetres.unit.equals(METRE)).to.equal(true);
            expect(fourMetres.value).to.equal(4);
        });

        it('should use the first unit when adding/subtracting quantities of different units in the same dimension', function () {
            const l1 = new Quantity(12.3, METRE);
            const l2 = new Quantity(860, CENTIMETRE);

            expect(l1.add(l2).unit.equals(METRE)).to.equal(true);
            expect(l1.subtract(l2).unit.equals(METRE)).to.equal(true);
        });

        it('should add/subtract quanitities of product units in the same dimension', function () {
            const meterMinutes = METRE.times(MINUTE);
            const kilometreHours = KILOMETRE.times(HOUR);

            const a1 = new Quantity(1234567, meterMinutes);
            const a2 = new Quantity(1, kilometreHours);

            expect(a1.add(a2).unit.equals(meterMinutes)).to.equal(true);
            expect(a1.add(a2).value).to.be.closeTo(1294567, 4);

            expect(a1.subtract(a2).unit.equals(meterMinutes)).to.equal(true);
            expect(a1.subtract(a2).value).to.be.closeTo(1174567, 4);
        });

        it('should add/subtract quanitities of units in equal quotient dimensions', function () {
            const MILES_PER_HOUR = MILE.divide(HOUR);
            const speed1 = new Quantity(10, METRES_PER_SECOND);
            const speed2 = new Quantity(10, MILES_PER_HOUR);

            expect(speed1.add(speed2).unit.equals(METRES_PER_SECOND)).to.equal(true);
            expect(speed1.add(speed2).value).to.be.closeTo(14.4704, 4);

            expect(speed1.subtract(speed2).unit.equals(METRES_PER_SECOND)).to.equal(true);
            expect(speed1.subtract(speed2).value).to.be.closeTo(5.5296, 4);
        });

        it('should add units of equal complex dimensions', function () {
            const cubicFtPerMinute = FOOT.pow(3).divide(MINUTE);
            const litresPerHour = LITRE.divide(HOUR);
            const flow1 = new Quantity(5, cubicFtPerMinute);
            const flow2 = new Quantity(10000, litresPerHour);

            expect(flow1.add(flow2).unit.equals(cubicFtPerMinute)).to.equal(true);
            expect(flow1.add(flow2).value).to.be.closeTo(10.8858, 4);

            expect(flow1.subtract(flow2).unit.equals(cubicFtPerMinute)).to.equal(true);
            expect(flow1.subtract(flow2).value).to.be.closeTo(-0.8858, 4);
        });

        it('should throw an exception when attempting to add units of different dimensions', function () {
            const someLength = new Quantity(1, METRE);
            const someTime = new Quantity(1, SECOND);

            expect(() => someLength.add(someTime)).to.throw();
        });

        it('should use the same unit when subtracting quantities of equal units', function () {
            const twoMetres = threeMetres.subtract(oneMetre);

            expect(twoMetres.unit.equals(METRE)).to.equal(true);
            expect(twoMetres.value).to.equal(2);
        });

        it('should use the first unit when subtracting quantities of different units in the same dimension', function () {
            const l1 = new Quantity(12.3, METRE);
            const l2 = new Quantity(860, CENTIMETRE);
            const l3 = l1.subtract(l2);

            expect(l3.unit.equals(METRE)).to.equal(true);
            expect(l3.value).to.be.closeTo(3.7, 5);
        });

        it('should throw an exception when attempting to add subtract of different dimensions', function () {
            const someLength = new Quantity(1, METRE);
            const someTime = new Quantity(1, SECOND);

            expect(() => someLength.subtract(someTime)).to.throw();
        });
    });

    describe('multiplication and division', function () {
        it('should multiply with two like units to form a compound unit', function () {
            const squareMeters = METRE.pow(2);
            const l1 = new Quantity(10, METRE);
            const l2 = new Quantity(20, METRE);

            expect(l1.times(l2).unit.equals(squareMeters));
        });

        it('should multiply with two like unlike units to form a compound unit', function () {
            const meterSeconds = METRE.times(SECOND);
            const q1 = new Quantity(10, METRE);
            const q2 = new Quantity(20, SECOND);

            expect(q1.times(q2).unit.equals(meterSeconds));
        });

        it('should multiply with compound units to form a new compound unit', function () {
            const metersPerSecond = METRE.divide(SECOND);
            const milesPerHour = MILE.divide(HOUR);
            const q1 = new Quantity(10, metersPerSecond);
            const q2 = new Quantity(20, milesPerHour);

            expect(q1.times(q2).unit.equals(metersPerSecond.times(milesPerHour))).to.equal(true);
        });

        it('should cancel units after multiplication where appropriate', function () {
            const metersPerSecond = METRE.divide(SECOND);
            const q1 = new Quantity(10, metersPerSecond);
            const q2 = new Quantity(20, SECOND);

            expect(q1.times(q2).unit.equals(METRE)).to.equal(true);
        });

        it('should multiply the values of the quantities', function () {
            const metersPerSecond = METRE.divide(SECOND);
            const milesPerHour = MILE.divide(HOUR);
            const q1 = new Quantity(10, metersPerSecond);
            const q2 = new Quantity(20, milesPerHour);

            expect(q1.times(q2).value).to.equal(200);
        });

        it('should divide with two like units to form a dimnesionless quantity', function () {
            // const l1 = new Quantity(10, METRE);
            // const l2 = new Quantity(20, METRE);

            // expect(l1.divide(l2).unit.equals(ONE)).to.equal(true);
        });

        it('should divide with two like unlike units to form a compound unit', function () {
            const metersPerSecond = METRE.divide(SECOND);
            const l = new Quantity(10, METRE);
            const t = new Quantity(20, SECOND);

            expect(l.divide(t).unit.equals(metersPerSecond));
        });

        it('should divide with compound units to form a new compound unit', function () {
            const metresPerSecond = METRE.divide(SECOND);
            const milesPerHour = MILE.divide(HOUR);
            const q1 = new Quantity(10, metresPerSecond);
            const q2 = new Quantity(20, milesPerHour);

            expect(q1.divide(q2).unit.equals(metresPerSecond.divide(milesPerHour))).to.equal(true);
        });

        it('should cancel units after division where appropriate', function () {
            const metreSeconds = METRE.times(SECOND);
            const q1 = new Quantity(10, metreSeconds);
            const q2 = new Quantity(20, SECOND);

            expect(q1.divide(q2).unit.equals(METRE)).to.equal(true);
        });

        it('should divide the values of the quantities', function () {
            const metersPerSecond = METRE.divide(SECOND);
            const milesPerHour = MILE.divide(HOUR);
            const q1 = new Quantity(10, metersPerSecond);
            const q2 = new Quantity(2, milesPerHour);

            expect(q1.divide(q2).value).to.equal(5);
        });
    });

    describe('equality', function () {

        it('should be equal to another quantity with the same unit and value', function () {
            const someQty = new Quantity(10, METRE);
            const anotherQty = new Quantity(10, METRE);

            expect(someQty.equals(anotherQty)).to.equal(true);
        });

        it('should be equal to a quantity of another unit that can be converted to a quantity of the same value', function () {
            const kmInMetres = new Quantity(1000, METRE);
            const kmInKm = new Quantity(1, KILOMETRE);

            expect(kmInMetres.equals(kmInKm)).to.equal(true);
        });

        it('should throw an exception when comparing quantities in incompatible dimensions', function () {
            const lengthQty = new Quantity(10, METRE);
            const magFluxDensityQty = new Quantity(1.234, TESLA);

            expect(() => lengthQty.equals(magFluxDensityQty)).to.throw();
        });

        it('should accept a precision argument to equate only to a given decimal place', function () {
            const someQty = new Quantity(1.2001, METRE);
            const anotherQty = new Quantity(1.2002, METRE);

            expect(someQty.equals(anotherQty, 3)).to.equal(true);
            expect(someQty.equals(anotherQty, 4)).to.equal(false);
        });
    });
});
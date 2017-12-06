const { expect } = require('chai');
const system = require('../src/system');
const Dimension = require('../src/Dimension');
const Unit = require('../src/Unit');

const { SI, NON_SI } = system;
const { GRAM, METRE, SECOND } = SI;

describe('Units', function () {

    it('should create a unit with the same Dimension as its base unit', function () {
        const pigram = GRAM.times(Math.PI, 'πg');
    
        expect(pigram).to.be.instanceof(Unit);
        expect(pigram.dimension).to.equal(Dimension.MASS);
        expect(pigram.toString()).to.equal('πg');
    });

    it('should multiply like units together', function () {
        const squareMeters = METRE.times(METRE);
        const length = Dimension.LENGTH;

        expect(squareMeters.dimension.equals(length.times(length))).to.equal(true);
        expect(squareMeters.toString()).to.equal('m^2');
    });

    it('should multiply different units together', function () {
        const meterSeconds = METRE.times(SECOND);
        const lengthTime = Dimension.LENGTH.times(Dimension.TIME);

        expect(meterSeconds.dimension.equals(lengthTime)).to.equal(true);
        expect(meterSeconds.toString()).to.equal('m*s');
    });

    it('should give a unit of the same dimension when multiplying by a constant', function () {
        const length = Dimension.LENGTH;
        const moarMeterz = METRE.times(12345, 'mmz');

        expect(moarMeterz.dimension.equals(length)).to.equal(true);
        expect(moarMeterz.toString()).to.equal('mmz');
    });

    it('should add a scalar amount to a unit', function () {
        const length = Dimension.LENGTH;
        const mPlus = METRE.add(1, 'm+');

        expect(mPlus.dimension.equals(length)).to.equal(true);
        expect(mPlus.toString()).to.equal('m+');
    });

    it('should form a dimensionless unit when dividing like units', function () {
        const dimensionless = Dimension.NONE;

        expect(METRE.divide(METRE).dimension.equals(dimensionless)).to.equal(true);
        expect(METRE.divide(METRE).toString()).to.equal('');
    });

    it('should form a composite unit when dividing different units', function () {
        const metersPerSecond = METRE.divide(SECOND);
        const expectedDimension = Dimension.LENGTH.divide(Dimension.TIME);

        expect(metersPerSecond.dimension.equals(expectedDimension)).to.equal(true);
        expect(metersPerSecond.toString()).to.equal('m/s');
    });

    it('should raise a unit to a power', function () {
        const volume = Dimension.LENGTH.pow(3);
        const cubicMeter = METRE.pow(3);

        expect(cubicMeter.dimension.equals(volume)).to.equal(true);
        expect(cubicMeter.toString()).to.equal('m^3');
    });

    it('should throw an exception when trying to raise to a non-positive power', function () {
        const zeroPower = () => METRE.pow(0);
        const negativePower = () => METRE.pow(-1);

        expect(zeroPower).to.throw();
        expect(negativePower).to.throw();
    });

    it('should equate two units of the same representation and dimension', function () {
        expect(METRE.equals(METRE)).to.equal(true);
        expect(METRE.times(METRE).equals(METRE.pow(2))).to.equal(true);
    });
});
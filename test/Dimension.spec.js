const { expect } = require('chai');
const Dimension = require('../src/Dimension');

describe('Dimensions', function() {

    it('should define the suggested SI base dimensions', function () {
        expect(Dimension.NONE).to.be.instanceof(Dimension);
        expect(Dimension.LENGTH).to.be.instanceof(Dimension);
        expect(Dimension.MASS).to.be.instanceof(Dimension);
        expect(Dimension.TIME).to.be.instanceof(Dimension);
        expect(Dimension.ELECTRIC_CURRENT).to.be.instanceof(Dimension);
        expect(Dimension.TEMPERATURE).to.be.instanceof(Dimension);
        expect(Dimension.AMOUNT_OF_SUBSTANCE).to.be.instanceof(Dimension);
        expect(Dimension.LUMINOUS_INTENSITY).to.be.instanceof(Dimension);
    });

    it('should multiply dimensions', function () {
        const length = Dimension.LENGTH;
        const area = length.times(length);
        expect(area).to.be.instanceof(Dimension);
    });

    it('should treat multiplication by the dimensionless dimension as a unit operation', function () {
        const unit = Dimension.NONE;
        const length = Dimension.MASS;

        expect(length.times(unit).equals(length)).to.equal(true);
    });

    it('should divide dimensions', function () {
        const length = Dimension.LENGTH;
        const time = Dimension.LENGTH;
        const speed = length.divide(time);
        
        expect(speed).to.be.instanceof(Dimension);
    });

    it('should treat division by the dimensionless dimension as a unit operation', function () {
        const unit = Dimension.NONE;
        const length = Dimension.MASS;

        expect(length.divide(unit).equals(length)).to.equal(true);
    });

    it('should raise dimensions to integer powers', function () {
        const length = Dimension.LENGTH;
        const volume = length.pow(3);

        expect(volume).to.be.instanceof(Dimension);
    });

    it('should equate dimensions of the same order', function () {
        const length = Dimension.LENGTH;
        const volume = length.pow(3);
        
        expect(length.times(length).equals(volume.divide(length))).to.equal(true);
    });

    it('should have a string representaion', function () {
        expect(Dimension.NONE.toString()).to.equal('');
        expect(Dimension.LENGTH.toString()).to.equal('L');
        expect(Dimension.MASS.toString()).to.equal('M');
        expect(Dimension.TIME.toString()).to.equal('T');
        expect(Dimension.ELECTRIC_CURRENT.toString()).to.equal('I');
        expect(Dimension.TEMPERATURE.toString()).to.equal('θ');
        expect(Dimension.AMOUNT_OF_SUBSTANCE.toString()).to.equal('N');
        expect(Dimension.LUMINOUS_INTENSITY.toString()).to.equal('J');
    });
});
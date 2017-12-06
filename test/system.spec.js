const { expect } = require('chai');
const Dimension = require('../src/Dimension');
const Unit = require('../src/Unit');
const system = require('../src/system');

const { METRE } = system.SI;
const { FOOT } = system.NON_SI;
const { LENGTH } = Dimension

describe('System module tests', function () {

    afterEach(function () {
        system.restore();
    });

    it('should retrieve an SI unit', function () {
        expect(system.lookup('m')).to.equal(METRE);
    });

    it('should retrieve a non-SI unit', function () {
        expect(system.lookup('ft')).to.equal(FOOT);
    });

    it('should return undefined on an invalid unit', function () {
        expect(system.lookup('xyzzy')).to.equal(undefined);
    });

    it('should register a new unit in USER system', function () {
        const myUnit = new Unit(LENGTH, 'plugh');

        system.register(myUnit);
        expect(system.USER.plugh).to.equal(myUnit);
    });

    it('should retrieve USER unit', function () {
        const myUnit = new Unit(LENGTH, 'plover');
        system.register(myUnit);

        expect(system.lookup('plover')).to.equal(myUnit);
    });

    it('should not allow registration of a unit whose symbolic representation conflicts with an existing unit', function () {
        const badRegistration = () => system.register(new Unit(LENGTH, 'm'));

        expect(badRegistration).to.throw();
    });

    it('should alias an existing unit to a new symbol', function () {
        system.alias('m', 'met');
        expect(system.lookup('met')).to.equal(METRE);
    });

    it('should throw an excelption when aliasing a unit that does not exist', function () {
        const badAlias = () => system.alias('bbq', 'brisket');

        expect(badAlias).to.throw();
    });

    it('should restore the symbol table to its initial state', function () {
        const myUnit = new Unit(LENGTH, 'zork');

        system.register(myUnit);
        system.restore();

        // User-defined unit is removed
        expect(system.lookup('zork')).to.equal(undefined);
        // Standard unit is not removed
        expect(system.lookup('m')).not.to.equal(undefined);
    });
});
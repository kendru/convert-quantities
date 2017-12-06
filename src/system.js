const Unit = require('./Unit');
const Dimension = require('./Dimension');
const { UnitConflictError, InvalidArgumentError } = require('./errors');

const { NONE, LENGTH, MASS, TIME, ELECTRIC_CURRENT, TEMPERATURE, AMOUNT_OF_SUBSTANCE, LUMINOUS_INTENSITY } = Dimension;

// Constants used in SI/US conversions
const STANDARD_GRAVITY_DIVIDEND = 980665;
const STANDARD_GRAVITY_DIVISOR  = 100000;
const INTERNATIONAL_FOOT_DIVIDEND = 3048;
const INTERNATIONAL_FOOT_DIVISOR  = 10000;
const AVOIRDUPOIS_POUND_DIVIDEND =  45359237;
const AVOIRDUPOIS_POUND_DIVISOR  = 100000000;
const AVOGADRO_CONSTANT = 6.02214199e23;
const ELEMENTARY_CHARGE = 1.602176462e-19;

// SI Recommended base units
const ONE = new Unit(NONE, '');
const METRE = new Unit(LENGTH, 'm');
const KILOGRAM = new Unit(MASS, 'kg');
const SECOND = new Unit(TIME, 's');
const AMPERE = new Unit(ELECTRIC_CURRENT, 'A');
const KELVIN = new Unit(TEMPERATURE, 'K');
const MOLE = new Unit(AMOUNT_OF_SUBSTANCE, 'mol');
const CANDELA = new Unit(LUMINOUS_INTENSITY, 'cd');

// Dimensionless Units
const RADIAN = new Unit(NONE, 'rad');
const STERADIAN = new Unit(NONE, 'sr');
const BIT = new Unit(NONE, 'bit');

// Derived length units
const MILLIMETRE = METRE.divide(1000, 'mm');
const CENTIMETRE = METRE.divide(100, 'cm');
const KILOMETRE = METRE.times(1000, 'km');

// Derived mass units
const GRAM = KILOGRAM.divide(1000, 'g');
const MILLIGRAM = GRAM.divide(1000, 'mg');

    // Miscellaneous units
const HERTZ = ONE.divide(SECOND, 'Hz'); // Frequency
const NEWTON = METRE.times(KILOGRAM).divide(SECOND.pow(2), 'N'); // Force
const PASCAL = NEWTON.divide(METRE.pow(2), 'Pa'); // Pressure
const JOULE = NEWTON.times(METRE, 'J'); // Energy
const WATT = JOULE.divide(SECOND, 'W'); // Power
const COULOMB = SECOND.times(AMPERE, 'C'); // Electric Charge
const VOLT = WATT.divide(AMPERE, 'V'); // Electric Potential
const FARAD = COULOMB.divide(VOLT, 'F'); // Electric Capacitance
const OHM = VOLT.divide(AMPERE, 'Ω'); // Electric Resistance
const SIEMENS = AMPERE.divide(VOLT, 'S'); // Electric Conductance
const WEBER = VOLT.times(SECOND, 'Wb'); // Magnetic Flux
const TESLA = WEBER.divide(METRE.pow(2), 'T'); // Magnetic Flux Density
const HENRY = WEBER.divide(AMPERE, 'H'); // Electric Inductance
const CELSIUS = KELVIN.add(273.15, '°C'); // Temperature
const LUMEN = CANDELA.times(STERADIAN, 'lm'); // Luminous Flux
const LUX = LUMEN.divide(METRE.pow(2), 'lx'); // Illuminance
const BECQUEREL = ONE.divide(SECOND, 'Bq'); // Radioactive Activity
const GRAY = JOULE.divide(KILOGRAM, 'Gy'); // Radiation Dose Absorbed
const SIEVERT = JOULE.divide(KILOGRAM, 'Sv'); // Radiation Dose Effective
const KATAL = MOLE.divide(SECOND, 'kat'); // Catalytic Activity
const SQUARE_METRE = METRE.times(METRE);
const CUBIC_METRE = SQUARE_METRE.times(METRE);
const METRES_PER_SECOND = METRE.divide(SECOND);
const METRES_PER_SQUARE_SECOND = METRES_PER_SECOND.divide(SECOND);

// NON-SI Units
const PERCENT = ONE.divide(100, 'prcnt');
const ATOM = MOLE.divide(AVOGADRO_CONSTANT, 'atom');
const FOOT = METRE
    .times(INTERNATIONAL_FOOT_DIVIDEND, '')
    .divide(INTERNATIONAL_FOOT_DIVISOR, 'ft');
const FOOT_SURVEY_US = METRE
    .times(1200, '')
    .divide(3937, 'foot_survey_us');
const YARD = FOOT.times(3, 'yd');
const INCH = FOOT.divide(12, 'in');
const MILE = METRE
    .times(1609344, '')
    .divide(1000, 'mi');
const NAUTICAL_MILE = METRE.times(1852, 'nmi');
const ANGSTROM = METRE.divide(10000000000, 'Å');
const ASTRONOMICAL_UNIT = METRE.times(149597870691.0, 'ua');
const LIGHT_YEAR = METRE.times(9.460528405e15, 'ly');
const PARSEC = METRE.times(30856770e9, 'pc');
const POINT = INCH.times(13837, '').divide(1000000, 'pt');
const PIXEL = INCH.divide(72, 'px');
const MINUTE = SECOND.times(60, 'min');
const HOUR = MINUTE.times(60, 'hr');
const DAY = HOUR.times(24, 'd');
const WEEK = DAY.times(7, 'week');
const YEAR = SECOND.times(31556952, 'year');
const MONTH = YEAR.divide(12, 'month');
const DAY_SIDEREAL = SECOND.times(86164.09, 'day_sidereal');
const YEAR_SIDEREAL = DAY.times(365, 'year_sidereal');
const YEAR_CALENDAR = SECOND.times(31558149.54, 'year_calendar');
const ATOMIC_MASS = KILOGRAM.times(1e-3 / AVOGADRO_CONSTANT, 'u');
const ELECTRON_MASS = KILOGRAM.times(9.10938188e-31, 'me');
const POUND = KILOGRAM
    .times(AVOIRDUPOIS_POUND_DIVIDEND, '')
    .divide(AVOIRDUPOIS_POUND_DIVISOR, 'lb');
const OUNCE = POUND.divide(16, 'oz');
const TON_US = POUND.times(2000, 'ton_us');
const TON_UK = POUND.times(2240, 'ton_uk');
const METRIC_TON = KILOGRAM.times(1000, 't');
const E = COULOMB.times(ELEMENTARY_CHARGE, 'e');
const FARADAY = COULOMB.times(ELEMENTARY_CHARGE * AVOGADRO_CONSTANT, 'Fd');
const FRANKLIN = COULOMB.times(3.3356e-10, 'Fr');
const RAKINE = KELVIN.times(5, '').divide(9, '°R');
const FARENHEIT = RAKINE.add(459.67, '°F');
const REVOLUTION = RADIAN.times(2 * Math.PI, 'rev');
const DEGREE_ANGLE = REVOLUTION.divide(360, '°');
const MINUTE_ANGLE = DEGREE_ANGLE.divide(60, '"');
const SECOND_ANGLE = MINUTE_ANGLE.divide(60, '\'');
const CENTIRADIAN = RADIAN.divide(100, 'centiradian');
const GRADE = REVOLUTION.divide(400, 'grade');
const MILES_PER_HOUR = MILE.divide(HOUR);
const KILOMETRES_PER_HOUR = KILOMETRE.divide(HOUR);
const KNOT = NAUTICAL_MILE.divide(HOUR, 'kn');
const MACH = METRES_PER_SECOND.times(331.6, 'Mach');
const C = METRES_PER_SECOND.times(299792458, 'c');
const G = METRES_PER_SQUARE_SECOND
    .times(STANDARD_GRAVITY_DIVIDEND, '')
    .divide(STANDARD_GRAVITY_DIVISOR, 'grav');
const ARE = SQUARE_METRE.times(100, 'a');
const HECTARE = ARE.times(100, 'ha');
const ACRE = YARD.pow(2).times(4840, 'ac');
const BYTE = BIT.times(8, 'byte');
const GILBERT = AMPERE.times(10.0 / (4.0 * Math.PI), 'Gi'); // Electric Current
const ERG = JOULE.divide(10000000, 'Erg'); // Energy
const ELECTRON_VOLT = JOULE.times(ELEMENTARY_CHARGE, 'eV'); // Energy
const LAMBERT = LUX.times(10000, 'La'); // Illuminance
const MAXWELL = WEBER.divide(100000000, 'Mx'); // Magnetic Flux
const GAUSS = TESLA.divide(10000, 'G'); // Magnetic Flux Density
const DYNE = NEWTON.divide(100000, 'dyn'); // Force
const KILOGRAM_FORCE = NEWTON
    .times(STANDARD_GRAVITY_DIVIDEND, '')
    .divide(STANDARD_GRAVITY_DIVISOR, 'kgf'); // Force
const POUND_FORCE = NEWTON
    .times(AVOIRDUPOIS_POUND_DIVIDEND * STANDARD_GRAVITY_DIVIDEND, '')
    .divide(AVOIRDUPOIS_POUND_DIVISOR * STANDARD_GRAVITY_DIVISOR, 'lbf'); // Force
const HORSEPOWER = WATT.times(735.499, 'hp'); // Power
const ATMOSPHERE = PASCAL.times(101325, 'atm'); // Pressure
const BAR = PASCAL.times(100000, 'bar'); // Pressure
const MILLIMETER_OF_MERCURY = PASCAL.times(133.322, 'mmHg'); // Pressure
const INCH_OF_MERCURY = PASCAL.times(3386.388, 'inHg'); // Pressure
const RAD = GRAY.divide(100, 'rd'); // Radiation Dose Absorbed
const REM = SIEVERT.divide(100, 'rem'); // Radiation Dose Absorbed
const CURIE = BECQUEREL.times(37000000000, 'Ci'); // Radiation Activity
const RUTHERFORD = BECQUEREL.times(1000000, 'Rd'); // Radiation Activity
const SPHERE = STERADIAN.times(4 * Math.PI, 'sphere'); // Solid Angle
const LITRE = CUBIC_METRE.divide(1000, 'L'); // Volume
const CUBIC_INCH = INCH.pow(3); // Volume
const GALLON_LIQUID_US = CUBIC_INCH.times(231, 'gal'); // Volume
const OUNCE_LIQUID_US = GALLON_LIQUID_US.divide(123, 'oz_fl'); // Volume
const GALLON_DRY_US = CUBIC_INCH.times(2688025, 'gal_dry_us'); // Volume
const GALLON_UK = LITRE
    .times(454609, '')
    .divide(100000, 'gal_uk'); // Volume
const OUNCE_LIQUID_UK = GALLON_UK.divide(160, 'oz_fl_uk'); // Volume
const POISE = GRAM.divide(CENTIMETRE.times(SECOND)); // Viscosity
const STOKE = CENTIMETRE.pow(2).divide(SECOND); // Viscosity
const ROENTGEN = COULOMB
    .divide(KILOGRAM)
    .times(2.58e-4, 'Roentgen');

// Exports
const SI = Object.freeze({
    // Base units
    ONE,
    METRE,
    METER: METRE, // Alternate spelling
    KILOGRAM,
    SECOND,
    AMPERE,
    KELVIN,
    MOLE,
    CANDELA,

    // Dimensionless Units
    RADIAN,
    STERADIAN,
    BIT,

    // Derived length units
    MILLIMETRE,
    MILLIMETER: MILLIMETRE, // Alternate spelling
    CENTIMETRE,
    CENTIMETER: CENTIMETRE, // Alternate spelling
    KILOMETRE,
    KILOMETER: KILOMETRE, // Alternate spelling

    // Derived mass units
    GRAM,
    MILLIGRAM,

    // Miscellaneous units
    HERTZ,
    NEWTON,
    PASCAL,
    JOULE,
    WATT,
    VOLT,
    FARAD,
    OHM,
    SIEMENS,
    WEBER,
    TESLA,
    HENRY,
    CELSIUS,
    LUMEN,
    LUX,
    BECQUEREL,
    GRAY,
    SIEVERT,
    KATAL,
    SQUARE_METRE,
    SQUARE_METER: SQUARE_METRE, // Alternate Spelling
    CUBIC_METRE,
    CUBIC_METER: CUBIC_METRE, // Alternate Spelling
    METRES_PER_SECOND,
    METERS_PER_SECOND: METRES_PER_SECOND, // Alternate spelling
    KILOMETRES_PER_HOUR,
    KILOMETERS_PER_HOUR: KILOMETRES_PER_HOUR, // Alternate spelling
    METRES_PER_SQUARE_SECOND,
    METERS_PER_SQUARE_SECOND: METRES_PER_SQUARE_SECOND // Alternate spelling
});

const NON_SI = Object.freeze({
    PERCENT,
    ATOM,
    FOOT,
    FOOT_SURVEY_US,
    YARD,
    INCH,
    MILE,
    NAUTICAL_MILE,
    ANGSTROM,
    ASTRONOMICAL_UNIT,
    LIGHT_YEAR,
    PARSEC,
    POINT,
    PIXEL,
    MINUTE,
    HOUR,
    DAY,
    WEEK,
    YEAR,
    MONTH,
    DAY_SIDEREAL,
    YEAR_SIDEREAL,
    YEAR_CALENDAR,
    ATOMIC_MASS,
    ELECTRON_MASS,
    POUND,
    OUNCE,
    TON_US,
    TON_UK,
    METRIC_TON,
    E,
    FARADAY,
    FRANKLIN,
    RAKINE,
    FARENHEIT,
    REVOLUTION,
    DEGREE_ANGLE,
    MINUTE_ANGLE,
    SECOND_ANGLE,
    CENTIRADIAN,
    GRADE,
    MILES_PER_HOUR,
    KNOT,
    MACH,
    C,
    G,
    ARE,
    HECTARE,
    ACRE,
    BYTE,
    GILBERT,
    ERG,
    ELECTRON_VOLT,
    LAMBERT,
    MAXWELL,
    GAUSS,
    DYNE,
    KILOGRAM_FORCE,
    POUND_FORCE,
    HORSEPOWER,
    ATMOSPHERE,
    BAR,
    MILLIMETER_OF_MERCURY,
    INCH_OF_MERCURY,
    RAD,
    REM,
    CURIE,
    RUTHERFORD,
    SPHERE,
    LITRE,
    CUBIC_INCH,
    GALLON_LIQUID_US,
    OUNCE_LIQUID_US,
    GALLON_DRY_US,
    GALLON_UK,
    OUNCE_LIQUID_UK,
    POISE,
    STOKE,
    ROENTGEN
});

const USER = {};
let lookupTbl = new Map();

function lookup(sym) {
    return lookupTbl.get(sym);
}

// Create a symbol -> unit mapping
function registerUnit(unit) {
    lookupTbl.set(unit.toString(), unit);
}

 function registerCustomUnit(unit) {
    const sym = unit.toString();
    if (lookupTbl.has(sym)) {
        throw new UnitConflictException(`Unit, "${sym}", already registered`);
    }

    USER[sym] = unit;
    registerUnit(unit);
}

function aliasSymbol(src, target) {
    if (!lookupTbl.has(src)) {
        throw new InvalidArgumentException(`Symbol, "${src}", is not associated with any unit`);
    }

    lookupTbl.set(target, lookupTbl.get(src));
}


function restoreLookupTable () {
    // We must preserve the original USER object because the namespace export has a direct
    // reference to it.
    Object.keys(USER).forEach(sym => delete USER[sym]);
    lookupTbl.clear();

    // Register all default units in lookup hash    
    Object.keys(SI).forEach(k => registerUnit(SI[k]));
    Object.keys(NON_SI).forEach(k => registerUnit(NON_SI[k]));
};

restoreLookupTable();


module.exports = {
    SI,
    NON_SI,
    USER,
    lookup,
    register: registerCustomUnit,
    alias: aliasSymbol,
    restore: restoreLookupTable
};
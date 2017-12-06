class IncompatibleUnitsError extends Error {
    
    constructor(message) {
        super(message);
        this.type = 'IncompatibleUnits';
    }
}

module.exports = IncompatibleUnitsError;
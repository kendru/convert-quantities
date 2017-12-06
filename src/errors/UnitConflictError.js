class UnitConflictError extends Error {
    
    constructor(message) {
        super(message);
        this.type = 'UnitConflict';
    }
}

module.exports = UnitConflictError;
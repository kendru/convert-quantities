class ParseError extends Error {
    
    constructor(message) {
        super(message);
        this.type = 'ParseError';
    }
}

module.exports = ParseError;
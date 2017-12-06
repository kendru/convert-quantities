class LexError extends Error {
    
    constructor(message) {
        super(message);
        this.type = 'LexError';
    }
}

module.exports = LexError;
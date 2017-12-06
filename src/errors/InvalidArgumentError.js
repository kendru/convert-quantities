class InvalidArgumentError extends Error {

    constructor(message) {
        super(message);
        this.type = 'InvalidArgument';
    }
}

module.exports = InvalidArgumentError;
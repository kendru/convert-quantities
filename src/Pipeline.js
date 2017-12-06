
function reverse(xs) {
    return [ ...xs ].reverse();
}

class Pipeline {
    
    constructor(...pipe) {
        this.pipe = pipe;
    }

    apply(x) {
        return this.pipe.reduce((acc, op) => op.apply(acc), x);
    }

    unapply(x) {
        return reverse(this.pipe).reduce((acc, op) => op.unapply(acc), x);
    }

    /**
     * Push a new operation onto the end of the pipeline
     *
     * @param {PipelineOperation} op
     * @return {Pipeline}
     */
    push(op) {
        this.pipe.push(op);

        return this;
    }

    /**
     * Concatenate another Pipeline to the current one
     *
     * @param {Pipeline} other
     * @return {Pipeline}
     */
    concat(other) {
        for (const otherOp of other.pipe) {
            this.pipe.push(otherOp);
        }

        return this;
    };

    /**
     * Create a new pipeline that undoes the effects of the current pipeline
     *
     * @return {Pipeline}
     */
    get inverse() {
        const inverted = new Pipeline();
        for (const op of reverse(this.pipe)) {
            inverted.push(op.inverse);
        }

        return inverted;
    };
}

module.exports = Pipeline;
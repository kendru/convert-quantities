const apply_ = Symbol('apply');
const unapply_ = Symbol('unapply');

class PipelineOperation {
    
    constructor(apply, unapply) {
        this[apply_] = apply;
        this[unapply_] = unapply;
    }

    apply(...args) {
        return this[apply_](...args);
    }

    unapply(...args) {
        return this[unapply_](...args);
    }

    get inverse() {
        return new PipelineOperation(this[unapply_], this[apply_]);
    }
}

PipelineOperation.add = function add(x) {
    return new PipelineOperation(y => y + x, y => y - x);
};

PipelineOperation.sub = function sub(x) {
    return PipelineOperation.add(x).inverse;
}

PipelineOperation.multiply = function multiply(x) {
    return new PipelineOperation(y => y * x, y => y / x);
};

PipelineOperation.divide = function divide(x) {
    return PipelineOperation.multiply(x).inverse;
}

module.exports = PipelineOperation;
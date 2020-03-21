export function Polygon(label) {
    if (typeof label !== 'string') {
        throw Error('Label is required and must be an string');
    }

    if (label.length === 0) {
        throw Error('Label can not be empty');
    }

    this.label = label;
}

Polygon.prototype.area = function() {
    throw Error('Area only calculable in defined shapes');
};

Polygon.prototype.properties = function() {
    return {
        label: this.label,
    };
};

export function Square({ label, side }) {
    Polygon.call(this, label);

    guardFromInvalidNumber('side', side);

    this.side = side;
}

Object.setPrototypeOf(Square.prototype, Polygon.prototype);

Square.prototype.area = function() {
    return this.side * this.side;
};

Square.prototype.properties = function() {
    return {
        ...Polygon.prototype.properties.call(this),
        side: this.side,
    };
};

export function Triangle({ label, base, height }) {
    Polygon.call(this, label);

    guardFromInvalidNumber('base', base);
    guardFromInvalidNumber('height', height);

    this.base = base;
    this.height = height;
}

Object.setPrototypeOf(Triangle.prototype, Polygon.prototype);

Triangle.prototype.area = function() {
    return (this.base * this.height) / 2;
};

Triangle.prototype.properties = function() {
    return {
        ...Polygon.prototype.properties.call(this),
        base: this.base,
        height: this.height,
    };
};

function guardFromInvalidNumber(name, value) {
    if (typeof value !== 'number') {
        throw Error(`${name} length must be a number`);
    }

    if (value <= 0) {
        throw Error(`${name} must be greater than 0`);
    }
}

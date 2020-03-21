export class Polygon {
    constructor(label) {
        if (typeof label !== 'string') {
            throw Error('Label is required and must be an string');
        }

        if (label.length === 0) {
            throw Error('Label can not be empty');
        }

        this.label = label;
    }

    area() {
        throw Error('Area only calculable in defined shapes');
    }

    properties() {
        return {
            label: this.label,
        };
    }
}

export class Square extends Polygon {
    constructor({ label, side }) {
        super(label);

        guardFromInvalidNumber('side', side);

        this.side = side;
    }

    area() {
        return this.side * this.side;
    }

    properties() {
        return {
            ...super.properties(),
            side: this.side,
        };
    }
}

export class Triangle extends Polygon {
    constructor({ label, base, height }) {
        super(label);

        guardFromInvalidNumber('base', base);
        guardFromInvalidNumber('height', height);

        this.base = base;
        this.height = height;
    }

    area() {
        return (this.base * this.height) / 2;
    }

    properties() {
        return {
            ...super.properties(),
            base: this.base,
            height: this.height,
        };
    }
}

function guardFromInvalidNumber(name, value) {
    if (typeof value !== 'number') {
        throw Error(`${name} length must be a number`);
    }

    if (value <= 0) {
        throw Error(`${name} must be greater than 0`);
    }
}

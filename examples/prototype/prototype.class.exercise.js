export class Polygon {
    constructor(label) {
        if (typeof label !== 'string') {
            throw Error('Label is required and must be an string')
        }

        if (label.length === 0) {
            throw Error('Label can not be empty')
        }

        this.label = label;
    }

    area() {
        throw Error('Area only calculable in defined shapes')
    }

    properties() {
        return {
            label: this.label
        }
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
            label: this.label,
            side: this.side
        }
    }
}

export class Triangle {

}

function guardFromInvalidNumber(name, value) {
    if (typeof value !== 'number') {
        throw Error(`${name} length must be a number`);
    }

    if (value <= 0) {
        throw Error(`${name} must be greater than 0`)
    }
}
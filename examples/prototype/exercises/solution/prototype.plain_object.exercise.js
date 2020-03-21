const SQUARE = 'SQUARE';
const TRIANGLE = 'TRIANGLE';

export const POLYGON_TYPES = {
    SQUARE,
    TRIANGLE,
};

export const calculateArea = polygon => {
    guardFromEmptyArgument(polygon);
    guardFromWrongType(polygon.type);

    switch (polygon.type) {
        case SQUARE:
            return calculateSquareArea(polygon);
        case TRIANGLE:
            return calculateTriangleArea(polygon);
    }
};

export const getPolygonType = polygon => {
    guardFromEmptyArgument(polygon);
    guardFromWrongType(polygon.type);

    return polygon.type;
};

const calculateSquareArea = square => {
    guardFromInvalidNumber('side', square.side);

    return square.side * square.side;
};

const calculateTriangleArea = triangle => {
    guardFromInvalidNumber('base', triangle.base);
    guardFromInvalidNumber('height', triangle.height);

    return (triangle.base * triangle.height) / 2;
};

const guardFromEmptyArgument = argument => {
    if (!argument) {
        throw Error('Passed argument must be an object');
    }
};

const guardFromWrongType = type => {
    if (!POLYGON_TYPES[type]) {
        throw Error('Polygon object has a wrong type');
    }
};

function guardFromInvalidNumber(name, value) {
    if (typeof value !== 'number') {
        throw Error(`${name} length must be a number`);
    }

    if (value <= 0) {
        throw Error(`${name} must be greater than 0`);
    }
}

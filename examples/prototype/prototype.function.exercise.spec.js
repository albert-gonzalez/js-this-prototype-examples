import { Polygon, Square, Triangle } from './prototype.function.exercise';
import each from 'jest-each';

const SOME_LABEL = 'some label';
const SOME_SIDE_LENGTH = 5;
const SOME_BASE_LENGTH = 10;
const SOME_HEIGHT_LENGTH = 4;

describe('polygon', () => {
    let polygon;

    beforeEach(() => {
        polygon = new Polygon(SOME_LABEL);
    });

    describe('constructor', () => {
        test('should set a label to the polygon instance', () => {
            expect(polygon.label).toEqual(SOME_LABEL);
        });

        test('should throw an error if label is not an string', () => {
            expect(() => new Polygon()).toThrowError();
            expect(() => new Polygon(123)).toThrowError();
            expect(() => new Polygon({})).toThrowError();
        });

        test('should create an instance of Polygon', () => {
            expect(polygon instanceof Polygon).toBeTruthy();
        });

        test('should create an instance with the constructor equals to Polygon', () => {
            expect(polygon.constructor).toEqual(Polygon);
        });
    });

    describe('area function', () => {
        test('should throw an error because it is abstract', () => {
            expect(() => polygon.area()).toThrowError();
        });
    });

    describe('properties function', () => {
        test('should return the instance properties', () => {
            expect(polygon.properties()).toEqual({
                label: SOME_LABEL,
            });
        });
    });
});

describe('square polygon', () => {
    let square;

    beforeEach(() => {
        square = new Square({ label: SOME_LABEL, side: SOME_SIDE_LENGTH });
    });

    describe('constructor', () => {
        test('should set a label and the side to the square instance', () => {
            expect(square.label).toEqual(SOME_LABEL);
            expect(square.side).toEqual(SOME_SIDE_LENGTH);
        });

        test('should throw an error if label is not an string', () => {
            expect(() => new Square()).toThrowError();
            expect(() => new Square({ label: 123 })).toThrowError();
            expect(() => new Square({})).toThrowError();
        });

        test('should throw an error if label is an empty string', () => {
            expect(() => new Square({ label: '' })).toThrowError();
        });

        test('should throw an error if side is not a number', () => {
            expect(() => new Square({ label: SOME_LABEL })).toThrowError();
            expect(
                () => new Square({ label: SOME_LABEL, side: '123' })
            ).toThrowError();
            expect(
                () => new Square({ label: SOME_LABEL, side: {} })
            ).toThrowError();
        });

        test('should throw an error if length is less than 0 or equal to 0', () => {
            expect(
                () => new Square({ label: SOME_LABEL, side: 0 })
            ).toThrowError();
            expect(
                () => new Square({ label: SOME_LABEL, side: -1 })
            ).toThrowError();
        });

        test('should create an instance of Polygon and Square', () => {
            expect(square instanceof Polygon).toBeTruthy();
            expect(square instanceof Square).toBeTruthy();
        });

        test('should create an instance with the constructor equals to Square', () => {
            expect(square.constructor).toEqual(Square);
        });
    });

    describe('area function', function() {
        each([
            [2, 4],
            [3, 9],
            [5, 25],
            [10, 100],
            [150, 22500],
        ]).test(
            'should return the area of a square with side %d',
            (side, expectedArea) => {
                expect(new Square({ label: SOME_LABEL, side }).area()).toEqual(
                    expectedArea
                );
            }
        );
    });

    describe('properties function', () => {
        test('should return the instance properties', () => {
            expect(square.properties()).toEqual({
                label: SOME_LABEL,
                side: SOME_SIDE_LENGTH,
            });
        });
    });
});

describe('triangle polygon', () => {
    let triangle;

    beforeEach(() => {
        triangle = new Triangle({
            label: SOME_LABEL,
            base: SOME_BASE_LENGTH,
            height: SOME_HEIGHT_LENGTH,
        });
    });

    describe('constructor', () => {
        test('should set a label and the side to the triangle instance', () => {
            expect(triangle.label).toEqual(SOME_LABEL);
            expect(triangle.base).toEqual(SOME_BASE_LENGTH);
            expect(triangle.height).toEqual(SOME_HEIGHT_LENGTH);
        });

        test('should throw an error if label is not an string', () => {
            expect(() => new Triangle()).toThrowError();
            expect(() => new Triangle({ label: 123 })).toThrowError();
            expect(() => new Triangle({})).toThrowError();
        });

        test('should throw an error if label is an empty string', () => {
            expect(() => new Triangle({ label: '' })).toThrowError();
        });

        test('should throw an error if base is not a number', () => {
            expect(() => new Triangle({ label: SOME_LABEL })).toThrowError();
            expect(
                () => new Triangle({ label: SOME_LABEL, base: '123' })
            ).toThrowError();
            expect(
                () => new Triangle({ label: SOME_LABEL, base: {} })
            ).toThrowError();
        });

        test('should throw an error if base is less than 0 or equal to 0', () => {
            expect(
                () => new Triangle({ label: SOME_LABEL, base: 0 })
            ).toThrowError();
            expect(
                () => new Triangle({ label: SOME_LABEL, base: -1 })
            ).toThrowError();
        });

        test('should throw an error if height is not a number', () => {
            expect(() => new Triangle({ label: SOME_LABEL })).toThrowError();
            expect(
                () =>
                    new Triangle({
                        label: SOME_LABEL,
                        base: SOME_BASE_LENGTH,
                        height: '123',
                    })
            ).toThrowError();
            expect(
                () =>
                    new Triangle({
                        label: SOME_LABEL,
                        base: SOME_BASE_LENGTH,
                        height: {},
                    })
            ).toThrowError();
        });

        test('should throw an error if height is less than 0 or equal to 0', () => {
            expect(
                () =>
                    new Triangle({
                        label: SOME_LABEL,
                        base: SOME_BASE_LENGTH,
                        height: 0,
                    })
            ).toThrowError();
            expect(
                () =>
                    new Triangle({
                        label: SOME_LABEL,
                        base: SOME_BASE_LENGTH,
                        height: -1,
                    })
            ).toThrowError();
        });

        test('should create an instance of Polygon and Triangle', () => {
            expect(triangle instanceof Polygon).toBeTruthy();
            expect(triangle instanceof Triangle).toBeTruthy();
        });

        test('should create an instance with the constructor equals to Triangle', () => {
            expect(triangle.constructor).toEqual(Triangle);
        });
    });

    describe('area function', function() {
        each([
            [2, 8, 8],
            [3, 21, 31.5],
            [5, 33, 82.5],
            [10, 2, 10],
            [150, 98, 7350],
        ]).test(
            'should return the area of a triangle with base %d and height %d',
            (base, height, expectedArea) => {
                expect(
                    new Triangle({ label: SOME_LABEL, base, height }).area()
                ).toEqual(expectedArea);
            }
        );
    });

    describe('properties function', () => {
        test('should return the instance properties', () => {
            expect(triangle.properties()).toEqual({
                label: SOME_LABEL,
                base: SOME_BASE_LENGTH,
                height: SOME_HEIGHT_LENGTH,
            });
        });
    });
});

import {
    calculateArea,
    getPolygonType,
    POLYGON_TYPES,
} from './prototype.plain_object.exercise';
import each from 'jest-each';

const { SQUARE, TRIANGLE } = POLYGON_TYPES;
const NO_OBJECT_ERROR = 'Passed argument must be an object';
const WRONG_TYPE_ERROR = 'Polygon object has a wrong type';
const WRONG_PROPERTY_TYPE_ERROR = name => `${name} length must be a number`;
const WRONG_PROPERTY_VALUE_ERROR = name => `${name} must be greater than 0`;

describe('getPolygonType function', () => {
    each([[SQUARE], [TRIANGLE]]).test(
        'should return the type if is equal to %s',
        polygonType => {
            expect(typeof getPolygonType({ type: polygonType })).toEqual(
                'string'
            );
        }
    );

    test('should throw an exception if no argument is passed', () => {
        expect(() => getPolygonType()).toThrowError(NO_OBJECT_ERROR);
        expect(() => getPolygonType(null)).toThrowError(NO_OBJECT_ERROR);
    });

    test('should throw an exception if type does not exist', () => {
        expect(() => getPolygonType({ type: 'SOME_TYPE' })).toThrowError(
            WRONG_TYPE_ERROR
        );
    });
});

describe('calculateArea function', () => {
    describe('wrong arguments', () => {
        test('should throw an exception if no argument is passed', () => {
            expect(() => calculateArea()).toThrowError(NO_OBJECT_ERROR);
            expect(() => calculateArea(null)).toThrowError(NO_OBJECT_ERROR);
        });

        test('should throw an exception if object has wrong polygon type', () => {
            expect(() => calculateArea({ type: 'LOLO' })).toThrowError(
                WRONG_TYPE_ERROR
            );
        });
    });

    describe('calculating square area', () => {
        test('should throw an exception if object side property is empty or wrong type', () => {
            expect(() => calculateArea({ type: SQUARE })).toThrowError(
                WRONG_PROPERTY_TYPE_ERROR('side')
            );
            expect(() =>
                calculateArea({ type: SQUARE, side: 'asd' })
            ).toThrowError(WRONG_PROPERTY_TYPE_ERROR('side'));
            expect(() =>
                calculateArea({ type: SQUARE, side: {} })
            ).toThrowError(WRONG_PROPERTY_TYPE_ERROR('side'));
        });

        test('should throw an exception if object side property is equal to 0 or less than 0', () => {
            expect(() => calculateArea({ type: SQUARE, side: 0 })).toThrowError(
                WRONG_PROPERTY_VALUE_ERROR('side')
            );
            expect(() =>
                calculateArea({ type: SQUARE, side: -1 })
            ).toThrowError(WRONG_PROPERTY_VALUE_ERROR('side'));
        });

        each([
            [2, 4],
            [3, 9],
            [5, 25],
            [10, 100],
            [150, 22500],
        ]).test(
            'should return the area of a square with side %d',
            (side, expectedArea) => {
                expect(calculateArea({ type: SQUARE, side })).toEqual(
                    expectedArea
                );
            }
        );
    });

    describe('calculating triangle area', () => {
        test('should throw an exception if object base property is empty or wrong type', () => {
            expect(() => calculateArea({ type: TRIANGLE })).toThrowError(
                WRONG_PROPERTY_TYPE_ERROR('base')
            );
            expect(() =>
                calculateArea({ type: TRIANGLE, base: 'asd' })
            ).toThrowError(WRONG_PROPERTY_TYPE_ERROR('base'));
            expect(() =>
                calculateArea({ type: TRIANGLE, base: {} })
            ).toThrowError(WRONG_PROPERTY_TYPE_ERROR('base'));
        });

        test('should throw an exception if object base property is equal to 0 or less than 0', () => {
            expect(() =>
                calculateArea({ type: TRIANGLE, base: 0 })
            ).toThrowError(WRONG_PROPERTY_VALUE_ERROR('base'));
            expect(() =>
                calculateArea({ type: TRIANGLE, base: -1 })
            ).toThrowError(WRONG_PROPERTY_VALUE_ERROR('base'));
        });

        test('should throw an exception if object height property is empty or wrong type', () => {
            expect(() =>
                calculateArea({ type: TRIANGLE, base: 10 })
            ).toThrowError(WRONG_PROPERTY_TYPE_ERROR('height'));
            expect(() =>
                calculateArea({ type: TRIANGLE, base: 10, height: 'asd' })
            ).toThrowError(WRONG_PROPERTY_TYPE_ERROR('height'));
            expect(() =>
                calculateArea({ type: TRIANGLE, base: 10, height: {} })
            ).toThrowError(WRONG_PROPERTY_TYPE_ERROR('height'));
        });

        test('should throw an exception if object height property is equal to 0 or less than 0', () => {
            expect(() =>
                calculateArea({ type: TRIANGLE, base: 10, height: 0 })
            ).toThrowError(WRONG_PROPERTY_VALUE_ERROR('height'));
            expect(() =>
                calculateArea({ type: TRIANGLE, base: 10, height: -1 })
            ).toThrowError(WRONG_PROPERTY_VALUE_ERROR('height'));
        });

        each([
            [2, 8, 8],
            [3, 21, 31.5],
            [5, 33, 82.5],
            [10, 2, 10],
            [150, 98, 7350],
        ]).test(
            'should return the area of a triangle with base %d and height %d',
            (base, height, expectedArea) => {
                expect(calculateArea({ type: TRIANGLE, base, height })).toEqual(
                    expectedArea
                );
            }
        );
    });
});

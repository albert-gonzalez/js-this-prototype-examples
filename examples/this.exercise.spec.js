import calculatorCreator, {ADD} from './this.exercise';

describe('calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = calculatorCreator();
    });

    test('should allow to push numbers one by one and read them in the screen;', () => {
        calculator.pushNumber(3);
        calculator.pushNumber(5);

        expect(calculator.screen).toEqual('35');
    });

    test('should throw an exception if pushNumber does not receive a number as a parameter', () => {
        expect(() => calculator.pushNumber('A')).toThrowError();
        expect(() => calculator.pushNumber({ number: 1 })).toThrowError();
    });

    test('should throw an exception if pushNumber receives a parameter with a length > 1', () => {
        expect(() => calculator.pushNumber(11)).toThrowError();
    });

    test('should not allow to write more than 6 digits in the screen', () => {
        for (let i = 0; i < 10; i++) {
            calculator.pushNumber(3);
        }

        expect(calculator.screen).toEqual('333333');
    });

    test('should store the current number and operation when the add button is pressed if does not exists a previous stored number', () => {
        calculator.pushNumber(3);
        calculator.pushNumber(9);
        calculator.pushAdd();

        expect(calculator.screen).toEqual('39');
        expect(calculator.storedNumber).toEqual(39);
        expect(calculator.currentOperation).toEqual(ADD);
    });

    test('should add the current number and the stored number, store the result and show it in the screen when the add button is pressed if exists a previous stored number', () => {
        calculator.pushNumber(3);
        calculator.pushNumber(9);
        calculator.pushAdd();

        calculator.pushNumber(1);
        calculator.pushNumber(0);
        calculator.pushAdd();

        expect(calculator.screen).toEqual('49');
        expect(calculator.storedNumber).toEqual(49);
        expect(calculator.currentOperation).toEqual(ADD);
    });

    test('should be able to use add multiple times', () => {
        calculator.pushNumber(3);
        calculator.pushNumber(9);
        calculator.pushAdd();

        calculator.pushNumber(1);
        calculator.pushNumber(0);
        calculator.pushAdd();

        calculator.pushNumber(3);
        calculator.pushNumber(1);
        calculator.pushAdd();

        expect(calculator.screen).toEqual('80');
        expect(calculator.storedNumber).toEqual(80);
        expect(calculator.currentOperation).toEqual(ADD);
    });

    test('should show the result in the screen and clear the current operation when the result button is pressed', () => {
        calculator.pushNumber(3);
        calculator.pushNumber(9);
        calculator.pushAdd();

        calculator.pushNumber(1);
        calculator.pushNumber(0);
        calculator.pushShowResult();

        expect(calculator.screen).toEqual('49');
        expect(calculator.storedNumber).toBeNull();
        expect(calculator.currentOperation).toBeNull();
    });

    test('should reset the screen after pressing the show button and pressing some number button', () => {
        calculator.pushNumber(3);
        calculator.pushNumber(9);
        calculator.pushAdd();

        calculator.pushNumber(1);
        calculator.pushNumber(0);
        calculator.pushShowResult();

        calculator.pushNumber(1);

        expect(calculator.screen).toEqual('1');
    });

    test('should do nothing after pressing show button if there is not a current operation', () => {
        calculator.pushNumber(3);
        calculator.pushNumber(9);
        calculator.pushShowResult();

        expect(calculator.screen).toEqual('39');
    });

    test('should be able to combine add and show', () => {
        calculator.pushNumber(3);
        calculator.pushAdd();
        calculator.pushNumber(9);
        calculator.pushShowResult();
        calculator.pushAdd();
        calculator.pushNumber(9);
        calculator.pushShowResult();

        expect(calculator.screen).toEqual('21');
    });

    test('should be able to be copied and use another object as context', () => {
        const otherCalculator = {
            ...calculator
        };

        otherCalculator.pushNumber(3);
        otherCalculator.pushNumber(9);
        otherCalculator.pushAdd();

        otherCalculator.pushNumber(1);
        otherCalculator.pushNumber(0);
        otherCalculator.pushAdd();

        expect(otherCalculator.screen).toEqual('49');
    });
});
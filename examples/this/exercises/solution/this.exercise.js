export const ADD = 'add';

export default function() {
    return {
        screen: '',
        currentOperation: null,
        storedNumber: null,
        resetScreenOnPushNumber: false,

        pushNumber(number) {
            if (isNaN(number)) {
                throw new Error('Not a number');
            }

            const stringNumber = number + '';

            if (stringNumber.length > 1) {
                throw new Error('Number can not be greater than 9');
            }

            if (this.resetScreenOnPushNumber) {
                this.screen = '';
                this.resetScreenOnPushNumber = false;
            }

            if (this.screen.length === 6) {
                return;
            }

            this.screen += number;
        },

        pushAdd() {
            this.currentOperation = ADD;
            this.resetScreenOnPushNumber = true;

            if (this.storedNumber !== null) {
                this.storedNumber =
                    this.storedNumber + parseInt(this.screen, 10);
                this.screen = this.storedNumber + '';

                return;
            }

            this.storedNumber = parseInt(this.screen, 10);
        },

        pushShowResult() {
            if (this.currentOperation === ADD) {
                this.screen =
                    this.storedNumber + parseInt(this.screen, 10) + '';
                this.storedNumber = null;
                this.resetScreenOnPushNumber = true;
            }

            this.currentOperation = null;
        },
    };
}

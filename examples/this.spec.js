describe('this keyword', () => {
    describe('Why this?', () => {
        test('this keyword is the context of execution, and the context can change', () => {
            function identify() {
                return this.name.toUpperCase();
            }

            function speak() {
                return "Hello, I'm " + identify.call(this);
            }

            var me = {
                name: 'Kyle',
            };

            var you = {
                name: 'Reader',
            };

            expect(identify.call(me)).toEqual('KYLE'); // KYLE
            expect(identify.call(you)).toEqual('READER'); // READER

            expect(speak.call(me)).toEqual("Hello, I'm KYLE"); // Hello, I'm KYLE
            expect(speak.call(you)).toEqual("Hello, I'm READER");
        });

        test('you can pass the context and get the same behaviour', () => {
            function identify(context) {
                return context.name.toUpperCase();
            }

            function speak(context) {
                return "Hello, I'm " + identify(context);
            }

            var me = {
                name: 'Kyle',
            };

            var you = {
                name: 'Reader',
            };

            expect(identify(you)).toEqual('READER'); // READER
            expect(speak(me)).toEqual("Hello, I'm KYLE"); // Hello, I'm KYLE
        });
    });

    describe('Confusions', () => {
        describe('itself', () => {
            test('if a function is called without a context, this equals to global context or window (if strict mode is disabled)', () => {
                let fooThis = undefined;
                window.count = 0;

                function foo(num) {
                    // keep track of how many times `foo` is called
                    fooThis = this;
                    this.count++;
                }

                foo = jest.fn(foo);

                foo.count = 0;

                var i;

                for (i = 0; i < 10; i++) {
                    if (i > 5) {
                        foo(i);
                    }
                }

                expect(foo).toHaveBeenCalledTimes(4);
                expect(foo.count).toEqual(0); // 0 -- WTF?
                expect(fooThis).toEqual(global);
                expect(fooThis).toEqual(window);
                expect(window.count).toEqual(4);

                foo.mockRestore();
            });

            test('when strict mode is enabled, this equals to undefined if the function context is not bound', () => {
                'use strict';

                function foo() {
                    return this;
                }

                expect(foo()).toBeUndefined();
            });

            test('lexical context could be used (use variable name instead of this), but it is not a good solution because rely entirely on the variable', () => {
                function foo(num) {
                    // keep track of how many times `foo` is called
                    foo.count++;
                }

                foo = jest.fn(foo);

                foo.count = 0;

                var i;

                for (i = 0; i < 10; i++) {
                    if (i > 5) {
                        foo(i);
                    }
                }

                expect(foo).toHaveBeenCalledTimes(4);
                expect(foo.count).toEqual(4);

                foo.mockRestore();
            });

            test('a better way is to explicitly bind the context to the function (with call, apply or bind)', () => {
                let fooThis = undefined;

                function foo(num) {
                    // keep track of how many times `foo` is called
                    fooThis = this;
                    this.count++;
                }

                foo = jest.fn(foo);

                foo.count = 0;

                var i;

                for (i = 0; i < 10; i++) {
                    if (i > 5) {
                        foo.call(foo, i);
                    }
                }

                expect(foo).toHaveBeenCalledTimes(4);
                expect(foo.count).toEqual(4);
                expect(fooThis).toEqual(foo);

                foo.mockRestore();
            });
        });

        describe('Its Scope', () => {
            test("A common misconception about the meaning of this is that it somehow refers to the function's scope", () => {
                window.foo = function foo() {
                    var a = 2;

                    return this.bar();
                };

                window.bar = function bar() {
                    return this.a;
                };

                expect(foo()).toBeUndefined();
            });
        });
    });

    describe('What is this?', () => {
        test('this binding has nothing to do with where a function is declared, but has instead everything to do with the manner in which the function is called', () => {
            function foo() {
                return this;
            }

            const someContext = {
                foo,
            };

            expect(foo()).toEqual(window);
            expect(someContext.foo()).toEqual(someContext);
            expect(someContext.foo.call(foo)).toEqual(foo);
        });
    });

    describe('Implicitly lost', () => {
        test('this can be lost when we execute a function as a callback', () => {
            function foo() {
                return this;
            }

            function functionWithCallback(cb) {
                return cb();
            }

            const context = {
                foo,
            };

            expect(functionWithCallback(context.foo)).toEqual(window);
        });
    });

    describe('Explicit binding', () => {
        test('call vs apply. They are the same, but changes the way the parameters are passed', () => {
            function foo(num, num2) {
                this.storedNum = num + num2;

                return this;
            }

            expect(foo.call(foo, 5, 3).storedNum).toEqual(8);
            expect(foo.apply(foo, [5, 3]).storedNum).toEqual(8);
        });

        test('hard binding can prevent from losing the context in a callback', () => {
            function foo() {
                return this;
            }

            const context = {
                foo,
                a: 2,
            };

            function bar() {
                return foo.call(context); // equals to context.call()
            }

            function functionWithCallback(cb) {
                return cb();
            }

            expect(functionWithCallback(bar)).toEqual(context);
        });

        test('hard binding is a common pattern, you can use a re-usable helper. ES5 includes the bind function to do that', () => {
            function foo() {
                return this;
            }

            const context = {
                foo,
                a: 2,
            };

            // Simple bind
            function bind(fn, obj) {
                return function() {
                    return fn.apply(obj, arguments);
                };
            }

            const simpleBindFoo = bind(context.foo, context);
            const builtInBindFoo = context.foo.bind(context);

            function functionWithCallback(cb) {
                return cb();
            }

            expect(functionWithCallback(foo)).toEqual(window);
            expect(functionWithCallback(simpleBindFoo)).toEqual(context);
            expect(functionWithCallback(builtInBindFoo)).toEqual(context);
        });

        test('Some libraries and functions in JavaScript accept a context parameter to ensure the callback uses a particular this', () => {
            function foo(el) {
                return {
                    el,
                    id: this.id,
                };
            }

            var context = {
                id: 'awesome',
            };

            const mappedArray = [1, 2, 3].map(foo, context);

            expect(mappedArray).toEqual([
                { el: 1, id: 'awesome' },
                { el: 2, id: 'awesome' },
                { el: 3, id: 'awesome' },
            ]);
        });

        test(`new keyword binds the new created object to the this of the used function. Steps of new:
            1- a brand new object is created (aka, constructed) out of thin air
            2- the newly constructed object is [[Prototype]]-linked
            3- the newly constructed object is set as the this binding for that function call
            4- unless the function returns its own alternate object, the new-invoked function call will automatically return the newly constructed object`, () => {
            let theFunctionWasExecuted = false;

            function SomeClass(param) {
                theFunctionWasExecuted = true;
                this.myParam = param;
            }

            SomeClass.prototype = {
                getProperty(propertyName) {
                    return this[propertyName];
                },
            };

            let bar = new SomeClass(2);

            expect(theFunctionWasExecuted).toBeTruthy();
            expect(bar.myParam).toEqual(2);
            expect(Object.getPrototypeOf(bar)).toEqual(SomeClass.prototype);
            expect(bar.getProperty('myParam')).toEqual(2);
        });
    });

    describe('Lexical this -> Arrow Functions', () => {
        test('An arrow function captures the context of the function where they are defined. Inside this arrow function, this will always keep this context', () => {
            function foo() {
                // return an arrow function
                return a => {
                    // `this` here is lexically adopted from `foo()`
                    return this.a;
                };
            }

            let obj1 = {
                a: 2,
            };

            let obj2 = {
                a: 3,
            };

            let bar = foo.call(obj1);
            expect(bar.call(obj2)).toEqual(2);
        });

        test('Arrow functions allow to call safely an object this', () => {
            const MyClass = function() {
                this.param = 123;

                this.normalFunction = function() {
                    return this.param;
                };

                this.arrowFunction = () => {
                    return this.param;
                };
            };

            const instance = new MyClass();

            function executeFnAndReturn(fn) {
                return fn();
            }

            expect(executeFnAndReturn(instance.normalFunction)).toEqual(
                undefined
            );
            expect(executeFnAndReturn(instance.arrowFunction)).toEqual(123);
        });
    });
});

describe('Prototype', () => {
    describe('Introduction', () => {
        test('Object.createNew is used to make a link between objects. This link is made with the Prototype property', () => {
            const anotherObject = {
                a: 2,
            };

            // create an object linked to `anotherObject`
            const myObject = Object.create(anotherObject);

            expect(myObject.a).toEqual(2);
            expect(Object.getPrototypeOf(myObject)).toEqual(anotherObject);
            expect(Object.getPrototypeOf(myObject)).toEqual(myObject.__proto__);
        });

        test('in keyword looks if the property exists in the object or in the prototype chain', () => {
            const anotherObject = {
                a: 2,
            };

            const myObject = Object.create(anotherObject);
            myObject.b = 3;

            let stringOfKeys = '';
            for (let k in myObject) {
                stringOfKeys += `${k} `;
            }

            expect(stringOfKeys).toEqual('b a ');
            expect('a' in myObject).toBeTruthy();
        });

        test('You can build a prototype chain. All properties can be accessible in this chain', () => {
            const firstObject = {
                a: 2,
            };

            const myObject = Object.create(firstObject);
            myObject.b = 3;

            const lastObject = Object.create(myObject);
            lastObject.c = 4;

            expect(lastObject.a).toEqual(2);
            expect(lastObject.b).toEqual(3);
            expect(lastObject.c).toEqual(4);

            expect(
                Object.getPrototypeOf(Object.getPrototypeOf(lastObject))
            ).toEqual(firstObject);

            // All objects inherit from Object.prototype
            expect(Object.getPrototypeOf(firstObject)).toEqual(
                Object.prototype
            );
        });

        test('Properties can be shadowed (overridden), but there are some exceptions', () => {
            const firstObject = {
                a: 2,
            };

            Object.defineProperty(firstObject, 'readOnly', {
                writable: false,
                value: 'firstValue',
            });
            Object.defineProperty(firstObject, 'setter', {
                set: function(value) {
                    this.setValue = value;
                },
            });

            const myObject = Object.create(firstObject);
            myObject.a = 3;
            myObject.readOnly = 'myValue';
            myObject.setter = 'mySetValue';

            expect(myObject.a).toEqual(3);
            expect(firstObject.a).toEqual(2);

            // If a property is read-only, you can not override it in the new object. With strict mode it will throw an exception
            expect(myObject.readOnly).toEqual('firstValue');
            expect(myObject.setValue).toEqual('mySetValue');
            expect(myObject.setter).toBeUndefined();
            expect(
                typeof Object.getOwnPropertyDescriptor(firstObject, 'setter')
                    .set
            ).toBe('function');

            // With define property we can shadow any variable
            Object.defineProperty(myObject, 'readOnly', { value: 'myValue' });
            expect(myObject.readOnly).toEqual('myValue');
        });

        test('a property can be implicitly shadowed', () => {
            const firstObject = {
                a: 2,
            };

            const myObject = Object.create(firstObject);

            myObject.a++; // oops, implicit shadowing!

            expect(firstObject.a).toEqual(2);
            expect(myObject.a).toEqual(3);
        });
    });

    describe('Class with new operator in functions', () => {
        describe('The internal prototype (__proto__) in an instance built with a Foo function is equals to the "prototype" property defined in this Foo function', () => {
            function Foo() {
                this.someProperty = 'prop';
            }

            let a = new Foo();

            expect(Object.getPrototypeOf(a)).toEqual(Foo.prototype);

            // deprecated way to access prototype
            expect(a.__proto__).toEqual(Foo.prototype);

            // Default prototype is an empty object
            expect(Foo.prototype).toEqual({});

            // in fact, "a" is not a classic (OOP) instance, it is a new object linked to another object
            // this is called prototypal inheritance
            expect(a).toEqual({ someProperty: 'prop' });
        });

        describe("The prototype is not copied to the instances, it's only a link (object reference)", () => {
            function Foo(name) {
                this.name = name;
            }

            var a = new Foo('a');
            var b = new Foo('b');

            Foo.prototype.myName = function() {
                return this.name;
            };

            // myName is in prototype function, and the "this" context is bound to the instance
            expect(a.myName()).toEqual('a');
            expect(b.myName()).toEqual('b');
        });

        describe('constructor property can not be trusted. Can change depending on how the prototype is assigned', () => {
            function Foo() {}
            function Bar() {}

            Foo.prototype = {}; // create a new prototype object

            var a1 = new Foo();
            var b1 = new Bar();

            // If we use the default prototype, the constructor is equals to the function
            expect(b1.constructor).toEqual(Bar);
            expect(Bar.prototype.constructor).toEqual(Bar);
            expect(Bar.prototype.hasOwnProperty('constructor')).toBeTruthy();

            // If we use a custom prototype without a constructor property, JS finds this property on the prototype chain. The next object in the chain is "Object"
            expect(a1.constructor).not.toEqual(Foo);
            expect(a1.constructor).toEqual(Object);
            expect(Foo.prototype.hasOwnProperty('constructor')).toBeFalsy();

            // a1 can access to the constructor property because is in its prototype
            expect(a1.constructor.hasOwnProperty('constructor')).toBeFalsy();
        });
    });

    describe('Prototypal Inheritance', () => {
        test('We can create a prototype chain with createObject', () => {
            function Person(name) {
                this.name = name;
            }

            Person.prototype.myName = function() {
                return this.name;
            };

            function Worker(name, label) {
                Person.call(this, name);
                this.label = label;
            }

            // here, we make a new `Worker.prototype`
            // linked to `Person.prototype`
            Worker.prototype = Object.create(Person.prototype);

            // Beware! Now `Worker.prototype.constructor` is gone,
            // and might need to be manually "fixed" if you're
            // in the habit of relying on such properties!
            Worker.prototype.myLabel = function() {
                return this.label;
            };

            const worker = new Worker('a', 'obj a');

            expect(worker.myName()).toEqual('a');
            expect(worker.myLabel()).toEqual('obj a');

            // We can check if an instance is of some class of the chain with instanceof
            expect(worker instanceof Worker).toBeTruthy();
            expect(worker instanceof Person).toBeTruthy();
            expect(worker.constructor).toEqual(Person);
        });

        test('Also, We can create a prototype chain with setPrototypeOf', () => {
            function Person(name) {
                this.name = name;
            }

            Person.prototype.myName = function() {
                return this.name;
            };

            function Worker(name, label) {
                Person.call(this, name);
                this.label = label;
            }

            // here, we make a new `Worker.prototype`
            // linked to `Person.prototype`
            Object.setPrototypeOf(Worker.prototype, Person.prototype);

            Worker.prototype.myLabel = function() {
                return this.label;
            };

            const worker = new Worker('a', 'obj a');

            expect(worker.myName()).toEqual('a');
            expect(worker.myLabel()).toEqual('obj a');

            // We can check if an instance is of some class of the chain with instanceof
            expect(worker instanceof Worker).toBeTruthy();
            expect(worker instanceof Person).toBeTruthy();

            // With setPrototypeOf the constructor is equals to Worker instead of Person
            expect(worker.constructor).toEqual(Worker);
        });
    });

    describe('Classes syntax', () => {
        test('ES6 introduced a new syntax to define classes', () => {
            class Person {
                constructor(name) {
                    this.name = name;
                }

                myName() {
                    return this.name;
                }
            }

            class Worker extends Person {
                constructor(name, label) {
                    super(name);
                    this.label = label;
                }

                myLabel() {
                    return this.label;
                }
            }

            const worker = new Worker('a', 'obj a');

            expect(worker.myName()).toEqual('a');
            expect(worker.myLabel()).toEqual('obj a');

            // We can check if an instance is of some class of the chain with instanceof
            expect(worker instanceof Worker).toBeTruthy();
            expect(worker instanceof Person).toBeTruthy();

            expect(worker.constructor).toEqual(Worker);

            // Class hides the prototype, but internally still uses the prototype
            Person.prototype.myName = function() {
                return 'fixed Name';
            };

            expect(worker.myName()).toEqual('fixed Name');
        });
    });

    describe('Composition', () => {
        describe('We can compose objects instead of making inheritance', () => {
            const Person = name => ({
                name,
                myName() {
                    return this.name;
                },
                overrideMe() {
                    return 'Person';
                },
            });

            const Worker = (name, label) => ({
                ...Person(name),
                label,
                myLabel() {
                    return this.label;
                },
                overrideMe() {
                    return 'Worker';
                },
            });

            const worker = Worker('a', 'obj a');

            expect(worker.myName()).toEqual('a');
            expect(worker.myLabel()).toEqual('obj a');
            expect(worker.overrideMe()).toEqual('Worker');
        });
    });
});

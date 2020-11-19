import {debounce, enumToArray, round, wait} from '../lib';
import * as should from 'should';

describe('Common', function () {

    describe('#debounce', function () {

        xit('should call immediate', async () => {

            const calls = [];
            const start = Date.now();
            const func = debounce((call) => {
                calls.push([call, Date.now() - start]);
            }, 100);

            func(0);
            func(1);
            await wait(200);
            func(2);
            await wait(50);
            func(3);

            // Wait to finish
            await wait(500);

            function check(i: number, lower: number) {
                should(calls[i][0]).eql(i);
                should(calls[i][1]).greaterThanOrEqual(lower).belowOrEqual(lower + 5);
            }

            should(calls).length(4);
            check(0, 0);
            check(1, 100);
            check(2, 200);
            check(3, 350);
        });

    });

    describe('#round', function () {

        it('should round a few numbers', async () => {

            should(round(1.1111, 2)).eql(1.11);
            should(round(1.1511, 0)).eql(1);
            should(round(1.6111, 1)).eql(1.6);
            should(round(1.6111, 0)).eql(2);

        });

    });

    describe('#enumToArray', function () {

        it('should transform a number enum to an array', async () => {
            enum Foo {
                Foo,
                Bar
            }

            const arr = enumToArray(Foo);
            should(arr).eql([0, 1]);
        });

        it('should transform a string enum to an array', async () => {
            enum Foo {
                Foo = 'FOO',
                Bar = 'BAR'
            }

            const arr = enumToArray(Foo);
            should(arr).eql(['FOO', 'BAR']);
        });


    });

});

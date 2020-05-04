import {debounce, wait} from "../lib";
import * as should from 'should';

describe('Common', function () {

    describe('#debounce', function () {

        it('should call immediate', async () => {

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
            await wait(300);

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

});

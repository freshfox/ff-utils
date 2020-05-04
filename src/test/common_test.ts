import {debounce, wait} from "../lib";
import * as should from 'should';

describe('Common', function () {

    describe('#debounce', function () {

        it('should call immediate', async () => {

            const calls = [];
            const start = Date.now();
            const func = debounce((call) => {
                calls.push([call, Date.now() - start]);
            }, 100, true);

            func(1);
            func(2);
            await wait(200);
            func(3);
            await wait(50);
            func(4);
            await wait(200);

            should(calls).length(2);
            should(calls[0][0]).eql(1);
            should(calls[0][1]).greaterThanOrEqual(0).belowOrEqual(5);

            should(calls[1][0]).eql(3);
            should(calls[1][1]).greaterThanOrEqual(200).belowOrEqual(205);
        });

    });

});

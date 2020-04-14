import {processPromisesParallelWithRetries, wait} from '../lib';
import {processPromisesParallel} from '../lib';
import * as should from 'should';

describe('Promise', function () {

    it('should process promises in parallel', async () => {
        // [--------100-------][-----70-----]
        // [20][---50---][----60----][-30-]
        const items = [100, 20, 50, 60, 70, 30];
        const done = [];
        await processPromisesParallel(items, 2, async (ms) => {
            await wait(ms);
            done.push(ms);
        });
        should(done).eql([20, 50, 100, 60, 30, 70]);
    });

    it('should process promises in parallel and retry if one fails', async () => {

        // [--------100-------][----60----][----60----][-30-]
        // [-30-][-30-][-----70-----][-----70-----][-----70-----]
        const items: [number, number][] = [
            [100, 0],
            [30, 1],
            [70, 2],
            [60, 1],
            [30, 0]
        ];
        const log: string[] = [];

        await processPromisesParallelWithRetries(items, 2, 3, async (item) => {
            await wait(item[0]);
            const line = `${item[0]} ${item[1]}`;
            if (item[1] > 0) {
                const errLine = 'err ' + line;
                log.push(errLine);
                item[1]--;
                throw new Error(errLine);
            }
            log.push(line);
        });

       should(log).eql([
           "err 30 1",
           "30 0",
           "100 0",
           "err 70 2",
           "err 60 1",
           "err 70 1",
           "60 0",
           "30 0",
           "70 0",
       ])
    });

});

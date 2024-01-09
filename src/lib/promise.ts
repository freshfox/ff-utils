/**
 * Processes a batch of items in parallel using a handler function to generate the promises. It starts by initializing
 * the amount of Promises given by the batchSize parameter. Once a Promise finishes it immediately starts the next one.
 * The function returns the results in an array in the order in which the promises finished.
 *
 * The optional onUpdate function is called every time a new Promises starts or is finished
 */
export async function processPromisesParallel<T, K>(
    items: T[], batchSize: number,
    handler: (item: T) => Promise<K>,
    onUpdate?: OnUpdateCallback): Promise<K[]> {

    items = [...items];
    const all: K[] = [];

    const total = items.length;
    let done = 0;
    let running = 0;

    function update(type: OnUpdateCallbackArgs['type']) {
        if (onUpdate) {
            onUpdate({
                type,
                running,
                done,
                total: total,
                queued: total - (done + running)
            });
        }
    }

    async function executeNext() {
        const item = items.shift();
        if (!item) {
            return;
        }
        running++;
        update('added');
        const result = await handler(item);
        all.push(result);
        running--;
        done++;
        update('finished');
        if (items.length > 0) {
            await executeNext();
        }
    }

    const promises = [];
    for (let i = 0; i < batchSize; i++) {
        promises.push(executeNext());
    }

    await Promise.all(promises);
    return all;
}

export type OnUpdateCallback = (args: OnUpdateCallbackArgs) => void

export interface OnUpdateCallbackArgs {
    type: 'added' | 'finished'
    running: number,
    done: number,
    total: number,
    queued: number
}

export interface CreateLoggerArgs {
    logger?: typeof console.log;
    logEvery?: number;
    logExtras?: any[];
}

function logItemsByType(type: OnUpdateCallbackArgs['type'], args?: CreateLoggerArgs): OnUpdateCallback {
    const logger = args?.logger || console.log
    return (status) => {
        if (status.type === type && (!args?.logEvery || status.done % args.logEvery === 0 || status.done === status.total)) {
            const str = `Finished (${status.done}/${status.total}); Running: ${status.running}; Queued: ${status.queued}`;
            const logArgs = args?.logExtras ? [...args.logExtras, str] : [str];
            logger(...logArgs);
        }
    }
}

export function logStartedNewItems(args?: CreateLoggerArgs) {
    return logItemsByType('added', args);
}

export function logFinishedItems(args?: CreateLoggerArgs) {
    return logItemsByType('finished', args);
}

export async function processPromisesParallelWithRetries<T, K>(
    items: T[], batchSize: number, tries: number,
    handler: (item: T) => Promise<K>,
    onUpdate?: (status: {
        running: number,
        done: number,
        total: number,
        queued: number
    }) => void): Promise<K[]> {
    return processPromisesParallel(items, batchSize, async (item: T) => {
        let error: Error = null;
        for (let run = 0; run < tries; run++) {
            try {
                return await handler(item);
            } catch (err) {
                if (run < tries - 1) {
                    console.error(err);
                }
                error = err;
            }
        }
        throw error;
    }, onUpdate);
}

export async function promiseProps<T>(obj: {[K in keyof T]: Promise<T[K]> | T[K]}): Promise<T> {
    const promises = [];
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        promises.push(obj[key as any]);
    }
    const results = await Promise.all(promises);

    return results.reduce((map, current, index) => {
        map[keys[index]] = current;
        return map;
    }, {});
}

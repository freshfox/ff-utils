import * as _ from 'lodash';

export function camelCaseObjectKeys(object: any) {
    const obj = {};
    Object.keys(object).forEach((key: string) => {
        const ccKey = _.camelCase(key);
        const value = object[key];
        if (_.isPlainObject(value)) {
            obj[ccKey] = this.camelCaseObjectKeys(value);
        } else {
            obj[ccKey] = value;
        }
    });

    return obj;
}

export function random(lower?: number, upper?: number) {
    lower = lower || 0;
    upper = upper || 1;
    return Math.round(lower + Math.random() * (upper - lower));
}

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function wait(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// https://davidwalsh.name/javascript-debounce-function
type Callback = (...args: any[]) => any
export function debounce(func: Callback, ms: number, immediate: boolean): Callback {
    let timeout;
    return function(...a: any[]) {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, ms);
        if (callNow) func.apply(context, args);
    };
}

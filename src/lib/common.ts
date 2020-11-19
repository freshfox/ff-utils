import isPlainObject from 'lodash.isplainobject';
import camelCase from 'lodash.camelcase';

export function camelCaseObjectKeys(object: any) {
    const obj = {};
    Object.keys(object).forEach((key: string) => {
        const ccKey = camelCase(key);
        const value = object[key];
        if (isPlainObject(value)) {
            obj[ccKey] = this.camelCaseObjectKeys(value);
        } else {
            obj[ccKey] = value;
        }
    });

    return obj;
}

export function round(num: number, precision?: number) {
    precision = precision || 0;
    const p = Math.pow(10, precision);
    return Math.round(num * p) / p;
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

type Callback = (...args: any[]) => any
export function debounce(func: Callback, ms: number): Callback {
    let timeout;
    let lastCall;
    let lastArgs;
    return function(...a: any[]) {
        const context = this;
        lastArgs = arguments;
        const later = function () {
            timeout = null;
            lastCall = Date.now();
            func.apply(context, lastArgs);
        };
        clearTimeout(timeout);
        if (lastCall && lastCall + ms > Date.now()) {
            timeout = setTimeout(later, ms);
        } else {
            later();
        }
    };
}


export function enumToArray<E>(Enum: E): E[(keyof E)][] {
    let keys = Object.keys(Enum);
    const hasNumbers = keys.some(k => !isNaN(Number(k)));

    if (hasNumbers) {
        keys = keys.filter(v => isNaN(Number(v)));
    }

    return keys.map(key => (Enum[key]));
}

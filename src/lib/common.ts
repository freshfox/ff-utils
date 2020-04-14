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

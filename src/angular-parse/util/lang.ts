export function compileToJSON(json: any) {
    return JSON.stringify(json).replace(/"/g, '');
}

export function isPresent(obj: any) {
    return obj !== null && obj !== undefined;
}

export function isJsObject(obj: any) {
    return obj !== null && (typeof obj === 'function' || typeof obj === 'object');
}

export function isFunction(val: any) {
    return typeof val === 'function';
}

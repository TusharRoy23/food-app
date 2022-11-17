export function clearPayload(object: any) {
    for (const keyName in object) {
        if (object[keyName] === null || object[keyName] === undefined) {
            delete object[keyName];
        }
    }
    return object;
}
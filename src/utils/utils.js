export const camelToKebab = str => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const kebabToCamel = str => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

export const convertValue = (value, type) => {
    if (value == null) return value;

    if (type === Boolean) {
        return value === '' || value === 'true' || value === true;
    }
    if (type === Number) {
        const number = +value;
        return isNaN(number) ? 0 : number;
    }
    if (type === Array || type === Object) {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return type === Array ? [] : {};
            }
        }
        return value;
    }
    return String(value);
}
export interface ArrayUtils {
    unique<T>(arr: T[]): T[];
}

export class ArrayUtilsImpl implements ArrayUtils {
    unique<T>(arr: T[]): T[] {
        return arr.filter((item, idx) => arr.indexOf(item) === idx);
    }
}

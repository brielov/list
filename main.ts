function assert(
    // deno-lint-ignore no-explicit-any
    condition: any,
    message = "Assertion failed",
): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function isDefined<T>(value: T): value is NonNullable<T> {
    return typeof value !== "undefined" && value !== null;
}

export class List<T> implements Iterable<T> {
    #struct: Record<number, T> = Object.create(null);
    #length = 0;

    *[Symbol.iterator](): Iterator<T> {
        for (let i = 0; i < this.#length; i++) {
            yield this.#struct[i];
        }
    }

    private constructor(init?: ArrayLike<T>) {
        if (init) {
            for (let i = 0; i < init.length; i++) {
                this.#struct[i] = init[i];
            }
            this.#length = init.length;
        }
    }

    get size() {
        return this.#length;
    }

    static empty<T>(): List<T> {
        return new List();
    }

    static from<T>(iter: Iterable<T> | ArrayLike<T>): List<T> {
        return new List(Array.from(iter));
    }

    static of<T>(...items: readonly T[]): List<T> {
        return new List(items);
    }

    static range(from: number, to: number, step = 1): List<number> {
        assert(step > 0, "'step' must be a positive number");
        const list = List.empty<number>();
        for (; from <= to; from += step) {
            list.#struct[list.#length++] = from;
        }
        return list;
    }

    isEmpty() {
        return this.#length === 0;
    }

    append(...items: readonly T[]): List<T> {
        const other = List.from(this);
        for (let i = 0; i < items.length; i++) {
            other.#struct[other.#length++] = items[i];
        }
        return other;
    }

    concat(...lists: readonly List<T>[]): List<T> {
        const other = List.from(this);
        for (let i = 0; i < lists.length; i++) {
            const list = lists[i];
            for (let j = 0; j < list.size; j++) {
                other.#struct[other.#length++] = list.#struct[j];
            }
        }
        return other;
    }

    at(index: number): T | undefined {
        if (index < 0) {
            index = this.#length + index;
        }
        return this.#struct[index];
    }

    first(): T | undefined {
        return this.#struct[0];
    }

    last(): T | undefined {
        return this.#struct[this.#length - 1];
    }

    each(callback: (item: T, index: number) => void): this {
        assert(
            typeof callback === "function",
            "'callback' must be of type 'function'",
        );
        for (let i = 0; i < this.#length; i++) {
            callback(this.#struct[i], i);
        }
        return this;
    }

    map<U>(callback: (item: T, index: number) => U): List<U> {
        assert(
            typeof callback === "function",
            "'callback' must be of type 'function'",
        );
        const other = List.empty<U>();
        other.#length = this.#length;
        for (let i = 0; i < this.#length; i++) {
            other.#struct[i] = callback(this.#struct[i], i);
        }
        return other;
    }

    filter<U extends T>(
        predicate: (item: T, index: number) => item is U,
    ): List<U>;
    filter(predicate: (item: T, index: number) => boolean): List<T>;
    filter(predicate: (item: T, index: number) => boolean) {
        assert(
            typeof predicate === "function",
            "'predicate' must be of type 'function'",
        );
        const other = List.empty();
        for (let i = 0; i < this.#length; i++) {
            const item = this.#struct[i];
            if (predicate(item, i)) {
                other.#struct[other.#length++] = item;
            }
        }
        return other;
    }

    clone(deep?: boolean): List<T> {
        if (!deep) return List.from(this);
        const other = List.empty<T>();
        other.#struct = structuredClone(this.#struct);
        other.#length = this.#length;
        return other;
    }

    compact(): List<NonNullable<T>> {
        return this.filter(isDefined);
    }

    compactMap<U>(
        callback: (item: T, index: number) => U,
    ): List<NonNullable<U>> {
        assert(
            typeof callback === "function",
            "'callback' must be of type 'function'",
        );
        const other = List.empty<NonNullable<U>>();
        for (let i = 0; i < this.#length; i++) {
            const item = callback(this.#struct[i], i);
            if (isDefined(item)) {
                other.#struct[other.#length++] = item;
            }
        }
        return other;
    }

    countBy<K extends string>(
        callback: (item: T, index: number) => K,
    ): Record<K, number> {
        assert(
            typeof callback === "function",
            "'callback' must be of type 'function'",
        );
        const obj: Record<K, number> = Object.create(null);
        for (let i = 0; i < this.#length; i++) {
            const key = callback(this.#struct[i], i);
            if (!obj[key]) {
                obj[key] = 0;
            }
            obj[key] += 1;
        }
        return obj;
    }

    groupBy<K extends string>(
        callback: (item: T, index: number) => K,
    ): Record<K, T[]> {
        const obj: Record<K, T[]> = Object.create(null);
        for (let i = 0; i < this.#length; i++) {
            const item = this.#struct[i];
            const key = callback(item, i);
            if (!obj[key]) {
                obj[key] = [];
            }
            obj[key].push(item);
        }
        return obj;
    }

    has(candidate: T): boolean {
        return this.some((item) => Object.is(candidate, item));
    }

    prepend(...items: readonly T[]): List<T> {
        const other = List.from(items);
        for (let i = 0; i < this.#length; i++) {
            other.#struct[other.#length++] = this.#struct[i];
        }
        return other;
    }

    slice(start?: number, end?: number): List<T> {
        const len = this.#length;
        start ??= 0;
        end ??= len;
        if (start < 0) {
            start = len + start;
        }
        if (end < 0) {
            end = len + end;
        }
        const other = List.empty<T>();
        while (start < end && start < len) {
            other.#struct[other.#length++] = this.#struct[start++];
        }
        return other;
    }

    splice(
        start?: number,
        deleteCount?: number,
        ...items: readonly T[]
    ): List<T> {
        if (!isDefined(start)) {
            return this.slice();
        }

        if (start < 0) {
            start = this.#length + start;
        }

        if (!isDefined(deleteCount)) {
            return this.slice(0, start);
        }

        if (deleteCount < 0) {
            return this.slice();
        }

        // TODO: come up with a better, more performant algorithm
        const head = this.slice(0, start);
        const tail = this.slice(start + deleteCount);
        const itemList = List.from(items);

        return head.concat(itemList, tail);
    }

    enumerate(): List<[index: number, item: T]> {
        const other = List.empty<[number, T]>();
        for (let i = 0; i < this.#length; i++) {
            other.#struct[other.#length++] = [i, this.#struct[i]];
        }
        return other;
    }

    reverse(): List<T> {
        const other = List.empty<T>();
        for (let i = this.#length - 1; i >= 0; i--) {
            other.#struct[other.#length++] = this.#struct[i];
        }
        return other;
    }

    some(predicate: (item: T, index: number) => boolean): boolean {
        assert(
            typeof predicate === "function",
            "'predicate' must be of type 'function'",
        );
        for (let i = 0; i < this.#length; i++) {
            if (predicate(this.#struct[i], i)) {
                return true;
            }
        }
        return false;
    }

    every(predicate: (item: T, index: number) => boolean): boolean {
        assert(
            typeof predicate === "function",
            "'predicate' must be of type 'function'",
        );
        for (let i = 0; i < this.#length; i++) {
            if (!predicate(this.#struct[i], i)) {
                return false;
            }
        }
        return true;
    }

    drop(count: number): List<T> {
        assert(count > 0, "'count' must be greater than zero.");
        return this.slice(count);
    }

    dropWhile(predicate: (item: T, index: number) => boolean): List<T> {
        let dropIndex = 0;
        while (
            dropIndex < this.#length &&
            predicate(this.#struct[dropIndex], dropIndex)
        ) {
            dropIndex++;
        }
        return this.slice(dropIndex);
    }

    take(count: number): List<T> {
        return this.slice(0, count);
    }

    takeWhile(predicate: (item: T, index: number) => boolean): List<T> {
        let takeIndex = 0;
        while (
            takeIndex < this.#length &&
            predicate(this.#struct[takeIndex], takeIndex)
        ) {
            takeIndex++;
        }
        return this.take(takeIndex);
    }

    tail(): List<T> {
        return this.slice(1);
    }

    swap(index1: number, index2: number): List<T> {
        const other = this.clone();

        if (index1 < 0) {
            index1 = this.#length + index1;
        }

        if (index2 < 0) {
            index2 = this.#length + index2;
        }

        if (index1 >= this.#length || index2 >= this.#length) {
            return other;
        }

        other.#struct[index2] = this.#struct[index1];
        other.#struct[index1] = this.#struct[index2];

        return other;
    }

    removeAt(index: number): List<T> {
        return this.splice(index, 1);
    }

    replaceAt(index: number, item: T): List<T> {
        return this.splice(index, 1, item);
    }

    reduce<U>(
        initialValue: U,
        callback: (accumulator: U, currentItem: T, index: number) => U,
    ): U {
        let accumulator = initialValue;
        for (let i = 0; i < this.#length; i++) {
            accumulator = callback(accumulator, this.#struct[i], i);
        }
        return accumulator;
    }

    updateAt(index: number, callback: (prev: T) => T): List<T> {
        if (index < 0) {
            index = this.#length + index;
        }
        const item = this.at(index);
        const other = this.slice();
        if (item) {
            other.#struct[index] = callback(item);
        }
        return other;
    }

    random(): T | undefined {
        const randomIndex = Math.floor(Math.random() * this.#length);
        return this.#struct[randomIndex];
    }

    unique(): List<T> {
        return List.from(new Set(this));
    }

    sort(compareFn?: (a: T, b: T) => number): List<T> {
        const other = this.clone();
        if (this.#length <= 1) {
            return other;
        }
        const pivotIndex = Math.floor(this.#length / 2);
        const pivot = this.#struct[pivotIndex];
        let left = List.empty<T>();
        let right = List.empty<T>();

        for (let i = 0; i < this.#length; i++) {
            if (i === pivotIndex) {
                continue;
            }

            if (
                compareFn
                    ? compareFn(this.#struct[i], pivot) < 0
                    : this.#struct[i] < pivot
            ) {
                left = left.append(this.#struct[i]);
            } else {
                right = right.append(this.#struct[i]);
            }
        }
        return left.sort(compareFn).append(pivot).concat(right.sort(compareFn));
    }

    toArray() {
        return Array.from(this);
    }

    toJSON() {
        return this.toArray();
    }

    toString() {
        return this.toArray().toString();
    }
}

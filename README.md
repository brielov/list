## Static

- from<T>(iter: Iterable<T> | ArrayLike<T>): List<T>;
- empty<T>(): List<T>
- of<T>(...items: T[]): List<T>;
- range(from: number, to: number, step?: number): List<number>;

## Methods

- append(...items: T[]): List<T>;
- at(index: number): T | undefined;
- chunk(size: number): List<T[]>;
- clone(deep?: boolean): List<T>;
- compact(): List<NonNullable<T>>;
- compactMap<U>(callback: (item: T, index: number) => U): List<NonNullable<U>>
- concat(...items: List<T>): List<T>;
- countBy<K extends string>(f: (item: T) => K): Record<K, number>;
- difference(other: List<T>): List<T>
- drop(count: number): List<T>;
- dropFirst(): List<T>;
- dropLast(): List<T>;
- dropWhile(f: (item: T) => boolean): List<T>
- each(f: (item: T) => void): this;
- enumerate(): List<[number, T]>
- every(f: (item: T) => boolean) : boolean;
- filter(f: (item: T) => boolean): List<T>;
- find(f: (item: T) => boolean): T | undefined;
- findIndex(f: (item: T) => boolean): number;
- findLast(f: (item: T) => boolean): T | undefined;
- findLastIndex(f: (item: T) => boolean): number;
- first(): T | undefined;
- flat(): List<T>;
- flatMap<U>(callback: (item: T, index: number) => U | ReadonlyArray<U>):
  List<U>;
- groupBy<K extends string>(callback: (item: T, index: number) => K): Record<K,
  T[]>;
- has(item: T): boolean;
- insert(item: T, index: number): List<T>;
- intersection(other: List<T>): List<T>;
- isEmpty(): boolean;
- isNotEmpty(): boolean;
- last(): T | undefined;
- map<U>(f: (item: T) => U): List<U>;
- move(src: number, dest: number): List<T>;
- prepend(...items: T[]): List<T>;
- random(): T | undefined;
- reduce<U>(init: U, f: (acc: U, item: T) => U): U;
- removeAt(index: number): List<T>;
- replaceAt(item: T, index: number): List<T>;
- reverse(): List<T>;
- shuffle(): List<T>;
- slice(start?: number, end?: number): List<T>;
- some(f: (item: T) => boolean): boolean;
- sort(): List<T>;
- splice(start?: number, deleteCount: number, ...items: ReadonlyArray<T>):
  List<T>
- swap(a: number, b: number): List<T>;
- tail(): List<T>
- take(count: number): List<T>;
- takeWhile(f: (item: T) => boolean): List<T>;
- union(other: List<T>): List<T>;
- unique(): List<T>;
- updateAt(index: number, callback: (item: T) => T): List<T>;
- zip<U>(other: List<U>): List<[T, U]>;

/**
 * Returns the resolved index for a given position in a list.
 *
 * @param {List<T>} list - The list to retrieve the index from.
 * @param {number} index - The index or offset from the end of the list.
 * @returns {number} The resolved index, accounting for negative values as offsets from the end.
 * @template T - The type of elements in the list.
 *
 * @example
 * const myList = List.from([1, 2, 3, 4, 5]);
 * console.log(getIndex(myList, 2));    // Output: 2
 * console.log(getIndex(myList, -1));   // Output: 4 (last element)
 */
function resolveIndex<T>(list: List<T>, index: number): number {
  // If the index is negative, resolve it as an offset from the end of the list
  if (index < 0) {
    return list.size + index;
  }

  // If the index is non-negative, return it as is
  return index;
}

/**
 * Checks if a value is defined and not null.
 *
 * @param {T} value - The value to be checked.
 * @returns {boolean} `true` if the value is not undefined and not null, otherwise `false`.
 * @template T - The type of the value.
 *
 * @example
 * const someValue: string | null = "Hello";
 * if (isDefined(someValue)) {
 *   console.log(someValue.toUpperCase());  // Safe to access property after the check
 * }
 */
function isDefined<T>(value: T): value is NonNullable<T> {
  return typeof value !== "undefined" && value !== null;
}

/**
 * Asserts that a given condition is true, throwing an error with a specified message if false.
 *
 * @param {any} condition - The condition to be checked.
 * @param {string} message - The error message to be thrown if the condition is false.
 * @throws {Error} If the condition is false.
 *
 * @example
 * const num = 42;
 * assert(num > 0, "Number must be positive");  // No error thrown
 * assert(num < 0, "Number must be positive");  // Error: Number must be positive
 */
// deno-lint-ignore no-explicit-any
function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Checks if the given index is within the valid range for the list.
 *
 * @param {List<T>} list - The value to be checked.
 * @param index - The index to check.
 * @returns `true` if the index is valid, `false` otherwise.
 */
function isValidIndex<T>(list: List<T>, index: number): boolean {
  return index >= 0 && index < list.size;
}

/**
 * Immutable list data structure.
 *
 * @template T - The type of elements in the list.
 */
export class List<T> implements Iterable<T> {
  /**
   * Private constructor for creating a List instance.
   *
   * @param {readonly T[]} arr - The array of elements to initialize the list.
   */
  private constructor(private readonly arr: readonly T[]) {}

  /**
   * Returns an iterator for the list.
   *
   * @returns {Iterator<T>} An iterator for the elements in the list.
   */
  *[Symbol.iterator](): Iterator<T> {
    yield* this.arr[Symbol.iterator]();
  }

  /**
   * Creates an empty List.
   *
   * @returns {List<T>} An empty List instance.
   *
   * @example
   * const emptyList = List.empty<number>();
   * console.log([...emptyList]);  // Output: [] (empty array)
   */
  static empty<T>(): List<T> {
    return new List([]);
  }

  /**
   * Creates a new List instance from an iterable or array-like object.
   *
   * @param {Iterable<T> | ArrayLike<T>} iterable - The iterable or array-like object to create the list from.
   * @returns {List<T>} A new List instance containing the elements from the provided iterable.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.from([1, 2, 3, 4, 5]);
   * console.log([...myList]);  // Output: [1, 2, 3, 4, 5]
   */
  static from<T>(iterable: Iterable<T> | ArrayLike<T>): List<T> {
    return new List(Array.from(iterable));
  }

  /**
   * Creates a new List instance from a fixed set of elements.
   *
   * @param {...readonly T[]} items - The elements to include in the list.
   * @returns {List<T>} A new List instance containing the provided elements.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * console.log([...myList]);  // Output: [1, 2, 3, 4, 5]
   */
  static of<T>(...items: readonly T[]): List<T> {
    return new List(items);
  }

  /**
   * Creates a new List instance containing a range of numbers.
   *
   * @param {number} from - The starting value of the range (inclusive).
   * @param {number} to - The ending value of the range (exclusive).
   * @param {number} [step=1] - The step between each value in the range.
   * @returns {List<number>} A new List instance containing the range of numbers.
   *
   * @throws {Error} If the step is not a positive number.
   *
   * @example
   * const numRange = List.range(1, 10, 2);
   * console.log([...numRange]);  // Output: [1, 3, 5, 7, 9]
   */
  static range(from: number, to: number, step = 1): List<number> {
    assert(step > 0, "'step' must be a positive number.");
    const result: number[] = [];
    for (let i = from; i < to; i += step) {
      result.push(i);
    }
    return new List(result);
  }

  /**
   * Gets the number of elements in the list.
   *
   * @type {number}
   * @readonly
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * console.log(myList.size);  // Output: 5
   */
  get size() {
    return this.arr.length;
  }

  /**
   * Computes the absolute value of each numerical element in the list.
   *
   * @returns {List<number>} A new List instance containing the absolute values of all numerical elements.
   *
   * @description
   * The `abs` method creates a new list with the absolute value of each numerical element.
   * Non-numerical elements are ignored during the absolute value operation.
   *
   * @example
   * const numberList = List.of(-2, 3, -4);
   * const absList = numberList.abs();
   * console.log([...absList]);  // Output: [2, 3, 4]
   */
  abs(): List<number> {
    return this.numbers().map((num) => Math.abs(num));
  }

  /**
   * Appends elements to the end of the list, creating a new List instance.
   *
   * @param {...readonly T[]} items - The elements to append to the list.
   * @returns {List<T>} A new List instance containing the original elements and the appended items.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3);
   * const newList = myList.append(4, 5);
   * console.log([...newList]);  // Output: [1, 2, 3, 4, 5]
   */
  append(...items: readonly T[]): List<T> {
    return new List([...this.arr, ...items]);
  }

  /**
   * Retrieves the element at a specified index in the list.
   *
   * @param {number} index - The index of the element to retrieve. Negative values count from the end of the list.
   * @returns {T | undefined} The element at the specified index or undefined if the index is out of bounds.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of("apple", "banana", "cherry");
   * console.log(myList.at(1));  // Output: "banana"
   * console.log(myList.at(-1));  // Output: "cherry"
   */
  at(index: number): T | undefined {
    index = resolveIndex(this, index);
    return this.arr[index];
  }

  /**
   * Computes the average (mean) of all numerical elements in the list.
   *
   * @returns {number} The average of all numerical elements in the list.
   *
   * @description
   * The `average` method calculates the mean value by summing up all numerical elements and dividing
   * the total by the number of elements. Non-numerical elements are ignored during the calculation.
   *
   * @example
   * const numberList = List.of(1, 2, 3, 4, 5);
   * const result = numberList.average();
   * console.log(result);  // Output: 3 (average of 1, 2, 3, 4, 5)
   */
  avg(): number {
    const numbers = this.numbers();
    if (numbers.isEmpty()) {
      return 0; // Return 0 for an empty list or if no numerical elements are found.
    }
    // We could use `sum` here but it would call `numbers` again internally,
    // which would be a waste since we already have a guaranteed list of numbers.
    const sum = numbers.reduce(0, (a, b) => a + b);
    return sum / numbers.size;
  }

  /**
   * Splits the list into chunks of a specified size, creating a new List instance.
   *
   * @param {number} size - The size of each chunk.
   * @returns {List<T[]>} A new List instance containing chunks of elements.
   *
   * @throws {Error} If the size is not greater than zero.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9);
   * const chunked = myList.chunk(3);
   * console.log([...chunked]);  // Output: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
   */
  chunk(size: number): List<T[]> {
    assert(size > 0, "'size' must be greater than zero.");
    const chunks: T[][] = [];
    for (let i = 0; i < this.arr.length; i += size) {
      chunks.push(this.arr.slice(i, i + size));
    }
    return new List(chunks);
  }

  /**
   * Creates a shallow or deep clone of the list.
   *
   * @param {boolean} [deep=false] - If true, creates a deep clone using structured cloning.
   * @returns {List<T>} A new List instance representing a shallow or deep clone of the original list.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3);
   * const shallowClone = myList.clone();
   * const deepClone = myList.clone(true);
   * console.log([...shallowClone]);  // Output: [1, 2, 3]
   * console.log([...deepClone]);  // Output: [1, 2, 3]
   */
  clone(deep?: boolean): List<T> {
    if (deep) {
      return new List(structuredClone(this.arr));
    }
    return this.slice();
  }

  /**
   * Creates a new List instance containing only the non-nullable elements of the original list.
   *
   * @returns {List<NonNullable<T>>} A new List instance with non-nullable elements.
   * @template T - The type of elements in the original list.
   *
   * @example
   * const myList = List.of(1, null, "apple", undefined, 5);
   * const compactList = myList.compact();
   * console.log([...compactList]);  // Output: [1, "apple", 5]
   */
  compact(): List<NonNullable<T>> {
    return this.filter(isDefined);
  }

  /**
   * Concatenates multiple lists with the current list, creating a new List instance.
   *
   * @param {...readonly List<T>[]} items - Lists to concatenate with the current list.
   * @returns {List<T>} A new List instance containing the concatenated elements.
   * @template T - The type of elements in the lists.
   *
   * @example
   * const list1 = List.of(1, 2, 3);
   * const list2 = List.of("apple", "orange");
   * const concatenatedList = list1.concat(list2);
   * console.log([...concatenatedList]);  // Output: [1, 2, 3, "apple", "orange"]
   */
  concat(...items: readonly List<T>[]): List<T> {
    const arr = this.arr.slice();
    for (const list of items) {
      arr.push(...list.arr);
    }
    return new List(arr);
  }

  /**
   * Counts the occurrences of each unique key generated by a callback function.
   *
   * @param {(item: T) => K} callbackFn - A function that generates keys for counting.
   * @returns {Record<K, number>} An object with keys as generated by the callback function and values as counts.
   * @template K - The type of keys generated by the callback function.
   *
   * @example
   * const myList = List.of("apple", "banana", "apple", "orange", "banana", "apple");
   * const countResult = myList.countBy((fruit) => fruit);
   * console.log(countResult);
   * // Output: { apple: 3, banana: 2, orange: 1 }
   */
  countBy<K extends string>(callbackFn: (item: T) => K): Record<K, number> {
    const obj: Record<K, number> = Object.create(null);
    for (let i = 0; i < this.arr.length; i++) {
      const key = callbackFn(this.arr[i]);
      obj[key] = (obj[key] ?? 0) + 1;
    }
    return obj;
  }

  /**
   * Returns a new List instance containing elements that are present in the current list but not in another list.
   *
   * @param {List<T>} other - The list to compare with.
   * @returns {List<T>} A new List instance with elements that are unique to the current list.
   * @template T - The type of elements in the lists.
   *
   * @example
   * const list1 = List.of(1, 2, 3, 4);
   * const list2 = List.of(3, 4, 5, 6);
   * const diffList = list1.difference(list2);
   * console.log([...diffList]);  // Output: [1, 2]
   */
  difference(other: List<T>): List<T> {
    const otherSet = new Set(other.arr);
    const result: T[] = [];
    for (let i = 0; i < this.arr.length; i++) {
      const item = this.arr[i];
      if (!otherSet.has(item)) {
        result.push(item);
      }
    }
    return new List(result);
  }

  /**
   * Creates a new List instance with the first `count` elements removed from the current list.
   *
   * @param {number} count - The number of elements to drop from the beginning of the list.
   * @returns {List<T>} A new List instance without the first `count` elements.
   *
   * @throws {Error} If the count is not greater than zero.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const droppedList = myList.drop(2);
   * console.log([...droppedList]);  // Output: [3, 4, 5]
   */
  drop(count: number): List<T> {
    assert(count > 0, "'count' must be greater than zero.");
    return this.slice(count);
  }

  /**
   * Creates a new List instance with elements removed from the beginning until the first element that does not satisfy a predicate.
   *
   * @param {(item: T) => boolean} predicate - A function that returns true for elements to be dropped.
   * @returns {List<T>} A new List instance without elements from the beginning that satisfy the predicate.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const droppedList = myList.dropWhile((num) => num < 3);
   * console.log([...droppedList]);  // Output: [3, 4, 5]
   */
  dropWhile(predicate: (item: T) => boolean): List<T> {
    let dropIndex = 0;
    while (dropIndex < this.arr.length && predicate(this.arr[dropIndex])) {
      dropIndex++;
    }
    return this.slice(dropIndex);
  }

  /**
   * Executes a provided function once for each element in the list, in order.
   *
   * @param {(item: T, index: number) => void} callbackFn - A function to execute for each element.
   * @returns {this} The current List instance for method chaining.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3);
   * myList.each((item, index) => {
   *   console.log(`Element at index ${index}: ${item}`);
   * });
   * // Output:
   * // Element at index 0: 1
   * // Element at index 1: 2
   * // Element at index 2: 3
   */
  each(callbackFn: (item: T, index: number) => void): this {
    this.arr.forEach(callbackFn);
    return this;
  }

  /**
   * Creates a new List instance by pairing each element of the list with its corresponding index.
   *
   * @returns {List<[number, T]>} A new List instance containing pairs of indices and elements.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of("apple", "banana", "cherry");
   * const enumeratedList = myList.enumerate();
   * console.log([...enumeratedList]);  // Output: [[0, "apple"], [1, "banana"], [2, "cherry"]]
   */
  enumerate(): List<[number, T]> {
    const arr: [number, T][] = [];
    for (let i = 0; i < this.arr.length; i++) {
      arr.push([i, this.arr[i]]);
    }
    return new List(arr);
  }

  /**
   * Tests whether all elements in the list pass the provided predicate function.
   *
   * @param {(item: T) => boolean} predicate - A function to test each element.
   * @returns {boolean} `true` if all elements pass the predicate, otherwise `false`.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(2, 4, 6, 8, 10);
   * const allEven = myList.every((num) => num % 2 === 0);
   * console.log(allEven);  // Output: true
   */
  every(predicate: (item: T) => boolean): boolean {
    return this.arr.every(predicate);
  }

  /**
   * Creates a new List instance containing elements that satisfy the provided type predicate.
   *
   * @param {(item: T) => item is U} predicate - A type predicate function to filter elements.
   * @returns {List<U>} A new List instance containing elements that satisfy the type predicate.
   * @template T - The type of elements in the original list.
   * @template U - The type of elements in the filtered list.
   *
   * @example
   * class Animal { name: string; }
   * class Dog extends Animal { breed: string; }
   * class Cat extends Animal { color: string; }
   *
   * const animals = List.of(new Dog(), new Cat(), new Dog(), new Cat());
   * const dogs = animals.filter((animal): animal is Dog => animal instanceof Dog);
   * console.log([...dogs]);  // Output: [Dog, Dog]
   */
  filter<U extends T>(predicate: (item: T) => item is U): List<U>;

  /**
   * Creates a new List instance containing elements that satisfy the provided predicate.
   *
   * @param {(item: T) => boolean} predicate - A function to test each element for inclusion.
   * @returns {List<T>} A new List instance containing elements that satisfy the predicate.
   * @template T - The type of elements in the original list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const evenNumbers = myList.filter((num) => num % 2 === 0);
   * console.log([...evenNumbers]);  // Output: [2, 4]
   */
  filter(predicate: (item: T) => boolean): List<T>;
  filter(predicate: (item: T) => boolean) {
    return new List(this.arr.filter(predicate));
  }

  /**
   * Finds the first element in the list that satisfies the provided predicate.
   *
   * @param {(item: T) => boolean} predicate - A function to test each element.
   * @returns {T | undefined} The first element that satisfies the predicate, or undefined if none is found.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const foundElement = myList.find((num) => num > 2);
   * console.log(foundElement);  // Output: 3
   */
  find(predicate: (item: T) => boolean): T | undefined {
    return this.arr.find(predicate);
  }

  /**
   * Finds the index of the first element in the list that satisfies the provided predicate.
   *
   * @param {(item: T) => boolean} predicate - A function to test each element.
   * @returns {number} The index of the first element that satisfies the predicate, or -1 if none is found.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const foundIndex = myList.findIndex((num) => num > 2);
   * console.log(foundIndex);  // Output: 2
   */
  findIndex(predicate: (item: T) => boolean): number {
    return this.arr.findIndex(predicate);
  }

  /**
   * Finds the last element in the list that satisfies the provided predicate.
   *
   * @param {(item: T) => boolean} predicate - A function to test each element.
   * @returns {T | undefined} The last element that satisfies the predicate, or undefined if none is found.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const foundElement = myList.findLast((num) => num > 2);
   * console.log(foundElement);  // Output: 5
   */
  findLast(predicate: (item: T) => boolean): T | undefined {
    return this.arr.findLast(predicate);
  }

  /**
   * Finds the index of the last element in the list that satisfies the provided predicate.
   *
   * @param {(item: T) => boolean} predicate - A function to test each element.
   * @returns {number} The index of the last element that satisfies the predicate, or -1 if none is found.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const foundIndex = myList.findLastIndex((num) => num > 2);
   * console.log(foundIndex);  // Output: 4
   */
  findLastIndex(predicate: (item: T) => boolean): number {
    return this.arr.findLastIndex(predicate);
  }

  /**
   * Retrieves the first element of the list.
   *
   * @returns {T | undefined} The first element of the list or undefined if the list is empty.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const firstElement = myList.first();
   * console.log(firstElement);  // Output: 1
   */
  first(): T | undefined {
    return this.at(0);
  }

  /**
   * Creates a new List instance by flattening the original list up to a specified depth.
   *
   * @param {number | undefined} [depth] - The depth to which the list should be flattened.
   * @returns {List} A new List instance containing the flattened elements.
   * @template T - The type of elements in the list.
   *
   * @example
   * const nestedList = List.of([1, 2, [3, 4]], [5, [6]]);
   * const flatList = nestedList.flatten();
   * console.log([...flatList]);  // Output: [1, 2, 3, 4, 5, 6]
   */
  flatten<T extends number>(depth?: T) {
    return new List(this.arr.flat(depth));
  }

  /**
   * Groups elements of the list based on a provided key-generating callback function.
   *
   * @param {(item: T) => K} callbackFn - A function that generates keys for grouping.
   * @returns {Record<K, T[]>} An object with keys as generated by the callback function and values as arrays of grouped elements.
   * @template K - The type of keys generated by the callback function.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(
   *   { name: "apple", category: "fruit" },
   *   { name: "banana", category: "fruit" },
   *   { name: "carrot", category: "vegetable" }
   * );
   * const groupedByCategory = myList.groupBy((item) => item.category);
   * console.log(groupedByCategory);
   * // Output: { fruit: [{ name: "apple", category: "fruit" }, { name: "banana", category: "fruit" }],
   * //           vegetable: [{ name: "carrot", category: "vegetable" }] }
   */
  groupBy<K extends string>(callbackFn: (item: T) => K): Record<K, T[]> {
    const obj: Record<K, T[]> = Object.create(null);
    for (let i = 0; i < this.arr.length; i++) {
      const item = this.arr[i];
      const key = callbackFn(item);
      (obj[key] ??= []).push(item);
    }
    return obj;
  }

  /**
   * Checks if the list contains a specific element.
   *
   * @param {T} item - The element to check for existence in the list.
   * @returns {boolean} `true` if the element is found in the list, otherwise `false`.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const hasThree = myList.has(3);
   * console.log(hasThree);  // Output: true
   */
  has(item: T): boolean {
    return this.arr.includes(item);
  }

  /**
   * Inserts an element at a specified index in the list, creating a new List instance.
   *
   * @param {number} index - The index at which to insert the element. Negative values count from the end of the list.
   * @param {T} item - The element to insert into the list.
   * @returns {List<T>} A new List instance with the element inserted at the specified index.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const newList = myList.insertAt(2, 99);
   * console.log([...newList]);  // Output: [1, 2, 99, 3, 4, 5]
   */
  insertAt(index: number, item: T): List<T> {
    index = resolveIndex(this, index);
    return this.splice(index, 0, item);
  }

  /**
   * Returns a new List instance containing elements that are common to both the current list and another list.
   *
   * @param {List<T>} other - The list to intersect with.
   * @returns {List<T>} A new List instance with elements that are common to both lists.
   * @template T - The type of elements in the lists.
   *
   * @example
   * const list1 = List.of(1, 2, 3, 4);
   * const list2 = List.of(3, 4, 5, 6);
   * const intersectionList = list1.intersection(list2);
   * console.log([...intersectionList]);  // Output: [3, 4]
   */
  intersection(other: List<T>): List<T> {
    const otherSet = new Set(other.arr);
    const result: T[] = [];
    for (let i = 0; i < this.arr.length; i++) {
      const item = this.arr[i];
      if (otherSet.has(item)) {
        result.push(item);
        otherSet.delete(item); // Ensure unique elements in the result
      }
    }
    return new List(result);
  }

  /**
   * Checks if the list is empty.
   *
   * @returns {boolean} `true` if the list is empty, otherwise `false`.
   *
   * @example
   * const myList = List.empty();
   * console.log(myList.isEmpty());  // Output: true
   */
  isEmpty(): boolean {
    return this.arr.length === 0;
  }

  /**
   * Checks if the list is not empty.
   *
   * @returns {boolean} `true` if the list is not empty, otherwise `false`.
   *
   * @example
   * const myList = List.of(1, 2, 3);
   * console.log(myList.isNotEmpty());  // Output: true
   */
  isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  /**
   * Retrieves the last element of the list.
   *
   * @returns {T | undefined} The last element of the list or undefined if the list is empty.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const lastElement = myList.last();
   * console.log(lastElement);  // Output: 5
   */
  last(): T | undefined {
    return this.at(-1);
  }

  /**
   * Creates a new List instance by applying a provided function to each element of the original list.
   *
   * @param {(item: T) => U} callbackFn - A function to apply to each element.
   * @returns {List<U>} A new List instance containing the mapped elements.
   * @template T - The type of elements in the original list.
   * @template U - The type of elements in the mapped list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const squaredList = myList.map((num) => num * num);
   * console.log([...squaredList]);  // Output: [1, 4, 9, 16, 25]
   */
  map<U>(callbackFn: (item: T) => U): List<U> {
    return new List(this.arr.map(callbackFn));
  }

  /**
   * Finds the maximum numerical value among all numerical elements in the list.
   *
   * @returns {number} The maximum numerical value in the list.
   *
   * @description
   * The `max` method finds and returns the maximum numerical value present among all numerical elements.
   * Non-numerical elements are ignored during the search.
   *
   * @example
   * const numberList = List.of(10, 5, 20, 15);
   * const maxValue = numberList.max();
   * console.log(maxValue);  // Output: 20
   */
  max(): number {
    return Math.max(...this.numbers());
  }

  /**
   * Finds the minimum numerical value among all numerical elements in the list.
   *
   * @returns {number} The minimum numerical value in the list.
   *
   * @description
   * The `min` method finds and returns the minimum numerical value present among all numerical elements.
   * Non-numerical elements are ignored during the search.
   *
   * @example
   * const numberList = List.of(10, 5, 20, 15);
   * const minValue = numberList.min();
   * console.log(minValue);  // Output: 5
   */
  min(): number {
    return Math.min(...this.numbers());
  }

  /**
   * Moves an element from one index to another in the list, creating a new List instance.
   *
   * @param {number} fromIndex - The index from which to move the element. Negative values count from the end of the list.
   * @param {number} toIndex - The index to which to move the element. Negative values count from the end of the list.
   * @returns {List<T>} A new List instance with the element moved from the source index to the destination index.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of("apple", "banana", "cherry");
   * const movedList = myList.move(0, 2);
   * console.log([...movedList]);  // Output: ["banana", "cherry", "apple"]
   */
  move(fromIndex: number, toIndex: number): List<T> {
    fromIndex = resolveIndex(this, fromIndex);
    toIndex = resolveIndex(this, toIndex);
    if (!isValidIndex(this, fromIndex) || !isValidIndex(this, toIndex)) {
      // If either index is invalid, return the original list without modifications
      return this;
    }
    const arr = this.arr.slice();
    const [itemToMove] = arr.splice(fromIndex, 1);
    // Adjust the toIndex in case it's after the fromIndex
    toIndex = toIndex > fromIndex ? toIndex - 1 : toIndex;
    arr.splice(toIndex, 0, itemToMove);
    return new List(arr);
  }

  /**
   * Creates a new List instance containing only the numerical elements from the original list.
   *
   * @returns {List<number>} A new List instance containing only the numerical elements.
   *
   * @description
   * The `numbers` method filters the original list, retaining only the elements of type `number`.
   *
   * @example
   * const mixedList = List.of(1, 'two', 3, 'four', 5, NaN, Infinity);
   * const numberList = mixedList.numbers();
   * console.log([...numberList]);  // Output: [1, 3, 5]
   */
  numbers(): List<number> {
    return this.filter(
      (item) => typeof item === "number" && Number.isFinite(item),
    ) as List<number>;
  }

  /**
   * Creates a new List instance by adding elements to the beginning of the original list.
   *
   * @param {...readonly T[]} items - The elements to add to the beginning of the list.
   * @returns {List<T>} A new List instance containing the original elements and the prepended items.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(3, 4, 5);
   * const newList = myList.prepend(1, 2);
   * console.log([...newList]);  // Output: [1, 2, 3, 4, 5]
   */
  prepend(...items: readonly T[]): List<T> {
    return new List([...items, ...this.arr]);
  }

  /**
   * Retrieves a randomly selected element from the list.
   *
   * @returns {T | undefined} A randomly selected element from the list, or undefined if the list is empty.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of("apple", "banana", "cherry");
   * const randomFruit = myList.random();
   * console.log(randomFruit);  // Output: "banana" (example result varies)
   */
  random(): T | undefined {
    const randomIndex = Math.floor(Math.random() * this.arr.length);
    return this.arr[randomIndex];
  }

  /**
   * Applies a function against an accumulator and each element in the list, reducing the list to a single value.
   *
   * @param {U} initialValue - The initial value of the accumulator.
   * @param {(accumulator: U, current: T) => U} callbackFn - A function to execute on each element in the list.
   * @returns {U} The accumulated result.
   * @template T - The type of elements in the list.
   * @template U - The type of the accumulated result.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const sum = myList.reduce(0, (acc, num) => acc + num);
   * console.log(sum);  // Output: 15
   */
  reduce<U>(initialValue: U, callbackFn: (accumulator: U, current: T) => U): U {
    return this.arr.reduce(callbackFn, initialValue);
  }

  /**
   * Creates a new List instance by removing an element at a specified index.
   *
   * @param {number} index - The index at which to remove the element. Negative values count from the end of the list.
   * @returns {List<T>} A new List instance with the element removed at the specified index.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of("apple", "banana", "cherry");
   * const removedList = myList.removeAt(1);
   * console.log([...removedList]);  // Output: ["apple", "cherry"]
   */
  removeAt(index: number): List<T> {
    index = resolveIndex(this, index);
    return this.splice(index, 1);
  }

  /**
   * Creates a new List instance by replacing an element at a specified index.
   *
   * @param {number} index - The index at which to replace the element. Negative values count from the end of the list.
   * @param {T} item - The element to replace the existing element with.
   * @returns {List<T>} A new List instance with the element replaced at the specified index.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of("apple", "banana", "cherry");
   * const replacedList = myList.replaceAt(1, "orange");
   * console.log([...replacedList]);  // Output: ["apple", "orange", "cherry"]
   */
  replaceAt(index: number, item: T): List<T> {
    index = resolveIndex(this, index);
    const arr = this.arr.slice();
    arr[index] = item;
    return new List(arr);
  }

  /**
   * Creates a new List instance with the elements in reverse order.
   *
   * @returns {List<T>} A new List instance with the elements reversed.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const reversedList = myList.reverse();
   * console.log([...reversedList]);  // Output: [5, 4, 3, 2, 1]
   */
  reverse(): List<T> {
    return new List(this.arr.toReversed());
  }

  /**
   * Creates a new List instance with the elements randomly shuffled using the Fisher-Yates (Knuth) shuffle algorithm.
   *
   * @returns {List<T>} A new List instance with the elements randomly shuffled.
   * @template T - The type of elements in the list.
   *
   * @description
   * The shuffle method uses the Fisher-Yates (Knuth) shuffle algorithm to randomly rearrange the elements in the list.
   * This algorithm has a time complexity of O(n) where n is the number of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const shuffledList = myList.shuffle();
   * console.log([...shuffledList]);  // Example output: [3, 1, 5, 2, 4] (result varies)
   */
  shuffle(): List<T> {
    const shuffledList = this.arr.slice();
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
    return new List(shuffledList);
  }

  /**
   * Creates a new List instance by extracting a section of the original list.
   *
   * @param {number | undefined} [start] - The beginning index of the extraction. Negative values count from the end of the list.
   * @param {number | undefined} [end] - The end index of the extraction. Negative values count from the end of the list.
   * @returns {List<T>} A new List instance containing the extracted elements.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const slicedList = myList.slice(1, 4);
   * console.log([...slicedList]);  // Output: [2, 3, 4]
   */
  slice(start?: number, end?: number): List<T> {
    return new List(this.arr.slice(start, end));
  }

  /**
   * Tests whether at least one element in the list passes the provided predicate function.
   *
   * @param {(item: T) => boolean} predicate - A function to test each element.
   * @returns {boolean} `true` if at least one element passes the predicate, otherwise `false`.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const hasEven = myList.some((num) => num % 2 === 0);
   * console.log(hasEven);  // Output: true
   */
  some(predicate: (item: T) => boolean): boolean {
    return this.arr.some(predicate);
  }

  /**
   * Creates a new List instance with the elements sorted based on a provided compare function.
   *
   * @param {(a: T, b: T) => number} [compareFn] - A function that defines the sort order. If omitted, the elements are sorted in ascending order.
   * @returns {List<T>} A new List instance with the elements sorted.
   * @template T - The type of elements in the list.
   *
   * @description
   * The sort method creates a new List instance with the elements sorted based on the provided compare function.
   * If no compare function is provided, the elements are sorted in ascending order.
   *
   * @example
   * const myList = List.of(3, 1, 4, 1, 5, 9, 2, 6);
   * const sortedList = myList.sort((a, b) => a - b);
   * console.log([...sortedList]);  // Output: [1, 1, 2, 3, 4, 5, 6, 9]
   */
  sort(compareFn?: (a: T, b: T) => number): List<T> {
    return new List(this.arr.toSorted(compareFn));
  }

  /**
   * Creates a new List instance by changing the contents of the list through the addition or removal of elements.
   *
   * @param {number} start - The index at which to start changing the list. Negative values count from the end of the list.
   * @param {number} deleteCount - The number of elements to remove from the list.
   * @param {...readonly T[]} items - The elements to add to the list at the specified index.
   * @returns {List<T>} A new List instance with elements added or removed.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of("apple", "banana", "cherry");
   * const splicedList = myList.splice(1, 1, "orange", "kiwi");
   * console.log([...splicedList]);  // Output: ["apple", "orange", "kiwi", "cherry"]
   */
  splice(start: number, deleteCount: number, ...items: readonly T[]): List<T> {
    return new List(this.arr.toSpliced(start, deleteCount, ...items));
  }

  /**
   * Computes the sum of all numerical elements in the list.
   *
   * @returns {number} The sum of all numerical elements in the list.
   *
   * @description
   * The `sum` method iterates over the elements of the list, adding up the numerical values.
   * Non-numerical elements are ignored during the sum computation.
   *
   * @example
   * const numberList = List.of(1, 2, 3, 4, 5);
   * const totalSum = numberList.sum();
   * console.log(totalSum);  // Output: 15
   */
  sum(): number {
    return this.numbers().reduce(0, (acc, cur) => acc + cur);
  }

  /**
   * Creates a new List instance by swapping elements at two specified indices.
   *
   * @param {number} index1 - The index of the first element to swap. Negative values count from the end of the list.
   * @param {number} index2 - The index of the second element to swap. Negative values count from the end of the list.
   * @returns {List<T>} A new List instance with the elements at the specified indices swapped.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of("apple", "banana", "cherry");
   * const swappedList = myList.swap(0, 2);
   * console.log([...swappedList]);  // Output: ["cherry", "banana", "apple"]
   */
  swap(index1: number, index2: number): List<T> {
    index1 = resolveIndex(this, index1);
    index2 = resolveIndex(this, index2);
    if (!isValidIndex(this, index1) || !isValidIndex(this, index2)) {
      return this;
    }
    const arr = this.arr.slice();
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
    return new List(arr);
  }

  /**
   * Creates a new List instance containing all elements except the first.
   *
   * @returns {List<T>} A new List instance containing all elements except the first.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const tailList = myList.tail();
   * console.log([...tailList]);  // Output: [2, 3, 4, 5]
   */
  tail(): List<T> {
    return this.slice(1);
  }

  /**
   * Creates a new List instance containing the first specified number of elements.
   *
   * @param {number} count - The number of elements to include in the new List instance.
   * @returns {List<T>} A new List instance containing the first specified number of elements.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const takenList = myList.take(3);
   * console.log([...takenList]);  // Output: [1, 2, 3]
   */
  take(count: number): List<T> {
    return this.slice(0, count);
  }

  /**
   * Creates a new List instance containing elements from the beginning of the list while the predicate is true.
   *
   * @param {(item: T) => boolean} predicate - A function that tests each element.
   * @returns {List<T>} A new List instance containing elements from the beginning while the predicate is true.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const takenWhileList = myList.takeWhile((num) => num < 4);
   * console.log([...takenWhileList]);  // Output: [1, 2, 3]
   */
  takeWhile(predicate: (item: T) => boolean): List<T> {
    let takeIndex = 0;
    while (takeIndex < this.arr.length && predicate(this.arr[takeIndex])) {
      takeIndex++;
    }
    return this.slice(0, takeIndex);
  }

  /**
   * Converts the List instance to a new array.
   *
   * @returns {T[]} A new array containing the elements of the List.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const arrayRepresentation = myList.toArray();
   * console.log(arrayRepresentation);  // Output: [1, 2, 3, 4, 5]
   */
  toArray(): T[] {
    return this.arr.slice();
  }

  /**
   * Returns the JSON representation of the List instance.
   *
   * @returns {T[]} The JSON representation of the List, which is an array containing its elements.
   * @template T - The type of elements in the list.
   *
   * @description
   * The `toJSON` method is primarily used internally by `JSON.stringify`. When the `toJSON` method is defined,
   * it is called by `JSON.stringify` to obtain the JSON representation of the List instance.
   *
   * @example
   * const myList = List.of("apple", "banana", "cherry");
   * const jsonRepresentation = myList.toJSON();
   * console.log(jsonRepresentation);  // Output: ["apple", "banana", "cherry"]
   */
  toJSON(): T[] {
    return this.toArray();
  }

  /**
   * Returns a string representation of the List instance.
   *
   * @returns {string} A string representation of the List, which is a comma-separated list of its elements.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const stringRepresentation = myList.toString();
   * console.log(stringRepresentation);  // Output: "1,2,3,4,5"
   */
  toString(): string {
    return this.arr.toString();
  }

  /**
   * Creates a new List instance containing unique elements from both the current list and another list.
   *
   * @param {List<T>} other - The other list to union with.
   * @returns {List<T>} A new List instance containing unique elements from both lists.
   * @template T - The type of elements in the lists.
   *
   * @example
   * const list1 = List.of(1, 2, 3);
   * const list2 = List.of(3, 4, 5);
   * const unionList = list1.union(list2);
   * console.log([...unionList]);  // Output: [1, 2, 3, 4, 5]
   */
  union(other: List<T>): List<T> {
    return this.concat(other).unique();
  }

  /**
   * Creates a new List instance containing only unique elements.
   *
   * @returns {List<T>} A new List instance containing only unique elements.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 2, 3, 3, 3, 4, 5);
   * const uniqueList = myList.unique();
   * console.log([...uniqueList]);  // Output: [1, 2, 3, 4, 5]
   */
  unique(): List<T> {
    return List.from(new Set(this.arr));
  }

  /**
   * Creates a new List instance by updating the element at a specified index using a callback function.
   *
   * @param {number} index - The index at which to update the element. Negative values count from the end of the list.
   * @param {(prev: T) => T} callbackFn - A function that receives the previous element and returns the updated element.
   * @returns {List<T>} A new List instance with the element updated at the specified index.
   * @template T - The type of elements in the list.
   *
   * @example
   * const myList = List.of(1, 2, 3, 4, 5);
   * const updatedList = myList.updateAt(2, (prevNum) => prevNum * 2);
   * console.log([...updatedList]);  // Output: [1, 2, 6, 4, 5]
   */
  updateAt(index: number, callbackFn: (prev: T) => T): List<T> {
    index = resolveIndex(this, index);
    const item = this.at(index);
    if (!item) return this;
    return this.replaceAt(index, callbackFn(item));
  }

  /**
   * Creates a new List instance by combining elements from the current list and another list into pairs.
   *
   * @param {List<U>} other - The other list to zip with.
   * @returns {List<[T, U]>} A new List instance containing pairs of elements from both lists.
   * @template T - The type of elements in the current list.
   * @template U - The type of elements in the other list.
   *
   * @example
   * const list1 = List.of("apple", "banana", "cherry");
   * const list2 = List.of(1, 2, 3);
   * const zippedList = list1.zip(list2);
   * console.log([...zippedList]);  // Output: [["apple", 1], ["banana", 2], ["cherry", 3]]
   */
  zip<U>(other: List<U>): List<[T, U]> {
    const minLength = Math.min(this.arr.length, other.arr.length);
    const zippedList: [T, U][] = [];
    for (let i = 0; i < minLength; i++) {
      zippedList.push([this.arr[i], other.arr[i]]);
    }
    return new List(zippedList);
  }
}

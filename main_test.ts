import {
  assertEquals,
  assert,
  assertFalse,
} from "https://deno.land/std@0.212.0/assert/mod.ts";
import { List } from "./main.ts";

Deno.test("List.empty", () => {
  const emptyList = List.empty();
  assertEquals([...emptyList], []);
});

Deno.test("List.from", () => {
  const iterable = [1, 2, 3];
  const list = List.from(iterable);
  assertEquals([...list], iterable);
});

Deno.test("List.of", () => {
  const list = List.of(1, 2, 3);
  assertEquals([...list], [1, 2, 3]);
});

Deno.test("List.range", () => {
  const rangeList = List.range(1, 6, 2);
  assertEquals([...rangeList], [1, 3, 5]);
});

Deno.test("List.size", () => {
  const list = List.of(1, 2, 3);
  assertEquals(list.size, 3);
});

Deno.test("List.abs", () => {
  const numberList = List.of(-2, 3, -4);
  const absList = numberList.abs();
  assertEquals([...absList], [2, 3, 4]);
});

Deno.test("List.append", () => {
  const list = List.of(1, 2, 3);
  const appendedList = list.append(4, 5);
  assertEquals([...appendedList], [1, 2, 3, 4, 5]);
});

Deno.test("List.at", () => {
  const list = List.of(1, 2, 3);
  assertEquals(list.at(1), 2);
  assertEquals(list.at(-1), 3); // Negative index resolves from the end
  assertEquals(list.at(5), undefined); // Out-of-bounds index returns undefined
});

Deno.test("List.avg", () => {
  const numberList = List.of(1, 2, 3, 4, 5);
  const average = numberList.avg();
  assertEquals(average, 3);
});

Deno.test("List.chunk", () => {
  const list = List.of(1, 2, 3, 4, 5, 6, 7);
  const chunked = list.chunk(3);
  assertEquals([...chunked], [[1, 2, 3], [4, 5, 6], [7]]);
});

Deno.test("List.clone", () => {
  const obj1 = { name: "john" };
  const obj2 = { name: "jane" };
  const list = List.of(obj1, obj2);
  const shallowList = list.clone();
  const deepList = list.clone(true);
  assert(Object.is(shallowList.at(0), obj1));
  assert(Object.is(shallowList.at(1), obj2));
  assertFalse(Object.is(deepList.at(0), obj1));
  assertFalse(Object.is(deepList.at(1), obj2));
});

Deno.test("List.compact", () => {
  const list = List.of(1, null, 3, undefined, 5);
  const compacted = list.compact();
  assertEquals([...compacted], [1, 3, 5]);
});

Deno.test("List.concat", () => {
  const list1 = List.of(1, 2, 3);
  const list2 = List.of(4, 5, 6);
  const list3 = List.of(7, 8, 9);

  const concatenated = list1.concat(list2, list3);
  assertEquals([...concatenated], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

Deno.test("List.countBy", () => {
  const list = List.of("apple", "banana", "apple", "orange", "banana", "apple");
  const countResult = list.countBy((fruit) => fruit);
  assertEquals(countResult, { apple: 3, banana: 2, orange: 1 });
});

Deno.test("List.cube", () => {
  const list = List.of(1, 2, 3);
  const cubed = list.cube();
  assertEquals([...cubed], [1, 8, 27]);
});

Deno.test("List.difference", () => {
  const list1 = List.of(1, 2, 3, 4, 5);
  const list2 = List.of(3, 4, 5, 6, 7);
  const differenceResult = list1.difference(list2);
  assertEquals([...differenceResult], [1, 2]);
});

Deno.test("List.divide", () => {
  const list = List.of(2, 4, 6, 8, 10);
  const divided = list.divide();
  assertEquals(divided, 1 / (2 * 4 * 6 * 8 * 10));
});

Deno.test("List.drop", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const dropped = list.drop(2);
  assertEquals([...dropped], [3, 4, 5]);
});

Deno.test("List.dropWhile", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const droppedWhile = list.dropWhile((num) => num < 3);
  assertEquals([...droppedWhile], [3, 4, 5]);
});

Deno.test("List.each", () => {
  const list = List.of(1, 2, 3);
  const result: number[] = [];

  list.each((item) => {
    result.push(item);
  });

  assertEquals(result, [1, 2, 3]);
});

Deno.test("List.enumerate", () => {
  const list = List.of("apple", "banana", "orange");
  const enumerated = list.enumerate();
  assertEquals(
    [...enumerated],
    [
      [0, "apple"],
      [1, "banana"],
      [2, "orange"],
    ],
  );
});

Deno.test("List.every", () => {
  const list = List.of(2, 4, 6, 8, 10);
  const allEven = list.every((num) => num % 2 === 0);
  assertEquals(allEven, true);
});

Deno.test("List.filter", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const filtered = list.filter((num) => num % 2 === 0);
  assertEquals([...filtered], [2, 4]);
});

Deno.test("List.find - Positive", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const found = list.find((num) => num === 3);
  assertEquals(found, 3);
});

Deno.test("List.find - Negative", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const notFound = list.find((num) => num === 6);
  assertEquals(notFound, undefined);
});

Deno.test("List.findIndex - Positive", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const index = list.findIndex((num) => num === 3);
  assertEquals(index, 2);
});

Deno.test("List.findIndex - Negative", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const notFoundIndex = list.findIndex((num) => num === 6);
  assertEquals(notFoundIndex, -1);
});

Deno.test("List.findLast - Positive", () => {
  const list = List.of(1, 2, 3, 4, 5, 3, 6);
  const foundLast = list.findLast((num) => num === 3);
  assertEquals(foundLast, 3);
});

Deno.test("List.findLast - Negative", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const notFoundLast = list.findLast((num) => num === 6);
  assertEquals(notFoundLast, undefined);
});

Deno.test("List.findLastIndex - Positive", () => {
  const list = List.of(1, 2, 3, 4, 5, 3, 6);
  const lastIndex = list.findLastIndex((num) => num === 3);
  assertEquals(lastIndex, 5);
});

Deno.test("List.findLastIndex - Negative", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const notFoundLastIndex = list.findLastIndex((num) => num === 6);
  assertEquals(notFoundLastIndex, -1);
});

Deno.test("List.first - Positive", () => {
  const list = List.of(1, 2, 3);
  const firstItem = list.first();
  assertEquals(firstItem, 1);
});

Deno.test("List.first - Negative (Empty List)", () => {
  const emptyList = List.empty();
  const firstItem = emptyList.first();
  assertEquals(firstItem, undefined);
});

Deno.test("List.flatten", () => {
  const nestedList = List.of([1, 2], [3, [4, 5]]);
  const flattened = nestedList.flatten();
  assertEquals([...flattened], [1, 2, 3, [4, 5]]);
});

Deno.test("List.groupBy", () => {
  const list = List.of(
    { type: "fruit", name: "apple" },
    { type: "fruit", name: "banana" },
    { type: "vegetable", name: "carrot" },
    { type: "fruit", name: "orange" },
  );

  const grouped = list.groupBy((item) => item.type);
  assertEquals(grouped, {
    fruit: [
      { type: "fruit", name: "apple" },
      { type: "fruit", name: "banana" },
      { type: "fruit", name: "orange" },
    ],
    vegetable: [{ type: "vegetable", name: "carrot" }],
  });
});

Deno.test("List.has - Positive", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const hasItem = list.has(3);
  assertEquals(hasItem, true);
});

Deno.test("List.has - Negative", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const doesNotHaveItem = list.has(6);
  assertEquals(doesNotHaveItem, false);
});

Deno.test("List.insertAt", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const modifiedList = list.insertAt(2, 10);
  assertEquals([...modifiedList], [1, 2, 10, 3, 4, 5]);
});

Deno.test("List.intersection", () => {
  const list1 = List.of(1, 2, 3, 4, 5);
  const list2 = List.of(3, 4, 5, 6, 7);
  const intersected = list1.intersection(list2);
  assertEquals([...intersected], [3, 4, 5]);
});

Deno.test("List.isEmpty - Positive", () => {
  const emptyList = List.empty();
  const isEmpty = emptyList.isEmpty();
  assertEquals(isEmpty, true);
});

Deno.test("List.isEmpty - Negative", () => {
  const nonEmptyList = List.of(1, 2, 3);
  const isEmpty = nonEmptyList.isEmpty();
  assertEquals(isEmpty, false);
});

Deno.test("List.isNotEmpty - Positive", () => {
  const nonEmptyList = List.of(1, 2, 3);
  const isNotEmpty = nonEmptyList.isNotEmpty();
  assertEquals(isNotEmpty, true);
});

Deno.test("List.isNotEmpty - Negative", () => {
  const emptyList = List.empty();
  const isNotEmpty = emptyList.isNotEmpty();
  assertEquals(isNotEmpty, false);
});

Deno.test("List.last", () => {
  const list = List.of(1, 2, 3, 4, 5);
  const lastItem = list.last();
  assertEquals(lastItem, 5);
});

Deno.test("List.map", () => {
  const list = List.of(1, 2, 3);
  const mappedList = list.map((num) => num * 2);
  assertEquals([...mappedList], [2, 4, 6]);
});

Deno.test("List.max", () => {
  const list = List.of(1, 5, 2, 8, 3);
  const maxItem = list.max();
  assertEquals(maxItem, 8);
});

Deno.test("List.min", () => {
  const list = List.of(1, 5, 2, 8, 3);
  const minItem = list.min();
  assertEquals(minItem, 1);
});

Deno.test("List.move - Positive", () => {
  const list = List.of("a", "b", "c", "d");
  const movedList = list.move(1, 3);
  assertEquals([...movedList], ["a", "c", "b", "d"]);
});

Deno.test("List.move - Negative (Adjusted and Valid fromIndex)", () => {
  const list = List.of("a", "b", "c", "d");
  const movedList = list.move(-1, 2);
  assertEquals([...movedList], ["a", "b", "d", "c"]);
});

Deno.test("List.move - Negative (Invalid toIndex)", () => {
  const list = List.of("a", "b", "c", "d");
  const unchangedList = list.move(1, 5);
  assertEquals([...unchangedList], ["a", "b", "c", "d"]);
});

Deno.test("List.move - Negative (Both Invalid Indexes)", () => {
  const list = List.empty(); // Empty list
  const unchangedList = list.move(-1, 5);
  assertEquals([...unchangedList], []);
});

Deno.test("List.power", () => {
  const baseList = List.of(2, 3, 4);
  const poweredList = baseList.power(2);
  assertEquals([...poweredList], [4, 9, 16]);
});

Deno.test("List.prepend", () => {
  const originalList = List.of("b", "c");
  const modifiedList = originalList.prepend("a");
  assertEquals([...modifiedList], ["a", "b", "c"]);
});

Deno.test("List.random", () => {
  const numbersList = List.of(1, 2, 3, 4, 5);
  const randomElement = numbersList.random();
  // It's challenging to assert the exact value due to randomness,
  // so let's just ensure it's one of the expected elements
  const expectedElements = [1, 2, 3, 4, 5];
  assertEquals(true, expectedElements.includes(randomElement!));
});

Deno.test("List.reduce", () => {
  const numbersList = List.of(1, 2, 3, 4, 5);
  const sum = numbersList.reduce(0, (acc, cur) => acc + cur);
  assertEquals(sum, 15);
});

Deno.test("List.removeAt", () => {
  const originalList = List.of("a", "b", "c");
  const modifiedList = originalList.removeAt(1);
  assertEquals([...modifiedList], ["a", "c"]);
});

Deno.test("List.replaceAt", () => {
  const originalList = List.of("a", "b", "c");
  const modifiedList = originalList.replaceAt(1, "x");
  assertEquals([...modifiedList], ["a", "x", "c"]);
});

Deno.test("List.reverse", () => {
  const originalList = List.of("a", "b", "c");
  const reversedList = originalList.reverse();
  assertEquals([...reversedList], ["c", "b", "a"]);
});

Deno.test("List.shuffle", () => {
  const originalList = List.of(1, 2, 3, 4, 5);
  const shuffledList = originalList.shuffle();
  // It's challenging to assert the exact order due to randomness,
  // so let's just ensure all elements are present
  const expectedElements = [1, 2, 3, 4, 5];
  assertEquals(
    true,
    expectedElements.every((element) => shuffledList.has(element)),
  );
});

Deno.test("List.slice", () => {
  const originalList = List.of("a", "b", "c", "d", "e");
  const slicedList = originalList.slice(1, 4);
  assertEquals([...slicedList], ["b", "c", "d"]);
});

Deno.test("List.some", () => {
  const numbersList = List.of(1, 2, 3, 4, 5);
  const hasEvenNumber = numbersList.some((num) => num % 2 === 0);
  assertEquals(hasEvenNumber, true);

  const hasNegativeNumber = numbersList.some((num) => num < 0);
  assertEquals(hasNegativeNumber, false);
});

Deno.test("List.sort", () => {
  const originalList = List.of(3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5);
  const sortedList = originalList.sort();
  assertEquals([...sortedList], [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]);
});

Deno.test("List.splice", () => {
  const originalList = List.of("a", "b", "c", "d", "e");
  const splicedList = originalList.splice(1, 2, "x", "y");
  assertEquals([...splicedList], ["a", "x", "y", "d", "e"]); // Spliced elements
});

Deno.test("List.sqrt", () => {
  const numbersList = List.of(4, 9, 16);
  const sqrtList = numbersList.sqrt();
  assertEquals([...sqrtList], [2, 3, 4]);
});

Deno.test("List.square", () => {
  const numbersList = List.of(2, 3, 4);
  const squaredList = numbersList.square();
  assertEquals([...squaredList], [4, 9, 16]);
});

Deno.test("List.subtract", () => {
  const numbersList = List.of(5, 3, 1);
  const result = numbersList.subtract();
  assertEquals(result, 1);
});

Deno.test("List.sum", () => {
  const numbersList = List.of(1, 2, 3, 4, 5);
  const sum = numbersList.sum();
  assertEquals(sum, 15);
});

Deno.test("List.swap", () => {
  const originalList = List.of("a", "b", "c");
  const modifiedList = originalList.swap(0, 2);
  assertEquals([...modifiedList], ["c", "b", "a"]);
});

Deno.test("List.tail", () => {
  const originalList = List.of("a", "b", "c");
  const tailList = originalList.tail();
  assertEquals([...tailList], ["b", "c"]);
});

Deno.test("List.take", () => {
  const originalList = List.of("a", "b", "c", "d", "e");
  const takenList = originalList.take(3);
  assertEquals([...takenList], ["a", "b", "c"]);
});

Deno.test("List.takeWhile", () => {
  const originalList = List.of(2, 4, 6, 8, 9, 10);
  const takenWhileList = originalList.takeWhile((num) => num % 2 === 0);
  assertEquals([...takenWhileList], [2, 4, 6, 8]);
});

Deno.test("List.toArray", () => {
  const originalList = List.of("a", "b", "c");
  const arrayRepresentation = originalList.toArray();
  assertEquals(arrayRepresentation, ["a", "b", "c"]);
});

Deno.test("List.toJSON", () => {
  const originalList = List.of("a", "b", "c");
  const jsonRepresentation = originalList.toJSON();
  assertEquals(jsonRepresentation, ["a", "b", "c"]);
});

Deno.test("List.toString", () => {
  const originalList = List.of("a", "b", "c");
  const stringRepresentation = originalList.toString();
  assertEquals(stringRepresentation, "a,b,c");
});

Deno.test("List.union", () => {
  const list1 = List.of("a", "b", "c", "a");
  const list2 = List.of("c", "d", "e", "c");
  const unionList = list1.union(list2);
  assertEquals([...unionList], ["a", "b", "c", "d", "e"]);
});

Deno.test("List.unique", () => {
  const duplicateList = List.of("a", "b", "a", "c", "b");
  const uniqueList = duplicateList.unique();
  assertEquals([...uniqueList], ["a", "b", "c"]);
});

Deno.test("List.updateAt", () => {
  const originalList = List.of(1, 2, 3);
  const modifiedList = originalList.updateAt(1, (prev) => prev * 10);
  assertEquals([...modifiedList], [1, 20, 3]);
});

Deno.test("List.zip", () => {
  const list1 = List.of("a", "b", "c");
  const list2 = List.of(1, 2, 3);
  const zippedList = list1.zip(list2);
  assertEquals(
    [...zippedList],
    [
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ],
  );
});

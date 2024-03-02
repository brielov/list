import {
    assert,
    assertEquals,
    assertFalse,
    assertThrows,
} from "https://deno.land/std@0.212.0/assert/mod.ts";
import { List } from "./main.ts";

Deno.test("List#range", () => {
    let list = List.range(5, 10);
    assertEquals([...list], [5, 6, 7, 8, 9, 10]);
    list = List.range(0, 10, 2);
    assertEquals([...list], [0, 2, 4, 6, 8, 10]);
    assertThrows(
        () => List.range(0, 10, -1),
        Error,
        "'step' must be a positive number",
    );
});

Deno.test("List.isEmpty", () => {
    assert(List.empty().isEmpty());
    assertFalse(List.of(1).isEmpty());
});

Deno.test("List.append", () => {
    const list = List.empty<number>().append(1, 2, 3);
    assertEquals([...list], [1, 2, 3]);
    assertEquals(list.size, 3);
});

Deno.test("List.at", () => {
    const list = List.of(1, 2, 3);
    assertEquals(list.at(1), 2);
    assertEquals(list.at(-1), 3);
    assertEquals(list.at(3), undefined);
});

Deno.test("List.first", () => {
    let list = List.of(3, 4, 5);
    assertEquals(list.first(), 3);
    list = List.empty<number>();
    assertEquals(list.first(), undefined);
});

Deno.test("List.last", () => {
    let list = List.of(3, 4, 5);
    assertEquals(list.last(), 5);
    list = List.empty<number>();
    assertEquals(list.last(), undefined);
});

Deno.test("List.each", () => {
    const arr: number[] = [];
    const list = List.range(0, 5).each((item) => arr.push(item));
    assertEquals(arr, [0, 1, 2, 3, 4, 5]);
    assertThrows(
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        () => list.each(),
        Error,
        "'callback' must be of type 'function'",
    );
});

Deno.test("List.prepend", () => {
    const list = List.of(4, 5, 6).prepend(1, 2, 3);
    assertEquals([...list], [1, 2, 3, 4, 5, 6]);
    assertEquals(list.size, 6);
});

Deno.test("List.map", () => {
    const list = List.of(1, 2, 3, 4, 5).map((x) => x * 2);
    assertEquals([...list], [2, 4, 6, 8, 10]);
    assertEquals(list.size, 5);
    assertThrows(
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        () => list.map(),
        Error,
        "'callback' must be of type 'function'",
    );
});

Deno.test("List.filter", () => {
    const list = List.range(0, 10).filter((x) => x % 2 === 0);
    assertEquals([...list], [0, 2, 4, 6, 8, 10]);
    assertEquals(list.size, 6);
    assertThrows(
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        () => list.filter(),
        Error,
        "'predicate' must be of type 'function'",
    );
});

Deno.test("List.compact", () => {
    const list = List.of(1, null, 2, undefined, 3).compact();
    assertEquals([...list], [1, 2, 3]);
});

Deno.test("List.compactMap", () => {
    const list = List.range(1, 10).compactMap((x) => {
        if (x % 2 !== 0) return;
        return x;
    });
    assertEquals([...list], [2, 4, 6, 8, 10]);
    assertThrows(
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        () => list.compactMap(),
        Error,
        "'callback' must be of type 'function'",
    );
});

Deno.test("List.clone (shallow)", () => {
    const o1 = { name: "john" };
    const o2 = { name: "susan" };
    const list = List.of(o1, o2).clone();
    assert(Object.is(list.at(0), o1));
    assert(Object.is(list.at(1), o2));
});

Deno.test("List.clone (deep)", () => {
    const o1 = { name: "john" };
    const o2 = { name: "susan" };
    const list = List.of(o1, o2).clone(true);
    assertEquals(list.at(0), o1);
    assertEquals(list.at(1), o2);
    assertFalse(Object.is(list.at(0), o1));
    assertFalse(Object.is(list.at(1), o2));
});

Deno.test("List.some", () => {
    assert(List.from(["hello", 1, false]).some((x) => typeof x === "number"));
    assertFalse(List.from(["hello", false]).some((x) => typeof x === "number"));
    assertThrows(
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        () => List.empty().some(),
        Error,
        "'predicate' must be of type 'function'",
    );
});

Deno.test("List.every", () => {
    assertThrows(
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        () => List.empty().every(),
        Error,
        "'predicate' must be of type 'function'",
    );
    assert(List.from([1, 2, 3]).every((x) => typeof x === "number"));
    assertFalse(List.from([1, 2, false]).every((x) => typeof x === "number"));
});

Deno.test("List.concat", () => {
    const l1 = List.of(1, 2, 3);
    const l2 = List.of(4, 5, 6);
    const l3 = List.of(7, 8, 9);
    const list = List.empty<number>().concat(l1, l2, l3);
    assertEquals([...list], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assertEquals(list.size, 9);
});

Deno.test("List.countBy", () => {
    const list = List.of({ type: "dog" }, { type: "cat" }, { type: "dog" });
    const count = list.countBy((o) => o.type);
    assertEquals(count, { "dog": 2, "cat": 1 });
    assertThrows(
        // deno-lint-ignore ban-ts-comment
        // @ts-expect-error
        () => List.empty().countBy(),
        Error,
        "'callback' must be of type 'function'",
    );
});

Deno.test("List.slice (no start, no end)", () => {
    const list = List.range(1, 5).slice();
    assertEquals([...list], [1, 2, 3, 4, 5]);
});

Deno.test("List.slice (no end)", () => {
    const list = List.range(1, 5).slice(1);
    assertEquals([...list], [2, 3, 4, 5]);
});

Deno.test("List.slice (both start and end)", () => {
    const list = List.range(1, 3).slice(1, 3);
    assertEquals([...list], [2, 3]);
});

Deno.test("List.slice (negative index)", () => {
    const list = List.range(1, 5);
    assertEquals([...list.slice(-1)], [5]);
    assertEquals([...list.slice(0, -1)], [1, 2, 3, 4]);
});

Deno.test("List.slice (wrong index)", () => {
    const list = List.of(1, 2);
    assertEquals([...list.slice(3, 5)], []);
});

Deno.test("List.has", () => {
    const list = List.of(1, 2, 3, 4, 5);
    assert(list.has(3));
    assertFalse(list.has(6));
});

Deno.test("List.reverse", () => {
    const list = List.range(1, 5).reverse();
    assertEquals([...list], [5, 4, 3, 2, 1]);
    assertEquals([...List.empty().reverse()], []);
});

// SPLICE

Deno.test("List.splice (no arguments)", () => {
    const list = List.of(1, 2, 3, 4, 5).splice();
    assertEquals([...list], [1, 2, 3, 4, 5]);
});

Deno.test("List.splice (positive start, no arguments)", () => {
    const list = List.of(1, 2, 3, 4, 5).splice(2);
    assertEquals([...list], [1, 2]);
});

Deno.test("List.splice (negative start, no arguments)", () => {
    const list = List.of(1, 2, 3, 4, 5).splice(-2);
    assertEquals([...list], [1, 2, 3]);
});

Deno.test("List.splice (positive deleteCount)", () => {
    const list = List.of(1, 2, 3, 4, 5).splice(2, 1);
    assertEquals([...list], [1, 2, 4, 5]);
});

Deno.test("List.splice (negative deleteCount)", () => {
    const list = List.of(1, 2, 3, 4, 5).splice(2, -1);
    assertEquals([...list], [1, 2, 3, 4, 5]);
});

Deno.test("List.splice (no delete, insert items)", () => {
    const list = List.of(1, 2, 3, 4, 5).splice(2, 0, 99);
    assertEquals([...list], [1, 2, 99, 3, 4, 5]);
});

Deno.test("List.splice (delete one, insert items)", () => {
    const list = List.of(1, 2, 3, 4, 5).splice(2, 1, 99);
    assertEquals([...list], [1, 2, 99, 4, 5]);
});

Deno.test("List.splice (delete out of bounds, insert items)", () => {
    const list = List.of(1, 2, 3, 4, 5).splice(2, 100, 99);
    assertEquals([...list], [1, 2, 99]);
});

Deno.test("List.enumerate", () => {
    const list = List.range(10, 13).enumerate();
    assertEquals([...list], [
        [0, 10],
        [1, 11],
        [2, 12],
        [3, 13],
    ]);
});

Deno.test("List.drop", () => {
    let list = List.range(0, 10).drop(5);
    assertEquals([...list], [5, 6, 7, 8, 9, 10]);
    list = List.range(0, 10).drop(99);
    assertEquals([...list], []);
});

Deno.test("List.dropWhile", () => {
    const list = List.range(0, 10).dropWhile((x) => x < 5);
    assertEquals([...list], [5, 6, 7, 8, 9, 10]);
});

Deno.test("List.take", () => {
    let list = List.range(0, 10).take(5);
    assertEquals([...list], [0, 1, 2, 3, 4]);
    list = List.range(0, 5).take(99);
    assertEquals([...list], [0, 1, 2, 3, 4, 5]);
});

Deno.test("List.takeWhile", () => {
    const list = List.range(0, 10).takeWhile((x) => x < 5);
    assertEquals([...list], [0, 1, 2, 3, 4]);
});

Deno.test("List.tail", () => {
    const list = List.range(0, 5).tail();
    assertEquals([...list], [1, 2, 3, 4, 5]);
});

Deno.test("List.swap (positive index)", () => {
    const list = List.range(0, 5).swap(0, 5);
    assertEquals([...list], [5, 1, 2, 3, 4, 0]);
});

Deno.test("List.swap (negative index)", () => {
    const list = List.range(0, 5).swap(-1, -6);
    assertEquals([...list], [5, 1, 2, 3, 4, 0]);
});

Deno.test("List.removeAt (positive index)", () => {
    const list = List.range(0, 5).removeAt(2);
    assertEquals([...list], [0, 1, 3, 4, 5]);
});

Deno.test("List.removeAt (negative index)", () => {
    const list = List.range(0, 5).removeAt(-2);
    assertEquals([...list], [0, 1, 2, 3, 5]);
});

Deno.test("List.replaceAt (positive index)", () => {
    const list = List.range(0, 5).replaceAt(3, 99);
    assertEquals([...list], [0, 1, 2, 99, 4, 5]);
});

Deno.test("List.replaceAt (negative index)", () => {
    const list = List.range(0, 5).replaceAt(-2, 99);
    assertEquals([...list], [0, 1, 2, 3, 99, 5]);
});

Deno.test("List.unique", () => {
    const list = List.of(1, 1, 1, 1, 2, 2, 2, 3, 3).unique();
    assertEquals([...list], [1, 2, 3]);
});

Deno.test("List.sort (default)", () => {
    const list = List.of(3, 2, 5, 1, 4, 6, 9, 7, 8).sort();
    assertEquals([...list], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

Deno.test("List.sort (compareFn)", () => {
    const list = List.of(3, 2, 5, 1, 4, 6, 9, 7, 8).sort((a, b) => b - a);
    assertEquals([...list], [9, 8, 7, 6, 5, 4, 3, 2, 1]);
});

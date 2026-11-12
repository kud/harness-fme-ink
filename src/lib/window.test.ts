import { expect, test } from "vitest"
import { windowRows } from "./window.js"

test("returns every item unchanged when the list fits the window", () => {
  expect(windowRows(["a", "b", "c"], 1, 5)).toEqual({
    items: ["a", "b", "c"],
    offset: 0,
  })
})

test("keeps the selected row visible deep in a long list", () => {
  const { items, offset } = windowRows(["a", "b", "c", "d", "e", "f"], 4, 2)
  expect(items).toEqual(["d", "e"])
  expect(offset).toBe(3)
})

test("clamps at the start", () => {
  expect(windowRows(["a", "b", "c", "d"], 0, 2)).toEqual({
    items: ["a", "b"],
    offset: 0,
  })
})

test("clamps at the end", () => {
  expect(windowRows(["a", "b", "c", "d", "e", "f"], 5, 2)).toEqual({
    items: ["e", "f"],
    offset: 4,
  })
})

test("a zero-row window still shows the selected row", () => {
  expect(windowRows(["a", "b"], 1, 0)).toEqual({ items: ["b"], offset: 1 })
})

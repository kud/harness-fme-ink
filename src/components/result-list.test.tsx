import React from "react"
import { afterEach, expect, test } from "vitest"
import { cleanup, render } from "ink-testing-library"
import { ResultList } from "./result-list.js"
import type { ResultRowView } from "../types.js"

afterEach(cleanup)

const rows: ResultRowView[] = [
  {
    flag: "checkout_new_flow",
    status: "applied",
    reason: "default rule set to on 100%",
  },
  {
    flag: "search_relevance",
    status: "running",
    reason: "setting traffic to 50%",
  },
  {
    flag: "dark_mode",
    status: "pending",
    reason: "queued behind search_relevance",
  },
  { flag: "old_banner", status: "skipped", reason: "already up to date" },
  {
    flag: "broken_flag",
    status: "failed",
    reason: "missing treatment control",
  },
]

test("shows every status word and its reason", () => {
  const { lastFrame } = render(<ResultList rows={rows} />)
  const frame = lastFrame() ?? ""
  for (const word of ["applied", "running", "pending", "skipped", "failed"]) {
    expect(frame).toContain(word)
  }
  expect(frame).toContain("missing treatment control")
  expect(frame).toContain("already up to date")
  expect(frame).toContain("setting traffic to 50%")
})

test("pairs each flag with its own status word", () => {
  const { lastFrame } = render(<ResultList rows={rows} />)
  const frame = lastFrame() ?? ""
  const failedLine =
    frame.split("\n").find((l) => l.includes("broken_flag")) ?? ""
  expect(failedLine).toContain("failed")
  const appliedLine =
    frame.split("\n").find((l) => l.includes("checkout_new_flow")) ?? ""
  expect(appliedLine).toContain("applied")
})

test("shows the empty state when there are no results", () => {
  const { lastFrame } = render(<ResultList rows={[]} />)
  expect(lastFrame() ?? "").toContain("no results")
})

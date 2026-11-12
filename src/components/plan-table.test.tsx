import React from "react"
import { afterEach, expect, test } from "vitest"
import { cleanup, render } from "ink-testing-library"
import { PlanTable } from "./plan-table.js"
import type { PlanRowView } from "../types.js"

afterEach(cleanup)

const planRows: PlanRowView[] = [
  {
    flag: "checkout_new_flow",
    action: "update",
    detail: "set default rule to on for 100%",
  },
  { flag: "search_relevance", action: "update", detail: "set traffic to 50%" },
  { flag: "dark_mode", action: "skip", detail: "already up to date" },
]

test("names the environment and counts changes and skips", () => {
  const { lastFrame } = render(
    <PlanTable rows={planRows} environment="QA" production={false} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("QA")
  expect(frame).toContain("2 changes, 1 skipped")
  expect(frame).not.toContain("PROD")
  expect(frame).not.toContain("errors")
})

test("renders every action word and its detail", () => {
  const { lastFrame } = render(
    <PlanTable rows={planRows} environment="QA" production={false} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("update")
  expect(frame).toContain("skip")
  expect(frame).toContain("set default rule to on for 100%")
  expect(frame).toContain("already up to date")
})

const errorRows: PlanRowView[] = [
  {
    flag: "checkout_new_flow",
    action: "update",
    detail: "set default rule to on for 100%",
  },
  { flag: "search_relevance", action: "skip", detail: "already up to date" },
  { flag: "dark_mode", action: "error", detail: "missing treatment control" },
  { flag: "old_banner", action: "error", detail: "missing segment" },
]

test("marks production and surfaces errors only when there are any", () => {
  const { lastFrame } = render(
    <PlanTable rows={errorRows} environment="Prod" production={true} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("PROD")
  expect(frame).toContain("1 changes, 1 skipped, 2 errors")
})

test("shows the empty state when the plan has no rows", () => {
  const { lastFrame } = render(
    <PlanTable rows={[]} environment="QA" production={false} />,
  )
  expect(lastFrame() ?? "").toContain("no changes")
})

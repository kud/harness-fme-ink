import React from "react"
import { afterEach, expect, test } from "vitest"
import { cleanup, render } from "ink-testing-library"
import { FlagList } from "./flag-list.js"
import type { EnvCell, FlagRowView } from "../types.js"

afterEach(cleanup)

const cell = (
  environment: string,
  state: EnvCell["state"],
  defaultRule: string,
  production: boolean,
): EnvCell => ({
  environment,
  state,
  defaultRule,
  production,
})

const prodRows: FlagRowView[] = [
  {
    flag: "checkout_new_flow",
    rolloutStatus: "50%",
    environments: [
      cell("QA", "on", "100%", false),
      cell("Prod", "on", "30% / off 70%", true),
    ],
  },
  {
    flag: "search_relevance",
    rolloutStatus: "10%",
    environments: [
      cell("QA", "off", "100%", false),
      cell("Prod", "killed", "", true),
    ],
  },
  {
    flag: "dark_mode",
    rolloutStatus: "0%",
    environments: [
      cell("QA", "partial", "30% / off 70%", false),
      cell("Prod", "undefined", "", true),
    ],
  },
]

test("renders each flag with its rollout status and per-environment cells", () => {
  const { lastFrame } = render(
    <FlagList rows={prodRows} selectedIndex={0} height={10} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("checkout_new_flow")
  expect(frame).toContain("on 100%")
  expect(frame).toContain("on 30% / off 70%")
  const killedLine = frame
    .split("\n")
    .find((l) => l.includes("search_relevance"))
  expect(killedLine).toContain("killed")
  const undefinedLine = frame.split("\n").find((l) => l.includes("dark_mode"))
  expect(undefinedLine).toContain("-")
  expect(undefinedLine).not.toContain("killed")
})

test("header names each environment and marks the production one", () => {
  const { lastFrame } = render(
    <FlagList rows={prodRows} selectedIndex={0} height={10} />,
  )
  const frame = lastFrame() ?? ""
  const header = frame.split("\n").find((l) => l.includes("rollout")) ?? ""
  expect(header).toContain("QA")
  expect(header).toContain("Prod PROD")
})

test("no PROD marker when no environment is production", () => {
  const rows: FlagRowView[] = [
    {
      flag: "checkout_new_flow",
      environments: [
        cell("QA", "on", "100%", false),
        cell("Staging", "off", "100%", false),
      ],
    },
  ]
  const { lastFrame } = render(
    <FlagList rows={rows} selectedIndex={0} height={10} />,
  )
  expect(lastFrame() ?? "").not.toContain("PROD")
})

test("marks the selected row", () => {
  const { lastFrame } = render(
    <FlagList rows={prodRows} selectedIndex={1} height={10} />,
  )
  const frame = lastFrame() ?? ""
  const active = frame.split("\n").find((l) => l.includes("❯"))
  expect(active).toContain("search_relevance")
})

const longRows: FlagRowView[] = [
  "flag_a",
  "flag_b",
  "flag_c",
  "flag_d",
  "flag_e",
  "flag_f",
].map((flag, i) => ({
  flag,
  environments: [cell("QA", i % 2 === 0 ? "on" : "off", "100%", false)],
}))

test("windowing keeps a deep selected row visible", () => {
  const { lastFrame } = render(
    <FlagList rows={longRows} selectedIndex={4} height={2} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("flag_e")
  expect(frame).not.toContain("flag_a")
})

test("windowing at the top shows the first rows", () => {
  const { lastFrame } = render(
    <FlagList rows={longRows} selectedIndex={0} height={2} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("flag_a")
  expect(frame).not.toContain("flag_f")
})

test("windowing at the bottom shows the last rows", () => {
  const { lastFrame } = render(
    <FlagList rows={longRows} selectedIndex={5} height={2} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("flag_f")
  expect(frame).not.toContain("flag_a")
})

test("marks the focused environment column", () => {
  const { lastFrame } = render(
    <FlagList
      rows={prodRows}
      selectedIndex={0}
      height={10}
      focusedEnvironment="Prod"
    />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("▸ Prod PROD")
  expect(frame).not.toContain("▸ QA")
})

test("shows the empty state when there are no flags", () => {
  const { lastFrame } = render(
    <FlagList rows={[]} selectedIndex={0} height={10} />,
  )
  expect(lastFrame() ?? "").toContain("no flags")
})

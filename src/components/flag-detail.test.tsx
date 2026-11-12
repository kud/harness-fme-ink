import React from "react"
import { afterEach, expect, test } from "vitest"
import { cleanup, render } from "ink-testing-library"
import { FlagDetail } from "./flag-detail.js"
import type { FlagDetailView } from "../types.js"

afterEach(cleanup)

const detail: FlagDetailView = {
  flag: "checkout_new_flow",
  rolloutStatus: "50%",
  tags: ["checkout", "experimental"],
  description: "Shows a new checkout flow to part of the traffic.",
  environments: [
    {
      environment: "QA",
      production: false,
      state: "on",
      defaultRule: "100%",
      traffic: "100%",
      rules: 2,
      keys: 3,
      segments: ["beta_testers"],
    },
    {
      environment: "Prod",
      production: true,
      state: "killed",
      defaultRule: "",
      traffic: "0%",
      rules: 0,
      keys: 0,
      segments: [],
    },
  ],
}

test("renders the flag header with rollout status, tags and description", () => {
  const { lastFrame } = render(<FlagDetail detail={detail} />)
  const frame = lastFrame() ?? ""
  expect(frame).toContain("checkout_new_flow")
  expect(frame).toContain("50%")
  expect(frame).toContain("checkout, experimental")
  expect(frame).toContain("Shows a new checkout flow to part of the traffic.")
})

test("renders one row per environment with its facts", () => {
  const { lastFrame } = render(<FlagDetail detail={detail} />)
  const frame = lastFrame() ?? ""
  const qaLine = frame.split("\n").find((l) => l.includes("beta_testers")) ?? ""
  expect(qaLine).toContain("on")
  expect(qaLine).toContain("100%")
  expect(qaLine).not.toContain("PROD")
  const prodLine = frame.split("\n").find((l) => l.includes("Prod")) ?? ""
  expect(prodLine).toContain("PROD")
  expect(prodLine).toContain("killed")
})

test("production rows carry the PROD marker", () => {
  const { lastFrame } = render(<FlagDetail detail={detail} />)
  expect(lastFrame() ?? "").toContain("Prod PROD")
})

const statesDetail: FlagDetailView = {
  flag: "dark_mode",
  tags: [],
  environments: [
    {
      environment: "QA",
      production: false,
      state: "killed",
      defaultRule: "",
      traffic: "0%",
      rules: 0,
      keys: 0,
      segments: [],
    },
    {
      environment: "Prod",
      production: true,
      state: "undefined",
      defaultRule: "",
      traffic: "0%",
      rules: 0,
      keys: 0,
      segments: [],
    },
  ],
}

test("killed and undefined render as distinct words", () => {
  const { lastFrame } = render(<FlagDetail detail={statesDetail} />)
  const frame = lastFrame() ?? ""
  const qaLine = frame.split("\n").find((l) => l.includes("QA")) ?? ""
  expect(qaLine).toContain("killed")
  expect(qaLine).not.toContain("undefined")
  const prodLine = frame.split("\n").find((l) => l.includes("Prod")) ?? ""
  expect(prodLine).toContain("undefined")
  expect(prodLine).toContain("-")
})

test("marks the focused environment row", () => {
  const { lastFrame } = render(
    <FlagDetail detail={detail} focusedEnvironment="Prod" />,
  )
  const frame = lastFrame() ?? ""
  const prodLine = frame.split("\n").find((l) => l.includes("Prod")) ?? ""
  expect(prodLine).toContain("❯")
  const qaLine = frame.split("\n").find((l) => l.includes("QA")) ?? ""
  expect(qaLine).not.toContain("❯")
})

test("shows the empty state when the flag has no environments", () => {
  const empty: FlagDetailView = {
    flag: "dark_mode",
    tags: [],
    environments: [],
  }
  const { lastFrame } = render(<FlagDetail detail={empty} />)
  const frame = lastFrame() ?? ""
  expect(frame).toContain("dark_mode")
  expect(frame).toContain("no environments")
})

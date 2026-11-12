import React from "react"
import { afterEach, expect, test } from "vitest"
import { cleanup, render } from "ink-testing-library"
import { ConfirmPanel } from "./confirm-panel.js"

afterEach(cleanup)

const summary = "Turn checkout_new_flow on for 100% of sessions."

test("non-production offers y to apply and esc to cancel immediately", () => {
  const { lastFrame } = render(
    <ConfirmPanel environment="QA" production={false} summary={summary} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("QA")
  expect(frame).toContain(summary)
  expect(frame).toContain("y apply")
  expect(frame).toContain("esc cancel")
  expect(frame).not.toContain("PROD")
})

test("production panel names the environment and asks for an exact match", () => {
  const { lastFrame } = render(
    <ConfirmPanel environment="Prod" production={true} summary={summary} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("PROD")
  expect(frame).toContain("is a production environment")
  expect(frame).toContain("type the environment name exactly")
  expect(frame).toContain("does not match")
  expect(frame).toContain("esc cancel")
  expect(frame).not.toContain("enter apply")
})

test("partial text does not match", () => {
  const { lastFrame } = render(
    <ConfirmPanel
      environment="Prod"
      production={true}
      summary={summary}
      typed="Pro"
    />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain('"Pro"')
  expect(frame).toContain("does not match")
  expect(frame).not.toContain("enter apply")
})

test("a case difference does not match", () => {
  const { lastFrame } = render(
    <ConfirmPanel
      environment="Prod"
      production={true}
      summary={summary}
      typed="prod"
    />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("does not match")
  expect(frame).not.toContain("enter apply")
})

test("an exact match offers apply", () => {
  const { lastFrame } = render(
    <ConfirmPanel
      environment="Prod"
      production={true}
      summary={summary}
      typed="Prod"
    />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("matches")
  expect(frame).toContain("enter apply")
  expect(frame).toContain("esc cancel")
})

import React from "react"
import { afterEach, expect, test } from "vitest"
import { cleanup, render } from "ink-testing-library"
import { EnvBadge } from "./env-badge.js"

afterEach(cleanup)

test("marks a production environment", () => {
  const { lastFrame } = render(
    <EnvBadge environment="Prod" production={true} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("Prod PROD")
})

test("shows no marker when the environment is not production", () => {
  const { lastFrame } = render(
    <EnvBadge environment="Staging" production={false} />,
  )
  const frame = lastFrame() ?? ""
  expect(frame).toContain("Staging")
  expect(frame).not.toContain("PROD")
})

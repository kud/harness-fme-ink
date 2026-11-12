import React from "react"
import { Box, Text } from "ink"
import { Panel, colors } from "@kud/ink-ui"
import { EnvBadge } from "./env-badge.js"

export type ConfirmPanelProps = {
  environment: string
  production: boolean
  summary: string
  /** What the user has typed so far; the host owns every keystroke. */
  typed?: string
}

// Renders only — the host decides what `y`, `esc` and `enter` do. Production
// gates the apply hint behind an exact, case-sensitive match of the typed text.
export const ConfirmPanel = ({
  environment,
  production,
  summary,
  typed = "",
}: ConfirmPanelProps) => {
  if (!production) {
    return (
      <Box flexDirection="column">
        <Text>
          <Text bold>apply to </Text>
          <EnvBadge environment={environment} production={false} />
        </Text>
        <Text>{summary}</Text>
        <Text color={colors.muted}>y apply · esc cancel</Text>
      </Box>
    )
  }

  const matches = typed === environment
  return (
    <Panel title={`PROD · ${environment}`} color={colors.warning} focused>
      <Text
        color={colors.warning}
      >{`⚠ ${environment} is a production environment`}</Text>
      <Text>{summary}</Text>
      <Text>{`type the environment name exactly to continue: ${typed ? `"${typed}"` : "(nothing typed)"}`}</Text>
      <Text color={matches ? colors.success : colors.error}>
        {matches ? "✓ matches" : "✗ does not match"}
      </Text>
      <Text color={colors.muted}>
        {matches ? "enter apply · " : ""}esc cancel
      </Text>
    </Panel>
  )
}

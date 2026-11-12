import React from "react"
import { Box, Text } from "ink"
import { SelectableRow, colors, spacing } from "@kud/ink-ui"
import type { FlagDetailView } from "../types.js"
import { stateColor } from "../lib/state.js"

export type FlagDetailProps = {
  detail: FlagDetailView
  /** Environment whose row is emphasised; the host owns the focus. */
  focusedEnvironment?: string
}

const PROD_MARK = " PROD"

export const FlagDetail = ({ detail, focusedEnvironment }: FlagDetailProps) => {
  const envs = detail.environments
  if (!envs.length) {
    return (
      <Box flexDirection="column">
        <Text bold>{detail.flag}</Text>
        <Text color={colors.muted}>no environments</Text>
      </Box>
    )
  }
  const envWidth = Math.max(
    "environment".length,
    ...envs.map(
      (e) => e.environment.length + (e.production ? PROD_MARK.length : 0),
    ),
  )
  const stateWidth = Math.max(
    "state".length,
    ...envs.map((e) => e.state.length),
  )
  const ruleWidth = Math.max(
    "rule".length,
    ...envs.map((e) => (e.defaultRule || "-").length),
  )
  const trafficWidth = Math.max(
    "traffic".length,
    ...envs.map((e) => e.traffic.length),
  )
  const rulesWidth = Math.max(
    "rules".length,
    ...envs.map((e) => String(e.rules).length),
  )
  const keysWidth = Math.max(
    "keys".length,
    ...envs.map((e) => String(e.keys).length),
  )

  return (
    <Box flexDirection="column">
      <Text>
        <Text bold>{detail.flag}</Text>
        {detail.rolloutStatus ? (
          <Text color={colors.muted}>{`  ${detail.rolloutStatus}`}</Text>
        ) : null}
      </Text>
      {detail.tags.length > 0 ? (
        <Text
          color={colors.secondary}
        >{`tags: ${detail.tags.join(", ")}`}</Text>
      ) : null}
      {detail.description ? (
        <Text color={colors.muted}>{detail.description}</Text>
      ) : null}
      <Box marginLeft={spacing.lg}>
        <Text color={colors.muted}>
          {"environment".padEnd(envWidth + 2)}
          {"state".padEnd(stateWidth + 2)}
          {"rule".padEnd(ruleWidth + 2)}
          {"traffic".padEnd(trafficWidth + 2)}
          {"rules".padEnd(rulesWidth + 2)}
          {"keys".padEnd(keysWidth + 2)}
          {"segments"}
        </Text>
      </Box>
      {envs.map((env) => {
        const focused = env.environment === focusedEnvironment
        return (
          <SelectableRow key={env.environment} active={focused}>
            <Text wrap="truncate-end">
              <Text bold={focused}>
                {`${env.environment}${env.production ? PROD_MARK : ""}`.padEnd(
                  envWidth + 2,
                )}
              </Text>
              <Text color={stateColor(env.state)}>
                {env.state.padEnd(stateWidth + 2)}
              </Text>
              <Text>{(env.defaultRule || "-").padEnd(ruleWidth + 2)}</Text>
              <Text color={colors.secondary}>
                {env.traffic.padEnd(trafficWidth + 2)}
              </Text>
              <Text color={colors.secondary}>
                {String(env.rules).padEnd(rulesWidth + 2)}
              </Text>
              <Text color={colors.secondary}>
                {String(env.keys).padEnd(keysWidth + 2)}
              </Text>
              <Text color={colors.secondary}>
                {env.segments.join(", ") || "-"}
              </Text>
            </Text>
          </SelectableRow>
        )
      })}
    </Box>
  )
}

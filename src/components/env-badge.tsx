import React from "react"
import { Text } from "ink"
import { colors } from "@kud/ink-ui"

export type EnvBadgeProps = {
  environment: string
  production: boolean
}

// Small shared label: the environment name, plus a visible PROD marker only
// when the environment is production — the marker is a word, never a colour.
export const EnvBadge = ({ environment, production }: EnvBadgeProps) => (
  <Text>
    {environment}
    {production ? (
      <Text bold color={colors.warning}>
        {" "}
        PROD
      </Text>
    ) : null}
  </Text>
)

import React from "react"
import { Box, Text } from "ink"
import { SelectableRow, colors, spacing } from "@kud/ink-ui"
import type { PlanRowView } from "../types.js"
import { EnvBadge } from "./env-badge.js"

export type PlanTableProps = {
  rows: PlanRowView[]
  environment: string
  production: boolean
}

const actionColor = (action: PlanRowView["action"]): string => {
  switch (action) {
    case "update":
      return colors.info
    case "skip":
      return colors.muted
    case "error":
      return colors.error
  }
}

export const PlanTable = ({
  rows,
  environment,
  production,
}: PlanTableProps) => {
  if (!rows.length) return <Text color={colors.muted}>no changes</Text>

  const updates = rows.filter((r) => r.action === "update").length
  const skips = rows.filter((r) => r.action === "skip").length
  const errors = rows.filter((r) => r.action === "error").length
  const flagWidth = Math.max(4, ...rows.map((r) => r.flag.length))
  const actionWidth = Math.max(6, ...rows.map((r) => r.action.length))

  return (
    <Box flexDirection="column">
      <Text>
        <Text bold>plan </Text>
        <EnvBadge environment={environment} production={production} />
      </Text>
      <Text>
        <Text
          color={colors.muted}
        >{`${updates} changes, ${skips} skipped`}</Text>
        {errors > 0 ? (
          <Text color={colors.error}>{`, ${errors} errors`}</Text>
        ) : null}
      </Text>
      <Box marginLeft={spacing.lg}>
        <Text color={colors.muted}>
          {"flag".padEnd(flagWidth + 2)}
          {"action".padEnd(actionWidth + 2)}
          {"detail"}
        </Text>
      </Box>
      {rows.map((row) => (
        <SelectableRow key={row.flag} active={false}>
          <Text wrap="truncate-end">
            <Text>{row.flag.padEnd(flagWidth + 2)}</Text>
            <Text color={actionColor(row.action)}>
              {row.action.padEnd(actionWidth + 2)}
            </Text>
            <Text>{row.detail}</Text>
          </Text>
        </SelectableRow>
      ))}
    </Box>
  )
}

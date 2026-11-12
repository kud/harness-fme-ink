import React from "react"
import { Box, Text } from "ink"
import { SelectableRow, Spinner, colors } from "@kud/ink-ui"
import type { ResultRowView } from "../types.js"
import { resultColor } from "../lib/state.js"

export type ResultListProps = {
  rows: ResultRowView[]
  emptyText?: string
}

// Live progress of a write: the status word is always present, the spinner
// only reinforces the running rows.
export const ResultList = ({
  rows,
  emptyText = "no results",
}: ResultListProps) => {
  if (!rows.length) return <Text color={colors.muted}>{emptyText}</Text>

  const flagWidth = Math.max(4, ...rows.map((r) => r.flag.length))
  const statusWidth = Math.max(7, ...rows.map((r) => r.status.length))
  return (
    <Box flexDirection="column">
      {rows.map((row) => (
        <SelectableRow key={row.flag} active={false}>
          <Text wrap="truncate-end">
            <Text>{row.flag.padEnd(flagWidth + 2)}</Text>
            <Text color={resultColor(row.status)}>
              {row.status.padEnd(statusWidth + 2)}
            </Text>
            <Text color={colors.muted}>{row.reason ?? ""}</Text>
          </Text>
          {row.status === "running" ? <Spinner /> : null}
        </SelectableRow>
      ))}
    </Box>
  )
}

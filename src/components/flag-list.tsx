import React from "react"
import { Box, Text } from "ink"
import { SelectableRow, colors, spacing } from "@kud/ink-ui"
import type { FlagRowView } from "../types.js"
import { envCellText, stateColor } from "../lib/state.js"
import { windowRows } from "../lib/window.js"

export type FlagListProps = {
  rows: FlagRowView[]
  selectedIndex: number
  /** How many flag rows are visible; the window follows `selectedIndex`. */
  height: number
  /** Environment whose column is emphasised; the host owns the focus. */
  focusedEnvironment?: string
  emptyText?: string
}

const FOCUS_MARK = "▸ "
const PROD_MARK = " PROD"

export const FlagList = ({
  rows,
  selectedIndex,
  height,
  focusedEnvironment,
  emptyText = "no flags",
}: FlagListProps) => {
  if (!rows.length) return <Text color={colors.muted}>{emptyText}</Text>

  const environments = rows[0].environments
  const nameWidth = Math.max(4, ...rows.map((r) => r.flag.length))
  const statusWidth = Math.max(
    7,
    ...rows.map((r) => (r.rolloutStatus ?? "").length),
  )
  const envWidths = environments.map((env, ci) =>
    Math.max(
      (focusedEnvironment === env.environment ? FOCUS_MARK.length : 0) +
        env.environment.length +
        (env.production ? PROD_MARK.length : 0),
      ...rows.map((r) => envCellText(r.environments[ci]).length),
    ),
  )
  const { items, offset } = windowRows(rows, selectedIndex, height)

  return (
    <Box flexDirection="column">
      <Box marginLeft={spacing.lg}>
        <Text color={colors.muted} bold={focusedEnvironment !== undefined}>
          {"flag".padEnd(nameWidth + 2)}
          {"rollout".padEnd(statusWidth + 2)}
          {environments.map((env, ci) => (
            <Text
              key={env.environment}
              bold={focusedEnvironment === env.environment}
            >
              {`${focusedEnvironment === env.environment ? FOCUS_MARK : ""}${env.environment}${env.production ? PROD_MARK : ""}`.padEnd(
                envWidths[ci] + 2,
              )}
            </Text>
          ))}
        </Text>
      </Box>
      {items.map((row, i) => {
        const active = offset + i === selectedIndex
        return (
          <SelectableRow key={row.flag} active={active}>
            <Text wrap="truncate-end">
              <Text bold={active}>{row.flag.padEnd(nameWidth + 2)}</Text>
              <Text color={colors.muted}>
                {(row.rolloutStatus ?? "").padEnd(statusWidth + 2)}
              </Text>
              {row.environments.map((cell, ci) => (
                <Text
                  key={cell.environment}
                  color={stateColor(cell.state)}
                  bold={focusedEnvironment === cell.environment}
                >
                  {envCellText(cell).padEnd(envWidths[ci] + 2)}
                </Text>
              ))}
            </Text>
          </SelectableRow>
        )
      })}
    </Box>
  )
}

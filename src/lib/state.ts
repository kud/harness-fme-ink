import { colors } from "@kud/ink-ui"
import type { EnvCell, EnvState, ResultRowView } from "../types.js"

// The word is the channel, the hue only reinforces it — see the ink-ui AGENTS.md
// rule that a state never lives in a tint alone.
export const stateColor = (state: EnvState): string => {
  switch (state) {
    case "on":
      return colors.success
    case "off":
      return colors.secondary
    case "partial":
      return colors.warning
    case "killed":
      return colors.error
    case "undefined":
      return colors.muted
  }
}

// List cells: `defaultRule` is the full rule text the host formats (`on 100%`,
// `on 30% / off 70%`); killed shows the word, undefined collapses to `-`.
export const envCellText = (
  cell: Pick<EnvCell, "state" | "defaultRule">,
): string => {
  if (cell.state === "killed") return "killed"
  if (cell.state === "undefined") return "-"
  return cell.defaultRule || cell.state
}

export const resultColor = (status: ResultRowView["status"]): string => {
  switch (status) {
    case "pending":
      return colors.pending
    case "running":
      return colors.info
    case "applied":
      return colors.success
    case "skipped":
      return colors.secondary
    case "failed":
      return colors.error
  }
}

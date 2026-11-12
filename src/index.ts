// Controlled Ink components, presentation-only: props in, no data fetching, no app-level input.

export { FlagList, type FlagListProps } from "./components/flag-list.js"
export { FlagDetail, type FlagDetailProps } from "./components/flag-detail.js"
export { PlanTable, type PlanTableProps } from "./components/plan-table.js"
export {
  ConfirmPanel,
  type ConfirmPanelProps,
} from "./components/confirm-panel.js"
export { ResultList, type ResultListProps } from "./components/result-list.js"
export { EnvBadge, type EnvBadgeProps } from "./components/env-badge.js"

export { windowRows } from "./lib/window.js"

export type {
  EnvState,
  EnvCell,
  FlagRowView,
  EnvDetailView,
  FlagDetailView,
  PlanRowView,
  ResultRowView,
} from "./types.js"

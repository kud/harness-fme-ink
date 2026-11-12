// View models the host maps its own data onto. Deliberately small: this
// package knows nothing about any client, only about what a screen needs.
export type EnvState = "on" | "off" | "partial" | "killed" | "undefined"

export type EnvCell = {
  environment: string
  state: EnvState
  defaultRule: string
  production: boolean
}

export type FlagRowView = {
  flag: string
  rolloutStatus?: string
  environments: EnvCell[]
}

export type EnvDetailView = {
  environment: string
  production: boolean
  state: EnvState
  defaultRule: string
  traffic: string
  rules: number
  keys: number
  segments: string[]
}

export type FlagDetailView = {
  flag: string
  rolloutStatus?: string
  tags: string[]
  description?: string
  environments: EnvDetailView[]
}

export type PlanRowView = {
  flag: string
  action: "update" | "skip" | "error"
  detail: string
}

export type ResultRowView = {
  flag: string
  status: "pending" | "running" | "applied" | "skipped" | "failed"
  reason?: string
}

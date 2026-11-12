# @kud/harness-fme-ink

Controlled [Ink](https://github.com/vadimdemedes/ink) components for rendering
feature flags, their environments and change plans in the terminal.

Every component is **presentation-only**: props in, no data fetching, no
app-level input. The consuming surface owns selection, navigation, typing and
loading, so the same `<FlagList>` drops into a full-screen CLI or a single pane
inside a larger dashboard. Primitives and colour tokens come from
[`@kud/ink-ui`](https://github.com/kud/ink-ui).

This package has no dependency on [`@kud/harness-fme`](https://github.com/kud/harness-fme)
or any other client. It defines a handful of small view models, and the host
maps its own data onto them. The `tui` command of
[`@kud/harness-fme-cli`](https://github.com/kud/harness-fme-cli) is the
reference host.

```
@kud/harness-fme        headless core — client, types (framework-agnostic)
@kud/harness-fme-cli    CLI and the `tui` host, which maps core data onto view models
└─ @kud/harness-fme-ink  this package — Ink rendering, view models only
```

## Install

```sh
npm install @kud/harness-fme-ink ink react
```

`ink` (>=7) and `react` (>=19) are peer dependencies.

## Components

| Component        | Renders                                                                                |
| ---------------- | -------------------------------------------------------------------------------------- |
| `<FlagList>`     | A windowed, selectable matrix of flags by environment, with an optional focused column |
| `<FlagDetail>`   | One flag: rollout status, tags, description and a row per environment                  |
| `<PlanTable>`    | A change plan: one row per flag with its action (`update`, `skip`, `error`) and detail |
| `<ConfirmPanel>` | The apply gate: a plain prompt, or for production a typed-name confirmation            |
| `<ResultList>`   | Live progress of a write: `pending`, `running`, `applied`, `skipped` or `failed`       |
| `<EnvBadge>`     | An environment name, with a visible `PROD` marker when it is production                |

`windowRows(items, selected, rows)` is also exported. It is the pure helper
behind the list windowing, returning `{ items, offset }` so the selected row
stays visible in a long list.

## View models

You build these from whatever your data source returns.

| Type             | Shape                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `EnvState`       | `"on" \| "off" \| "partial" \| "killed" \| "undefined"`                                   |
| `EnvCell`        | `{ environment, state, defaultRule, production }`                                         |
| `FlagRowView`    | `{ flag, rolloutStatus?, environments: EnvCell[] }`                                       |
| `EnvDetailView`  | `{ environment, production, state, defaultRule, traffic, rules, keys, segments }`         |
| `FlagDetailView` | `{ flag, rolloutStatus?, tags, description?, environments: EnvDetailView[] }`             |
| `PlanRowView`    | `{ flag, action: "update" \| "skip" \| "error", detail }`                                 |
| `ResultRowView`  | `{ flag, status: "pending" \| "running" \| "applied" \| "skipped" \| "failed", reason? }` |

`defaultRule` is the full rule text as the host wants it shown, such as
`on 30% / off 70%`. Production is flagged per environment, not per flag, so the
same flag can be `production: false` in `staging` and `production: true` in
`live`.

## Usage

The components are **controlled**: you hold the selection index, the focused
environment and key handling in your app shell, and pass them down. Nothing here
calls `useInput` at app level.

```tsx
import { useState } from "react"
import { render, Box, useInput } from "ink"
import {
  FlagList,
  FlagDetail,
  type FlagRowView,
  type FlagDetailView,
} from "@kud/harness-fme-ink"

type Props = {
  rows: FlagRowView[]
  detailFor: (flag: string) => FlagDetailView
}

const Flags = ({ rows, detailFor }: Props) => {
  const [selected, setSelected] = useState(0)
  const [envIndex, setEnvIndex] = useState(0)

  const environments = rows[0]?.environments ?? []
  const focusedEnvironment = environments[envIndex]?.environment

  useInput((_input, key) => {
    if (key.upArrow) setSelected((s) => Math.max(0, s - 1))
    if (key.downArrow) setSelected((s) => Math.min(rows.length - 1, s + 1))
    if (key.leftArrow) setEnvIndex((i) => Math.max(0, i - 1))
    if (key.rightArrow)
      setEnvIndex((i) => Math.min(environments.length - 1, i + 1))
  })

  const current = rows[selected]

  return (
    <Box flexDirection="column">
      <FlagList
        rows={rows}
        selectedIndex={selected}
        height={15}
        focusedEnvironment={focusedEnvironment}
      />
      {current ? (
        <FlagDetail
          detail={detailFor(current.flag)}
          focusedEnvironment={focusedEnvironment}
        />
      ) : null}
    </Box>
  )
}

const rows: FlagRowView[] = [
  {
    flag: "checkout-redesign",
    rolloutStatus: "ramping",
    environments: [
      {
        environment: "staging",
        state: "on",
        defaultRule: "on 100%",
        production: false,
      },
      {
        environment: "live",
        state: "partial",
        defaultRule: "on 30% / off 70%",
        production: true,
      },
    ],
  },
]

render(
  <Flags
    rows={rows}
    detailFor={(flag) => ({ flag, tags: [], environments: [] })}
  />,
)
```

### Confirming a write

`<ConfirmPanel>` only renders. You decide what `y`, `esc` and `enter` do, and you
pass in what has been typed so far.

```tsx
<ConfirmPanel
  environment="live"
  production
  summary="3 flags will change"
  typed={typed}
/>
```

For a non-production environment it shows a plain `y apply · esc cancel` prompt.
For a production environment it switches to a warning panel, asks for the
environment name to be typed, and only offers `enter apply` once the typed text
equals the environment name exactly (case-sensitive). Your shell should enforce
the same rule before it applies anything: the panel shows the gate, it does not
hold it.

Because selection lives in your shell, you can render a `<FlagList>` beside other
panes in one screen, composition a shelled-out full-screen CLI can't give you.

## Development

```sh
npm install
npm run typecheck
npm test          # ink-testing-library
npm run build     # tsup → dist/
```

## Licence

MIT

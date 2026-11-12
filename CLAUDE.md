# @kud/harness-fme-ink

Controlled Ink components for browsing feature flags and confirming flag writes.

## Terminal UI

The TUI is built with [@kud/ink-ui](https://github.com/kud/ink-ui). Before writing or changing any UI component, read `node_modules/@kud/ink-ui/AGENTS.md`, and never hand-roll a component without checking there first. Colour comes from the `colors` token object — never a string literal — and never carries meaning alone: every state also carries a word, glyph or marker (`PROD`, `killed`, `✓ matches`).

## Keys this package does not own

Components never call `useInput`. The host owns every key, including `esc`, `y`, `enter` and typing the environment name in the production confirm panel; these components only render what the host's state says.

# BURST documentation website

Docusaurus source for the BURST website. Protocol code and canonical Markdown
remain in [BURST-UBI/protocol](https://github.com/BURST-UBI/protocol).
This repository owns the website, styling, deployment and default-value tooling.

`protocol-source.json` records the protocol commit used by a deployment.
The build checks it out into ignored `.protocol/` and renders its `docs/`
directly, including the original illustrations. There is no editable copy of
the docs here. The older site remains in this repository's Git history.

## Develop

Use Node.js 22 or newer. Run `npm ci`, then `npm start` or `npm run build`.
On the development desktop, use the protocol checkout's `tools/limited-run.sh`
for installs, builds and tests. `npm run serve` previews the resulting `build/`.

## Sync docs and defaults

`npm run sync` advances the recorded commit to the branch named in
`protocol-source.json`, then evaluates Rust's `ProtocolParams` through the existing
governance registry. The exporter lives here, not in the protocol repository.
The scheduled sync workflow performs the same operation and commits the new
source pin and defaults when canonical Markdown already agrees with the values.

Code defaults are exact decimal strings in `protocol-defaults.json`. Markdown
values carry `<!-- default:live.trst_expiry_secs:years -->70<!-- /default -->`
markers. Generation updates the numbers; the website strips the markers before
rendering. Builds reject stale source fingerprints or marked values. CI also
compares the export against compiled Rust. Hypothetical examples remain literal.

If a changed parameter requires a Markdown correction, sync stops rather than
publishing conflicting documentation. The corrected `.protocol/docs` and coverage
changes must be submitted to the protocol repository first, then sync can resume.
The `--write` command updates those files without carrying implementation sign-offs
onto changed text. Prose still needs review when policy changes.

The checked-in source branch is temporarily `docs/protocol-guide`, pending its
merge into protocol `main`. Change the `ref` to `main` after that merge.

## Deploy

Vercel uses this repository's root, `npm ci`, `npm run build` and `build/`.
Preview branches do not promote `brst.cc`. Production cutover remains separate.

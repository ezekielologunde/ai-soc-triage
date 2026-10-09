# SOC Review

Interactive portfolio by Ezekiel Ologunde. A working browser-local SOC triage and human-review demo using synthetic fixtures. Version 0.1 is a deterministic baseline, not a live LLM agent or production SOC service.

## Run

Node 20+ required. No package installation required.

```
npm start
npm test
```

Open http://127.0.0.1:4173. Static deployment serves `dist/`.

## Features

Alert search and verdict filters; six synthetic scenarios; evidence-linked rule drafts; required analyst decision notes; browser-local review history; JSON exports; executable development evaluations; responsive interface. Clear limitations appear in the product.

## Evidence and limits

Six development fixtures and eight capability/narrative checks are evaluated in the interface. These inputs are known to the implementation, not an independent accuracy benchmark. Node tests additionally cover threshold boundaries, invalid review records, missing evidence references and capability rejection. No human time-saving, actual student/customer use, live model quality or research novelty is claimed.

No backend, model API, SIEM credential, threat-intelligence feed, incident closure or host isolation is connected. The capability function demonstrates a boundary model; it is not server-side authorization. Anyone can edit their browser state. Do not use this demo for real incidents. The synthetic narrative-injection case tests a rule system that ignores prose, not an LLM defense.

## Live homelab deployment

Separate from the public demo above: a real pipeline now runs against an
actual Wazuh SIEM in a private home lab (read-only connector, local-LLM
triage drafting, human review queue). Built 2026-10-09. See
[evaluation/LIVE-DEPLOYMENT.md](evaluation/LIVE-DEPLOYMENT.md) for what's
running, what was measured (a small before/after prompt-tuning result on 20
real alerts, explicitly scoped as not a benchmark), and why it stays
LAN-only rather than linked live. This is the "authorized telemetry
ingestion" and "server-side model adapter" items from the Next stage list
below, done for real rather than planned — the independent held-out
evaluation item is still open.

## Next stage

Independent labels and held-out evaluation against this baseline, for both the public demo's rules engine and the live homelab deployment's model drafts. Secrets must stay server-side. Data collection and metrics must be frozen before outcome claims.

All alerts and expected labels are original synthetic examples. Documentation IP ranges are used. Original work remains unlicensed pending an author decision. Fonts are loaded from Google Fonts and the UI falls back to system sans-serif when unavailable.

## Local Ollama draft lab

Start Ollama and install a model, then run in PowerShell:

```powershell
ollama pull qwen2.5:3b
$env:OLLAMA_MODEL='qwen2.5:3b'
npm start
```

Open http://127.0.0.1:4173/ai. The local-only page generates a draft for one of the six synthetic fixtures. The public hosted demo remains deterministic and cannot access your PC's Ollama service.

The adapter uses the [Ollama chat API](https://docs.ollama.com/api/chat). Expected labels are withheld from the prompt. Output must have a supported verdict, bounded summary and limitations, and evidence IDs that exist in the input. This validates structure and citation existence, not whether the reasoning is correct. No tools or response actions are exposed. Same-origin and Host checks protect the loopback endpoint; this is not an authenticated production service and must not be exposed publicly.

Run `node check-http.mjs` with the server running to check request boundaries. Adapter unit tests use simulated model responses and do not measure live model quality. Use `node draft-local.mjs SOC-1042` for CLI inference with OLLAMA_MODEL set.

## Frozen evaluation v1

See [results](evaluation/RESULTS.md). Local qwen2.5:3b matched 3/8 authored policy labels; one response was rejected for an invalid evidence citation. This is not independent real-world accuracy. The public demo remains deterministic and AI drafts remain advisory.


[Evaluation v2](evaluation/v2/RESULTS.md) compared generic and explicit-policy prompts on the same six authored scenarios: valid policy matches were 1/6 and 2/6 respectively. Both produced 4/6 citation-valid responses. This is a small development comparison, not independent accuracy; automatic AI triage remains unsuitable.


## Rules-owned priority and factual review

The local /ai interface now displays server-calculated rule priority separately from the model suggestion. Disagreements are explicit. Reviewers inspect supplied evidence, classify unsupported claims or missing evidence, and add a required note before exporting a reviewed draft. Reviews are self-reported, not independently verified. Agreement and valid citation IDs do not establish factual correctness. The public static demo is unchanged.


## Local Wazuh metadata intake

Open http://127.0.0.1:4173/import with npm start running. Supports one alert object, an array, or JSONL (1 MiB, 500 records maximum). Files are parsed in browser memory with no upload, persistence or model call. Preview before accepting; importing another file replaces the in-memory batch. Only numeric rule.id and integer rule.level (0 through 16) are retained. All other fields are omitted, including descriptions, raw logs, nested data, identity and timestamps. This intentionally sacrifices event context and is not full alert ingestion or anonymization of arbitrary retained text.

Cases default to Needs investigation, regardless of source level. Track Open, Investigating and Reviewed with a required note; export JSON case summaries. Review notes are free text and are not sanitized. Review exports before sharing. Reload clears the workspace. No real telemetry has been tested, uploaded or committed. The public static demo is unchanged.

Source-format reference: [Wazuh alert management](https://documentation.wazuh.com/current/user-manual/manager/alert-management.html). Indexer search-result wrappers and CSV are not supported.

Selected evidence extension: opt in to protocol (TCP/UDP/ICMP), destination port, event count and batch-local host aliases before import. Other fields remain omitted. Export provenance includes SHA-256 of input bytes, time and selected fields; a hash does not establish authenticity. Public /replay.html offers synthetic examples only, without a file input. Review notes are not redacted.


Local workspace restore: /import accepts exported case-summary JSON (2 MiB, 500 cases). Restored data is validated and previewed before queue replacement. Review notes/status survive; priority always resets to Needs investigation. Provenance is treated as self-reported. Unknown case fields are discarded; unsupported evidence is rejected. Public replay does not accept files.


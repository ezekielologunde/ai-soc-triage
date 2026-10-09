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

## Next stage

Server-side model adapter, authenticated review API, authorized telemetry ingestion, independent labels and held-out evaluation against this baseline. Secrets must stay server-side. Data collection and metrics must be frozen before outcome claims.

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


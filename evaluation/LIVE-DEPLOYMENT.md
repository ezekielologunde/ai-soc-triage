# Live homelab deployment (separate from the public demo)

This document describes a second, separate artifact: a running pipeline
against a real Wazuh SIEM instance in a private home lab, built 2026-10-09.
It is not the public demo in this repository. The public demo (`dist/`)
remains the deterministic, synthetic-fixture baseline described in the main
README and is not connected to this deployment in any way.

## What is running

Three services, read-only against the SIEM, draft-only in their output:

1. **Connector** — polls the Wazuh indexer (OpenSearch) over a dedicated,
   purpose-created read-only account (not the admin account) for alerts at
   a configurable severity floor. No write access exists; a write attempt
   with this account was tested and returns 403.
2. **Triage drafter** — sends each new alert to a local LLM
   (`qwen2.5-3b-cpu4` via Ollama, CPU-only, no GPU in this environment) and
   asks for a priority call, a plain-language summary, a likely
   classification, and a confidence level. Output is appended to a local
   file. Nothing is sent to the SIEM, and no remediation action is ever
   taken or suggested by the prompt.
3. **Review UI** — a small LAN-only page listing drafts with Approve/Reject.
   Review decisions are kept separately from the drafts so the drafter can
   keep writing while a human reviews. No decision here writes back to the
   SIEM either; it only records the reviewer's own call.

All three run as systemd services on a dedicated, isolated host, separate
from the SIEM itself and from other infrastructure in the environment.

## What was actually measured

Twenty real alerts (all above the severity floor, pulled from actual SIEM
history, not synthetic) were run through the pipeline twice.

**First pass, untuned prompt:** 19/20 came back `priority: high`, 1/20
`medium`. Manual inspection showed all 20 were the same underlying pattern:
a host-based anomaly check flagging virtual filesystem files exposed into
Linux containers — a known false-positive class for that check on
containerized hosts, not real findings. The prompt had no context that the
environment is container-heavy, so it defaulted to treating every
"hidden file" hit as notable.

**Second pass, after adding environment context to the prompt** (naming the
specific false-positive pattern and when to apply it): 20/20 came back
`priority: low`, `likely_classification: benign - routine container
artifact`, `confidence: high`, with summaries that state the reasoning
(e.g. "a known false-positive pattern specific to containerized hosts...
not a security concern") rather than a templated default.

## What this is not evidence of

This is 20 alerts, all one underlying pattern, reviewed by the same person
who wrote the prompt. It is not:

- An independent accuracy benchmark
- Evidence the model generalizes to alert types outside this pattern
- A measured precision/recall number — no such number is claimed anywhere
  in this repository for this deployment
- Evidence this approach works unsupervised; every draft still requires a
  human Approve/Reject before it means anything

A real precision measurement requires a held-out, independently labeled set
and genuine day-to-day review history, not a same-session before/after on
one pattern. That is intentionally not done yet, and no number will be
added here until it is.

## Access

This deployment is LAN-only by design (see the main README's position on
not exposing inference or review surfaces publicly) and is not reachable
from outside the private network it runs on. It is documented here, with
evidence, rather than linked live, for the same reason the local Ollama lab
in this repository stays loopback-only: a single-user development surface
is not a public authenticated backend.

Screenshot: `evidence/live-homelab-deployment-2026-10-09.jpg`

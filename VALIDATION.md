# Local AI validation

The public demo remains a static deterministic baseline. The local Ollama extension adds an inference adapter and a separate browser page at /ai.

Validation performed: nine Node tests passed and five HTTP checks passed (cross-origin rejection, missing-origin rejection, unknown fixture rejection, method restriction, local page availability). Model output is untrusted and is rendered as text. Citation checks only validate ID membership, not entailment or factual accuracy.

The model receives synthetic fixtures without their expected verdict labels. No telemetry import, action execution, containment, credentials or outbound tool functions are available to the model. The inference service is loopback-only. This is a single-user development interface, not a public authenticated backend.

A later independent evaluation must freeze labels and scenarios before model tuning, retain invalid outputs and abstentions, assess factual support, and compare with the rules baseline. Do not describe these development checks as model accuracy or a prompt-injection defense benchmark.

Live smoke test on 2026-10-09: qwen2.5:3b (Q4_K_M, digest 357c53fb659c5076de1d65ccb0b397446227b71a42be9d1603d46168015c9e4b). The first plain-JSON response was rejected for an invalid limitations field. The adapter was amended to request an explicit JSON schema and a 4,096-token context. This amendment followed a development failure and is not a frozen benchmark.


The second response was also rejected for invalid limitations. A subsequent request with bounded, explicitly nonempty string fields succeeded through the browser interface. Saved output: evidence/local-smoke-response.json. For SOC-1042 the model returned Investigate, while the development label and rules baseline are Escalate. This disagreement is retained; one valid output is connection evidence, not model quality evidence. No response actions occurred.


Rules-owned review update: 11 unit tests and five HTTP checks passed. Live browser smoke test retained Escalate while Ollama suggested Investigate. Empty review export was blocked; selecting Needs further investigation and providing a note displayed export confirmation. Screenshot saved in evidence/rules-owned-review.jpg. This is workflow verification, not an independent factuality assessment.


Wazuh metadata intake: 15 unit tests pass, covering removal of free text, JSONL support, malformed batch rejection, limits and review validation. Browser synthetic example verified preview, queue acceptance and review status. Real Wazuh files and file-picker interaction remain unverified. No automatic severity-to-disposition mapping or AI analysis of imports is implemented.


Selected-evidence extension: 18 unit tests passed. Browser verified synthetic JSONL via actual file picker, selected-field replay, and downloaded export. Export checked for provenance and default priority. Real telemetry remains untested.


Workspace restore: 21 unit tests passed. Browser file-picker test restored a synthetic Investigating case and its note through preview acceptance. Duplicate IDs, invalid evidence and spoofed priority are covered by unit tests. Restored provenance is not authenticated.


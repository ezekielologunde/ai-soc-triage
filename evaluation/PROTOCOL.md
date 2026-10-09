# Frozen development protocol v1

Eight original synthetic scenarios. Labels express this project's triage policy, not externally established maliciousness. Escalate: >=10 failures followed by success, or unapproved encoded execution. Routine: isolated single failure without success, or approved scan. Investigate: remaining cases with missing context. These criteria favor the existing rule baseline by construction. This evaluates policy agreement, not general SOC superiority.

Freeze cases, adapter and rules hashes before inference. One attempt per case, qwen2.5:3b, adapter options unchanged. No tuning or retry in this run. Preserve raw responses, invalid output, timeout, latency and model digest. No expected labels or protocol text is sent to the model. Invalid outputs count as incorrect in total-case agreement. Report valid-output count, all-case agreement and per-class recall. E01/E08 form one paired narrative perturbation, not independent evidence of injection resistance. No statistical generalization from eight authored examples.

Citation ID validity is automatic; entailment, unsupported assertions and adequacy of uncertainty require explicit review. Never label membership checks as factuality. Existing synthetic alerts are excluded. Cases are authored with knowledge of the implementation and are not an independent blinded benchmark.

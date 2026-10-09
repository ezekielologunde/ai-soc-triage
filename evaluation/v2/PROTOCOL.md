# V2 preregistered development comparison

Six authored synthetic scenarios, including two correlated narrative pairs. Not independent expert labels, not held-out production accuracy. Same local qwen2.5:3b model and adapter in both arms. Arm A uses existing generic system prompt; arm B appends the frozen explicit policy to that system prompt. No expected labels, case IDs or pair metadata sent to model. No prompt changes during run. One attempt per case per arm, no retries. Alternate arm order by case to reduce a fixed warmup-order advantage. Record latency but do not infer speed superiority.

Pairs C1/C5 and C2/C6 preserve identical alert IDs, structured fields and evidence. Only narrative suffix changes. Two pairs cannot establish broad prompt-injection resistance. Pair results are correlated, so do not calculate independent-sample significance.

Record raw responses including rejected outputs, model digest and hashes of policy, cases, runner, protocol, adapter and rules before inference. Score agreement on all six, invalid responses as incorrect; separately show output validity and pair consistency. Citation membership is not factuality. Manual coding-agent evidence review is not independent review. Do not replace v1 results or claim cross-version improvement because cases changed.

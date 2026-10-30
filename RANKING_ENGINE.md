# Ranking Engine

**Status:** Functional specification / fixed-universe exercise  
**Purpose:** Define a deterministic, explainable ranking function that selects ten investment-opportunity candidates for a Polly poll.  
**Scope:** Ranking logic and poll payload design only. This document does not implement live market-data ingestion, dynamic universe churn, scheduling, or Polly API calls.

## 1. Product objective

The ranking engine answers one narrow question:

> Given a fixed eligible universe, which ten assets currently present the most compelling *observable trading opportunities*?

This is an opportunity-screening and human-preference collection system. It is not a portfolio allocator, execution engine, personalized financial adviser, or prediction guarantee. A high score means the available signals look comparatively attractive under the configured model. It does not mean the asset is safe, undervalued, or certain to rise.

The output feeds a new Polly multiple-choice poll. Each poll is a time-stamped snapshot. Earlier polls are not edited, so the sequence can later be compared with market outcomes and participant preferences.

## 2. Fixed exercise universe and selected ten

For the Polly functionality exercise, use this fixed set of ten symbols from the supplied Porketo portfolio:

| Symbol | Asset family | Why include it in the fixed exercise |
|---|---|---|
| BTC | Crypto / large-cap | Crypto market benchmark and liquid reference asset |
| ETH | Crypto / large-cap | Major smart-contract ecosystem exposure |
| SOL | Crypto / large-cap | Higher-beta smart-contract ecosystem exposure |
| LINK | Crypto / infrastructure | Oracle and interoperability infrastructure exposure |
| TAO | Crypto / AI | AI-related crypto narrative and higher-volatility exposure |
| AVGO | Equity / semiconductors | Large technology infrastructure and semiconductor exposure |
| NVDA | Equity / semiconductors | AI compute and semiconductor exposure |
| IONQ | Equity / quantum computing | Publicly traded quantum-computing exposure |
| QBTS | Equity / quantum computing | Publicly traded quantum-computing exposure |
| RGTI | Equity / quantum computing | Publicly traded quantum-computing exposure |

This is a **deliberately chosen test basket**, not a claim that these are the ten highest-scoring assets in current market conditions. No live market data was requested for this exercise. The basket gives the Polly workflow a stable mixture of asset families and lets us focus on choice formatting, poll creation, and result retrieval before enabling live selection.

The initial universe is exactly these ten assets. Therefore, for this fixture, all ten become poll options in their fixed order. When dynamic ranking is introduced later, the universe can expand to the larger portfolio list and the same scoring interface can select the top ten from it.

### Symbol normalization

Use canonical provider symbols internally, and keep a separate display symbol for Polly. Provider-specific symbol mappings must be explicit. For example, a market-data provider may use a suffix for a quoted pair or exchange. Do not silently assume that a provider's symbol format is identical to the portfolio ticker.

## 3. Ranking model

The production-shaped model uses six normalized features. Every feature is on a 0–100 scale, where a higher number is more desirable under the opportunity objective.

| Feature | Weight | Interpretation |
|---|---:|---|
| Short-term momentum | 25% | Direction and strength of recent price movement |
| Relative strength | 20% | Performance versus a relevant market benchmark |
| Volume acceleration | 20% | Whether participation is expanding with the move |
| Trend confirmation | 15% | Agreement between short and medium lookback trends |
| Liquidity | 10% | Ability to enter/exit without excessive market impact |
| Risk quality | 10% | Preference for orderly, not excessively erratic, price behaviour |
| **Total** | **100%** | |

The weights emphasize momentum and confirmation because the objective is to surface trading opportunities, not rank companies by long-term intrinsic value. Relative strength helps distinguish assets moving independently from broad market beta. Volume acceleration helps reject moves with weak participation. Liquidity makes the output more practical. Risk quality prevents extreme volatility from being treated as automatically positive.

These are initial policy weights. They should be calibrated and validated against historical forward returns before being treated as an effective predictive model.

### 3.1 Feature definitions

Use log returns where possible because they compose additively across time:

- `r4h`: log return over the most recent four-hour interval.
- `r24h`: log return over the most recent 24-hour interval.
- `r7d`: log return over the most recent seven-day interval.
- `benchmark-r24h`: benchmark's 24-hour log return.
- `volume-ratio`: recent rolling volume divided by its comparable historical baseline.
- `spread-bps`: estimated bid/ask spread in basis points.
- `adv`: average daily traded notional or a provider-equivalent liquidity measure.
- `realized-vol`: realized volatility over a defined recent window.

Feature windows and data sources must be consistent within a ranking run. Missing or stale observations must not be replaced with zero, because zero would incorrectly imply neutral performance.

### 3.2 Normalize features

Raw measures have different units and distributions. Convert each raw measure to a score from 0 to 100 before applying weights.

A practical first implementation is cross-sectional percentile ranking among eligible assets:

`percentile-score(x) = 100 * percentile-rank(x among eligible assets)`

For metrics where lower is better, invert the percentile:

`inverse-percentile-score(x) = 100 - percentile-score(x)`

For robust implementation, define tie handling once (average rank is recommended) and use the same convention in every language implementation. Percentile normalization is relative to the candidate universe, so scores are not absolute probabilities and can change when the universe changes.

Suggested feature composition:

- **Momentum (25 points):** Normalize `0.6 * r4h + 0.4 * r24h`, with larger positive values scoring higher. The exact combination is configurable.
- **Relative strength (20 points):** Normalize `r24h - benchmark-r24h`.
- **Volume acceleration (20 points):** Normalize `log(volume-ratio)`; values above 1 indicate volume above baseline.
- **Trend confirmation (15 points):** Reward agreement between the signs of `r4h`, `r24h`, and `r7d`. A simple deterministic score can be `100 * count-positive / 3`; a richer implementation can normalize the weighted return combination.
- **Liquidity (10 points):** Combine a positive percentile of `log(adv)` with an inverse percentile of `spread-bps`. A simple 50/50 blend is sufficient for the first version.
- **Risk quality (10 points):** Prefer moderate realized volatility and penalize extreme volatility. Do not assume lower volatility is always better; use a configurable acceptable band or a capped inverse percentile. At minimum, apply a hard risk eligibility ceiling and score remaining assets inversely by volatility.

Do not reward a positive price move twice without intention. Momentum and relative strength are related by design; their weights express deliberate preference for absolute momentum and performance beyond the benchmark.

### 3.3 Composite formula

For asset `i`:

`score(i) = 0.25*M(i) + 0.20*RS(i) + 0.20*VA(i) + 0.15*TC(i) + 0.10*LQ(i) + 0.10*RQ(i)`

Where each component is in `[0, 100]`.

Therefore `score(i)` is also in `[0, 100]`. Sort descending by score and choose the first ten eligible assets. For deterministic output, break score ties by (1) higher liquidity score, then (2) canonical ticker ascending.

### 3.4 Eligibility before ranking

Ranking must only consider assets with valid and sufficiently fresh observations. Examples of exclusion rules:

- Required price or candle data is missing or stale.
- Asset is suspended, inactive, or not tradable on the configured venue.
- Liquidity is below a configured minimum.
- Spread is above a configured maximum.
- Realized volatility exceeds the configured risk ceiling.
- Provider mapping is ambiguous or data quality checks fail.

If fewer than ten assets pass, do not silently fill the list with ineligible assets. Return the available candidates and an explicit `insufficient-eligible-assets` status. The Polly publishing layer can either skip the poll or publish fewer than ten options according to an explicit policy.

## 4. Clojure-friendly representation

Keep weights and field names as plain data. This makes the model straightforward to translate into Clojure, JSON Schema, EDN, or another schema-oriented language.

### 4.1 Configuration data

```clojure
(def ranking-config
  {:version "1.0"
   :objective :trading-opportunity
   :selection-count 10
   :weights
   {:momentum          0.25
    :relative-strength 0.20
    :volume-accel      0.20
    :trend-confirm     0.15
    :liquidity         0.10
    :risk-quality      0.10}
   :tie-breakers [:liquidity :symbol]})
```

### 4.2 Candidate record

Each candidate should be represented as a plain map. Separate raw observations from normalized features and final output fields.

```clojure
{:symbol "BTC"
 :asset-class :crypto
 :price 0.0
 :change-24h-pct 0.0
 :observed-at "2026-01-01T00:00:00Z"
 :raw
 {:return-4h nil
  :return-24h nil
  :return-7d nil
  :benchmark-return-24h nil
  :volume-ratio nil
  :average-daily-notional nil
  :spread-bps nil
  :realized-volatility nil}
 :features
 {:momentum nil
  :relative-strength nil
  :volume-accel nil
  :trend-confirm nil
  :liquidity nil
  :risk-quality nil}
 :eligible? false
 :exclusion-reasons []}
```

`nil` is intentional in this example. A production run must populate or explicitly reject missing inputs; it must not coerce missing values to zero.

### 4.3 Composite score function

```clojure
(defn composite-score
  [weights features]
  (reduce-kv
    (fn [total feature weight]
      (+ total (* weight (double (get features feature 0.0)))))
    0.0
    weights))
```

Before calling this function, validate that all six feature scores are numeric and within `[0, 100]`. In production, fail closed on missing feature values rather than relying on the example default.

A deterministic selection pipeline:

```clojure
(defn rank-candidates
  [candidates {:keys [weights selection-count]}]
  (->> candidates
       (filter :eligible?)
       (map (fn [candidate]
              (assoc candidate :score
                     (composite-score weights (:features candidate)))))
       (sort-by (juxt (comp - :score)
                      (comp - #(get-in % [:features :liquidity]))
                      :symbol))
       (take selection-count)
       vec))
```

The exact sort key may need adjustment for the Clojure runtime's comparator semantics. The intended ordering is score descending, liquidity score descending, symbol ascending.

## 5. JSON-shaped schema contract

A JSON Schema implementation should validate at least:

- `symbol`: non-empty string.
- `observedAt`: ISO-8601 timestamp.
- `price`: positive number.
- `change24hPct`: number.
- Every normalized feature: number in `[0, 100]`.
- `eligible`: boolean.
- `exclusionReasons`: array of strings.
- `score`: number in `[0, 100]`, present only after successful feature validation.

The ranking config should validate that weights are non-negative and sum to 1 (within a small floating-point tolerance), and that `selectionCount` is a positive integer.

## 6. Poll payload and display convention

The ranking engine returns structured candidates. The Polly adapter converts each candidate into one choice string. Do not mix live values into the fixed exercise. For now use an unmistakably static placeholder format:

`BTC | price: pending | 24h: pending`

When live data is integrated later, the display convention should be:

`BTC | $67,420 | +2.4%`

The price and percentage are presentation metadata. They do not change the ranking formula directly. Use one consistent currency/quote unit for a given poll. Include the observation timestamp in the poll question or description so participants know when the snapshot was captured.

Suggested poll question:

`Which asset presents the most interesting opportunity right now?`

Suggested choice settings for the first exercise:

- Multiple choice: enabled only if the desired question is “which assets interest you?”; disabled if the question is “what is your single strongest pick?”
- Allow voters to add options: disabled, because the engine owns the candidate set.
- Anonymous voting: select according to the channel's preference.
- Comments: optional; enable only if qualitative reasons are useful.
- Each run creates a **new poll**; never overwrite the prior snapshot.

For a clean preference signal, the default should be **single choice**. If participants are expected to nominate several attractive assets, explicitly switch to multiple choice and interpret results as multi-select preference rather than a single winner.

## 7. Poll snapshot and historical records

Persist each poll run independently, including:

- `pollRunId`
- `createdAt` and `observedAt`
- `rankingConfigVersion`
- Fixed-universe identifier or universe snapshot
- All eligible candidate scores and ranks
- Selected ten symbols
- Display price and 24-hour change, when available
- Polly poll identifier and Slack channel identifier
- Poll settings and publish status
- Vote results and result-retrieval timestamp

Store all scored candidates, not only the ten published options. This allows later review of near misses, ranking stability, and whether the system consistently excludes an asset before it becomes interesting.

Do not use poll votes as a direct substitute for market performance. Votes measure participant preference. Market returns measure what happened afterward. These are separate outcomes and should be analyzed separately.

## 8. Evaluation plan

When historical and live data are introduced, evaluate the ranking model using a walk-forward process:

1. Calculate ranks using only information available at each historical timestamp.
2. Measure forward returns over pre-defined horizons (for example, 4h, 24h, and 7d).
3. Compare top-ten performance against the eligible universe and a simple benchmark.
4. Track volatility, maximum adverse excursion, turnover, and concentration by asset family.
5. Check whether high scores are associated with better risk-adjusted outcomes, not just larger upside outliers.
6. Change weights only after recording the old configuration and testing the new one out of sample.

Avoid look-ahead bias: a ranking at time `t` must never use data published after `t`. Include fees, spreads, and realistic execution assumptions when evaluating returns.

## 9. Polly integration boundary

For this phase, Polly is the publishing and voting interface, not the ranking engine.

Required adapter operations:

1. Create a new poll from a ranked list of choice strings.
2. Record the returned Polly poll ID and Slack destination.
3. Retrieve results for that specific poll.
4. Store results alongside the corresponding ranking snapshot.

The scheduler, live candidate churn, data provider selection, and exact API/MCP implementation are deliberately deferred. Polly's precise choice limits, formatting support, scheduling behaviour, and result response shape must be verified against the connected app/API before implementation. Do not assume that a visual “category” column exists in the API if the choice model only accepts text.

## 10. Current fixed exercise state

- Universe: ten selected symbols listed in section 2.
- Selection: fixed, no live re-ranking.
- Price and percentage change: pending placeholders, not fabricated.
- Poll cadence: intended four-hour workflow, but not activated by this document.
- Publishing: create a new poll each run.
- Dynamic churn: deferred to a separate design conversation.
- Ranking weights: initial specification, subject to historical calibration.

This creates a stable test fixture for working through Polly's actual create, publish, and results capabilities without mixing those questions with market-data engineering.

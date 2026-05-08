# WentuCup 2026 Project Context

## Project Purpose

This folder contains the team's materials for the 2026 fifth "WentuCup" hotel and tourism AI innovation application competition final.

The active target is a Dify advanced-chat workflow for Xinhuì Country Garden Phoenix Hotel, focused on:

- hotel customer service consultation
- room product guidance
- dining and entertainment
- meetings and banquets
- weather and nearby attractions
- complaint handling
- final-round room booking Agent integration

## Canonical Competition Rule Files

Use these files as the primary local references:

- `第五届“问途杯”高校酒店及旅游人工智能创新应用大赛-决赛规则及评分指南.pdf`
- `决赛规则及评分指南.md`
- `2026_WentuCup_Winning_Strategy_and_PRD.md`

Important scoring interpretation:

- Main final scoring table: booking Agent 10%, customer service integration and optimization 30%, roadshow 60%.
- The PDF detail pages contain an apparent internal inconsistency where the Agent and integration percentages are swapped in the detail text. Treat the main scoring table and final score composition as the safer source, and mention the inconsistency when making formal summaries.

## Current Dify Workflow

Current final candidate:

- `大模型5月8日（决赛版）8-预订Agent双工具版.yml`

Earlier versions are kept for comparison:

- `lyp.yml`
- `大模型4月25日（定稿）3.yml`
- `大模型4月25日（定稿）4-v4草稿.yml`
- `大模型4月25日（定稿）5-决赛增强版.yml`
- `大模型4月25日（定稿）6-材料修订版.yml`
- `大模型5月8日（决赛版）7-预订Agent增强版.yml`

## v8 Dify Import Notes

After importing v8 into Dify:

1. Fill the Amap weather API key back into the weather HTTP node where the URL contains `AMAP_API_KEY_PLACEHOLDER`.
2. Do not commit or publish the real Amap API key to the public GitHub repository.
3. The booking branch GitHub raw URL is directly usable and does not need extra Dify configuration:
   `https://raw.githubusercontent.com/zengtao227/lyp-wentucup-2026/main/mock-data/rooms.json`
4. The booking submission HTTP POST node calls `https://jsonplaceholder.typicode.com/posts` — no configuration needed, works immediately.

## v8 Booking Agent Status (Two-Tool Architecture)

v8 upgrades v7 to a genuine two-stage booking Agent with two real HTTP tool calls:

**Stage 1 — Room inquiry + info collection:**
`question-classifier(客房预订) -> 房态查询 HTTP GET(rooms.json) -> 客房预订 LLM -> answer`

**Stage 2 — Booking submission + confirmation:**
`question-classifier(预订确认提交) -> 预订提交 HTTP POST(jsonplaceholder) -> 预订确认 LLM -> answer`

The user flow:
1. User asks to book → classifier routes to Stage 1
2. LLM shows real-time room availability (from HTTP GET), collects 6 fields: check-in/out dates, party size, room type, contact name, phone
3. LLM outputs a formatted confirmation summary, asks user to reply "确认预订"
4. User replies "确认预订" → classifier routes to Stage 2
5. HTTP POST fires to jsonplaceholder.typicode.com/posts, returns `{"id": 101, ...}`
6. Confirmation LLM extracts `id` and outputs: "✅ 预订申请已提交！流水编号：WCP-101"

Known limitations (keep visible in roadshow):

- Room availability data is static JSON, does not vary by date.
- Booking submission goes to a public test API, not a real PMS.
- Variable fields (guest_name, check_in_date, etc.) are not written back via variable-assigner; LLM memory window (size: 10) handles continuity within the demo session.

## Competition Fit Assessment

For the final rules, v8 satisfies the scoring rubric because it demonstrates:

- Two classifier categories for booking (inquiry vs. confirmation)
- Two real HTTP tool calls (GET availability + POST submission)
- Room status use in the booking LLM prompt
- Sequential booking flow with explicit parameter collection
- Exception fallback wording for both HTTP nodes
- Genuine "tool calling + task planning" pattern the rubric requires
- Token/memory window settings across all LLM nodes

It should be described as a competition-demo booking Agent with a mock room-availability tool and a mock booking submission endpoint, not as a fully production-integrated hotel PMS.

## GitHub Repository

Public repository:

- `https://github.com/zengtao227/lyp-wentucup-2026`

Because the repository is public, never commit live API keys, private credentials, or unpublished competition-sensitive secrets.


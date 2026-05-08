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
- `主办方视频资料与MCP服务配置.md`
- `Dify平台工作流管理API研究记录.md`

Important scoring interpretation:

- Main final scoring table: booking Agent 10%, customer service integration and optimization 30%, roadshow 60%.
- The PDF detail pages contain an apparent internal inconsistency where the Agent and integration percentages are swapped in the detail text. Treat the main scoring table and final score composition as the safer source, and mention the inconsistency when making formal summaries.

## Current Dify Workflow

Current final candidate:

- `大模型5月8日（决赛版）v1.3-HTTPBodySchema修正版.yml`

Earlier versions are kept for comparison:

- `lyp.yml`
- `大模型4月25日（定稿）3.yml`
- `大模型4月25日（定稿）4-v4草稿.yml`
- `大模型4月25日（定稿）5-决赛增强版.yml`
- `大模型4月25日（定稿）6-材料修订版.yml`
- `大模型5月8日（决赛版）7-预订Agent增强版.yml`
- `大模型5月8日（决赛版）8-预订Agent双工具版.yml`
- `大模型5月8日（决赛版）v1.0-预订Agent双工具正式版.yml`
- `大模型5月8日（决赛版）v1.1-平台兼容修正版.yml`
- `大模型5月8日（决赛版）v1.2-DifySchema修正版.yml`

## v1.3 Dify Import Notes

After importing v1.3 into Dify:

1. Fill the Amap weather API key back into the weather HTTP node where the URL contains `AMAP_API_KEY_PLACEHOLDER`.
2. Do not commit or publish the real Amap API key to the public GitHub repository.
3. The booking branch GitHub raw URL is directly usable and does not need extra Dify configuration:
   `https://raw.githubusercontent.com/zengtao227/lyp-wentucup-2026/main/mock-data/rooms.json`
4. The booking submission HTTP POST node calls `https://jsonplaceholder.typicode.com/posts` — no configuration needed, works immediately.
5. The official-looking MCP SSE configs from organizer video extraction are archived separately in `主办方视频资料与MCP服务配置.md`; v1.2 does not call them yet.
6. v1.1 fixes a Dify 1.9 import/runtime issue from v1.0: all `conversation_variables.id` values are now valid UUIDs. v1.0 used readable suffixes such as `guest-name`, which caused PostgreSQL UUID insertion errors and made the chat preview return no answer.
7. v1.2 fixes a Dify 1.9 runtime schema issue from v1.1: every LLM node now includes a `context` field, with `enabled: false` where no retrieval context is used.
8. v1.3 fixes a Dify 1.9 HTTP node schema issue from v1.2: the booking submission POST body type is now `json`, not the older/invalid `raw` value.

## v1.3 Booking Agent Status (Two-Tool Architecture)

v1.3 is the final candidate based on v1.2. It keeps the two-stage booking Agent with two real HTTP tool calls, tightens the confirmation routing, fixes Dify UUID compatibility for conversation variables, adds required disabled `context` fields to pure LLM nodes, and uses the Dify 1.9-compatible HTTP POST body type:

**Stage 1 — Room inquiry + info collection:**
`question-classifier(客房预订) -> 房态查询 HTTP GET(rooms.json) -> 客房预订 LLM -> answer`

**Stage 2 — Booking submission + confirmation:**
`question-classifier(预订确认提交) -> 预订提交 HTTP POST(jsonplaceholder) -> 预订确认 LLM -> answer`

The user flow:
1. User asks to book → classifier routes to Stage 1
2. LLM shows real-time room availability (from HTTP GET), collects 6 fields: check-in/out dates, party size, room type, contact name, phone
3. LLM outputs a formatted confirmation summary, asks user to reply "确认预订"
4. User replies "确认预订" or another explicit booking-confirmation phrase → classifier routes to Stage 2
5. HTTP POST fires to jsonplaceholder.typicode.com/posts with a structured booking payload, returns `{"id": 101, ...}`
6. Confirmation LLM extracts `id` and outputs: "✅ 预订申请已提交！流水编号：WCP-101"

Known limitations (keep visible in roadshow):

- Room availability data is static demonstration JSON, does not vary by check-in/check-out date.
- Booking submission goes to a public test API, not a real PMS.
- Variable fields (guest_name, check_in_date, etc.) are not written back via variable-assigner; LLM memory window (size: 10) handles continuity within the demo session.
- The structured POST payload is mainly for architecture demonstration. Because there are no parameter-extractor or variable-assigner nodes, fields such as `guest_name`, `check_in_date`, and `party_size` may be empty at runtime, and fallback labels such as "从上一轮预订信息确认摘要读取" may be sent literally.
- The confirmation LLM only receives the current user query such as "确认预订" plus the POST response. It relies on memory window context to recover the Stage 1 booking summary. Keep the live demo booking conversation within 8-10 turns so the confirmation summary remains inside the memory window.
- After importing into Dify, run one full booking flow and inspect the POST node runtime log. If empty payload fields are visually embarrassing for the roadshow, the real fix is adding parameter-extractor plus variable-assigner nodes before the POST call.
- For scoring, the important visible chain is still: classifier routes explicit booking confirmation -> POST tool executes -> HTTP response returns `id` -> confirmation LLM emits `WCP-[id]`.

## Competition Fit Assessment

For the final rules, v1.3 satisfies the scoring rubric because it demonstrates:

- Two classifier categories for booking (inquiry vs. confirmation)
- Two real HTTP tool calls (GET availability + POST submission)
- Room status use in the booking LLM prompt
- Sequential booking flow with explicit parameter collection
- Exception fallback wording for both HTTP nodes
- Genuine "tool calling + task planning" pattern the rubric requires
- Confirmation routing that avoids accidental submission from generic "确认" messages
- Token/memory window settings across all LLM nodes

It should be described as a competition-demo booking Agent with a mock room-availability tool and a mock booking submission endpoint, not as a fully production-integrated hotel PMS.

## GitHub Repository

Public repository:

- `https://github.com/zengtao227/lyp-wentucup-2026`

Because the repository is public, never commit live API keys, private credentials, or unpublished competition-sensitive secrets.

## Versioning Rule

When project files are updated, commit and push the change to the public GitHub repository so the competition materials remain versioned and recoverable.

Keep local system files such as `.DS_Store` out of commits. Do not commit real Amap keys, Dify service API keys, console cookies, or other credentials.

## Dify Platform API Notes

The platform runtime service API base URL is:

- `http://playground.v2.dossm.cn/v1`

This `/v1` API is for published app runtime calls such as chat/completion interaction. A service API key can invoke the app, but it is not enough to modify the workflow canvas or import/overwrite YAML.

The Dify web console page exposes the management-side API prefix in its HTML as:

- `data-api-prefix="/console/api"`
- `data-public-api-prefix="/api"`

Treat `/console/api` as the web console/internal management API used by the browser UI. It is not the same as `/v1`, and it normally requires an authenticated console session/cookies and any platform-specific CSRF/session requirements. Do not assume a published app service API key can call these management endpoints.

MCP server URLs are useful for external tool testing of a published app/workflow. They do not by themselves grant workflow editing permissions.

Current tested MCP URL for the imported v1.3 app:

- `http://playground.v2.dossm.cn/mcp/server/HaQaWvhvkC3VvFz5/mcp`

Observed result on 2026-05-08: MCP initialization, `tools/list`, and a simple `tools/call` with `你好` all succeeded. v1.3 fixed the prior v1.2 HTTP body schema error.

Custom AI Web App deployment is a frontend option. The documented environment variables (`NEXT_PUBLIC_APP_ID`, `NEXT_PUBLIC_APP_KEY`, `NEXT_PUBLIC_API_URL`) make a forked frontend call the published app through `/v1`; they do not provide workflow editing or YAML import capability.

Detailed workflow-management API research is recorded in `Dify平台工作流管理API研究记录.md`. In short: the real workflow management surface is `/console/api/*`, including draft fetch/save, DSL import/export, and publish endpoints. It requires console login state and edit permission; `/v1` service API keys and MCP URLs cannot edit workflows.

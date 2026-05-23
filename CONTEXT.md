# WentuCup Project Context

## 当前推荐导入版本

- Agent: `dify-workflows/决赛版-v4.2-Agent.yml`（主力版本，修复订单幻觉）
- Chatflow: `dify-workflows/决赛版-v5.1-Chatflow.yml`（单 Agent 节点挂载酒店客房预订 5 个正式 MCP 工具，支持多轮分批收集信息，后置 Code 节点拦截假订单号）
- Chatflow 旧版: `dify-workflows/决赛版-v3.9-Chatflow.yml`（38节点完整版，备用）

`v3.7-Chatflow` 保留为旧版结构备份（无正式 submitBooking 提交链路）。
`v3.8-Chatflow` 原为 Codex 修改版，已被意外覆盖无法恢复，不要使用当前文件。
`决赛版-v3.9-Chatflow` 是当前正式版本：基于 v3.7 结构，由 Claude Code 重建完整 submitBooking 链路。

v3.9 核心设计（含 v3.8 CONTEXT 中所有要求）：
- 触发逻辑数据驱动，不依赖关键词：parameter-extractor 从对话历史（memory window 10）提取到 roomCode + name + mobile，且 Code 节点在实时房态中成功匹配价格计划（status=ok），才调用 submitBooking。
- 客人说”确认预订”即可触发，因为 parameter-extractor 会从历史对话中找到已提供的 roomCode/name/mobile；直接发送”002 张三 13988888888”也能触发。
- 流程：getAvailableRoomsByDate → template-transform → parameter-extractor（提取 roomCode/number/name/mobile/email，不提取 rateCode/verifyId）→ Code 节点 `1779200000010`（从实时房态 JSON 确定 rateCode/verifyId/verifyIds，**同时将日期转为 YYYY-MM-DDT00:00:00.000+08:00**）→ if-else（status=ok AND mobile/name/date 非空）→ submitBooking 工具 → Code 节点 `1779200000014`（解析 JSON 提取 orderNo）→ if-else（orderNo 非空）→ 成功回复 Answer / 失败回复 Answer。
- 成功路径完全确定性：Code 节点从 submitBooking JSON 提取真实 orderNo，Answer 节点直接嵌入变量，不经过任何 LLM，杜绝幻觉。
- if-else false 分支（无提交条件）→ 客房预订 LLM（继续收集缺失信息）。
- 小程序码 Markdown 只在成功 Answer 节点（1779200000016）中输出，URL 单行闭合，无中文注入。

v3.9 的 `submitBooking` 参数中，`rateCode`、`verifyId`、`verifyIds` 由 Code 节点从同一次 `getAvailableRoomsByDate` 实时返回中按 `roomCode` 确定；不要让 LLM/Parameter Extractor 直接生成这些字段。`verifyId` 会随实时房态查询变化，错误组合会导致后台返回 `4704 指定预订价格计划错误`。
`submitBooking` 的日期字段使用 Code 节点输出的 `checkInDateISO` / `checkOutDateISO`（格式 `YYYY-MM-DDT00:00:00.000+08:00`）；`getAvailableRoomsByDate` 仍使用 `YYYY-MM-DD` 查询房态。2026-05-21 已通过 MCP 正式协议验证该 ISO 格式可成功生成真实订单 `3300020137`。
`checkInDateISO` / `checkOutDateISO` 是 MCP 接口提交格式，不代表客人实际办理入住/退房时间。对客成功回复不得直接展示 `submitBooking` 原始返回中的 `T00:00:00.000+08:00`，必须按知识库展示“14:00后办理入住、12:00前退房”。
若 Code 节点未能在实时房态中匹配到房型/价格计划，if-else 走 false 分支回客房预订 LLM，不抛异常，不调用 submitBooking。
若 `checkInDateISO` / `checkOutDateISO` 为空，Code 节点必须返回 `status=error`，if-else 不得调用 `submitBooking`，避免后台返回 `2996 日期/时间字符串格式错误`。
v3.9 不使用 Agent 节点；MCP 通过 Chatflow 的 Tool 节点直接调用。

`getAvailableRoomsByDate` 的房态数据在 `.json` 字段（array[object]），`.text` 字段为空字符串。客房预订 LLM、template-transform、Code 节点均须读 `1778843661327.json`，不得读 `1778843661327.text`。

更完整的历史记录见 `docs/CONTEXT.md`。

## 支付入口与命名约束

- 客房预订/支付入口固定为「小途乐订」小程序。
- 景区活动/门票入口固定为「小途乐游」小程序。
- 对客回复不得把「小途乐订」称为“酒店官方微信小程序”或“新会碧桂园凤凰酒店官方微信小程序”。
- 客房支付引导应说“请使用微信扫描下方小程序码，打开「小途乐订」小程序”。
- 当前图片是微信小程序码，网页版或 Dify 预览中请使用微信扫描；微信内打开时也可长按识别；它不是标准方形 QR Code。中文口语中“二维码”常泛指这类码，但为了避免混淆，项目内优先使用“小程序码”。
- 小程序码图片 Markdown 必须逐字使用：

```markdown
![微信扫描小途乐订小程序码](https://cdn.jsdelivr.net/gh/zengtao227/lyp-wentucup-2026-public-data@main/qrcode-xiaotuleding.png)
```

## 支付边界

- Bot 只能展示 `submitBooking` 返回的真实预订订单编号和支付引导，不得自行生成订单号或流水编号，不宣称支付成功。
- 不得说“预订成功”“已锁定房间”“短信已发送”“电子凭证已生成”“房号已预留”。
- 支付金额和支付状态以「小途乐订」小程序待支付页/订单记录为准。
- 对客支付引导不得提“演示账户”“虚拟余额”“¥20,000”等内部演示账户信息。
- 当前酒店 MCP 只暴露房态查询、房型详情、`submitBooking` 和提交失败帮助工具；没有付款核验或订单状态查询工具。因此 v3.9 可确保成功调用 `submitBooking` 后返回后台订单编号，但付款状态核验仍以「小途乐订」小程序和酒店房态后台为准。

## 宠物信息展示约束

- 只有用户主动提到宠物、狗、猫或带宠入住时，才询问或展示宠物政策。
- 用户未主动提宠物时，不得输出”未提及宠物信息””按无宠物入住处理””无宠物入住””默认无宠物”等任何宠物相关说明。

## v4.x Agent 系列设计说明

Chatflow 方案（v3.x）已停止迭代，转向 Agent-chat 模式（v4.x）。

v4.1 核心：基于 v3.6，将模型从 deepseek-v3 换为 qwen-plus（工具调用稳定性显著更好）；通过外部 API 工具（getHotelOverviewKnowledge 等）绕过 Dify agent-chat 不注入内部知识库的限制。

## v5.x Chatflow 设计说明

`决赛版-v5.0-Chatflow.yml` 已停止使用：该版本采用 Chatflow 内 Agent 节点提交预订。2026-05-23 测试日志显示 `tool_responses: []`，Agent 节点未调用 `getAvailableRoomsByDate` / `submitBooking`，却输出了模型编造的订单编号，后台查不到订单。因此 v5.0 不得作为决赛导入版本。

`v4.0 chatflow.yml` 可作为房态查询参考：它通过 `mcp_sse_call_tool` 连接 `mcp-server-booking.v4.test.dossm.cn/sse` 并使用 `teamid:234556`，已能查到真实房态。但 v4.0 仍用 Agent 自行决定提交，并混有 `bookings_post` / `submitBooking_post` 等预订单 API 工具，存在不调用真实 `submitBooking` 而生成假订单的风险。

`决赛版-v5.1-Chatflow.yml` 是当前 Chatflow 推荐版本：借鉴 v4.0 的单 Agent Chatflow 结构，但移除 `bookings_post` / `submitBooking_post` / `roomsavailable_get` 等预订单或模拟通路，只保留一个 Agent 节点，并在该 Agent 节点中挂载「酒店客房预订」5 个正式 MCP 工具：`getAvailableRoomsByDate`、`getAvailableRoomsByRoomTypeAndDate`、`getRoomDetailByRoomCode`、`getHotelHelpAfterSubmitBookingError`、`submitBooking`。用户可以分批提供姓名、手机号、日期、房型和间数；Agent 必须在每轮回复中整理已记录信息和缺失信息。确认预订后，Agent 必须重新查询 `getAvailableRoomsByDate` 并用同源 `rateCode` / `verifyId` / `verifyIds` 调用 `submitBooking`。Agent 后置 Code 节点只从 `<submit_booking_result>` 中的 `submitBooking` 原始 JSON 提取 `orderNo` 生成支付引导；如果 Agent 文本里出现订单号但没有 submitBooking JSON 证据，Code 节点会拦截并提示重新确认，避免 LLM 编造订单号。
v5.1 的确认轮规则：如果上一轮已经输出“📋 预订信息确认”，用户当前只回复“确认/确认预订/好的/可以/OK”等短确认语，Agent 必须立即调用 `getAvailableRoomsByDate` 并继续 `submitBooking`，不得再次输出确认摘要或再次要求用户确认。

## v3.9.2 Chatflow 设计说明

基于 v3.9，将分类7（客房预订）的双PE+双模板链路精简为单一 combined PE + 知识库检索注入 LLM。
**无需 Agent 策略插件，完全兼容 Dify 1.x。**

结构变化：
- 删除（4）：OLD_TMPL1（template-transform 订房参数）+ OLD_PE_DATES（PE dates）+ OLD_TMPL2（template-transform 提交参数）+ OLD_PE_BOOK（PE booking）
- 新增（3）：NEW_TMPL（简化 template-transform, 1779300000001）+ NEW_PE_ALL（合并 PE 提取全部7字段, 1779300000002）+ NEW_KB（知识库检索, 1779300000003）
- 修改：客房预订 LLM（1776900001000）启用 KB context 注入（variable_selector: NEW_KB.result），模型改为 qwen-plus
- FALSE 分支：11 节点 → 8 节点；TRUE 分支：13 节点 → 11 节点；净减 1 个节点

关键设计：
- NEW_PE_ALL（combined parameter-extractor）：从最近10轮对话历史中一次性提取 checkInDate/checkOutDate/roomCode/number/name/mobile/email 全部7字段
- 链路：time → NEW_TMPL → NEW_PE_ALL → getAvailableRoomsByDate → Code(价格匹配) → if-else(提交条件)
- FALSE 分支：IFELSE_SUBMIT(false) → NEW_KB → 客房预订 LLM（有房态数据 + KB 上下文）→ 客房预订回复
- TRUE 分支：IFELSE_SUBMIT(true) → submitBooking 链路（与 v3.9 相同）
- submitBooking 仍由 Code 节点确定性处理 rateCode/verifyId/orderNo，不经过 LLM

节点 ID 说明：1779300000001=NEW_TMPL, 1779300000002=NEW_PE_ALL, 1779300000003=NEW_KB（1779300000004/1779300000005 未使用，为旧 Agent 方案遗留）

v4.2 修复：解决 submitBooking 后 LLM 偶发幻觉订单编号（如 123456789）的问题。
- 根本原因：prompt 只说”替换为实际订单 ID”，未明确字段名，模型找不到时直接编造占位符。
- 修复方式：在 pre_prompt “第七步”中新增”订单编号强制提取规则”：
  - 明确 Observation 中的字段为 orderNo（纯数字，如 3300020137）
  - 严禁编造任何示例编号或占位符
  - 找不到 orderNo 时必须降级回复并引导联系前台，可调用 getHotelHelpAfterSubmitBookingError

# WentuCup Project Context

## 当前推荐导入版本

- Agent: `dify-workflows/决赛版（初赛改）-v3.6-Agent.yml`
- Chatflow: `dify-workflows/决赛版-v3.9-Chatflow.yml`

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
- 当前酒店 MCP 只暴露房态查询、房型详情、`submitBooking` 和提交失败帮助工具；没有付款核验或订单状态查询工具。因此 v3.9 可确保成功调用 `submitBooking` 后返回后台订单编号，但付款状态核验仍以「小途乐订」小程序和酒店房态后台为准。

## 宠物信息展示约束

- 只有用户主动提到宠物、狗、猫或带宠入住时，才询问或展示宠物政策。
- 用户未主动提宠物时，不得输出“未提及宠物信息”“按无宠物入住处理”“无宠物入住”“默认无宠物”等任何宠物相关说明。

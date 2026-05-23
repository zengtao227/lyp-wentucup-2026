# 彬彬有礼 · 酒店 AI 全链路客服系统开发迭代实录

## Meta
- audience: 企业 IT 专业人士
- goal: 10 分钟技术分享，展示从 Chatflow 到 Agent 的工程迭代过程
- thesis: 在 Dify 平台上，通过 74 次提交、三个开发阶段，从显式编排演进至 ReAct Agent + 官方 MCP 自主推理，构建出酒店 AI 全链路客服系统。
- slide-count: 11
- speaker-notes: true

## Design Contract
- Structure lock: swiss-klein-blue
- Color layer (Arctic Study · 北极研究蓝，覆盖 lock 默认蓝):
  - background: #f0f4f8
  - primary text: #0a2540
  - accent: #1a4480
  - muted: #52748c
  - card bg: #dde8f5
  - deep block bg: #0a2540 (反白用 #f0f4f8)
- Typography: Noto Sans SC（中文）+ IBM Plex Sans（英文/数字）
- Must keep: 全程直角 borderRadius=0，1px 细线分割，无阴影无渐变，字号强烈对比
- May adapt: 版式族按内容调整（S01 Cover、S08 Duo Compare、S11 Timeline、S18 Why Now）
- Must avoid: 圆角、阴影、渐变、伪造数据、发明 logo

---

## Slide 1 — 封面

**Claim**: 彬彬有礼——用 AI 重构酒店服务链路，74 次迭代打磨决赛方案。

**Proof object**: 全屏封面，项目名 + 副标题 + 关键数字徽章

**Layout**: Cover full-bleed，三行文字居中

**Content**:
- 大标题：彬彬有礼
- 副标题：酒店 AI 全链路客服系统 · 开发迭代实录
- 数字徽章：74 commits · 3 阶段 · 13 工具 · 5 个知识库
- 底部：第五届"问途杯"高校酒店及旅游 AI 创新大赛 · 决赛作品

**Speaker notes**:
大家好。今天分享的是我们参加第五届问途杯竞赛过程中，从零到交付一套酒店 AI 全链路客服系统的工程迭代实录。这套系统叫"彬彬有礼"，部署在 Dify 平台上，服务场景是新会碧桂园凤凰酒店。我想重点分享的不是最终结果，而是整个开发过程中我们做了哪些关键决策，踩了哪些坑，以及每次迭代背后的技术逻辑。

---

## Slide 2 — 业务背景与系统目标

**Claim**: 酒店数字客服的三大结构性痛点驱动了这套系统的设计目标。

**Proof object**: 痛点→目标 对照图

**Layout**: 两列，左侧三个痛点，右侧三个系统目标

**Content**:
痛点：
1. 高峰期响应延迟 — 人工客服无法 7×24 在线，夜间服务断层
2. 口径不一致 — 酒店业务分散，不同人员回答差异大
3. 重复咨询占用人力 — 80% 问题可由知识库直接回答

系统目标：
- 一个入口：咨询 → 查房态 → 预订申请 → 小程序支付引导
- 一个知识源：5 域结构化知识库，统一事实来源
- 一套 Agent：MCP 工具链完成房态查询 + 预订提交全链路

**Speaker notes**:
我们先看这套系统要解决什么问题。酒店客服有三个结构性痛点：第一，全天候响应问题，夜间没有人工，用户热度会快速流失；第二，口径一致性问题，酒店信息分散在不同人员那里，AI 回答要先解决事实统一的问题；第三，重复咨询效率问题，前台精力被大量简单问题占用。因此我们的设计目标是：一个入口打通完整服务链路，让用户不需要切换渠道就能完成从咨询到预订的全过程。

---

## Slide 3 — 最终系统架构

**Claim**: 最终架构由四层组成：意图路由、知识检索、工具执行、支付引导。

**Proof object**: 系统架构图（四层）

**Layout**: 架构图居中，四个水平层叠

**Content**:
```
用户输入
    ↓
[意图识别层]  问题分类器 (6分类) + ReAct Agent 自主路由
    ↓
[知识检索层]  5域知识库 + Reranker + top_k=4
[工具执行层]  14个 MCP 工具：酒店预订×5 + 票务×4 + 时间×4 + 天气×1
    ↓
[响应生成层]  DeepSeek-V3 (temp=0.1) + 防幻觉规则
    ↓
[支付引导层]  小途乐订（客房）/ 小途乐游（景区票务）小程序
```

技术栈：
- 平台：Dify (问途AI Playground)
- 主力模型：DeepSeek-V3
- 检索增强：RAG + gte-rerank-v2 Reranker
- 工具协议：MCP SSE (mcp-server-booking + mcp-server-travel)
- 部署：问途AI Playground / Dify 1.9

**Speaker notes**:
这是最终系统的四层架构。最上层是意图路由，支持 Chatflow 6路分类和 Agent 自主判断两种模式。第二层是知识检索，5个域的知识库加上 Reranker 重排序。第三层是工具执行，14个 MCP 工具覆盖预订、票务、时间、天气。最底层是支付引导，通过小程序完成实际支付，AI 只负责引导，不声称支付成功。这张图是我们迭代了近三周才稳定下来的最终状态，后面我会讲我们是怎么一步步走到这里的。

---

## Slide 4 — 核心架构决策：Chatflow vs. Agent

**Claim**: Chatflow 和 Agent 不是竞争关系，而是稳定性与智能化的互补双轨。

**Proof object**: 对比决策表 + 最终选择

**Layout**: 三列对比表（特性 / Chatflow / Agent）+ 底部结论

**Content**:

| 维度 | Chatflow（导演制） | Agent（主管制） |
|------|-----------------|--------------|
| 控制模式 | 显式节点连线，硬路由 | ReAct 自主推理，软约束 |
| 对话自然度 | 一般，程式化跳转 | 高，可随时被打断 |
| 开发难度 | 高（复杂逻辑图） | 低（核心在 System Prompt） |
| 工具调用 | 固定节点顺序 | 模型自主决定调用时机 |
| 异常处理 | 需预设所有异常分支 | 模型自主降级 |
| 适用场景 | 演示稳定性要求极高 | 追求"智能化"表现 |

最终决策：**双轨并行** — Chatflow 稳控高频问答，Agent 处理预订工具链

**Speaker notes**:
这是整个项目最关键的技术决策。Chatflow 和 Agent 在 Dify 里是两种完全不同的范式。Chatflow 像导演制，你事先写好每一步的剧本，逻辑清晰但死板；Agent 像主管制，你给它工具箱和 SOP，让模型自己判断先做什么。我们最终选择双轨并行：知识问答走 Chatflow，确保稳定；预订任务走 Agent，确保智能。这个决策贯穿了整个项目的架构演进。

---

## Slide 5 — 第一阶段：Chatflow 工具链构建（v1.0 → v1.12）

**Claim**: 第一阶段用 13 个版本完成了从无到有的工具链构建，分类器从 6 路扩展到 13 路。

**Proof object**: 版本时间线 + 关键里程碑

**Layout**: 横向时间线 + 四个关键版本节点

**Content**:

时间线（2026-05-08 → 05-11）：

**v1.0** (05-08) — 两工具预订 Agent
- GET rooms.json（房态查询）+ POST jsonplaceholder（预订提交）
- 6个分类器：酒店概况/客房/餐饮/会议/天气/投诉
- ⚠️ 问题：Dify UUID 兼容性、HTTP Schema 错误

**v1.7** (05-09) — 四工具双业务
- 新增景区票务分支（GET tickets.json + POST）
- 支付边界拆分：小途乐订（客房）vs 小途乐游（景区）

**v1.9** (05-09) — 私有化迁移
- 主仓库转为私有 → mock 数据迁移至 public repo
- 高德天气 API key 内嵌（一次性竞赛用）

**v1.12** (05-11) — 13分类器完整版
- 新增：支付确认 + 取消预订/退款
- 分类器从 6 路 → 13 路
- 添加酒店/景区知识库

**Speaker notes**:
第一阶段从5月8号开始，持续到11号，用了大约4天，13个版本。起点是 v1.0，实现了最基础的两工具预订链路：一个 GET 查房态，一个 POST 提交预订。这个阶段暴露了大量 Dify 平台兼容性问题，比如对话变量必须用 UUID 格式，HTTP 节点 Body 类型必须是 json 不能用 raw。到 v1.12 时，分类器从最初的 6 路扩展到 13 路，已经是一个功能完整的 Chatflow 系统了。

---

## Slide 6 — 工程挑战攻坚

**Claim**: 四类工程挑战，每一类都在平台文档之外，只能靠运行时日志定位。

**Proof object**: 问题→根因→解法 卡片

**Layout**: 2×2 卡片网格

**Content**:

**挑战 1：Dify UUID 兼容性**
- 症状：chat 预览无返回，后台 PostgreSQL 插入报错
- 根因：conversation_variables 的 id 必须是合法 UUID，不能用 "guest-name" 这样的字符串
- 解法：v1.1 全量替换为合规 UUID 格式

**挑战 2：LLM Schema 兼容**
- 症状：v1.1 导入后部分节点无输出
- 根因：Dify 1.9 要求每个 LLM 节点必须有 `context` 字段（即使 disabled）
- 解法：v1.2 所有纯 LLM 节点补充 `context: {enabled: false}`

**挑战 3：预订确认幻觉**
- 症状：确认 LLM 声称"已发送确认短信"、"已生成电子凭证"
- 根因：Prompt 未明确约束 LLM 不能声明系统尚未实现的行为
- 解法：v1.11 显式列出禁止声明的操作列表

**挑战 4：支付边界混淆**
- 症状：景区票务确认指向"小途乐订"（酒店专用）
- 根因：两个支付小程序职责未在 Prompt 中明确区分
- 解法：v1.8 分别在客房和票务 LLM 中硬编码对应小程序名

**Speaker notes**:
这一页讲的是第一阶段踩的四类坑，每一类都没有文档，只能从运行时日志里自己排查。第一个是 UUID 兼容性，Dify 对话变量 id 字段底层是 PostgreSQL UUID 类型，传字符串会直接报错，但报错信息非常隐晦。第二个是 LLM Schema，Dify 1.9 对 context 字段有强制要求，即使不用也要显式声明为 disabled。第三个是预订确认幻觉，这是 LLM 的通病，解法是在 Prompt 里显式枚举禁止的输出。第四个是支付边界，两个小程序职责不同，Prompt 里必须明确区分。

---

## Slide 7 — 关键转折：放弃 Mock，MCP 优先

**Claim**: 用 GitHub jsDelivr 做工具端点在竞赛网络环境下有致命风险，必须切换至官方 MCP SSE。

**Proof object**: 风险分析表 + MCP 架构对比图

**Layout**: 左右两栏，左侧"之前"，右侧"之后"

**Content**:

**之前（v1.12）：HTTP Mock 方案**
```
Dify → jsDelivr CDN (GitHub) → rooms.json
Dify → jsonplaceholder.typicode.com → mock POST
```
风险：
- GitHub / jsDelivr 在大陆网络可能 DNS 污染或封锁
- jsonplaceholder 是公共测试 API，不代表真实集成能力
- 评分标准要求"实时房态查询"，静态 JSON 不符合

**之后（v2.8+ / v3.2）：官方 MCP SSE**
```
Dify → mcp-server-booking.v4.test.dossm.cn/sse → 真实 PMS
Dify → mcp-server-travel.v4.test.dossm.cn/sse  → 真实票务
```
优势：
- 同一平台内网，网络稳定
- 真实工具调用，满足评分要求
- 工具名称符合 API 规范：`getAvailableRoomsByDate`、`submitBooking`

**Speaker notes**:
这是项目里最重要的架构决策之一。我们在 5 月 11 号意识到，用 GitHub CDN 和 jsonplaceholder 做工具端点，在竞赛现场有致命风险——大陆网络对 GitHub CDN 可能有 DNS 干扰，而且 jsonplaceholder 只是公共测试 API，根本体现不出真实的工具集成能力。评分标准里明确要求"实时房态查询"，静态 JSON 文件在评委眼里就是假的。所以我们当时做了一个清晰的决定：保留 mock 版本作为离线备份，所有生产路径切换至官方 MCP SSE 端点。这个决定影响了后续所有版本的架构。

---

## Slide 8 — 第二阶段：Agent 自主推理（v2.0 → v2.8）

**Claim**: v2.0 引入 ReAct 策略和 14 工具 MCP 集成，Agent 可自主处理完整预订链路。

**Proof object**: Agent 架构图 + v2.x 迭代表

**Layout**: 上方架构图，下方版本对比表

**Content**:

**v2.0 核心架构**（2026-05-12）：
- 策略：ReAct（Reasoning + Acting），max_iteration = 5
- 模型：DeepSeek-V3，temperature = 0.1
- 工具集（14个）：
  - 酒店预订×5：getAvailableRoomsByDate、getAvailableRoomsByRoomTypeAndDate、getRoomDetailByRoomCode、submitBooking、getHotelHelpAfterSubmitBookingError
  - 景区票务×4：getTravelMerchandiseViews4Ticket/Group、ViewById、submitPurchase
  - 时间×4：current_time、localtime_to_timestamp、weekday、timezone_conversion
  - 天气×1：weather

**迭代优化**：

| 版本 | 关键改进 |
|------|---------|
| v2.1 | 13种房型代码映射（001-013），智能引导不存在房型 |
| v2.2 | 修复工具调用输出变量错误 |
| v2.5 | 禁止思维链泄露，修复日期/间数收集 |
| v2.6 | 支付二维码嵌入对话 |
| v2.7 | 三路意图分类架构 + 天气分支 |
| v2.8 | agent-node 调用 MCP（但 Chatflow 导入兼容性问题） |

**Speaker notes**:
从5月12号开始，我们启动了第二阶段，核心是从 Chatflow 切换到 Agent 模式。v2.0 是质的飞跃：引入 ReAct 策略，模型可以自主决定调用哪个工具、什么时候调用、调用多少次。工具数量从之前的 4 个增加到 14 个。v2.1 解决了一个很实际的问题：用户说"我要标准间"，但酒店没有标准间，Agent 要能优雅地引导，不能直接报错。v2.5 解决了思维链泄露问题，之前模型会把自己的推理过程打印出来，用户体验很差。到 v2.8 时，我们尝试用 agent-node 调用 MCP，但发现 Chatflow 模式下 agent-node 的导入兼容性有问题。

---

## Slide 9 — 第三阶段：决赛双轨制（v3.0 → v3.5）

**Claim**: 决赛版采用 Chatflow + Agent 双轨并行，官方 MCP 接入，OpenWeather 替换 Amap HTTP。

**Proof object**: 双轨架构对比 + v3.x 时间线

**Layout**: 双栏展示两条轨道，底部时间线

**Content**:

**双轨架构**：

| 轨道 | 方案 | 负责场景 |
|------|------|---------|
| Chatflow v3.x | 显式编排，6路问答 + 第7路预订 Agent 分支 | 知识问答、餐饮、会议、投诉 |
| Agent v3.x | ReAct + 14工具 + 官方 MCP | 预订、票务、复杂多轮对话 |

**v3.x 关键版本**（2026-05-15~17）：

- **v3.0** (05-15)：决赛版，基于初赛 Chatflow 新增预订 Agent 分支；移除 agent-node，改用 http-request+llm 确保导入成功
- **v3.1** (05-15)：OpenWeather 插件替换 Amap HTTP 节点，避免 API Key 管理风险
- **v3.2** (05-15)：订房分支正式接入官方 MCP `getAvailableRoomsByDate`，设置 `teamId: 234556`
- **v3.3~v3.5** (05-17)：知识库绑定优化、支付引导修正、预订确认路由收紧

**Speaker notes**:
第三阶段是5月15号到17号，最后冲刺阶段。这时候我们有了清晰的双轨策略：Chatflow 版负责稳定的知识问答，Agent 版负责智能的预订交互。两个版本并行维护，可以根据演示场景灵活切换。最关键的里程碑是 v3.2，我们正式接入了官方 MCP 端点，用 `getAvailableRoomsByDate` 替换了之前的 mock HTTP GET。同时设置了 teamId: 234556，这是平台用来识别我们团队的业务路由标识。另一个重要改动是 v3.1，把高德地图 HTTP 节点换成了 OpenWeather 插件，降低了 API Key 泄露的风险。

---

## Slide 10 — 迭代全景：74 commits / 3 阶段 / 5 个架构里程碑

**Claim**: 从 Initial Archive 到决赛定稿，74 次提交横跨三个工程阶段。

**Proof object**: 可视化时间线图

**Layout**: 水平时间线，三色标注三个阶段，五颗星标注里程碑

**Content**:

```
05-08                05-11           05-13        05-15           05-19
  │                    │               │             │               │
  ●─────────────────────●───────────────●─────────────●───────────────●
  │                    │               │             │               │
[阶段1: Chatflow 工具链]  [架构决策]   [阶段2: Agent] [阶段3: 决赛双轨]  [路演]
  │                    │               │             │
 ★ v1.0              ★ MCP优先       ★ v2.0        ★ v3.2
 2工具预订链路         放弃 mock       ReAct Agent   官方MCP接入
                     ★ v1.12
                     13分类器
```

**数据**：
- 总提交：74 次（2026-05-08 至 05-19，12天）
- feat 提交：21 次 | fix 提交：32 次 | docs 提交：12 次 | refactor 提交：9 次
- 工作流版本：v1.0~v1.12（Chatflow）+ v2.0~v2.8（Agent）+ v3.0~v3.5（决赛双轨）
- 最终文件：决赛版（初赛改）-v3.5（Chatflow + Agent 双版本）

**Speaker notes**:
这张图是整个项目的全景视图。12天，74次提交，三个明确的工程阶段。从 commit 类型分布来看，fix 提交是 feat 的 1.5 倍，这说明平台适配和 Prompt 调优占了大量工作。五个架构里程碑是：v1.0 建立工具链基础，v1.12 完成 13 路分类器，MCP 优先决策是架构转型点，v2.0 完成 Agent 模式升级，v3.2 正式接入官方 MCP。每个里程碑背后都有明确的问题驱动。

---

## Slide 11 — 工程收益与展望

**Claim**: 这套迭代模式验证了在低代码平台上快速构建生产级 AI 服务的可行路径。

**Proof object**: 工程经验总结 + Multi-Agent 规划图

**Layout**: 上方三列收益，下方展望路线图

**Content**:

**三点工程收益**：

1. **平台适配策略**：Dify 平台的 Schema 约束、变量类型、节点兼容性问题，只有通过逐版运行时验证才能发现——文档滞后于平台版本。建议：小步快跑，每次只改一个变量，保留历史 YAML 快速回滚。

2. **LLM 可靠性设计**：幻觉不能靠模型能力解决，需要在 Prompt 层面显式枚举禁止的输出类别；支付类场景必须设计"Bot 只引导，不声明"的边界原则。

3. **工具链选型原则**：外部 HTTP mock 满足本地开发，但不满足生产可靠性。竞赛/生产环境应优先使用平台内网的 MCP 服务，避免外部网络依赖。

**未来展望（Multi-Agent 规划）**：

```
当前：单 Agent 全能型
       ↓
v2.2：情绪感知 + Upsell 触发
       ↓
v3.0 愿景：多 Agent 协同
  ┌─── 智能前台 Agent
  ├─── 销售顾问 Agent（Upsell）
  ├─── 行程助手 Agent
  └─── 售后管家 Agent
```

**Speaker notes**:
最后总结三点工程收益。第一，平台适配没有捷径，只有运行时验证，保持快速迭代和历史版本可回滚是关键。第二，LLM 可靠性必须在设计层面解决，幻觉问题靠更好的模型解决不了，要在 Prompt 里明确约束。第三，工具链选型要考虑部署环境，开发时的 mock 方案在生产/竞赛环境可能成为单点故障。展望来看，我们下一步想做多 Agent 协同架构，把当前的单个全能 Agent 拆分为专业化的 Agent 集群，分别负责前台、销售、行程和售后。谢谢大家，有问题欢迎交流。

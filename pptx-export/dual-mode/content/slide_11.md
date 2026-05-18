# 双模架构：核心差异对比
⚙️ Chatflow 工作流（本次演示采用）
- 分类器强制走 KB 检索，准确率 100%
- 内嵌 MCP 预订节点，咨询与订房一体化
- `memory window = 10` 保证多轮连贯
- 可控、稳定，适合 7×24 客服场景
🤖 Agent 智能体（备选，非演示）
- ReAct 自主推理 + MCP 工具动态调用
- 原生局限：无法强制调用 KB，回答偶有偏离
- 自研解法：KB 内容 JSON 外部化，封装自定义工具，Agent 强制调用获取知识
- `max_iteration = 5` 防止死循环
KB 检索 Chatflow 分类器强制 ✅ Agent 自定义工具方案 ✅
预订能力 Chatflow 节点内嵌 Agent ReAct 自主
稳定性 Chatflow 高 ✅ Agent 中 ⚠️
本次演示 采用 Chatflow Agent 备用
团队自研 KB 外部化方案，彻底解决 Agent 原生 KB 调用限制——双模架构互为备份，灵活应对各类场景，真正实现 OPC 极简运营
SLIDE 12 — 预订 SOP 流程
══════════════════════════════════════════ -->
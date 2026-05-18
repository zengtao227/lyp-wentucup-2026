# 关键参数 · 每一项都有原因
模型 & 检索配置
参数  值  原因
|:---|:---:|:---|
`temperature`  0.1  极低随机性，答案稳定可复现
`top_k`  4  精准召回，不浪费 context
`reranker`  启用  复杂政策问题准确率关键
`max_iteration`  5  防止 Agent 工具死循环
`memory_window`  10  保留足够上下文不过量消耗
System Prompt 四大原则
🈯 <strong>回复规范</strong>：中文直接开始，禁止技术标签泄露
📅 <strong>日期格式</strong>：工具传参强制 <code>YYYY-MM-DD</code>
🏨 <strong>房型代码表</strong>：13 种房型代码内嵌，工具调用零歧义
📚 <strong>知识库优先</strong>：引用政策时完整转述，禁止省略细节
SLIDE 15 — 止损机制
══════════════════════════════════════════ -->
# 版本更新日志

## v2.1 (2026-05-13) - 智能引导增强版

### ✨ 新增功能

1. **智能房型引导**
   - 当客人提到不存在的房型（如"标准间"、"商务房"）时，Agent 会：
     - 礼貌告知该房型不存在
     - 主动询问客人需求（大床/双床？预算范围？）
     - 智能推荐最合适的房型
   - 示例：客人说"标准间" → Agent 推荐"高级大床房"或"高级双床房"

2. **结构化房型对照表**
   - 按类别分组：大床房系列、双床房系列、套房系列、特色房型
   - 每个房型标注定位（入门级/升级版/高端）
   - 特色房型标注适用场景（蜜月套房、卡通亲子房）

3. **增强的订房 SOP**
   - 新增"第一步：理解客人需求并引导选择房型"
   - 三种场景智能处理：
     - 房型存在 → 直接查询
     - 房型不存在 → 智能引导
     - 没说房型 → 主动询问

### 🔧 技术优化

1. **房型代码映射**
   - 明确要求调用 MCP 工具时必须使用房型代码（如 "001"）
   - 严禁传中文名称（如 "高级大床房"）
   - 修复了之前 roomType 参数传错导致查询失败的问题

2. **API 密钥管理**
   - 创建 `.env.local` 文件存储敏感信息
   - 更新 `.gitignore` 防止密钥泄露
   - 创建 `API_USAGE_GUIDE.md` 使用指南

### 📝 文档更新

- 新增 `API_USAGE_GUIDE.md` - API 使用指南
- 新增 `CHANGELOG.md` - 版本更新日志
- 更新 `.gitignore` - 增加敏感文件过滤

---

## v2.0 (2026-05-12) - Agent 模式首发版

### ✨ 核心功能

1. **Agent 自主推理模式**
   - 采用 ReAct 策略，最大迭代次数 3 次
   - 使用 DeepSeek-V3 模型（temperature: 0.1）
   - 自主判断工具调用时机和顺序

2. **MCP 工具集成**
   - 酒店客房预订工具（5个）：
     - getAvailableRoomsByDate
     - getAvailableRoomsByRoomTypeAndDate
     - getRoomDetailByRoomCode
     - submitBooking
     - getHotelHelpAfterSubmitBookingError
   - 景区票务预订工具（4个）：
     - getTravelMerchandiseViews4Ticket
     - getTravelMerchandiseViews4Group
     - getTravelMerchandiseViewById
     - submitPurchase
   - 时间工具（4个）：current_time, localtime_to_timestamp, weekday, timezone_conversion
   - 天气查询工具（1个）：weather

3. **知识库配置**
   - 集成 5 个知识库数据集
   - 检索模式：multiple
   - top_k: 4
   - 未启用 reranking（可根据需要开启）

4. **防死循环机制**
   - 单次调用原则：同一工具在查询条件未变化时最多调用一次
   - 严禁重复重试：工具返回空结果后不得机械重复调用
   - 渐进式查询：优先尝试简单查询，失败后再询问补充条件

5. **TeamId 配置**
   - 正确配置 teamId: 234556
   - 优先使用 teamId 调用工具
   - 如果返回为空，尝试不带 teamId 参数再次调用

### 🎯 业务流程

1. **酒店订房 SOP**
   - 第一步：查询房态与价格
   - 第二步：展示房型详情
   - 第三步：核实预订信息
   - 第四步：提交预订

2. **景区票务 SOP**
   - 获取门票列表
   - 展示详情
   - 提交购买

### 📋 用户输入表单

- 宾客姓名（guest_name）
- 入住/游玩日期（checkin_date）

---

## v1.0 (2026-05-12 之前) - Chatflow 模式

### 核心功能

1. **问题分类器**
   - 6 个分类：酒店基础信息、客房产品体系、餐饮娱乐配套、会议宴会服务、周边旅游资源、高频问题库
   - 使用 Qwen-Turbo 模型进行分类

2. **知识检索**
   - 6 个独立的知识检索节点
   - 部分节点启用 Reranking（gte-rerank-v2）
   - top_k: 4

3. **多模型路由**
   - ERNIE-3.5-128k：酒店基础知识、高频问题库
   - Qwen-Plus：客房产品
   - DeepSeek-V3：餐饮娱乐、会议宴会、周边旅游

### ⚠️ 已知问题（已在 v2.0 中修复）

1. 直接回复 4：输出变量错误（reasoning_content）
2. 直接回复 5：输出变量错误（usage）
3. 知识检索 3：query 变量错误（conversation_id）
4. 知识检索 4：query 变量错误（class_name）
5. 所有 LLM 节点：memory.window.enabled: false
6. 客房产品节点：completion_params 为空
7. 整体工作流：opening_statement 为空
8. 整体工作流：speech_to_text 关闭

---

## 版本对比

| 特性 | v1.0 (Chatflow) | v2.0 (Agent) | v2.1 (Agent+) |
|------|----------------|--------------|---------------|
| 模式 | 显式编排 | 自主推理 | 自主推理 |
| 控制力 | 硬控制 | 软控制 | 软控制 |
| 自然度 | 一般 | 高 | 高 |
| 工具调用 | 无 | 14个工具 | 14个工具 |
| 房型引导 | 无 | 无 | ✅ 智能引导 |
| 防死循环 | 无 | ✅ 有 | ✅ 有 |
| TeamId | 无 | ✅ 234556 | ✅ 234556 |
| 房型代码 | 无 | 无 | ✅ 对照表 |

---

## 下一步计划

### v2.2 (计划中)

- [ ] 增加情绪感知功能
- [ ] 增加 Upsell 智能触发逻辑
- [ ] 优化对话记忆（conversation_variables）
- [ ] 增加多意图并行识别
- [ ] 开启语音输入（STT）

### v3.0 (愿景)

- [ ] 多 Agent 协同（智能前台、销售顾问、行程助手、售后管家）
- [ ] 接入外部 API（高德地图、天气 API）
- [ ] 个性化推荐引擎
- [ ] 实时收益管理建议

---

**维护者**: 问途杯参赛团队  
**最后更新**: 2026-05-13

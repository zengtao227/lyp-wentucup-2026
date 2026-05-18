# 主办方视频资料与 MCP 服务配置

## 来源与用途

本文件用于归档从主办方视频中提取的技术配置资料，以及项目文件夹中保存的 MCP 服务配置文件。

这些内容属于“平台能力 / 工具接入资料”，不属于比赛评分规则原文。因此不要合并进 `决赛规则及评分指南.md`；需要在方案设计、Dify 导入排查、路演技术架构说明中使用时，从本文件引用。

## 已保存的配置文件

| 配置类型 | 本地文件 | 用途判断 |
| :--- | :--- | :--- |
| 酒店客房预订 MCP 服务 | `酒店客房预订MCP服务配置.txt` | 对应酒店客房预订 Agent 的真实工具接入方向 |
| 景区门票预订 MCP 服务 | `景区门票预订MCP服务配置.txt` | 对应景区门票预订 Agent 的真实工具接入方向 |

## 酒店客房预订 MCP 服务配置

来源文件：`酒店客房预订MCP服务配置.txt`

```json
{
  "fetch": {
    "url": "http://mcp-server-booking.v4.test.dossm.cn/sse",
    "headers": {},
    "timeout": 60,
    "sse_read_timeout": 300
  }
}
```

## 景区门票预订 MCP 服务配置

来源文件：`景区门票预订MCP服务配置.txt`

```json
{
  "fetch": {
    "url": "http://mcp-server-travel.v4.test.dossm.cn/sse",
    "headers": {},
    "timeout": 60,
    "sse_read_timeout": 300
  }
}
```

## 对当前 v1.0 方案的影响

当前最终候选 `大模型5月8日（决赛版）v1.0-预订Agent双工具正式版.yml` 仍采用：

- GitHub raw `rooms.json` 模拟房态查询
- `jsonplaceholder.typicode.com/posts` 模拟预订提交

如果 Dify / 问途 AI Playground 可以直接接入主办方提供的 MCP SSE 服务，后续可做 v1.1：

1. 将 `房态查询` HTTP mock 替换为酒店客房预订 MCP 服务。
2. 将 `预订提交` mock POST 替换为酒店客房预订 MCP 服务的实际提交工具。
3. 如果参赛方向覆盖景区门票，则新增“景区门票预订”分支，并接入景区门票预订 MCP 服务。
4. 保留 v1.0 作为离线可演示备份，避免正式平台 MCP 服务不稳定时影响路演。

## 2026-05-09 复核结论

用户指出：早期 workflow 没有放到 GitHub 也能正常使用，因此不能把“公开 GitHub 数据仓库”误判为平台必需条件。

复核结果：

1. `lyp.yml` 没有 HTTP 节点；4月定稿版本主要只有高德天气 HTTP 节点。
2. 从 `大模型5月8日（决赛版）7-预订Agent增强版.yml` 开始，才新增 GitHub raw `rooms.json` 房态查询。
3. 从 v1.7 开始，才新增 `tickets.json` 景区票务查询。
4. 因此，早期版本能跑并不说明 GitHub 是平台要求；只是当时还没有引入房态/票务外部 JSON mock。
5. 主办方视频中提取的两个 MCP SSE 地址更像是比赛平台提供的正式工具接入方向，而不是普通 JSON 数据源。

本地网络测试观察：

- `http://mcp-server-travel.v4.test.dossm.cn/sse` 能返回 SSE endpoint。
- `http://mcp-server-booking.v4.test.dossm.cn/sse` 在本地外网测试中响应不稳定或较慢。
- 这些 MCP SSE 服务不能直接当作 Dify 普通 HTTP GET JSON 节点使用；需要在问途/Dify 的工具或 MCP 管理中配置为 MCP 工具，再由 workflow 的工具节点或 Agent 节点调用。

当前建议：

1. 公开数据仓库只作为 mock fallback，用于保证路演前有一版可稳定导入和演示的 workflow。
2. 下一步应在问途 AI Playground 后台确认是否有 `Tools -> MCP`、自定义工具、官方工具节点或类似入口。
3. 若平台能把上述两个 MCP 服务加入工具清单，应导出一版带 MCP 工具节点的 YAML，再替换当前 `房态查询` / `票务查询` / mock POST 节点。
4. 在未看到 Dify 运行日志前，不要宣称当前 YAML 已经调用官方 MCP 工具。

## 2026-05-11 最终决策：必须使用官方 MCP 服务

**决定**：放弃 GitHub jsDelivr CDN + jsonplaceholder 外部 mock 方案，全面切换至组织方提供的 MCP SSE 端点。

**理由（已写入 CONTEXT.md "Critical Decision: MCP Services Over GitHub Public Data" 章节）**：

1. **中国大陆网络环境**：GitHub jsDelivr CDN 和 jsonplaceholder 在中国大陆访问不稳定，路演现场若因网络问题导致房态查不出来或预订提交失败，将严重影响评分。
2. **平台已确认支持 MCP**：问途 AI Playground 后台工具设置支持添加 MCP 工具节点，平台内网可达这两个 SSE 端点。
3. **组织方明确期望**：培训视频中展示的 MCP SSE 端点即标准方案，用 GitHub mock 等于只模拟了流程而非真正的 PMS 对接。
4. **评分规则要求**："实时查询房态/票务"是 10% Agent + 30% 整合模块的硬性要求，静态 JSON 无法体现实时能力。

### 操作步骤（给平台配置同学）

**前提**：登录问途 AI Playground → 进入应用编辑界面 → 找到 **工具 / Tools** 设置区域。

**配置两个 MCP 服务源**：

| 步骤 | 操作 |
|------|------|
| 1 | 在工具设置中找到 **MCP 服务** 或 **MCP Server** 配置入口 |
| 2 | 添加第一个 MCP 服务：名称填 `酒店客房预订MCP`，URL 填 `http://mcp-server-booking.v4.test.dossm.cn/sse`（SSE 协议），保存 |
| 3 | 添加第二个 MCP 服务：名称填 `景区门票预订MCP`，URL 填 `http://mcp-server-travel.v4.test.dossm.cn/sse`（SSE 协议），保存 |
| 4 | 配置完成后，点击 **查看工具列表 / tools/list**，确认能拉出每个服务暴露的工具名称和参数 |

**关键确认信息（配置完成后请反馈）**：

请反馈每个 MCP 服务暴露了哪些工具（tool name）、每个工具的入参（input schema）和返回结构（output schema）。具体来说需要确认：

```
酒店客房预订MCP 返回的工具列表（示例）：
  - room_search(query_params) → 返回什么？
  - room_book(booking_details) → 需要哪些必填参数？
  - cancel_booking(order_id) → 需要什么参数？

景区门票预订MCP 返回的工具列表（示例）：
  - ticket_search(query_params) → 返回什么？
  - ticket_book(purchase_details) → 需要哪些必填参数？
```

拿到这些信息后才能对接下来的 v1.13 YAML 进行精确替换。

## 路演表述建议

可在 PPT 中说明：

> 当前 Agent 已完成预订工具调用链路的完整编排。在竞赛平台上，Agent 通过 MCP 协议直连酒店 PMS 与景区票务系统，实现从查房态→预订提交→取消退款的真实业务闭环。平台内网 MCP 端点确保了 Demo 现场的响应稳定性。

不要在路演中承诺这些 MCP 服务已经被当前 v1.0 YAML 实际调用，除非已经在 Dify / 问途 AI Playground 中完成导入并跑通日志验证。

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

## 路演表述建议

可在 PPT 中说明：

> 当前 Demo 使用双 HTTP 工具完整模拟预订闭环；主办方平台若开放 MCP 工具配置，可无缝替换为官方酒店客房预订 MCP 服务，实现从演示级 mock 到平台级真实预订工具的升级。

不要在路演中承诺这些 MCP 服务已经被当前 v1.0 YAML 实际调用，除非已经在 Dify / 问途 AI Playground 中完成导入并跑通日志验证。

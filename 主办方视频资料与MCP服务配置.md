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

## 路演表述建议

可在 PPT 中说明：

> 当前 Demo 使用双 HTTP 工具完整模拟预订闭环；主办方平台若开放 MCP 工具配置，可无缝替换为官方酒店客房预订 MCP 服务，实现从演示级 mock 到平台级真实预订工具的升级。

不要在路演中承诺这些 MCP 服务已经被当前 v1.0 YAML 实际调用，除非已经在 Dify / 问途 AI Playground 中完成导入并跑通日志验证。


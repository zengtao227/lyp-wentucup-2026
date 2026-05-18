# Dify 平台工作流管理 API 研究记录

日期：2026-05-08

研究对象：

- 比赛平台：`http://playground.v2.dossm.cn/`
- 应用 ID：`3b78c041-2dfd-4521-bd38-78c19731a015`
- 当前 MCP：`http://playground.v2.dossm.cn/mcp/server/HaQaWvhvkC3VvFz5/mcp`
- 当前线上版本：`大模型5月8日（决赛版）v1.3-HTTPBodySchema修正版`

## 结论

比赛平台确实存在工作流管理 API，但它不是文档中给参赛者使用的 `/v1` 后端服务 API。

应区分三类接口：

1. `/v1/*`：已发布应用的运行时服务 API，用于聊天、工作流执行、日志查询等。
2. `/mcp/server/.../mcp`：已发布应用的 MCP 工具调用入口，用于外部工具测试和调用。
3. `/console/api/*`：Dify 控制台内部管理 API，用于读取草稿、保存 workflow draft、导入 DSL、导出 DSL、发布 workflow 等。

其中第 3 类才是“工作流管理 API”。它需要控制台登录态、有效 `console_token`/session，以及当前账号对应用的编辑权限。Service API Key 不能调用这些接口。

## 实测结果

### MCP v1.3 测试

新 MCP 初始化成功：

- Server：Dify
- Version：`1.9.0`
- Tool：`大模型5月8日（决赛版）v1.3-HTTPBodySchema修正版`

用 `你好` 做最小调用，返回了正常酒店客服欢迎语。此前 v1.2 的 `HttpRequestNodeData.body.type: raw` 报错已经消失，说明 v1.3 线上运行验证通过。

### 控制台 API 未登录测试

请求：

```bash
GET http://playground.v2.dossm.cn/console/api/apps/3b78c041-2dfd-4521-bd38-78c19731a015/workflows/draft
```

返回：

```json
{"code":"unauthorized","message":"Invalid Authorization token.","status":401}
```

请求：

```bash
GET http://playground.v2.dossm.cn/console/api/apps/3b78c041-2dfd-4521-bd38-78c19731a015/export?include_secret=false
```

返回同样的 401。

这证明管理 API 入口存在，但没有控制台授权不能直接操作。

## 从平台前端确认到的接口

workflow 页面 HTML 暴露：

```html
data-api-prefix="/console/api"
data-public-api-prefix="/api"
```

前端 JS chunk 中确认到以下管理端路径：

```text
GET  /console/api/apps/{app_id}/workflows/draft
POST /console/api/apps/{app_id}/workflows/draft
GET  /console/api/apps/{app_id}/workflows/draft/config
GET  /console/api/apps/{app_id}/workflows/publish
POST /console/api/apps/{app_id}/workflows/publish
POST /console/api/apps/{app_id}/workflows/draft/run
POST /console/api/apps/{app_id}/advanced-chat/workflows/draft/run
POST /console/api/apps/{app_id}/workflows/draft/nodes/{node_id}/run
GET  /console/api/apps/{app_id}/export?include_secret=false
POST /console/api/apps/imports
POST /console/api/apps/imports/{import_id}/confirm
```

导入 DSL 的前端请求体结构：

```json
{
  "mode": "yaml-content",
  "yaml_content": "...",
  "yaml_url": null,
  "app_id": "3b78c041-2dfd-4521-bd38-78c19731a015",
  "name": "...",
  "description": "...",
  "icon_type": "...",
  "icon": "...",
  "icon_background": "..."
}
```

也支持：

```json
{
  "mode": "yaml-url",
  "yaml_url": "https://raw.githubusercontent.com/..."
}
```

如果返回 `status: pending`，需要再调用：

```text
POST /console/api/apps/imports/{import_id}/confirm
```

## 官方源码依据

Dify 官方源码中 `app_import.py` 明确注册：

- `POST /apps/imports`
- `POST /apps/imports/{import_id}/confirm`
- `GET /apps/imports/{app_id}/check-dependencies`

这些接口带有：

- `@login_required`
- `@account_initialization_required`
- `@edit_permission_required`

因此它们不是公开服务 API，而是控制台登录用户的管理 API。

Dify 官方文档的 `/workflows/run` 说明也明确：该接口用于执行已发布 workflow，且需要 Service API Key。它不负责 workflow 画布编辑、草稿保存、DSL 导入或发布。

## 对我们团队的实际意义

当前可以自动化的部分：

1. 本地生成和校验 YAML。
2. GitHub 提交和推送版本。
3. 用 MCP 验证已发布应用是否能正常回答。
4. 用 `/v1` 或 MCP 做批量测试用例回归。

暂时不能自动化的部分：

1. 直接用 Service API Key 覆盖线上 workflow。
2. 直接用 MCP URL 编辑 workflow。
3. 无登录态调用 `/console/api/apps/imports` 导入 YAML。
4. 无登录态调用 `/console/api/apps/{app_id}/workflows/publish` 发布工作流。

要实现全自动导入/发布，需要满足其中一种条件：

1. 主办方提供正式的工作流管理 API Token。
2. 使用一个有编辑权限的控制台账号，并在本地安全地注入短期 `console_token`/session。该 token 只能放在本机环境变量或临时文件中，不能提交到 GitHub。
3. 继续人工在控制台导入 YAML，Codex 负责本地修复、Git 版本管理和 MCP 回归测试。

## 推荐流程

短期建议保持现有流程：

1. Codex 修改 YAML。
2. Codex 静态校验。
3. Codex commit/push 到 GitHub。
4. 人工在 Dify 控制台导入最新 YAML 并发布。
5. 提供新的 MCP URL。
6. Codex 用 MCP 做线上验证。

如果后续要提升效率，可以优先尝试“控制台登录态自动导入”方案，但必须先确认 token 管理方式，避免把控制台凭证写入仓库或聊天记录。

## 参考资料

- 比赛平台 workflow 页面：`http://playground.v2.dossm.cn/app/3b78c041-2dfd-4521-bd38-78c19731a015/workflow`
- Dify 官方 Run Workflow 文档：`https://docs.dify.ai/api-reference/workflows/run-workflow`
- Dify 官方应用导入/导出说明：`https://docs.dify.ai/en/use-dify/workspace/app-management`
- Dify 官方源码：`https://github.com/langgenius/dify/blob/main/api/controllers/console/app/app_import.py`
- Dify 官方源码：`https://github.com/langgenius/dify/blob/main/api/services/app_dsl_service.py`

# 🐛 Bug 报告：hotel-booking MCP 接口 500 错误

## 基本信息

- **报告时间**：2026年5月13日 02:30 AM
- **Team ID**：234556
- **影响范围**：酒店客房预订功能完全不可用

---

## 问题描述

在测试 Agent 的酒店订房功能时，调用 `getAvailableRoomsByRoomTypeAndDate` 工具持续返回 **500 Internal Server Error**，导致无法查询房态。

---

## 错误详情

### 请求信息

```json
{
  "tool": "getAvailableRoomsByRoomTypeAndDate",
  "parameters": {
    "teamId": 234556,
    "roomType": "002",
    "checkInDate": "2026-05-20",
    "checkOutDate": "2026-05-21"
  }
}
```

### 错误响应

```json
{
  "error": "500 Internal Server Error on POST request for \"http://v4.dossm.cn/mcp/booking/getRoomList\"",
  "details": {
    "reason": "请求路径：/mcp/booking/getRoomList，异常信息：fallbackapi failed and no fallback available.",
    "code": 500,
    "message": "Internal Server Error"
  }
}
```

### 关键信息

1. **实际请求端点**：`http://v4.dossm.cn/mcp/booking/getRoomList`
2. **MCP 配置端点**：`http://mcp-server-booking.v4.test.dossm.cn/sse`
3. **错误类型**：服务熔断（Circuit Breaker Fallback）失败

---

## 问题分析

### 根本原因

这是一个**三层问题叠加**的后端服务故障：

1. **主接口崩溃**
   - `/mcp/booking/getRoomList` 接口本身挂了
   - 无法正常处理请求

2. **备用接口崩溃**
   - Fallback API 也挂了
   - 服务熔断机制失效

3. **环境路由问题**
   - MCP 配置指向测试环境（`v4.test.dossm.cn`）
   - 实际请求被路由到生产环境（`v4.dossm.cn`）
   - 生产环境接口处于崩溃状态

### 与之前问题的关联

| 时间 | 现象 | 错误类型 |
|------|------|---------|
| 之前 | `rooms: []` 空数组 | 接口返回但数据库查无数据 |
| 现在 | `500 fallbackapi failed` | 接口直接挂掉，连空数据都返不了 |

**结论**：`v4.dossm.cn` 上的 `/mcp/booking/getRoomList` 接口处于**不稳定状态**，时好时坏。

---

## 影响范围

### 功能影响

- ❌ 无法查询指定房型的房态
- ❌ 无法查询房间价格
- ❌ 无法完成订房流程
- ❌ 景区门票查询可能也受影响（如果使用相同的后端服务）

### 用户体验影响

虽然 Agent 能优雅地处理错误（提供人工服务兜底），但核心功能完全不可用，**无法进行演示和答辩**。

---

## 复现步骤

1. 登录 Playground 平台
2. 进入 Agent 对话界面
3. 输入："5月20号还有豪华大床房吗"
4. 观察工具调用日志
5. 看到 500 错误

**复现率**：100%（每次都失败）

---

## 请求协助

### 紧急问题

1. **该接口是否正在维护？**
   - 如果是，预计恢复时间？
   - 是否有维护公告？

2. **是否有备用接口或解决方案？**
   - 是否可以使用其他端点？
   - 是否可以临时切换到测试环境？

3. **房价数据保存失效是否与此相关？**
   - 之前在 workbench 配置的房价无法生效
   - 是否是同一个后端服务问题？

### 需要的信息

1. **接口状态**：当前是否可用？
2. **恢复时间**：预计何时修复？
3. **临时方案**：比赛期间如何演示订房功能？
4. **数据同步**：workbench 配额管理和 MCP API 是否在同一数据库？

---

## 我们已做的工作

### Agent 配置

- ✅ 正确配置 teamId: 234556
- ✅ 正确使用房型代码（002 = 豪华大床房）
- ✅ 正确的日期格式（YYYY-MM-DD）
- ✅ 优雅的错误处理（提供人工服务兜底）

### 排查工作

- ✅ 验证参数格式正确
- ✅ 验证 MCP 工具已授权
- ✅ 验证 Agent 配置正确
- ✅ 确认这是后端服务问题，不是配置问题

---

## 附件

### 完整错误日志

```
请求:
{
  "getAvailableRoomsByRoomTypeAndDate": {
    "teamId": 234556,
    "roomType": "002",
    "checkInDate": "2026-05-20",
    "checkOutDate": "2026-05-21"
  }
}

响应:
{
  "getAvailableRoomsByRoomTypeAndDate": "500 Internal Server Error on POST request for \"http://v4.dossm.cn/mcp/booking/getRoomList\": \"{\"reason\":\"请求路径：/mcp/booking/getRoomList，异常信息：fallbackapi failed and no fallback available.\",\"code\":500,\"message\":\"Internal Server Error\"}\""
}
```

### Agent 回复（用户视角）

```
非常抱歉，目前查询系统暂时无法获取豪华大床房的可用情况。
建议您稍后再试，或者直接致电我们的前台热线0750-662-9888，
我们的工作人员会为您人工查询并协助预订。
如果您有其他需求或想了解其他房型，也可以告诉我，我会尽力为您服务！
```

---

## 联系方式

- **Team ID**：234556
- **项目名称**：酒店全能智能前台
- **技术负责人**：[你的姓名]
- **联系方式**：[你的联系方式]

---

## 优先级

**🔴 紧急（P0）**

理由：
1. 核心功能完全不可用
2. 影响比赛演示和答辩
3. 无法验证 Agent 的完整功能
4. 需要在答辩前修复

---

**报告时间**：2026-05-13 02:30 AM  
**状态**：等待组委会响应

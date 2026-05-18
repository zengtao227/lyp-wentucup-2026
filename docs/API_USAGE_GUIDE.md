# 问途杯 Agent API 使用指南

## 📌 重要说明

**API 密钥已创建但不包含在 YML 文件中！**

- API 密钥存储位置：`.env.local`（已加入 .gitignore，不会提交到 Git）
- YML 文件：只包含 Agent 配置，不包含 API 密钥

---

## 🔑 API 密钥信息

```
API 密钥: app-Us5Idqmsvplzr4VywdpZ4kt0
基础 URL: http://playground.v2.dossm.cn/v1
Team ID: 234556
```

⚠️ **安全提示**：此密钥仅供团队内部使用，不要公开分享！

---

## 📋 使用场景

### ✅ 需要 API 密钥的场景

1. **外部小程序/网页调用**
   - 通过 HTTP API 调用 Agent
   - 需要在请求头中携带 API 密钥

2. **Workbench 对话窗口**
   - 如果通过 API 方式接入
   - 需要配置 API 密钥

3. **第三方集成**
   - 微信公众号、企业微信等
   - 需要 API 密钥进行身份验证

### ❌ 不需要 API 密钥的场景

1. **Playground 平台内测试**
   - 直接在预览窗口测试
   - 平台自动识别账号权限

2. **YML 文件导入**
   - 导入 YML 后自动关联账号
   - 不需要额外配置密钥

3. **比赛评委测试**
   - 评委在你的账号下测试
   - 不需要 API 密钥

---

## 🔧 API 调用示例

### Python 示例

```python
import requests

API_KEY = "app-Us5Idqmsvplzr4VywdpZ4kt0"
BASE_URL = "http://playground.v2.dossm.cn/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "inputs": {},
    "query": "我想订5月20号的高级大床房",
    "response_mode": "streaming",
    "user": "test-user"
}

response = requests.post(
    f"{BASE_URL}/chat-messages",
    headers=headers,
    json=data
)

print(response.json())
```

### JavaScript 示例

```javascript
const API_KEY = "app-Us5Idqmsvplzr4VywdpZ4kt0";
const BASE_URL = "http://playground.v2.dossm.cn/v1";

fetch(`${BASE_URL}/chat-messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    inputs: {},
    query: "我想订5月20号的高级大床房",
    response_mode: "streaming",
    user: "test-user"
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### cURL 示例

```bash
curl -X POST 'http://playground.v2.dossm.cn/v1/chat-messages' \
  -H 'Authorization: Bearer app-Us5Idqmsvplzr4VywdpZ4kt0' \
  -H 'Content-Type: application/json' \
  -d '{
    "inputs": {},
    "query": "我想订5月20号的高级大床房",
    "response_mode": "streaming",
    "user": "test-user"
  }'
```

---

## 🎯 比赛提交清单

### ✅ 需要提交的文件

- `大模型5月13日-v2.1-Agent.yml` - Agent 配置文件
- `2026_WentuCup_Implementation_Process_and_Notes.md` - 实施文档
- `2026_WentuCup_Winning_Strategy_and_PRD.md` - 策略文档
- 知识库文件（如有）
- PPT 演示文稿

### ❌ 不要提交的文件

- `.env.local` - API 密钥配置（已在 .gitignore 中）
- `API_USAGE_GUIDE.md` - 内部使用指南（可选择性提交）
- 任何包含 API 密钥的文件

---

## 🔒 密钥管理最佳实践

1. **定期轮换**：比赛结束后，建议删除或重新生成 API 密钥
2. **最小权限**：只在必要时使用 API 密钥
3. **监控使用**：定期检查 API 调用日志，发现异常及时处理
4. **备份密钥**：将密钥安全存储在密码管理器中（如 1Password、LastPass）

---

## 📞 技术支持

如果遇到 API 调用问题：
1. 检查 API 密钥是否正确
2. 确认请求头格式是否正确（`Authorization: Bearer <API_KEY>`）
3. 查看平台 API 文档：http://playground.v2.dossm.cn/docs
4. 联系组委会技术支持

---

**最后更新**: 2026-05-13
**版本**: v2.1

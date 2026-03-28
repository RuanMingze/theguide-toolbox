# 安全配置说明

## OAuth 安全特性

### 1. CSRF 防护（State 参数）
- ✅ 每次登录请求生成唯一的 state 参数
- ✅ State 存储在 HttpOnly Cookie 中，前端无法访问
- ✅ 回调时验证 state 参数，防止 CSRF 攻击
- ✅ State 参数 10 分钟后自动过期
- ✅ 使用后立即删除 state cookie

### 2. 敏感信息保护
- ✅ Client Secret 仅存储在服务端环境变量
- ✅ 前端无法访问 Client Secret
- ✅ 访问令牌存储在 HttpOnly Cookie 中
- ✅ 生产环境启用 Secure 标志（仅 HTTPS）

### 3. Cookie 安全设置
```typescript
{
  httpOnly: true,          // 前端 JavaScript 无法访问
  secure: true,            // 仅 HTTPS 传输
  sameSite: 'lax',         // 防止 CSRF
  maxAge: 7 * 24 * 60 * 60 // 7 天过期
}
```

### 4. 环境变量（.env.local）
```env
# 公开信息（可暴露）
RUANM_OAUTH_CLIENT_ID=yodhcgx4smnofbv4ulpp3vfxozd4171q
RUANM_OAUTH_REDIRECT_URI=https://theguide.ruanmgjx.dpdns.org/callback
RUANM_OAUTH_BASE_URL=https://ruanmgjx.dpdns.org

# 机密信息（严禁暴露）
RUANM_OAUTH_CLIENT_SECRET=*** 已加密存储 ***
```

## 安全最佳实践

1. **永远不要**将 `.env.local` 提交到 Git
2. **永远不要**在前端代码中使用 `process.env.RUANM_OAUTH_CLIENT_SECRET`
3. **始终**使用 HttpOnly Cookie 存储敏感令牌
4. **始终**验证 CSRF state 参数
5. **定期**更新 Client Secret

## 攻击防护

### 已防护的攻击类型：
- ✅ CSRF（跨站请求伪造）- 通过 state 参数
- ✅ XSS（跨站脚本）- HttpOnly Cookie 无法被 JavaScript 访问
- ✅ 中间人攻击 - Secure 标志确保 HTTPS 传输
- ✅ 重放攻击 - State 参数一次性使用

## 安全审计清单

- [x] Client Secret 仅服务端访问
- [x] State 参数生成和验证
- [x] HttpOnly Cookie 存储令牌
- [x] Secure 标志启用
- [x] SameSite 防护
- [x] State 参数过期时间
- [x] 错误信息不泄露敏感数据

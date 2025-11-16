# 环境变量配置指南

本项目需要在 `.env.local` 文件中配置以下环境变量：

## 必需的环境变量

### Supabase 配置
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_connection_string
```

### Creem 支付配置
```bash
CREEM_API_KEY=your_creem_api_key
NEXT_PUBLIC_CREEM_URL=https://test-api.creem.io  # 或生产环境URL
```

### 产品ID配置（⚠️ 必须使用 NEXT_PUBLIC_ 前缀）
```bash
# 月度会员订阅产品ID（例如：prod_2z33UasJaSLnNkAXtli3ka）
NEXT_PUBLIC_PRO_MEMBERSHIP_PID=your_monthly_pro_product_id

# 终身会员产品ID
NEXT_PUBLIC_LIFETIME_PRO_PID=your_lifetime_pro_product_id

# 单课程购买产品ID（例如：prod_2tOa3X2Gop6l1rjRusjc60）
NEXT_PUBLIC_SINGLE_COURSE_PID=your_single_course_product_id
```

**重要提示：** 这些产品ID必须与 Creem 后台创建的产品ID完全一致！

### 站点配置
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # 本地开发
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com  # 生产环境
```

## 配置步骤

1. 在项目根目录创建 `.env.local` 文件
2. 复制上述环境变量模板
3. 填入您的实际配置值
4. 重启开发服务器使配置生效

## 注意事项

- `.env.local` 文件不会被提交到 Git（已在 .gitignore 中）
- 以 `NEXT_PUBLIC_` 开头的变量会暴露给客户端
- 其他变量仅在服务器端可用
- 修改环境变量后需要重启开发服务器

## 常见问题

### 支付接口返回 400 错误

如果遇到 `POST /api/payment/checkout 400` 错误，请检查：

1. `.env.local` 文件是否存在
2. `CREEM_API_KEY` 是否已配置
3. 产品ID (`PRO_MEMBERSHIP_PID`, `SINGLE_COURSE_PID`) 是否正确
4. 重启开发服务器后再试

### 环境变量未生效

确保：
- 文件名是 `.env.local`（不是 `.env`）
- 环境变量格式正确（无空格，使用等号）
- 已重启开发服务器


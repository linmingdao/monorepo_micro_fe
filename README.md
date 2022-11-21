# monorepo_micro_fe

monorepo + 微前端实践

1. pnpm init 初始化项目
2. pnpm-workspace.yaml
3. 制作 api 子包
4. 制作 micro_vue 子包
   - npm create vite 初始化项目
   - pnpm i 安装依赖
   - pnpm add @ryuk/api 添加本地的子包
     ```json
     "dependencies": {
      "@ryuk/api": "workspace:^1.0.1",
      "vue": "^3.2.41"
     }
     ```

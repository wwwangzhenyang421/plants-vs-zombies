# GitHub 部署说明

## ✅ 已完成的工作

1. ✅ 创建了 `.gitignore` 文件
2. ✅ 配置了 `vite.config.js` 支持 GitHub Pages（base: `/plants-vs-zombies/`）
3. ✅ 创建了 GitHub Actions 工作流（`.github/workflows/deploy.yml`）
4. ✅ 初始化了 Git 仓库
5. ✅ 创建了 GitHub 仓库：`https://github.com/wwwangzhenyang421/plants-vs-zombies`
6. ✅ **代码已成功推送到 GitHub！**

## ⚠️ 重要：添加 Workflow 文件

由于 Personal Access Token 需要 `workflow` 权限才能推送 workflow 文件，有两种解决方案：

### 方案 1：在 GitHub 网页上手动创建（推荐，最简单）

1. 访问：https://github.com/wwwangzhenyang421/plants-vs-zombies
2. 点击 **Add file** → **Create new file**
3. 输入路径：`.github/workflows/deploy.yml`
4. 复制以下内容并粘贴：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. 点击 **Commit new file**

### 方案 2：更新 Token 权限后推送

1. 访问：https://github.com/settings/tokens
2. 找到你的 token 或创建新 token
3. 在权限中勾选 **workflow**
4. 更新本地 git 配置中的 token
5. 然后执行：
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Actions workflow"
   git push origin main
   ```

## 🚀 启用 GitHub Pages

推送代码后，需要启用 GitHub Pages：

1. 访问仓库：https://github.com/wwwangzhenyang421/plants-vs-zombies
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分：
   - 选择 **GitHub Actions** 作为部署源
5. 保存设置

## 🔄 自动部署

每次推送到 `main` 分支时，GitHub Actions 会自动：
1. 构建项目
2. 部署到 GitHub Pages

## 🌐 访问地址

部署完成后，你的游戏可以通过以下地址访问：

**https://wwwangzhenyang421.github.io/plants-vs-zombies/**

## 📝 注意事项

1. **首次部署**：第一次推送后，GitHub Actions 工作流会自动运行，部署可能需要几分钟
2. **查看部署状态**：在仓库的 **Actions** 标签页可以查看部署进度
3. **Base Path**：如果修改了仓库名，记得更新 `vite.config.js` 中的 `base` 配置

## 🔧 手动触发部署

如果需要手动触发部署：

1. 访问仓库的 **Actions** 标签页
2. 选择 **Deploy to GitHub Pages** 工作流
3. 点击 **Run workflow**

## ⚠️ 重要提示

- 确保所有文件都已提交（461个文件）
- 如果推送失败，可以分批推送或检查网络连接
- GitHub Pages 部署可能需要几分钟时间


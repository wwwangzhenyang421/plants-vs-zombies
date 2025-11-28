# 快速设置 GitHub Actions Workflow

## 🎯 当前状态

✅ 代码已推送到 GitHub  
✅ 部署文档已添加  
⚠️ **需要手动添加 Workflow 文件**

## 📝 步骤：在 GitHub 网页上创建 Workflow

### 方法 1：直接创建文件（推荐）

1. 访问仓库：https://github.com/wwwangzhenyang421/plants-vs-zombies
2. 点击 **Add file** → **Create new file**
3. 在文件路径输入框中输入：`.github/workflows/deploy.yml`
   - 注意：输入 `.github` 后，GitHub 会自动创建目录
4. 复制以下完整内容并粘贴到编辑器中：

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

5. 滚动到底部，点击 **Commit new file**
6. 完成！

### 方法 2：使用 GitHub 网页编辑器

1. 访问：https://github.com/wwwangzhenyang421/plants-vs-zombies
2. 点击仓库中的 **Actions** 标签页
3. 点击 **set up a workflow yourself** 或 **New workflow**
4. 删除默认内容，粘贴上面的 YAML 内容
5. 点击 **Start commit** → **Commit new file**

## 🚀 启用 GitHub Pages

创建 workflow 后，需要启用 GitHub Pages：

1. 访问仓库：https://github.com/wwwangzhenyang421/plants-vs-zombies
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分：
   - 选择 **GitHub Actions** 作为部署源
5. 点击 **Save**

## ✅ 验证部署

1. 访问 **Actions** 标签页，应该能看到 "Deploy to GitHub Pages" 工作流
2. 工作流会自动运行，构建和部署项目
3. 等待几分钟后，访问：**https://wwwangzhenyang421.github.io/plants-vs-zombies/**

## 🔄 后续更新

以后每次推送代码到 `main` 分支，GitHub Actions 会自动：
1. 构建项目
2. 部署到 GitHub Pages

无需手动操作！


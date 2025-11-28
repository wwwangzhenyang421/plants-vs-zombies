# GitHub Pages 部署指南

## 📋 两种部署方式对比

### 方式 1：gh-pages 分支（传统方式，推荐）✅

**优点：**
- ✅ 简单直接，一条命令完成
- ✅ 不需要配置 GitHub Actions
- ✅ 本地控制，可以预览构建结果
- ✅ 适合个人项目和小型项目

**缺点：**
- ❌ 需要手动运行部署命令
- ❌ 构建产物会占用仓库空间

### 方式 2：GitHub Actions（自动化方式）

**优点：**
- ✅ 完全自动化，推送代码即部署
- ✅ 构建在云端进行，不占用本地空间
- ✅ 可以查看构建日志和状态

**缺点：**
- ❌ 需要配置 workflow 文件
- ❌ 需要 token 有 workflow 权限

---

## 🚀 方式 1：使用 gh-pages 分支部署（推荐）

### 步骤 1：安装依赖（如果还没安装）

```bash
npm install
```

### 步骤 2：执行部署

```bash
npm run deploy
```

这个命令会：
1. 构建项目（`npm run build`）
2. 自动创建/更新 `gh-pages` 分支
3. 将 `dist` 目录的内容推送到 `gh-pages` 分支

### 步骤 3：在 GitHub 上启用 Pages

1. 访问仓库：https://github.com/wwwangzhenyang421/plants-vs-zombies
2. 点击 **Settings** → **Pages**
3. 在 **Source** 部分：
   - 选择 **Deploy from a branch**
   - Branch 选择 **gh-pages**
   - Folder 选择 **/ (root)**
4. 点击 **Save**

### 步骤 4：访问网站

等待几分钟后，访问：
**https://wwwangzhenyang421.github.io/plants-vs-zombies/**

### 🔄 后续更新

每次修改代码后，只需运行：

```bash
npm run deploy
```

然后等待几分钟，网站就会自动更新！

---

## 🤖 方式 2：使用 GitHub Actions（可选）

如果你想使用自动化部署，可以：

1. 在 GitHub 网页上创建 `.github/workflows/deploy.yml` 文件
2. 在 Settings → Pages 中选择 **GitHub Actions** 作为部署源

详细步骤请参考 `SETUP_WORKFLOW.md`

---

## 📝 注意事项

1. **Base Path**：当前配置的 base 是 `/plants-vs-zombies/`，如果修改了仓库名，记得更新 `vite.config.js`
2. **首次部署**：第一次部署后，GitHub Pages 可能需要几分钟才能生效
3. **查看部署状态**：在仓库的 Settings → Pages 可以看到部署状态

## 🎯 推荐

对于你的项目，**推荐使用方式 1（gh-pages 分支）**，因为：
- 你已经有了 `gh-pages` 包和部署脚本
- 更简单直接
- 一条命令就能完成部署


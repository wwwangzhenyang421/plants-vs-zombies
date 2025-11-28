# Plants vs Zombies - React Game

一个使用 React + Vite + react-konva 构建的《植物大战僵尸》塔防游戏，参考了优秀的开源项目设计风格。

## ✨ 功能特性

### 核心玩法
- 🎮 **9列网格塔防**：比原版更大的游戏区域（9列 vs 原版5列）
- 🌱 **3种植物**：豌豆射手、向日葵、坚果墙
- 🧟 **2种僵尸**：普通僵尸、路障僵尸
- ☀️ **阳光收集系统**：可点击的阳光掉落物
- 🎯 **波次系统**：每关5波，难度递增
- ✅ **胜负检测**：完成所有波次胜利，僵尸到达左边界失败

### 关卡系统
- 📊 **3个关卡**：
  - Level 1: 1行网格，初始200阳光（简单）
  - Level 2: 3行网格，初始200阳光（中等）
  - Level 3: 5行网格，初始500阳光（困难）
- 🎨 **关卡选择界面**：美观的关卡选择菜单
- 🏆 **关卡完成系统**：完成一关后可继续下一关

### 游戏功能
- ⏸️ **暂停功能**：随时暂停/继续游戏
- 📖 **图鉴系统**：查看植物和僵尸信息
- 🎨 **左侧植物卡片**：参考原版设计，左侧显示植物选择
- 🖱️ **网格高亮**：选中植物时鼠标悬停显示绿色边框
- 📈 **进度显示**：波次进度条和关卡信息

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

## 📁 项目结构

```
src/
├── App.jsx              # 主应用组件（游戏状态管理、动画循环）
├── main.jsx             # 入口文件
├── index.css            # 全局样式
├── hooks/
│   └── useImage.js      # 图片加载Hook
└── components/
    ├── StartScreen.jsx  # 启动屏（参考原版设计风格）
    ├── LevelSelect.jsx  # 关卡选择界面
    ├── GameBoard.jsx    # 游戏板（9列网格，动态行数）
    ├── Plant.jsx        # 植物组件
    ├── Zombie.jsx       # 僵尸组件
    ├── Projectile.jsx   # 子弹组件
    ├── Almanac.jsx      # 图鉴组件
    └── GameOver.jsx     # 游戏结束组件
```

## 🎮 游戏说明

### 基本操作

1. **开始游戏**：点击启动屏的"Play"按钮进入关卡选择
2. **选择关卡**：选择Level 1/2/3开始游戏
3. **选择植物**：点击左侧植物卡片选择要放置的植物
4. **放置植物**：点击网格中的单元格放置植物
5. **收集阳光**：点击掉落的阳光收集（向日葵自动产生，也会自然掉落）
6. **防御僵尸**：使用豌豆射手攻击，坚果墙阻挡
7. **暂停游戏**：点击右上角暂停按钮
8. **查看图鉴**：点击图鉴按钮查看详细信息

### 游戏规则

- **胜利条件**：完成当前关卡的所有5波僵尸
- **失败条件**：僵尸到达左边界
- **波次系统**：每波僵尸数量递增，难度逐渐增加
- **阳光系统**：初始阳光根据关卡不同（200/200/500），每波完成奖励50阳光

## 🎨 设计特点

参考了优秀的开源项目设计风格，但保持了更大的游戏区域：

- ✅ **更大的游戏区域**：9列网格（vs 原版5列），提供更好的游戏体验
- ✅ **原版风格UI**：左侧植物卡片、顶部工具栏、关卡选择界面
- ✅ **卡通风格**：绿色/蓝色调，趣味性UI设计
- ✅ **响应式交互**：按钮hover效果、网格高亮、视觉反馈

## 🖼️ 图片资源

游戏使用 `public/images/` 目录下的图片资源：

- `out_put-EXT2/titlescreen.jpg` - 启动屏背景
- `out_put-EXT2/tree_grass.jpg` - 草地背景
- `out_put-EXT2/pool.jpg` - 池塘背景
- `out_put-EXT2/packet_plants.png` - 植物图片
- `out_put-EXT2/seeds.png` - 种子/阳光图片
- `out_put-EXT2/options_backtogamebutton0.png` - 按钮图片

## 🛠️ 技术栈

- **React 18** - UI框架
- **Vite** - 构建工具
- **react-konva** - Canvas渲染
- **Konva** - 2D Canvas库

## 💻 开发说明

- **动画系统**：使用 `requestAnimationFrame` 实现60fps流畅动画
- **状态管理**：React Hooks (useState, useEffect, useRef)
- **性能优化**：使用useRef避免不必要的重渲染
- **游戏循环**：所有游戏逻辑在 `App.jsx` 的主循环中处理

## 📝 参考项目

本项目参考了以下优秀开源项目的设计思路：

- [rachitamaharjan/Plants-VS-Zombies](https://github.com/rachitamaharjan/Plants-VS-Zombies) - 提供了关卡系统、暂停功能、UI设计等优秀思路

## 🎯 未来改进方向

- [ ] 音效系统（背景音乐和音效）
- [ ] 更多植物类型（寒冰射手、樱桃炸弹等）
- [ ] 更多僵尸类型（铁桶僵尸、舞王僵尸等）
- [ ] 动画效果（植物和僵尸的动画）
- [ ] 草坪割草机（每行一个，僵尸到达时触发）
- [ ] 不同关卡背景图

## 🚀 部署到 GitHub Pages

### 一键部署（推荐）

项目已配置简单的部署脚本，只需一个命令：

```bash
npm run deploy
```

这个命令会：
1. 自动构建项目
2. 创建或切换到 `gh-pages` 分支
3. 将构建文件推送到 GitHub
4. 自动切换回 `main` 分支

### 首次部署前的设置

1. **启用 GitHub Pages**
   - 访问：https://github.com/wwwangzhenyang421/plants-vs-zombies/settings/pages
   - 在 Source 下拉菜单中选择 **"Deploy from a branch"**
   - Branch 选择 `gh-pages`，文件夹选择 `/ (root)`
   - 点击 Save

2. **运行部署命令**
   ```bash
   npm run deploy
   ```

3. **访问你的网站**
   - 部署完成后，访问：https://wwwangzhenyang421.github.io/plants-vs-zombies/
   - 首次部署可能需要几分钟才能生效

### 后续更新

每次修改代码后，只需运行：

```bash
npm run deploy
```

即可自动部署最新版本。

## 📄 License

MIT

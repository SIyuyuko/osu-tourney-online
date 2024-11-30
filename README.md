# osu!tourney web

## 🌐 Language 语言

- [中文](#中文)
- [English](#english)

---

### 中文

osu!tourney web 是一个 osu! 比赛信息管理项目，通过个性化配置在本地运行、查看并管理你的比赛以及图池。

如果你对于 osu! 比赛管理工作没有多少经验，没有时间制作或获取裁判表；或者对比赛指令的运用不够熟练，希望你能使用这个项目，并对你的工作有所帮助！uwu

#### 📥 快速开始

1. 在 [Releases](https://github.com/你的用户名/仓库名/releases) 页面下载适合你系统的最新版本
2. 安装并运行程序
3. 开始使用！

#### 👨‍💻 开发指南

##### 🛠️ 环境要求

- Node.js >= 20.12.1
- Rust (最新稳定版)
  - Windows: 需安装 [Microsoft Visual Studio C++ 构建工具](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
  - Linux: 需安装 `build-essential` 包
  - macOS: 需安装 Xcode 命令行工具

##### 💻 本地开发

1. 克隆项目到本地：

   ```bash
   git clone https://github.com/你的用户名/osu-tourney-web.git
   cd osu-tourney-web
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 启动开发环境：

   ```bash
   # 运行 Web 开发服务器
   npm run dev

   # 运行桌面应用开发环境 npm/cargo
   npm run tauri dev
   cargo tauri dev
   ```

##### 🚀 构建

```bash
# 构建 Web 版本
npm run build

# 构建桌面应用 npm/cargo
npm run tauri build
cargo tauri build
```

构建完成后：

- Web 版本：构建产物在 `dist` 目录
- 桌面应用：构建产物在 `src-tauri/target/release`

#### 📱 页面介绍

##### 🏠 主页

主页展示个人信息（即项目使用者）、自定义横幅组件；设置为置顶的比赛、图池将会出现在主页。

##### 🏆 比赛页

比赛页展示每届比赛信息，点击比赛详情能查看参赛玩家，同时提供玩家主页入口和复制邀请指令功能。

##### 🗺️ 图池页

图池页展示每届比赛中的图池，提供谱面主页入口、复制谱面 ID、下载谱面、复制谱面比赛指令功能。

##### ⌨️ 指令页

指令页提供快捷比赛指令复制、裁判表组件功能。

#### 🔧 技术栈

- 前端：Vue 3 + TypeScript + Vite ⚡
- 桌面应用：Tauri (Rust) 🦀
- UI 框架：Ant Design Vue 🐜
- 状态管理：Pinia 🍍
- 国际化：Vue I18n 🌍

#### 🤝 贡献指南

我们欢迎一切新的提议、在本项目上的改动！如果有可行的新功能提议，我们会尽快实现。您可以通过以下方式参与贡献：

##### 📝 提交 PR

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request✨

##### 🐛 问题反馈

如果你发现了 bug 或者有新功能建议，欢迎提交 issue。

---

### English

osu! tourney web is a manage project for osu! tournaments by running in local with custom configurations, which you can view and manage your tournaments or mappools.

If you are inexperienced in osu! tournament management, don't have time to create or obtain a handy referee sheets; or are not skilled enough in the use of tournament instructions,
I hope that you will use this program and that it will help you in your work! uwu

#### 📥 Quick Start

1. Download the latest version for your system on the [Releases](
2. Install and run the program
3. Start using!

#### 👨‍💻 Development Guide

##### 🛠️ Environment Requirements

- Node.js >= 20.12.1
- Rust (latest stable version)
  - Windows: Requires [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
  - Linux: Requires `build-essential` package
  - macOS: Requires Xcode command line tools

##### 💻 Local Development

1. Clone the project to your local machine:

   ```bash
   git clone

   cd osu-tourney-web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development environment:

   ```bash
   # Run the Web development server
   npm run dev

   # Run the desktop application development environment npm/cargo
   npm run tauri dev
   cargo tauri dev
   ```

##### 🚀 Build

```bash
# Build the Web version
npm run build

# Build the desktop application npm/cargo
npm run tauri build
cargo tauri build
```

After the build:

- Web version: The build artifact is in the `dist` directory
- Desktop application: The build artifact is in the `src-tauri/target/release`

#### 📱 Page Introduction

##### 🏠 Home Page

The home page displays personal information (i.e. the project user), custom banner components; tournaments and mappools set to be pinned will appear on the home page.

##### 🏆 Tournament Page

The tournament page displays information about each tournament, clicking on the tournament details will show the participating players, as well as providing player home page entry and copy invite command functions.

##### 🗺️ Mappool Page

The mappool page displays the mappools for each tournament, providing beatmap home page entry, copy beatmap ID, download beatmap, and copy beatmap tournament command functions.

##### ⌨️ Command Page

The command page provides quick tournament command copying, and referee sheet component functions.

#### 🔧 Technology Stack

- 前端：Vue 3 + TypeScript + Vite ⚡
- 桌面应用：Tauri (Rust) 🦀
- UI 框架：Ant Design Vue 🐜
- 状态管理：Pinia 🍍
- 国际化：Vue I18n 🌍

#### 🤝 Contribution Guide

We welcome all new proposals and changes to this project! If there are feasible new feature proposals, we will implement them as soon as possible. You can contribute in the following ways:

##### 📝 Submit PR

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request✨

##### 🐛 Issue Feedback

If you find a bug or have a new feature suggestion, please submit an issue.

---

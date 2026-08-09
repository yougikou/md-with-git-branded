# md-with-git Branded Host

这是一个使用 React 构建的 **@md-with-git/viewer** Branded 宿主示例。它展示了如何把 `md-with-git` 文档阅读器作为 npm 包集成到已有产品中，并由宿主应用提供品牌、导航、主题和内容渲染能力。

## 包含内容

- 从 npm 引入 `@md-with-git/viewer`
- 使用 `@md-with-git/viewer/host` 注册宿主 Markdown 渲染器
- Northstar 品牌页头、导航和深浅主题切换
- 用 Vite + React Router 承载 `DocsViewer`
- GitHub Actions 自动构建并发布到 `gh-pages` 分支

## 本地运行

需要 Node.js 20+，并启用 Corepack：

```bash
corepack enable
pnpm install
pnpm dev
```

执行生产构建：

```bash
pnpm build
pnpm preview
```

## 关键集成

宿主在 `src/main.tsx` 中通过公开入口加载阅读器及其宿主 API：

```tsx
import { DocsViewer } from '@md-with-git/viewer';
import {
  DocsRendererProvider,
  createDocsRendererRegistry,
} from '@md-with-git/viewer/host';
import '@md-with-git/viewer/styles.css';
```

`DocsRendererProvider` 包裹文档路由，宿主可以在渲染器注册表中扩展 Markdown 节点的呈现方式，同时保留自身的品牌和页面框架。

## GitHub Pages

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会执行依赖安装、类型检查和 Vite 构建，并将 `dist` 发布到 `gh-pages` 分支。

首次发布后，请在 GitHub 仓库的 **Settings → Pages** 中选择：

- Source：**Deploy from a branch**
- Branch：`gh-pages` / `/(root)`

项目页会发布到：`https://yougikou.github.io/md-with-git-branded/`

工作流额外生成 `404.html`，让 GitHub Pages 在直接访问 React Router 的文档子路由时仍能加载应用。

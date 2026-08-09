import { lazy, StrictMode, Suspense, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import {
  DocsRendererProvider,
  createDocsRendererRegistry,
  useDocsHostConfiguration,
  type DocsTheme,
  type YamlBlockRendererProps,
} from '@md-with-git/viewer/host';
import '@md-with-git/viewer/styles.css';
import './styles.css';

const viewerPath = '/docs/vitejs/vite/docs/guide?scope=docs%2Fguide';
const DocsViewer = lazy(() => import('@md-with-git/viewer').then(({ DocsViewer: Viewer }) => ({ default: Viewer })));
const brandAsset = (fileName: string) => `${import.meta.env.BASE_URL}brand/${fileName}`;

const brand = {
  appName: 'Northstar Docs',
  mark: 'NS',
  document: {
    icon: { src: brandAsset('northstar-mark.svg'), alt: 'Northstar 星形标志' },
  },
  settings: {
    image: { src: brandAsset('settings-banner.svg'), alt: 'Northstar Knowledge base' },
  },
};

const themeColors = {
  light: {
    pageBackground: '#f6f8f2',
    surface: '#ffffff',
    raisedSurface: '#ffffff',
    text: '#10263f',
    mutedText: '#5b6d7f',
    border: '#dbe4d5',
    accent: '#235f65',
    accentSoft: '#e4f4e7',
    onAccent: '#ffffff',
    focusRing: '#9aca5c',
    codeBackground: '#eff4ec',
  },
  dark: {
    pageBackground: '#10263f',
    surface: '#173149',
    raisedSurface: '#203c55',
    text: '#f4f8f0',
    mutedText: '#b6c6d4',
    border: '#33536b',
    accent: '#d9f99d',
    accentSoft: '#294e56',
    onAccent: '#10263f',
    focusRing: '#d9f99d',
    codeBackground: '#0d2035',
  },
} satisfies Record<DocsTheme, Record<string, string>>;

function Announcement({ children }: { children: ReactNode }) {
  return <aside className="northstar-announcement"><span className="announcement-dot" />{children}</aside>;
}

function ReleaseNoteRenderer({ value }: YamlBlockRendererProps) {
  const note = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const title = typeof note.title === 'string' ? note.title : '产品更新';
  const description = typeof note.description === 'string' ? note.description : '此区块需要 title 和 description。';
  const status = typeof note.status === 'string' ? note.status : '已发布';
  return <section className="northstar-release-note"><span>{status}</span><div><strong>{title}</strong><p>{description}</p></div></section>;
}

const registry = createDocsRendererRegistry();
registry.registerYamlRenderer('northstar-release', ReleaseNoteRenderer);

function ThemeControl() {
  const { theme, setTheme } = useDocsHostConfiguration();
  const nextTheme: DocsTheme = theme === 'light' ? 'dark' : 'light';
  return <button className="theme-control" type="button" onClick={() => setTheme(nextTheme)}>{theme === 'light' ? '切换夜间模式' : '切换日间模式'}</button>;
}

function Home() {
  return <main className="northstar-home">
    <section className="northstar-hero">
      <Announcement>团队文档体验已焕新：统一品牌、版本与可检索的知识。</Announcement>
      <p className="northstar-eyebrow">NORTHSTAR / KNOWLEDGE OPERATIONS</p>
      <h1>让每一份决策，<br /><em>都有清晰的来处。</em></h1>
      <p className="northstar-intro">这是一个 React 宿主 branding 示例：品牌、主题令牌、受信任的 Markdown 扩展与产品导航均由宿主控制；文档内容始终来自 Git。</p>
      <div className="northstar-actions">
        <Link className="northstar-primary" to={viewerPath}>打开品牌化文档 <span>→</span></Link>
        <a className="northstar-secondary" href="https://github.com/yougikou/md-with-git" target="_blank" rel="noreferrer">查看集成源码</a>
      </div>
      <div className="northstar-proof"><div><strong>Git-native</strong><span>文档内容与版本保持同源</span></div><div><strong>Host-owned</strong><span>主题与扩展由 React 宿主掌控</span></div><div><strong>Read-only</strong><span>阅读器不修改你的仓库</span></div></div>
    </section>
    <aside className="northstar-panel" aria-label="branding integration overview">
      <img src={brandAsset('northstar-mark.svg')} alt="" />
      <span className="northstar-panel-kicker">BRANDING CONTRACT</span>
      <h2>一个受控的文档表面。</h2>
      <ul><li><span>01</span>DocsRendererProvider 提供品牌与主题</li><li><span>02</span>Renderer registry 白名单渲染扩展</li><li><span>03</span>Viewer 只读取 Git 文档空间</li></ul>
      <Link to={viewerPath}>进入示例文档 <span>↗</span></Link>
    </aside>
  </main>;
}

function Shell() {
  return <div className="northstar-shell">
    <header className="northstar-header">
      <Link className="northstar-wordmark" to="/"><img src={brandAsset('northstar-mark.svg')} alt="" /><span>northstar</span><small>docs</small></Link>
      <nav aria-label="主导航"><Link to="/">概览</Link><Link to={viewerPath}>文档中心</Link><a href="https://www.npmjs.com/package/@md-with-git/viewer" target="_blank" rel="noreferrer">npm 包</a></nav>
      <ThemeControl />
    </header>
    <Routes><Route path="/" element={<Home />} /><Route path="/docs/*" element={<Suspense fallback={<div className="northstar-viewer-loading">正在加载文档中心…</div>}><DocsViewer /></Suspense>} /><Route path="*" element={<Home />} /></Routes>
  </div>;
}

function App() {
  return <DocsRendererProvider registry={registry} theme="light" themeColors={themeColors} branding={brand}><BrowserRouter basename={import.meta.env.BASE_URL}><Shell /></BrowserRouter></DocsRendererProvider>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

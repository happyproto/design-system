import type { Meta, StoryObj } from "@storybook/react";
import "../../src/components.css";

const meta: Meta = { title: "Components/Workbench" };
export default meta;

const stack = { display: "grid", gap: "var(--hp-space-6)", padding: "var(--hp-space-8)", maxInlineSize: "44rem" } as const;

export const Terminal: StoryObj = {
  render: () => (
    <div style={stack}>
      <figure className="hp-term">
        <figcaption className="hp-term-bar">
          <span className="hp-term-title">~/my-app</span>
          <button className="hp-term-copy" type="button">Copy</button>
        </figcaption>
        <pre className="hp-term-body">
          <span className="hp-term-line hp-term-comment"># Start the project, and keep happyview.lock as it is</span>
          <span className="hp-term-line hp-term-cmd"><span className="hp-term-program">cd</span> my-app</span>
          <span className="hp-term-line hp-term-cmd"><span className="hp-term-program">hpy</span> happyview dev <span className="hp-term-flag">--locked</span></span>
          <span className="hp-term-line hp-term-out">happyview dev: serving /home/you/my-app at <a href="#local">http://127.0.0.1:3000</a></span>
          <span className="hp-term-line hp-term-out">dashboard: <a href="#dashboard">http://127.0.0.1:3000/dashboard/</a></span>
        </pre>
      </figure>
      <figure className="hp-term">
        <figcaption className="hp-term-bar">
          <span className="hp-term-title">~/my-app</span>
          <button className="hp-term-copy" type="button">Copy</button>
        </figcaption>
        <pre className="hp-term-body">
          <span className="hp-term-line hp-term-cmd"><span className="hp-term-program">curl</span> <span className="hp-term-string">'http://127.0.0.1:3000/xrpc/com.example.hello?name=Ada'</span></span>
        </pre>
        <div className="hp-term-result">
          <p className="hp-term-result-label">Output</p>
          <pre className="hp-term-body">{'{"message":"Hello, Ada!"}'}</pre>
        </div>
      </figure>
      <figure className="hp-term">
        <figcaption className="hp-term-bar"><span className="hp-term-title">hpy happyview dev</span></figcaption>
        <pre className="hp-term-body">
          <span className="hp-term-line" data-state="done">built in 12 ms</span>
          <span className="hp-term-line" data-state="warning">happyview.toml: restart required to apply</span>
          <span className="hp-term-line" data-state="failed"><span><span className="hp-term-where">src/lexicons/com/example/hello.lua:2</span> build failed; still serving the previous build</span></span>
        </pre>
      </figure>
    </div>
  ),
};

const tree = (current = true) => (
  <ul>
    <li>
      <details open>
        <summary className="hp-tree-row" data-kind="dir">my-app/</summary>
        <ul>
          <li className="hp-tree-row" data-type="config">happyview.toml</li>
          <li className="hp-tree-row" data-type="config">happyview.lock</li>
          <li className="hp-tree-row"><span className="hp-tree-dim">.env.example</span></li>
          <li className="hp-tree-row" data-type="data"><span className="hp-tree-dim">.luarc.json</span></li>
          <li>
            <details open>
              <summary className="hp-tree-row" data-kind="dir">src<span className="hp-tree-fold">/lexicons/com/example/</span></summary>
              <ul>
                <li className="hp-tree-row" data-type="data">hello.json<span className="hp-tree-note">lexicon</span></li>
                <li className="hp-tree-row" data-type="script" aria-current={current || undefined}>hello.lua<span className="hp-tree-note">script</span></li>
              </ul>
            </details>
          </li>
        </ul>
      </details>
    </li>
  </ul>
);

export const FileTree: StoryObj = {
  render: () => (
    <div style={stack}>
      <figure className="hp-tree" aria-label="Files in my-app">{tree()}</figure>
    </div>
  ),
};

const code = `function handle(input, ctx)
  return { message = "Hello, " .. (input.name or "world") .. "!" }
end`;

const pane = (
  <div className="hp-editor-pane">
    <div className="hp-editor-tabs"><span className="hp-editor-tab" data-type="script">hello.lua</span></div>
    <p className="hp-editor-path">src › lexicons › com › example › <b>hello.lua</b></p>
    <div className="hp-editor-body">
      <pre className="hp-term-body" style={{ fontFamily: "var(--hp-font-mono)", fontSize: "var(--hp-text-sm)" }}>{code}</pre>
    </div>
  </div>
);

export const Editor: StoryObj = {
  render: () => (
    <div style={stack}>
      <figure className="hp-editor" aria-label="src/lexicons/com/example/hello.lua">{pane}</figure>
      <figure className="hp-editor" aria-label="my-app">
        <div className="hp-tree">{tree()}</div>
        {pane}
      </figure>
    </div>
  ),
};

export const Callouts: StoryObj = {
  render: () => (
    <div style={stack}>
      <aside className="hp-callout"><p className="hp-callout-title">Note</p><p>A local instance doesn’t backfill unless you <a href="#backfill">turn it on</a>.</p></aside>
      <aside className="hp-callout" data-kind="tip"><p className="hp-callout-title">Tip</p><p>CI runs with <code>--locked</code>, so a stale lock fails the build.</p></aside>
      <aside className="hp-callout" data-kind="caution"><p className="hp-callout-title">Writes go to the real network</p><p>Develop with a test account, not the one you use day to day.</p></aside>
      <aside className="hp-callout" data-kind="danger"><p className="hp-callout-title">Danger</p><p><code>--reset</code> deletes the local network’s data.</p></aside>
    </div>
  ),
};

const rows: [string, string, string][] = [
  ["src/lexicons/com/example/hello.json", "A lexicon. Its id must equal its path: com.example.hello", "none"],
  ["src/lexicons/com/example/hello.lua", "The script for a query or procedure lexicon beside it", "xrpc.query:com.example.hello"],
  ["src/jobs/export.lua", "A job script", "job.run:export"],
];

export const Table: StoryObj = {
  render: () => (
    <div style={stack}>
      <div className="hp-table-scroll" role="region" aria-label="Table: src" tabIndex={0}>
        <table className="hp-table" role="table">
          <thead role="rowgroup">
            <tr role="row"><th role="columnheader">Path</th><th role="columnheader">What it is</th><th role="columnheader">Trigger</th></tr>
          </thead>
          <tbody role="rowgroup">
            {rows.map(([path, what, trigger]) => (
              <tr role="row" key={path}>
                <td role="cell" data-label="Path"><code>{path.split("/").flatMap((p, i, all) => (i < all.length - 1 ? [p, "/", <wbr key={i} />] : [p]))}</code></td>
                <td role="cell" data-label="What it is">{what}</td>
                <td role="cell" data-label="Trigger"><code>{trigger}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
};

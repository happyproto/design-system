/**
 * Reference markup for the happyproto.at landing page.
 *
 * happyproto.at/src/components/*.astro mirror these one to one, with the same
 * elements, classes, attributes and order. SignupForm's markup is a contract
 * with happyproto.at/src/scripts/signup.ts; the `data-reveal` rows (the
 * table's and the FAQ's) with happyproto.at/src/scripts/reveal.ts; and the
 * `data-play` windows (the hero's stage and the three sample panels), their
 * `data-step` parts and `data-count-from` figures with
 * happyproto.at/src/scripts/play.ts. Change both together.
 *
 * Two deliberate differences. The release count is read from GitHub when
 * happyproto.at is built (src/lib/releases.ts); the story shows the
 * fallback. And the page's header logo is one <picture> (a dark-scheme
 * source over the light one, chosen by `prefers-color-scheme`), so the
 * browser fetches exactly one file; Storybook switches themes with
 * `data-theme` from its toolbar, which a media query can't see, so the
 * story keeps two logos and shows one, by the story-only rules in
 * storybook-logo.css (the page never ships them).
 */
import { Fragment, type ReactNode } from "react";
import {
  compare,
  credentials,
  cta,
  faq,
  footer,
  header,
  hero,
  leadingPunctuation,
  parts,
  releaseCount,
  shortAddress,
  signup,
  slot,
  type Line,
  type Link,
  type SignupState,
  CROSS,
  features,
  figure,
  stage,
} from "./content";
import logoOnLight from "./assets/logotype.dark.svg";
import logoOnDark from "./assets/logotype.light.svg";
import "./marketing.css";
import "./storybook-logo.css";

/** A template with each `{slot}` filled from `fill`; a slot with nothing to fill it is left out. */
function Template({ text, fill }: { text: string; fill: Record<string, ReactNode> }) {
  return (
    <>
      {parts(text).map((part, i) => (
        <Fragment key={i}>{typeof part === "string" ? part : fill[part.slot]}</Fragment>
      ))}
    </>
  );
}

/** Text whose `{slots}` are links: each a real inline <a>, unmarked (see the external-link rule in marketing.css). */
function Linked({ text, links = {} }: { text: string; links?: Record<string, Link> }) {
  const fill = Object.fromEntries(
    Object.entries(links).map(([name, link]) => [
      name,
      <a className="mk-link mk-inline-link" href={link.href}>
        {link.label}
      </a>,
    ]),
  );
  return <Template text={text} fill={fill} />;
}

// ---- Signup -------------------------------------------------------------------

/** The page's own catches (`invalid`, `empty`, `noAt`, `domain`) and the server's refusal (`rejected`). */
type InvalidMessage = "invalid" | "empty" | "noAt" | "domain" | "rejected";

type SignupFormProps = {
  id: string;
  /** The form's own id, for in-page links (`join` on the hero, `signup` at the close). */
  anchor?: string;
  /** The hero form: its own accessible name, no helper (its status line is empty at rest), and an h2 for its success heading (the closing form's is an h3). */
  hero?: boolean;
  state?: SignupState;
  /** Which invalid message to show: typos, a blank field, no @, the part after the @, or the server's refusal. */
  invalid?: InvalidMessage;
  email?: string;
  /** The follow-up after success: open, on its way, sent, or failed to save. */
  note?: "open" | "sending" | "sent" | "unavailable";
};

/** A value that earns each invalid message, for the stories. */
const INVALID_VALUE: Record<InvalidMessage, string> = {
  invalid: "ada lovelace@example.com",
  empty: "",
  noAt: "ada.example.com",
  domain: "ada@example",
  rejected: "ada@example.com",
};

const NOTE_TEXT = { open: "", sending: signup.note.sending, sent: signup.note.sent, unavailable: signup.note.unavailable };
/** The note the stories send. */
const SAMPLE_NOTE = "A book club on Statusphere";

/** The address as signup.ts renders it: in full, or shortened on screen with the full one for screen readers. */
function Address({ email }: { email: string }) {
  const short = shortAddress(email);
  if (short === email) return <>{email}</>;
  return (
    <>
      <span aria-hidden="true">{short}</span>
      <span className="mk-sr-only">{email}</span>
    </>
  );
}

/** The warning mark before "unavailable": an authored triangle with a bar and a dot, at the text's size. */
function WarningIcon() {
  return (
    <svg className="mk-signup-warning" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2 14.5 13.5h-13L8 2ZM8 6.5v3M8 11.5v.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The status line's content for one state, as signup.ts renders it. At rest it is the form's helper. */
function StatusText({ state, email, invalid, idle }: { state: SignupState; email: string; invalid: InvalidMessage; idle: string }) {
  if (state === "success") return <Template text={signup.status.success} fill={{ email: <Address email={email} /> }} />;
  if (state === "unavailable")
    return (
      <>
        <WarningIcon />
        <Linked text={signup.status.unavailable} links={signup.links} />
      </>
    );
  if (state === "invalid" && invalid === "rejected") return <Linked text={signup.status.rejected} links={signup.links} />;
  if (state === "invalid") return <>{signup.status[invalid]}</>;
  if (state === "idle") return <>{idle}</>;
  return <>{signup.status[state]}</>;
}

/** The no-JavaScript note under a form, with the Bluesky profile as a real link. */
export function NoscriptNote() {
  return (
    <p className="mk-noscript">
      <Linked text={signup.noscript} links={signup.links} />
    </p>
  );
}

/**
 * Renders one static state. In the real page, signup.ts drives the
 * transitions. Email and button share a row from 30rem. After a join, the
 * fields give way to the success heading ("You’re on the waitlist.", which
 * takes focus), the status line and the optional follow-up note, with its
 * hint under its label; the form may grow (marketing.css). The note's status
 * line takes no room until it has something to say, so "Sign up another
 * address" sits right under the note. Once the note is sent, the field and
 * Send give way to the note itself as static text in a muted quote block,
 * then the thanks, which takes focus. Under them, the one next step (the
 * tutorial), once per form: under the unsent note, or right under the
 * thanks. On success the status lines give up their reserved lines (the
 * visitor's own doing, so the move is allowed). The note is described by its hint and
 * the success line. Each form is a named form landmark, the two told
 * apart.
 */
export function SignupForm({
  id,
  anchor,
  hero: isHero = false,
  state = "idle",
  invalid = "invalid",
  email = "ada@example.com",
  note = "open",
}: SignupFormProps) {
  // Unavailable is the service's fault, not the visitor's: said in the ink with a warning mark, not the error colour.
  const tone = state === "invalid" ? "error" : state === "success" ? "success" : state === "unavailable" ? "warning" : "muted";
  const invalidValue = INVALID_VALUE[invalid];
  const idle = isHero ? "" : signup.status.idle;
  const Joined = isHero ? "h2" : "h3";
  return (
    <form
      className="mk-signup"
      id={anchor}
      aria-label={isHero ? hero.formName : cta.formName}
      data-signup=""
      data-source={id}
      data-state={state}
      noValidate
    >
      <div className="mk-signup-fields">
        <label className="mk-signup-label" htmlFor={`signup-email-${id}`}>
          {signup.label}
        </label>
        <div className="mk-signup-row">
          <input
            className="mk-signup-input"
            id={`signup-email-${id}`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={signup.placeholder}
            required
            aria-describedby={`signup-status-${id}`}
            aria-invalid={state === "invalid"}
            defaultValue={state === "invalid" ? invalidValue : state === "idle" ? undefined : email}
          />
          <button className="mk-signup-submit" type="submit" disabled={state === "submitting"}>
            {signup.button}
          </button>
        </div>
      </div>
      <div className="mk-signup-trap" aria-hidden="true">
        <label>
          {signup.trapLabel} <input name="hp_trap" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Joined className="mk-signup-joined" tabIndex={-1}>
        {signup.joined}
      </Joined>
      <p className="mk-signup-status" id={`signup-status-${id}`} role="status" aria-live="polite" data-tone={tone}>
        <StatusText state={state} email={email} invalid={invalid} idle={idle} />
      </p>
      <div className="mk-signup-followup" data-note={note === "open" ? undefined : note}>
        <div className="mk-signup-note-fields">
          <label className="mk-signup-label" htmlFor={`signup-note-${id}`}>
            {signup.note.label} <span className="mk-signup-optional">{signup.note.optional}</span>
          </label>
          <p className="mk-signup-hint" id={`signup-note-hint-${id}`}>
            {signup.note.hint}
          </p>
          <div className="mk-signup-row">
            <textarea
              className="mk-signup-input mk-signup-note"
              id={`signup-note-${id}`}
              name="note"
              rows={2}
              maxLength={signup.note.max}
              aria-describedby={`signup-note-hint-${id} signup-status-${id} signup-note-status-${id}`}
              defaultValue={note === "open" ? undefined : SAMPLE_NOTE}
            />
            <button className="mk-button-secondary mk-signup-send" type="button" data-signup-send="" disabled={note === "sending"}>
              {signup.note.button}
            </button>
          </div>
        </div>
        <blockquote className="mk-signup-sent" id={`signup-note-sent-${id}`}>
          {note === "sent" ? SAMPLE_NOTE : ""}
        </blockquote>
        <p className="mk-signup-note-status" id={`signup-note-status-${id}`} role="status" aria-live="polite" tabIndex={-1}>
          {NOTE_TEXT[note]}
        </p>
        <p className="mk-signup-next">
          <Linked text={signup.next.text} links={signup.next.links} />
        </p>
        <button className="mk-text-button" type="button" data-signup-reset="">
          {signup.reset}
        </button>
      </div>
    </form>
  );
}

/**
 * A form with the no-JavaScript note after it, as the page renders both.
 * Without JavaScript the form is hidden, and its status line with it; the
 * note says why.
 */
export function SignupBlock(props: SignupFormProps) {
  return (
    <>
      <SignupForm {...props} />
      <noscript>
        <NoscriptNote />
      </noscript>
    </>
  );
}

// ---- Sample panels: the window, its marks and its code ------------------------------------

/** A small tick, at the text's size: a step done, a plugin installed. */
function OkIcon() {
  return (
    <svg className="mk-ok-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** One line of sample code: each token a span in its colour, after a line number (CSS). */
function SourceLines({ lines }: { lines: Line[] }) {
  return (
    <ol className="mk-src">
      {lines.map((line, i) => (
        <li className="mk-src-line" data-step="" key={i}>
          <span className="mk-src-text">
            {line.map(([kind, text], j) => (
              <span className={`mk-t-${kind}`} key={j}>
                {text}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** A type or runtime tag: `record`, `query`, `procedure`, `Lua`, `auth`, `WASM`, `completed`. */
function Tag({ kind, children }: { kind: string; children: ReactNode }) {
  return (
    <span className="mk-tag" data-kind={kind}>
      {children}
    </span>
  );
}

/** A figure that ticks up from `from` to its own value as its panel plays (play.ts); settled, it is just the number. */
function Figure({ value, from }: { value: number; from: number }) {
  return (
    <span className="mk-figure" data-count-from={from}>
      {figure(value)}
    </span>
  );
}

/**
 * A sample window: three dots, the instance's URL and a `Sample` chip, then
 * its body (and an optional footer strip). One image to assistive
 * technology, named by `name`; its contents are aria-hidden (in case a
 * browser exposes an image's children), so its code is never read line by
 * line. Always dark (data-theme="dark" scopes the dark tokens onto it):
 * the product glows on the light page. A `data-play` panel: it plays once as it comes into view (play.ts), its
 * `data-step` parts arriving one after another; settled without
 * JavaScript, with reduced motion and in print.
 */
function Window({ name, className, children, foot }: { name: string; className?: string; children: ReactNode; foot?: ReactNode }) {
  return (
    <div className={`mk-window${className ? ` ${className}` : ""}`} role="img" aria-label={name} data-play="" data-theme="dark">
      <div className="mk-window-content" aria-hidden="true">
        <div className="mk-window-bar">
          <span className="mk-window-dots">
            <span />
            <span />
            <span />
          </span>
          <span className="mk-window-url">{stage.url}</span>
          <span className="mk-sample">{stage.sample}</span>
        </div>
        {children}
        {foot}
      </div>
    </div>
  );
}

// ---- The hero's product stage ---------------------------------------------------------------

/**
 * The Statusphere example as a HappyView instance shows it: the Lexicons
 * list (each NSID with its type, its Lua script, and the record lexicon's
 * finished backfill), and the listStatuses query answering 200. Under them,
 * a footer strip: Jetstream connected, and the records indexed, a count
 * that ticks up as the stage plays. Full content width under the form;
 * from 48rem the list sits beside the response, below it, above.
 */
export function Stage() {
  return (
    <Window
      name={stage.name}
      className="mk-stage"
      foot={
        <div className="mk-window-foot">
          <span className="mk-live">
            <span className="mk-live-dot" />
            {stage.footer.jetstream} · {stage.footer.connected}
          </span>
          <span className="mk-indexed">
            {stage.footer.indexed} <Figure value={stage.footer.count} from={stage.footer.from} />
          </span>
        </div>
      }
    >
      <div className="mk-window-body mk-stage-body">
        <div className="mk-stage-side">
          <p className="mk-panel-head">
            <span>{stage.lexicons.title}</span>
            <span className="mk-panel-count">{stage.lexicons.rows.length}</span>
          </p>
          <div className="mk-lexicons">
            {stage.lexicons.rows.map((row) => (
              <div className="mk-lexicon" key={row.nsid}>
                <span className="mk-nsid">{row.nsid}</span>
                <span className="mk-tags">
                  <Tag kind={row.type}>{row.type}</Tag>
                  {row.lua && <Tag kind="lua">{stage.lexicons.lua}</Tag>}
                  <span className="mk-lexicon-meta" data-done={row.done ? "" : undefined}>
                    {row.done && <OkIcon />}
                    {row.meta}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <span className="mk-ghost-button">{stage.lexicons.add}</span>
        </div>
        <div className="mk-stage-main">
          <div className="mk-request" data-step="">
            <span className="mk-method">{stage.request.method}</span>
            <span className="mk-path">{stage.request.path}</span>
            <span className="mk-http">
              <span className="mk-live-dot" />
              {stage.request.status} {stage.request.statusText}
            </span>
          </div>
          <SourceLines lines={stage.response} />
        </div>
      </div>
    </Window>
  );
}

// ---- One point per section: the three sample panels -------------------------------------------

/** Jetstream connected, and the Statusphere record lexicon's backfill job through its stages, with its counters. */
export function NetworkPanel() {
  const n = features.network;
  return (
    <Window name={n.name} className="mk-panel">
      <div className="mk-window-body mk-panel-body">
        <div className="mk-panel-row" data-step="">
          <span className="mk-live">
            <span className="mk-live-dot" />
            {n.jetstream.label}
          </span>
          <span className="mk-panel-state">{n.jetstream.state}</span>
          <span className="mk-nsid">{n.jetstream.filter}</span>
        </div>
        <div className="mk-job">
          <div className="mk-job-head" data-step="">
            <span className="mk-job-title">{n.job.title}</span>
            <span className="mk-nsid">{n.job.collection}</span>
            <Tag kind="done">{n.job.status}</Tag>
          </div>
          <div className="mk-meter" data-step="">
            <span className="mk-meter-fill" />
          </div>
          <ol className="mk-steps">
            {n.job.stages.map((s) => (
              <li className="mk-step" data-step="" key={s.id}>
                <OkIcon />
                <span className="mk-step-label">{s.label}</span>
                <span className="mk-step-id">{s.id}</span>
              </li>
            ))}
          </ol>
          <div className="mk-counters">
            {n.job.counters.map((c) => (
              <div className="mk-counter" data-step="" key={c.field}>
                <span className="mk-counter-label">{c.label}</span>
                <span className="mk-counter-value">
                  <Figure value={c.value} from={c.from} />
                  {c.of !== undefined && <span className="mk-counter-of"> / {figure(c.of)}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

/** The listStatuses Lua script, then an installed WASM plugin. */
export function PluginsPanel() {
  const p = features.plugins;
  return (
    <Window name={p.name} className="mk-panel">
      <div className="mk-window-body mk-panel-body">
        <div className="mk-panel-row" data-step="">
          <span className="mk-nsid">{p.file.nsid}</span>
          <Tag kind={p.file.type}>{p.file.type}</Tag>
          <Tag kind="lua">{p.file.lang}</Tag>
        </div>
        <SourceLines lines={p.code} />
        <p className="mk-panel-head" data-step="">
          <span>{p.plugins.title}</span>
        </p>
        {p.plugins.rows.map((row) => (
          <div className="mk-panel-row mk-plugin" data-step="" key={row.name}>
            <span className="mk-nsid">{row.name}</span>
            <Tag kind={row.kind}>{row.kind}</Tag>
            <Tag kind="wasm">{row.runtime}</Tag>
            <span className="mk-ok">
              <OkIcon />
              {row.state}
            </span>
          </div>
        ))}
      </div>
    </Window>
  );
}

/** An available HappyView version, the snapshot already taken, and the two choices. */
export function UpgradesPanel() {
  const u = features.upgrades;
  return (
    <Window name={u.name} className="mk-panel">
      <div className="mk-window-body mk-panel-body">
        <p className="mk-panel-head" data-step="">
          <span>{u.product}</span>
        </p>
        <div className="mk-versions" data-step="">
          <span className="mk-version">
            <span className="mk-version-label">{u.running.label}</span>
            <span className="mk-version-num">{u.running.version}</span>
          </span>
          <svg className="mk-version-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 8h11M9.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="mk-version" data-next="">
            <span className="mk-version-label">{u.available.label}</span>
            <span className="mk-version-num">{u.available.version}</span>
          </span>
        </div>
        <div className="mk-ok mk-snapshot" data-step="">
          <OkIcon />
          {u.snapshot}
        </div>
        <div className="mk-choices" data-step="">
          <span className="mk-choice" data-primary="">
            {u.install}
          </span>
          <span className="mk-choice">{u.hold}</span>
        </div>
      </div>
    </Window>
  );
}

const PANELS = { network: NetworkPanel, plugins: PluginsPanel, upgrades: UpgradesPanel };

/**
 * One point: a big headline, one short line and its panel. From 64rem the
 * copy takes five columns and the panel seven, side by side, the panel on
 * the right, or on the left where `flip` is set (the markup order, copy
 * then panel, is the reading order at every width). Below, stacked.
 */
export function Feature({ which, ground, flip }: { which: keyof typeof features; ground?: boolean; flip?: boolean }) {
  const f = features[which];
  const Panel = PANELS[which];
  return (
    <section
      className="mk-section mk-feature"
      id={f.id}
      aria-labelledby={`${f.id}-title`}
      data-ground={ground ? "surface" : undefined}
      data-flip={flip ? "" : undefined}
    >
      <div className="mk-container mk-grid mk-feature-grid mk-cells">
        <div className="mk-feature-copy mk-cell-head">
          <p className="mk-eyebrow" aria-hidden="true">
            {f.eyebrow}
          </p>
          <h2 className="mk-section-title" id={`${f.id}-title`}>
            {f.title}
          </h2>
          <p className="mk-feature-line">{f.line}</p>
        </div>
        <Panel />
      </div>
    </section>
  );
}

// ---- Credential line ------------------------------------------------------------------

/**
 * Under the hero's stage: one small muted row, centred where it fits on one
 * line (48rem), at every width. Where it comes from (plain text, no name or
 * link), the licence and the release cadence (a link to the releases it
 * counts, with the external-link icon). Apart by space and hairlines, never
 * bullets; the frame clips the hairline that would start a line
 * (marketing.css). `releaseTotal` is the count of stable releases the page
 * read from GitHub when it was built (also on the link as `data-total`, so
 * tests can tell a derived count from the fallback); the story leaves it out
 * and shows the fallback, as the page does when GitHub can't be read.
 */
export function Credentials({ releaseTotal }: { releaseTotal?: number | null }) {
  return (
    <div className="mk-credentials">
      <div className="mk-credentials-frame">
        <ul role="list">
          {credentials.items.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
          <li>
            <a className="mk-link" href={credentials.releases.href} data-total={releaseTotal ?? undefined}>
              {releaseCount(releaseTotal)}
              <ExternalIcon />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ---- What HappyProto runs for you ------------------------------------------------------

/** A cell's mark: a tick or a cross at one weight, decorative; the cell says what it means to screen readers. */
function Mark({ value }: { value: string }) {
  return (
    <>
      <svg className="mk-check" viewBox="0 0 16 16" fill="none" aria-hidden="true" data-mark={value === CROSS ? "no" : "yes"}>
        <path
          d={value === CROSS ? "M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5" : "M3 8.5 6.5 12 13 4.5"}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="mk-sr-only">{compare.marks[value].label}</span>
    </>
  );
}

/**
 * Named by its section's heading (`aria-labelledby="compare-title"`).
 * Explicit table roles throughout. A table at every width: the job, then
 * HappyProto's mark, then the self-hosted one, each column of marks
 * centred. Each row is a `data-reveal` row: it arrives as it enters the
 * viewport (reveal.ts), and its marks land with it.
 */
export function CompareTable() {
  return (
    <table className="mk-compare" role="table" aria-labelledby="compare-title">
      <colgroup>
        <col className="mk-compare-col-what" />
        <col className="mk-compare-col-hosted" />
        <col className="mk-compare-col-self" />
      </colgroup>
      <thead role="rowgroup">
        <tr role="row">
          <th scope="col" role="columnheader">
            <span className="mk-sr-only">{compare.columns.what}</span>
          </th>
          <th scope="col" role="columnheader" data-col="hosted">
            {compare.columns.hosted}
          </th>
          <th scope="col" role="columnheader" data-col="self">
            {compare.columns.self}
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        {compare.rows.map((row) => (
          <tr role="row" data-reveal="" key={row.what}>
            <th scope="row" role="rowheader">
              {row.what}
            </th>
            <td role="cell" data-col="hosted">
              <Mark value={row.hosted} />
            </td>
            <td role="cell" data-col="self">
              <Mark value={row.self} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---- FAQ --------------------------------------------------------------------

/**
 * One column at every width, one item per row, apart by hairlines. Each
 * question ends in a `#` permalink to its own item: a real link, named
 * "Link to this question: " and the question (unique, so it makes sense out
 * of context; no description, which would say the question twice), with a
 * 44px hit area that adds nothing to the line's height. Where the device can
 * hover, out of sight (clipped, not faded) until the item is hovered, the
 * link is focused or the item is the page's target (which also gets a 2px
 * accent edge); on touch, always shown in the muted ink. One tab stop per
 * item. Each item is a `data-reveal` row, like the table's.
 */
export function Faq() {
  return (
    <dl className="mk-faq">
      {faq.items.map((item) => (
        <div className="mk-faq-item" id={item.id} data-reveal="" key={item.q}>
          <dt className="mk-faq-q">
            <span>{item.q}</span>{" "}
            <a className="mk-faq-link" href={`#${item.id}`} aria-label={faq.permalink.label.replace("{q}", item.q)}>
              {faq.permalink.text}
            </a>
          </dt>
          <dd className="mk-faq-a">
            <Linked text={item.a} links={item.links} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ---- Chrome ------------------------------------------------------------------------------

/** External link: a box with an arrow leaving its corner, drawn at the link's text size. */
function ExternalIcon() {
  return (
    <svg className="mk-link-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.5 2.5h4v4M13.5 2.5 7.5 8.5M12 9.5v3a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Storybook keeps two logos (see the note at the top of this file); the page uses one <picture>. */
export function SiteHeader() {
  return (
    <header className="mk-header">
      <a className="mk-link mk-skip" href={header.skip.href}>
        {header.skip.label}
      </a>
      <div className="mk-container mk-header-inner">
        <a className="mk-header-home" href="/">
          <img
            className="mk-logo mk-logo-on-light"
            src={logoOnLight}
            alt={header.logoAlt}
            width={1000}
            height={233}
            decoding="async"
          />
          <img
            className="mk-logo mk-logo-on-dark"
            src={logoOnDark}
            alt={header.logoAlt}
            width={1000}
            height={233}
            decoding="async"
          />
        </a>
        <nav className="mk-header-actions" aria-label={header.nav}>
          <a
            className="mk-button-primary mk-header-join"
            href={header.join.href}
            aria-label={header.join.name}
            data-join-link=""
          >
            {header.join.label}
          </a>
          <a className="mk-link mk-header-faq" href={header.faq.href}>
            {header.faq.label}
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mk-footer">
      <div className="mk-container mk-footer-inner">
        <p>{footer.copyright}</p>
        <ul className="mk-footer-links" role="list">
          {footer.links.map((link) => (
            <li key={link.href}>
              <a className="mk-link" href={link.href}>
                {link.label}
                <ExternalIcon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

const [subBefore, subRest] = slot(hero.sub, "host");
// The full stop after the host travels with it, so it never starts a line.
const [subPunct, subAfter] = leadingPunctuation(subRest);

/** The status pill above the H1: a small chip, its tag ("Beta") filled, the rest in the muted ink. */
export function HeroPill() {
  return (
    <p className="mk-pill">
      <span className="mk-pill-tag">{hero.pill.tag}</span>{" "}
      <span className="mk-pill-sep" aria-hidden="true">
        ·
      </span>{" "}
      <span>{hero.pill.text}</span>
    </p>
  );
}

/** The hero's one line of value, the host as unbreakable code with its full stop. */
export function HeroSub() {
  return (
    <p className="mk-lede">
      {subBefore}
      <span className="mk-host">
        <code className="mk-code">{hero.host}</code>
        {subPunct}
      </span>
      {subAfter}
    </p>
  );
}

/** The whole page, in the order happyproto.at/src/pages/index.astro renders it. */
export function LandingPage() {
  return (
    <div className="mk-page">
      <SiteHeader />
      <main className="mk-main" id="main" tabIndex={-1}>
        <section className="mk-hero" aria-labelledby="hero-title" data-backdrop="">
          <div className="mk-container mk-hero-inner">
            <div className="mk-hero-copy">
              <HeroPill />
              <h1 className="mk-title" id="hero-title">
                {hero.title}
              </h1>
              <HeroSub />
              <div className="mk-hero-signup">
                <SignupBlock id="hero" anchor={hero.anchor} hero />
              </div>
            </div>
            <div className="mk-stage-wrap">
              <p className="mk-eyebrow" aria-hidden="true">
                {stage.eyebrow}
              </p>
              <div className="mk-stage-frame">
                <Stage />
              </div>
            </div>
            <Credentials />
          </div>
        </section>
        <Feature which="network" />
        <Feature which="plugins" flip />
        <Feature which="upgrades" />
        <section className="mk-section mk-split" aria-labelledby="compare-title">
          <div className="mk-container mk-grid mk-split-grid mk-cells">
            <div className="mk-section-head mk-cell-head">
              <p className="mk-eyebrow" aria-hidden="true">
                {compare.eyebrow}
              </p>
              <h2 className="mk-section-title" id="compare-title">
                {compare.title}
              </h2>
            </div>
            <CompareTable />
          </div>
        </section>
        <section className="mk-section mk-split" id={faq.anchor} aria-labelledby="faq-title">
          <div className="mk-container mk-grid mk-split-grid mk-cells">
            <div className="mk-section-head mk-cell-head">
              <p className="mk-eyebrow" aria-hidden="true">
                {faq.eyebrow}
              </p>
              <h2 className="mk-section-title" id="faq-title">
                {faq.title}
              </h2>
            </div>
            <Faq />
          </div>
        </section>
        <section className="mk-section mk-cta-section" data-backdrop="">
          <div className="mk-container mk-cta">
            <h2 className="mk-section-title" id="cta-title">
              {cta.title}
            </h2>
            <div className="mk-cta-signup">
              <SignupBlock id="footer" anchor={cta.anchor} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

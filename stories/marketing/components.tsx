/**
 * Reference markup for the happyproto.at landing page.
 *
 * happyproto.at/src/components/*.astro mirror these one to one, with the same
 * elements, classes, attributes and order. SignupForm's markup is a contract
 * with happyproto.at/src/scripts/signup.ts; the `data-reveal` rows (the
 * FAQ's) with happyproto.at/src/scripts/reveal.ts; and the `data-play`
 * windows (the hero's stage and the four sample panels), their
 * `data-step` parts and `data-count-from` figures with
 * happyproto.at/src/scripts/play.ts. Change both together.
 *
 * One deliberate difference. The page's header logo is one <picture> (a dark-scheme
 * source over the light one, chosen by `prefers-color-scheme`), so the
 * browser fetches exactly one file; Storybook switches themes with
 * `data-theme` from its toolbar, which a media query can't see, so the
 * story keeps two logos and shows one, by the story-only rules in
 * storybook-logo.css (the page never ships them).
 */
import { Fragment, type CSSProperties, type ReactNode } from "react";
import {
  crowd,
  cta,
  faq,
  footer,
  header,
  hero,
  parts,
  sentences,
  shortAddress,
  signup,
  softBreaks,
  type Line,
  type NarrowLines,
  type Link,
  type SignupState,
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
const SAMPLE_NOTE = "A reading app on Standard.Site";

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

/** Critique round 10: not yet, a hollow ring at the text's size (the one pending glyph in every window). */
function PendingIcon() {
  return (
    <svg className="mk-pending-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Critique round 10: in progress, the ring half filled. */
function RunningIcon() {
  return (
    <svg className="mk-running-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.75a3.25 3.25 0 0 1 0 6.5z" fill="currentColor" />
    </svg>
  );
}

/**
 * Critique round 10: a step's state mark, the pending ring and the tick in
 * one cell. Pending (before its step lands) the ring shows; landed, and
 * settled, the tick.
 */
function StateMark() {
  return (
    <span className="mk-mark">
      <PendingIcon />
      <OkIcon />
    </span>
  );
}

/** A long value with a <wbr> at each of its soft breaks (content.ts), where a phone may wrap it. */
function Breakable({ text }: { text: string }) {
  return (
    <>
      {softBreaks(text).map((piece, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {piece}
        </Fragment>
      ))}
    </>
  );
}

/** One line's tokens, each a span in its colour; strings may wrap at their soft breaks. */
function SourceText({ line }: { line: Line }) {
  return (
    <span className="mk-src-text">
      {line.map(([kind, text], j) => (
        <span className={`mk-t-${kind}`} key={j}>
          {kind === "str" ? <Breakable text={text} /> : text}
        </span>
      ))}
    </span>
  );
}

/**
 * One line of sample code per item, after a line number (CSS). With
 * `narrow`, its lines `from` to `to` are marked data-wide and its own lines
 * follow them, marked data-narrow: under 30rem CSS shows the narrow ones,
 * wider the wide ones (round 1). Critique round 8: its first `open` lines
 * are there from the start (not steps); `at` is the first step's moment.
 */
function SourceLines({ lines, narrow, at, open = 0 }: { lines: Line[]; narrow?: NarrowLines; at?: number; open?: number }) {
  const wide = (i: number) => narrow !== undefined && i >= narrow.from && i < narrow.to;
  return (
    <ol className="mk-src">
      {lines.map((line, i) => (
        <Fragment key={i}>
          <li className="mk-src-line" data-step={i < open ? undefined : ""} data-at={i === open ? at : undefined} data-wide={wide(i) ? "" : undefined}>
            <SourceText line={line} />
          </li>
          {narrow !== undefined &&
            i === narrow.to - 1 &&
            narrow.lines.map((l, k) => (
              <li className="mk-src-line" data-step="" data-narrow="" key={`n${k}`}>
                <SourceText line={l} />
              </li>
            ))}
        </Fragment>
      ))}
    </ol>
  );
}

/**
 * A type or language tag: `record`, `query`, `procedure`, a script's
 * language (`lang`; `current`, the file's own), a language still to come
 * (`soon`), a member's access (`access`), a policy or client type
 * (`policy`), a status (`running`, `done`).
 */
function Tag({ kind, current, children }: { kind: string; current?: boolean; children: ReactNode }) {
  return (
    <span className="mk-tag" data-kind={kind} data-current={current ? "" : undefined}>
      {children}
    </span>
  );
}

/**
 * A figure that ticks up from `from` to its own value as its panel plays (play.ts); settled, it is just the number.
 * Round 2: `start` and `end` (ms) time its tick on the window's timeline; by default, from its step's landing to the window's end.
 */
function Figure({ value, from, start, end }: { value: number; from: number; start?: number; end?: number }) {
  return (
    <span className="mk-figure" data-count-from={from} data-count-start={start} data-count-end={end}>
      {figure(value)}
    </span>
  );
}

/**
 * A sample window: three dots, the instance's URL, an optional status strip
 * (round 3: in the bar, it was a footer strip) and a `Sample` chip, then
 * its body. One image to assistive technology, named by `name`; its
 * contents are aria-hidden (in case a browser exposes an image's children),
 * so its code is never read line by line, and inert (round 3), so nothing
 * drawn in it (a button, a tab) can be clicked, focused or found. Always dark (data-theme="dark" scopes the dark tokens onto it):
 * the product glows on the light page. A `data-play` panel: it plays once as it comes into view (play.ts), its
 * `data-step` parts arriving one after another; settled without
 * JavaScript, with reduced motion and in print. `gap` (round 2): the ms
 * between one step and the next where a step has no `data-at` of its own.
 * `crumb` (critique round 7): a point panel's lighter bar, a breadcrumb
 * into the instance (mono, muted) in place of the dots and the URL; the
 * hero's stage keeps the full chrome. Its middle parts (`data-mid`) give
 * way on a phone, so the instance and the page stay in view. The `Sample` chip is in every bar.
 */
function Window({ name, className, children, status, gap, crumb }: { name: string; className?: string; children: ReactNode; status?: ReactNode; gap?: number; crumb?: readonly string[] }) {
  return (
    <div className={`mk-window${className ? ` ${className}` : ""}`} role="img" aria-label={name} data-play="" data-play-gap={gap} data-theme="dark">
      <div className="mk-window-content" aria-hidden="true" inert>
        <div className="mk-window-bar">
          {crumb ? (
            <span className="mk-window-crumb">
              {crumb[0]}
              {crumb.slice(1).map((part, i) => (
                <span key={part} className="mk-crumb-part" data-mid={i < crumb.length - 2 ? "" : undefined}>
                  {" › "}
                  {part}
                </span>
              ))}
            </span>
          ) : (
            <>
              <span className="mk-window-dots">
                <span />
                <span />
                <span />
              </span>
              <span className="mk-window-url">{stage.url}</span>
            </>
          )}
          {status}
          <span className="mk-sample">{stage.sample}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---- The hero's product stage ---------------------------------------------------------------

/**
 * A Standard.Site reader (owner round 3) as a HappyView instance shows it:
 * the Lexicons list (each NSID with its type, its script's language (v8:
 * TypeScript), and the record lexicons' finished backfills), and the
 * app's listDocuments query answering 200 with a publication's documents. A status
 * strip (round 3: in the window's bar, it was the footer): Jetstream
 * connected, and the records indexed, a count that ticks up as the stage
 * plays. Full content width under the form;
 * from 48rem the list sits beside the response; below, it gives way to a
 * line of each lexicon's name over the response (round 1; round 4: a plain
 * list line, not tabs), and under
 * 30rem the response shows one record, its long values wrapping at their
 * soft breaks.
 *
 * Round 2: it plays "define your data, query your API" on `stage.play`'s timeline. The
 * lexicons arrive (each list row, or the strip, is a step); the record
 * lexicon's backfill runs through its statuses (a stack, `data-statuses`)
 * while the indexed count ticks; then the request lands, then its 200 (a
 * step of its own), then the records a line at a time. Round 3: the 200 and
 * the response lines are absent (clipped, their room kept) until they
 * arrive, and the request row never moves.
 */
export function Stage() {
  const play = stage.play;
  const last = play.backfill.length - 1;
  return (
    <Window
      name={stage.name}
      className="mk-stage"
      gap={play.gap}
      status={
        <span className="mk-window-status">
          <span className="mk-live">
            <span className="mk-live-dot" />
            {stage.footer.jetstream} · {stage.footer.connected}
          </span>
          <span className="mk-indexed">
            {stage.footer.indexed} <Figure value={stage.footer.count} from={stage.footer.from} start={play.tick[0]} end={play.tick[1]} />
          </span>
        </span>
      }
    >
      <div className="mk-window-body mk-stage-body">
        <div className="mk-stage-side">
          <p className="mk-panel-head">
            <span>{stage.lexicons.title}</span>
            <span className="mk-panel-count">{stage.lexicons.rows.length}</span>
          </p>
          <div className="mk-lexicons">
            {stage.lexicons.rows.map((row, i) => (
              <div className="mk-lexicon" data-step="" data-at={i * play.lexicon} key={row.nsid}>
                <span className="mk-nsid">{row.nsid}</span>
                <span className="mk-tags">
                  <Tag kind={row.type}>{row.type}</Tag>
                  {row.script && <Tag kind="lang">{row.script}</Tag>}
                  {row.playing ? (
                    <span className="mk-lexicon-statuses" data-statuses="">
                      {row.playing.map((label, k) => (
                        <span
                          className="mk-lexicon-meta"
                          data-running={k > 0 ? "" : undefined}
                          data-status-from={k > 0 ? play.backfill[k - 1] : undefined}
                          data-status-to={play.backfill[k]}
                          key={label}
                        >
                          {k > 0 ? <RunningIcon /> : <PendingIcon />}
                          {label}
                        </span>
                      ))}
                      <span className="mk-lexicon-meta" data-done={row.done ? "" : undefined} data-status-from={play.backfill[last]}>
                        {row.done && <OkIcon />}
                        {row.meta}
                      </span>
                    </span>
                  ) : (
                    <span className="mk-lexicon-meta" data-done={row.done ? "" : undefined}>
                      {row.done && <OkIcon />}
                      {row.meta}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <span className="mk-stage-add">
            <svg className="mk-depicted-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {stage.lexicons.add}
          </span>
        </div>
        <div className="mk-stage-main">
          <p className="mk-stage-names" data-step="">
            <span className="mk-stage-names-title">{stage.lexicons.title}</span>
            {stage.lexicons.rows.map((row) => (
              <span className="mk-stage-name" data-current={stage.request.path.endsWith(row.nsid) ? "" : undefined} key={row.nsid}>
                {row.nsid.split(".").pop()}
              </span>
            ))}
          </p>
          <div className="mk-request" data-step="" data-at={play.request}>
            <span className="mk-method">{stage.request.method}</span>
            <span className="mk-path">
              <Breakable text={stage.request.path} />
            </span>
            <span className="mk-http" data-step="" data-at={play.ok}>
              <OkIcon />
              {stage.request.status} {stage.request.statusText}
            </span>
          </div>
          <SourceLines lines={stage.response} narrow={stage.responseNarrow} at={play.response} open={play.open} />
        </div>
      </div>
    </Window>
  );
}

// ---- One point per section: the four sample panels --------------------------------------------

/**
 * 01 · Data: the documents' (site.standard.document) backfill job, in three parts
 * (critique round 6): its head (the title, the collection and a badge), its
 * two working stages in the dashboard's words, and one row of counters.
 * Jetstream, connected, is in the window's bar, as on the hero's stage.
 * The badge is two statuses stacked in one cell: `Running` until the last
 * stage half lands (`data-step-last`, play.ts), then `Completed`, on the
 * frame the counters settle. It plays within moments of coming into view,
 * over about 2.3s (content.ts). Settled, it reads `Completed`.
 */
export function DataPanel() {
  const n = features.data;
  const last = n.job.stages[n.job.stages.length - 1].id;
  return (
    <Window
      name={n.name}
      className="mk-panel"
      crumb={n.crumb}
      status={
        <span className="mk-window-status">
          <span className="mk-live">
            <span className="mk-live-dot" />
            {n.jetstream.label} · {n.jetstream.state}
          </span>
        </span>
      }
    >
      <div className="mk-window-body mk-panel-body mk-job">
        <div className="mk-job-head" data-step="">
          <span className="mk-job-title">{n.job.title}</span>
          <span className="mk-nsid">{n.job.collection}</span>
          <span className="mk-job-status" data-statuses="">
            <span className="mk-tag" data-kind="running" data-status-to={last}>
              <RunningIcon />
              {n.job.status.running}
            </span>
            <span className="mk-tag" data-kind="done" data-status-from={last}>
              <OkIcon />
              {n.job.status.done}
            </span>
          </span>
        </div>
        <ol className="mk-steps">
          {n.job.stages.map((s) => (
            <li className="mk-step" data-step="" data-at={s.at} data-step-last={s.id === last ? "" : undefined} data-stage={s.id} key={s.id}>
              <StateMark />
              <span className="mk-step-label">{s.label}</span>
            </li>
          ))}
        </ol>
        <div className="mk-counters" data-step="" data-at={n.job.countersAt}>
          {n.job.counters.map((c) => (
            <div className="mk-counter" key={c.field}>
              <span className="mk-counter-label">{c.label}</span>
              <span className="mk-counter-value">
                <Figure value={c.value} from={c.from} start={n.job.tickFrom} />
                {c.of !== undefined && <span className="mk-counter-of"> / {figure(c.of)}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

/** A member's or an invite's access: its `read` and `write` flags, each a tag when granted. */
function Access({ read, write }: { read: boolean; write: boolean }) {
  const a = features.spaces.access;
  return (
    <span className="mk-access">
      {read && <Tag kind="access">{a.read}</Tag>}
      {write && <Tag kind="access">{a.write}</Tag>}
    </span>
  );
}

/**
 * 02 · Private data (v8): an atproto space on the instance, as the spaces
 * API describes it. The bar says the feature is on (`atproto spaces ·
 * enabled`, v3's default). The space's head (its display name, its type
 * and key, and its member-list policy); its members, each with their
 * `read` and `write` flags (the creator marked); its one invite (read
 * access, its uses out of its maximum); and a draft document in the space,
 * its at:// URI's `space` segment marked. It acts out the invite once
 * (`features.spaces.play`): the invite's uses tick 0 to 1 and a third
 * member lands with read access only, the members' count ticking 2 to 3,
 * then the record lands. Settled: three members, the invite used once.
 */
export function SpacesPanel() {
  const s = features.spaces;
  const p = s.play;
  return (
    <Window
      name={s.name}
      className="mk-panel"
      crumb={s.crumb}
      gap={p.gap}
      status={
        <span className="mk-window-status">
          <span className="mk-live">
            <span className="mk-live-dot" />
            {s.enabled.label} · {s.enabled.state}
          </span>
        </span>
      }
    >
      <div className="mk-window-body mk-panel-body mk-space">
        <div className="mk-space-head" data-step="">
          <span className="mk-job-title">{s.space.name}</span>
          <span className="mk-nsid">
            {s.space.type} <span className="mk-space-key">· {s.space.skey}</span>
          </span>
          <Tag kind="policy">{s.space.policy}</Tag>
        </div>
        <div className="mk-space-part">
          <p className="mk-panel-head" data-step="" data-at={p.members}>
            <span>{s.members.title}</span>
            <span className="mk-panel-count">
              <Figure value={s.members.rows.length} from={s.members.from} start={p.counted[0]} end={p.counted[1]} />
            </span>
          </p>
          <ul className="mk-members">
            {s.members.rows.map((m) => (
              <li className="mk-member" data-step="" data-at={m.invited ? p.joined : undefined} key={m.did}>
                <span className="mk-nsid">{m.did}</span>
                {m.creator && <span className="mk-member-note">{s.members.creator}</span>}
                <Access read={m.read} write={m.write} />
              </li>
            ))}
          </ul>
        </div>
        <div className="mk-space-part">
          <p className="mk-panel-head" data-step="" data-at={p.invites}>
            <span>{s.invites.title}</span>
          </p>
          <div className="mk-member mk-invite" data-step="">
            <span className="mk-invite-label">{s.invites.label}</span>
            <span className="mk-invite-uses">
              <Figure value={s.invites.uses} from={s.invites.from} start={p.used[0]} end={p.used[1]} /> / {s.invites.maxUses} {s.invites.unit}
            </span>
            <Access read={s.invites.read} write={s.invites.write} />
          </div>
        </div>
        <div className="mk-space-part">
          <p className="mk-panel-head" data-step="" data-at={p.records}>
            <span>{s.records.title}</span>
          </p>
          <div className="mk-space-record" data-step="">
            <span className="mk-space-doc">{s.records.doc}</span>
            <span className="mk-nsid">{s.records.collection}</span>
          </div>
          <p className="mk-space-uri" data-step="">
            <Breakable text={s.records.uri.before} />
            <span className="mk-space-seg">{s.records.uri.segment}</span>
            <Breakable text={s.records.uri.after} />
          </p>
        </div>
      </div>
    </Window>
  );
}

/**
 * 03 · Sign-in (v8): an API client on the instance's API Clients page (its
 * name, its type, its `hvc_` client key, its allowed origin and its
 * scopes), then a sign-in with an atproto handle, drawn (the field and the
 * button are pictures, not controls: the window is inert), and its three
 * steps as the browser SDK takes them, each ticking in turn: the handle
 * resolved to a DID, authorized at the person's own PDS, the session
 * registered. Settled, every step is ticked.
 */
export function SignInPanel() {
  const s = features.signin;
  return (
    <Window name={s.name} className="mk-panel" crumb={s.crumb}>
      <div className="mk-window-body mk-panel-body mk-signin">
        <div className="mk-space-head" data-step="">
          <span className="mk-job-title">{s.client.name}</span>
          <Tag kind="policy">{s.client.type}</Tag>
        </div>
        <dl className="mk-fields">
          {s.client.fields.map((f) => (
            <div className="mk-field" data-step="" key={f.label}>
              <dt>{f.label}</dt>
              <dd className="mk-nsid">{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mk-signin-box" data-step="" data-at={s.play.signIn}>
          <span className="mk-signin-label">{s.signIn.label}</span>
          <span className="mk-signin-row">
            <span className="mk-signin-field">
              <svg className="mk-depicted-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="2.67" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.67 5.33v3.34a2 2 0 0 0 4 0V8a6.67 6.67 0 1 0-2.67 5.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mk-nsid">{s.signIn.handle}</span>
            </span>
            <span className="mk-signin-button">
              {s.signIn.button}
              <svg className="mk-depicted-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2.5 8h11M9.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </div>
        <ol className="mk-steps">
          {s.steps.map((step) => (
            <li className="mk-step" data-step="" data-at={step.at} data-stage={step.id} key={step.id}>
              <StateMark />
              <span className="mk-step-label">{step.label}</span>
              {step.detail && <span className="mk-nsid mk-step-detail">{step.detail}</span>}
            </li>
          ))}
        </ol>
      </div>
    </Window>
  );
}

/**
 * 04 · Your code (v8): the listDocuments handler in TypeScript, against the
 * v3 script contract (`handle(input, ctx)`, the module's default export,
 * reaching `happyview.db` by import), then the languages a handler can be
 * written in: TypeScript (the file's own, marked), JavaScript and Lua
 * today; Rust, Go, Zig and C/C++ outlined in dashes and marked `soon`.
 */
export function CodePanel() {
  const c = features.code;
  return (
    <Window name={c.name} className="mk-panel" crumb={c.crumb}>
      <div className="mk-window-body mk-panel-body">
        <div className="mk-panel-row" data-step="">
          <span className="mk-nsid">{c.file.nsid}</span>
          <span className="mk-tags">
            <Tag kind={c.file.type}>{c.file.type}</Tag>
            <Tag kind="lang">{c.file.lang}</Tag>
          </span>
        </div>
        <SourceLines lines={c.code} />
        <p className="mk-panel-head" data-step="">
          <span>{c.languages.title}</span>
        </p>
        <div className="mk-langs">
          <span className="mk-langs-group" data-step="">
            {c.languages.ready.map((lang) => (
              <Tag kind="lang" current={lang === c.file.lang} key={lang}>
                {lang}
              </Tag>
            ))}
          </span>
          <span className="mk-langs-group" data-step="">
            {c.languages.soon.map((lang) => (
              <Tag kind="soon" key={lang}>
                {lang}
              </Tag>
            ))}
            <span className="mk-langs-note">{c.languages.soonLabel}</span>
          </span>
        </div>
      </div>
    </Window>
  );
}

const PANELS = { data: DataPanel, spaces: SpacesPanel, signin: SignInPanel, code: CodePanel };

/**
 * One point: a headline, one line and its panel. From 64rem the copy takes
 * five columns and the panel seven, side by side, the panel on the right
 * (round 2: no flipped row, so every split falls on the frame's one inner
 * line, at 5/12). Critique round 6: the copy and the panel both start at
 * the cell's top (the label's top on the window's), and the window is as
 * tall as its content. Below, stacked. The copy is not sticky (owner round
 * 2: only the FAQ's heading is).
 */
export function Feature({
  which,
  ground,
  patch,
}: {
  which: keyof typeof features;
  ground?: boolean;
  /** Owner round 1: where this row's honeycomb patch sits (see "patches" in marketing.css); none if omitted. */
  patch?: "low" | "corner";
}) {
  const f = features[which];
  const Panel = PANELS[which];
  return (
    <section
      className="mk-section mk-feature"
      id={f.id}
      aria-labelledby={`${f.id}-title`}
      data-ground={ground ? "surface" : undefined}
      data-patch={patch}
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

// ---- For the atproto crowd --------------------------------------------------------------

/**
 * v8: a short, unnumbered section after the four points, framed like them
 * (a row of the frame, its headline cell beside its content on the inner
 * rail from 64rem) but with no window: four terse items, each a bold label
 * and a few words, in shared-border cells (two by two from 40rem, one
 * column on a phone). Its own row height, not the points' minimum. Owner
 * round 1's margin patch sits on its end rail.
 */
export function Crowd() {
  return (
    <section className="mk-section mk-crowd" id={crowd.id} aria-labelledby={`${crowd.id}-title`} data-patch="margin">
      <div className="mk-container mk-grid mk-crowd-grid mk-cells">
        <div className="mk-section-head mk-cell-head">
          <h2 className="mk-section-title" id={`${crowd.id}-title`}>
            {crowd.title}
          </h2>
        </div>
        <dl className="mk-crowd-list">
          {crowd.items.map((item) => (
            <div className="mk-crowd-item" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
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
 * item. Each item is a `data-reveal` row.
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

/**
 * The hero's credit (round 5), under the form on the status line's reserved
 * lines: the email promise's short form (critique round 10). v8: the
 * promise alone; the maintainer credit and the release count went.
 */
export function HeroCredit() {
  return <p className="mk-hero-credit">{hero.credit.promise}</p>;
}

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

/** The hero's one line of value (v8): what you get. */
export function HeroSub() {
  return <p className="mk-lede">{hero.sub}</p>;
}

/** The H1 (v8): two sentences, each its own line from 40rem (`.mk-title-part`). */
export function HeroTitle() {
  return (
    <h1 className="mk-title" id="hero-title">
      {sentences(hero.title).map((part, i) => (
        <Fragment key={part}>
          {i > 0 && " "}
          <span className="mk-title-part">{part}</span>
        </Fragment>
      ))}
    </h1>
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
              <HeroTitle />
              <HeroSub />
              <div className="mk-hero-signup">
                <SignupBlock id="hero" anchor={hero.anchor} hero />
                <HeroCredit />
              </div>
            </div>
            <div className="mk-stage-wrap">
              <div className="mk-stage-frame">
                <Stage />
              </div>
            </div>
          </div>
        </section>
        <Feature which="data" patch="low" />
        <Feature which="spaces" patch="corner" />
        <Feature which="signin" />
        <Feature which="code" />
        <Crowd />
        <section className="mk-section mk-split" id={faq.anchor} aria-labelledby="faq-title" data-patch="head">
          <div className="mk-container mk-grid mk-split-grid mk-cells">
            <div className="mk-section-head mk-cell-head">
              <h2 className="mk-section-title" id="faq-title">
                {faq.title}
              </h2>
              <p className="mk-section-help">
                <Linked text={faq.help.text} links={faq.help.links} />
              </p>
            </div>
            <Faq />
          </div>
        </section>
        <section className="mk-section mk-cta-section" aria-labelledby="cta-title" data-backdrop="">
          <div className="mk-container mk-cta">
            <h2 className="mk-section-title" id="cta-title">
              {sentences(cta.title).map((part, i) => (
                <Fragment key={part}>
                  {i > 0 && " "}
                  <span className="mk-cta-title-part">{part}</span>
                </Fragment>
              ))}
            </h2>
            <p className="mk-cta-line">{cta.line}</p>
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

/**
 * Reference markup for the happyproto.at landing page.
 *
 * happyproto.at/src/components/*.astro mirror these one to one, with the same
 * elements, classes, attributes and order. SignupForm's markup is a contract
 * with happyproto.at/src/scripts/signup.ts; change both together.
 */
import type { CSSProperties } from "react";
import { cta, faq, footer, handled, header, hero, leadingPunctuation, log, shortAddress, signup, slot, type SignupState } from "./content";
import logoOnLight from "./assets/logotype.dark.svg";
import logoOnDark from "./assets/logotype.light.svg";
import "./marketing.css";

type SignupFormProps = { id: string; state?: SignupState; email?: string };

/** The status line's content for one state, as signup.ts renders it. */
function StatusText({ state, email }: { state: SignupState; email: string }) {
  if (state === "success") {
    const [before, after] = slot(signup.status.success, "email");
    const short = shortAddress(email);
    if (short === email) return <>{before + email + after}</>;
    // Shortened on screen; the full address is still there for screen readers.
    return (
      <>
        {before}
        <span aria-hidden="true">{short}</span>
        <span className="mk-sr-only">{email}</span>
        {after}
      </>
    );
  }
  if (state === "unavailable") {
    const [before, after] = slot(signup.status.unavailable, "link");
    return (
      <>
        {before}
        <a className="mk-link" href={signup.link.href}>
          {signup.link.label}
        </a>
        {after}
      </>
    );
  }
  return <>{signup.status[state]}</>;
}

/** Renders one static state. In the real page, signup.ts drives the transitions. */
export function SignupForm({ id, state = "idle", email = "ada@example.com" }: SignupFormProps) {
  const tone =
    state === "invalid" || state === "unavailable" ? "error" : state === "success" ? "success" : "muted";
  return (
    <form className="mk-signup" data-signup="" data-source={id} data-state={state} noValidate>
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
          defaultValue={state === "invalid" ? "ada@example" : state === "idle" ? undefined : email}
        />
        <button className="mk-signup-submit" type="submit" disabled={state === "submitting"}>
          {signup.button}
        </button>
      </div>
      <div className="mk-signup-trap" aria-hidden="true">
        <label>
          {signup.trapLabel} <input name="hp_trap" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p
        className="mk-signup-status"
        id={`signup-status-${id}`}
        role="status"
        aria-live="polite"
        data-tone={tone}
        tabIndex={-1}
      >
        <StatusText state={state} email={email} />
      </p>
      <button className="mk-text-button" type="button" data-signup-reset="">
        {signup.reset}
      </button>
    </form>
  );
}

export function HandledList() {
  return (
    <dl className="mk-handled">
      {handled.items.map((item) => (
        <div className="mk-handled-item" key={item.term}>
          <dt>{item.term}</dt>
          <dd className="mk-handled-detail">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

/** An answer with an optional `{link}` slot, filled as a real <a>. */
function Answer({ text, link }: { text: string; link?: { label: string; href: string } }) {
  if (!link) return <>{text}</>;
  const [before, after] = slot(text, "link");
  return (
    <>
      {before}
      <a className="mk-link" href={link.href}>
        {link.label}
      </a>
      {after}
    </>
  );
}

export function Faq() {
  return (
    <dl className="mk-faq">
      {faq.items.map((item) => (
        <div className="mk-faq-item" key={item.q}>
          <dt className="mk-faq-q">{item.q}</dt>
          <dd className="mk-faq-a">
            <Answer text={item.a} link={item.link} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function UpgradeLog() {
  return (
    <figure className="mk-panel mk-log" aria-labelledby="log-caption">
      <div className="mk-panel-head">
        <span className="mk-panel-host">{log.host}</span>
      </div>
      <ol className="mk-log-lines">
        {log.lines.map((line, i) => (
          <li className="mk-log-line" data-tone={line.tone} style={{ "--i": i } as CSSProperties} key={line.time}>
            <span className="mk-log-time">{line.time}</span>
            <span className="mk-log-text">
              {line.tone === "ok" && <span className="mk-log-dot" aria-hidden="true" />}
              {line.text}
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="mk-log-caption" id="log-caption">
        {log.caption}
      </figcaption>
    </figure>
  );
}

function ArrowIcon() {
  return (
    <svg className="mk-link-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="mk-header">
      <div className="mk-container mk-header-inner">
        <a className="mk-header-home" href="/">
          <img
            className="mk-logo mk-logo-on-light"
            src={logoOnLight}
            alt={header.logoAlt}
            width={1000}
            height={233}
            loading="lazy"
            decoding="async"
          />
          <img
            className="mk-logo mk-logo-on-dark"
            src={logoOnDark}
            alt={header.logoAlt}
            width={1000}
            height={233}
            loading="lazy"
            decoding="async"
          />
        </a>
        <a className="mk-link" href={header.docs.href}>
          {header.docs.label}
          <ArrowIcon />
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mk-footer">
      <div className="mk-container mk-footer-inner">
        <p>{footer.copyright(new Date().getFullYear())}</p>
        <ul className="mk-footer-links">
          {footer.links.map((link) => (
            <li key={link.href}>
              <a className="mk-link" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

const [ledeBefore, ledeRest] = slot(hero.lede, "host");
// The full stop after the host travels with it, so it never starts a line.
const [ledePunct, ledeAfter] = leadingPunctuation(ledeRest);

/** The whole page, in the order happyproto.at/src/pages/index.astro renders it. */
export function LandingPage() {
  return (
    <div className="mk-page">
      <SiteHeader />
      <main>
        <section className="mk-hero" aria-labelledby="hero-title">
          <div className="mk-container mk-hero-grid">
            <div className="mk-hero-copy">
              <h1 className="mk-title" id="hero-title">
                {hero.title}
              </h1>
              <p className="mk-lede">
                {ledeBefore}
                <span className="mk-host">
                  <code className="mk-code">{hero.host}</code>
                  {ledePunct}
                </span>
                {ledeAfter}
              </p>
              <SignupForm id="hero" />
            </div>
            <UpgradeLog />
          </div>
        </section>
        <section className="mk-section" data-ground="surface" aria-labelledby="handled-title">
          <div className="mk-container">
            <h2 className="mk-section-title" id="handled-title">{handled.title}</h2>
            <HandledList />
          </div>
        </section>
        <section className="mk-section" aria-labelledby="faq-title">
          <div className="mk-container">
            <h2 className="mk-section-title" id="faq-title">{faq.title}</h2>
            <Faq />
          </div>
        </section>
        <section className="mk-section" data-seam="none" aria-labelledby="cta-title">
          <div className="mk-container mk-cta">
            <h2 className="mk-section-title" id="cta-title">{cta.title}</h2>
            <p className="mk-cta-lede">{cta.lede}</p>
            <SignupForm id="footer" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

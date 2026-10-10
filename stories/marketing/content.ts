/**
 * Every word on happyproto.at.
 *
 * This file is the source of truth. happyproto.at/src/content.ts is a verbatim
 * copy: change it here, then copy it over. Claims are limited to what the
 * managed-HappyView spec commits to. See the landing-page spec's "Product
 * claims" section before adding one.
 */

export type SignupState = 'idle' | 'submitting' | 'success' | 'invalid' | 'unavailable'

export const meta = {
  title: 'HappyProto — Managed AppViews for AT Protocol apps',
  description:
    'Sign in with your atproto handle, pick a plan, and get a HappyView instance. Upgrades, isolation and recovery are our job. Join the waitlist.',
  url: 'https://happyproto.at/',
}

export const header = {
  logoAlt: 'HappyProto',
  docs: { label: 'HappyView docs', href: 'https://happyview.dev' },
}

export const hero = {
  // U+00A0 (no-break space) keeps the proper noun "AT Protocol" on one line.
  title: 'Managed AppViews for AT\u00a0Protocol apps.',
  /** `{host}` is rendered as `.mk-code`; split with `slot(hero.lede, 'host')`. */
  lede: 'HappyProto runs HappyView for you. HappyView is an open-source AppView, the server that indexes your atproto app’s records and serves them over XRPC. Sign in with your atproto handle, pick a plan, and get an instance at {host}. Upgrades, isolation and recovery are our job.',
  host: 'your-app.hpy.at',
}

/**
 * `{email}` and `{link}` are slots, filled by the renderer: the address with
 * textContent only, the link as a real <a>. Use `slot()` to split around one.
 * The button label stays the same while submitting; progress is said in the
 * status line. `empty` is the invalid state's message for a blank field.
 */
export const signup = {
  label: 'Email address',
  placeholder: 'you@example.com',
  button: 'Join the waitlist',
  reset: 'Use a different address',
  trapLabel: 'Leave this empty',
  noscript: 'JavaScript is needed to join the waitlist.',
  link: { label: '@happyproto.at', href: 'https://bsky.app/profile/happyproto.at' },
  status: {
    idle: 'One email when we open, nothing else.',
    submitting: 'Adding you to the waitlist…',
    success: 'You’re on the waitlist. We’ll email {email} once, when HappyProto opens.',
    invalid: 'That doesn’t look like an email address. Check it has an @ and a domain.',
    unavailable: 'Couldn’t save that. Try again in a moment, or follow {link} for news.',
    empty: 'Enter your email address.',
  } satisfies Record<SignupState | 'empty', string>,
}

/** Splits leading punctuation off `text`, so it can stay on the line of whatever precedes it. */
export function leadingPunctuation(text: string): [string, string] {
  const punct = /^[.,;:!?…]*/.exec(text)![0]
  return [punct, text.slice(punct.length)]
}

/** Addresses longer than this are shortened on screen; the full one is kept for screen readers. */
export const ADDRESS_MAX = 64

/** The on-screen form of an address: in full up to ADDRESS_MAX, else the first 32 and last 24 characters. */
export function shortAddress(email: string): string {
  return email.length > ADDRESS_MAX ? `${email.slice(0, 32)}…${email.slice(-24)}` : email
}

/** Splits a template around `{name}`: the text before it and the text after it. */
export function slot(template: string, name: string): [string, string] {
  const marker = `{${name}}`
  const at = template.indexOf(marker)
  if (at === -1) return [template, '']
  return [template.slice(0, at), template.slice(at + marker.length)]
}

/** An illustrative event log: what an upgrade that goes wrong looks like from the customer's side. */
export const log = {
  host: 'your-app.hpy.at',
  caption: 'Illustrative: what an upgrade that goes wrong looks like from your side.',
  lines: [
    { time: '14:02:11', text: 'Upgrade to 2.15.0 started' },
    { time: '14:02:12', text: 'Snapshot taken' },
    { time: '14:02:41', text: 'Health check failed', tone: 'attention' },
    { time: '14:02:43', text: 'Rolled back to 2.14.0' },
    { time: '14:02:44', text: 'Running. Nothing for you to do.', tone: 'ok' },
  ] as { time: string; text: string; tone?: 'attention' | 'ok' }[],
}

export const handled = {
  title: 'What’s handled for you',
  items: [
    { term: 'Upgrades roll back on their own', detail: 'Every upgrade is snapshotted first. If the new version fails its health check, the instance goes back to the old one automatically.' },
    { term: 'Crashes restart themselves', detail: 'A crashed instance, or one whose configuration has drifted, is restored in about a minute.' },
    { term: 'Isolated by default', detail: 'Each instance gets its own database, network and resource limits.' },
    { term: 'Deleted instances can be restored', detail: 'For seven days after you delete one.' },
    { term: 'Everything HappyView does', detail: 'Lua scripts, WASM plugins, backfill and OAuth work the same as when you self-host.' },
  ],
}

/** An answer may carry a `{link}` slot, filled by `link` as a real <a>. */
export const faq = {
  title: 'Before you join',
  items: [
    { q: 'What is HappyView?', a: 'An open-source AppView server: upload lexicon schemas and get XRPC endpoints, OAuth, real-time sync and backfill without writing server code. It stays free to self-host; HappyProto is for people who would rather not run it.' },
    { q: 'How much will it cost?', a: 'A flat monthly plan with included usage, metered beyond that, and a spend cap you control. Prices will be published before launch.' },
    { q: 'When does it open?', a: 'No date yet. Invited testers come first, then everyone on the waitlist.' },
    { q: 'Are backups included?', a: 'Backups are planned as an optional add-on. Without them, an instance’s data lives only on its disk.' },
    { q: 'Can I use my own domain?', a: 'Not yet. Custom domains are planned.' },
    {
      q: 'What happens to my email?',
      a: 'We store it to send one launch email, and we don’t share it. To have it deleted, message {link} on Bluesky.',
      link: { label: '@happyproto.at', href: 'https://bsky.app/profile/happyproto.at' },
    },
  ] as { q: string; a: string; link?: { label: string; href: string } }[],
}

export const cta = {
  title: 'Hear when it opens',
  /** Pays off the log's last line; no new claim. */
  lede: 'We’d like your next failed upgrade to end like the one above: running, with nothing for you to do.',
}

export const footer = {
  copyright: (year: number) => `© ${year} HappyProto`,
  links: [
    { label: 'HappyView on GitHub', href: 'https://github.com/gamesgamesgamesgamesgames/happyview' },
    { label: 'HappyView docs', href: 'https://happyview.dev' },
    { label: '@happyproto.at on Bluesky', href: 'https://bsky.app/profile/happyproto.at' },
  ],
}

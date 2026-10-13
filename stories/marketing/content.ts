/**
 * Every word on happyproto.at.
 *
 * This file is the source of truth. happyproto.at/src/content.ts is a verbatim
 * copy: change it here, then copy it over. Claims are limited to what the
 * managed-HappyView spec commits to, plus HappyView facts that can be checked
 * on happyview.dev or in its repository, and the owner-confirmed facts in the
 * v2 build spec (from the maintainer of HappyView, delaying upgrades,
 * testers from the waitlist, the $10 a month target, moving a self-hosted
 * instance). See that spec and the v4 hybrid brief before adding one.
 *
 * v5 (show it, don't say it), one point per section, like a slide deck:
 * the hero (a status pill, "HappyView, hosted.", one line, the form and the
 * product stage, a sample HappyView view built in HTML); then three
 * sections, each a big headline, one short line and one `Sample` panel that
 * proves it; then the table, the FAQ and the close. Each fact is said once:
 * the host `your-app.hpy.at` only in the hero's sub; the $10 target only in
 * the FAQ, written "$10 a month"; each gap (backups, custom domains, an
 * export tool) only in the FAQ's "What isn’t ready yet?". Sample panels show
 * only what HappyView really does, as documented on happyview.dev: no
 * customer names, no performance, uptime or latency figures.
 *
 * The voice is the product's (v3): the subject is HappyProto, HappyView or
 * "you". No "I", "me", "my", "we", "us" or "our" anywhere: not in the copy,
 * the meta, alt text or accessible names. The FAQ's questions are the one
 * exception, being in the reader's voice ("Can I leave?"). Nothing implies a
 * team, and no person is named.
 *
 * v7 (the infrastructure look): each section, and the hero's stage, has an
 * `eyebrow`: a small mono label above its headline (above the stage in the
 * hero), its number and its subject. Labels, not claims. They are
 * aria-hidden on the page, so they add nothing to a heading's or a
 * landmark's name.
 *
 * `{name}` in a string is a slot, filled by the renderer: a link from the
 * string's `links`, an address, or a hostname as code.
 */

export type SignupState = 'idle' | 'submitting' | 'success' | 'invalid' | 'unavailable'

/** What the status line can say: a form state, or one of the invalid state's other messages. */
export type SignupMessage = SignupState | 'empty' | 'noAt' | 'domain' | 'rejected'

export type Link = { label: string; href: string }

const REPO = 'https://github.com/gamesgamesgamesgamesgames/happyview'
const RELEASES = `${REPO}/releases`
const DOCS = 'https://happyview.dev'
const BLUESKY = { label: '@happyproto.at', href: 'https://bsky.app/profile/happyproto.at' }
const TUTORIAL = { label: 'Statusphere tutorial', href: 'https://happyview.dev/tutorials/statusphere' }
const HOST = 'your-app.hpy.at'

export const meta = {
  title: 'HappyProto: HappyView, hosted',
  description:
    'Upload your lexicons. Get an AppView at your-app.hpy.at, run for you by HappyProto, from the maintainer of HappyView.',
  url: 'https://happyproto.at/',
  image: {
    url: 'https://happyproto.at/og.png',
    width: 1200,
    height: 630,
    alt: 'HappyView, hosted. Under it, a sample HappyView instance at statusphere.hpy.at: three lexicons, and a listStatuses query returning recent statuses.',
  },
}

export const header = {
  logoAlt: 'HappyProto',
  nav: 'Primary',
  /** Visually hidden until focused; lands on <main id="main" tabindex="-1">. Works without JavaScript. */
  skip: { label: 'Skip to content', href: '#main' },
  faq: { label: 'FAQ', href: '#faq' },
  /**
   * A primary button (the form buttons' style), before FAQ, so FAQ is always at the far
   * right. Moves focus to the nearer form's email field: the hero's, until
   * the reader is past the midpoint between the two forms, then the closing
   * one's (`href` follows). Its slot is always held,
   * but it shows only while neither form is in view (counting the part under
   * the sticky header as out of view), and not after a join; hidden without
   * JavaScript, like the form. The logo, this and FAQ share one row from
   * 320px. Its accessible
   * name starts with the visible label (WCAG 2.5.3) and says where it goes.
   */
  join: { label: 'Join the beta', name: 'Join the beta: go to the signup form', href: '#join' },
}

export const hero = {
  /** Above the H1: a small DS chip, the status said in four words. "Beta" is its tag. */
  pill: { tag: 'Beta', text: 'not open yet' },
  /** The page's one H1, at the display size: the product, said in three words. */
  title: 'HappyView, hosted.',
  /**
   * The one line of value (8 words). `{host}` is rendered as `.mk-code` and
   * never breaks; the full stop travels with it.
   */
  sub: 'Upload your lexicons. Get an AppView at {host}.',
  host: HOST,
  /** The hero form's id, so the page can be linked to it. */
  anchor: 'join',
  /** The hero form's accessible name (a form landmark). The hero form has no helper: its status line is empty at rest. */
  formName: 'Join the beta',
}

/**
 * A piece of sample code or UI text with its colour: `key` and `kw` in the
 * accent, `str` in the second accent's ink, `punc` and `num` (line numbers)
 * muted, `emoji` in its own colours, `plain` in the ink.
 */
export type TokenKind = 'key' | 'str' | 'punc' | 'kw' | 'emoji' | 'plain'
export type Token = [TokenKind, string]
/** One line of sample code: its tokens, in order (its indent is a `plain` token). */
export type Line = Token[]

/** The sample statuses in the hero's listStatuses response. Partial DIDs and record keys: no real account is named. */
const STATUSES = [
  { did: 'did:plc:4hm…', rkey: '3m3kq…', status: '🦋', createdAt: '2026-10-13T09:41:07Z' },
  { did: 'did:plc:q2x…', rkey: '3m3kn…', status: '☕\uFE0F', createdAt: '2026-10-13T09:38:52Z' },
  { did: 'did:plc:z7c…', rkey: '3m3kf…', status: '🌻', createdAt: '2026-10-13T09:30:15Z' },
]

/** The listStatuses response as lines of tokens, in the shape HappyView's XRPC API documents for a list query: `records` (each `uri`, `status`, `createdAt`), then `cursor`. */
function responseLines(): Line[] {
  const lines: Line[] = [[['punc', '{']], [['plain', '  '], ['key', '"records"'], ['punc', ': [']]]
  STATUSES.forEach((r, i) => {
    lines.push(
      [['plain', '    '], ['punc', '{']],
      [['plain', '      '], ['key', '"uri"'], ['punc', ': '], ['str', `"at://${r.did}/xyz.statusphere.status/${r.rkey}"`], ['punc', ',']],
      [['plain', '      '], ['key', '"status"'], ['punc', ': '], ['str', '"'], ['emoji', r.status], ['str', '"'], ['punc', ',']],
      [['plain', '      '], ['key', '"createdAt"'], ['punc', ': '], ['str', `"${r.createdAt}"`]],
      [['plain', '    '], ['punc', i === STATUSES.length - 1 ? '}' : '},']],
    )
  })
  lines.push([['plain', '  '], ['punc', '],']], [['plain', '  '], ['key', '"cursor"'], ['punc', ': '], ['str', '"MjAyNi0xMC0xM1Qw…"']], [['punc', '}']])
  return lines
}

/**
 * The hero's product stage: a sample HappyView instance, built in HTML (not a
 * screenshot), in a window with three dots, a URL and a `Sample` chip. The
 * Statusphere example from the HappyView docs: its three lexicons (the
 * dashboard's Lexicons list shows each one's NSID, its type and whether a Lua
 * script is attached; a record lexicon is backfilled), and the listStatuses
 * query answering 200 with recent statuses. A footer strip: Jetstream
 * connected (HappyView logs `jetstream.connected`) and the records indexed
 * (`total_records` in the admin stats), a count that ticks up as the stage
 * plays; it sits inside the Sample window and implies no real figure.
 *
 * The whole stage is one image to assistive technology (`role="img"`, named
 * by `name`): its code is never read out line by line.
 */
export const stage = {
  eyebrow: '01 · Endpoints',
  name: 'Sample HappyView instance at statusphere.hpy.at: three lexicons, and a listStatuses query returning recent statuses.',
  url: 'statusphere.hpy.at',
  sample: 'Sample',
  lexicons: {
    title: 'Lexicons',
    rows: [
      { nsid: 'xyz.statusphere.status', type: 'record', lua: false, meta: 'Backfill complete', done: true },
      { nsid: 'xyz.statusphere.listStatuses', type: 'query', lua: true, meta: 'GET', done: false },
      { nsid: 'xyz.statusphere.setStatus', type: 'procedure', lua: true, meta: 'POST', done: false },
    ] as { nsid: string; type: 'record' | 'query' | 'procedure'; lua: boolean; meta: string; done: boolean }[],
    lua: 'Lua',
    add: 'Add Lexicon',
  },
  request: { method: 'GET', path: '/xrpc/xyz.statusphere.listStatuses', status: '200', statusText: 'OK' },
  response: responseLines(),
  footer: {
    jetstream: 'Jetstream',
    connected: 'connected',
    indexed: 'Records indexed',
    /** The count the stage settles on, and where its tick starts. Same number of digits, so it never reflows. */
    count: 1284,
    from: 1180,
  },
}

/** A number as the panels write it: thousands apart by commas ("1,284"). */
export function figure(n: number): string {
  return n.toLocaleString('en-US')
}

/**
 * The three sections after the hero, one point each: a big headline (six
 * words or fewer), one short line (fifteen or fewer) and one `Sample` panel
 * that proves it, in the hero stage's window. Each panel is one image to
 * assistive technology (`role="img"`, named by its `name`). Panels and lines
 * show only documented HappyView behaviour.
 */
export const features = {
  /**
   * Sources (happyview.dev, guides/backfill.md and admin/backfill.md): a
   * record lexicon joins the Jetstream subscription and starts a backfill
   * job. A job's `stage` is `pending`, `discovering_repos`,
   * `resolving_and_fetching`, then `completed`; its counters are
   * `total_repos`, `processed_repos` and `total_records`. The dashboard
   * names the phases "Discovering repos", "Resolving PDS" and "Fetching
   * records". The numbers are a sample.
   */
  network: {
    id: 'network',
    eyebrow: '02 · Indexing',
    title: 'Indexed from the network',
    line: 'Jetstream and backfill are connected for you.',
    name: 'Sample backfill job for xyz.statusphere.status: Jetstream connected, and every stage from discovering repos to completed done.',
    jetstream: { label: 'Jetstream', state: 'connected', filter: 'xyz.statusphere.status' },
    job: {
      title: 'Backfill',
      collection: 'xyz.statusphere.status',
      status: 'completed',
      stages: [
        { id: 'discovering_repos', label: 'Discovering repos' },
        { id: 'resolving_and_fetching', label: 'Resolving PDS, fetching records' },
        { id: 'completed', label: 'Completed' },
      ],
      counters: [
        { field: 'processed_repos', label: 'Repos', value: 412, from: 0, of: 412 },
        { field: 'total_records', label: 'Records', value: 1190, from: 0 },
      ] as { field: string; label: string; value: number; from: number; of?: number }[],
    },
  },
  /**
   * Sources (happyview.dev at v2.16.0, the release HappyProto runs: the Lua
   * scripting guide and the database API): a query script defines `handle()`
   * and reads the `collection` and `params` globals; `db.query` returns
   * `{ records, cursor }`. Auth plugins are WASM, and Steam is one of the
   * official ones (the plugins guide). Owner claims list: Lua scripts and
   * WASM plugins work as they do when self-hosting.
   */
  plugins: {
    id: 'plugins',
    eyebrow: '03 · Plugins',
    title: 'Lua and WASM plugins',
    line: 'Your scripts and plugins work the same as self-hosted.',
    name: 'Sample Lua script for xyz.statusphere.listStatuses, which pages through statuses with db.query, beside an installed WASM auth plugin for Steam.',
    file: { nsid: 'xyz.statusphere.listStatuses', type: 'query', lang: 'Lua' },
    code: [
      [['kw', 'function'], ['plain', ' '], ['key', 'handle'], ['punc', '()']],
      [['plain', '  '], ['kw', 'return'], ['plain', ' db.query'], ['punc', '({']],
      [['plain', '    collection = collection'], ['punc', ',']],
      [['plain', '    limit = '], ['kw', 'tonumber'], ['punc', '('], ['plain', 'params.limit'], ['punc', ') '], ['kw', 'or'], ['plain', ' 20'], ['punc', ',']],
      [['plain', '    cursor = params.cursor'], ['punc', ',']],
      [['plain', '  '], ['punc', '})']],
      [['kw', 'end']],
    ] as Line[],
    plugins: {
      title: 'Plugins',
      rows: [{ name: 'steam', kind: 'auth', runtime: 'WASM', state: 'Installed' }],
    },
  },
  /**
   * Sources (spec claims list and owner facts): a snapshot before every
   * upgrade, and an upgrade can be held until you're ready. The versions are
   * real HappyView releases (2.15.0, then 2.16.0 on 2026-10-02).
   */
  upgrades: {
    id: 'upgrades',
    eyebrow: '04 · Upgrades',
    title: 'Upgrades on your schedule',
    line: 'Snapshotted first, or held until you’re ready.',
    name: 'Sample upgrade from HappyView 2.15.0 to 2.16.0: snapshot taken, with the choice to install now or hold.',
    product: 'HappyView',
    running: { label: 'Running', version: '2.15.0' },
    available: { label: 'Available', version: '2.16.0' },
    snapshot: 'Snapshot taken',
    install: 'Install now',
    hold: 'Hold',
  },
}

/**
 * The credential line: one small muted row, centred under the hero's stage,
 * the only place the credential is said. Items are apart by space and hairlines. The first says
 * where it comes from, in plain text, with no name and no link. The release
 * count links to the releases it counts, with the external-link icon.
 */
export const credentials = {
  items: ['From the maintainer of HappyView', 'MIT-licensed'],
  /**
   * The release count, derived when the page is built (it rebuilds daily):
   * every stable `vX.Y.Z` release published since `since`, floored to a ten
   * (`{count}` is "60" for 62, and the label adds the plus). Read from `api`,
   * a page of 100 at a time. If GitHub can't be read, `fallback` stands in
   * (62 stable releases from v1.0.0, 2026-02-13, to v2.16.0, 2026-10-02,
   * checked 2026-10-07).
   */
  releases: {
    label: '{count}+ releases since February 2026',
    since: '2026-02-01',
    fallback: 60,
    href: RELEASES,
    api: 'https://api.github.com/repos/gamesgamesgamesgamesgames/happyview/releases?per_page=100',
  },
}

/**
 * `total` stable releases floored to a ten ("60" for 62), or the fallback
 * when the count couldn't be read (or is under ten, too few to floor).
 */
export function releaseFloor(total: number | null | undefined): string {
  return String(typeof total === 'number' && Number.isFinite(total) && total >= 10 ? Math.floor(total / 10) * 10 : credentials.releases.fallback)
}

/** The credential line's release count ("60+ releases since February 2026" for 62). */
export function releaseCount(total: number | null | undefined): string {
  return credentials.releases.label.replace('{count}', releaseFloor(total))
}

/**
 * `{email}` and `{bluesky}` are slots, filled by the renderer: the address
 * with textContent only, the link as a real <a>. The button label stays the
 * same while submitting; progress is said in the status line. `empty`, `noAt`
 * and `domain` are the invalid state's messages for a blank field, an address
 * with no @, and one whose part after the @ can't be a domain; `invalid`
 * covers everything else the page itself catches (spaces, a bad part before
 * the @). `rejected` is the server turning down an address the page let
 * through (code 22023), with a way to get in touch.
 */
export const signup = {
  label: 'Email address',
  placeholder: 'you@example.com',
  /**
   * The follow-up, shown only after a successful join: an optional note sent
   * with the same address. `join_waitlist()` attaches it to the existing row.
   */
  note: {
    label: 'What are you building?',
    optional: '(optional, 280 characters)',
    /** Under the label: why it's worth writing. The note is described by it. */
    hint: 'Every note is read.',
    /** join_waitlist() clamps to the same length. */
    max: 280,
    button: 'Send',
    sending: 'Sending…',
    sent: 'Got it, thanks.',
    unavailable: 'Your note didn’t save. Try again in a minute.',
  },
  button: 'Join the beta',
  reset: 'Sign up another address',
  trapLabel: 'Leave this empty',
  /** Shown under each form when JavaScript is off. */
  noscript: 'The form needs JavaScript. You can follow {bluesky} on Bluesky for launch news instead.',
  links: { bluesky: BLUESKY },
  /**
   * After a join: a heading, which takes focus (the status line, a live
   * region, says the rest). Together they read "You’re on the waitlist.
   * An email goes to {email} when HappyProto opens."
   */
  joined: 'You’re on the waitlist.',
  /**
   * The one next step after a join, once per form: under the follow-up
   * (so under "You’re on the waitlist." while the note is unsent or
   * skipped, and right under "Got it, thanks." once it is sent).
   */
  next: { text: 'While you wait: try the {tutorial}.', links: { tutorial: TUTORIAL } },
  /**
   * `idle` is the closing form's helper, under the button. The hero form has
   * none: its status line is empty at rest.
   */
  status: {
    idle: 'One email when it opens, or a beta invite sooner.',
    submitting: 'Adding you to the waitlist…',
    success: 'An email goes to {email} when HappyProto opens.',
    invalid: 'Check the address for typos.',
    rejected: 'That address couldn’t be accepted. Check it for typos, or message {bluesky} on Bluesky.',
    unavailable: 'Your address didn’t save. It’s safe to try again, or message {bluesky} on Bluesky.',
    empty: 'Enter your email address.',
    noAt: 'Add an @ and a domain, like you@example.com.',
    domain: 'Check the part after the @, like example.com.',
  } satisfies Record<SignupMessage, string>,
}

/** One piece of a template: plain text, or the name of a `{slot}`. */
export type Part = string | { slot: string }

/** Splits a template into text and `{slot}` names, in order. */
export function parts(template: string): Part[] {
  return template
    .split(/(\{\w+\})/)
    .filter((piece) => piece !== '')
    .map((piece) => (/^\{\w+\}$/.test(piece) ? { slot: piece.slice(1, -1) } : piece))
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

/** The marks in a comparison cell: `CHECK` is drawn as a tick and read "Yes"; `CROSS` as a cross, read "No, you run it". */
export const CHECK = '✓'
export const CROSS = '✗'

/**
 * What HappyProto runs for you, one message: what you don't have to run.
 * Every row is a job; every cell is a mark, never words. HappyProto's cell
 * is a tick in every row; the self-hosted cell is a tick only where it is
 * the same software (the last row). HappyProto's column comes before the
 * self-hosted one in the markup and on screen at every width; it is a
 * table at every width (three short columns fit at 320px). No lede.
 *
 * Sources: "Server, database and TLS": each instance has its own database,
 * network and resource limits (spec claims list). "Jetstream and backfill":
 * an instance's record lexicons join the Jetstream filter and start a
 * backfill (happyview.dev). "Snapshot before every upgrade" (spec claims
 * list). "Restarted within about a minute" (spec claims list). The last
 * row: Lua scripts, WASM plugins and OAuth work as they do when
 * self-hosting (spec claims list).
 */
export const compare = {
  eyebrow: '05 · Compare',
  title: 'What HappyProto runs for you',
  columns: { what: 'What', hosted: 'HappyProto', self: 'Self-hosted' },
  marks: {
    [CHECK]: { label: 'Yes' },
    [CROSS]: { label: 'No, you run it' },
  } as Record<string, { label: string }>,
  rows: [
    { what: 'Server, database and TLS set up', hosted: CHECK, self: CROSS },
    { what: 'Jetstream and backfill kept running', hosted: CHECK, self: CROSS },
    { what: 'Snapshot before every upgrade', hosted: CHECK, self: CROSS },
    { what: 'Restarted within about a minute of a crash', hosted: CHECK, self: CROSS },
    { what: 'Lua, WASM plugins and OAuth', hosted: CHECK, self: CHECK },
  ],
}

/**
 * Short answers, in the v4 brief's order (unchanged in v5). The questions are in the reader's
 * voice. Answers carry `{slots}` filled from their `links`. Every item has a
 * stable `id`, so it can be linked: each question ends in a small `#`
 * permalink to its own item (`permalink`; its accessible name is `label`
 * with the question in its `{q}`, so each name says where it goes on its
 * own: WCAG 2.4.9, AAA). Where the device can hover, it is out of sight
 * until the item is hovered, the link is focused or the item is the page's
 * target; on touch it always shows, in the muted ink. One column at every
 * width, one item per row, apart by hairlines; from 64rem it sits beside
 * its heading.
 */
export const faq = {
  eyebrow: '06 · FAQ',
  title: 'FAQ',
  anchor: 'faq',
  permalink: { text: '#', label: 'Link to this question: {q}' },
  items: [
    {
      id: 'cost',
      q: 'What will it cost?',
      a: 'The smallest plan is targeted at $10 a month, with usage included and a spend cap you set. Final prices come before launch.',
    },
    {
      id: 'not-ready',
      q: 'What isn’t ready yet?',
      a: 'An opening date, final prices, custom domains, an export tool and backups (a planned add-on).',
    },
    {
      id: 'move',
      q: 'Can I move my self-hosted instance?',
      a: 'Yes.',
    },
    {
      id: 'leave',
      q: 'Can I leave?',
      a: 'Yes. HappyView is MIT-licensed, and your users’ records live on their own PDSes.',
    },
    {
      id: 'email',
      q: 'What happens to my email?',
      a: 'One email when HappyProto opens, or a beta invite sooner. It’s never shared. To have it deleted, message {bluesky} on Bluesky.',
      links: { bluesky: BLUESKY },
    },
  ] as { id: string; q: string; a: string; links?: Record<string, Link> }[],
}

/**
 * The close, on the raised ground, centred like the hero: the H1's words
 * again as its heading, and the closing form with its own helper. Nothing
 * else. Its section is not a
 * named region (its heading repeats the hero's, and two regions may not
 * share a name); the form in it is the named landmark.
 */
export const cta = {
  title: 'HappyView, hosted.',
  /** The closing form's id. */
  anchor: 'signup',
  /** The closing form's accessible name (a form landmark), told apart from the hero's. */
  formName: 'Join the beta (end of page)',
}

/** Every footer link is off-site, so every one carries the external-link icon. */
export const footer = {
  copyright: '© HappyProto',
  links: [
    { label: 'HappyView on GitHub', href: REPO },
    { label: 'HappyView docs', href: DOCS },
    { label: '@happyproto.at on Bluesky', href: BLUESKY.href },
  ] as Link[],
}

/**
 * The page head's <noscript><style>. Without the script there is nowhere to
 * post: hide each form, with its status line (the note after each form
 * says why) and the header link that leads to a form. The scroll reveal
 * and the panels' play need nothing: their pending states only apply under
 * `html.js-motion`, which only the head script sets. !important because the bundled stylesheet comes after it.
 */
export const noscriptCss = '.mk-signup, .mk-header-join { display: none !important; }'
